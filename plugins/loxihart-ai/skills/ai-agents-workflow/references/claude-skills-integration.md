# Claude Skills Architecture - Best Practices (2025-2026)

Complete guide for building Claude Skills with 90% activation rates, progressive disclosure patterns, and production deployment strategies.

## Skill Description Optimization (90% Activation)

### Activation Statistics (Community Research, Dec 2025)

| Description Type | Activation Rate |
|------------------|-----------------|
| Generic description | 20% |
| Optimized description | 50% |
| Description + examples | 72% |
| Description + examples + "Use when..." | **90%** |

### Optimization Formula

**Required Elements**:
1. **What it does** (concise, 1-2 sentences)
2. **"USE WHEN" triggers** (explicit keyword list)
3. **Domain coverage** (file types, services, concepts)
4. **Third-person voice** (required for discovery)

### Bad vs Good Descriptions

```yaml
# ❌ BAD: Generic (20% activation)
description: "Analyze Excel spreadsheets"

# ⚠️ OKAY: Specific (50% activation)
description: "Analyze Excel spreadsheets, create pivot tables, generate charts. Use when working with Excel files, spreadsheets, or .xlsx files."

# ✅ EXCELLENT: Maximum (90% activation)
description: |
  Analyze Excel spreadsheets, create pivot tables, charts, and perform
  data analysis. Generate reports from tabular data.
  
  USE WHEN user mentions: Excel, spreadsheet, .xlsx, .csv, pivot table,
  data analysis, chart, graph, tabular data, workbook, or asks to analyze
  data files, create reports from spreadsheets, process CSV files, or
  generate visualizations from tabular data.
  
  Covers formulas, conditional formatting, data validation, and advanced
  Excel features like Power Query and VBA macros.
```

### Template for High Activation

```yaml
description: |
  [Primary capability in 1-2 sentences].
  
  USE WHEN user mentions: [keyword1], [keyword2], [keyword3], [file type],
  [service name], [action verb], or asks to [task description], [another task],
  [related task].
  
  Covers [subtopic1], [subtopic2], [subtopic3], and [advanced features].
```

### Real-World Example (90% Activation)

```yaml
---
name: ai-agents-workflow
description: |
  Build automated workflows, AI agents, and tool integrations using MCP servers,
  LangChain, CrewAI, multi-LLM orchestration, and no-code platforms.
  
  USE WHEN user mentions: MCP server, automation, agent, workflow, LangChain,
  CrewAI, AutoGen, tool integration, API orchestration, Zapier, Make, n8n,
  multi-LLM routing, cost optimization, GitHub Actions, CI/CD pipelines,
  webhook, cron job, scheduled task, or asks to connect services, build bots,
  automate processes, create agentic systems, orchestrate tools, integrate APIs,
  deploy automation, or implement autonomous workflows.
  
  Covers security-first patterns (auth, rate limiting, input validation),
  deployment (Vercel, Cloudflare, Railway, Docker), observability, and
  production-ready implementations with November 2025 MCP spec, April 2025
  security analysis, LangGraph 1.0, CrewAI multimodal, and Claude Skills
  architecture best practices.
version: 2.0.0
---
```

## Progressive Disclosure (3-Layer Architecture)

### Layer 1: Metadata (~100 tokens)

**Loaded**: At Claude startup  
**Purpose**: Skill discovery  
**Content**: Name + description in YAML frontmatter

```yaml
---
name: skill-name
description: "What skill does + USE WHEN triggers"
version: 1.0.0
allowed-tools: Bash, Read, Write  # Claude Code only
---
```

**Best Practices**:
- Keep description under 1024 characters
- Pack maximum information density
- Third-person voice only
- No XML tags or special characters

### Layer 2: Full Instructions (<5K tokens)

**Loaded**: When skill is triggered  
**Purpose**: Core workflow guidance  
**Content**: SKILL.md body

```markdown
# Skill Name

Brief overview (2-3 sentences).

## Core Capabilities

- Capability 1
- Capability 2
- Capability 3

## Quick Start Workflow

### Step 1: Gather Requirements
[Concise step description]

### Step 2: Select Pattern
[Concise step description]

## Reference Files

Detailed implementation guides:
- `references/pattern-a.md` - Advanced pattern details
- `references/pattern-b.md` - Alternative approach
- `scripts/helper.py` - Automation script

## Common Patterns

[2-3 code examples, 10-20 lines each]
```

**Best Practices**:
- Stay under 500 lines for SKILL.md
- Keep under 5,000 words total
- Use progressive disclosure (reference external files)
- Provide immediate value (quick start, common patterns)

### Layer 3: Bundled Resources (Loaded on Demand)

**Loaded**: When explicitly referenced  
**Purpose**: Detailed documentation, scripts, templates  
**Content**: Files in `references/`, `scripts/`, `assets/`

```
skill-name/
├── SKILL.md                    # Layer 2: Core instructions
├── references/                 # Layer 3: Detailed docs
│   ├── advanced-patterns.md
│   ├── api-reference.md
│   └── troubleshooting.md
├── scripts/                    # Layer 3: Executables
│   ├── init_project.py
│   └── validate.sh
└── assets/                     # Layer 3: Templates
    ├── template.json
    └── config-example.yaml
```

**Reference Pattern**:
```markdown
For detailed MCP implementation, see `references/mcp-servers-2025.md`.

For security requirements, check `references/security-checklist-2025.md`.
```

## Five Design Patterns (Anthropic Codified)

### Pattern A: Sequential Workflows

**Use When**: Rigid multi-step processes (onboarding, CI/CD, deployment)

**Implementation**:
```markdown
## Workflow Steps

### Step 1: Initialize
1. Validate prerequisites
2. Create project structure
3. Configure environment

### Step 2: Build
1. Compile source code
2. Run tests
3. Generate artifacts

### Step 3: Deploy
1. Upload to production
2. Run smoke tests
3. Update documentation

## Rollback Instructions

If Step 3 fails after Step 2 succeeds:
1. Revert deployment
2. Restore previous version
3. Alert team via Slack
```

**Key Technique**: Define rollback for each step

### Pattern B: Cross-Service Orchestration

**Use When**: Workflows spanning multiple services (Figma → Drive → Linear → Slack)

**Implementation**:
```markdown
## Phase 1: Design (Figma)
1. Export design assets
2. **VALIDATE**: Ensure all artboards exported before proceeding

## Phase 2: Storage (Google Drive)
1. Upload assets to Drive
2. **VALIDATE**: Confirm file IDs returned

## Phase 3: Tracking (Linear)
1. Create issue with Drive links
2. **VALIDATE**: Issue ID matches pattern

## Phase 4: Notification (Slack)
1. Post update to #design channel
```

**Key Technique**: Phase separation with validation gates

### Pattern C: Iterative Refinement

**Use When**: High-stakes outputs where first draft isn't final

**Implementation**:
```markdown
## Iterative Process

### Iteration Loop
1. Generate draft
2. Run validation: `python scripts/validate.py`
3. If errors > 0: Fix and return to step 1
4. If iterations >= 3: Stop and request human review
5. If validation passes: Proceed to finalization

## Stopping Conditions
- Maximum 3 iterations
- Validation script returns 0 errors
- Human approval received
```

**Key Technique**: Define explicit stopping conditions

### Pattern D: Conditional Routing

**Use When**: Dynamic decisions based on file types, sizes, context

**Implementation**:
```markdown
## Routing Logic

IF file_type == "pdf" AND file_size < 10MB:
    → Use pypdf for text extraction
ELIF file_type == "pdf" AND file_size >= 10MB:
    → Use OCR with chunking
ELIF file_type == "docx":
    → Use python-docx
ELSE:
    → Ask user for file type
```

**Key Technique**: Explicit decision trees

### Pattern E: Knowledge Injection

**Use When**: Domain expertise applied to all relevant work

**Implementation**:
```markdown
## Coding Standards (Always Apply)

When writing Python code:
- Use type hints for all function parameters
- Maximum line length: 88 characters (Black formatter)
- Docstrings: Google style
- Error handling: Specific exceptions, not bare except

When writing API endpoints:
- RESTful naming conventions
- Return consistent error formats
- Include request validation
- Rate limiting: 10/minute default
```

**Key Technique**: Broad triggers so skill activates on all relevant contexts

## YAML Frontmatter Requirements

### Required Fields

```yaml
---
name: skill-name-lowercase         # Max 64 chars, lowercase/numbers/hyphens
description: "What + when to use"  # Max 1024 chars, third-person
version: 1.0.0                     # Semantic versioning recommended
---
```

### Optional Fields (Claude Code Only)

```yaml
---
name: safe-file-reader
description: "Read files without modifications..."
version: 1.0.0
allowed-tools: Read, Grep, Glob   # Least-privilege tool access
license: MIT                       # License terms (or LICENSE.txt)
---
```

### Field Rules

**Name**:
- Lowercase only
- Numbers and hyphens allowed
- No underscores, spaces, XML tags
- No reserved words (system, admin, root)
- Gerund form recommended (verb + -ing)

**Description**:
- Third-person voice ONLY (not first/second person)
- Action-oriented language
- Include "Use when..." triggers
- Max 1024 characters
- No XML tags

**Allowed-Tools** (Claude Code only):
- Restricts tool access for security
- When specified, Claude can only use listed tools
- When omitted, follows standard permission model
- Example: `allowed-tools: Read, Grep, Glob` (read-only skill)

## Skill Installation & Distribution

### Personal Skills (Cross-Project)

```bash
# macOS/Linux
~/.claude/skills/my-skill/

# Windows
%APPDATA%\Claude\skills\my-skill\

# Auto-discovery (no restart needed)
```

### Project Skills (Team Sharing)

```bash
# Project-specific
.claude/skills/my-skill/

# Commit to version control
git add .claude/skills/my-skill/
git commit -m "Add custom skill"

# Team members get skill on git pull
```

### Plugin-Based Distribution

```bash
# Claude Code marketplace
/plugin install anthropic-agent-skills

# Skills from plugin auto-load
# Update via plugin manager
```

### Organization-Wide (December 2025+)

**Admin Deployment**:
- Deploy via Claude Console
- Automatic updates across organization
- Centralized approval workflows
- Version management

**API Management**:
```python
import anthropic

client = anthropic.Anthropic(api_key="...")

# Upload custom skill
with open("SKILL.md", "r") as f:
    skill_content = f.read()

skill = client.skills.create(
    name="my-custom-skill",
    content=skill_content,
    version="1.0.0"
)

# Use in API call
response = client.messages.create(
    model="claude-opus-4-6",
    max_tokens=4096,
    extra_headers={
        "anthropic-beta": "code-execution-2025-08-25,skills-2025-10-02"
    },
    container={
        "skills": [
            {"type": "custom", "skill_id": skill.id, "version": "1.0.0"}
        ]
    },
    tools=[{"type": "code_execution_20250825", "name": "code_execution"}],
    messages=[{"role": "user", "content": "Process data using my-custom-skill"}]
)
```

## API Integration

### Messages API with Skills

```python
import anthropic

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

response = client.messages.create(
    model="claude-opus-4-6",
    max_tokens=4096,
    # Required beta headers
    extra_headers={
        "anthropic-beta": "code-execution-2025-08-25,skills-2025-10-02"
    },
    # Specify up to 8 skills
    container={
        "skills": [
            # Anthropic-managed skill
            {"type": "anthropic", "skill_id": "pptx", "version": "latest"},
            # Custom skill
            {"type": "custom", "skill_id": "my-skill", "version": "1.0.0"}
        ]
    },
    # Code execution required for skills
    tools=[{"type": "code_execution_20250825", "name": "code_execution"}],
    messages=[
        {"role": "user", "content": "Create PowerPoint presentation"}
    ]
)

# Skills create files → use Files API to download
for block in response.content:
    if hasattr(block, 'file_id'):
        file = client.files.retrieve(block.file_id)
        print(f"Download: {file.download_url}")
```

### Prompt Caching with Skills

**Important**: Changing skills list breaks cache

```python
# First request (creates cache)
response1 = client.messages.create(
    model="claude-opus-4-6",
    extra_headers={"anthropic-beta": "code-execution-2025-08-25,skills-2025-10-02,prompt-caching-2024-07-31"},
    container={
        "skills": [{"type": "anthropic", "skill_id": "xlsx"}]
    },
    messages=[{"role": "user", "content": "Analyze data"}]
)

# Second request (uses cache - same skills)
response2 = client.messages.create(
    model="claude-opus-4-6",
    extra_headers={"anthropic-beta": "code-execution-2025-08-25,skills-2025-10-02,prompt-caching-2024-07-31"},
    container={
        "skills": [{"type": "anthropic", "skill_id": "xlsx"}]  # Same skill
    },
    messages=[{"role": "user", "content": "Analyze different data"}]
)  # ✅ Cache hit

# Adding/removing skills breaks cache
response3 = client.messages.create(
    container={
        "skills": [
            {"type": "anthropic", "skill_id": "xlsx"},
            {"type": "anthropic", "skill_id": "pptx"}  # Added skill
        ]
    },
    # ...
)  # ❌ Cache miss
```

## Testing & Validation

### Test Skill Activation

```python
# Ask Claude directly
"""
When would you use the [skill-name] skill?
"""
# Claude quotes description → reveals what triggers skill
```

### Common Activation Issues

| Issue | Cause | Fix |
|-------|-------|-----|
| Skill never activates | Description too generic | Add "Use when..." triggers |
| Activates on wrong tasks | Missing negative examples | Add "Does NOT handle..." section |
| Inconsistent activation | First/second person voice | Use third-person only |

### Validation Checklist

Before deployment:
- [ ] Description under 1024 characters
- [ ] Third-person voice only
- [ ] "Use when..." triggers present
- [ ] Name is kebab-case lowercase
- [ ] SKILL.md under 500 lines
- [ ] References use backtick paths
- [ ] No hardcoded secrets
- [ ] Examples provided
- [ ] Version number set

## Security Considerations

### Audit Before Use

```bash
# Review all skill files
ls -la skill-name/

# Check for suspicious patterns
grep -r "eval\|exec\|os\.system" skill-name/
grep -r "http://" skill-name/  # Unencrypted requests
grep -r "password\|secret\|token" skill-name/  # Hardcoded secrets
```

### Least-Privilege Tools (Claude Code)

```yaml
---
name: read-only-analyzer
allowed-tools: Read, Grep, Glob  # No Write, Edit, Bash
---
```

### Never Install If

- Unknown source (not created by you or trusted org)
- Unexpected network calls in scripts
- File modifications outside stated purpose
- Requests for credentials/tokens
- Obfuscated code

## Best Practices Summary

### Description Field
✅ Include "Use when..." triggers  
✅ List 10+ keywords users actually say  
✅ Mention file types (.xlsx, .pdf)  
✅ Use third-person voice  
✅ Stay under 1024 characters  

### SKILL.md Body
✅ Stay under 500 lines  
✅ Quick start workflow upfront  
✅ Reference external files for details  
✅ Include 2-3 code examples  
✅ Define stopping conditions (iterative patterns)  

### Progressive Disclosure
✅ Metadata in frontmatter (~100 tokens)  
✅ Core workflow in SKILL.md (<5K tokens)  
✅ Details in `references/` (on demand)  
✅ Use backtick paths when referencing files  

### Distribution
✅ Version control skills with project  
✅ Use semantic versioning  
✅ Document dependencies in README  
✅ Test activation before sharing  

## Resources

- **Official Skills Docs**: https://platform.claude.com/docs/agents-and-tools/agent-skills
- **Skills Cookbook**: https://github.com/anthropics/anthropic-cookbook
- **Skills Repository**: https://github.com/anthropics/skills
- **Community Skills**: https://agentskills.io
- **Activation Guide**: https://scottspence.com/posts/how-to-make-claude-code-skills-activate-reliably

## Next Steps

1. Write high-activation description (90% target)
2. Implement progressive disclosure (3 layers)
3. Choose appropriate design pattern (Sequential, Cross-Service, etc.)
4. Validate activation with "When would you use..." test
5. Audit security (no secrets, least-privilege tools)
6. Version and distribute (git, plugin, or API)
