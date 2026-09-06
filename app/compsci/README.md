# CompSci Educational App

Educational web application for algorithms and data structures, powered by React and TypeScript.
Part of the [Nimbus Labs apps](../README.md); see the [repo root](../../README.md) for the full
project layout.

## Pages

- **Home** — landing page linking to compsci's visualizations
- [**Algorithms**](src/pages/algorithms/README.md) — landing page for the algorithm visualizations
  - [**Sorting**](src/pages/algorithms/sort/README.md) — step-by-step visualizations of sort
    algorithms, from classics (bubble, insertion, merge, quicksort, heap sort) to jokes (bogo sort)
  - [**Searching**](src/pages/algorithms/search/README.md) — step-by-step visualizations of linear
    search, binary search, and quickselect

## Features

- Interactive, step-by-step algorithm visualizations
- Material-UI components
- React Router for navigation
- Vitest for testing

## Development

```bash
# Install dependencies (from root)
npm install

# Run dev server
npm run dev -w compsci

# Run tests
npm test -w compsci

# Build for production
npm run build -w compsci

# Preview production build
npm run preview -w compsci
```

## Structure

```text
app/compsci/
├── src/
│   ├── common/          # Shared animation/selection/algorithm-shape helpers
│   ├── pages/            # Page components (home, algorithms/sort, algorithms/search)
│   ├── App.tsx           # Main app component
│   ├── main.tsx          # Entry point
│   └── *.css             # Styles
├── package.json
└── vite.config.ts
```

## Dependencies

- **[@nimbus-labs/ui](../../lib/ui/README.md)**: Shared theme, breadcrumbs, error boundary, and
  app-url helpers
- **React**: UI framework
- **Material-UI**: Component library
- **React Router**: Client-side routing
- **Vite**: Build tool and dev server
- **Vitest**: Test framework
