# Cross-Portfolio CLI Naming Consistency Audit

## Current State

| Repo | Package Name | Current CLI | Pattern | Issue |
|---|---|---|---|---|
| no-slop-harness | `no-slop-harness` | `no-slop` | Shortened kebab | Doesn't match package name |
| swe-swarm | `swe-swarm` | `swe-swarm` | Kebab | No prefix |
| ring-fenced-rag | `ring-fenced-rag` | `rfr` | Acronym | Cryptic, no discovery |
| autoresearch-stack | `autoresearch-stack` | `autoresearch` | Shortened one-word | Doesn't match package name |
| IronSilo | `ironsilo` | `ironsilo` / `ironsilo-monitor` / `ironsilo-setup` | One-word + subcommands | No prefix |
| file-org-wiz | `file-org-wiz` | `file-org-wiz` | Kebab | No prefix |
| HALF | `half` | `half` | One-word | Collision risk |
| candor-ai | `candor-ai` (crate) | `candor` | One-word | Doesn't match crate name |

## Problems

1. **No namespace prefix** — `half` and `no-slop` could collide with other packages
2. **Mixed naming patterns** — acronyms (`rfr`), one-word (`autoresearch`, `half`), kebab (`swe-swarm`, `file-org-wiz`)
3. **Cryptic commands** — `rfr` gives no hint it's "Ring-Fenced RAG"
4. **Shortened names** — `no-slop` (vs `no-slop-harness`), `autoresearch` (vs `autoresearch-stack`), `candor` (vs `candor-ai`)
5. **Capitalization mismatch** — package `ironsilo` (lowercase) vs repo `IronSilo` (PascalCase)

## Recommendation

### Convention
- **Format:** `turintech-<package-name>` — all kebab-case, full names, no acronyms
- **Rationale:** Namespace isolation under `turintech-*`, discoverable via tab-completion, consistent brand
- **Backwards compatibility:** Old CLIs kept as wrapper scripts that print a deprecation warning

### Proposed Mapping

| Current | Proposed | Alias |
|---|---|---|
| `no-slop` | `turintech-no-slop-harness` | `no-slop` → warning → `turintech-no-slop-harness` |
| `swe-swarm` | `turintech-swe-swarm` | `swe-swarm` → warning → `turintech-swe-swarm` |
| `rfr` | `turintech-ring-fenced-rag` | `rfr` → warning → `turintech-ring-fenced-rag` |
| `autoresearch` | `turintech-autoresearch-stack` | `autoresearch` → warning → `turintech-autoresearch-stack` |
| `ironsilo` | `turintech-ironsilo` | `ironsilo` → warning → `turintech-ironsilo` |
| `file-org-wiz` | `turintech-file-org-wiz` | `file-org-wiz` → warning → `turintech-file-org-wiz` |
| `half` | `turintech-half` | `half` → warning → `turintech-half` |
| `candor` | `turintech-candor-ai` | `candor` → warning → `turintech-candor-ai` |
