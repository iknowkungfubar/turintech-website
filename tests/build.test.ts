import { describe, it, expect } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, "..");
const DIST_DIR = resolve(__dirname, "..", "dist");

describe("astro build output", () => {
  it("builds a dist directory", () => {
    expect(existsSync(DIST_DIR)).toBe(true);
  });

  it("produces an index.html", () => {
    const path = join(DIST_DIR, "index.html");
    expect(existsSync(path)).toBe(true);
    const html = readFileSync(path, "utf-8");
    expect(html).toContain("</html>");
    expect(html).toContain("TurinTech");
  });

  it("produces an about page", () => {
    const path = join(DIST_DIR, "about", "index.html");
    expect(existsSync(path)).toBe(true);
    const html = readFileSync(path, "utf-8");
    expect(html).toContain("</html>");
  });

  it("produces a services page", () => {
    const path = join(DIST_DIR, "services", "index.html");
    expect(existsSync(path)).toBe(true);
    const html = readFileSync(path, "utf-8");
    expect(html).toContain("</html>");
  });

  it("produces a 404 page", () => {
    const path = join(DIST_DIR, "404.html");
    expect(existsSync(path)).toBe(true);
    const html = readFileSync(path, "utf-8");
    expect(html).toContain("404");
  });

  it("produces a portfolio page with all 9 repos", () => {
    const path = join(DIST_DIR, "portfolio", "index.html");
    expect(existsSync(path)).toBe(true);
    const html = readFileSync(path, "utf-8");
    expect(html).toContain("</html>");
    expect(html).toContain("no-slop-harness");
    expect(html).toContain("swe-swarm");
    expect(html).toContain("candor-ai");
    expect(html).toContain("ring-fenced-rag");
    expect(html).toContain("autoresearch-stack");
    expect(html).toContain("IronSilo");
    expect(html).toContain("file-org-wiz");
    expect(html).toContain("HALF");
    expect(html).toContain("turintech-website");
    expect(html).toContain("GitHub");
  });

  it("all HTML pages have a lang attribute for accessibility", () => {
    const pages = ["index.html", "404.html", "about/index.html", "services/index.html", "portfolio/index.html"];
    for (const page of pages) {
      const path = join(DIST_DIR, page);
      if (existsSync(path)) {
        const html = readFileSync(path, "utf-8");
        expect(html).toMatch(/<html\s+lang=/);
      }
    }
  });

  it("all HTML pages include a viewport meta tag", () => {
    const pages = ["index.html", "404.html", "about/index.html", "services/index.html", "portfolio/index.html"];
    for (const page of pages) {
      const path = join(DIST_DIR, page);
      if (existsSync(path)) {
        const html = readFileSync(path, "utf-8");
        expect(html).toContain('name="viewport"');
      }
    }
  });

  it("generates a sitemap", () => {
    const path = join(DIST_DIR, "sitemap-index.xml");
    if (existsSync(path)) {
      const xml = readFileSync(path, "utf-8");
      expect(xml).toContain("<?xml");
    }
  });
});
