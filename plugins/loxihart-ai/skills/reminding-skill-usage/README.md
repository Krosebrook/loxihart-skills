# Skill Reminder

**Discover and leverage the right skills from your Claude library**

Analyzes your task and suggests which skills would be most helpful, acting as a "meta-skill" for skill discovery.

## Quick Start

### Invoke the Skill

```
"I need to create a presentation about Q4 results"
"What skills should I use for building a secure API?"
"Help me find the right skill for responsive web design"
```

### What You Get

Claude will:
1. Analyze your task
2. Suggest 2-5 relevant skills
3. Explain why each skill fits
4. Ask if you want to use them
5. Invoke the chosen skill(s)

## Example Usage

**Task:** "I need to create a technical documentation site"

**Response:**
```
Based on your task to create a technical documentation site, I recommend:

1. **technical-doc-creator** - Build professional API documentation with code examples
2. **frontend-design** - Create a polished documentation UI
3. **responsive-design-patterns** - Ensure docs work on all devices

Would you like me to use these skills to start building?
```

## Skill Categories Covered

- 📝 **Document Creation** (docx, pdf, pptx, xlsx)
- 💻 **Development** (frontend, backend, full-stack)
- 🔒 **Security** (AppSec, OWASP, compliance)
- 📊 **Planning** (roadmaps, architecture, diagrams)
- 📚 **Documentation** (technical docs, codebase guides)
- 🤖 **Automation** (workflows, AI agents, MCP)
- 🛠️ **Tools** (skill creation, packaging, analysis)
- 🎨 **Design** (UI/UX, design systems, graphics)

## When to Use

- **Starting new task** - Get guidance on which skills apply
- **Stuck on approach** - Discover skills you didn't know about
- **Multiple options** - Compare which skills fit best
- **Learning library** - Explore available capabilities

## Installation

### Claude Desktop / Claude.ai

1. Download `skill-reminder.zip`
2. Go to Settings → Capabilities → Skills
3. Drag and drop the zip file
4. Done!

### Claude Code

```bash
# Personal (global)
unzip skill-reminder.zip -d ~/.claude/skills/

# Project (local)
unzip skill-reminder.zip -d .claude/skills/
```

## How It Works

1. **Task Analysis** - Understands what you're trying to accomplish
2. **Domain Mapping** - Categorizes into development, design, security, etc.
3. **Skill Matching** - Uses keyword patterns to find relevant skills
4. **Recommendation** - Suggests 2-5 most relevant skills with explanations
5. **Invocation** - Can immediately use suggested skills if requested

## Matching Rules

The skill uses keyword patterns to suggest skills:

| Keywords | Suggested Skills |
|----------|------------------|
| "document", "report" | docx, internal-comms |
| "spreadsheet", "data" | xlsx, code-execution |
| "presentation" | pptx, canvas-design |
| "frontend", "React" | frontend-dev-guidelines, frontend-design |
| "backend", "API" | backend-dev-guidelines, error-tracking |
| "secure", "OWASP" | staff-engineer-v3 |
| "plan", "roadmap" | create-plans, feature-planning |
| "automation" | workflow-automation, ai-agents-workflow |

## Benefits

✅ **Faster Discovery** - Find the right skill immediately  
✅ **Better Results** - Use specialized skills instead of general chat  
✅ **Learn Library** - Discover skills you didn't know existed  
✅ **Consistent Quality** - Leverage proven workflows every time  

## Version History

- **1.0.0** (2025-12-17): Initial release
  - 50+ skill catalog
  - Keyword-based matching
  - Category organization
  - Example interactions

## Related Skills

- **create-agent-skills** - Build new skills
- **skill-packager** - Package skills for distribution
- **conversation-analyzer** - Analyze your Claude usage patterns

## License

MIT License
