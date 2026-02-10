import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, afterEach, describe, expect, it } from 'vitest';
import EventList from './EventList';
import { useDataStore } from '../../stores/dataStore';
import { useTimelineStore } from '../../stores/timelineStore';
import type { TimelineEvent, Lane, Tag, Person, Place } from '../../../../shared/types';

type TestData = {
  events: TimelineEvent[];
  lanes: Lane[];
  tags: Tag[];
  people: Person[];
  places: Place[];
};

const baseDate = { year: -43, precision: 'year', approximate: false } as const;

const buildTestData = (): TestData => {
  const lanes: Lane[] = [
    { id: 'politics', label: 'Politics', color: '#8B4513', order: 1 },
    { id: 'military', label: 'Military', color: '#2B4C7E', order: 2 },
  ];

  const tags: Tag[] = [
    { id: 'civil-war', label: 'Civil War' },
    { id: 'reform', label: 'Reform' },
  ];

  const people: Person[] = [
    { id: 'caesar', name: 'Julius Caesar' },
  ];

  const places: Place[] = [
    { id: 'rome', name: 'Rome' },
  ];

  const events: TimelineEvent[] = [
    {
      id: 'crossing-the-rubicon',
      type: 'point',
      title: 'Crossing the Rubicon',
      date: baseDate,
      summary: 'Caesar crosses the Rubicon, sparking civil war.',
      narrative: 'Caesar crosses the Rubicon.',
      categoryId: 'military',
      tags: ['civil-war'],
      people: [{ personId: 'caesar', role: 'commander' }],
      places: [{ placeId: 'rome', context: 'capital' }],
      images: [],
      sources: [],
      relatedEventIds: [],
    },
    {
      id: 'senate-reforms',
      type: 'point',
      title: 'Senate Reforms',
      date: baseDate,
      summary: 'Political reforms reshape the Roman Senate.',
      narrative: 'Reforms take place.',
      categoryId: 'politics',
      tags: ['reform'],
      people: [],
      places: [],
      images: [],
      sources: [],
      relatedEventIds: [],
    },
  ];

  return { events, lanes, tags, people, places };
};

const setStores = (data: TestData) => {
  useDataStore.setState({
    events: data.events,
    lanes: data.lanes,
    tags: data.tags,
    people: data.people,
    places: data.places,
  });
  useTimelineStore.setState({ selectedEventId: null });
};

beforeEach(() => {
  const data = buildTestData();
  setStores(data);
});

afterEach(() => {
  useDataStore.setState({
    events: [],
    lanes: [],
    tags: [],
    people: [],
    places: [],
  });
  useTimelineStore.setState({ selectedEventId: null });
});

describe('EventList', () => {
  it('filters events by search text across tags and people', async () => {
    render(<EventList />);

    const searchInput = screen.getByLabelText('Search events');
    await userEvent.type(searchInput, 'civil');

    expect(screen.getByText('Crossing the Rubicon')).toBeInTheDocument();
    expect(screen.queryByText('Senate Reforms')).not.toBeInTheDocument();
  });

  it('filters events by lane selection', async () => {
    render(<EventList />);

    const laneSelect = screen.getByLabelText('Lane');
    await userEvent.selectOptions(laneSelect, 'politics');

    expect(screen.getByText('Senate Reforms')).toBeInTheDocument();
    expect(screen.queryByText('Crossing the Rubicon')).not.toBeInTheDocument();
  });
});
