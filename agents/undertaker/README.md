# 🪦 The Undertaker — Dead Code Detection Agent

> Safely find and prioritize unused or unreachable code with deterministic confidence scoring.

The Undertaker analyzes your repository to detect **functions, classes, variables, imports, types, enums**, and **unreachable code** that appear unused or obsolete.
It returns **structured, confidence-scored JSON output** for human review or CI enforcement.

---

## 🚀 Key Features

* Multi-language: JS/TS, Python, Go, Java, C/C++, Rust, PHP, Ruby, Swift, Kotlin, and more.
* **Deterministic confidence scoring** (same input → same output).
* **Three modes:** `preview`, `analyze`, and `strict` for flexible depth and CI use.
* Confidence tiers: **Very High**, **High**, **Medium** (50–100%).
* **JSON-only output** — no file writes, no mutations.
* CI/CD and PR-automation friendly.

---

## ⚙️ Installation

```bash
npm install -g @qodo/command
```

---

## 🧭 Basic Usage

### Default quick scan

```bash
qodo undertaker
```

### Restrict by language

```bash
qodo undertaker --set file_extensions="ts,tsx,py"
```

### Raise confidence threshold

```bash
qodo undertaker --set min_confidence=90
```

## 🧩 Operational Modes

| Mode        | Confidence Filter | Validation Strictness |                     Output Behavior | Recommended Use      |
| ----------- | ----------------- | --------------------- | ----------------------------------: | -------------------- |
| **preview** | ≥ 70              | Soft                  |         Shows warnings, never fails | Local inspection     |
| **analyze** | ≥ 50              | Medium                |         Full dataset + all warnings | Code review & audits |
| **strict**  | ≥ 80              | Hard                  | Stops on mismatch or invalid totals | CI/CD enforcement    |

Example:

```bash
qodo undertaker --set mode=strict
```

---

## 🎯 Key Arguments

* `min_confidence` (number, default `75`) — Minimum confidence score (50–100) to report (use `≥` comparison).
* `file_extensions` (string, default `all`) — Comma-separated file extensions (e.g., `"js,ts,py"`).
* `exclude_patterns` (string) — Comma-separated paths to skip (default: `node_modules,dist,build,vendor,.git,test,spec`).
* `mode` (string, default `preview`) — `preview`, `analyze`, or `strict`. Influences filtering/validation and logs.
* `max_items` (number, default `1000`) — Maximum number of findings to report.

---

## 🧮 Confidence Mapping (deterministic)

|                   Condition | Exported | Confidence |    Tier   |
| --------------------------: | :------: | ---------: | :-------: |
|        **Unreachable code** |     —    |        100 | Very High |
|       `reference_count = 0` |   false  |         98 | Very High |
|       `reference_count = 0` |   true   |         92 | Very High |
|       `reference_count = 1` |   false  |         86 |    High   |
|       `reference_count = 1` |   true   |         76 |    High   |
|       `reference_count = 2` |   false  |         83 |    High   |
|       `reference_count = 2` |   true   |         77 |    High   |
| `reference_count ∈ [3,4,5]` |    any   |         65 |   Medium  |
|       `reference_count ≥ 6` |    any   |    Exclude |     —     |

* `safe_to_remove = (confidence_score ≥ min_confidence)`
* Exported items automatically get `needs_manual_approval = true`.
* Items with `confidence_score < 50` are excluded.

---

## 🧠 How It Works (simplified)

1. **Discovery:** Detect definitions (functions, classes, variables, imports, types, enums) using lightweight syntax heuristics per language.
2. **Canonical reference count:** For each identifier run ONE canonical `ripgrep` query; ignore definition lines; dedupe unique file+line matches; filter comments/strings. Final `reference_count = max(0, unique_matches - 1)`.
3. **Export analysis:** Detect exported / public items (JS/TS exports, `module.exports`, Python `__all__`, header/extern declarations, etc.).
4. **Unreachable detection:** Find structural patterns where code follows terminating statements (`return`, `throw`, `raise`, `break`, `continue`, `exit`) and mark them `unreachable_code` with `100` confidence.
5. **Scoring & dedupe:** Apply deterministic mapping, merge duplicates (aggregate references, note `merged_from_count`), and compute tiers.
6. **Validation:** Ensure counts and summary fields are internally consistent; produce warnings for anomalies (many comment-only matches, potential dynamic usage, merged duplicates).

---

## 🧾 Example Output (trimmed)

```json
{
  "summary": {
    "total_files_scanned": 122,
    "total_dead_code_items": 11,
    "very_high_confidence": 6,
    "high_confidence": 4,
    "medium_confidence": 1,
    "estimated_lines_removable": 180
  },
  "dead_code_items": [
    {
      "identifier": "oldHelper",
      "type": "function",
      "location": { "file": "src/utils/helpers.ts", "line_start": 41, "line_end": 58 },
      "confidence_score": 98,
      "confidence_tier": "very_high",
      "metrics": { "reference_count": 0, "is_exported": false },
      "reasoning": "No references found; internal utility last modified 14 months ago.",
      "safe_to_remove": true,
      "needs_manual_approval": false
    }
  ],
  "warnings": [],
  "success": true
}
```

---

## 🧭 Getting Started (recommended)

1. Install Qodo Command.
2. Run a base scan:

   ```bash
   qodo undertaker
   ```
3. Review `very_high` confidence results first.
---

## ⚠️ Limitations

Undertaker may under-detect or under-rank code used dynamically (reflection, plugin systems, dynamically-generated imports, runtime dispatch). Always manually review exported APIs, `medium` items, and critical core paths before removal.

---

## 🤝 Contributing & Support

* Repo & Issues: [https://github.com/qodo-ai/agents](https://github.com/qodo-ai/agents)
* Docs: [https://docs.qodo.ai/qodo-documentation/qodo-command](https://docs.qodo.ai/qodo-documentation/qodo-command)

---

*“The Undertaker — because every codebase deserves a careful, reviewable cleanup.”*
