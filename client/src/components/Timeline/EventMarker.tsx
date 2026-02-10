import type { TimelineEvent } from '../../../../shared/types';
import { useTimelineStore } from '../../stores/timelineStore';
import { format, formatRange } from '../../utils/historicalDate';

interface EventMarkerProps {
  event: TimelineEvent;
  cx: number;
  cy: number;
  color: string;
}

export default function EventMarker({ event, cx, cy, color }: EventMarkerProps) {
  const { selectedEventId, setSelectedEventId } = useTimelineStore();
  const isSelected = selectedEventId === event.id;
  const dateString = event.endDate
    ? formatRange({ start: event.date, end: event.endDate })
    : format(event.date);
  const tooltipText = `${event.title} - ${dateString}`;

  const handleClick = () => {
    setSelectedEventId(event.id);
  };

  return (
    <circle
      cx={cx}
      cy={cy}
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
