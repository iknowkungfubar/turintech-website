# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Test infrastructure: vitest + @vitest/ui, 8 build-output tests checking HTML structure, a11y, and sitemap
- GitHub Actions: type checking (`astro check`) and test step (`vitest run`) added before build in deploy.yml
- Test scripts: `bun run test`, `bun run test:watch`, `bun run test:coverage`, `bun run check`
- `.gitattributes` with language-specific text/binary classification
- Dependabot configuration for npm dependency updates
- SECURITY.md with vulnerability disclosure policy
- Portfolio showcase page (`/portfolio`) — cards for all 9 repos with descriptions, badges, key features, and terminal-style CLI previews

## [1.0.0] — 2026-06-03

### Added
- Full company landing page with Astro
- Dark/light mode theme toggle
- SEO: meta titles, descriptions, OG images, 404 page
- Contact form with honeypot bot detection
- README.md with project overview and setup instructions
- CONTRIBUTING.md and contributing section in README
- LICENSE (MIT), `.gitattributes`, expanded `.gitignore`
- CI/CD deployment to GitHub Pages

### Fixed
- Hardcoded internal Tailscale IP removed from contact form (security fix)
- Services page and contact form second-pass review
- Blog button removed; duplicate inlineStylesheets in astro config
- Light-mode logo spacing and dark text visibility
- Hero section spacing, vertical centering, uniform text sizing

### Changed
- Full site rewrite — technology consulting positioning
- SEO page structure for /services and /about
- Pricing removed from site and schema; replaced with assessment focus
- All open issues resolved

## [0.1.0] — 2026-05-16

### Added
- Initial Astro site scaffold
- Basic index, about, services pages
- Theme toggle (light/dark mode)
