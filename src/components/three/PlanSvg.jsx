import { PLAN, openingsByWall, solidWallPieces } from './housePlan';

/**
 * El mismo plano, dibujado como plano técnico 2D en SVG.
 *
 * Se usa en dos momentos:
 *  - mientras se descarga el módulo 3D (que va en su propio chunk)
 *  - como respaldo si el dispositivo no puede crear un contexto WebGL
 *
 * Se genera desde los mismos datos que el modelo 3D (housePlan.js), así que
 * ambos siempre representan la misma casa, con los mismos huecos en los muros.
 */
export default function PlanSvg({ className = '' }) {
  const { width, depth, wallThickness, rooms, openings } = PLAN;

  const gridLines = [];
  for (let x = 0; x <= width; x++) gridLines.push({ x1: x, y1: 0, x2: x, y2: depth, vertical: true });
  for (let z = 0; z <= depth; z++) gridLines.push({ x1: 0, y1: z, x2: width, y2: z, vertical: false });

  const wallPieces = solidWallPieces();
  const wallOpenings = openingsByWall();

  return (
    <svg
      viewBox={`-1.6 -1.3 ${width + 3.2} ${depth + 3}`}
      className={`w-full h-full ${className}`}
      role="img"
      aria-label={`Plano de vivienda de ${width} por ${depth} metros con ${rooms.length} recintos y ${openings.length} aberturas`}
    >
      {/* Retícula de fondo */}
      <g stroke="#e2e8f0" strokeWidth={0.012}>
        {gridLines.map((line, i) => (
          <line key={i} x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} />
        ))}
      </g>

      {/* Muros: sin cruzar los huecos de puertas y ventanas */}
      <g stroke="#2563eb" strokeWidth={wallThickness} strokeLinecap="square" opacity={0.9}>
        {wallPieces.flat().map(([x1, z1, x2, z2], i) => (
          <line key={i} x1={x1} y1={z1} x2={x2} y2={z2} />
        ))}
      </g>

      {/* Aberturas: eje del vidrio (ventanas) y arco de giro + hoja (puertas) */}
      <g fill="none" stroke="#64748b">
        {wallPieces.map((pieces, wallIndex) =>
          wallOpenings[wallIndex].map((opening, i) => {
            const radius = Math.hypot(opening.x2 - opening.x1, opening.z2 - opening.z1);

            if (opening.type === 'window') {
              // Línea fina que recorre el hueco del muro: el eje del vidrio.
              return (
                <line
                  key={`w${wallIndex}-${i}`}
                  x1={opening.x1}
                  y1={opening.z1}
                  x2={opening.x2}
                  y2={opening.z2}
                  strokeWidth={0.03}
                />
              );
            }

            // Puerta: arco de giro de la hoja y hoja abierta. El ángulo base va
            // de la bisagra hacia el otro extremo del hueco; `side` gira el arco
            // 90° hacia un lado u otro del muro.
            const hingeAtStart = opening.hinge !== 'end';
            const hingeX = hingeAtStart ? opening.x1 : opening.x2;
            const hingeZ = hingeAtStart ? opening.z1 : opening.z2;
            const gapAngle = Math.atan2(opening.z2 - opening.z1, opening.x2 - opening.x1);
            const baseAngle = hingeAtStart ? gapAngle : gapAngle + Math.PI;
            const endAngle = baseAngle + (opening.side ?? 1) * (Math.PI / 2);

            const arc = [];
            for (let k = 0; k <= 8; k++) {
              const angle = baseAngle + ((endAngle - baseAngle) * k) / 8;
              arc.push(
                `${(hingeX + radius * Math.cos(angle)).toFixed(3)},${(hingeZ + radius * Math.sin(angle)).toFixed(3)}`
              );
            }

            const [leafX, leafZ] = arc[arc.length - 1].split(',');

            return (
              <g key={`d${wallIndex}-${i}`} strokeWidth={0.025}>
                <polyline points={arc.join(' ')} strokeDasharray="0.07 0.05" />
                <line x1={hingeX} y1={hingeZ} x2={leafX} y2={leafZ} />
              </g>
            );
          })
        )}
      </g>

      {/* Recintos */}
      <g textAnchor="middle" fontFamily="inherit">
        {rooms.map((room) => (
          <g key={room.name}>
            <text x={room.x} y={room.z} fontSize={0.34} fontWeight="600" fill="#334155">
              {room.name}
            </text>
            <text x={room.x} y={room.z + 0.45} fontSize={0.28} fill="#64748b">
              {room.area}
            </text>
          </g>
        ))}
      </g>

      {/* Cota horizontal */}
      <g stroke="#94a3b8" strokeWidth={0.02} fill="none">
        <line x1={0} y1={depth + 0.55} x2={width} y2={depth + 0.55} />
        <line x1={0} y1={depth + 0.42} x2={0} y2={depth + 0.68} />
        <line x1={width} y1={depth + 0.42} x2={width} y2={depth + 0.68} />
      </g>
      <text
        x={width / 2}
        y={depth + 0.95}
        textAnchor="middle"
        fontSize={0.32}
        fill="#64748b"
      >
        {width.toFixed(2).replace('.', ',')} m
      </text>

      {/* Cota vertical */}
      <g stroke="#94a3b8" strokeWidth={0.02} fill="none">
        <line x1={-0.75} y1={0} x2={-0.75} y2={depth} />
        <line x1={-0.88} y1={0} x2={-0.62} y2={0} />
        <line x1={-0.88} y1={depth} x2={-0.62} y2={depth} />
      </g>
      <text
        x={-1.05}
        y={depth / 2}
        textAnchor="middle"
        fontSize={0.32}
        fill="#64748b"
        transform={`rotate(-90 -1.05 ${depth / 2})`}
      >
        {depth.toFixed(2).replace('.', ',')} m
      </text>
    </svg>
  );
}