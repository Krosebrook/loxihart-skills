# Screenshot Standards

## Naming (matching depends on this — exact)

- Single-section doc: `step_01.png`, `step_02.png` …
- Multi-section doc (step numbers reset per H1): `<section_slug>_step_01.png`
  — slug = first 3–4 meaningful words of the H1, lowercase, underscores,
  no spaces (`voicemail_setup_step_01.png`)
- Always zero-pad to two digits. `step_1.png` breaks sort-order matching.

## Capture quality

- Viewport default 1280×800 unless the app demands otherwise; keep it constant
  within a document.
- Capture the full relevant container (whole modal, whole settings pane) —
  not tight crops. The reader needs orientation context.
- UI state must show the step *completed or ready*: dropdown open if the step
  is choosing an option, field populated if the step is typing.

## Redaction (non-negotiable)

Mask before embedding: passwords, API keys, real customer names/emails/phone
numbers, license keys, internal URLs the audience shouldn't see. Solid-color
block, not blur (blur is reversible enough to be a liability). If a step
cannot be captured without live PII, capture in a test account or flag the
step for a mocked screenshot.

## Annotation

Default: none — clean screenshots, the doc text carries the instruction.
If the source document's style uses Scribe-style callouts, add a single
click-indicator per image (circle or arrow), same color throughout, nothing else.
