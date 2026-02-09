import type { ScaleLinear } from 'd3-scale';
import type { Lane, TimelineEvent } from '../../../../shared/types';
import { toCoordinate } from '../../utils/historicalDate';
import EventMarker from './EventMarker';
import EventRange from './EventRange';

interface LaneRowProps {
  lane: Lane;
  events: TimelineEvent[];
  scale: ScaleLinear<number, number>;
  yOffset: number;
}

const LANE_HEIGHT = 80;
const MARKER_Y_OFFSET = 40;

export default function LaneRow({ lane, events, scale, yOffset }: LaneRowProps) {
  return (
    <g className="lane-row" transform={`translate(0, ${yOffset})`}>
      {/* Lane background */}
      <rect
        x={scale.range()[0]}
        y={0}
        width={(scale.range()[1] || 0) - (scale.range()[0] || 0)}
        height={LANE_HEIGHT}
        fill="transparent"
        stroke="#e0e0e0"
        strokeWidth={0.5}
      />

      {/* Lane label */}
      <text
        x={10}
        y={25}
        fontSize={13}
        fontWeight={600}
        fill={lane.color}
      >
        {lane.label}
      </text>

      {/* Events */}
      {events.map((event) => {
        if (event.type === 'point') {
          const cx = scale(toCoordinate(event.date));
          return (
            <EventMarker
              key={event.id}
              event={event}
              cx={cx}
              cy={MARKER_Y_OFFSET}
              color={lane.color}
            />
          );
        }

        if (event.type === 'range' || event.type === 'reign' || event.type === 'era-band') {
          const startX = scale(toCoordinate(event.date));
          const endX = event.endDate ? scale(toCoordinate(event.endDate)) : startX;
          const width = endX - startX;

          return (
            <EventRange
              key={event.id}
              event={event}
              x={startX}
              width={width}
              y={MARKER_Y_OFFSET - 10}
              height={20}
              color={lane.color}
            />
          );
        }

        return null;
      })}
    </g>
  );
}
