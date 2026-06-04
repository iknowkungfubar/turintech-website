# TurinTech Solutions Website

> Corporate website for [TurinTech Solutions](https://turintechsolutions.com) — strategic technology consulting, infrastructure restructuring, and private AI architecture.

[![Built with Astro](https://img.shields.io/badge/built%20with-Astro-FF5D01.svg?logo=astro)](https://astro.build)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![CI](https://github.com/iknowkungfubar/turintech-website/actions/workflows/deploy.yml/badge.svg)](https://github.com/iknowkungfubar/turintech-website/actions/workflows/deploy.yml)

A fast, static site built with [Astro](https://astro.build) and deployed via GitHub Pages. It presents TurinTech Solutions' consulting services: infrastructure audits, cloud migrations, API integrations, and private AI/ RAG systems.

## Pages

| Route | Content |
|-------|---------|
| `/` | Landing page — hero, services overview, CTA |
| `/about` | About TurinTech Solutions — methodology, philosophy |
| `/services` | Detailed service breakdown (4 core offerings) |
| `/404` | Custom error page |

## Quick Start

```bash
# Prerequisites: Node.js >= 22.12.0 and bun
bun install
bun run dev      # Start dev server at localhost:4321
bun run build    # Build for production (outputs to dist/)
bun run preview  # Preview production build locally
```

## Environment Variables

| Variable | Purpose | Required |
|----------|---------|----------|
| `PUBLIC_CONTACT_EMAIL` | Email address in JSON-LD schema and contact form | No (falls back to `contact@turintechsolutions.com`) |
| `PUBLIC_WEBHOOK_URL` | Webhook URL for contact form submissions | No (form gracefully degrades if unset) |

## Deployment

The site is built and deployed to GitHub Pages automatically via `.github/workflows/deploy.yml` on push to `main`. The custom domain `turintechsolutions.com` is configured via the `CNAME` file and the DNS `A` records pointing to GitHub Pages IPs.

## Tech Stack

- **Framework**: [Astro](https://astro.build) v6
- **Package Manager**: [bun](https://bun.sh)
- **Hosting**: GitHub Pages (static export)
- **Styling**: Inline stylesheets (all CSS inlined at build time for performance)

## License

MIT
