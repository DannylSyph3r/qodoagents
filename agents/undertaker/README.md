# The Undertaker - Dead Code Detection Agent

> Eliminate technical debt by safely identifying unused code with confidence scoring

The Undertaker is a Qodo agent that helps teams clean up codebases by identifying genuinely unused code. It analyzes your code to find functions, classes, and variables that are never used, combining static analysis with git history to provide confidence-scored findings that can be safely removed.

## Features

- **Multi-Signal Analysis**: Combines code usage patterns with git history for accurate detection
- **Confidence Scoring**: Every finding includes a 50-100% confidence score with clear reasoning
- **Multi-Language Support**: Works with JavaScript, TypeScript, Python, Go, Java, Rust, PHP, Ruby, C, C++, and more
- **Cross-Platform**: Runs reliably on Windows, macOS, and Linux
- **Smart Categorization**: Groups findings into Very High (90-100%), High (75-89%), and Medium (50-74%) confidence tiers
- **PR Generation**: Automatically creates pull requests with dead code removals
- **Conservative Approach**: Prioritizes accuracy over aggressive removal to prevent false positives
- **CI/CD Ready**: Structured output and exit conditions for automated workflows

## What The Undertaker Detects

- **Unused Functions/Methods**: Functions that are never called anywhere in the codebase
- **Unused Classes**: Classes that are never instantiated or referenced
- **Unused Variables**: Variables that are defined but never read
- **Dead Imports**: Import statements for modules that are never used
- **Unreachable Code**: Code after return statements or in impossible conditional branches
- **Write-Only Variables**: Variables that are assigned but never read
- **Commented Code**: Large blocks of commented-out code

## Installation

This agent requires [Qodo Command](https://docs.qodo.ai/qodo-documentation/qodo-command) to be installed:

```bash
npm install -g @qodo/command
```

## Quick Start

### Basic Usage

Scan your codebase for dead code with default settings:

```bash
qodo undertaker
```

This will analyze your code and report any functions, classes, or variables with:
- At least 75% confidence of being unused
- No modifications in the last 90 days

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

## Configuration Parameters

### Basic Command Structure

```bash
qodo undertaker [--set parameter=value] [--set parameter=value] ...
```

### Available Parameters

#### `min_confidence` (number, default: 75)

Controls the minimum confidence score to report findings.

- **Range**: 50-100
- **Default**: 75
- **Recommended values**:
  - 90+ for automated cleanup (very high confidence only)
  - 75-89 for manual review (high confidence)
  - 50-74 for exploratory analysis (requires careful review)

**Examples**:
```bash
# Only very high confidence items (safest)
qodo undertaker --set min_confidence=90

# Include high confidence items (recommended)
qodo undertaker --set min_confidence=75

# Include medium confidence (needs manual review)
qodo undertaker --set min_confidence=60
```

#### `min_age_days` (number, default: 90)

Minimum days since last modification to consider code as potentially dead.

- **Default**: 90 (3 months)
- **Recommended values**:
  - 365+ (1+ year) for very old code only
  - 180+ (6+ months) for conservative cleanup
  - 90 (3+ months) for standard cleanup
  - 30-60 for aggressive analysis

**Examples**:
```bash
# Only very old code (1+ year)
qodo undertaker --set min_age_days=365

# Conservative (6+ months)
qodo undertaker --set min_age_days=180

# Standard (3+ months, default)
qodo undertaker --set min_age_days=90
```

#### `file_extensions` (string, default: "all")

Comma-separated list of file extensions to analyze.

- **Default**: "all" (analyzes all common programming languages)

**Examples**:
```bash
# JavaScript/TypeScript only
qodo undertaker --set file_extensions="js,ts,tsx,jsx"

# Python only
qodo undertaker --set file_extensions="py"

# Backend languages
qodo undertaker --set file_extensions="go,rs,java"
```

#### `exclude_patterns` (string, default: "node_modules,dist,build,vendor,.git,test,spec")

Comma-separated directory/file patterns to ignore.

**Examples**:
```bash
# Next.js project
qodo undertaker --set exclude_patterns="node_modules,dist,build,.next,out"

# Rust project
qodo undertaker --set exclude_patterns="node_modules,target,dist"

# Custom exclusions
qodo undertaker --set exclude_patterns="node_modules,.git,generated"
```

#### `include_test_files` (boolean, default: false)

Whether to include test files in analysis.

**Examples**:
```bash
# Include test files
qodo undertaker --set include_test_files=true

# Exclude test files (default)
qodo undertaker --set include_test_files=false
```

#### `create_pr` (boolean, default: false)

Generate pull request with dead code removals.

- **Requires**: GitHub token (GITHUB_TOKEN) or GitLab token (GITLAB_TOKEN)

**Examples**:
```bash
# Create PR with deletions
qodo undertaker --set create_pr=true --set min_confidence=90

# Just analyze, no PR (default)
qodo undertaker
```

#### `group_by_confidence` (boolean, default: true)

When creating PR, create separate PRs for each confidence tier.

**Examples**:
```bash
# Separate PRs per tier (safer, default)
qodo undertaker --set create_pr=true --set group_by_confidence=true

# Single PR for all (faster review)
qodo undertaker --set create_pr=true --set group_by_confidence=false
```

#### `dry_run` (boolean, default: false)

Preview what would be removed without creating actual PR.

**Examples**:
```bash
# Preview only
qodo undertaker --set create_pr=true --set dry_run=true

# Execute changes
qodo undertaker --set create_pr=true --set dry_run=false
```

#### `max_items` (number, default: 1000)

Maximum dead code items to analyze per confidence tier.

**Examples**:
```bash
# Quick scan
qodo undertaker --set max_items=100

# Thorough analysis
qodo undertaker --set max_items=5000
```

## Common Usage Patterns

### Safe Cleanup (Recommended Starting Point)

High confidence items, 6+ months old:
```bash
qodo undertaker --set min_confidence=90 --set min_age_days=180
```

### Preview Before Committing

Test configuration without creating actual PR:
```bash
qodo undertaker --set create_pr=true --set dry_run=true --set min_confidence=85
```

### Language-Specific Analysis

Focus on specific programming language:
```bash
# Python only
qodo undertaker --set file_extensions="py" --set min_confidence=85

# JavaScript/TypeScript
qodo undertaker --set file_extensions="js,ts,jsx,tsx" --set min_confidence=80

# Go and Rust
qodo undertaker --set file_extensions="go,rs" --set min_confidence=90
```

### Ancient Dead Code Only

Find code untouched for over a year:
```bash
qodo undertaker --set min_confidence=95 --set min_age_days=365 --set create_pr=true
```

### Incremental Cleanup Strategy

Clean up in phases, starting with highest confidence:
```bash
# Phase 1: Very high confidence, 1+ year old
qodo undertaker --set min_confidence=95 --set min_age_days=365

# Phase 2: High confidence, 6+ months old
qodo undertaker --set min_confidence=85 --set min_age_days=180

# Phase 3: Medium confidence (manual review)
qodo undertaker --set min_confidence=60 --set min_age_days=90
```

### Framework-Specific Examples

**Next.js project**:
```bash
qodo undertaker --set file_extensions="js,ts,tsx" --set exclude_patterns="node_modules,.next,out,dist"
```

**Rust project**:
```bash
qodo undertaker --set file_extensions="rs" --set exclude_patterns="target,dist"
```

**Django project**:
```bash
qodo undertaker --set file_extensions="py" --set exclude_patterns="venv,__pycache__,migrations,static"
```

## Understanding Confidence Scores

The Undertaker assigns each finding a confidence score from 50-100% based on multiple factors.

### Confidence Tiers

**Very High (90-100%)** - Safe for automated removal
- Zero references found in the codebase
- Code hasn't been modified in 6+ months
- Not exported (internal only)
- No dynamic usage patterns detected

**High (75-89%)** - Safe with quick review
- Zero references but modified recently
- OR 1-2 references and old code

**Medium (50-74%)** - Manual verification required
- Few references (1-3)
- Some age (3-6 months)
- Might be used dynamically

**Below 50%** - Automatically excluded (active code)

### What Affects Confidence Score

**Reference Count** - How many times the code is used elsewhere:
- 0 references: Highest confidence boost
- 1-2 references: Medium confidence boost
- 3-5 references: Low confidence boost
- 6+ references: Excluded as active code

**Code Age** - Time since last modification:
- 6+ months: Highest confidence boost
- 3-6 months: Medium confidence boost
- Less than 3 months: Low confidence boost

**Export Status** - Whether code is public:
- Internal only: Confidence boost
- Exported/public: No boost (might be used externally)

**Dynamic Usage** - Patterns like eval(), reflection:
- Detected: Confidence reduced
- Not detected: No change

**Special Case**: Unreachable code (after return/throw) automatically receives 100% confidence.

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
          fetch-depth: 0  # Full history needed

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Install Qodo Command
        run: npm install -g @qodo/command

      - name: Run Dead Code Detection
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          qodo undertaker \
            --set min_confidence=90 \
            --set create_pr=true

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
        --set create_pr=true
  artifacts:
    paths:
      - dead-code-analysis.json
  only:
    - schedules
```

## Troubleshooting

### Missing Git History

**Issue**: Warning about unavailable git history

**Solution**: Ensure you're in a git repository with full history:
```bash
git clone --depth=full <repository-url>
```

For CI/CD, use `fetch-depth: 0` in checkout actions.

### PR Creation Failed

**Issue**: Cannot create pull request

**Common causes**:
- Missing GitHub/GitLab token
- Insufficient repository permissions
- No items meet min_confidence threshold

**Solution**: Set the required environment variable:
```bash
# For GitHub
export GITHUB_TOKEN=your_token_here

# For GitLab
export GITLAB_TOKEN=your_token_here
```

### Parse Errors

**Issue**: Errors parsing specific files

**Solution**: Add problematic directories to exclusions:
```bash
qodo undertaker --set exclude_patterns="node_modules,dist,build,generated"
```

### No Results Found

**Issue**: Agent reports no dead code found

**Possible reasons**:
- min_confidence threshold too high
- min_age_days threshold too high
- Codebase is genuinely clean

**Solution**: Try lower thresholds:
```bash
qodo undertaker --set min_confidence=60 --set min_age_days=30
```

## Best Practices

### 1. Start Conservative

Begin with very high confidence items:
```bash
qodo undertaker --set min_confidence=90 --set min_age_days=180
```

### 2. Always Preview First

Use dry run before creating actual PRs:
```bash
qodo undertaker --set create_pr=true --set dry_run=true
```

### 3. Test After Removal

Always run your test suite after removing dead code:
```bash
# After dead code is removed
npm test
# or
python -m pytest
```

### 4. Clean Up Incrementally

Start with oldest, highest confidence code and work your way down:
1. Very high confidence, 1+ year old
2. High confidence, 6+ months old
3. Medium confidence with manual review

### 5. Exclude Generated Code

Always exclude auto-generated files:
```bash
qodo undertaker --set exclude_patterns="node_modules,vendor,dist,build,.next,generated"
```

### 6. Monitor False Positives

If you encounter false positives:
- Add those patterns to exclusions
- Increase min_confidence threshold
- Focus on older code with higher min_age_days

## Limitations

### What The Undertaker Cannot Detect

The agent may not catch code that is used in these ways:

- **Runtime-only usage**: Code called through reflection, eval(), or dynamic imports
- **External usage**: Code used by external packages or services
- **Conditional compilation**: Code used only in specific build configurations
- **Plugin systems**: Code loaded dynamically at runtime
- **Configuration-driven**: Code referenced only in config files

### When to Use Manual Review

Always manually review findings for:

- **Public APIs**: Exported functions even if unused internally
- **Medium confidence** (50-74%): Requires verification
- **Recent code** (less than 3 months old): May be in development
- **Critical paths**: Authentication, payments, security code
- **Framework patterns**: React hooks, dependency injection, decorators

## Comparison with Other Tools

| Feature | The Undertaker | ESLint/Pylint | Coverage Tools | IDE Find Usages |
|---------|----------------|---------------|----------------|-----------------|
| Cross-file analysis | Yes | Limited | No | Yes |
| Historical context | Yes | No | No | No |
| Confidence scoring | Yes | No | No | No |
| Multi-language | 10+ languages | Per-language | Per-language | Per-language |
| PR generation | Yes | No | No | No |
| CI/CD integration | Yes | Yes | Yes | No |
| Age-based filtering | Yes | No | No | No |
| Cross-platform | Yes | Yes | Yes | Limited |

The Undertaker complements existing tools by providing:
- Deeper cross-file analysis than linters
- Historical context that coverage tools lack
- Automated PR creation for cleanup
- Confidence-based prioritization

## Output Format

The agent returns structured JSON with:

```json
{
  "summary": {
    "total_files_scanned": 150,
    "total_dead_code_items": 23,
    "very_high_confidence": 15,
    "high_confidence": 6,
    "medium_confidence": 2,
    "estimated_lines_removable": 487,
    "oldest_dead_code_days": 547
  },
  "dead_code_items": [
    {
      "identifier": "unusedFunction",
      "type": "function",
      "location": {
        "file": "src/utils.js",
        "line_start": 42,
        "line_end": 55
      },
      "confidence_score": 95,
      "confidence_tier": "very_high",
      "metrics": {
        "reference_count": 0,
        "days_since_last_modified": 547,
        "last_modified_date": "2024-03-15",
        "is_exported": false
      },
      "reasoning": "No references found in codebase. Last modified 547 days ago (18 months). Internal function not exported.",
      "safe_to_remove": true
    }
  ],
  "warnings": [],
  "success": true
}
```

## Supported Languages

The Undertaker analyzes code in:

- JavaScript (.js, .jsx)
- TypeScript (.ts, .tsx)
- Python (.py)
- Go (.go)
- Java (.java)
- Rust (.rs)
- PHP (.php)
- Ruby (.rb)
- C/C++ (.c, .cpp, .h, .hpp)
- Swift (.swift)
- Kotlin (.kt)

And more through pattern-based detection.

## Contributing

The Undertaker is part of the [Qodo Agents](https://github.com/qodo-ai/agents) project. Contributions are welcome!

To suggest improvements:
1. Open an issue describing the enhancement
2. Submit a pull request with changes
3. Include tests and documentation updates

## Support

- **Documentation**: [Qodo Command Docs](https://docs.qodo.ai/qodo-documentation/qodo-command)
- **Issues**: [GitHub Issues](https://github.com/qodo-ai/agents/issues)
- **Community**: [Qodo Discord](https://discord.gg/qodo)

## License

MIT License - see [LICENSE](../../LICENSE) for details

---

**Built with the Qodo community**

*The Undertaker: Because every codebase deserves a proper burial for its dead code.*