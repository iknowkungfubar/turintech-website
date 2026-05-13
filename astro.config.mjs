// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://iknowkungfubar.github.io',
  base: '/turintech-website',
  build: {
    format: 'directory',
  },
});
