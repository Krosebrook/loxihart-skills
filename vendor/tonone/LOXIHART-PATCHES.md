# Loxihart patches to this vendored tonone snapshot

This directory is a snapshot of [tonone-ai/tonone](https://github.com/tonone-ai/tonone) recorded in `.source.json`. The upstream [LICENSE](LICENSE) is unchanged.

The snapshot does not include upstream `team/` trees. Loxihart applied the following catalog and manifest edits so `claude plugin validate --strict` passes on what is actually present here.

1. **Local `source` paths for present bundles.** Four marketplace entries pointed at GitHub tree URLs (`https://github.com/tonone-ai/tonone/tree/main/bundle/...`) even though those directories exist in this snapshot. Their `source` values were rewritten to `./bundle/<name>`:
   - `design-team`
   - `data-science-team`
   - `secops-team`
   - `devx-team`
2. **Catalog trimmed to paths that exist here.** 307 marketplace entries whose `source` paths are not in this snapshot were removed: 160 GitHub tree URLs under `team/...`, 146 local `./team/...` entries, and `./skills/contribute`. Files that are present were not deleted.
3. **Entry versions synced to `plugin.json`.** All 150 remaining marketplace entries declared stale versions (mostly `0.6.6`; also `1.0.0`, `0.6.1`, `0.8.0`, and `1.2.0`–`1.8.0`). Each was updated to match its `plugin.json`, which is `1.9.1` in this snapshot.
4. **Unknown `type` field removed.** `claude plugin validate --strict` treats warnings as errors. The validator warned on an unknown top-level `type` field (`"skill"`) in 139 remaining marketplace entries and 140 nested `plugin.json` manifests (including `skills/form-brief`, which has a manifest but no catalog entry). The field is ignored at load time, so it was removed. Hook `"type": "command"` values in the root plugin were left untouched.
5. **Plugin-root `CLAUDE.md` relocated.** Newer upstream snapshots ship a `CLAUDE.md` at the plugin root. `claude plugin validate --strict` warns that this file is not loaded as project context and treats that warning as an error. The script moves it to `docs/CLAUDE.md` (or `docs/CLAUDE.upstream.md` if that name is already taken). This snapshot did not include a root `CLAUDE.md`.

These patches are applied by `.github/scripts/patch_tonone.py`. A raw upstream copy will fail `--strict` again until that script is run (or the missing `team/` trees are vendored too, and a plugin-root `CLAUDE.md` is moved aside).

## Re-sync from upstream

From the repository root, one command fetches a new snapshot, keeps this file and the upstream LICENSE, reapplies the patches above, and runs `claude plugin validate --strict vendor/tonone` when the CLI is available:

```bash
python3 .github/scripts/patch_tonone.py sync
```

That uses the latest GitHub release of `tonone-ai/tonone`. Pin a tag, branch, or commit with `--ref`:

```bash
python3 .github/scripts/patch_tonone.py sync --ref v1.17.2
```

CI runs `python3 .github/scripts/patch_tonone.py --check` so a snapshot that is missing these patches fails. A weekly (and manual) workflow, `.github/workflows/sync-tonone.yml`, runs the same sync and opens a pull request when the snapshot changes. It does not merge automatically.

The script is idempotent: `apply` on an already-patched tree writes nothing.
