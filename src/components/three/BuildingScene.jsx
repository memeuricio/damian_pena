import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Grid, Html } from "@react-three/drei";
import * as THREE from "three";
import {
  PLAN,
  PLOT_DEPTH,
  TIMELINE,
  openingsByWall,
  solidWallPieces,
  wallToBox,
  wallToDrawSegments,
} from "./housePlan";

const clamp01 = (value) => Math.min(1, Math.max(0, value));
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

/** Altura a la que flotan las etiquetas de los recintos. */
const LABEL_HEIGHT = PLAN.wallHeight * 0.62;

/** Altura de las etiquetas del patio: más bajas, porque no hay muros. */
const PATIO_LABEL_HEIGHT = 0.75;

/** Elementos del patio que llevan etiqueta (los árboles y la reja se reconocen solos). */
const PATIO_LABELS = PLAN.patio.elements.filter((element) => element.name);

/** Árbol de maqueta: tronco fino y copa facetada. */
function Tree({ radius }) {
  return (
    <>
      <mesh position={[0, 0.28, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.07, 0.56, 8]} />
        <meshStandardMaterial color="#a9b7ca" roughness={0.9} metalness={0} />
      </mesh>
      <mesh position={[0, 0.56 + radius * 0.72, 0]} castShadow>
        <icosahedronGeometry args={[radius, 0]} />
        <meshStandardMaterial
          color="#8fc4a3"
          roughness={0.85}
          metalness={0}
          flatShading
        />
      </mesh>
    </>
  );
}

/** Quincho: cubierta sobre pilares y un mesón con parrilla. */
function Quincho({ width, depth }) {
  const height = 1.62;
  const post = 0.08;

  const posts = [
    { key: "frente-izq", sx: -1, sz: -1, height: 2 },
    { key: "frente-der", sx: 1, sz: -1, height: 2 },
    { key: "atras-izq", sx: -1, sz: 1, height: 1.3 },
    { key: "atras-der", sx: 1, sz: 1, height: 1.3 },
  ];

  return (
    <>
      <mesh
        position={[0, height, 0]}
        rotation={[0.3, 0, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[width, 0.07, depth]} />
        <meshStandardMaterial
          color="#ffffff"
          roughness={0.85}
          metalness={0.5}
        />
      </mesh>

      {posts.map(({ key, sx, sz, height: postHeight }) => (
        <mesh
          key={key}
          position={[
            sx * (width / 2 - post),
            postHeight / 2,
            sz * (depth / 2 - post),
          ]}
          castShadow
        >
          <boxGeometry args={[post, postHeight, post]} />
          <meshStandardMaterial
            color="#ffffff"
            roughness={0.85}
            metalness={0}
          />
        </mesh>
      ))}

      <mesh position={[0.5, 0.3, -depth * -0.25]} castShadow>
        <boxGeometry args={[width * 0.55, 0.6, depth * 0.32]} />
        <meshStandardMaterial color="#e8eef6" roughness={0.9} metalness={0} />
      </mesh>

      <mesh position={[0.5, 0.5, -depth * -0.25]} rotation={[1,0,0]} castShadow>
        <boxGeometry args={[1 , 0.2, 1]} />
        <meshStandardMaterial color="#e8eef6" roughness={0.9} metalness={0} />
      </mesh>
    </>
  );
}

/** Etiqueta del plano, compartida por los recintos y el patio. */
function PlanLabel({ position, name, detail, register }) {
  return (
    <Html
      position={position}
      center
      zIndexRange={[30, 0]}
      style={{ pointerEvents: "none" }}
    >
      <div
        ref={register}
        style={{ opacity: 0 }}
        className="whitespace-nowrap rounded-full border border-black/10 bg-panel/95 px-2.5 py-1 text-center shadow-sm"
      >
        <span className="block text-[11px] font-semibold leading-tight text-primary-800">
          {name}
        </span>
        {detail && (
          <span className="block text-[10px] leading-tight text-primary-600">
            {detail}
          </span>
        )}
      </div>
    </Html>
  );
}

function Model({ active, reducedMotion, replayToken }) {
  const elapsed = useRef(0);
  const activeRef = useRef(active);
  const itemRefs = useRef([]);
  const linesRef = useRef(null);
  const labelRefs = useRef([]);
  const patioRefs = useRef([]);

  // El avance se acumula solo mientras la sección está a la vista: así la
  // animación queda en pausa real cuando el usuario hace scroll a otra parte.
  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    elapsed.current = 0;
  }, [replayToken]);

  /* ---------------------------------------------------------------- muros */

  // Cada muro se parte por sus aberturas: un muro con puerta o ventana pasa a
  // tener varios tramos sólidos que se levantan a la vez (mismo escalón).
  const wallGroups = useMemo(
    () =>
      solidWallPieces().map((pieces) =>
        pieces.map((piece) => {
          const box = wallToBox(piece, PLAN.wallThickness);

          // La geometría se desplaza para que su origen quede en la base: así
          // scale.y la hace crecer hacia arriba en vez de hacia ambos lados.
          const geometry = new THREE.BoxGeometry(
            box.length,
            PLAN.wallHeight,
            PLAN.wallThickness,
          );
          geometry.translate(0, PLAN.wallHeight / 2, 0);

          return { ...box, geometry, edges: new THREE.EdgesGeometry(geometry) };
        }),
      ),
    [],
  );

  // Antepechos y vidrios de las ventanas. Las puertas quedan como hueco vacío.
  const openingItems = useMemo(() => {
    const items = [];
    const byWall = openingsByWall();

    PLAN.walls.forEach((segment, wallIndex) => {
      const rotationY = wallToBox(segment, PLAN.wallThickness).rotationY;

      for (const opening of byWall[wallIndex]) {
        if (opening.type !== "window") continue;

        const gapLength = Math.hypot(
          opening.x2 - opening.x1,
          opening.z2 - opening.z1,
        );
        const midX = (opening.x1 + opening.x2) / 2;
        const midZ = (opening.z1 + opening.z2) / 2;

        // Un pelín más corto que el hueco para no pelear con los extremos de
        // los muros (que se alargan media pared por lado).
        const width = Math.max(gapLength - PLAN.wallThickness - 0.02, 0.01);

        const baseGeometry = new THREE.BoxGeometry(
          width,
          PLAN.windowSill,
          PLAN.wallThickness,
        );
        baseGeometry.translate(0, PLAN.windowSill / 2, 0);

        const glassHeight = PLAN.wallHeight - PLAN.windowSill;
        const glassGeometry = new THREE.BoxGeometry(
          width,
          glassHeight,
          PLAN.wallThickness * 0.65,
        );
        // El vidrio arranca un poco por debajo del antepecho para que las caras
        // coincidentes no hagan z-fighting con la cara superior del antepecho.
        glassGeometry.translate(0, PLAN.windowSill - 0.02 + glassHeight / 2, 0);

        items.push(
          {
            wallIndex,
            kind: "sill",
            position: [midX, 0, midZ],
            rotationY,
            geometry: baseGeometry,
            edges: new THREE.EdgesGeometry(baseGeometry),
          },
          {
            wallIndex,
            kind: "glass",
            position: [midX, 0, midZ],
            rotationY,
            geometry: glassGeometry,
            edges: new THREE.EdgesGeometry(glassGeometry),
          },
        );
      }
    });

    return items;
  }, []);

  // Lista plana de piezas a renderizar, con el índice de su muro para el escalón.
  const renderItems = useMemo(() => {
    const items = [];
    wallGroups.forEach((group, wallIndex) => {
      group.forEach((item) => items.push({ ...item, wallIndex }));
    });
    openingItems.forEach((item) => items.push(item));
    return items;
  }, [wallGroups, openingItems]);

  // Índices de las piezas de cada muro, para levantarlas con el mismo escalón.
  const wallItemIndices = useMemo(() => {
    const map = {};
    renderItems.forEach((item, index) => {
      if (!map[item.wallIndex]) map[item.wallIndex] = [];
      map[item.wallIndex].push(index);
    });
    return map;
  }, [renderItems]);

  const geometries = useMemo(
    () => renderItems.flatMap((item) => [item.geometry, item.edges]),
    [renderItems],
  );

  useEffect(
    () => () => {
      geometries.forEach((geometry) => geometry.dispose());
    },
    [geometries],
  );

  /* ------------------------------------------------------- trazado del plano */

  const lineGeometry = useMemo(() => {
    const positions = [];

    // Los muros se subdividen para que el trazado avance de forma continua:
    // drawRange de three.js revela vértices, no fracciones de recta. Los huecos
    // de puertas y ventanas no aportan vértices, así que el plano no los cruza.
    for (const pieces of solidWallPieces()) {
      for (const piece of pieces) {
        const points = wallToDrawSegments(piece);
        for (let i = 0; i < points.length; i += 2) {
          positions.push(points[i], 0.004, points[i + 1]);
        }
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3),
    );
    geometry.userData.totalVertices = positions.length / 3;
    return geometry;
  }, []);

  useEffect(() => () => lineGeometry.dispose(), [lineGeometry]);

  /* ---------------------------------------------------------------- patio */

  /**
   * Reja perimetral del patio: dos travesaños y los postes de cada tramo.
   * Las geometrías se construyen una sola vez y se levantan al final, con las
   * etiquetas, para que la casa siga siendo la protagonista de la animación.
   */
  const fenceItems = useMemo(() => {
    const items = [];
    const { fenceWalls, fenceHeight, fencePostStep } = PLAN.patio;

    for (const [x1, z1, x2, z2] of fenceWalls) {
      const dx = x2 - x1;
      const dz = z2 - z1;
      const length = Math.hypot(dx, dz);
      const rotationY = Math.atan2(-dz, dx);

      for (const height of [fenceHeight * 0.3, fenceHeight * 0.92]) {
        const geometry = new THREE.BoxGeometry(length, 0.045, 0.045);
        geometry.translate(0, height, 0);
        items.push({
          kind: "rail",
          geometry,
          position: [(x1 + x2) / 2, 0, (z1 + z2) / 2],
          rotationY,
        });
      }

      const posts = Math.max(2, Math.round(length / fencePostStep));
      for (let i = 0; i <= posts; i++) {
        const t = i / posts;
        const geometry = new THREE.BoxGeometry(0.07, fenceHeight, 0.07);
        geometry.translate(0, fenceHeight / 2, 0);
        items.push({
          kind: "post",
          geometry,
          position: [x1 + dx * t, 0, z1 + dz * t],
          rotationY: 0,
        });
      }
    }

    return items;
  }, []);

  useEffect(
    () => () => {
      fenceItems.forEach((item) => item.geometry.dispose());
    },
    [fenceItems],
  );

  /* ------------------------------------------------------------ animación */

  useFrame((_, delta) => {
    if (!activeRef.current) return;

    // Con "reducir movimiento" activado se salta directo al estado final.
    if (!reducedMotion) elapsed.current += delta;
    const time = reducedMotion ? 999 : elapsed.current;

    // Fase 1 — se traza el plano
    const drawProgress = easeOutCubic(clamp01(time / TIMELINE.draw));
    const lineCount =
      Math.floor((lineGeometry.userData.totalVertices * drawProgress) / 2) * 2;

    if (linesRef.current) {
      linesRef.current.geometry.setDrawRange(0, lineCount);
    }

    // Fase 2 — los muros se levantan, escalonados por muro original
    const raiseTotal =
      TIMELINE.raise + TIMELINE.stagger * (wallGroups.length - 1);

    for (let wallIndex = 0; wallIndex < wallGroups.length; wallIndex++) {
      const start = TIMELINE.raiseStart + wallIndex * TIMELINE.stagger;
      const progress = clamp01((time - start) / TIMELINE.raise);
      const scale = easeOutCubic(progress);

      for (const itemIndex of wallItemIndices[wallIndex] ?? []) {
        const mesh = itemRefs.current[itemIndex];
        if (!mesh) continue;

        mesh.visible = progress > 0;
        mesh.scale.y = Math.max(scale, 0.0001);
      }
    }

    // El plano se desvanece mientras los muros ocupan su lugar.
    if (linesRef.current) {
      const raiseProgress = clamp01((time - TIMELINE.raiseStart) / raiseTotal);
      linesRef.current.material.opacity = 0.95 - 0.75 * raiseProgress;
    }

    // Fase 3 — nombres de los recintos
    const labelProgress = easeOutCubic(
      clamp01((time - TIMELINE.labelsStart) / TIMELINE.labels),
    );
    for (const element of labelRefs.current) {
      if (element) element.style.opacity = labelProgress;
    }

    // Fase 4 — el patio se levanta junto con las etiquetas
    for (const node of patioRefs.current) {
      if (node) node.scale.y = Math.max(labelProgress, 0.0001);
    }
  });

  /* ---------------------------------------------------------------- render */

  return (
    <group>
      {/* Base tipo maqueta: cubre la casa y el patio */}
      <mesh
        position={[PLAN.width / 2, -PLAN.baseThickness / 2, PLOT_DEPTH / 2]}
        receiveShadow
      >
        <boxGeometry
          args={[
            PLAN.width + PLAN.baseMargin * 2,
            PLAN.baseThickness,
            PLOT_DEPTH + PLAN.baseMargin * 2,
          ]}
        />
        <meshStandardMaterial color="#eef2f7" roughness={0.95} metalness={0} />
      </mesh>

      {/* Plano trazado en el suelo */}
      <lineSegments ref={linesRef} geometry={lineGeometry}>
        <lineBasicMaterial color="#2563eb" transparent opacity={0.95} />
      </lineSegments>

      {/* Muros (partidos por puertas y ventanas) */}
      {renderItems.map((item, index) => {
        const isGlass = item.kind === "glass";

        return (
          <mesh
            key={index}
            ref={(element) => {
              itemRefs.current[index] = element;
            }}
            geometry={item.geometry}
            position={item.position}
            rotation-y={item.rotationY}
            scale-y={0.0001}
            visible={false}
            castShadow={!isGlass}
            receiveShadow
          >
            <meshStandardMaterial
              color={isGlass ? "#bae6fd" : "#ffffff"}
              roughness={isGlass ? 0.15 : 0.82}
              metalness={0}
              transparent={isGlass}
              opacity={isGlass ? 0.45 : 1}
              depthWrite={!isGlass}
            />
            {/* Aristas marcadas: le da el aspecto de modelo técnico */}
            <lineSegments geometry={item.edges}>
              <lineBasicMaterial
                color="#93c5fd"
                transparent
                opacity={isGlass ? 0.6 : 0.85}
              />
            </lineSegments>
          </mesh>
        );
      })}

      {/* Recintos */}
      {PLAN.rooms.map((room, index) => (
        <PlanLabel
          key={room.name}
          position={[room.x, LABEL_HEIGHT, room.z]}
          name={room.name}
          detail={room.area}
          register={(element) => {
            labelRefs.current[index] = element;
          }}
        />
      ))}

      {/* Etiquetas del patio, con el mismo desvanecido que los recintos */}
      {PATIO_LABELS.map((item, index) => (
        <PlanLabel
          key={`patio-${item.name}`}
          position={[item.x, PATIO_LABEL_HEIGHT, item.z]}
          name={item.name}
          register={(element) => {
            labelRefs.current[PLAN.rooms.length + index] = element;
          }}
        />
      ))}

      {/* Patio: reja perimetral, árboles y quincho */}
      {fenceItems.map((item, index) => (
        <mesh
          key={`fence-${index}`}
          ref={(element) => {
            patioRefs.current[index] = element;
          }}
          geometry={item.geometry}
          position={item.position}
          rotation-y={item.rotationY}
          scale-y={0.0001}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial
            color="#c3d0e2"
            roughness={0.7}
            metalness={0.15}
          />
        </mesh>
      ))}

      {PLAN.patio.elements.map((element, index) => (
        <group
          key={`patio-${element.name}-${index}`}
          ref={(node) => {
            patioRefs.current[fenceItems.length + index] = node;
          }}
          position={[element.x, 0, element.z]}
          scale-y={0.0001}
        >
          {element.type === "tree" ? (
            <Tree radius={element.radius} />
          ) : (
            <Quincho width={element.width} depth={element.depth} />
          )}
        </group>
      ))}

      {/* Retícula de dibujo */}
      <Grid
        position={[PLAN.width / 2, -PLAN.baseThickness - 0.02, PLOT_DEPTH / 2]}
        args={[40, 40]}
        cellSize={0.5}
        cellThickness={0.6}
        cellColor="#7f93ad"
        sectionSize={2}
        sectionThickness={1}
        sectionColor="#6b809c"
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
      <hemisphereLight args={["#ffffff", "#dbeafe", 0.9]} />
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
      target={[PLAN.width / 2, PLAN.wallHeight * 0.5, PLOT_DEPTH / 2]}
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

export default function BuildingScene({
  active = true,
  reducedMotion = false,
  replayToken = 0,
  onReady,
}) {
  // Avisa al padre de que el visor existe de verdad: así la pista de "arrastra
  // para girar" no se muestra si el chunk del 3D no llega a cargar.
  useEffect(() => {
    onReady?.();
  }, [onReady]);

  return (
    <Canvas
      className="scene-canvas"
      // "never" detiene por completo el render cuando la sección no se ve.
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.75]}
      flat
      shadows
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      camera={{ position: [18, 23, 21.5], fov: 32, near: 0.5, far: 160 }}
    >
      <Lights />
      <Model
        active={active}
        reducedMotion={reducedMotion}
        replayToken={replayToken}
      />
      <Controls enabled={!reducedMotion} />
    </Canvas>
  );
}
