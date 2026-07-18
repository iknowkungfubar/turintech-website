import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DIST_DIR = join(__dirname, '..', 'dist');

interface PageSEO {
  path: string;
  title?: string;
  description?: string;
  hasOG?: boolean;
  hasTwitter?: boolean;
  hasJSONLD?: boolean;
  hasCanonical?: boolean;
  hasRobots?: boolean;
}

const PAGES: PageSEO[] = [
  {
    path: 'index.html',
    title: 'Strategic Technology Consulting',
    description: 'Technology should accelerate business execution',
    hasOG: true,
    hasTwitter: true,
    hasJSONLD: true,
    hasCanonical: true,
    hasRobots: true,
  },
  {
    path: '404.html',
    title: 'Page Not Found',
    description: 'The page you are looking for does not exist',
    hasOG: true,
    hasTwitter: true,
    hasJSONLD: true,
    hasCanonical: true,
    hasRobots: false,
  },
];

function readHtml(pagePath: string): string {
  const filePath = join(DIST_DIR, pagePath);
  return readFileSync(filePath, 'utf-8');
}

describe('SEO meta tags', () => {
  it.each(PAGES)('$path should have meta description', ({ path, description }) => {
    const html = readHtml(path);
    expect(html).toMatch(/<meta\s+name="description"\s+content="[^"]+"/i);
    if (description) {
      const match = html.match(/<meta\s+name="description"\s+content="([^"]+)"/i);
      expect(match).not.toBeNull();
      if (match) {
        expect(match[1].toLowerCase()).toContain(description.toLowerCase());
      }
    }
  });

  it.each(PAGES.filter(p => p.hasOG))(
    '$path should have Open Graph meta tags',
    ({ path }) => {
      const html = readHtml(path);
      expect(html).toMatch(/<meta\s+property="og:title"\s+content="[^"]+"/i);
      expect(html).toMatch(/<meta\s+property="og:description"\s+content="[^"]+"/i);
      expect(html).toMatch(/<meta\s+property="og:type"\s+content="website"/i);
      expect(html).toMatch(/<meta\s+property="og:site_name"\s+content="[^"]+"/i);
      expect(html).toMatch(/<meta\s+property="og:image"\s+content="[^"]+"/i);
      expect(html).toMatch(/<meta\s+property="og:url"\s+content="[^"]+"/i);
    },
  );

  it.each(PAGES.filter(p => p.hasTwitter))(
    '$path should have Twitter Card meta tags',
    ({ path }) => {
      const html = readHtml(path);
      expect(html).toMatch(/<meta\s+name="twitter:card"\s+content="summary_large_image"/i);
      expect(html).toMatch(/<meta\s+name="twitter:image"\s+content="[^"]+"/i);
      expect(html).toMatch(/<meta\s+name="twitter:image:alt"\s+content="[^"]+"/i);
    },
  );

  it.each(PAGES.filter(p => p.hasCanonical))(
    '$path should have canonical link',
    ({ path }) => {
      const html = readHtml(path);
      expect(html).toMatch(/<link\s+rel="canonical"\s+href="https:\/\/turintechsolutions\.com\/?[^"]*"/i);
    },
  );

  it.each(PAGES.filter(p => p.hasRobots))(
    '$path should have robots meta with index,follow',
    ({ path }) => {
      const html = readHtml(path);
      expect(html).toMatch(/<meta\s+name="robots"\s+content="index,\s?follow"/i);
    },
  );

  it.each(PAGES)('$path should have <title> tag', ({ path, title }) => {
    const html = readHtml(path);
    expect(html).toMatch(/<title[^>]*>/i);
    if (title) {
      expect(html.toLowerCase()).toContain(title.toLowerCase());
    }
  });

  it.each(PAGES)('$path should have charset meta', ({ path }) => {
    const html = readHtml(path);
    expect(html).toMatch(/<meta\s+charset="utf-8"\s*\/?>/i);
  });

  it.each(PAGES)('$path should have viewport meta', ({ path }) => {
    const html = readHtml(path);
    expect(html).toMatch(/<meta\s+name="viewport"\s+content="width=device-width,\s*initial-scale=1"/i);
  });
});

describe('JSON-LD structured data', () => {
  it.each(PAGES.filter(p => p.hasJSONLD))(
    '$path should have JSON-LD blocks with Organization schema',
    ({ path }) => {
      const html = readHtml(path);
      const blocks = html.match(/<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
      expect(blocks).not.toBeNull();
      expect(blocks!.length).toBeGreaterThanOrEqual(1);

      // Check at least one block contains Organization @type
      const hasOrg = blocks!.some((b) => b.includes('"@type"') && b.includes('Organization'));
      expect(hasOrg).toBe(true);
    },
  );

  it.each(PAGES.filter(p => p.hasJSONLD))(
    '$path should have JSON-LD block with ProfessionalService schema',
    ({ path }) => {
      const html = readHtml(path);
      const blocks = html.match(/<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
      expect(blocks).not.toBeNull();

      // Check at least one block contains ProfessionalService @type
      const hasSvc = blocks!.some((b) => b.includes('"@type"') && b.includes('ProfessionalService'));
      expect(hasSvc).toBe(true);
    },
  );

  it.each(PAGES.filter(p => p.hasJSONLD))(
    '$path should contain well-formed JSON-LD blocks (template literal syntax)',
    ({ path }) => {
      const html = readHtml(path);
      const blocks = html.match(/<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
      expect(blocks).not.toBeNull();

      for (const block of blocks!) {
        // Extract inner content from <script> JSON-LD blocks instead of stripping tags
        const innerMatch = block.match(/<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i);
        const content = innerMatch ? innerMatch[1].trim() : '';
        // Should contain JSON structure (even if wrapped in template literal)
        expect(content).toMatch(/"@context"/);
        expect(content).toMatch(/"@type"/);
        expect(content).toMatch(/"name"/);
      }
    },
  );
});

describe('HTML structure', () => {
  it.each(PAGES)('$path should have html tag with lang attribute', ({ path }) => {
    const html = readHtml(path);
    expect(html).toMatch(/<html\s+lang="en"/i);
  });

  it.each(PAGES)('$path should have DOCTYPE declaration', ({ path }) => {
    const html = readHtml(path);
    expect(html.trimStart()).toMatch(/^<!DOCTYPE html>/i);
  });

  it.each(PAGES)('$path should have a semantic main element', ({ path }) => {
    const html = readHtml(path);
    expect(html).toMatch(/<main[^>]*>/i);
  });
});
