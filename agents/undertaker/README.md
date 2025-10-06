# The Undertaker - Dead Code Detection Agent

> Eliminate technical debt by safely identifying unused code with confidence scoring

The Undertaker is a QODO agent that helps teams clean up codebases by identifying genuinely unused code through static analysis and historical validation. It combines multiple signals (reference counts, file age, git history, export status) to provide confidence-scored findings that can be safely removed without breaking functionality.

## Features

- **Multi-Signal Analysis**: Combines static analysis, git history, and usage patterns for accurate detection
- **Confidence Scoring**: Every finding includes a 50-100% confidence score with clear reasoning
- **Language Support**: JavaScript, TypeScript, Python, Go, Java, Rust, PHP, Ruby, Swift, Kotlin, C, C++, C#, and more
- **Historical Validation**: Uses git blame and commit history to assess code staleness
- **Smart Categorization**: Groups findings into Very High (90-100%), High (75-89%), and Medium (50-74%) confidence tiers
- **PR Generation**: Automatically creates pull requests with dead code removals (optional)
- **Conservative Approach**: Prioritizes accuracy over aggressive removal to prevent false positives
- **CI/CD Ready**: Structured output and exit conditions for automated workflows

## What The Undertaker Detects

- **Unused Functions/Methods**: Functions that are never called anywhere in the codebase
- **Unused Classes**: Classes that are never instantiated or referenced
- **Unused Variables**: Variables that are defined but never read
- **Dead Imports**: Import statements for modules that are never used
- **Unreachable Code**: Code after return statements or in impossible conditional branches
- **Write-Only Variables**: Variables that are assigned but never read
- **Single-Use Functions**: Functions called exactly once (candidates for inlining)

## Installation

This agent requires [Qodo Command](https://docs.qodo.ai/qodo-documentation/qodo-command) to be installed:

```bash
npm install -g @qodo/command
```

## Quick Start

### Basic Usage

Scan your codebase for dead code with default settings (75% minimum confidence, 90+ days old):

```bash
qodo undertaker
```

### High Confidence Only

Only show very high confidence findings (90-100% confidence):

```bash
qodo undertaker --set min_confidence=90
```

### Specific File Types

Analyze only TypeScript and Python files:

```bash
qodo undertaker --set file_extensions="ts,tsx,py"
```

### Create Removal PR

Generate a pull request with dead code removals:

```bash
qodo undertaker --set create_pr=true --set min_confidence=90
```

### Dry Run

Preview what would be removed without creating a PR:

```bash
qodo undertaker --set create_pr=true --set dry_run=true
```

## Configuration Options

All configuration is done through the `--set` flag:

### Core Settings

| Argument | Type | Default | Description |
|----------|------|---------|-------------|
| `min_confidence` | number | `75` | Minimum confidence score (50-100) to report. Items below this threshold are excluded as actively-used code. |
| `min_age_days` | number | `90` | Minimum days since last modification. Code modified more recently is excluded. |
| `file_extensions` | string | `"all"` | Comma-separated file extensions to analyze (e.g., `"js,ts,py,go,java,rs,php,rb,swift,kt"`). Use `"all"` for all code files. |
| `exclude_patterns` | string | `"node_modules,dist,build,vendor,.git,test,spec"` | Comma-separated directory/file patterns to ignore. |
| `include_test_files` | boolean | `false` | Include test files in analysis (usually excluded as test-only code is acceptable). |

### PR Generation

| Argument | Type | Default | Description |
|----------|------|---------|-------------|
| `create_pr` | boolean | `false` | Generate pull request with dead code removals (requires GitHub/GitLab access). |
| `group_by_confidence` | boolean | `true` | Create separate PRs per confidence tier (very high, high, medium). |
| `dry_run` | boolean | `false` | Preview PR content without actually creating it. |

### Advanced Settings

| Argument | Type | Default | Description |
|----------|------|---------|-------------|
| `max_items` | number | `1000` | Maximum dead code items to analyze per confidence tier (prevents overwhelming output). |

## Understanding Confidence Scores

The Undertaker assigns each finding a confidence score from 50-100% based on multiple factors:

### Confidence Tiers

- **Very High (90-100%)**: Safe for automated removal
  - Zero references in codebase
  - Untouched for 6+ months
  - Not exported (internal only)
  - No dynamic usage patterns detected

- **High (75-89%)**: Safe for review
  - Zero references but modified recently (≤3 months)
  - OR 1-2 references and untouched for 6+ months

- **Medium (50-74%)**: Manual verification required
  - Few references (1-3)
  - Some age (3-6 months)
  - Might be used dynamically

- **Below 50%**: Automatically excluded (active code, not dead)

### Scoring Factors

Each finding's confidence is calculated from:

1. **Reference Count** (0-50 points):
   - 0 references: +50 points
   - 1-2 references: +30 points
   - 3-5 references: +10 points
   - 6+ references: Item excluded as active code

2. **Age Multiplier** (10-30 points):
   - 6+ months old: +30 points
   - 3-6 months old: +20 points
   - <3 months old: +10 points

3. **Export Status** (0-15 points):
   - Internal-only: +15 points
   - Exported/public: +0 points

4. **Dynamic Usage Penalty** (-25 points):
   - Deduction if eval(), reflection, or dynamic imports detected

## Output Format

The Undertaker produces structured JSON output with:

### Summary Statistics
```json
{
  "summary": {
    "total_files_scanned": 2847,
    "total_dead_code_items": 156,
    "very_high_confidence": 89,
    "high_confidence": 51,
    "medium_confidence": 16,
    "estimated_lines_removable": 4231,
    "oldest_dead_code_days": 542
  }
}
```

### Detailed Findings
Each dead code item includes:
- `identifier`: Function/class/variable name
- `type`: function, class, variable, import, or unreachable_code
- `location`: File path and line numbers
- `confidence_score`: 50-100 numerical score
- `confidence_tier`: very_high, high, or medium
- `metrics`: Reference count, age, last modified date, export status
- `reasoning`: Human-readable explanation
- `safe_to_remove`: Boolean flag based on min_confidence threshold

### Example Finding
```json
{
  "identifier": "formatLegacyDate",
  "type": "function",
  "location": {
    "file": "src/utils/date.ts",
    "line_start": 47,
    "line_end": 63
  },
  "confidence_score": 95,
  "confidence_tier": "very_high",
  "metrics": {
    "reference_count": 0,
    "days_since_last_modified": 542,
    "last_modified_date": "2023-03-12",
    "is_exported": false
  },
  "reasoning": "No references found anywhere in codebase. Last modified 18 months ago. Internal function not exported.",
  "safe_to_remove": true
}
```

## Usage Examples

### Example 1: Initial Codebase Audit

Start with very high confidence items to build trust:

```bash
qodo undertaker --set min_confidence=90 --set min_age_days=180
```

This finds code that:
- Has 90-100% confidence of being dead
- Hasn't been touched in 6+ months
- Is safe for automated removal

### Example 2: File Type-Specific Cleanup

Focus on TypeScript files only:

```bash
qodo undertaker --set file_extensions="ts,tsx" --set min_confidence=85
```

### Example 3: Aggressive Cleanup

Find all potential dead code (including medium confidence):

```bash
qodo undertaker --set min_confidence=50 --set min_age_days=30
```

**Warning**: Medium confidence findings require manual review before removal.

### Example 4: Generate Cleanup PR

Create a pull request with very high confidence deletions:

```bash
qodo undertaker \
  --set create_pr=true \
  --set min_confidence=90 \
  --set group_by_confidence=true
```

This creates separate PRs for each confidence tier (very high, high, medium).

### Example 5: Include Test Files

Analyze test files for unused test utilities:

```bash
qodo undertaker \
  --set include_test_files=true \
  --set exclude_patterns="node_modules,dist,build"
```

### Example 6: Dry Run Preview

Preview what would be deleted without creating a PR:

```bash
qodo undertaker \
  --set create_pr=true \
  --set dry_run=true \
  --set min_confidence=85
```

## CI/CD Integration

### GitHub Actions

```yaml
name: Dead Code Detection

on:
  schedule:
    - cron: '0 0 * * 0'  # Weekly on Sunday
  workflow_dispatch:

jobs:
  detect-dead-code:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0  # Full history for git analysis

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Install Qodo Command
        run: npm install -g @qodo/command

      - name: Run Dead Code Detection
        run: |
          qodo undertaker \
            --set min_confidence=90 \
            --set create_pr=true \
            --ci

      - name: Upload Analysis Report
        uses: actions/upload-artifact@v3
        with:
          name: dead-code-report
          path: dead-code-analysis.json
```

### GitLab CI

```yaml
dead-code-detection:
  stage: quality
  image: node:18
  script:
    - npm install -g @qodo/command
    - |
      qodo undertaker \
        --set min_confidence=90 \
        --set create_pr=true \
        --ci
  artifacts:
    reports:
      junit: dead-code-report.xml
    paths:
      - dead-code-analysis.json
  only:
    - schedules
```

### Exit Conditions

The agent exits successfully when:
```
success && (very_high_confidence > 0 || total_dead_code_items == 0)
```

This means:
- ✅ **Pass**: Analysis completed AND (found very high confidence dead code OR codebase is clean)
- ❌ **Fail**: Analysis encountered errors OR only uncertain findings that need manual review

## Error Handling

The Undertaker handles common issues gracefully:

### Missing Git History

**Scenario**: No `.git` directory or corrupted history

**Behavior**:
- Reduces all confidence scores by 20 points
- Continues analysis with static analysis only
- Adds warning: "Git history unavailable - confidence scores reduced"

### Unsupported Languages

**Scenario**: User requests a language not in the supported list

**Behavior**:
- Adds language to `unsupported_languages` array
- Continues analyzing supported languages
- Logs warning listing which languages were skipped

**Example**:
```bash
qodo undertaker --set languages="typescript,ruby,python"
```
Result: Analyzes TypeScript and Python, warns that Ruby is unsupported

### Parse Failures

**Scenario**: Syntax errors or malformed source files

**Behavior**:
- Logs file path to warnings array
- Skips to next file
- Continues analysis with remaining valid files

### Permission Errors

**Scenario**: Cannot read files or create PR

**Behavior**:
- Skips inaccessible files with warning
- Returns analysis results even if PR creation fails

### Scale Limits

**Scenario**: Findings exceed `max_items` limit

**Behavior**:
- Prioritizes by confidence tier (very high → high → medium)
- Processes top N items per tier
- Warns: "Analysis limited to top {max_items} items per confidence tier"

## Language Support

The Undertaker uses language-agnostic analysis techniques that work across virtually any programming language. It adapts its parsing and reference detection based on the file extension and syntax patterns.

**Works with**: JavaScript, TypeScript, Python, Go, Java, Rust, PHP, Ruby, Swift, Kotlin, C, C++, C#, Scala, Elixir, and any other language with standard function/class/variable syntax.

The agent automatically:
- Detects appropriate syntax patterns based on file extensions
- Handles language-specific visibility rules (public/private, underscore conventions, capitalization)
- Adapts to different import/export systems
- Recognizes common dynamic patterns (reflection, eval, metaprogramming)

## Troubleshooting

### "Analysis completed but no dead code found"

**Possible Causes**:
1. Your codebase is genuinely clean (great!)
2. `min_confidence` threshold is too high
3. `min_age_days` is excluding recent dead code
4. `exclude_patterns` is filtering out too much

**Solution**: Lower thresholds or review exclude patterns:
```bash
qodo undertaker --set min_confidence=50 --set min_age_days=30
```

### "Too many false positives"

**Possible Causes**:
1. Dynamic code patterns not detected
2. Cross-package references in monorepo
3. Reflection-based usage

**Solution**: Increase `min_confidence` or review medium/low confidence items manually:
```bash
qodo undertaker --set min_confidence=85
```

### "PR creation failed"

**Possible Causes**:
1. Missing GitHub/GitLab access token
2. Insufficient repository permissions
3. No items meet min_confidence threshold

**Solution**: Check environment variables and permissions:
```bash
# For GitHub
export GITHUB_TOKEN=your_token_here

# For GitLab
export GITLAB_TOKEN=your_token_here
```

### "Parse errors for specific files"

**Possible Causes**:
1. Syntax errors in source files
2. Unsupported language dialect
3. Generated/minified code

**Solution**: Add problematic directories to `exclude_patterns`:
```bash
qodo undertaker --set exclude_patterns="node_modules,dist,build,generated"
```

## Best Practices

### 1. Start Conservative

Begin with very high confidence items to build trust:
```bash
qodo undertaker --set min_confidence=90 --set min_age_days=180
```

### 2. Review Before Removing

Always review findings before bulk deletion:
```bash
qodo undertaker --set dry_run=true
```

### 3. Test After Removal

Run your full test suite after removing dead code:
```bash
# Remove dead code
qodo undertaker --set create_pr=true --set min_confidence=90

# Then test thoroughly
npm test
```

### 4. Incremental Cleanup

Clean up in phases, starting with oldest/highest confidence:
```bash
# Phase 1: Very high confidence, 1+ year old
qodo undertaker --set min_confidence=95 --set min_age_days=365

# Phase 2: High confidence, 6+ months old
qodo undertaker --set min_confidence=85 --set min_age_days=180

# Phase 3: Medium confidence (manual review)
qodo undertaker --set min_confidence=60 --set min_age_days=90
```

### 5. Exclude Generated Code

Always exclude auto-generated and vendored code:
```bash
qodo undertaker --set exclude_patterns="node_modules,vendor,dist,build,.next,generated"
```

## Limitations

### What The Undertaker Cannot Detect

- **Runtime-only usage**: Code called only through reflection, `eval()`, or dynamic imports
- **External dependencies**: Usage from external packages or services
- **Conditional compilation**: Code used only in specific build configurations
- **Plugin architectures**: Code loaded dynamically via plugin systems
- **Configuration-driven**: Code referenced only in config files or annotations

### When to Use Manual Review

Use manual verification for:
- Exported/public API functions (even if unused internally)
- Code with medium confidence scores (50-74%)
- Recently modified code (<3 months old)
- Code in critical paths (authentication, payments, security)
- Framework-specific patterns (React hooks, Spring beans)

## Comparison with Other Tools

| Feature | The Undertaker | ESLint/Pylint | Coverage Tools | IDE "Find Usages" |
|---------|----------------|---------------|----------------|-------------------|
| Cross-file analysis | ✅ | ⚠️ Limited | ❌ | ✅ |
| Historical context | ✅ | ❌ | ❌ | ❌ |
| Confidence scoring | ✅ | ❌ | ❌ | ❌ |
| Multi-language | ✅ 6 languages | Per-language | Per-language | Per-language |
| PR generation | ✅ | ❌ | ❌ | ❌ |
| CI/CD ready | ✅ | ✅ | ✅ | ❌ |
| Age-based filtering | ✅ | ❌ | ❌ | ❌ |

The Undertaker complements existing tools by providing:
- Deeper cross-file analysis than linters
- Historical context that coverage tools don't have
- Automated PR creation for cleanup
- Confidence-based prioritization

## Contributing

The Undertaker is part of the [Qodo Agents](https://github.com/qodo-ai/agents) project. Contributions are welcome!

To suggest improvements:
1. Open an issue describing the enhancement
2. Submit a pull request with implementation
3. Include tests and documentation updates

## Support

- **Documentation**: [Qodo Command Docs](https://docs.qodo.ai/qodo-documentation/qodo-command)
- **Issues**: [GitHub Issues](https://github.com/qodo-ai/agents/issues)
- **Community**: [Qodo Discord](https://discord.gg/qodo)

## License

MIT License - see [LICENSE](../../LICENSE) for details

---

**Built with ❤️ by the Qodo community**

*The Undertaker: Because every codebase deserves a proper burial for its dead code.*