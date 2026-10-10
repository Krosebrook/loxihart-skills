# Skill Packager

**Production-ready Claude skill packager following 2025 Anthropic standards**

Package Claude skills into validated, distribution-ready zip files for Claude.ai, Claude Desktop, and skill marketplaces.

## Features

- ✅ **2025 Standards Compliance** - Validates YAML frontmatter, naming conventions, structure
- 🔍 **Security Scanning** - Detects API keys, secrets, and sensitive data
- 📏 **Size Validation** - Warns about large packages (>10MB)
- 🏗️ **Structure Verification** - Ensures single top-level folder, proper file organization
- 📊 **Detailed Reports** - Generates validation reports with installation instructions
- 🎯 **Progressive Disclosure** - Checks SKILL.md under 500 lines
- 🔒 **Safe Defaults** - Skips hidden files, __pycache__, .pyc files

## Quick Start

### Basic Usage

```bash
# Package a skill
python scripts/package_skill.py /path/to/my-skill

# Output: output/my-skill.zip
```

### With Custom Output

```bash
python scripts/package_skill.py /path/to/my-skill --output ./dist
```

### Skip Validation (Not Recommended)

```bash
python scripts/package_skill.py /path/to/my-skill --no-validation
```

## Requirements

- Python 3.7+
- PyYAML (optional but recommended for YAML validation)

```bash
pip install pyyaml
```

## What Gets Validated

### Required

- ✅ SKILL.md exists at root
- ✅ YAML frontmatter with `name` and `description`
- ✅ Name is lowercase-with-hyphens (max 64 chars)
- ✅ Description under 1024 chars
- ✅ Single top-level folder in zip

### Warnings

- ⚠️ SKILL.md over 500 lines
- ⚠️ Markdown headings (#) in body (use XML tags)
- ⚠️ No version field
- ⚠️ Package over 10MB
- ⚠️ Description doesn't mention "when to use"

### Security

- 🔒 No API keys (sk-ant-...)
- 🔒 No password/secret/token patterns
- 🔒 Hidden files excluded (.env, .git)

## Package Structure

Proper skill package structure:

```
my-skill.zip
└── my-skill/
    ├── SKILL.md              # Required
    ├── README.md             # Recommended
    ├── workflows/            # Optional
    │   ├── workflow-a.md
    │   └── workflow-b.md
    ├── references/           # Optional
    │   ├── patterns.md
    │   └── examples.md
    ├── templates/            # Optional
    │   └── template.txt
    └── scripts/              # Optional
        └── helper.py
```

## YAML Frontmatter Format

```yaml
---
name: my-skill-name           # Required: lowercase-with-hyphens
description: What it does and when to use it. Use when...  # Required
version: 1.0.0               # Optional but recommended
allowed-tools: Bash, Read    # Optional (Claude Code only)
---
```

## Validation Report

After packaging, you'll get a detailed report:

```
==============================================================
CLAUDE SKILL PACKAGE REPORT
==============================================================

Skill:       my-skill
Version:     1.0.0
Size:        0.05 MB
Package:     /path/to/output/my-skill.zip

VALIDATION RESULTS
--------------------------------------------------------------
✓ All checks passed!
✓ YAML frontmatter valid
✓ Required fields present
✓ No secrets detected
✓ Package structure valid

INSTALLATION
--------------------------------------------------------------
Claude.ai / Desktop:
  1. Go to Settings → Skills
  2. Click 'Upload Skill'
  3. Select my-skill.zip

Claude Code:
  # Personal (global)
  unzip my-skill.zip -d ~/.claude/skills/

  # Project (local)
  unzip my-skill.zip -d .claude/skills/

==============================================================
```

## Common Errors & Fixes

### ❌ No YAML frontmatter found

**Fix:** Add YAML at top of SKILL.md:

```yaml
---
name: my-skill
description: What it does and when to use it
---
```

### ❌ Name doesn't match directory

**Fix:** Either:
- Rename directory to match YAML name
- Update YAML name to match directory

### ❌ Possible secret detected

**Fix:** Remove secrets from files. Use:
- Environment variables at runtime
- Config files (not included in package)
- Claude's secure parameter passing

### ⚠️ SKILL.md over 500 lines

**Fix:** Use progressive disclosure:
- Keep principles in SKILL.md
- Move detailed content to references/
- Split workflows into separate files

## Batch Packaging

Package multiple skills:

```bash
#!/bin/bash
for skill_dir in skills/*/; do
    python scripts/package_skill.py "$skill_dir"
done
```

## CI/CD Integration

### GitHub Actions

```yaml
name: Package Skills

on:
  push:
    tags:
      - 'v*'

jobs:
  package:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.10'
      
      - name: Install dependencies
        run: pip install pyyaml
      
      - name: Package skill
        run: python scripts/package_skill.py my-skill/
      
      - name: Upload to release
        uses: softprops/action-gh-release@v1
        with:
          files: output/my-skill.zip
```

## Best Practices

### DO ✅

- Use semantic versioning (1.0.0)
- Keep SKILL.md under 500 lines
- Use XML tags instead of markdown headings
- Include README with installation instructions
- Test package before distribution
- Add version field for tracking

### DON'T ❌

- Include API keys or secrets
- Create multiple top-level folders in zip
- Use uppercase in skill names
- Forget to test the packaged skill
- Include large binary files (>10MB)

## Troubleshooting

### Import Error: No module named 'yaml'

```bash
pip install pyyaml
```

### Permission Denied

```bash
chmod +x scripts/package_skill.py
```

### Zip Already Exists

The script overwrites existing zips. Delete manually if needed:

```bash
rm output/my-skill.zip
```

## Related Skills

- **create-agent-skills** - Build new skills from scratch
- **skill-validator** - Validate existing skills
- **skill-publisher** - Publish to marketplaces

## Resources

- [Anthropic Skills Documentation](https://docs.claude.com/en/docs/agents-and-tools/agent-skills)
- [Skills Best Practices](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/best-practices)
- [awesome-claude-skills](https://github.com/travisvn/awesome-claude-skills)

## License

MIT License - See LICENSE file for details

## Version History

- **1.0.0** (2025-01-17): Initial release
  - YAML validation
  - Structure checking
  - Security scanning
  - Report generation
