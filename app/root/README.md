# root

The Nimbus Labs portal — the landing page linking out to each sub-app ([bio](../bio/README.md),
[compsci](../compsci/README.md)) — deployed to its own Firebase Hosting site. See the
[apps overview](../README.md) for how this fits into the rest of the project.

## Development

```bash
# Install dependencies (from root)
npm install

# Run dev server
npm run dev -w root

# Run tests
npm test -w root

# Build for production
npm run build -w root

# Preview production build
npm run preview -w root
```

## Structure

```text
app/root/
├── src/
│   ├── pages/          # Page components
│   ├── App.tsx         # Main app component
│   ├── main.tsx        # Entry point
│   └── *.css           # Styles
├── package.json
└── vite.config.ts
```

## Dependencies

- **[@nimbus-labs/ui](../../lib/ui/README.md)**: Shared theme, breadcrumbs, error boundary, and
  app-url helpers
- **React**: UI framework
- **Material-UI**: Component library
- **Vite**: Build tool and dev server
