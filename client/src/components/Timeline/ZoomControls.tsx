import { useState } from 'react';
import { parseYear } from '../../utils/historicalDate';

interface ZoomControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onGoToYear: (year: number) => void;
  currentZoomLevel: number;
}

export default function ZoomControls({
  onZoomIn,
  onZoomOut,
  onGoToYear,
  currentZoomLevel,
}: ZoomControlsProps) {
  const [yearInput, setYearInput] = useState('');
  const [eraToggle, setEraToggle] = useState<'CE' | 'BCE'>('CE');
  const [error, setError] = useState<string | null>(null);

  const handleGoToYear = () => {
    setError(null);
    if (!yearInput.trim()) {
      setError('Please enter a year');
      return;
    }
    const inputWithEra = `${yearInput} ${eraToggle}`;
    const year = parseYear(inputWithEra);
    if (year !== null) {
      onGoToYear(year);
      setYearInput('');
    } else {
      setError('Invalid year. Please enter a year between 1–9999');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleGoToYear();
    }
    if (e.key === 'Escape') {
      setYearInput('');
      setError(null);
    }
  };

  return (
    <div className="zoom-controls">
      <div className="zoom-buttons">
        <button onClick={onZoomOut} aria-label="Zoom out" title="Zoom out (–)">−</button>
        <span className="zoom-level" title="Current zoom level">Zoom: {currentZoomLevel.toFixed(1)}x</span>
        <button onClick={onZoomIn} aria-label="Zoom in" title="Zoom in (+)">+</button>
      </div>

      <div className="year-input-group">
        <div className="year-input-wrapper">
          <input
            type="number"
            value={yearInput}
            onChange={(e) => setYearInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter year (e.g., 50, 100)"
            className={`year-input ${error ? 'error' : ''}`}
            min="1"
            aria-invalid={!!error}
            aria-describedby={error ? 'year-error' : undefined}
          />
          <select
            value={eraToggle}
            onChange={(e) => setEraToggle(e.target.value as 'CE' | 'BCE')}
            className="era-toggle"
            aria-label="Select era"
          >
            <option value="BCE">BCE</option>
            <option value="CE">CE</option>
          </select>
          <button 
            onClick={handleGoToYear} 
            className="go-button"
            title="Go to year (Enter)"
            aria-label="Navigate to year"
          >
            Go
          </button>
        </div>
        {error && (
          <div className="year-error" id="year-error" role="alert">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
