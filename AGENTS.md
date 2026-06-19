# TurinTech Solutions Website — Agent Context

## Overview

**TurinTech Solutions Website** is the corporate website for TurinTech Solutions, a strategic technology consulting firm. Built with Astro, deployed via GitHub Pages at `turintechsolutions.com`. Presents consulting services: infrastructure audits, cloud migrations, API integrations, and private AI/RAG systems.

## Tech Stack

- **Framework:** Astro v6 (static site generator)
- **Package Manager:** bun
- **Language:** JavaScript/TypeScript (`.astro`, `.ts`, `.js`)
- **Hosting:** GitHub Pages (static export)
- **Styling:** Inline CSS (all inlined at build)
- **Domain:** turintechsolutions.com (CNAME + DNS A records)

## Repository Structure

```
src/
├── pages/                 # Astro page routes
│   ├── index.astro        # Landing page
│   ├── about.astro        # About page
│   ├── services.astro     # Services page
│   └── 404.astro          # Custom error page
├── components/            # Reusable Astro components
├── layouts/               # Page layouts
├── styles/                # Global styles
└── assets/                # Static assets
public/                    # Public static files
dist/                      # Build output (generated)
```

## Key Commands

- `bun install` — Install dependencies
- `bun run dev` — Start dev server at localhost:4321
- `bun run build` — Build for production (outputs to `dist/`)
- `bun run preview` — Preview production build locally

## Architecture

- **Static Site Generation**: All pages pre-rendered at build time via Astro
- **GitHub Pages Deploy**: Automatic on push to `main` via `.github/workflows/deploy.yml`
- **Contact Form**: Optional webhook integration via `PUBLIC_WEBHOOK_URL` env var
- **SEO**: JSON-LD schema, Open Graph, sitemap
- **Analytics**: Privacy-focused page view tracking

## Pages

| Route | Content |
|-------|---------|
| `/` | Landing — hero, services overview, CTA |
| `/about` | Company methodology, philosophy |
| `/services` | 4 core service offerings |
| `/404` | Custom not-found page |

## Quality Gates

- `bun run build` — Must exit 0 (no build errors)
- `bun run astro check` — Type checking
- `bun run lint` — Linting
