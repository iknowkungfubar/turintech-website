## Product Portfolio Audit — Feature Evaluation & UI/UX

**Date:** 2026-06-19
**Scope:** 8/9 repos evaluated (HALF missing from GitHub, flagged as AGE-30)
**Goal:** Identify feature gaps, UI/UX polish needs, and cross-portfolio issues

---

### 1. REPO INVENTORY & PUBLISHING STATUS

| Repo | Language | Version | PyPI/crates.io | Published? | Has README | Has AGENTS.md | Has CHANGELOG |
|------|----------|---------|---------------|-----------|-----------|------------|--------------|
| no-slop-harness | Python | 0.9.1 | pypi.org/p/no-slop-harness | ✅ v0.9.0 | ✅ | ✅ | ✅ |
| ring-fenced-rag | Python | 1.0.0a1 | pypi.org/p/ring-fenced-rag | ✅ v1.0.0a1 | ✅ | ✅ | ✅ |
| autoresearch-stack | Python | 0.7.3 | pypi.org/p/autoresearch-stack | ✅ v0.7.3 | ✅ | ✅ | ✅ |
| file-org-wiz | Python | 1.3.0 | pypi.org/p/file-org-wiz | ✅ v1.3.0 | ✅ | ✅ | ✅ |
| swe-swarm | Python | 0.1.0 | pypi.org/p/swe-swarm | ❌ 404 | ✅ | ✅ | ✅ |
| IronSilo | Python | 2.1.1 | pypi.org/p/ironsilo | ❌ 404 | ✅ | ✅ | ✅ |
| candor-ai | Rust | workspace | crates.io | ❌ unknown | ✅ | ✅ | ✅ |
| turintech-website | JS/Astro | 0.0.1 | npm | ❌ 404 | ✅ | ✅ | ✅ |
| HALF | missing | — | — | ❌ repo gone | — | — | — |

**Verdict:** 4/8 published. swe-swarm (AGE-17) and IronSilo (AGE-27) are actively blocked on publishing. candor-ai and turintech-website are not published anywhere.

---

### 2. FEATURE GAP ANALYSIS

#### Each Repo's Core Value Proposition

**no-slop-harness** — CIV-pattern LLM orchestration framework
- Strength: Mature architecture with coordinator/implementor/verifier agents, DAG-based task execution, sandboxing, TLA+ bridge
- Gaps: No plugin marketplace/docs, limited provider coverage (OpenAI-compatible only), no web dashboard

**swe-swarm** — Multi-agent orchestration (Ralph Loop)
- Strength: Clean agent role system, LLM provider abstraction, dashboard UI
- Gaps: Early prototype (~1,400 lines). No examples directory. No end-to-end demo. Test suite is small (17 tests for 1,400 LOC = low coverage). No task DAG visualization.

**ring-fenced-rag** — Zero-trust RAG with DB-level RBAC
- Strength: Novel architecture (JSONB @> RBAC), comprehensive test suite (40 tests), FastAPI + CLI + TUI
- Gaps: TUI lacks screenshots/screencast in README. No usage examples directory. Alpha version (1.0.0a1).

**autoresearch-stack** — LLM training research automation
- Strength: Clean CLI interface, Docker/K8s support, PyPI published
- Gaps: Thin documentation. No examples directory. CLI appears minimal. No dashboard/visualization. No integration test suite visible.

**IronSilo** — Local-first AI dev sandbox
- Strength: Most feature-rich repo — Docker orchestration, MCP integration, swarm system, TUI, monitoring stack, 6 test types (unit/integration/e2e/fuzz/contract/load), AGENTS.md, ROADMAP.md
- Gaps: Not published (AGE-27). Beta status (v2.1.1). Complex setup (Docker dependency). No screenshots of the TUI/dashboard.

**file-org-wiz** — AI file organization (PARA + Zettelkasten)
- Strength: Clean MCP server architecture, published on PyPI, has AGENTS.md
- Gaps: No CLI (only MCP server). No examples directory. No screenshots/demo. Requires Flask MCP server — higher barrier than CLI tool. Test coverage unknown.

**candor-ai** — Rust agentic OS (7-phase cognitive loop)
- Strength: Most engineered — 11 crates, 320+ tests, Tauri desktop support, voice stack, MCP, sandboxing, sentinel system. Strong architecture.
- Gaps: Not published to crates.io at all. No examples directory. Large workspace may overwhelm new users. Documentation is in AGENTS.md but README could use more quickstart. Desktop app (Tauri) status unclear.

**turintech-website** — Company site (Astro)
- Strength: Clean static site, good SEO structure, JSON-LD schema, GitHub Pages deploy
- Gaps: No tests at all (0 test files). No linting configured (0 lint script in package.json). No a11y audit tooling. No dark mode in source code (only from Prism themes). Page count is low (4 pages). Not published on npm. README is thin (54 lines).

---

### 3. CROSS-PORTFOLIO UI/UX ASSESSMENT

#### CLI Quality (Python repos with CLI entry points)

| Repo | CLI Entry | Help Text | Error Messages | Exit Codes |
|------|----------|-----------|---------------|------------|
| no-slop-harness | `no-slop` (click) | ✅ click-based | needs audit | needs audit |
| swe-swarm | `swe-swarm` (click) | ✅ click-based | needs audit | needs audit |
| ring-fenced-rag | `rfr` (click + textual TUI) | ✅ click + textual | needs audit | needs audit |
| autoresearch-stack | `autoresearch` (argparse) | basic | needs audit | needs audit |
| IronSilo | `ironsilo`, `ironsilo-monitor`, `ironsilo-setup` | documented | needs audit | needs audit |
| file-org-wiz | MCP server only | no CLI | N/A | N/A |
| candor-ai | `candor-ai` (clap) | ✅ clap-based | needs audit | needs audit |

#### Website UX (turintech-website)

- **Build:** Astro static site, GitHub Pages deploy
- **Pages:** 4 (/, /about, /services, /404)
- **Dark mode:** Not implemented in source code (no CSS media query — only Prism JS theme dark variants exist)
- **A11y:** No skip-to-content link. No focus-visible styles. No axe/cypress-axe.
- **Responsive:** Unknown (no testing infrastructure)
- **Performance:** Unknown (no Lighthouse CI or perf budget)
- **Contact form:** Webhook-driven, but no success/error UI feedback verified

#### Cross-repo UX Issues

1. **No consistent CLI naming convention** — Some use kebab-case (no-slop, swe-swarm), some abbreviated (rfr), some underscored (autoresearch). New users have to remember different command names for each tool.

2. **No unified installer/launcher** — User must pip-install each repo individually. No `turintech` meta-package or launcher script.

3. **No demo/screencast in any README** — Zero repos show animated GIFs, videos, or ASCII casts of the tool in action.

4. **Example directories are sparse** — Only no-slop-harness and IronSilo have examples/. Missing from swe-swarm, ring-fenced-rag, autoresearch-stack, file-org-wiz, candor-ai.

5. **Missing screenshots** — No repo provides screenshots of CLI output, dashboards, or UIs (IronSilo's TUI and monitoring stack would benefit most).

---

### 4. ISSUE TRIAGE & CROSS-REPO GAPS

#### Open Issues Summary

| Issue | Repo | Status | Priority | Summary |
|-------|------|--------|----------|---------|
| AGE-17 | swe-swarm | todo | high | PyPI publish blocked (OIDC config needed) |
| AGE-31 | no-slop-harness | blocked | high | PyPI version drift (0.9.1 code vs 0.9.0 published) |
| AGE-27 | IronSilo | in_progress | medium | PyPI publish needed (ironsilo 404) |

#### New Issues Recommended

1. **Publish candor-ai to crates.io** — All 11 crates are unpublished. Publish at minimum the main crate (`candor-ai`) with workspace members as optional dependency features.

2. **Publish turintech-website to npm** — Currently npm returns 404. Publishing enables versioned releases and CI-based deploy gating.

3. **Add examples/ to all repos** — 5/8 repos lack an examples directory. This is the biggest onboarding gap.

4. **Add screenshots/screencasts** — IronSilo and ring-fenced-rag TUI would benefit most. Turbo website portfolio page needs hero imagery.

5. **Create turintech-solutions meta-package** — One pip-installable package that installs and configures all Python tools (no-slop-harness, swe-swarm, ring-fenced-rag, autoresearch-stack, file-org-wiz, IronSilo).

6. **turintech-website needs testing infrastructure** — Zero tests. Add at minimum build smoke test and a11y checks.

7. **Consistent CLI naming** — Audit all CLI commands for naming consistency. Consider `turintech-` prefix for all.

8. **swe-swarm examples and demo** — Core differentiator (Ralph Loop) needs vivid demo content.

---

### 5. HALF REPO STATUS

HALF (Agentic OS for desktop) is missing from GitHub entirely, confirmed by AGE-30 investigation. If it still exists in private/local form, the code should be pushed to a public repo or archived. The repo mention should be removed from portfolio docs if it no longer exists.

---

### SUMMARY

**Portfolio health:** Yellow/Amber. Architecture across the 8 repos is strong with well-separated concerns and modern tooling. The main gaps are:

1. **Publishing** — Only 50% published (4/8). The ones that are published have version drift issues.
2. **Onboarding** — Missing examples, screenshots, screencasts in 5/8 repos. New users have no quick way to understand what a tool does without installing it.
3. **Cross-portfolio cohesion** — No unified CLI, no meta-package, no consistent naming convention.
4. **Testing gaps** — turintech-website has zero tests. swe-swarm has low coverage. Other repos are solid.
5. **UI/UX polish** — Website needs a11y, dark mode, testing. CLI tools need error message audit.
