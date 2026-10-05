import { defineConfig } from 'vitest/config';

// https://vite.dev/config/
export default defineConfig({
  test: {
    open: false,
    environment: 'happy-dom',
    include: ['src/**/*.spec.ts'],
    isolate: false,
  },
});
