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

  const handleGoToYear = () => {
    const inputWithEra = `${yearInput} ${eraToggle}`;
    const year = parseYear(inputWithEra);
    if (year !== null) {
      onGoToYear(year);
      setYearInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleGoToYear();
    }
  };

  return (
    <div className="zoom-controls">
      <div className="zoom-buttons">
        <button onClick={onZoomOut} aria-label="Zoom out">−</button>
        <span className="zoom-level">Zoom: {currentZoomLevel.toFixed(1)}x</span>
        <button onClick={onZoomIn} aria-label="Zoom in">+</button>
      </div>

      <div className="year-input-group">
        <input
          type="number"
          value={yearInput}
          onChange={(e) => setYearInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Year"
          className="year-input"
          min="1"
        />
        <select
          value={eraToggle}
          onChange={(e) => setEraToggle(e.target.value as 'CE' | 'BCE')}
          className="era-toggle"
        >
          <option value="BCE">BCE</option>
          <option value="CE">CE</option>
        </select>
        <button onClick={handleGoToYear} className="go-button">
          Go
        </button>
      </div>
    </div>
  );
}
