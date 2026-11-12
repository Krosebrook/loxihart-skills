# Loxihart patches to this vendored tonone snapshot

This directory is a snapshot of [tonone-ai/tonone](https://github.com/tonone-ai/tonone) recorded in `.source.json` (last sync 2026-06-17). The upstream [LICENSE](LICENSE) is unchanged.

The snapshot does not include upstream `team/` trees. Loxihart applied the following catalog and manifest edits so `claude plugin validate --strict` passes on what is actually present here.

1. **Local `source` paths for present bundles.** Four marketplace entries pointed at GitHub tree URLs (`https://github.com/tonone-ai/tonone/tree/main/bundle/...`) even though those directories exist in this snapshot. Their `source` values were rewritten to `./bundle/<name>`:
   - `design-team`
   - `data-science-team`
   - `secops-team`
   - `devx-team`
2. **Catalog trimmed to paths that exist here.** 307 marketplace entries whose `source` paths are not in this snapshot were removed: 160 GitHub tree URLs under `team/...`, 146 local `./team/...` entries, and `./skills/contribute`. Files that are present were not deleted.
3. **Entry versions synced to `plugin.json`.** All 150 remaining marketplace entries declared stale versions (mostly `0.6.6`; also `1.0.0`, `0.6.1`, `0.8.0`, and `1.2.0`–`1.8.0`). Each was updated to match its `plugin.json`, which is `1.9.1` in this snapshot.
4. **Unknown `type` field removed.** `claude plugin validate --strict` treats warnings as errors. The validator warned on an unknown top-level `type` field (`"skill"`) in 139 remaining marketplace entries and 140 nested `plugin.json` manifests (including `skills/form-brief`, which has a manifest but no catalog entry). The field is ignored at load time, so it was removed. Hook `"type": "command"` values in the root plugin were left untouched.

A raw upstream copy will fail `--strict` again unless this catalog trim and these manifest corrections are re-applied (or the missing `team/` trees are vendored too).
