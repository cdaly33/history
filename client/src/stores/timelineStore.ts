import { create } from 'zustand';
import type { HistoricalDateRange } from '../../../shared/types';

export interface ZoomTransform {
  x: number;  // Pan offset in pixels
  y: number;
  k: number;  // Scale factor
}

interface TimelineState {
  // Zoom/pan state
  zoomTransform: ZoomTransform;
  viewportWidth: number;

  // Selection state
  selectedRange: HistoricalDateRange | null;
  selectedEventId: string | null;

  // Actions
  setZoomTransform: (transform: ZoomTransform) => void;
  setViewportWidth: (width: number) => void;
  setSelectedRange: (range: HistoricalDateRange | null) => void;
  setSelectedEventId: (id: string | null) => void;
  clearSelection: () => void;
}

export const useTimelineStore = create<TimelineState>((set) => ({
  // Initial state
  zoomTransform: { x: 0, y: 0, k: 1 },
  viewportWidth: 1200,
  selectedRange: null,
  selectedEventId: null,

  // Actions
  setZoomTransform: (transform) => set({ zoomTransform: transform }),
  setViewportWidth: (width) => set({ viewportWidth: width }),
  setSelectedRange: (range) => set({ selectedRange: range, selectedEventId: null }),
  setSelectedEventId: (id) => set({ selectedEventId: id, selectedRange: null }),
  clearSelection: () => set({ selectedRange: null, selectedEventId: null }),
}));
