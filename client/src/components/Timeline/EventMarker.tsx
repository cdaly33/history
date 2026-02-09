import type { TimelineEvent } from '../../../../shared/types';
import { useTimelineStore } from '../../stores/timelineStore';

interface EventMarkerProps {
  event: TimelineEvent;
  cx: number;
  cy: number;
  color: string;
}

export default function EventMarker({ event, cx, cy, color }: EventMarkerProps) {
  const { selectedEventId, setSelectedEventId } = useTimelineStore();
  const isSelected = selectedEventId === event.id;

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
      className="event-marker"
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
      role="button"
      aria-label={event.title}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <title>{event.title}</title>
    </circle>
  );
}
