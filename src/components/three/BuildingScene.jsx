import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Grid, Html } from '@react-three/drei';
import * as THREE from 'three';
import { PLAN, TIMELINE, wallToBox, wallToDrawSegments } from './housePlan';

const clamp01 = (value) => Math.min(1, Math.max(0, value));
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

/** Altura a la que flotan las etiquetas de los recintos. */
const LABEL_HEIGHT = PLAN.wallHeight * 0.62;

function Model({ active, reducedMotion, replayToken }) {
  const elapsed = useRef(0);
  const activeRef = useRef(active);
  const wallRefs = useRef([]);
  const linesRef = useRef(null);
  const labelRefs = useRef([]);

  // El avance se acumula solo mientras la sección está a la vista: así la
  // animación queda en pausa real cuando el usuario hace scroll a otra parte.
  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    elapsed.current = 0;
  }, [replayToken]);

  /* ---------------------------------------------------------------- muros */

  const walls = useMemo(
    () =>
      PLAN.walls.map((segment) => {
        const box = wallToBox(segment, PLAN.wallThickness);

        // La geometría se desplaza para que su origen quede en la base: así
        // scale.y la hace crecer hacia arriba en vez de hacia ambos lados.
        const geometry = new THREE.BoxGeometry(box.length, PLAN.wallHeight, PLAN.wallThickness);
        geometry.translate(0, PLAN.wallHeight / 2, 0);

        return { ...box, geometry, edges: new THREE.EdgesGeometry(geometry) };
      }),
    []
  );

  useEffect(
    () => () => {
      walls.forEach((wall) => {
        wall.geometry.dispose();
        wall.edges.dispose();
      });
    },
    [walls]
  );

  /* ------------------------------------------------------- trazado del plano */

  const lineGeometry = useMemo(() => {
    const positions = [];

    // Los muros se subdividen para que el trazado avance de forma continua:
    // drawRange de three.js revela vértices, no fracciones de recta.
    for (const segment of PLAN.walls) {
      const points = wallToDrawSegments(segment);
      for (let i = 0; i < points.length; i += 2) {
        positions.push(points[i], 0.004, points[i + 1]);
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.userData.totalVertices = positions.length / 3;
    return geometry;
  }, []);

  useEffect(() => () => lineGeometry.dispose(), [lineGeometry]);

  /* ------------------------------------------------------------ animación */

  useFrame((_, delta) => {
    if (!activeRef.current) return;

    // Con "reducir movimiento" activado se salta directo al estado final.
    if (!reducedMotion) elapsed.current += delta;
    const time = reducedMotion ? 999 : elapsed.current;

    // Fase 1 — se traza el plano
    const drawProgress = easeOutCubic(clamp01(time / TIMELINE.draw));
    const lineCount = Math.floor((lineGeometry.userData.totalVertices * drawProgress) / 2) * 2;

    if (linesRef.current) {
      linesRef.current.geometry.setDrawRange(0, lineCount);
    }

    // Fase 2 — los muros se levantan, escalonados
    const raiseTotal = TIMELINE.raise + TIMELINE.stagger * (walls.length - 1);

    for (let i = 0; i < walls.length; i++) {
      const mesh = wallRefs.current[i];
      if (!mesh) continue;

      const start = TIMELINE.raiseStart + i * TIMELINE.stagger;
      const progress = clamp01((time - start) / TIMELINE.raise);
      const scale = easeOutCubic(progress);

      mesh.visible = progress > 0;
      mesh.scale.y = Math.max(scale, 0.0001);
    }

    // El plano se desvanece mientras los muros ocupan su lugar.
    if (linesRef.current) {
      const raiseProgress = clamp01((time - TIMELINE.raiseStart) / raiseTotal);
      linesRef.current.material.opacity = 0.95 - 0.75 * raiseProgress;
    }

    // Fase 3 — nombres de los recintos
    const labelProgress = easeOutCubic(clamp01((time - TIMELINE.labelsStart) / TIMELINE.labels));
    for (const element of labelRefs.current) {
      if (element) element.style.opacity = labelProgress;
    }
  });

  /* ---------------------------------------------------------------- render */

  return (
    <group>
      {/* Base tipo maqueta */}
      <mesh position={[PLAN.width / 2, -PLAN.baseThickness / 2, PLAN.depth / 2]} receiveShadow>
        <boxGeometry
          args={[
            PLAN.width + PLAN.baseMargin * 2,
            PLAN.baseThickness,
            PLAN.depth + PLAN.baseMargin * 2,
          ]}
        />
        <meshStandardMaterial color="#eef2f7" roughness={0.95} metalness={0} />
      </mesh>

      {/* Plano trazado en el suelo */}
      <lineSegments ref={linesRef} geometry={lineGeometry}>
        <lineBasicMaterial color="#2563eb" transparent opacity={0.95} />
      </lineSegments>

      {/* Muros */}
      {walls.map((wall, index) => (
        <mesh
          key={index}
          ref={(element) => {
            wallRefs.current[index] = element;
          }}
          geometry={wall.geometry}
          position={wall.position}
          rotation-y={wall.rotationY}
          scale-y={0.0001}
          visible={false}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color="#ffffff" roughness={0.82} metalness={0} />
          {/* Aristas marcadas: le da el aspecto de modelo técnico */}
          <lineSegments geometry={wall.edges}>
            <lineBasicMaterial color="#93c5fd" transparent opacity={0.85} />
          </lineSegments>
        </mesh>
      ))}

      {/* Recintos */}
      {PLAN.rooms.map((room, index) => (
        <Html
          key={room.name}
          position={[room.x, LABEL_HEIGHT, room.z]}
          center
          zIndexRange={[30, 0]}
          style={{ pointerEvents: 'none' }}
        >
          <div
            ref={(element) => {
              labelRefs.current[index] = element;
            }}
            style={{ opacity: 0 }}
            className="whitespace-nowrap rounded-full border border-surface-200 bg-white/95 px-2.5 py-1 text-center shadow-sm"
          >
            <span className="block text-[11px] font-semibold leading-tight text-primary-800">
              {room.name}
            </span>
            <span className="block text-[10px] leading-tight text-primary-500">{room.area}</span>
          </div>
        </Html>
      ))}

      {/* Retícula de dibujo */}
      <Grid
        position={[PLAN.width / 2, -PLAN.baseThickness - 0.02, PLAN.depth / 2]}
        args={[40, 40]}
        cellSize={0.5}
        cellThickness={0.6}
        cellColor="#e2e8f0"
        sectionSize={2}
        sectionThickness={1}
        sectionColor="#cbd5e1"
        fadeDistance={30}
        fadeStrength={1.5}
        infiniteGrid={false}
      />
    </group>
  );
}

function Lights() {
  return (
    <>
      {/*
        three.js aplica un factor 1/π al calcular la luz difusa, así que las
        intensidades útiles son bastante más altas de lo que parece: con valores
        "normales" (1-2) el modelo sale gris. Con estos, las caras iluminadas
        quedan blancas y las que miran al lado opuesto en torno al 45% de gris.
      */}
      <ambientLight intensity={1} />
      <hemisphereLight args={['#ffffff', '#dbeafe', 0.9]} />
      <directionalLight
        position={[10, 16, 6]}
        intensity={2.8}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-16}
        shadow-camera-right={16}
        shadow-camera-top={16}
        shadow-camera-bottom={-16}
        shadow-camera-near={1}
        shadow-camera-far={50}
        shadow-bias={-0.0006}
        shadow-normalBias={0.02}
      />
    </>
  );
}

function Controls({ enabled }) {
  const [autoRotate, setAutoRotate] = useState(true);
  const idleTimer = useRef(null);

  // OrbitControls pone touch-action:"none" en el canvas, lo que secuestraría el
  // scroll vertical en el móvil. La regla .scene-canvas de index.css lo revierte
  // (con !important, porque es un estilo inline). Ver esa regla para el detalle.
  const handleStart = useCallback(() => {
    setAutoRotate(false);
    clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => setAutoRotate(true), 6000);
  }, []);

  useEffect(() => () => clearTimeout(idleTimer.current), []);

  return (
    <OrbitControls
      makeDefault
      target={[PLAN.width / 2, PLAN.wallHeight * 0.5, PLAN.depth / 2]}
      enablePan={false}
      // Sin zoom a propósito: la rueda del ratón debe seguir haciendo scroll
      // en la página, no acercar el modelo.
      enableZoom={false}
      enableDamping
      dampingFactor={0.08}
      rotateSpeed={0.5}
      minPolarAngle={0.45}
      maxPolarAngle={Math.PI / 2.12}
      autoRotate={autoRotate && enabled}
      autoRotateSpeed={0.45}
      onStart={handleStart}
    />
  );
}

export default function BuildingScene({ active = true, reducedMotion = false, replayToken = 0, onReady }) {
  // Avisa al padre de que el visor existe de verdad: así la pista de "arrastra
  // para girar" no se muestra si el chunk del 3D no llega a cargar.
  useEffect(() => {
    onReady?.();
  }, [onReady]);

  return (
    <Canvas
      className="scene-canvas"
      // "never" detiene por completo el render cuando la sección no se ve.
      frameloop={active ? 'always' : 'never'}
      dpr={[1, 1.75]}
      flat
      shadows
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      camera={{ position: [16, 19.5, 16.5], fov: 32, near: 0.5, far: 160 }}
    >
      <Lights />
      <Model active={active} reducedMotion={reducedMotion} replayToken={replayToken} />
      <Controls enabled={!reducedMotion} />
    </Canvas>
  );
}
