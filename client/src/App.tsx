import { useEffect } from 'react';
import { useDataStore } from './stores/dataStore';
import TimelineViewport from './components/Timeline/TimelineViewport';
import EventList from './components/EventList/EventList';
import EventDetail from './components/EventDetail/EventDetail';
import LoadingSpinner from './components/common/LoadingSpinner';
import { useTimelineStore } from './stores/timelineStore';
import { useKeyboardNav } from './hooks/useKeyboardNav';

export default function App() {
  const { loaded, error, loadData } = useDataStore();
  const selectedEventId = useTimelineStore((state) => state.selectedEventId);
  
  // Enable keyboard navigation
  useKeyboardNav();

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
    return <LoadingSpinner />;
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
                <h2>Welcome to the Roman History Timeline</h2>
                <div className="welcome-guide">
                  <p><strong>Getting started:</strong></p>
                  <ul>
                    <li>Click on any event marker on the timeline to view details</li>
                    <li>Select an event from the list on the left to highlight it</li>
                    <li>Use the zoom controls to navigate different time periods</li>
                    <li>Hover over events to see additional information</li>
                  </ul>
                  <p><strong>Timeline spans:</strong> 509 BCE to 1453 CE, from the Republic to the Fall of Constantinople</p>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
