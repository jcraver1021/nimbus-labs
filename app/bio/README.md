# Biology Educational App

Educational web application for biology topics, powered by React and TypeScript.

## Features

- Uses `@nimbus-labs/deeptime` for evolutionary biology and geologic time visualizations
- Material-UI components
- React Router for navigation
- Vitest for testing

## Development

```bash
# Install dependencies (from root)
npm install

# Run dev server
npm run dev -w bio

# Run tests
npm test -w bio

# Build for production
npm run build -w bio

# Preview production build
npm run preview -w bio
```

## Structure

```text
app/bio/
├── src/
│   ├── pages/          # Page components
│   ├── App.tsx         # Main app component
│   ├── main.tsx        # Entry point
│   └── *.css           # Styles
├── package.json
└── vite.config.ts
```

## Dependencies

- **@nimbus-labs/deeptime**: Framework-agnostic temporal graph library for geologic time
- **React**: UI framework
- **Material-UI**: Component library
- **React Router**: Client-side routing
- **Vite**: Build tool and dev server
- **Vitest**: Test framework
