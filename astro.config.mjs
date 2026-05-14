// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://turintechsolutions.com',
  base: '/turintech-website',
  build: {
    format: 'directory',
  },
});
