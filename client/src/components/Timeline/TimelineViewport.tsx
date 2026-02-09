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
    // Timeline spans from 509 BCE (-508) to 1453 CE (1453)
    const minYear = -508;
    const maxYear = 1453;
    const totalYears = maxYear - minYear;

    // Base scale before zoom
    const baseScale = scaleLinear()
      .domain([minYear, maxYear])
      .range([50, viewportWidth - 50]); // Margin on sides

    // Apply zoom transform
    const scaledDomain = [
      (minYear - zoomTransform.x / zoomTransform.k),
      (maxYear - zoomTransform.x / zoomTransform.k),
    ];

    return scaleLinear()
      .domain([minYear, maxYear])
      .range([50, viewportWidth - 50]);
  }, [viewportWidth, zoomTransform]);

  // Calculate visible domain for viewport culling
  const visibleDomain = useMemo((): [number, number] => {
    const inverted = scale.domain();
    return [inverted[0] || -508, inverted[1] || 1453];
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
    zoomTo(centerOffset - xPos, 0, zoomTransform.k);
  };

  const totalHeight = AXIS_HEIGHT + lanes.length * LANE_HEIGHT + 100;

  return (
    <div ref={containerRef} className="timeline-viewport-container">
      <ZoomControls
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onGoToYear={handleGoToYear}
        currentZoomLevel={zoomTransform.k}
      />

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
