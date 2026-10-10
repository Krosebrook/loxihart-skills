# Subagent API & Configuration Reference

API reference, full parameter lists, and configuration tables split out of
SKILL.md under the 500-line rule.

---

## File Structure & Precedence

| Type | Location | Scope | Priority |
|------|----------|-------|----------|
| **Project** | `.claude/agents/` | Current project only | Highest |
| **User** | `~/.claude/agents/` | All projects | Lower |
| **Plugin** | Plugin's `agents/` dir | All projects | Lowest |

Project-level subagents override user-level when names conflict.

Manual editing of subagent files is supported directly:
- Project: `.claude/agents/subagent-name.md`
- User: `~/.claude/agents/subagent-name.md`

---

## Frontmatter Fields (full parameter lists)

### `name`
- Lowercase letters and hyphens only
- Must be unique
- Should match the filename

### `description`
- Natural-language description of purpose
- Include WHEN Claude should invoke this subagent (trigger language)
- Used for automatic subagent selection / routing

### `tools`
- Comma-separated list: `Read, Write, Edit, Bash, Grep`
- If omitted: inherits all tools from the main thread
- Use the `/agents` interface to see all available tools
- Apply least privilege — grant only what the task requires

### `model`
- One of: `sonnet`, `opus`, `haiku`, or `inherit`
- `inherit`: uses the same model as the main conversation
- If omitted: defaults to the configured subagent model (usually sonnet)
- Guidance: Sonnet for reasoning-heavy work, Haiku for simple/high-volume tasks

---

## System Prompt XML Structure

Subagent `.md` files are system prompts consumed only by Claude. Like skills
and slash commands, they should use **pure XML structure** for optimal parsing
and token efficiency.

**Critical rule:** Remove ALL markdown headings (`##`, `###`) from the subagent
body. Use semantic XML tags instead. Keep markdown formatting WITHIN content
(bold, italic, lists, code blocks, links).

For XML structure principles and token efficiency details, see
`@skills/create-agent-skills/references/use-xml-tags.md` — the same principles
apply to subagents.

### Recommended tags

| Tag | Purpose |
|-----|---------|
| `<role>` | Who the subagent is and what it does |
| `<constraints>` | Hard rules (NEVER/MUST/ALWAYS) |
| `<focus_areas>` | What to prioritize |
| `<workflow>` | Step-by-step process |
| `<output_format>` | How to structure deliverables |
| `<success_criteria>` | Completion criteria |
| `<validation>` | How to verify work |

### Intelligence rules (tag depth by complexity)

| Complexity | Tags to include | Examples |
|------------|-----------------|----------|
| **Simple** (single focused task) | role + constraints + workflow | code-reviewer, test-runner |
| **Medium** (multi-step process) | + output_format, success_criteria | api-researcher, documentation-generator |
| **Complex** (research + generation + validation) | + validation, examples | mcp-api-researcher, comprehensive-auditor |

---

## Invocation

### Automatic
Claude automatically selects subagents based on the `description` field when it
matches the current task. Write the description with explicit trigger language.

### Explicit
You can invoke a subagent directly:

```
> Use the code-reviewer subagent to check my recent changes
```

```
> Have the test-writer subagent create tests for the new API endpoints
```

---

## Management

### Using the `/agents` command
Run `/agents` for an interactive interface to:
- View all available subagents
- Create new subagents
- Edit existing subagents
- Delete custom subagents

### Manual editing
Edit subagent files directly at the project or user paths listed in
**File Structure & Precedence** above.

---

## Execution Model Constraints (reference)

Subagents run in isolated contexts and return only their final output to the
main conversation:
- ✅ Can use Read, Write, Edit, Bash, Grep, Glob, and MCP/non-interactive tools
- ❌ Cannot use AskUserQuestion or any tool requiring user interaction
- ❌ Cannot present options or wait for user input
- ❌ The user never sees the subagent's intermediate steps

The main conversation sees only the subagent's final report/output. Design
workflows so all user interaction happens in the main chat, with subagents
handling autonomous, non-interactive work.
