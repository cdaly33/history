import type { ScaleLinear } from 'd3-scale';
import type { EraBand } from '../../../../shared/types';
import { toCoordinate } from '../../utils/historicalDate';

interface EraBandsProps {
  eras: EraBand[];
  scale: ScaleLinear<number, number>;
  height: number;
}

export default function EraBands({ eras, scale, height }: EraBandsProps) {
  // Sort eras by order
  const sortedEras = [...eras].sort((a, b) => a.order - b.order);

  return (
    <g className="era-bands">
      {sortedEras.map((era) => {
        const startX = scale(toCoordinate(era.start));
        const endX = scale(toCoordinate(era.end));
        const width = endX - startX;

        return (
          <g key={era.id}>
            <rect
              x={startX}
              y={0}
              width={width}
              height={height}
              fill={era.color}
              opacity={0.1}
              className="era-band"
            />
            <text
              x={startX + width / 2}
              y={20}
              textAnchor="middle"
              fontSize={14}
              fontWeight={600}
              fill="#333"
              opacity={0.6}
            >
              {era.label}
            </text>
          </g>
        );
      })}
    </g>
  );
}
