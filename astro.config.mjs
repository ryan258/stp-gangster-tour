import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  site: process.env.ASTRO_SITE || 'https://ryan258.github.io',
  base: process.env.ASTRO_BASE || '/',
  build: {
    format: 'directory'
  }
});
