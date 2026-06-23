import { describe, it, expect } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

const __dirname = resolve(new URL(".", import.meta.url).pathname);
const DIST_DIR = resolve(__dirname, "..", "dist");

function getHtml(...segments: string[]): string | null {
  const p = join(DIST_DIR, ...segments);
  return existsSync(p) ? readFileSync(p, "utf-8") : null;
}

type PageDef = { name: string; path: string[] };
const ALL_PAGES: PageDef[] = [
  { name: "Home",      path: ["index.html"] },
  { name: "404",       path: ["404.html"] },
];
const CONTENT_PAGES = ALL_PAGES.filter((p) => p.name !== "404");

// ── 1. HTML Structure & Accessibility ─────────────────────────────
describe("HTML structure & accessibility", () => {
  for (const page of ALL_PAGES) {
    const html = getHtml(...page.path);
    if (!html) {
      describe(page.name, () => {
        it.skip("(build output not found)", () => {});
      });
      continue;
    }
    describe(page.name, () => {
      it("has a <title> element", () => {
        expect(html).toMatch(/<title>\S/);
      });
      it("has lang attribute on <html>", () => {
        expect(html).toMatch(/<html\s+lang=/);
      });
      it("has viewport meta tag", () => {
        expect(html).toContain('name="viewport"');
      });
      it("has meta description", () => {
        expect(html).toContain('name="description"');
      });
      it("has skip-to-content link", () => {
        expect(html).toContain("skip-link");
        expect(html).toContain("Skip to main content");
      });
      it("has <main> with id='main-content'", () => {
        expect(html).toContain('<main id="main-content">');
      });
      it("has favicon link", () => {
        expect(html).toMatch(/rel="icon"/);
      });
      it("has og:title meta", () => {
        expect(html).toContain('property="og:title"');
      });
      it("has og:description meta", () => {
        expect(html).toContain('property="og:description"');
      });
      it("has at least one heading", () => {
        expect(html).toMatch(/<h[1-6]/);
      });
      it("has canonical link", () => {
        expect(html).toContain('rel="canonical"');
      });
      it("closes <html> tag", () => {
        expect(html).toContain("</html>");
      });
    });
  }
});

// ── 2. Schema.org structured data ─────────────────────────────────
describe("Schema.org JSON-LD", () => {
  const html = getHtml("index.html");
  if (!html) {
    it.skip("(Home page build output not found)", () => {});
  } else {
    it("has Organization schema with company name", () => {
      expect(html).toContain('"@type": "Organization"');
      expect(html).toContain("TurinTech Solutions");
    });
    it("has ProfessionalService schema", () => {
      expect(html).toContain('"@type": "ProfessionalService"');
    });
    it("has 2+ application/ld+json script tags", () => {
      const matches = html.match(/<script type="application\/ld\+json">/g);
      expect(matches).not.toBeNull();
      expect(matches!.length).toBeGreaterThanOrEqual(2);
    });
  }
});

// ── 3. Navigation ─────────────────────────────────────────────────
describe("Navigation", () => {
  for (const page of CONTENT_PAGES) {
    const html = getHtml(...page.path);
    if (!html) {
      describe(page.name, () => {
        it.skip("(build output not found)", () => {});
      });
      continue;
    }
    describe(page.name, () => {
      it("has a <nav> element", () => {
        expect(html).toContain("<nav");
      });
      it("links to Home", () => {
        expect(html).toContain(">Home</a>");
      });
      it("links to Services", () => {
        expect(html).toContain(">Services</a>");
      });
      it("links to About", () => {
        expect(html).toContain(">About</a>");
      });
      it("has theme toggle button", () => {
        expect(html).toContain("theme-toggle");
      });
      it("has mobile menu button", () => {
        expect(html).toContain("mobile-menu-btn");
      });
    });
  }
});

// ── 4. Contact Form ───────────────────────────────────────────────
describe("Contact form (Home page)", () => {
  const html = getHtml("index.html");
  if (!html) {
    it.skip("(Home page build output not found)", () => {});
  } else {
    it("has contact form element", () => {
      expect(html).toContain('class="contact-form"');
    });
    it("has name, email, message fields", () => {
      expect(html).toContain('id="name"');
      expect(html).toContain('id="email"');
      expect(html).toContain('id="message"');
    });
    it("has submit button", () => {
      expect(html).toContain('type="submit"');
    });
    it("has honeypot field for bot protection", () => {
      expect(html).toContain('name="_honey"');
    });
    it("has aria-live status region", () => {
      expect(html).toContain('aria-live="polite"');
    });
    it("has character count hint", () => {
      expect(html).toContain("characters remaining");
    });
    it("has form action attribute", () => {
      expect(html).toContain("action=");
    });
  }
});

// ── 5. Footer ─────────────────────────────────────────────────────
describe("Footer", () => {
  const html = getHtml("index.html");
  if (!html) {
    it.skip("(Home page build output not found)", () => {});
  } else {
    it("has copyright notice", () => {
      expect(html).toContain("TurinTech Solutions. All rights reserved");
    });
    it("has current year in footer", () => {
      const year = new Date().getFullYear().toString();
      expect(html).toContain(`&copy; ${year}`);
    });
    it("has footer navigation links", () => {
      expect(html).toContain("class=\"site-footer\"");
    });
  }
});

// ── 6. 404 page ───────────────────────────────────────────────────
describe("404 page", () => {
  const html = getHtml("404.html");
  if (!html) {
    it.skip("(build output not found)", () => {});
  } else {
    it("displays 404 prominently in content", () => {
      expect(html).toContain("404");
    });
    it("links back to home", () => {
      expect(html).toContain("Return Home");
    });
    it("has standard HTML structure", () => {
      expect(html).toContain("</html>");
      expect(html).toContain("Page Not Found");
    });
  }
});
