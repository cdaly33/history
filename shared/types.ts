// ──── Roman History Timeline — Core Types ────

// === Date Types ===

export type DatePrecision = 'exact' | 'month' | 'year' | 'decade' | 'century';

export interface HistoricalDate {
  year: number;             // Astronomical: 1 BCE = 0, 2 BCE = -1, 1 CE = 1
  month?: number;           // 1–12
  day?: number;             // 1–31
  precision: DatePrecision;
  approximate: boolean;     // true = "c." prefix
  calendarNote?: string;    // e.g. "Julian calendar", "traditional date"
}

export interface HistoricalDateRange {
  start: HistoricalDate;
  end: HistoricalDate;
}

// === Core Entity Types ===

export type EventType = 'point' | 'range' | 'reign' | 'era-band';

export interface ImageMeta {
  url: string;
  caption: string;
  attribution: string;
  license: string;            // "Public Domain", "CC BY-SA 4.0", "unknown"
  sourcePageUrl?: string;
}

export interface Source {
  id: string;
  type: 'ancient-primary' | 'modern-secondary' | 'web' | 'other';
  author?: string;
  title: string;
  publication?: string;      // Journal, publisher, or website name
  year?: number;
  url?: string;
  accessedDate?: string;     // ISO date string
  verified: boolean;
  notes?: string;
}

export interface PersonRef {
  personId: string;
  role?: string;              // "commander", "emperor", "victim"
}

export interface PlaceRef {
  placeId: string;
  context?: string;           // "battle site", "capital"
}

export interface TimelineEvent {
  id: string;                 // Kebab-case, unique. e.g. "battle-of-actium"
  type: EventType;
  title: string;
  date: HistoricalDate;
  endDate?: HistoricalDate;   // Required for 'range' | 'reign' | 'era-band'
  summary: string;            // 1–2 sentences for card
  narrative: string;          // Markdown string for detail view
  categoryId: string;         // FK → Lane.id
  tags: string[];             // FK → Tag.id[]
  people: PersonRef[];
  places: PlaceRef[];
  images: ImageMeta[];
  sources: Source[];
  relatedEventIds: string[];
}

// === Taxonomy Types ===

export interface Lane {
  id: string;
  label: string;
  color: string;              // Hex, e.g. "#8B0000"
  order: number;              // Top-to-bottom display order
}

export interface EraBand {
  id: string;
  label: string;
  start: HistoricalDate;
  end: HistoricalDate;
  color: string;              // Hex with alpha applied in CSS
  order: number;
}

export interface Tag {
  id: string;
  label: string;
  category?: string;
}

export interface Person {
  id: string;
  name: string;
  born?: HistoricalDate;
  died?: HistoricalDate;
  title?: string;
  shortBio?: string;
}

export interface Place {
  id: string;
  name: string;
  modernName?: string;
  latitude?: number;
  longitude?: number;
}

// === Tour Types ===

export interface TourStep {
  eventId: string;            // FK → TimelineEvent.id
  narration: string;          // 1–2 sentences shown in tour strip
  zoomLevel?: number;         // Optional zoom override (scale factor)
}

export interface TourPlaylist {
  id: string;
  title: string;
  description: string;
  steps: TourStep[];
}

// === Data Bundle ===

export interface AppData {
  events: TimelineEvent[];
  lanes: Lane[];
  eras: EraBand[];
  tags: Tag[];
  people: Person[];
  places: Place[];
  tours: TourPlaylist[];
}
