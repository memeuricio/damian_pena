import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import {
  PLAQUE_HEIGHT,
  PLAQUE_WIDTH,
  GLOW_STOPS,
  SHADOW_STOPS,
  createPlaqueCanvas,
  createRadialCanvas,
} from './projectIcons';
import ProjectModel from './projectModels';
import { RADIUS, carouselBounds, carouselTargets } from './carouselLayout';

/** Rapidez con la que las tarjetas alcanzan su posición. */
const DAMPING = 9;

/** Velocidad de giro de cada maqueta, en radianes por segundo. */
const SPIN_SPEED = 0.42;

/**
 * Configuración de cámara estable a nivel de módulo: si este objeto se creara
 * dentro del componente, React lo haría de nuevo en cada render y R3F volvería a
 * aplicar la posición inicial, pisando el encuadre calculado.
 */
const CAMERA_CONFIG = {
  position: [0, 1.2, 6],
  fov: 42,
  near: 0.1,
  far: 60,
};

/* --------------------------------------------------------------- utilidades */

function createTexture(canvas, anisotropy) {
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = anisotropy;
  texture.needsUpdate = true;
  return texture;
}

/* -------------------------------------------------------------------- item */

function Item({
  project,
  plaqueTexture,
  glowTexture,
  shadowTexture,
  target,
  index,
  onSelect,
  draggingRef,
  hovered,
  setHovered,
  reducedMotion,
}) {
  const group = useRef(null);
  const spinner = useRef(null);
  const glowMaterial = useRef(null);
  const materials = useRef([]);
  const originalColors = useRef([]);
  const tint = useRef(target.tint);

  /**
   * Los materiales se recogen una sola vez, después de montar, para atenuar la
   * maqueta sin recorrer el árbol entero en cada fotograma. Se guarda también su
   * color original: la atenuación multiplica sobre él, así el azul de las aristas
   * se oscurece en vez de volverse gris.
   */
  useEffect(() => {
    const found = [];
    group.current?.traverse((child) => {
      if (child.material?.color) found.push(child.material);
    });
    materials.current = found;
    originalColors.current = found.map((material) => material.color.clone());
  }, []);

  useFrame((_, delta) => {
    const node = group.current;
    if (!node) return;

    // Interpolación exponencial: independiente de los fotogramas por segundo.
    const k = reducedMotion ? 1 : 1 - Math.exp(-DAMPING * delta);

    const targetScale = hovered && !target.selected ? target.scale * 1.08 : target.scale;
    const targetY = hovered && !target.selected ? target.y + 0.08 : target.y;

    node.position.x += (target.x - node.position.x) * k;
    node.position.y += (targetY - node.position.y) * k;
    node.position.z += (target.z - node.position.z) * k;
    node.rotation.y += (target.angle - node.rotation.y) * k;

    const scale = node.scale.x + (targetScale - node.scale.x) * k;
    node.scale.setScalar(scale);

    // Giro continuo de la maqueta, en desfase para que no giren todas igual.
    if (spinner.current && !reducedMotion) {
      spinner.current.rotation.y += SPIN_SPEED * delta;
    }

    // Atenuación de las no seleccionadas
    tint.current += (target.tint - tint.current) * k;
    const { current: list } = materials;
    const { current: colors } = originalColors;
    for (let i = 0; i < list.length; i++) {
      list[i].color.copy(colors[i]).multiplyScalar(tint.current);
    }

    if (glowMaterial.current) {
      glowMaterial.current.opacity += (target.glow - glowMaterial.current.opacity) * k;
    }
  });

  return (
    <group
      ref={group}
      position={[target.x, target.y, target.z]}
      rotation-y={target.angle}
      scale={target.scale}
    >
      {/* Halo de la maqueta seleccionada, centrado detrás de ella */}
      <mesh position={[0, 0.5, -0.35]} scale={[1.55, 1.55, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          ref={glowMaterial}
          map={glowTexture}
          transparent
          opacity={0}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* Sombra de contacto, para que la maqueta no parezca flotar */}
      <mesh position={[0, -0.068, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[1.25, 1.05, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={shadowTexture} transparent opacity={0.7} depthWrite={false} toneMapped={false} />
      </mesh>

      {/* Peana */}
      <mesh position={[0, -0.03, 0]} receiveShadow>
        <boxGeometry args={[1.0, 0.06, 0.85]} />
        <meshStandardMaterial color="#e8eef6" roughness={0.92} metalness={0} />
      </mesh>

      {/* Maqueta giratoria */}
      <group ref={spinner} rotation-y={index * 0.8} scale={0.8}>
        <ProjectModel model={project.model} />
      </group>

      {/* Placa con el título, siempre de cara al espectador */}
      <mesh position={[0, -0.4, 0.22]}>
        <planeGeometry args={[PLAQUE_WIDTH, PLAQUE_HEIGHT]} />
        <meshBasicMaterial map={plaqueTexture} transparent toneMapped={false} />
      </mesh>

      {/* Zona de clic: invisible, pero recibe el puntero en toda la pieza */}
      <mesh
        position={[0, 0.35, 0]}
        onClick={(event) => {
          event.stopPropagation();
          // Si se venía arrastrando, el clic no cuenta como selección.
          if (draggingRef?.current) return;
          onSelect(index);
        }}
        onPointerOver={(event) => {
          event.stopPropagation();
          setHovered(index);
        }}
        onPointerOut={() => setHovered(null)}
      >
        <boxGeometry args={[1.3, 1.9, 1.1]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} colorWrite={false} />
      </mesh>
    </group>
  );
}

/* ----------------------------------------------------------- grupo giratorio */

function Turntable({ dragRef, children }) {
  const group = useRef(null);

  useFrame(() => {
    if (!group.current) return;
    // El grupo gira sobre el centro de la circunferencia, que está en (0, 0, -RADIUS).
    group.current.rotation.y = dragRef.current ?? 0;
  });

  return (
    <group ref={group} position={[0, 0, -RADIUS]}>
      {children}
    </group>
  );
}

/* ------------------------------------------------------------------- cámara */

function ResponsiveCamera({ halfWidth, halfHeight, lookAtY }) {
  const camera = useThree((state) => state.camera);
  const size = useThree((state) => state.size);

  const distance = useMemo(() => {
    const aspect = Math.max(size.width, 1) / Math.max(size.height, 1);
    const tanHalfFov = Math.tan((camera.fov * Math.PI) / 360);

    // La distancia necesaria para que quepa tanto el ancho como el alto.
    const forWidth = halfWidth / (tanHalfFov * aspect);
    const forHeight = halfHeight / tanHalfFov;
    return Math.max(forWidth, forHeight);
  }, [camera.fov, size.width, size.height, halfWidth, halfHeight]);

  /**
   * Se aplica en cada fotograma a propósito: con un useEffect, R3F volvía a
   * aplicar la posición inicial de la cámara y el encuadre se perdía.
   */
  useFrame(() => {
    camera.position.set(0, 1.2, distance);
    camera.lookAt(0, lookAtY, 0);
  });

  return null;
}

/* -------------------------------------------------------------------- escena */

function Scene({ projects, selectedIndex, onSelect, dragRef, draggingRef, reducedMotion }) {
  const size = useThree((state) => state.size);
  const gl = useThree((state) => state.gl);
  const [hovered, setHovered] = useState(null);

  const narrow = size.width / size.height < 1.6;

  const targets = useMemo(
    () => carouselTargets(projects.length, selectedIndex, narrow),
    [projects.length, selectedIndex, narrow]
  );

  const bounds = useMemo(
    () => carouselBounds(projects.length, narrow),
    [projects.length, narrow]
  );

  const textures = useMemo(() => {
    const anisotropy = gl.capabilities.getMaxAnisotropy();
    return {
      plaques: projects.map((project) =>
        createTexture(createPlaqueCanvas(project), anisotropy)
      ),
      glow: createTexture(createRadialCanvas(GLOW_STOPS), anisotropy),
      shadow: createTexture(createRadialCanvas(SHADOW_STOPS), anisotropy),
    };
  }, [projects, gl]);

  useEffect(
    () => () => {
      textures.plaques.forEach((texture) => texture.dispose());
      textures.glow.dispose();
      textures.shadow.dispose();
    },
    [textures]
  );

  return (
    <>
      <ResponsiveCamera
        halfWidth={bounds.halfWidth}
        halfHeight={bounds.halfHeight}
        lookAtY={bounds.lookAtY}
      />

      {/*
        Intensidades altas a propósito: three.js aplica un factor 1/π a la luz
        difusa, así que con valores "normales" la maqueta blanca sale gris.
        Es la misma iluminación que la sección "Del plano a la obra".
      */}
      <ambientLight intensity={1} />
      <hemisphereLight args={['#ffffff', '#dbeafe', 0.9]} />
      <directionalLight position={[6, 12, 8]} intensity={2.8} />
      <directionalLight position={[-8, 6, -4]} intensity={0.9} />

      <Turntable dragRef={dragRef}>
        {projects.map((project, index) => (
          <Item
            key={project.id}
            index={index}
            project={project}
            plaqueTexture={textures.plaques[index]}
            glowTexture={textures.glow}
            shadowTexture={textures.shadow}
            target={targets[index]}
            onSelect={onSelect}
            draggingRef={draggingRef}
            hovered={hovered === index}
            setHovered={setHovered}
            reducedMotion={reducedMotion}
          />
        ))}
      </Turntable>
    </>
  );
}

export default function ProjectCarouselScene({
  projects,
  selectedIndex,
  onSelect,
  active = true,
  reducedMotion = false,
  dragRef,
  draggingRef,
  onReady,
}) {
  // Avisa al padre cuando la escena está realmente montada (y no solo pedida).
  useEffect(() => {
    onReady?.();
  }, [onReady]);

  return (
    <Canvas
      className="scene-canvas"
      frameloop={active ? 'always' : 'never'}
      dpr={[1, 2]}
      flat
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      camera={CAMERA_CONFIG}
    >
      <Scene
        projects={projects}
        selectedIndex={selectedIndex}
        onSelect={onSelect}
        dragRef={dragRef}
        draggingRef={draggingRef}
        reducedMotion={reducedMotion}
      />
    </Canvas>
  );
}
