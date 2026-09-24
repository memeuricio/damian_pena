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
import {
  OTHER_SCALE,
  OTHER_TINT,
  RADIUS,
  SELECTED_LIFT,
  SELECTED_SCALE,
  carouselBounds,
  carouselTargets,
} from './carouselLayout';

/** Rapidez con la que las piezas alcanzan su posición. */
const DAMPING = 9;

/** Velocidad de giro de la maqueta que está al frente, en radianes por segundo. */
const SPIN_SPEED = 0.26;

/** Rapidez con la que el giro arranca y se detiene. */
const SPIN_DAMPING = 3.5;

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

const clamp01 = (value) => Math.min(1, Math.max(0, value));

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
  step,
  rotationRef,
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
  const tint = useRef(target.selected ? 1 : OTHER_TINT);
  const spinFactor = useRef(0);

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

    /**
     * Énfasis: cuán cerca está la pieza del frente. Se mide sobre su ángulo real
     * (el de reposo más el giro del grupo), así que al arrastrar la que va
     * llegando al centro crece de forma continua, y al soltar no hay salto:
     * el grupo se asienta con esta misma amortiguación.
     */
    const worldAngle = target.angle + rotationRef.current;
    const proximity = clamp01(1 - Math.abs(worldAngle) / (step || 1));
    const emphasis = proximity * proximity * (3 - 2 * proximity); // smoothstep

    const targetScale =
      OTHER_SCALE + (SELECTED_SCALE - OTHER_SCALE) * emphasis + (hovered ? 0.05 : 0);
    const targetY = SELECTED_LIFT * emphasis + (hovered ? 0.05 : 0);
    const targetTint = OTHER_TINT + (1 - OTHER_TINT) * emphasis;

    node.position.x += (target.x - node.position.x) * k;
    node.position.y += (targetY - node.position.y) * k;
    node.position.z += (target.z - node.position.z) * k;
    node.rotation.y += (target.angle - node.rotation.y) * k;

    const scale = node.scale.x + (targetScale - node.scale.x) * k;
    node.scale.setScalar(scale);

    // El giro de la maqueta sigue al énfasis: arranca y se detiene solo.
    spinFactor.current +=
      (emphasis - spinFactor.current) * (reducedMotion ? 1 : 1 - Math.exp(-SPIN_DAMPING * delta));

    if (spinner.current) {
      spinner.current.rotation.y += SPIN_SPEED * spinFactor.current * delta;
    }

    // Atenuación de las piezas que no están al frente
    tint.current += (targetTint - tint.current) * k;
    const { current: list } = materials;
    const { current: colors } = originalColors;
    for (let i = 0; i < list.length; i++) {
      list[i].color.copy(colors[i]).multiplyScalar(tint.current);
    }

    if (glowMaterial.current) {
      glowMaterial.current.opacity += (emphasis - glowMaterial.current.opacity) * k;
    }
  });

  return (
    <group
      ref={group}
      position={[target.x, target.selected ? SELECTED_LIFT : 0, target.z]}
      rotation-y={target.angle}
      scale={target.selected ? SELECTED_SCALE : OTHER_SCALE}
    >
      {/* Halo de la maqueta que está al frente */}
      <mesh position={[0, 0.42, -0.3]} scale={[1.35, 1.35, 1]}>
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
      <mesh position={[0, -0.062, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[1.1, 0.95, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={shadowTexture} transparent opacity={0.7} depthWrite={false} toneMapped={false} />
      </mesh>

      {/* Peana */}
      <mesh position={[0, -0.03, 0]} receiveShadow>
        <boxGeometry args={[0.9, 0.055, 0.76]} />
        <meshStandardMaterial color="#e8eef6" roughness={0.92} metalness={0} />
      </mesh>

      {/* Maqueta giratoria */}
      <group ref={spinner} rotation-y={index * 0.8} scale={0.72}>
        <ProjectModel model={project.model} />
      </group>

      {/* Placa con el título, siempre de cara al espectador */}
      <mesh position={[0, -0.37, 0.2]}>
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
        <boxGeometry args={[1.05, 1.6, 0.95]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} colorWrite={false} />
      </mesh>
    </group>
  );
}

/* ----------------------------------------------------------- grupo giratorio */

function Turntable({ dragRef, rotationRef, children }) {
  const group = useRef(null);

  useFrame((_, delta) => {
    if (!group.current) return;

    const live = dragRef.current;

    if (live === null || live === undefined) {
      /**
       * Al soltar, el giro no se resetea de golpe: se asienta con la MISMA
       * amortiguación que usan las piezas para recolocarse. Como ambos van a la
       * par, la posición resultante se mantiene continua y no hay salto.
       */
      const k = 1 - Math.exp(-DAMPING * delta);
      rotationRef.current += (0 - rotationRef.current) * k;
    } else {
      // Durante el arrastre sigue al puntero 1:1, sin retardo.
      rotationRef.current = live;
    }

    group.current.rotation.y = rotationRef.current;
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

function Scene({
  projects,
  selectedIndex,
  narrow,
  step,
  onSelect,
  onHoverChange,
  dragRef,
  draggingRef,
  reducedMotion,
}) {
  const gl = useThree((state) => state.gl);
  const [hovered, setHovered] = useState(null);

  // Giro real del grupo: lo escribe Turntable y lo leen las piezas para saber
  // cuán cerca están del frente.
  const rotationRef = useRef(0);

  const handleHover = (index) => {
    setHovered(index);
    onHoverChange?.(index !== null);
  };

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

      <Turntable dragRef={dragRef} rotationRef={rotationRef}>
        {projects.map((project, index) => (
          <Item
            key={project.id}
            index={index}
            project={project}
            plaqueTexture={textures.plaques[index]}
            glowTexture={textures.glow}
            shadowTexture={textures.shadow}
            target={targets[index]}
            step={step}
            rotationRef={rotationRef}
            onSelect={onSelect}
            draggingRef={draggingRef}
            hovered={hovered === index}
            setHovered={handleHover}
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
  narrow = false,
  step = 0,
  onSelect,
  onHoverChange,
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
        narrow={narrow}
        step={step}
        onSelect={onSelect}
        onHoverChange={onHoverChange}
        dragRef={dragRef}
        draggingRef={draggingRef}
        reducedMotion={reducedMotion}
      />
    </Canvas>
  );
}
