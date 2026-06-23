// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://turintechsolutions.com',
  build: {
    format: "directory",
    inlineStylesheets: "always",
  },
  integrations: [sitemap()],
});
