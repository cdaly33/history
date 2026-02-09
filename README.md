# Roman History Interactive Timeline

An interactive museum-like timeline web app exploring Roman history from 509 BCE to 1453 CE (Fall of Constantinople).

## Status: Milestone #1 Complete ✓

### What's Implemented

**Core Architecture**
- ✓ React 18 + Vite + TypeScript (strict mode)
- ✓ Zustand state management (dataStore, timelineStore, filterStore, tourStore)
- ✓ SVG timeline with d3-zoom + d3-scale for interactive pan/zoom
- ✓ Museum-themed design (Playfair Display serif, warm parchment aesthetic)
- ✓ Comprehensive type system supporting BCE/CE dates with partial precision

**Rendering**
- ✓ Timeline axis with adaptive tick density (century → decade → year labels)
- ✓ Era bands (Republic, Principate, Crisis, Dominate, Western/Eastern split)
- ✓ Multi-lane event display (military, politics, emperors, culture/religion)
- ✓ Point markers (● circles) and range bars for events
- ✓ 12 seed events spanning full timeline (509 BCE – 1453 CE)

**User Interactions**
- ✓ Mouse wheel zoom (1x to 100x scale)
- ✓ Click-drag pan across timeline
- ✓ Zoom in/out buttons + zoom slider
- ✓ Year input field with BCE/CE toggle
- ✓ Click event markers → select event → populate detail panel

**Event Details**
- ✓ Event card list (title, date, summary, tags)
- ✓ Detail panel with full Markdown narrative
- ✓ Image gallery with captions, attribution, license metadata
- ✓ Structured sources/citations list with "verified" vs "unverified" badges
- ✓ People and places chips

**Date Handling**
- ✓ Astronomical year numbering (1 BCE = 0, 2 BCE = -1, 1 CE = 1)
- ✓ No year-zero display (goes 2 BCE → 1 BCE → 1 CE)
- ✓ Partial date support (year-only, month/year, full date)
- ✓ Approximate dates ("c. 509 BCE")
- ✓ Decade and century display formatting

**Testing & CI**
- ✓ 31 unit tests for historicalDate utilities (100% pass)
- ✓ 2 Playwright E2E tests (timeline loads, event selection)
- ✓ GitHub Actions CI pipeline (validate, build, test)

## Quick Start

```bash
# Install dependencies
npm install

# Development server
npm run dev
# Opens http://localhost:5173

# Build for production
npm run build

# Run unit tests
npm run test:unit

# Run E2E tests (requires built app)
npm run test:e2e
```

## Project Structure

```
/
├── client/              # React + Vite app
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── stores/      # Zustand state
│   │   ├── hooks/       # Custom hooks (useZoom, etc.)
│   │   ├── utils/       # Date utilities, helpers
│   │   └── styles/      # CSS (global, theme, timeline)
│   └── public/data/     # JSON seed data (events, lanes, etc.)
├── shared/              # TypeScript types & schemas
├── tests/               # Playwright E2E tests
└── .github/workflows/   # GitHub Actions CI
```

## Data Model

All events stored as JSON with types enforcing:
- **HistoricalDate**: year (astronomical), month?, day?, precision, approximate flag
- **TimelineEvent**: id, type (point/range/reign/era-band), date(s), narrative, sources
- **Sources**: author, title, publication, year, url, `verified: boolean`
- **ImageMeta**: url, caption, attribution, license, sourcePageUrl

## Deferred to Future PRs

- Range drag-selection on timeline (shift+drag)
- Filter bar (era, category, tags, people, places)
- Text search
- Tour mode (guided highlight playlists)
- Virtualized event list (for 1000+ events)
- Full lane stacking algorithm
- Lightbox component for image expansion
- Mobile responsiveness
- Azure Static Web Apps deployment config
- Data validation with Zod schemas

## Known Limitations (M1)

- Selection only via clicking markers (no drag-range)
- All 12 events always displayed (no filtering)
- No tour mode yet
- Single-row per lane (no overlap stacking)
- Zoom transitions disabled (for TS compatibility — re-enable with d3-transition)

## Next Steps (PR #2-#10)

1. **PR 2**: HistoricalDate utilities → DONE this PR
2. **PR 3**: Timeline viewport + axis + zoom/pan → DONE this PR
3. **PR 4**: Event markers + lanes + layout algorithm
4. **PR 5**: Selection + event list + cards
5. **PR 6**: Event detail panel + Markdown + sources + images → DONE this PR
6. **PR 7**: Filters + search
7. **PR 8**: Tour mode
8. **PR 9**: Full 200-event dataset
9. **PR 10**: Playwright E2E tests + Azure deploy

## Museum Aesthetic

- **Color**: Bronze (#8B4513), Gold (#D4AF37), Parchment (#f5f1e8)
- **Typography**: Playfair Display (headings), Inter (body)
- **Interactivity**: Subtle shadows, color transitions, focus states
- **Spacing**: Generous margins reflecting exhibition layout

## References

Building a historically accurate, user-friendly timeline interface with robust date handling across the largest span of Western history.
