# Success Criteria — Operating the FlashFusion Marketing Crew

## Quantitative

- Triggers on most prompts that ask to launch or build a FlashFusion campaign, funnel, or landing-page-plus-nurture combo, or that explicitly reference rebuilding an "AI marketing team" pattern for personal use.
- A full crew run (all six roles applicable) completes without open-ended retry loops on any single tool call.
- Zero silent tool substitutions: if Meta Ads is requested and no connector exists, the run stops and reports the gap rather than quietly using Google Ads instead.

## Qualitative

- The Copywriter's locked angle is visibly referenced by every other role's output — no drift to a different lever mid-run.
- Brand tokens appear in every Canva-generated asset without being re-specified by the user each time.
- No mid-workflow redirects caused by role/tool mismatches the decision logic should have caught up front (standalone page vs. product change; Google Ads vs. Meta).
- A new session reusing this skill produces materially the same role roster and tool choices as a prior run, given the same brief.

## Explicitly out of scope (do not treat as a failure)

- Meta/Instagram ad launches — the known-gaps field already documents this; the skill correctly stops rather than fabricating coverage.
- Loxihart or freelance-client campaigns — wrong lane, not this skill's job.
