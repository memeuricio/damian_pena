import { PLAN, PLOT_DEPTH, openingsByWall, solidWallPieces } from './housePlan';

/**
 * El mismo plano, dibujado como plano técnico 2D en SVG.
 *
 * Se usa en dos momentos:
 *  - mientras se descarga el módulo 3D (que va en su propio chunk)
 *  - como respaldo si el dispositivo no puede crear un contexto WebGL
 *
 * Se genera desde los mismos datos que el modelo 3D (housePlan.js), así que
 * ambos siempre representan la misma casa, con los mismos huecos en los muros
 * y el mismo patio.
 *
 * Lleva simbología de dibujo técnico: ejes con burbujas numeradas y con letras,
 * flecha norte, cadena de cotas, ventanas con marco y puertas con su arco de giro.
 */

/** Trazo de eje normalizado: raya, punto, raya. */
const AXIS_DASH = '0.3 0.1 0.06 0.1';

/** Radio de las burbujas de eje. */
const BUBBLE = 0.26;

/** Altura a la que va la cadena de cotas, por encima del plano. */
const CHAIN_Y = -0.72;

/** Altura a la que van las burbujas de los ejes verticales. */
const BUBBLE_Y = -1.34;

export default function PlanSvg({ className = '' }) {
  const { width, depth, wallThickness, rooms, openings, patio, axes } = PLAN;

  const gridLines = [];
  for (let x = 0; x <= width; x++) gridLines.push({ x1: x, y1: 0, x2: x, y2: PLOT_DEPTH });
  for (let z = 0; z <= PLOT_DEPTH; z++) gridLines.push({ x1: 0, y1: z, x2: width, y2: z });

  const wallPieces = solidWallPieces();
  const wallOpenings = openingsByWall();

  const trees = patio.elements.filter((element) => element.type === 'tree');
  const quinchos = patio.elements.filter((element) => element.type === 'quincho');

  // Cadena de cotas: los vanos entre ejes verticales consecutivos
  const chain = axes.vertical.slice(0, -1).map((from, index) => ({
    from,
    to: axes.vertical[index + 1],
    label: (axes.vertical[index + 1] - from).toFixed(2).replace('.', ','),
  }));

  return (
    <svg
      viewBox={`-1.9 -1.9 ${width + 3.8} ${PLOT_DEPTH + 3.7}`}
      className={`w-full h-full ${className}`}
      role="img"
      aria-label={`Plano técnico de vivienda de ${width} por ${depth} metros con ${rooms.length} recintos, ${openings.length} aberturas y patio`}
    >
      {/* Retícula de fondo */}
      <g stroke="#e2e8f0" strokeWidth={0.012}>
        {gridLines.map((line, i) => (
          <line key={i} x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} />
        ))}
      </g>

      {/* Ejes estructurales: líneas de trazo y punto que sobresalen del plano */}
      <g stroke="#94a3b8" strokeWidth={0.018} strokeDasharray={AXIS_DASH}>
        {axes.vertical.map((x) => (
          <line key={`ax-${x}`} x1={x} y1={-0.95} x2={x} y2={PLOT_DEPTH + 0.3} />
        ))}
        {axes.horizontal.map((z) => (
          <line key={`az-${z}`} x1={-0.95} y1={z} x2={width + 0.3} y2={z} />
        ))}
      </g>

      {/* Burbujas de eje: números arriba, letras a la izquierda */}
      <g fontFamily="inherit" fontSize={0.3} fontWeight="600" textAnchor="middle">
        {axes.vertical.map((x, index) => (
          <g key={`bv-${x}`}>
            <circle cx={x} cy={BUBBLE_Y} r={BUBBLE} fill="#ffffff" stroke="#94a3b8" strokeWidth={0.025} />
            <text x={x} y={BUBBLE_Y + 0.105} fill="#334155">
              {index + 1}
            </text>
          </g>
        ))}
        {axes.horizontal.map((z, index) => (
          <g key={`bh-${z}`}>
            <circle cx={-BUBBLE_Y} cy={z} r={BUBBLE} fill="#ffffff" stroke="#94a3b8" strokeWidth={0.025} />
            <text x={-BUBBLE_Y} y={z + 0.105} fill="#334155">
              {String.fromCharCode(65 + index)}
            </text>
          </g>
        ))}
      </g>

      {/* Cadena de cotas de los vanos */}
      <g stroke="#94a3b8" strokeWidth={0.02} fill="none">
        <line x1={axes.vertical[0]} y1={CHAIN_Y} x2={axes.vertical[axes.vertical.length - 1]} y2={CHAIN_Y} />
        {axes.vertical.map((x) => (
          <line key={`ct-${x}`} x1={x} y1={CHAIN_Y - 0.13} x2={x} y2={CHAIN_Y + 0.13} />
        ))}
      </g>
      <g textAnchor="middle" fontFamily="inherit" fontSize={0.28} fill="#475569">
        {chain.map((span) => (
          <text key={`cl-${span.from}`} x={(span.from + span.to) / 2} y={CHAIN_Y + 0.42}>
            {span.label}
          </text>
        ))}
      </g>

      {/* Flecha norte */}
      <g transform={`translate(${width + 1} ${BUBBLE_Y + 0.1})`}>
        <circle r={0.42} fill="#ffffff" stroke="#94a3b8" strokeWidth={0.025} />
        <path d="M0 -0.3 L0.14 0.13 L0 0.02 L-0.14 0.13 Z" fill="#334155" />
        <text y={0.74} textAnchor="middle" fontFamily="inherit" fontSize={0.3} fontWeight="600" fill="#334155">
          N
        </text>
      </g>

      {/* Reja perimetral del patio */}
      <g stroke="#94a3b8" strokeWidth={0.05} strokeLinecap="square">
        {patio.fenceWalls.map(([x1, z1, x2, z2], i) => (
          <line key={`fence-${i}`} x1={x1} y1={z1} x2={x2} y2={z2} />
        ))}
      </g>

      {/* Quincho: cubierta en planta */}
      {quinchos.map((quincho, i) => (
        <g key={`quincho-${i}`}>
          <rect
            x={quincho.x - quincho.width / 2}
            y={quincho.z - quincho.depth / 2}
            width={quincho.width}
            height={quincho.depth}
            fill="#e2e8f0"
            fillOpacity={0.45}
            stroke="#64748b"
            strokeWidth={0.04}
            strokeDasharray="0.18 0.12"
          />
          <text
            x={quincho.x}
            y={quincho.z + 0.12}
            textAnchor="middle"
            fontFamily="inherit"
            fontSize={0.32}
            fontWeight="600"
            fill="#334155"
          >
            {quincho.name}
          </text>
        </g>
      ))}

      {/* Árboles: copa y tronco */}
      {trees.map((tree, i) => (
        <g key={`tree-${i}`}>
          <circle
            cx={tree.x}
            cy={tree.z}
            r={tree.radius}
            fill="#8fc4a3"
            fillOpacity={0.3}
            stroke="#4f8f6b"
            strokeWidth={0.035}
          />
          <circle cx={tree.x} cy={tree.z} r={0.07} fill="#4f8f6b" />
        </g>
      ))}

      {/* Muros: sin cruzar los huecos de puertas y ventanas */}
      <g stroke="#2563eb" strokeWidth={wallThickness} strokeLinecap="square" opacity={0.9}>
        {wallPieces.flat().map(([x1, z1, x2, z2], i) => (
          <line key={i} x1={x1} y1={z1} x2={x2} y2={z2} />
        ))}
      </g>

      {/* Aberturas: ventanas con marco y puertas con arco de giro */}
      <g fill="none" stroke="#64748b">
        {wallPieces.map((pieces, wallIndex) =>
          wallOpenings[wallIndex].map((opening, i) => {
            const dx = opening.x2 - opening.x1;
            const dz = opening.z2 - opening.z1;
            const radius = Math.hypot(dx, dz);

            if (opening.type === 'window') {
              // Marco: rectángulo fino relleno, con el eje del vidrio marcado.
              const nx = (-dz / radius) * 0.035;
              const nz = (dx / radius) * 0.035;

              return (
                <polygon
                  key={`w${wallIndex}-${i}`}
                  points={
                    `${opening.x1 + nx},${opening.z1 + nz} ` +
                    `${opening.x2 + nx},${opening.z2 + nz} ` +
                    `${opening.x2 - nx},${opening.z2 - nz} ` +
                    `${opening.x1 - nx},${opening.z1 - nz}`
                  }
                  fill="#bae6fd"
                  stroke="#64748b"
                  strokeWidth={0.02}
                />
              );
            }

            // Puerta: arco de giro de la hoja y hoja abierta. El ángulo base va
            // de la bisagra hacia el otro extremo del hueco; `side` gira el arco
            // 90° hacia un lado u otro del muro.
            const hingeAtStart = opening.hinge !== 'end';
            const hingeX = hingeAtStart ? opening.x1 : opening.x2;
            const hingeZ = hingeAtStart ? opening.z1 : opening.z2;
            const gapAngle = Math.atan2(dz, dx);
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

      {/* Cota general horizontal, por debajo de todo el terreno */}
      <g stroke="#94a3b8" strokeWidth={0.02} fill="none">
        <line x1={0} y1={PLOT_DEPTH + 0.55} x2={width} y2={PLOT_DEPTH + 0.55} />
        <line x1={0} y1={PLOT_DEPTH + 0.42} x2={0} y2={PLOT_DEPTH + 0.68} />
        <line x1={width} y1={PLOT_DEPTH + 0.42} x2={width} y2={PLOT_DEPTH + 0.68} />
      </g>
      <text
        x={width / 2}
        y={PLOT_DEPTH + 0.95}
        textAnchor="middle"
        fontFamily="inherit"
        fontSize={0.32}
        fill="#64748b"
      >
        {width.toFixed(2).replace('.', ',')} m
      </text>

      {/* Cota general vertical: mide la casa, no el terreno */}
      <g stroke="#94a3b8" strokeWidth={0.02} fill="none">
        <line x1={-0.5} y1={0} x2={-0.5} y2={depth} />
        <line x1={-0.63} y1={0} x2={-0.37} y2={0} />
        <line x1={-0.63} y1={depth} x2={-0.37} y2={depth} />
      </g>
      <text
        x={-0.78}
        y={depth / 2}
        textAnchor="middle"
        fontFamily="inherit"
        fontSize={0.32}
        fill="#64748b"
        transform={`rotate(-90 -0.78 ${depth / 2})`}
      >
        {depth.toFixed(2).replace('.', ',')} m
      </text>
    </svg>
  );
}
