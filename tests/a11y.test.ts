import { describe, it, expect, beforeAll } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const REPO_ROOT = join(__dirname, '..');
const DIST_DIR = join(REPO_ROOT, 'dist');

const PAGES = [
  'index.html',
  'about/index.html',
  'services/index.html',
  'portfolio/index.html',
  '404.html',
];

beforeAll(() => {
  if (!existsSync(DIST_DIR)) {
    execSync('bun run build', { cwd: REPO_ROOT, stdio: 'pipe' });
  }
});

function readHtml(pagePath: string): string {
  return readFileSync(join(DIST_DIR, pagePath), 'utf-8');
}

describe('Accessibility — skip navigation', () => {
  it.each(PAGES)('$path should have a skip-to-content link', (pagePath) => {
    const html = readHtml(pagePath);
    expect(html).toMatch(/<a[^>]*href=["']#main-content["'][^>]*>Skip to main content<\/a>/i);
  });

  it.each(PAGES)('$path should have a main element with id="main-content"', (pagePath) => {
    const html = readHtml(pagePath);
    expect(html).toMatch(/<main[^>]*id=["']main-content["'][^>]*>/i);
  });

  it.each(PAGES)('$path should have a header element', (pagePath) => {
    const html = readHtml(pagePath);
    expect(html).toMatch(/<header[^>]*>/i);
  });

  it.each(PAGES)('$path should have a footer element', (pagePath) => {
    const html = readHtml(pagePath);
    expect(html).toMatch(/<footer[^>]*>/i);
  });
});

describe('Accessibility — navigation', () => {
  it.each(PAGES)('$path should have nav element', (pagePath) => {
    const html = readHtml(pagePath);
    expect(html).toMatch(/<nav[^>]*>/i);
  });

  it.each(PAGES)('$path should have a theme toggle button with aria-label', (pagePath) => {
    const html = readHtml(pagePath);
    expect(html).toMatch(/<button[^>]*aria-label=["']Toggle theme["']/i);
    expect(html).toMatch(/<button[^>]*title=["']Toggle light\/dark mode["']/i);
  });

  it.each(PAGES)('$path should have mobile menu button with aria-label', (pagePath) => {
    const html = readHtml(pagePath);
    expect(html).toMatch(/<button[^>]*aria-label=["']Toggle menu["']/i);
  });
});

describe('Accessibility — focus styles', () => {
  it.each(PAGES)('$path should have :focus-visible styles', (pagePath) => {
    const html = readHtml(pagePath);
    expect(html).toMatch(/:focus-visible/i);
  });
});

describe('Accessibility — contact form', () => {
  const FORM_PAGES = ['index.html']; // ContactForm only rendered on index

  it.each(FORM_PAGES)('$path should have form with id="contact-form"', (pagePath) => {
    const html = readHtml(pagePath);
    expect(html).toMatch(/<form[^>]*id=["']contact-form["'][^>]*>/i);
  });

  it.each(FORM_PAGES)('$path should have labeled form fields', (pagePath) => {
    const html = readHtml(pagePath);
    // Each input should have a corresponding label
    const labelMatches = [...html.matchAll(/<label\s+for="([^"]+)"/gi)];
    const inputMatches = [...html.matchAll(/<input[^>]+id="([^"]+)"/gi)];
    const textareaMatches = [...html.matchAll(/<textarea[^>]+id="([^"]+)"/gi)];
    const allIds = new Set([
      ...inputMatches.map((m) => m[1]),
      ...textareaMatches.map((m) => m[1]),
    ]);
    const labeledIds = new Set(labelMatches.map((m) => m[1]));
    // Every input should have a label (except honeypot which is intentionally hidden)
    for (const id of allIds) {
      if (id === 'website') continue; // honeypot field
      expect(labeledIds.has(id)).toBe(true);
    }
  });

  it.each(FORM_PAGES)('$path should have required attributes on form fields', (pagePath) => {
    const html = readHtml(pagePath);
    expect(html).toMatch(/<input[^>]+name="name"[^>]+required/i);
    expect(html).toMatch(/<input[^>]+name="email"[^>]+required/i);
    expect(html).toMatch(/<textarea[^>]+required/i);
  });

  it.each(FORM_PAGES)('$path should have form status element with aria-live="polite"', (pagePath) => {
    const html = readHtml(pagePath);
    expect(html).toMatch(/aria-live=["']polite["']/i);
  });

  it.each(FORM_PAGES)('$path should have honeypot field for bot protection', (pagePath) => {
    const html = readHtml(pagePath);
    expect(html).toMatch(/<input[^>]+name="_honey"[^>]+style="display:none"/i);
  });
});

describe('Accessibility — image alt text', () => {
  it.each(PAGES)('$path should have alt attributes on logo images', (pagePath) => {
    const html = readHtml(pagePath);
    // Logo images should have descriptive alt text containing "TurinTech"
    const logoImgs = html.match(/<img[^>]+class="[^"]*header-logo[^"]*"[^>]*>/gi);
    if (logoImgs) {
      for (const img of logoImgs) {
        expect(img.toLowerCase()).toContain('alt=');
        expect(img.toLowerCase()).toContain('turintech');
      }
    }
  });
});

describe('Accessibility — language and direction', () => {
  it.each(PAGES)('$path should have lang="en" on html element', (pagePath) => {
    const html = readHtml(pagePath);
    expect(html).toMatch(/<html\s+lang="en"/i);
  });
});
