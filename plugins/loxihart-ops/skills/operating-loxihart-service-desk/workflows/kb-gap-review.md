# Workflow: KB Gap Review

Run when no KB article covers the resolved issue.

## Process

### Step 1 — Confirm Gap
Search `references/kb-article-registry.md` + FreshService. If article exists but doesn't cover this scenario, that's an article update, not a gap.

### Step 2 — Draft Flag
```
⚑ KB GAP: No article covers [topic]. Recommend creating [code] — [title].
```

### Step 3 — Capture Context
In the same note: issue (one sentence), fix (steps), root cause, environment constraints, first-timer warnings. This prevents re-investigation when the article is authored.

### Step 4 — Route
KB GAP flags reviewed during weekly KB review. When authored, update original ticket.

## Completion Gate
- [ ] KB and FreshService searched
- [ ] Gap flag with suggested code and title
- [ ] Resolution context captured
- [ ] Code follows naming convention
