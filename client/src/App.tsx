import { useEffect } from 'react';
import { useDataStore } from './stores/dataStore';
import TimelineViewport from './components/Timeline/TimelineViewport';
import EventList from './components/EventList/EventList';
import EventDetail from './components/EventDetail/EventDetail';
import { useTimelineStore } from './stores/timelineStore';

export default function App() {
  const { loaded, error, loadData } = useDataStore();
  const selectedEventId = useTimelineStore((state) => state.selectedEventId);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (error) {
    return (
      <div className="error-screen">
        <h1>Failed to load data</h1>
        <p>{error}</p>
        <button onClick={() => loadData()}>Retry</button>
      </div>
    );
  }

  if (!loaded) {
    return (
      <div className="loading-screen">
        <h1>Loading Roman History Timeline...</h1>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Roman History Interactive Timeline</h1>
      </header>

      <main className="app-main">
        <section className="timeline-section">
          <TimelineViewport />
        </section>

        <section className="content-section">
          <div className="event-list-container">
            <EventList />
          </div>
          <div className="event-detail-container">
            {selectedEventId ? <EventDetail /> : (
              <div className="detail-placeholder">
                <h2>Welcome to Roman History</h2>
                <p>Select an event from the timeline or list to view details.</p>
                <p>Use Shift+Drag on the timeline to select a date range.</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
