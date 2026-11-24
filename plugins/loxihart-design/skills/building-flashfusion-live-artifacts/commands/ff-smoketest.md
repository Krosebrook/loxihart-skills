---
description: Run the 10-item smoke test against the current FlashFusion artifact
---

# /ff-smoketest — FlashFusion Artifact Smoke Test

Run the 10-item smoke test against the currently registered `flashfusion-control-center` artifact. Use after every build (`/ff-build`) or patch (`/ff-patch`).

## The Checklist

Walk the user through each item. Do NOT declare the artifact production-ready until all 10 pass.

- [ ] **1. Renders without JS errors in browser console**
  Open browser devtools → Console tab. Reload the artifact. Zero red errors.

- [ ] **2. Demo mode displays all 10 panels with plausible data**
  No empty panels. KPIs show numbers, charts have data, tables have rows.

- [ ] **3. Config modal opens with `?` key and C button; closes with Escape**
  Press `?` → modal appears. Press Escape → modal closes. Press C → modal appears. Click outside → modal closes.

- [ ] **4. Entering a project ID switches badge to "LIVE"**
  Open Config → enter Supabase project ID → Save. Mode badge in top nav changes from "DEMO" to "LIVE". `localStorage.ff_pid` is set.

- [ ] **5. Clearing project ID reverts to Demo mode**
  Open Config → clear project ID → Save. Mode badge returns to "DEMO". Panels show Demo data.

- [ ] **6. Budget gauge reflects `ff_budget` from localStorage**
  Default ceiling is 50. Change `ff_budget` to 100 in Config → gauge re-renders with new ceiling.

- [ ] **7. Chart.js line chart renders 7-day trend**
  Chart canvas is non-blank. Data points visible. X-axis labels show day names. (Demo data acceptable.)

- [ ] **8. Approval queue table shows rows**
  Approval queue panel has 1+ rows visible. Each row has task, agent, timestamp, priority. (Demo data acceptable.)

- [ ] **9. Dark glassmorphic style: void bg, frosted panels, violet accents**
  Background is `#0B0B14` void purple. Panels have backdrop blur. Primary accents are `#A855F7` violet. NOT washed out, NOT light theme.

- [ ] **10. Artifact ID is exactly `flashfusion-control-center`**
  Verify the ID used in `create_artifact` / `update_artifact` calls. NOT a versioned ID, NOT a duplicate.

## Failure Triage

If any item fails, consult `skills/building-flashfusion-live-artifacts/references/gotchas.md` and use the Diagnosis Quick-Reference table:

| Symptom | Likely Gotcha # |
|---|---|
| Items 2, 7, 8 — empty panels | #3 (direct fetch blocked) or #5 (Chart.js version) |
| Item 9 — washed out, white bg | #2 (missing `color-scheme: light`) |
| Item 10 — duplicate artifact | #8 (changed `artifact_id`) |
| InputValidationError when registering | #1 (skipped ToolSearch) |

## Rules

- All 10 items must pass. No "9 of 10 is good enough."
- If any item fails: stop, fix, re-run the full test (not just the failed item).
- Do NOT run live data tests against an unfamiliar Supabase project — confirm `ff_pid` is the user's PERSONAL project, NOT LOXIHART `oorstbwcydxwiojrsoim`.

$ARGUMENTS
