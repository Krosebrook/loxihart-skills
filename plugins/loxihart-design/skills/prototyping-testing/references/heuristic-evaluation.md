# Heuristic Evaluation

## Nielsen's 10 Usability Heuristics

Evaluate each systematically. Document every violation found.

1. **Visibility of system status** — is the user always informed of what's happening and within reasonable time?
2. **Match between system and real world** — does it speak the user's language, using words and concepts familiar to them?
3. **User control and freedom** — can users undo and redo easily? Is there a clearly marked "emergency exit"?
4. **Consistency and standards** — are platform conventions followed? Does the same word/action always mean the same thing?
5. **Error prevention** — are errors prevented before they occur, not just handled after?
6. **Recognition rather than recall** — minimize memory load; make objects, actions, and options visible
7. **Flexibility and efficiency of use** — accelerators for experts; the interface serves both novice and expert users
8. **Aesthetic and minimalist design** — no irrelevant or rarely needed information; every element earns its place
9. **Help users recognize, diagnose, and recover from errors** — plain language, precise problem description, constructive solution
10. **Help and documentation** — when needed, easy to find, task-focused, concrete steps

## Severity Rating Scale (0–4)

| Rating | Label | Action |
|---|---|---|
| 0 | Not a usability problem | No action needed |
| 1 | Cosmetic only | Fix if time permits |
| 2 | Minor usability problem | Low priority |
| 3 | Major usability problem | High priority — fix before release |
| 4 | Usability catastrophe | Must fix before launch |

## Process

1. **Receive** — design description, screenshots, or flow walkthrough
2. **Evaluate individually** — each evaluator reviews against all 10 heuristics independently, without discussing with others first
3. **Document issues** — for each: heuristic violated + description of violation + specific example + severity (0–4)
4. **Consolidate** — combine findings from all evaluators; resolve duplicate entries; aggregate severity where evaluators disagreed (average or take highest)
5. **Group by severity** — present 4s first, then 3s, then 2s, then 1s
6. **Remediation** — specific recommendation per issue, not generic advice
7. **Summary** — top 3 critical issues + overall usability risk level (critical / high / medium / low)

**Minimum 3 evaluators** for reliable coverage. Single evaluator catches ~35% of issues; 3 evaluators catch ~60%; 5 evaluators catch ~75%.

## Issue Documentation Template

```
Heuristic: [number and name]
Severity: [0–4]
Location: [screen / component / flow step]
Description: [what the violation is]
Example: [specific instance in this design]
Recommendation: [specific fix, not generic advice]
```

## Common High-Severity Patterns

- Error messages with codes and no plain-language explanation (H9, severity 3)
- No confirmation for destructive actions (H3, severity 3–4)
- Inconsistent labeling for the same action (H4, severity 2–3)
- Form validation only on submit, not per-field (H5, severity 2–3)
- Loading state with no indicator (H1, severity 2–3)
