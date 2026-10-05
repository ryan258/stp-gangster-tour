import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/unit/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    exclude: ['tests/browser/**/*', 'node_modules', 'dist'],
  },
});
