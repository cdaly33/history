import { useRef, useEffect, useMemo } from 'react';
import { scaleLinear } from 'd3-scale';
import { useDataStore } from '../../stores/dataStore';
import { useTimelineStore } from '../../stores/timelineStore';
import { useZoom } from '../../hooks/useZoom';
import { toCoordinate } from '../../utils/historicalDate';
import TimelineAxis from './TimelineAxis';
import EraBands from './EraBands';
import LaneRow from './LaneRow';
import ZoomControls from './ZoomControls';
import '../../styles/timeline.css';

const TIMELINE_HEIGHT = 600;
const AXIS_HEIGHT = 60;
const LANE_HEIGHT = 80;
const MIN_YEAR = -508;
const MAX_YEAR = 1453;

export default function TimelineViewport() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { events, lanes, eras } = useDataStore();
  const { zoomTransform, viewportWidth, setViewportWidth } = useTimelineStore();

  // Initialize zoom behavior
  const { zoomIn, zoomOut, zoomTo } = useZoom(svgRef, {
    minScale: 1,
    maxScale: 100,
  });

  // Update viewport width on resize
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setViewportWidth(containerRef.current.clientWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, [setViewportWidth]);

  // Create scale: astronomical year -> pixel x-coordinate
  const scale = useMemo(() => {
    // Base scale before zoom
    return scaleLinear()
      .domain([MIN_YEAR, MAX_YEAR])
      .range([50, viewportWidth - 50]);
  }, [viewportWidth, zoomTransform]);

  // Calculate visible domain for viewport culling
  const visibleDomain = useMemo((): [number, number] => {
    const inverted = scale.domain();
    return [inverted[0] || MIN_YEAR, inverted[1] || MAX_YEAR];
  }, [scale]);

  // Group events by lane
  const eventsByLane = useMemo(() => {
    const grouped = new Map<string, typeof events>();
    lanes.forEach((lane) => {
      grouped.set(
        lane.id,
        events.filter((e) => e.categoryId === lane.id)
      );
    });
    return grouped;
  }, [events, lanes]);

  const handleGoToYear = (year: number) => {
    const xPos = scale(year);
    const centerOffset = viewportWidth / 2;
    zoomTo(centerOffset - xPos * zoomTransform.k, 0, zoomTransform.k);
  };

  const handleRecenter = () => {
    const centerYear = (MIN_YEAR + MAX_YEAR) / 2;
    const centerOffset = viewportWidth / 2;
    const xPos = scale(centerYear);
    zoomTo(centerOffset - xPos * zoomTransform.k, 0, zoomTransform.k);
  };

  const handleFitAll = () => {
    zoomTo(0, 0, 1);
  };

  const currentCenterYear = useMemo(() => {
    const centerOffset = viewportWidth / 2;
    const worldX = (centerOffset - zoomTransform.x) / zoomTransform.k;
    const year = scale.invert(worldX);
    return Math.max(MIN_YEAR, Math.min(MAX_YEAR, year));
  }, [scale, viewportWidth, zoomTransform]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLSelectElement ||
        target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        zoomIn();
      }

      if (e.key === '-' || e.key === '_') {
        e.preventDefault();
        zoomOut();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [zoomIn, zoomOut]);

  const totalHeight = AXIS_HEIGHT + lanes.length * LANE_HEIGHT + 100;

  return (
    <div ref={containerRef} className="timeline-viewport-container">
      <ZoomControls
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onGoToYear={handleGoToYear}
        onResetView={handleRecenter}
        onFitAll={handleFitAll}
        currentZoomLevel={zoomTransform.k}
        minYear={MIN_YEAR}
        maxYear={MAX_YEAR}
        centerYear={currentCenterYear}
      />

      <div className="timeline-legend">
        <div className="legend-section">
          <span className="legend-title">Lanes</span>
          <div className="legend-items">
            {lanes.map((lane) => (
              <div key={lane.id} className="legend-item">
                <span className="legend-swatch" style={{ backgroundColor: lane.color }} />
                <span>{lane.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="legend-section">
          <span className="legend-title">Event types</span>
          <div className="legend-items">
            <div className="legend-item"><span className="legend-symbol">●</span>Point</div>
            <div className="legend-item"><span className="legend-symbol">▬</span>Range</div>
            <div className="legend-item"><span className="legend-symbol">👑</span>Reign</div>
            <div className="legend-item"><span className="legend-symbol">═</span>Era band</div>
          </div>
        </div>
      </div>

      <svg
        ref={svgRef}
        width={viewportWidth}
        height={totalHeight}
        className="timeline-svg"
      >
        {/* Era bands (behind everything) */}
        <EraBands eras={eras} scale={scale} height={totalHeight - AXIS_HEIGHT} />

        {/* Main timeline group with zoom transform */}
        <g transform={`translate(${zoomTransform.x}, ${zoomTransform.y}) scale(${zoomTransform.k})`}>
          {/* Lanes with events */}
          {lanes.map((lane, index) => (
            <LaneRow
              key={lane.id}
              lane={lane}
              events={eventsByLane.get(lane.id) || []}
              scale={scale}
              yOffset={index * LANE_HEIGHT}
            />
          ))}
        </g>

        {/* Axis (not transformed, stays fixed) */}
        <g transform={`translate(0, ${totalHeight - AXIS_HEIGHT})`}>
          <TimelineAxis
            scale={scale}
            height={AXIS_HEIGHT}
            visibleDomain={visibleDomain}
            zoomLevel={zoomTransform.k}
          />
        </g>
      </svg>
    </div>
  );
}
