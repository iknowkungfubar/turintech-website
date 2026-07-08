import { describe, it, expect, beforeAll } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const REPO_ROOT = join(__dirname, '..');
const DIST_DIR = join(REPO_ROOT, 'dist');

const PAGE_PATHS = [
  'index.html',
  '404.html',
];

/** Known external URL patterns to skip */
const EXTERNAL_PREFIXES = ['https://', 'http://', 'mailto:', 'javascript:', 'tel:', 'data:'];

beforeAll(() => {
  if (!existsSync(DIST_DIR)) {
    execSync('bun run build', { cwd: REPO_ROOT, stdio: 'pipe' });
  }
});

function readHtml(pagePath: string): string {
  return readFileSync(join(DIST_DIR, pagePath), 'utf-8');
}

/** Build a set of all actual page paths in the dist directory */
function getExistingPages(): Set<string> {
  const pages = new Set<string>();
  // Placeholder — actual directory walking not yet implemented
  return pages;
}

/**
 * Extract unique href values from anchor tags in HTML.
 * Returns non-fragment, non-external hrefs with the leading / and # stripped.
 */
function extractInternalLinks(html: string): string[] {
  const links: string[] = [];
  const anchorRegex = /<a[^>]+href=["']([^"']+)["']/gi;
  let match: RegExpExecArray | null;
  while ((match = anchorRegex.exec(html)) !== null) {
    const href = match[1];
    // Skip external, fragment-only, mailto, javascript:
    if (EXTERNAL_PREFIXES.some((p) => href.startsWith(p))) continue;
    if (href.startsWith('#')) continue; // fragment-only — same page
    if (href === '' || href === '/' || href.startsWith('//')) continue;
    links.push(href);
  }
  return [...new Set(links)];
}

/** Check if a path (as used in href) corresponds to a real file in dist */
function pathExistsInDist(href: string): boolean {
  // Strip leading /
  let clean = href.startsWith('/') ? href.slice(1) : href;

  // Remove fragment
  const hashIdx = clean.indexOf('#');
  if (hashIdx >= 0) clean = clean.slice(0, hashIdx);

  if (!clean) return true; // just a fragment on root — valid

  const candidates = [
    clean,
    join(clean, 'index.html'),
    clean.endsWith('.html') ? clean : `${clean}.html`,
    clean.endsWith('/') ? `${clean}index.html` : null,
  ].filter(Boolean) as string[];

  return candidates.some((c) => existsSync(join(DIST_DIR, c)));
}

describe('Link integrity', () => {
  it.each(PAGE_PATHS)('$path should not have broken internal links', (pagePath) => {
    const html = readHtml(pagePath);
    const links = extractInternalLinks(html);
    const broken: string[] = [];

    for (const link of links) {
      if (!pathExistsInDist(link)) {
        broken.push(link);
      }
    }

    if (broken.length > 0) {
      console.log(`${pagePath}: ${links.length} internal links, ${broken.length} broken`);
      for (const b of broken) console.log(`  BROKEN: ${b}`);
    }

    expect(broken).toEqual([]);
  });
});

describe('Asset references', () => {
  it.each(PAGE_PATHS)('$path should reference existing font CSS', (pagePath) => {
    const html = readHtml(pagePath);
    const cssLinks: string[] = [];
    const regex = /<link[^>]+rel=["']stylesheet["'][^>]*href=["']([^"']+)["']/gi;
    let m: RegExpExecArray | null;
    while ((m = regex.exec(html)) !== null) {
      cssLinks.push(m[1]);
    }
    for (const href of cssLinks) {
      let clean = href.startsWith('/') ? href.slice(1) : href;
      const filePath = join(DIST_DIR, clean);
      expect(existsSync(filePath)).toBe(true);
    }
  });

  it.each(PAGE_PATHS)('$path should reference existing favicon', (pagePath) => {
    const html = readHtml(pagePath);
    const match = html.match(/<link[^>]+rel=["']icon["'][^>]*href=["']([^"']+)["']/i);
    if (match) {
      let clean = match[1].startsWith('/') ? match[1].slice(1) : match[1];
      expect(existsSync(join(DIST_DIR, clean))).toBe(true);
    }
  });

  it.each(PAGE_PATHS)('$path should reference existing preload assets', (pagePath) => {
    const html = readHtml(pagePath);
    const preloads: string[] = [];
    const regex = /<link[^>]+rel=["']preload["'][^>]*href=["']([^"']+)["']/gi;
    let m: RegExpExecArray | null;
    while ((m = regex.exec(html)) !== null) {
      preloads.push(m[1]);
    }
    for (const href of preloads) {
      let clean = href.startsWith('/') ? href.slice(1) : href;
      expect(existsSync(join(DIST_DIR, clean))).toBe(true);
    }
  });
});
