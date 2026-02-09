import { useMemo } from 'react';
import { useDataStore } from '../../stores/dataStore';
import { useTimelineStore } from '../../stores/timelineStore';
import EventCard from './EventCard';

export default function EventList() {
  const { events } = useDataStore();
  const { selectedEventId, setSelectedEventId } = useTimelineStore();

  // For M1: show all events (no filtering yet)
  // In future PRs, this will be filtered based on selectedRange and filters
  const displayEvents = useMemo(() => {
    return events;
  }, [events]);

  if (displayEvents.length === 0) {
    return (
      <div className="event-list-empty">
        <p>No events to display</p>
      </div>
    );
  }

  return (
    <div className="event-list">
      <h2>Events ({displayEvents.length})</h2>
      <div className="event-cards">
        {displayEvents.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            isActive={selectedEventId === event.id}
            onClick={() => setSelectedEventId(event.id)}
          />
        ))}
      </div>
    </div>
  );
}
