/**
 * Modelos 3D de los proyectos del carrusel.
 *
 * Son maquetas volumétricas construidas con primitivas de three.js: nada de
 * archivos externos, así que no hay pipeline de assets que mantener. Cada
 * proyecto elige la suya con su campo `model` (ver src/data/mockData.js).
 *
 * El lenguaje visual es el mismo que el de la sección "Del plano a la obra":
 * volúmenes blancos con las aristas marcadas en azul.
 *
 * Para añadir un modelo: escribe el componente, regístralo en PROJECT_MODELS y
 * asígnalo a un proyecto con su clave `model`.
 */
import { useEffect, useMemo } from 'react';
import * as THREE from 'three';

const BODY_COLOR = '#ffffff';
const EDGE_COLOR = '#7daffb';
const BASE_COLOR = '#f1f5f9';

/**
 * Volumen con las aristas marcadas.
 * `size` es [ancho, alto, fondo] y el origen de coordenadas está en el centro.
 */
function Mass({ size, position = [0, 0, 0], rotation = [0, 0, 0], color = BODY_COLOR }) {
  const [width, height, depth] = size;

  const edges = useMemo(
    () => new THREE.EdgesGeometry(new THREE.BoxGeometry(width, height, depth)),
    [width, height, depth]
  );

  useEffect(() => () => edges.dispose(), [edges]);

  return (
    <mesh position={position} rotation={rotation} castShadow receiveShadow>
      <boxGeometry args={[width, height, depth]} />
      <meshStandardMaterial color={color} roughness={0.85} metalness={0} />
      <lineSegments geometry={edges}>
        <lineBasicMaterial color={EDGE_COLOR} transparent opacity={0.85} />
      </lineSegments>
    </mesh>
  );
}

/** Techo a dos aguas hecho con dos losas inclinadas. */
function GableRoof({ width, depth, height, thickness = 0.05, overhang = 0.05, y = 0 }) {
  const half = width / 2 + overhang;
  const slope = Math.atan2(height, half);
  const length = Math.hypot(half, height);

  return (
    <>
      <Mass
        size={[length, thickness, depth + overhang * 2]}
        position={[-half / 2, y + height / 2, 0]}
        rotation={[0, 0, slope]}
      />
      <Mass
        size={[length, thickness, depth + overhang * 2]}
        position={[half / 2, y + height / 2, 0]}
        rotation={[0, 0, -slope]}
      />
    </>
  );
}

/** Bóveda de cañón: medio cilindro apoyado sobre su plano. */
function BarrelVault({ radius, length, y = 0 }) {
  return (
    <mesh position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
      <cylinderGeometry args={[radius, radius, length, 20, 1, false, Math.PI / 2, Math.PI]} />
      <meshStandardMaterial color={BODY_COLOR} roughness={0.85} metalness={0} />
    </mesh>
  );
}

/** Cuerpo de ventanas: banda oscura que rompe la monotonía de un volumen alto. */
function WindowBands({ count, width, depth, startY, stepY, bandHeight = 0.055 }) {
  return Array.from({ length: count }, (_, index) => (
    <Mass
      key={index}
      size={[width + 0.02, bandHeight, depth + 0.02]}
      position={[0, startY + index * stepY, 0]}
      color="#bfdbfe"
    />
  ));
}

/* ------------------------------------------------------------------ modelos */

/** Bodega de vino: tres naves abovedadas y un anexo bajo. */
function WineryModel() {
  const vaultRadius = 0.16;
  const vaultLength = 1.1;

  return (
    <>
      <Mass size={[1.15, 0.32, vaultLength]} position={[0, 0.16, 0]} />
      {[-0.36, 0, 0.36].map((x) => (
        <group key={x} position={[x, 0.32, 0]}>
          <BarrelVault radius={vaultRadius} length={vaultLength} />
        </group>
      ))}
      <Mass size={[0.44, 0.22, 0.5]} position={[0.6, 0.11, 0.3]} />
    </>
  );
}

/** Basílica: nave central, dos torres con aguja y escalinata. */
function BasilicaModel() {
  return (
    <>
      <Mass size={[0.95, 0.38, 1.0]} position={[0, 0.19, 0]} />
      <GableRoof width={0.95} depth={1.0} height={0.22} y={0.38} />

      {[-0.46, 0.46].map((x) => (
        <group key={x}>
          <Mass size={[0.22, 0.72, 0.22]} position={[x, 0.36, -0.42]} />
          <mesh position={[x, 0.86, -0.42]} castShadow>
            <coneGeometry args={[0.16, 0.24, 4]} />
            <meshStandardMaterial color={BODY_COLOR} roughness={0.85} />
          </mesh>
        </group>
      ))}

      <Mass size={[0.7, 0.06, 0.22]} position={[0, 0.03, 0.6]} />
      <Mass size={[0.5, 0.06, 0.16]} position={[0, 0.09, 0.68]} />
    </>
  );
}

/** Iglesia de una torre. */
function ChurchModel() {
  return (
    <>
      <Mass size={[0.72, 0.36, 1.0]} position={[-0.12, 0.18, 0]} />
      <GableRoof width={0.72} depth={1.0} height={0.18} y={0.36} />

      <Mass size={[0.26, 0.66, 0.26]} position={[0.42, 0.33, 0.34]} />
      <mesh position={[0.42, 0.78, 0.34]} castShadow>
        <coneGeometry args={[0.18, 0.26, 4]} />
        <meshStandardMaterial color={BODY_COLOR} roughness={0.85} />
      </mesh>

      <Mass size={[0.5, 0.05, 0.16]} position={[-0.12, 0.025, 0.58]} />
    </>
  );
}

/** Casa: volumen principal con techumbre y un cuerpo menor adosado. */
function HouseModel() {
  return (
    <>
      <Mass size={[0.95, 0.42, 0.75]} position={[0, 0.21, 0]} />
      <GableRoof width={0.95} depth={0.75} height={0.26} y={0.42} />

      <Mass size={[0.4, 0.28, 0.42]} position={[0.55, 0.14, 0.24]} />
      <Mass size={[0.08, 0.34, 0.08]} position={[-0.3, 0.66, 0.2]} />

      <Mass size={[0.26, 0.04, 0.3]} position={[0.14, 0.02, 0.46]} />
    </>
  );
}

/** Torre de oficinas: tres volúmenes escalonados con fajas de ventanas. */
function TowerModel() {
  return (
    <>
      <Mass size={[1.0, 0.14, 0.9]} position={[0, 0.07, 0]} color={BASE_COLOR} />
      <Mass size={[0.78, 0.44, 0.7]} position={[0, 0.36, 0]} />
      {/* Las fajas van como hermanas, no dentro de <Mass>: Mass no renderiza children. */}
      <WindowBands count={3} width={0.78} depth={0.7} startY={0.24} stepY={0.12} />

      <Mass size={[0.56, 0.36, 0.52]} position={[0, 0.76, 0]} />
      <WindowBands count={2} width={0.56} depth={0.52} startY={0.68} stepY={0.16} />

      <Mass size={[0.34, 0.26, 0.32]} position={[0, 1.07, 0]} />
      <Mass size={[0.06, 0.18, 0.06]} position={[0, 1.29, 0]} color={EDGE_COLOR} />
    </>
  );
}

/** Galpón industrial: nave larga con lucernario y chimenea. */
function WarehouseModel() {
  return (
    <>
      <Mass size={[1.25, 0.34, 0.66]} position={[0, 0.17, 0]} />
      <Mass size={[1.05, 0.1, 0.2]} position={[0, 0.39, 0]} color={BASE_COLOR} />
      <Mass size={[0.09, 0.42, 0.09]} position={[0.44, 0.55, -0.16]} color={EDGE_COLOR} />
      <Mass size={[0.28, 0.2, 0.3]} position={[0.5, 0.1, 0.36]} />
    </>
  );
}

/** Pabellón: losa de cubierta sobre pilares y un volumen macizo detrás. */
function PavilionModel() {
  return (
    <>
      <Mass size={[0.5, 0.42, 0.95]} position={[-0.34, 0.21, 0]} />
      {[[-0.05, -0.38], [-0.05, 0.38], [0.34, -0.38], [0.34, 0.38]].map(([x, z]) => (
        <Mass key={`${x}-${z}`} size={[0.05, 0.3, 0.05]} position={[x, 0.15, z]} />
      ))}
      <Mass size={[0.95, 0.05, 1.05]} position={[0.02, 0.32, 0]} color={BASE_COLOR} />
      <Mass size={[0.62, 0.3, 0.44]} position={[0.06, 0.15, 0]} color={BODY_COLOR} />
    </>
  );
}

/** Conjunto residencial: tres casas de cubierta plana alrededor de un patio. */
function HousingModel() {
  return (
    <>
      <Mass size={[1.25, 0.05, 1.05]} position={[0, 0.025, 0]} color={BASE_COLOR} />
      <Mass size={[0.42, 0.3, 0.36]} position={[-0.34, 0.2, -0.28]} />
      <Mass size={[0.42, 0.3, 0.36]} position={[0.34, 0.2, -0.28]} />
      <Mass size={[0.42, 0.3, 0.36]} position={[0, 0.2, 0.3]} />
      <Mass size={[0.24, 0.12, 0.24]} position={[-0.34, 0.41, -0.28]} color={BASE_COLOR} />
      <Mass size={[0.24, 0.12, 0.24]} position={[0.34, 0.41, -0.28]} color={BASE_COLOR} />
    </>
  );
}

/** Mirador: cuerpo cilíndrico con dos balcones y mástil. */
function LookoutModel() {
  return (
    <>
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.22, 0.26, 0.8, 20]} />
        <meshStandardMaterial color={BODY_COLOR} roughness={0.85} metalness={0} />
      </mesh>
      {[0.62, 0.82].map((y) => (
        <mesh key={y} position={[0, y, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.42, 0.42, 0.035, 24]} />
          <meshStandardMaterial color={BASE_COLOR} roughness={0.9} metalness={0} />
        </mesh>
      ))}
      <Mass size={[0.05, 0.3, 0.05]} position={[0, 0.99, 0]} color={EDGE_COLOR} />
      <Mass size={[0.5, 0.1, 0.5]} position={[0, 0.05, 0]} color={BASE_COLOR} />
    </>
  );
}

/* ----------------------------------------------------------------- registro */

/**
 * Registro de maquetas disponibles. Es interno a propósito: este archivo solo
 * debe exportar componentes (regla react-refresh/only-export-components).
 * Las claves válidas están documentadas en src/data/mockData.js.
 */
const PROJECT_MODELS = {
  winery: WineryModel,
  basilica: BasilicaModel,
  church: ChurchModel,
  house: HouseModel,
  tower: TowerModel,
  warehouse: WarehouseModel,
  pavilion: PavilionModel,
  housing: HousingModel,
  lookout: LookoutModel,
};

/** Renderiza la maqueta indicada. Si la clave no existe, cae en la casa. */
export default function ProjectModel({ model }) {
  const Model = PROJECT_MODELS[model] ?? HouseModel;
  return <Model />;
}
