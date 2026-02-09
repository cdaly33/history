import { useEffect, useRef } from 'react';
import { select, type Selection } from 'd3-selection';
import { zoom as d3Zoom, zoomIdentity, type D3ZoomEvent, type ZoomBehavior } from 'd3-zoom';
import { useTimelineStore, type ZoomTransform } from '../stores/timelineStore';

interface UseZoomOptions {
  minScale?: number;
  maxScale?: number;
  onZoom?: (transform: ZoomTransform) => void;
}

/**
 * Custom hook that integrates d3-zoom with React and Zustand.
 * Attaches zoom behavior to an SVG element and syncs transforms to the store.
 */
export function useZoom(
  svgRef: React.RefObject<SVGSVGElement>,
  options: UseZoomOptions = {}
) {
  const { minScale = 1, maxScale = 100 } = options;
  const zoomBehaviorRef = useRef<ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const setZoomTransform = useTimelineStore((state) => state.setZoomTransform);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    // Create zoom behavior
    const zoomBehavior = d3Zoom<SVGSVGElement, unknown>()
      .scaleExtent([minScale, maxScale])
      .on('zoom', (event: D3ZoomEvent<SVGSVGElement, unknown>) => {
        const transform = {
          x: event.transform.x,
          y: event.transform.y,
          k: event.transform.k,
        };
        setZoomTransform(transform);
      });

    // Apply zoom behavior to SVG
    const selection = select(svg);
    selection.call(zoomBehavior);

    // Store reference for programmatic control
    zoomBehaviorRef.current = zoomBehavior;

    return () => {
      // Cleanup: remove zoom behavior
      selection.on('.zoom', null);
    };
  }, [svgRef, minScale, maxScale, setZoomTransform]);

  // Return functions for programmatic zoom control
  return {
    zoomTo: (x: number, y: number, scale: number) => {
      const svg = svgRef.current;
      const behavior = zoomBehaviorRef.current;
      if (!svg || !behavior) return;

      const selection = select(svg) as any;
      const transform = zoomIdentity.translate(x, y).scale(scale);
      selection.call(behavior.transform, transform);
    },
    zoomIn: () => {
      const svg = svgRef.current;
      const behavior = zoomBehaviorRef.current;
      if (!svg || !behavior) return;

      const selection = select(svg) as any;
      selection.call(behavior.scaleBy, 1.5);
    },
    zoomOut: () => {
      const svg = svgRef.current;
      const behavior = zoomBehaviorRef.current;
      if (!svg || !behavior) return;

      const selection = select(svg) as any;
      selection.call(behavior.scaleBy, 1 / 1.5);
    },
  };
}
