# Migration Checklist: [PROJECT NAME]

**Date**: [YYYY-MM-DD]
**Migration Type**: [Restructure / Monorepo consolidation / Convention enforcement]
**Estimated Effort**: [X hours]
**Risk Level**: [Low / Medium / High]

---

## Pre-Migration Checklist

- [ ] Working tree is clean (`git status` shows no changes)
- [ ] All tests pass on current structure
- [ ] CI pipeline is green on main/master
- [ ] Migration branch created: `restructure/[date]`
- [ ] Team notified of incoming structural changes
- [ ] Backup confirmed (branch or tag on current state)

---

## Migration Steps

### Phase 1: Safe Foundation ([estimated time])

No-risk changes: new directories, new files, no moves.

| # | Action | Command | Risk | Verify |
|---|--------|---------|------|--------|
| 1.1 | [Action] | `[command]` | 🟢 | [How to verify] |
| 1.2 | [Action] | `[command]` | 🟢 | [How to verify] |

**Commit**: `chore: create new directory structure`

### Phase 2: Leaf Moves ([estimated time])

Move files with no inbound imports (nothing depends on them).

| # | Action | From → To | Importers | Risk | Verify |
|---|--------|-----------|-----------|------|--------|
| 2.1 | [Action] | `old` → `new` | 0 | 🟢 | [Verify] |

**Commit**: `refactor: move orphan files to new locations`

### Phase 3: Internal Moves ([estimated time])

Move files with known importers. Update imports after each move.

| # | Action | From → To | Importers | Risk | Verify |
|---|--------|-----------|-----------|------|--------|
| 3.1 | [Action] | `old` → `new` | [N] files | 🟡 | [Verify] |

**Import updates required:**
- [ ] `[file1.ts]`: update import from `old/path` to `new/path`
- [ ] `[file2.ts]`: update import

**Commit**: `refactor: move [description] and update imports`

### Phase 4: Hub Moves ([estimated time])

Move highly-imported files. Highest risk phase.

| # | Action | From → To | Importers | Risk | Verify |
|---|--------|-----------|-----------|------|--------|
| 4.1 | [Action] | `old` → `new` | [N] files | 🔴 | [Verify] |

**External reference updates:**
- [ ] CI workflow: `.github/workflows/[file].yml`
- [ ] Docker: `Dockerfile` COPY line [N]
- [ ] Aliases: `tsconfig.json` paths
- [ ] Package.json: [field]

**Commit**: `refactor: move [description], update [N] imports and configs`

### Phase 5: Config and Reference Updates ([estimated time])

Update all external references to match new structure.

| # | Config File | Change | Risk |
|---|-------------|--------|------|
| 5.1 | [File] | [What to update] | 🟡 |

**Commit**: `chore: update config paths for new structure`

### Phase 6: Cleanup ([estimated time])

Remove empty directories, update documentation, verify everything.

| # | Action | Risk |
|---|--------|------|
| 6.1 | Remove empty directories | 🟢 |
| 6.2 | Update root README | 🟢 |
| 6.3 | Update directory-level READMEs | 🟢 |
| 6.4 | Remove temporary re-export shims (if any) | 🟡 |

**Commit**: `chore: cleanup post-restructure`

---

## Post-Migration Verification

- [ ] `npm run build` / `cargo build` / `go build ./...` passes
- [ ] `npm test` / `pytest` / `go test ./...` passes
- [ ] CI pipeline passes on migration branch
- [ ] Docker build succeeds: `docker build --no-cache .`
- [ ] App starts and responds correctly
- [ ] No broken symlinks: `find . -type l ! -exec test -e {} \; -print`
- [ ] No orphaned imports: `tsc --noEmit` / linter
- [ ] .gitignore still covers all generated files

---

## Rollback Plan

If any phase fails:
1. `git checkout main` (or `git revert` the merge commit)
2. All changes are in atomic commits — can revert individual phases
3. No database migrations or external state changes involved

If rollback needed after merge:
```bash
git revert --no-commit HEAD~[N]..HEAD
git commit -m "revert: rollback restructure due to [reason]"
```

---

## Follow-Up Tasks

- [ ] Set up convention enforcement in CI (eslint-plugin-check-file, etc.)
- [ ] Update onboarding docs with new structure
- [ ] Schedule team walkthrough of new structure
- [ ] Monitor CI for path-related failures for 1 week
