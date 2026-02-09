import { useMemo } from 'react';
import type { ScaleLinear } from 'd3-scale';
import { astronomicalToDisplay } from '../../utils/historicalDate';

interface TimelineAxisProps {
  scale: ScaleLinear<number, number>;
  height: number;
  visibleDomain: [number, number];
  zoomLevel: number;
}

export default function TimelineAxis({ scale, height, visibleDomain, zoomLevel }: TimelineAxisProps) {
  // Determine tick interval based on zoom level
  const tickInterval = useMemo(() => {
    const span = visibleDomain[1] - visibleDomain[0];
    if (span > 1000) return 100;  // Century ticks
    if (span > 500) return 50;
    if (span > 200) return 25;
    if (span > 100) return 10;    // Decade ticks
    if (span > 50) return 5;
    return 1;                     // Year ticks
  }, [visibleDomain]);

  // Generate tick values with culling to prevent overlap
  const ticks = useMemo(() => {
    const [min, max] = visibleDomain;
    const tickValues: number[] = [];

    // Round to nearest interval
    const start = Math.floor(min / tickInterval) * tickInterval;
    const end = Math.ceil(max / tickInterval) * tickInterval;

    for (let year = start; year <= end; year += tickInterval) {
      tickValues.push(year);
    }

    // Cull overlapping labels based on available space
    if (zoomLevel < 2) {
      // At low zoom, space is tight; show fewer labels
      return tickValues.filter(year => year % (tickInterval * 2) === 0 || tickInterval >= 100);
    }
    if (zoomLevel < 5) {
      // Medium zoom
      return tickValues.filter(year => year % tickInterval === 0);
    }
    return tickValues;
  }, [visibleDomain, tickInterval, zoomLevel]);

  return (
    <g className="timeline-axis">
      {/* Axis line */}
      <line
        x1={0}
        y1={0}
        x2={scale.range()[1]}
        y2={0}
        stroke="#333"
        strokeWidth={2}
      />

      {/* Ticks */}
      {ticks.map((year) => {
        const x = scale(year);
        const { value, era } = astronomicalToDisplay(year);
        const label = `${value} ${era}`;

        // Skip if outside visible range (with margin)
        const [rangeMin, rangeMax] = scale.range();
        if (x < (rangeMin || 0) - 10 || x > (rangeMax || 0) + 10) {
          return null;
        }

        return (
          <g key={year} transform={`translate(${x}, 0)`}>
            <line y1={0} y2={10} stroke="#333" strokeWidth={1} />
            <text
              y={15}
              textAnchor="start"
              dominantBaseline="middle"
              fontSize={11}
              fill="#654321"
              transform="rotate(45)"
              style={{ userSelect: 'none' }}
            >
              {label}
            </text>
          </g>
        );
      })}
    </g>
  );
}
