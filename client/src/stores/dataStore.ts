import { create } from 'zustand';
import type {
  TimelineEvent,
  Lane,
  EraBand,
  Tag,
  Person,
  Place,
  TourPlaylist,
} from '../../../shared/types';

interface DataState {
  events: TimelineEvent[];
  lanes: Lane[];
  eras: EraBand[];
  tags: Tag[];
  people: Person[];
  places: Place[];
  tours: TourPlaylist[];
  loaded: boolean;
  error: string | null;
  loadData: () => Promise<void>;
}

export const useDataStore = create<DataState>((set) => ({
  events: [],
  lanes: [],
  eras: [],
  tags: [],
  people: [],
  places: [],
  tours: [],
  loaded: false,
  error: null,

  loadData: async () => {
    try {
      const [eventsRes, lanesRes, erasRes, tagsRes, peopleRes, placesRes, toursRes] =
        await Promise.all([
          fetch('/data/events.json'),
          fetch('/data/lanes.json'),
          fetch('/data/eras.json'),
          fetch('/data/tags.json'),
          fetch('/data/people.json'),
          fetch('/data/places.json'),
          fetch('/data/tours.json'),
        ]);

      if (!eventsRes.ok || !lanesRes.ok || !erasRes.ok || !tagsRes.ok || !peopleRes.ok || !placesRes.ok || !toursRes.ok) {
        throw new Error('Failed to load data files');
      }

      const [events, lanes, eras, tags, people, places, tours] = await Promise.all([
        eventsRes.json() as Promise<TimelineEvent[]>,
        lanesRes.json() as Promise<Lane[]>,
        erasRes.json() as Promise<EraBand[]>,
        tagsRes.json() as Promise<Tag[]>,
        peopleRes.json() as Promise<Person[]>,
        placesRes.json() as Promise<Place[]>,
        toursRes.json() as Promise<TourPlaylist[]>,
      ]);

      set({
        events,
        lanes,
        eras,
        tags,
        people,
        places,
        tours,
        loaded: true,
        error: null,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error loading data',
        loaded: false,
      });
    }
  },
}));
