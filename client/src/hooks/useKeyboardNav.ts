import { useEffect } from 'react';
import { useTimelineStore } from '../stores/timelineStore';
import { useDataStore } from '../stores/dataStore';

export function useKeyboardNav() {
  const { selectedEventId, setSelectedEventId, clearSelection } = useTimelineStore();
  const events = useDataStore((state) => state.events) ?? [];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if typing in an input
      const target = e.target as HTMLElement;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLSelectElement ||
        target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (events.length === 0) return;

      const currentIndex = events.findIndex((ev: { id: string }) => ev.id === selectedEventId);

      switch (e.key) {
        case 'Escape':
          clearSelection();
          break;
        case 'ArrowDown':
        case 'ArrowRight':
          e.preventDefault();
          if (currentIndex === -1 && events.length > 0) {
            const firstEvent = events[0];
            if (firstEvent) setSelectedEventId(firstEvent.id);
          } else if (currentIndex >= 0 && currentIndex < events.length - 1) {
            const nextEvent = events[currentIndex + 1];
            if (nextEvent) setSelectedEventId(nextEvent.id);
          }
          break;
        case 'ArrowUp':
        case 'ArrowLeft':
          e.preventDefault();
          if (currentIndex > 0) {
            const prevEvent = events[currentIndex - 1];
            if (prevEvent) setSelectedEventId(prevEvent.id);
          }
          break;
        case 'Home':
          e.preventDefault();
          if (events.length > 0) {
            const firstEvent = events[0];
            if (firstEvent) setSelectedEventId(firstEvent.id);
          }
          break;
        case 'End':
          e.preventDefault();
          if (events.length > 0) {
            const lastEvent = events[events.length - 1];
            if (lastEvent) setSelectedEventId(lastEvent.id);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedEventId, events, setSelectedEventId, clearSelection]);
}
