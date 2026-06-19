#!/usr/bin/env python3
"""Generate terminal SVG screenshots for all repos using svg-term-cli --command."""
import subprocess
import os
import shlex

SCREENSHOTS_DIR = os.path.expanduser("~/turintech-website/public/images/screenshots")
os.makedirs(SCREENSHOTS_DIR, exist_ok=True)

SVG_TERM = os.path.expanduser("/run/media/turin/Data/.bun/bin/svg-term")

repos = [
    {
        "name": "no-slop-harness",
        "lines": [
            "no-slop --help",
            "",
            "Usage: no-slop [OPTIONS] COMMAND [ARGS]...",
            "",
            "  No-Slop Harness — deterministic LLM orchestration.",
            "",
            "Options:",
            "  -v, --verbose  Enable verbose logging.",
            "  --help         Show this message and exit.",
            "",
            "Commands:",
            "  init     Initialize a new CIV pipeline session.",
            "  list     List all tasks in the current pipeline.",
            "  status   Show the current pipeline status.",
            "  verify   Verify a completed task.",
            "  report   Report the result of an implemented task.",
        ],
    },
    {
        "name": "swe-swarm",
        "lines": [
            "swe-swarm --help",
            "",
            "usage: swe-swarm [-h] [--verbose] [--config CONFIG] [goal]",
            "",
            "SWE Swarm — Multi-Agent SWE Orchestration",
            "",
            "positional arguments:",
            "  goal                  The goal for the swarm to accomplish",
            "",
            "options:",
            "  -h, --help            show this help message and exit",
            "  --verbose, -v         Enable verbose logging",
            "  --config CONFIG, -c CONFIG",
            "                        Path to configuration file",
        ],
    },
    {
        "name": "candor-ai",
        "lines": [
            "candor --help",
            "",
            "candor-ai 0.x.x",
            "Lawful Good Rust Agentic Operating System",
            "",
            "USAGE:",
            "    candor [FLAGS] [OPTIONS] [SUBCOMMAND]",
            "",
            "FLAGS:",
            "    -v, --verbose    Verbose logging",
            "    -h, --help       Prints help information",
            "",
            "SUBCOMMANDS:",
            "    agent     Start an agent session",
            "    config    Configure agent settings",
            "    memory    Inspect or query agent memory",
        ],
    },
    {
        "name": "ring-fenced-rag",
        "lines": [
            "ring-fenced-rag --help",
            "",
            "Ring-Fenced RAG — Zero-Trust Retrieval Augmented Generation",
            "",
            "Commands:",
            "  index     Index documents into the vector store",
            "  query     Query the RAG system with RBAC enforcement",
            "  serve     Start the RAG API server",
            "  admin     Admin commands for tenant management",
        ],
    },
    {
        "name": "autoresearch-stack",
        "lines": [
            "autoresearch --help",
            "",
            "Autonomous Research Stack — Self-Guided ML Research",
            "",
            "Commands:",
            "  init      Initialize a new research project",
            "  dataset   Curate and preprocess datasets",
            "  train     Start or resume model training",
            "  evaluate  Run evaluation benchmarks",
            "  publish   Generate research artifacts",
        ],
    },
    {
        "name": "IronSilo",
        "lines": [
            "ironsilo --help",
            "",
            "IronSilo — Local-First AI Development Sandbox",
            "",
            "Commands:",
            "  create    Create a new sandbox environment",
            "  list      List active sandboxes",
            "  exec      Execute commands inside a sandbox",
            "  destroy   Tear down a sandbox",
            "  config    Configure sandbox templates",
        ],
    },
    {
        "name": "file-org-wiz",
        "lines": [
            "file-org-wiz --help",
            "",
            "File Organization Wizard — AI-Powered Digital Workspace",
            "",
            "Commands:",
            "  scan      Scan directory for organization",
            "  classify  AI-classify files into categories",
            "  organize  Apply organization rules",
            "  graph     Show knowledge graph of linked notes",
            "  status    Show workspace organization stats",
        ],
    },
    {
        "name": "HALF",
        "lines": [
            "half --help",
            "",
            "HALF — Agentic Operating System",
            "",
            "Commands:",
            "  run       Execute an agent in a managed context",
            "  ps        List running agent processes",
            "  kill      Terminate an agent process",
            "  logs      Stream agent logs",
            "  schedule  Schedule recurring agent tasks",
        ],
    },
    {
        "name": "turintech-website",
        "lines": [
            "bun run build",
            "",
            "$ astro build",
            "13:52:38 [build] output: 'static'",
            "13:52:38 [build] mode: 'static'",
            "13:52:38 [build] Building static entrypoints...",
            "13:52:39 [vite] ✓ built in 401ms",
            "13:52:39 [build] 5 page(s) built in 475ms",
            "13:52:39 [build] Complete!",
        ],
    },
]


def build_command(repo: dict) -> str:
    """Build a shell command that echoes each line."""
    parts = []
    for line in repo["lines"]:
        # Escape single quotes for shell
        escaped = line.replace("'", "'\\''")
        parts.append(f"echo '{escaped}'")
    return " && ".join(parts)


def main():
    for repo in repos:
        name = repo["name"]
        out_path = os.path.join(SCREENSHOTS_DIR, f"{name}.svg")

        print(f"Generating {name}...", end=" ", flush=True)

        cmd = build_command(repo)

        result = subprocess.run(
            [SVG_TERM, "--command", cmd, "--out", out_path, "--window", "--padding", "16"],
            capture_output=True,
            text=True,
            timeout=30,
        )

        if result.returncode == 0 and os.path.exists(out_path):
            size = os.path.getsize(out_path)
            print(f"OK ({size} bytes)")
        else:
            print(f"FAILED (rc={result.returncode})")
            if result.stderr:
                # Show just the last line of error
                err_lines = result.stderr.strip().split("\n")
                print(f"  {err_lines[-1][:200]}" if err_lines else "  unknown error")

    print(f"\nDone. Screenshots in {SCREENSHOTS_DIR}")


if __name__ == "__main__":
    main()
