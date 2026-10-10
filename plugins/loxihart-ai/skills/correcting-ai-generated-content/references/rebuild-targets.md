# Rebuild Targets

## lb-essay (Load-Bearing Essay)

### Visual Tokens
```css
--bg: #0d0d0f
--surface: #141417
--border: rgba(255,255,255,0.07)
--text-primary: #f0ede8
--text-secondary: #8a8680
--text-tertiary: #52504e
--accent: #c9a96e
--accent-dim: rgba(201,169,110,0.12)
--font-serif: 'Fraunces'
--font-body: 'Crimson Pro'
--font-mono: 'JetBrains Mono'
```

### Structure
masthead ("Load-Bearing" + "AI tools, tested under load") →
series-badge → essay-meta (date, topic, word count) →
h1 → deck (italic) → body sections → claims → gaps → footer

### Voice Rules (from 03-style.md)
- Open by reading the room — reader's problem first, not your thesis
- Short sentence. Then longer. Short to close. Sentence length is punctuation.
- No editorial tells: "Here's what actually happened", "Looking back",
  "Let's dive in", "And that's when I realized"
- Technical precision carries emotional weight — failures are system failures
- End with observation or declarative. Never summary. Never warm.

### Hard Bans
"leverage" · "game-changer" · "paradigm shift" · "harness the power of" ·
"in today's world" · "unlock your potential" · any sentence that could run
in a self-help book unchanged · any opener that begins with a question ·
any closer that summarizes the argument

### Reference File
`lb-essay-07-fifty-skills.html` in project files is the canonical voice
reference. When in doubt, match that register.

---

## ff-b2b (FlashFusion B2B Content)

### Visual Tokens
```css
--s1: #0B0B14   /* void dark */
--vi: #A855F7   /* violet */
--ma: #EC4899   /* magenta */
--cy: #22D3EE   /* cyan */
font: Instrument Serif (display) + Geist (body) + Geist Mono (labels)
```

### Voice Rules
- Anti-hype, ROI-grounded, sales-coded but not sales-y
- Peer-level B2B register — competence story, not productivity story
- No fabricated case study numbers. All claims need sources or [GENERATED] tags.
- CTA block allowed at bottom: links to `audit.flashfusion.co`

### Forbidden
- ChaosClubCo / ChaosCollective (retired — never in new copy)
- Day job employer named or titled beyond "a managed IT firm"
- Credential claims before Anthropic CCA-F is passed (July 20, 2026)
- "240+ tools mastered" — actual figure is ~40 hands-on tools

---

## plain-markdown

Return clean markdown. No visual treatment.
- [SOURCED] and [GENERATED] tags inline after each factual claim
- CLAIMS and GAPS footers at end in the standard format
- `!` prefix on contradictions in CLAIMS footer
