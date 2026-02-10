import type { TimelineEvent } from '../../../../shared/types';
import { useDataStore } from '../../stores/dataStore';
import { format, formatRange } from '../../utils/historicalDate';

interface EventCardProps {
  event: TimelineEvent;
  isActive: boolean;
  onClick: () => void;
}

export default function EventCard({ event, isActive, onClick }: EventCardProps) {
  const { lanes } = useDataStore();
  const lane = lanes.find((l) => l.id === event.categoryId);

  const dateString = event.endDate
    ? formatRange({ start: event.date, end: event.endDate })
    : format(event.date);

  return (
    <article
      className={`event-card ${isActive ? 'active' : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-selected={isActive}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="event-card-color-bar" style={{ backgroundColor: lane?.color || '#ccc' }} />
      <div className="event-card-content">
        <div className="event-card-header">
          <h3 className="event-card-title">{event.title}</h3>
          {isActive && <span className="event-selected-badge">Selected</span>}
          <span className="event-type-badge" title={event.type}>
            {event.type === 'point' && '●'}
            {event.type === 'range' && '▬'}
            {event.type === 'reign' && '👑'}
            {event.type === 'era-band' && '═'}
          </span>
        </div>
        <div className="event-card-date">{dateString}</div>
        <p className="event-card-summary">{event.summary}</p>
        {event.tags.length > 0 && (
          <div className="event-card-tags">
            {event.tags.slice(0, 3).map((tagId) => (
              <span key={tagId} className="tag-chip">
                {tagId}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
