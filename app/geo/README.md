# Geology Educational App

Educational web application for geology topics, powered by React and TypeScript. Part of the
[Nimbus Labs apps](../README.md); see the [repo root](../../README.md) for the full project layout.

## Pages

- **Home** — landing page linking to geo's visualizations
- [**A Dive Through Deep Time**](src/pages/dive/README.md) — scroll down from today to the formation
  of Earth, reading off the state of the planet at every division of the geologic time scale

## Features

- Uses `@nimbus-labs/deeptime` for the geologic time scale and for the
  [state of the planet](../../lib/deeptime/EARTH_STATE.md) along it
- Material-UI components
- React Router for navigation
- Vitest for testing

## Development

```bash
# Install dependencies (from root)
npm install

# Run dev server
npm run dev -w geo

# Run tests
npm test -w geo

# Build for production
npm run build -w geo

# Preview production build
npm run preview -w geo
```

## Structure

```text
app/geo/
├── src/
│   ├── components/     # Dive-specific components (strata, depth rail, fact panel)
│   ├── pages/          # Page components
│   ├── utils/          # Spine, geometry, and fact formatting
│   ├── App.tsx         # Main app component
│   ├── main.tsx        # Entry point
│   └── *.css           # Styles
├── package.json
└── vite.config.ts
```

The components under `src/components/` are all specific to the dive, so they live here rather than
in [`@nimbus-labs/ui`](../../lib/ui/README.md). If a second page ever wants a strata column or a
fact panel, that's the point to factor them out.

## Dependencies

- **[@nimbus-labs/deeptime](../../lib/deeptime/README.md)**: Framework-agnostic geologic time scale,
  Earth state, and temporal graph library
- **[@nimbus-labs/ui](../../lib/ui/README.md)**: Shared theme, breadcrumbs, error boundary, and
  app-url helpers
- **React**: UI framework
- **Material-UI**: Component library
- **React Router**: Client-side routing
- **Vite**: Build tool and dev server
- **Vitest**: Test framework
