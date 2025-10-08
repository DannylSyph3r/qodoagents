# The Undertaker — Dead Code Detection Agent

> Safely find and prioritize dead code so teams can clean up confidently.

The Undertaker analyzes a repository to discover unused functions, classes, variables, imports, and unreachable code, then returns confidence-scored findings to guide safe removal.

---

## Quick Features

* Multi-language: JS/TS, Python, Go, Java, Rust, PHP, Ruby, C/C++, Swift, Kotlin, etc.
* Confidence scores (50–100%) with three tiers: Very High, High, Medium.
* Optional PR generation (opt-in).
* CI/CD friendly JSON output.
* Conservative defaults to reduce false positives.

---

## Install

```bash
npm install -g @qodo/command
```

---

## Basic Commands

Scan the repo (defaults):

```bash
qodo undertaker
```

Limit to TypeScript + Python:

```bash
qodo undertaker --set file_extensions="ts,tsx,py"
```

Only very-high confidence:

```bash
qodo undertaker --set min_confidence=90
```

Create a PR (opt-in):

```bash
qodo undertaker --set create_pr=true --set min_confidence=90
```

Preview PRs without creating them:

```bash
qodo undertaker --set create_pr=true --set dry_run=true
```

---

## Key Options (short)

* `min_confidence` (default: `75`) — Report items with score **≥** this value.
* `min_age_days` (default: `90`) — Optional bias toward older code.
* `file_extensions` (default: `all`) — Comma list of extensions.
* `exclude_patterns` — Comma list of paths to ignore.
* `include_test_files` (default: `false`) — Include tests in analysis.
* `create_pr`, `dry_run`, `group_by_confidence`, `max_items`.

---

## How Scoring Works (user summary)

Each finding gets a **confidence score (50–100%)** and a tier:

* **Very High (90–100%)** — Highly likely unused; safe to remove after review.
* **High (75–89%)** — Likely unused; good candidate for quick review.
* **Medium (50–74%)** — Might be unused; requires manual verification.

Scores are derived from repository signals (reference counts, export/public status, age, and indicators of dynamic usage). Unreachable code (e.g., after `return`) is typically scored highest.

---

## Output Example (trimmed)

```json
{
  "summary": {
    "total_files_scanned": 120,
    "total_dead_code_items": 12,
    "very_high_confidence": 7,
    "high_confidence": 4,
    "medium_confidence": 1,
    "estimated_lines_removable": 210
  },
  "dead_code_items": [
    {
      "identifier": "unusedFunction",
      "type": "function",
      "location": { "file": "src/utils.js", "line_start": 42, "line_end": 55 },
      "confidence_score": 95,
      "confidence_tier": "very_high",
      "metrics": { "reference_count": 0, "is_exported": false },
      "reasoning": "No references found; internal utility last changed >1 year ago.",
      "safe_to_remove": true
    }
  ],
  "warnings": [],
  "success": true
}
```

---

## Getting Started (recommended)

1. Install Qodo Command.
2. Run a baseline scan: `qodo undertaker`.
3. Review `very_high` items first.
4. Preview PRs: `--set create_pr=true --set dry_run=true`.
5. Apply changes incrementally and run tests.

---

## CI Snippet (GitHub Actions)

```yaml
steps:
  - uses: actions/checkout@v4
    with: { fetch-depth: 0 }
  - run: npm install -g @qodo/command
  - run: qodo undertaker --set min_confidence=90 --set create_pr=true
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

---

## Limitations

May under-detect or under-score code used via reflection, dynamic imports, external consumers, plugin systems, or build-time conditional compilation. Always manually review exported APIs, medium-confidence items, recent code, and critical paths.

---

## Contributing & Support

Repo & issues: [https://github.com/qodo-ai/agents](https://github.com/qodo-ai/agents)
Docs: [https://docs.qodo.ai/qodo-documentation/qodo-command](https://docs.qodo.ai/qodo-documentation/qodo-command)

---

*The Undertaker — because every codebase deserves a careful, reviewable cleanup.*
