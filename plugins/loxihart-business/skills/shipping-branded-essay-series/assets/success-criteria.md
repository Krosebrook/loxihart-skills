# Success Criteria — shipping-branded-essay-series

The acceptance gate. A run is a pass only if every item holds.

## Quantitative

- Activates on ≥90% of real series-production requests (see SKILL.md Trigger Evals).
- Zero hard-rule violations across the shipped set (verified by
  `scripts/verify-series.sh` + manual context resolution of every hit).
- 100% of shipped essays carry both footers (Claims + Gaps) and correct badge/act.
- 100% of reused essays are renumber-only (byte-identical body vs the source, one
  badge + one footer-meta string changed).
- Zero fabricated statistics, percentages, or outcomes in any shipped file.

## Qualitative

- No mid-run redirect: the pipeline runs spec → manuscript → HTML without Kyle
  having to re-explain lane rules or the template.
- Voice is consistent across the set and matches `references/voice-spec.md` — a
  reader can't tell which posts were templated by different subagents.
- Every gated post states exactly what confirmation unblocks it and the count
  impact if cut — none is guessed clean.
- The deliverable names the real publish blocker (platform / live URL), not just
  "content done".

## Anti-criteria (automatic fail)

- Employer named or day-job incident described, even anonymized.
- Memoir-lane material (percentiles, clinical, [PERSON], "Construction Not
  Recovery" origin) appears in Load-Bearing copy.
- A reused essay was regenerated instead of renumbered.
- An editorial/review note ([NEEDS MATERIAL], cut-form) shipped in an HTML file.
- A `[SOURCED]` tag with no openable citation behind it.
