import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import {
  CARD_WIDTH,
  CARD_HEIGHT,
  GLOW_STOPS,
  SHADOW_STOPS,
  createCardCanvas,
  createRadialCanvas,
} from './projectIcons';
import { RADIUS, carouselBounds, carouselTargets } from './carouselLayout';

/** Rapidez con la que las tarjetas alcanzan su posición. */
const DAMPING = 9;

/**
 * Configuración de cámara estable a nivel de módulo: si este objeto se creara
 * dentro del componente, React lo reharía en cada render, R3F volvería a aplicar
 * la posición inicial y pisaría el encuadre calculado en ResponsiveCamera.
 */
const CAMERA_CONFIG = {
  position: [0, 0.75, 6],
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

/* ----------------------------------------------------------------- tarjeta */

function Card({ texture, glowTexture, shadowTexture, target, index, onSelect, draggingRef, hovered, setHovered, reducedMotion }) {
  const group = useRef(null);
  const cardMaterial = useRef(null);
  const glowMaterial = useRef(null);
  const shadowMaterial = useRef(null);

  useFrame((_, delta) => {
    const node = group.current;
    if (!node) return;

    // Interpolación exponencial: independiente de los fotogramas por segundo.
    // Con "reducir movimiento" el factor es altísimo, así que el cambio es seco.
    const k = reducedMotion ? 1 : 1 - Math.exp(-DAMPING * delta);

    // Al pasar el ratón, la tarjeta se insinúa aunque no esté seleccionada.
    const targetScale = hovered && !target.selected ? target.scale * 1.05 : target.scale;
    const targetOpacity = hovered ? Math.max(target.opacity, 0.82) : target.opacity;
    const targetY = hovered && !target.selected ? target.y + 0.06 : target.y;

    node.position.x += (target.x - node.position.x) * k;
    node.position.y += (targetY - node.position.y) * k;
    node.position.z += (target.z - node.position.z) * k;
    node.rotation.y += (target.angle - node.rotation.y) * k;

    const scale = node.scale.x + (targetScale - node.scale.x) * k;
    node.scale.setScalar(scale);

    if (cardMaterial.current) {
      cardMaterial.current.opacity += (targetOpacity - cardMaterial.current.opacity) * k;
      const tint = cardMaterial.current.color.r + (target.tint - cardMaterial.current.color.r) * k;
      cardMaterial.current.color.setScalar(tint);
    }
    if (glowMaterial.current) {
      glowMaterial.current.opacity += (target.glow - glowMaterial.current.opacity) * k;
    }
    if (shadowMaterial.current) {
      shadowMaterial.current.opacity += (target.shadow - shadowMaterial.current.opacity) * k;
    }
  });

  return (
    <group
      ref={group}
      position={[target.x, target.y, target.z]}
      rotation-y={target.angle}
      scale={target.scale}
    >
      {/* Sombra */}
      <mesh position={[0, -0.12, -0.02]} scale={[CARD_WIDTH * 1.5, CARD_HEIGHT * 1.15, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          ref={shadowMaterial}
          map={shadowTexture}
          transparent
          opacity={0}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* Halo de la tarjeta seleccionada */}
      <mesh position={[0, 0, -0.01]} scale={[CARD_WIDTH * 1.9, CARD_HEIGHT * 1.5, 1]}>
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

      {/* Tarjeta */}
      <mesh
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
        <planeGeometry args={[CARD_WIDTH, CARD_HEIGHT]} />
        {/* Sin luces a propósito: las tarjetas son interfaz, no geometría. Así el
            color del diseño llega exacto y la escena no necesita iluminación. */}
        <meshBasicMaterial
          ref={cardMaterial}
          map={texture}
          transparent
          opacity={0}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------- grupo giratorio */

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

function ResponsiveCamera({ halfWidth, halfHeight }) {
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
   * Se aplica en cada fotograma a propósito. Con un useEffect, R3F volvía a
   * aplicar la posición inicial de la cámara y el encuadre calculado se perdía.
   */
  useFrame(() => {
    camera.position.set(0, 0.75, distance);
    camera.lookAt(0, 0.05, 0);
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
      cards: projects.map((project) =>
        createTexture(createCardCanvas(project), anisotropy)
      ),
      glow: createTexture(createRadialCanvas(GLOW_STOPS), anisotropy),
      shadow: createTexture(createRadialCanvas(SHADOW_STOPS), anisotropy),
    };
  }, [projects, gl]);

  useEffect(
    () => () => {
      textures.cards.forEach((texture) => texture.dispose());
      textures.glow.dispose();
      textures.shadow.dispose();
    },
    [textures]
  );

  return (
    <>
      <ResponsiveCamera halfWidth={bounds.halfWidth} halfHeight={bounds.halfHeight} />

      <Turntable dragRef={dragRef}>
        {projects.map((project, index) => (
          <Card
            key={project.id}
            index={index}
            texture={textures.cards[index]}
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
