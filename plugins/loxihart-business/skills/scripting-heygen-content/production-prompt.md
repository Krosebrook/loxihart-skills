# Production Prompt Block — Full Format

Output this block verbatim after every script. Fill in all bracketed fields before outputting — no placeholders in final output.

---

## Block Format

```
─── HEYGEN PRODUCTION PROMPTS ───────────────────────────

LOOK SELECTION
Recommend: [Formal / Smart-Casual / Casual]
Reasoning: [one sentence on content register]

VOICE DIRECTOR TAGS
Tags are embedded inline in the script above. Placement confirmed:
  <break time="0.8s" /> — after hook line, before credibility bridge
  <emphasis level="strong"> </emphasis> — on the single most important phrase
  <prosody rate="95%"> </prosody> — wrap any list or dense content
  <break time="0.5s" /> — before soft close

PACING NOTES
- Hook: [delivery note]
- Bridge: [delivery note]
- Close: [delivery note]

B-ROLL SUGGESTIONS
(3–5 ideas for cutaway or overlay footage)
1. [suggestion]
2. [suggestion]
3. [suggestion]

CREDIT ESTIMATE (HeyGen Creator Plan)
~[N] credits for [X] words at [resolution]
Note: Creator plan = ~[limit] credits/month. Check balance before render.

─────────────────────────────────────────────────────────
```

---

## Look Selection Guide

| Content type | Recommended look |
|---|---|
| Origin story, brand intro | Smart-Casual |
| Tutorial, SOP walkthrough | Casual |
| Client proposal, case study | Formal |
| Social clip, quick tip | Casual |
| Product explainer | Smart-Casual |
| Thought leadership / hot take | Smart-Casual |

Default: Smart-Casual. It reads professional without creating distance.

---

## Credit Estimate Guide

These are approximations. HeyGen charges per minute of rendered output. Check current Creator Plan credit allocation before committing to a render queue.

| Duration | Approx words | Approx credits (1080p) |
|---|---|---|
| 60s | 130–150 | 2–3 |
| 90s | 185–215 | 3–4 |
| 2 min | 250–280 | 4–5 |
| 3 min | 380–420 | 6–7 |

Resolution note: 720p uses fewer credits. 4K (if available on plan) costs more. Default to 1080p unless user specifies otherwise.

---

## Multi-Placement CTA Library

Use the user-specified destination or fall back to multi-placement default.

| Destination | Closing line |
|---|---|
| YouTube (subscribe) | "Subscribe to follow the work." |
| LinkedIn (awareness) | "Follow along on LinkedIn — I post the real process." |
| Abstrekkt / FlashFusion homepage (book) | "If this is the kind of work you're looking for, FlashFusion.co." |
| Newsletter (subscribe) | "I publish The Prompt weekly — link in the description." |
| Multi-placement default | "Find me at FlashFusion.co." |

---

## Voice Director Tag Reference

HeyGen supports SSML-like tags for voice control. Use sparingly — over-tagging creates robotic delivery. Maximum 4–5 tags per 90s script.

| Tag | Purpose | Values |
|---|---|---|
| `<break time="Xs" />` | Deliberate pause | 0.3s – 2.0s |
| `<emphasis level="X">text</emphasis>` | Stress on word/phrase | reduced, moderate, strong |
| `<prosody rate="X%">text</prosody>` | Speed control | 75% – 125% |
| `<prosody volume="X">text</prosody>` | Volume control | soft, medium, loud |

**Standard placement for every script:**
1. `<break time="0.8s" />` — after hook line, before bridge
2. `<emphasis level="strong">` — on the single most important phrase in THE WORK beat
3. `<break time="0.5s" />` — before the soft close

**Optional additions:**
- `<prosody rate="95%">` — wrap any list or dense instruction block
- `<emphasis level="moderate">` — on a second-priority phrase if the script has competing claims

**Do not use:**
- More than one `<emphasis level="strong">` per script — diminishing returns
- `<break>` tags inside the bridge or gap beats — let the natural sentence rhythm carry those sections
- Rate tags on the hook — the hook should land at normal pace, not slowed
