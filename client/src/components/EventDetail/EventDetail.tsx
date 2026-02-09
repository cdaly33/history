import { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useDataStore } from '../../stores/dataStore';
import { useTimelineStore } from '../../stores/timelineStore';
import { format, formatRange } from '../../utils/historicalDate';
import ImageGallery from './ImageGallery';
import SourcesList from './SourcesList';

export default function EventDetail() {
  const { events, people, places, tags } = useDataStore();
  const { selectedEventId } = useTimelineStore();

  const event = useMemo(() => {
    return events.find((e) => e.id === selectedEventId);
  }, [events, selectedEventId]);

  if (!event) {
    return null;
  }

  const dateString = event.endDate
    ? formatRange({ start: event.date, end: event.endDate })
    : format(event.date);

  // Resolve people, places, tags
  const eventPeople = event.people.map((ref) => {
    const person = people.find((p) => p.id === ref.personId);
    return person ? { ...person, role: ref.role, personId: person.id } : null;
  }).filter(Boolean);

  const eventPlaces = event.places.map((ref) => {
    const place = places.find((p) => p.id === ref.placeId);
    return place ? { ...place, context: ref.context, placeId: place.id } : null;
  }).filter(Boolean);

  const eventTags = event.tags
    .map((tagId) => tags.find((t) => t.id === tagId))
    .filter(Boolean);

  return (
    <div className="event-detail">
      <header className="event-detail-header">
        <h2>{event.title}</h2>
        <div className="event-detail-date">{dateString}</div>
        {event.tags.length > 0 && (
          <div className="event-detail-tags">
            {eventTags.map((tag) => (
              <span key={tag?.id} className="tag-chip">
                {tag?.label}
              </span>
            ))}
          </div>
        )}
      </header>

      <section className="event-detail-narrative">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{event.narrative}</ReactMarkdown>
      </section>

      {eventPeople.length > 0 && (
        <section className="event-detail-people">
          <h3>People</h3>
          <div className="people-chips">
            {eventPeople.map((person) => (
              person && (
                <span key={person.personId} className="person-chip">
                  {person.name || person.personId}
                  {person.role && ` (${person.role})`}
                </span>
              )
            ))}
          </div>
        </section>
      )}

      {eventPlaces.length > 0 && (
        <section className="event-detail-places">
          <h3>Places</h3>
          <div className="places-chips">
            {eventPlaces.map((place) => (
              place && (
                <span key={place.placeId} className="place-chip">
                  {place.name || place.placeId}
                  {place.context && ` (${place.context})`}
                </span>
              )
            ))}
          </div>
        </section>
      )}

      {event.images.length > 0 && (
        <section className="event-detail-images">
          <h3>Images</h3>
          <ImageGallery images={event.images} />
        </section>
      )}

      {event.sources.length > 0 && (
        <section className="event-detail-sources">
          <h3>Sources & References</h3>
          <SourcesList sources={event.sources} />
        </section>
      )}
    </div>
  );
}
