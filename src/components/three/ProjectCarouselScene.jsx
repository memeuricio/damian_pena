import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  carouselBounds,
  carouselLayoutFor,
  carouselTargets,
} from './carouselLayout';

/** Rapidez con la que las piezas alcanzan su posición. */
const DAMPING = 9;

/** Velocidad de giro de la maqueta que está al frente, en radianes por segundo. */
const SPIN_SPEED = 0.26;

/** Rapidez con la que el giro arranca y se detiene. */
const SPIN_DAMPING = 3.5;

/**
 * Hasta qué ángulo se ve la placa del título. Más allá de 95° la pieza mira
 * hacia atrás y su placa se vería del revés, así que se desvanece.
 */
const PLAQUE_FADE_FROM = 0.87; // 50°
const PLAQUE_FADE_TO = 1.66; // 95°

/** Color de la niebla: debe parecerse al fondo del contenedor. */
const FOG_COLOR = '#eef5fc';

/**
 * Configuración de cámara estable a nivel de módulo: si este objeto se creara
 * dentro del componente, React lo haría de nuevo en cada render y R3F volvería a
 * aplicar la posición inicial, pisando el encuadre calculado.
 */
const CAMERA_CONFIG = {
  position: [0, 2, 5],
  // Un fov contenido da una perspectiva más suave. Con 42° la cámara quedaba a
  // solo 1,5 radios del anillo y las piezas se deformaban mucho.
  fov: 32,
  near: 0.1,
  far: 80,
};

const clamp01 = (value) => Math.min(1, Math.max(0, value));

/** Lleva un ángulo al rango (-π, π] para que el giro vaya por el camino corto. */
function shortestDelta(from, to) {
  const delta = (to - from) % (2 * Math.PI);
  return ((delta + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
}

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
  positionsRef,
  layout,
}) {
  const group = useRef(null);
  const spinner = useRef(null);
  const glowMaterial = useRef(null);
  const plaqueMaterial = useRef(null);
  const materials = useRef([]);
  const originalColors = useRef([]);
  const tint = useRef(target.selected ? 1 : layout.otherTint);
  const spinFactor = useRef(0);
  const worldPosition = useMemo(() => new THREE.Vector3(), []);

  /**
   * Ángulo actual de la pieza. Se interpola el ÁNGULO y de él sale la posición,
   * no al revés: así la pieza recorre el arco del anillo en vez de cortar por
   * dentro, y el salto de una pieza que sale por un extremo y reaparece por el
   * otro se resuelve por el camino corto (ver shortestDelta).
   */
  const angle = useRef(target.angle);
  const scale = useRef(target.selected ? layout.selectedScale : layout.otherScale);
  const height = useRef(target.selected ? layout.selectedLift : 0);

  // Valores iniciales fijos: los props de transformación de R3F se reaplicarían
  // al cambiar de proyecto y pisarían la animación. Todo lo mueve useFrame.
  const [initial] = useState(() => ({
    x: layout.radius * Math.sin(target.angle),
    y: target.selected ? layout.selectedLift : 0,
    z: layout.radius * Math.cos(target.angle),
    rotation: target.angle,
    scale: target.selected ? layout.selectedScale : layout.otherScale,
  }));

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

    // El ángulo se acerca al objetivo por el camino corto.
    angle.current += shortestDelta(angle.current, target.angle) * k;

    /**
     * Énfasis: cuán cerca está la pieza del frente. Se mide sobre su ángulo real
     * (el suyo más el giro del grupo), así que al arrastrar la que va llegando al
     * centro crece de forma continua, y al soltar no hay salto: el grupo se
     * asienta con esta misma amortiguación.
     *
     * El ángulo se normaliza a (-π, π] antes de medirlo: el valor crudo acumula
     * vueltas (al arrastrar una vuelta completa o al pasar por detrás del anillo
     * al cambiar de proyecto), y con 2π de más la pieza del frente se quedaba sin
     * halo y sin label.
     */
    const worldAngle = shortestDelta(0, angle.current + rotationRef.current);
    const proximity = clamp01(1 - Math.abs(worldAngle) / (step || 1));
    const emphasis = proximity * proximity * (3 - 2 * proximity); // smoothstep

    const targetScale =
      layout.otherScale + (layout.selectedScale - layout.otherScale) * emphasis + (hovered ? 0.05 : 0);
    const targetHeight = layout.selectedLift * emphasis + (hovered ? 0.05 : 0);
    const targetTint = layout.otherTint + (1 - layout.otherTint) * emphasis;

    scale.current += (targetScale - scale.current) * k;
    height.current += (targetHeight - height.current) * k;

    node.position.x = layout.radius * Math.sin(angle.current);
    node.position.z = layout.radius * Math.cos(angle.current);
    node.position.y = height.current;
    node.rotation.y = angle.current;
    node.scale.setScalar(scale.current);

    // Posición de mundo actual: la usa la selección por cercanía al hacer clic.
    node.getWorldPosition(worldPosition);
    positionsRef.current[index] = worldPosition;

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

    // La placa se desvanece cuando la pieza gira hacia atrás: de espaldas se
    // leería del revés.
    if (plaqueMaterial.current) {
      const plaque = clamp01(
        (PLAQUE_FADE_TO - Math.abs(worldAngle)) / (PLAQUE_FADE_TO - PLAQUE_FADE_FROM)
      );
      plaqueMaterial.current.opacity = plaque;
    }
  });

  return (
    <group
      ref={group}
      position={[initial.x, initial.y, initial.z]}
      rotation-y={initial.rotation}
      scale={initial.scale}
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

      {/* Placa con el título */}
      <mesh position={[0, -0.37, 0.2]}>
        <planeGeometry args={[PLAQUE_WIDTH, PLAQUE_HEIGHT]} />
        <meshBasicMaterial
          ref={plaqueMaterial}
          map={plaqueTexture}
          transparent
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* Zona de clic: invisible, pero recibe el puntero en toda la pieza */}
      <mesh
        position={[0, 0.35, 0]}
        onClick={(event) => {
          event.stopPropagation();
          // Si se venía arrastrando, el clic no cuenta como selección.
          if (draggingRef?.current) return;
          onSelect(event, index);
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

function Turntable({ dragRef, rotationRef, layout, children }) {
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
    <group ref={group} position={[0, 0, -layout.radius]}>
      {children}
    </group>
  );
}

/* ------------------------------------------------------------------- cámara */

function ResponsiveCamera({ halfWidth, halfHeight, lookAtY, lookAtZ, elevation, fogRef }) {
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
   *
   * La cámara se sitúa en alto y mira al centro del anillo, que es lo que da la
   * lectura de perspectiva.
   */
  useFrame(() => {
    camera.position.set(
      0,
      lookAtY + distance * Math.sin(elevation),
      lookAtZ + distance * Math.cos(elevation)
    );
    camera.lookAt(0, lookAtY, lookAtZ);

    // La niebla se expresa en proporción a la distancia de cámara, así se adapta
    // sola al aspecto de la pantalla: la pieza del frente queda limpia y las de
    // atrás se atenúan hasta la mitad, sin llegar a desaparecer.
    if (fogRef.current) {
      fogRef.current.near = distance * 0.75;
      fogRef.current.far = distance * 2.2;
    }
  });

  return null;
}

/* -------------------------------------------------------------------- escena */

function Scene({
  projects,
  selectedIndex,
  step,
  onSelect,
  onHoverChange,
  dragRef,
  draggingRef,
  reducedMotion,
}) {
  const gl = useThree((state) => state.gl);
  const camera = useThree((state) => state.camera);
  const size = useThree((state) => state.size);
  const [hovered, setHovered] = useState(null);

  /**
   * Preset de encuadre según el ancho del lienzo (ver carouselLayout.js). Se
   * recalcula al redimensionar o girar el móvil, sin remontar la escena.
   */
  const layout = useMemo(() => carouselLayoutFor(size.width), [size.width]);

  // Posición de mundo de cada pieza, actualizada por su useFrame.
  const positionsRef = useRef([]);
  const clickDirection = useMemo(() => new THREE.Vector3(), []);
  const pieceDirection = useMemo(() => new THREE.Vector3(), []);

  // Giro real del grupo: lo escribe Turntable y lo leen las piezas para saber
  // cuán cerca están del frente.
  const rotationRef = useRef(0);

  // Referencia a la niebla para ajustar su alcance a la distancia de cámara.
  const fogRef = useRef(null);

  const handleHover = (index) => {
    setHovered(index);
    onHoverChange?.(index !== null);
  };

  /**
   * Selección por cercanía angular.
   *
   * Las piezas se solapan al mirarlas casi de frente, así que el raycaster
   * encuentra primero la del frente aunque el puntero apunte a otra: con las
   * cajas de clic, pulsar una pieza del fondo seleccionaba a su vecina. Aquí se
   * elige la pieza cuya dirección, vista desde la cámara, está más cerca de la
   * dirección pulsada —medida como ángulo, no en píxeles—, que es la que el
   * visitante apunta con el cursor.
   */
  const handlePieceClick = useCallback(
    (event, index) => {
      const { pointer } = event;

      clickDirection
        .set(pointer.x, pointer.y, 0.5)
        .unproject(camera)
        .sub(camera.position)
        .normalize();

      let bestIndex = index;
      let bestAngle = Infinity;

      positionsRef.current.forEach((position, pieceIndex) => {
        if (!position) return;

        pieceDirection.copy(position);
        // El centro visible de la maqueta está por encima de su base.
        pieceDirection.y += 0.45;
        pieceDirection.sub(camera.position).normalize();

        const angle = pieceDirection.angleTo(clickDirection);
        if (angle < bestAngle) {
          bestAngle = angle;
          bestIndex = pieceIndex;
        }
      });

      onSelect(bestIndex);
    },
    [camera, clickDirection, pieceDirection, onSelect]
  );

  const targets = useMemo(
    () => carouselTargets(projects.length, selectedIndex, layout),
    [projects.length, selectedIndex, layout]
  );

  const bounds = useMemo(
    () => carouselBounds(projects.length, layout),
    [projects.length, layout]
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
      <fog ref={fogRef} attach="fog" args={[FOG_COLOR, 5, 12]} />

      <ResponsiveCamera
        halfWidth={bounds.halfWidth}
        halfHeight={bounds.halfHeight}
        lookAtY={bounds.lookAtY}
        lookAtZ={bounds.lookAtZ}
        elevation={layout.cameraElevation}
        fogRef={fogRef}
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

      <Turntable dragRef={dragRef} rotationRef={rotationRef} layout={layout}>
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
            onSelect={handlePieceClick}
            draggingRef={draggingRef}
            hovered={hovered === index}
            setHovered={handleHover}
            reducedMotion={reducedMotion}
            positionsRef={positionsRef}
            layout={layout}
          />
        ))}
      </Turntable>
    </>
  );
}

export default function ProjectCarouselScene({
  projects,
  selectedIndex,
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
