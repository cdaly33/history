export default function LoadingSpinner() {
  return (
    <div className="loading-spinner-container">
      <div className="loading-spinner">
        <svg viewBox="0 0 50 50" className="spinner-svg">
          <circle
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke="#d4af37"
            strokeWidth="3"
            strokeDasharray="31.4 126"
            className="spinner-circle"
          />
        </svg>
        <p>Loading historical data...</p>
      </div>
    </div>
  );
}
