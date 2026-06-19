#!/usr/bin/env python3
"""Generate SVG terminal screenshots for all 9 portfolio repos."""
import json
import os

REPOS = [
    {
        "name": "no-slop-harness",
        "lines": [
            "$ no-slop list --status pending",
            "┌──────┬──────────────────────────────────┬──────────┐",
            "│  ID  │  Task                            │  Status  │",
            "├──────┼──────────────────────────────────┼──────────┤",
            "│ 001  │  Implement query validator        │  READY   │",
            "│ 002  │  Review sandbox security policy   │  PENDING │",
            "│ 003  │  Add TLA+ formal verification     │  BLOCKED │",
            "│ 004  │  Write integration test suite      │  TODO    │",
            "└──────┴──────────────────────────────────┴──────────┘",
            "$ no-slop status --pipeline",
            "Coordinator  ✓ Complete   │  Implementor  ● Active  │  Verifier  ○ Waiting",
        ]
    },
    {
        "name": "swe-swarm",
        "lines": [
            "$ swe-swarm \"Add login feature\" --agents dev,tester",
            "╔══════════════════════════════════════════════════╗",
            "║  SWE Swarm — Ralph Wiggum Loop v0.1.0           ║",
            "╠══════════════════════════════════════════════════╣",
            "║  ● Planning    ── 4 subtasks identified         ║",
            "║  ○ Coding      ── Waiting for plan finalization  ║",
            "║  ○ Testing     ── Queued                         ║",
            "║  ○ Deploying   ── Not started                    ║",
            "╚══════════════════════════════════════════════════╝",
            "Web dashboard: http://localhost:8080",
        ]
    },
    {
        "name": "candor-ai",
        "lines": [
            "$ candor agent start --mode interactive",
            "┌─ Candor AI Agent ──────────────────────────────┐",
            "│  Phase: Reasoning  ●  Memory: 47 chunks        │",
            "│  Context: 2,341 tokens  •  Temperature: 0.7    │",
            "├────────────────────────────────────────────────┤",
            "│  > What would you like me to help with today?  │",
            "└────────────────────────────────────────────────┘",
            "Voice input: listening...  [Press 'q' to quit]",
        ]
    },
    {
        "name": "ring-fenced-rag",
        "lines": [
            "$ rfr query \"Q3 financial reports\" --role analyst",
            "┌─ RBAC Enforced Query ──────────────────────────┐",
            "│  User: analyst@corp  •  Role: Analyst          │",
            "│  Access: department_finance/*                   │",
            "├────────────────────────────────────────────────┤",
            "│  ✓  Retrieved 12 chunks from 4 documents        │",
            "│  ✓  Generated response (1,284 ms)               │",
            "│  ✗  Blocked 3 documents (insufficient role)     │",
            "└────────────────────────────────────────────────┘",
            "Audit log: query #a47f2c recorded",
        ]
    },
    {
        "name": "autoresearch-stack",
        "lines": [
            "$ autoresearch train --config experiments/llm-optim",
            "╔═══ AutoResearch — Training Run #47 ════════════╗",
            "║  Epoch   Loss    LR         Tokens/s   GPU     ║",
            "║  1/10    2.341   3e-5    12,847     0% ░░░░  ║",
            "║  2/10    1.892   2.8e-5  13,201     15% ▓░░░ ║",
            "║  3/10    1.456   2.5e-5  13,012     42% ▓▓░░ ║",
            "║  4/10    1.123   2.0e-5  12,994     68% ▓▓▓░ ║",
            "║  5/10    0.891   1.5e-5  13,188     91% ▓▓▓▓ ║",
            "╚════════════════════════════════════════════════╝",
            "ETA: 4m 32s  •  Best val loss: 0.843 (epoch 4)",
        ]
    },
    {
        "name": "IronSilo",
        "lines": [
            "$ ironsilo list",
            "┌──────────────────────────────────────────────────┐",
            "│  IronSilo — Active Environments (2)              │",
            "├──────┬────────────┬────────┬─────────┬──────────┤",
            "│  ID  │  Name      │  Image  │  GPU    │  Status  │",
            "├──────┼────────────┼────────┼─────────┼──────────┤",
            "│ a3f  │  llm-dev   │ pytorch │ RTX4090 │ ● Active │",
            "│ b7c  │  sandbox   │ ubuntu  │ none    │ ○ Idle   │",
            "└──────┴────────────┴────────┴─────────┴──────────┘",
            "$ ironsilo exec a3f -- nvidia-smi | head -3",
        ]
    },
    {
        "name": "file-org-wiz",
        "lines": [
            "$ file-org-wiz scan ~/Downloads --dry-run",
            "┌─ File Organization Wizard ── Dry Run Mode ─────┐",
            "│  Scanned: 1,247 files  •  284 duplicates       │",
            "├────────────────────────────────────────────────┤",
            "│  Projects/        →  89 files (12 proposals)   │",
            "│  Areas/           →  312 files (4 categories)  │",
            "│  Resources/       →  203 files (by topic)      │",
            "│  Archives/        →  643 files (by year)       │",
            "├────────────────────────────────────────────────┤",
            "│  ✓  Would organize 1,247 files into 18 folders │",
            "│  ⚠  47 uncategorized (needs review)            │",
            "└────────────────────────────────────────────────┘",
            "Run without --dry-run to apply changes.",
        ]
    },
    {
        "name": "HALF",
        "lines": [
            "$ half ps",
            "┌─ HALF — Agent Processes ──────────────────────┐",
            "│  PID  NAME          STATE  CPU  MEM  UPTIME    │",
            "│  001  code-review   ● RUN  2.3%  89M  1h 23m  │",
            "│  002  log-monitor   ● RUN  0.8%  34M  4h 12m  │",
            "│  003  data-pipe     ○ IDLE  0.1%  12M  0h 45m │",
            "│  004  slack-bot     ● RUN  1.4%  67M  2h 01m  │",
            "└────────────────────────────────────────────────┘",
            "$ half logs 001 --tail 5",
        ]
    },
    {
        "name": "turintech-website",
        "lines": [
            "$ bun run build",
            "  astro build v6.3.1",
            "  ▶  src/pages/index.astro       ✓  12ms",
            "  ▶  src/pages/about.astro       ✓  8ms",
            "  ▶  src/pages/services.astro    ✓  11ms",
            "  ▶  src/pages/portfolio.astro   ✓  14ms",
            "  ▶  src/pages/404.astro         ✓  6ms",
            "  ✓  5 pages built in 493ms",
            "  ✓  Static export → ./dist/",
        ]
    },
]

def make_terminal_svg(name, lines):
    """Generate an SVG terminal screenshot."""
    font_size = 13
    line_h = 20
    padding = 16
    char_w = 7.8  # approximate monospace char width
    title_h = 34
    dot_radius = 5
    dot_gap = 8

    max_line_len = max(len(l) for l in lines)
    svg_w = max_line_len * char_w + padding * 2 + 40
    svg_h = len(lines) * line_h + padding * 2 + title_h + 20

    # Build SVG
    parts = []
    parts.append(f'<svg xmlns="http://www.w3.org/2000/svg" width="{svg_w:.0f}" height="{svg_h:.0f}" viewBox="0 0 {svg_w:.0f} {svg_h:.0f}">')
    parts.append(f'<defs><style>@import url("https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&amp;display=swap");.t{{font-family:"JetBrains Mono","Fira Code",monospace;font-size:{font_size}px;fill:#cdd6f4;white-space:pre}}</style></defs>')

    # Terminal background
    parts.append(f'<rect width="100%" height="100%" rx="10" fill="#1a1b26"/>')

    # Title bar
    parts.append(f'<rect x="0" y="0" width="100%" height="{title_h}" rx="10" fill="#1e1e2e"/>')
    parts.append(f'<rect x="0" y="{title_h - 4}" width="100%" height="4" fill="#1e1e2e"/>')

    # Dots
    parts.append(f'<circle cx="{padding + dot_radius}" cy="{title_h/2}" r="{dot_radius}" fill="#ff5f56"/>')
    parts.append(f'<circle cx="{padding + dot_radius*3 + dot_gap}" cy="{title_h/2}" r="{dot_radius}" fill="#ffbd2e"/>')
    parts.append(f'<circle cx="{padding + dot_radius*5 + dot_gap*2}" cy="{title_h/2}" r="{dot_radius}" fill="#27c93f"/>')

    # Title text
    parts.append(f'<text x="{svg_w/2}" y="{title_h/2 + 4}" text-anchor="middle" font-size="11" fill="#6c7086" font-family="Inter,system-ui,sans-serif">{name} — Terminal</text>')

    # Content lines
    for i, line in enumerate(lines):
        y = title_h + padding + i * line_h + font_size
        # Use different colors for prompt vs output
        if line.startswith('$ '):
            parts.append(f'<text x="{padding}" y="{y}" class="t" fill="#a6e3a1">$ </text>')
            parts.append(f'<text x="{padding + char_w * 2}" y="{y}" class="t">{line[2:]}</text>')
        elif line.startswith('┌') or line.startswith('╔'):
            parts.append(f'<text x="{padding}" y="{y}" class="t" fill="#89b4fa">{line}</text>')
        elif line.startswith('│') or line.startswith('║'):
            parts.append(f'<text x="{padding}" y="{y}" class="t" fill="#cdd6f4">{line}</text>')
        elif line.startswith('├') or line.startswith('╠'):
            parts.append(f'<text x="{padding}" y="{y}" class="t" fill="#6c7086">{line}</text>')
        elif line.startswith('└') or line.startswith('╚'):
            parts.append(f'<text x="{padding}" y="{y}" class="t" fill="#89b4fa">{line}</text>')
        elif line.startswith('✓') or line.startswith('✅'):
            parts.append(f'<text x="{padding}" y="{y}" class="t" fill="#a6e3a1">{line}</text>')
        elif line.startswith('✗') or line.startswith('❌') or line.startswith('⚠'):
            parts.append(f'<text x="{padding}" y="{y}" class="t" fill="#f9e2af">{line}</text>')
        else:
            parts.append(f'<text x="{padding}" y="{y}" class="t" fill="#cdd6f4">{line}</text>')

    parts.append('</svg>')
    return '\n'.join(parts)

output_dir = os.path.join(os.path.dirname(__file__), '..', 'public', 'images', 'portfolio')
os.makedirs(output_dir, exist_ok=True)

screenshots = {}
for repo in REPOS:
    name = repo["name"]
    svg = make_terminal_svg(name, repo["lines"])
    path = os.path.join(output_dir, f'{name}-terminal.svg')
    with open(path, 'w') as f:
        f.write(svg)
    screenshots[name] = f'/images/portfolio/{name}-terminal.svg'
    print(f'  ✓ {name}-terminal.svg')

# Output mapping for use in portfolio.astro
print()
print('SCREENSHOT_MAP:')
print(json.dumps(screenshots, indent=2))
