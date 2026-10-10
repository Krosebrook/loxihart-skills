# Tool Routing Rationale — Otter / Granola / Mem

## The one-line split

**Otter** captures what was said. **Granola** captures what it meant.
**Mem** is where distilled context lives afterward. Route by which failure
would hurt more, then everything flows into Mem within 24 hours.

## Routing matrix

| Meeting shape | Capture with | Why |
|---|---|---|
| Client discovery / workshop (FF) | Otter | Verbatim matters — quotes feed proposals and case studies; consent required |
| Internal Loxihart sync / 1:1 | Granola | Decisions and actions matter; a transcript of a standup is noise |
| Vendor demo / webinar | Otter | You'll want to re-check specific claims later |
| Ad-hoc hallway / call with no capture running | Neither — voice-note or type 3 bullets immediately | Reconstruction beats nothing; label it as reconstructed |
| Anything where recording wasn't consented | Granola (notes only) | Transcription without consent is off the table, full stop |

## Why not one tool for everything

- Otter-everything drowns retrieval in transcript sludge; nobody re-reads
  45 minutes of filler to find one decision.
- Granola-everything loses verbatim ground truth exactly when a claim gets
  disputed ("they said the API supports X").
- Mem-as-capture fails because capture and storage are different jobs —
  Mem gets the *distilled* record, not raw exhaust.

## The 24-hour protocol (where the value actually is)

Within 24h of any captured meeting: pull decisions, owners, dates, and open
questions into a Mem note titled `<date> — <meeting>`; link the source
(transcript/notes); tag by lane (Loxihart / FF) — cross-lane contamination rules
apply to meeting intelligence too. Uncaptured after 24h ≈ didn't happen.
