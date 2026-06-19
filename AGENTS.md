# TurinTech Solutions Website — Agent Context

## Overview

**TurinTech Solutions Website** is the corporate website for TurinTech Solutions, a strategic technology consulting firm. Built with Astro, deployed via GitHub Pages at `turintechsolutions.com`. Presents consulting services: infrastructure audits, cloud migrations, API integrations, and private AI/RAG systems. Features dark/light mode, SEO optimization, and a contact form with spam protection.

## Tech Stack

- **Framework:** Astro v6 (static site generator)
- **Package Manager:** bun
- **Language:** JavaScript/TypeScript (`.astro`, `.ts`, `.js`)
- **Styling:** Inline CSS (all inlined at build), CSS custom properties for theming
- **Hosting:** GitHub Pages (static export)
- **Domain:** turintechsolutions.com (CNAME + DNS A records)
- **CI:** GitHub Actions (deploy.yml)

## Architecture

```
Static site built by Astro
├── Public pages: index, about, services
├── Components: ContactForm, SEO head, ThemeToggle
├── Assets: images, icons, CNAME
└── Deployed to GitHub Pages (static hosting)
```

## Key Features

- **Dark/Light Mode**: Theme toggle with CSS custom properties
- **SEO**: Meta titles, descriptions, OG images, 404 page
- **Contact Form**: Client-side submission with honeypot bot detection
- **Responsive**: Mobile-first design
- **No tracking**: Zero analytics or third-party scripts

## Repository Structure

```
turintech-website/
├── src/
│   ├── pages/           # Astro pages (index, about, services)
│   ├── components/      # Astro/JSX components
│   └── layouts/         # Page layouts
├── public/              # Static assets
├── astro.config.mjs     # Astro configuration
└── package.json         # Dependencies
```

## Conventions

- Astro islands architecture
- CSS custom properties for theming
- Progressive enhancement (JS not required for core content)

## Quality Gates

- `bun run build` — builds without errors (4 pages, ~500ms)
- No analytics or external tracking
- Static deployment (no backend required)
