import { useMemo, useState } from 'react';
import { useDataStore } from '../../stores/dataStore';
import { useTimelineStore } from '../../stores/timelineStore';
import EventCard from './EventCard';

export default function EventList() {
  const { events, lanes, tags, people, places } = useDataStore();
  const { selectedEventId, setSelectedEventId } = useTimelineStore();
  const [searchText, setSearchText] = useState('');
  const [laneFilter, setLaneFilter] = useState('all');

  const tagLabelById = useMemo(() => {
    return new Map(tags.map((tag) => [tag.id, tag.label]));
  }, [tags]);

  const personNameById = useMemo(() => {
    return new Map(people.map((person) => [person.id, person.name || person.id]));
  }, [people]);

  const placeNameById = useMemo(() => {
    return new Map(places.map((place) => [place.id, place.name || place.id]));
  }, [places]);

  // For M1: show all events (no filtering yet)
  // In future PRs, this will be filtered based on selectedRange and filters
  const displayEvents = useMemo(() => {
    const normalizedQuery = searchText.trim().toLowerCase();
    return events.filter((event) => {
      if (laneFilter !== 'all' && event.categoryId !== laneFilter) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const tagLabels = event.tags
        .map((tagId) => tagLabelById.get(tagId))
        .filter(Boolean);

      const peopleNames = event.people
        .map((ref) => personNameById.get(ref.personId))
        .filter(Boolean);

      const placeNames = event.places
        .map((ref) => placeNameById.get(ref.placeId))
        .filter(Boolean);

      const searchableText = [
        event.title,
        event.summary,
        ...tagLabels,
        ...peopleNames,
        ...placeNames,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return searchableText.includes(normalizedQuery);
    });
  }, [events, laneFilter, personNameById, placeNameById, searchText, tagLabelById]);

  if (events.length === 0) {
    return (
      <div className="event-list-empty">
        <p>No events to display</p>
      </div>
    );
  }

  return (
    <div className="event-list">
      <h2>Events ({displayEvents.length} of {events.length})</h2>
      <div className="event-list-controls">
        <div className="event-search">
          <input
            id="event-search-input"
            type="search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search titles, tags, people, places"
            aria-label="Search events"
          />
          <button
            type="button"
            className="event-search-clear"
            onClick={() => setSearchText('')}
            disabled={!searchText}
            aria-label="Clear search"
          >
            Clear
          </button>
        </div>
        <div className="event-filter">
          <label htmlFor="lane-filter">Lane</label>
          <select
            id="lane-filter"
            value={laneFilter}
            onChange={(e) => setLaneFilter(e.target.value)}
          >
            <option value="all">All lanes</option>
            {lanes.map((lane) => (
              <option key={lane.id} value={lane.id}>
                {lane.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      {displayEvents.length === 0 ? (
        <div className="event-list-empty">
          <p>No events match your search.</p>
        </div>
      ) : (
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
      )}
    </div>
  );
}
