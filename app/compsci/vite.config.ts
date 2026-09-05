import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react-swc';
import 'vitest/config';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/vitest.setup.ts'],
    slowTestThreshold: 1000, // the array test takes more than 300ms but that's fine
  },
});
