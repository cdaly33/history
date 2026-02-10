import type { TimelineEvent } from '../../../../shared/types';
import { useTimelineStore } from '../../stores/timelineStore';
import { format, formatRange } from '../../utils/historicalDate';

interface EventRangeProps {
  event: TimelineEvent;
  x: number;
  width: number;
  y: number;
  height: number;
  color: string;
}

export default function EventRange({ event, x, width, y, height, color }: EventRangeProps) {
  const { selectedEventId, setSelectedEventId } = useTimelineStore();
  const isSelected = selectedEventId === event.id;
  const dateString = event.endDate
    ? formatRange({ start: event.date, end: event.endDate })
    : format(event.date);
  const tooltipText = `${event.title} - ${dateString}`;

  const handleClick = () => {
    setSelectedEventId(event.id);
  };

  // If width is very small, render as a point marker instead
  if (width < 2) {
    return (
      <circle
        cx={x}
        cy={y + height / 2}
        r={isSelected ? 8 : 6}
        fill={color}
        stroke={isSelected ? '#000' : '#fff'}
        strokeWidth={isSelected ? 2 : 1}
        className={`event-marker ${isSelected ? 'is-selected' : ''}`}
        onClick={handleClick}
        style={{ cursor: 'pointer' }}
        role="button"
        aria-label={tooltipText}
        aria-pressed={isSelected}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
      >
        <title>{tooltipText}</title>
      </circle>
    );
  }

  return (
    <g
      className={`event-range ${isSelected ? 'is-selected' : ''}`}
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
      role="button"
      aria-label={tooltipText}
      aria-pressed={isSelected}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={color}
        stroke={isSelected ? '#000' : '#fff'}
        strokeWidth={isSelected ? 2 : 1}
        rx={4}
        opacity={0.8}
      />
      {width > 50 && (
        <text
          x={x + width / 2}
          y={y + height / 2 + 4}
          textAnchor="middle"
          fontSize={11}
          fill="#fff"
          fontWeight={600}
        >
          {event.title}
        </text>
      )}
      <title>{tooltipText}</title>
    </g>
  );
}
