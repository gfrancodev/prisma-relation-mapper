import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/@prisma/utils/map-relations.ts'],
      exclude: ['**/node_modules/**', '**/dist/**', '**/src/example/**', '**/*.spec.ts', '**/*.test.ts']
    }
  }
});
