# Video and audio script templates

Eight templates. Each has: use case, voice notes, structure, acceptance criteria.

Spoken content follows different rules than written content. Shorter sentences. Stated subjects. No nested clauses. Say it aloud before shipping — if it tangles the tongue, cut.

---
## Table of contents

Jump to a template by its number. Each section is self-contained; you don't need to read the preceding sections.

| # | Template | Line |
|---|---|---|
| 1 | Short-form vertical video (TikTok / Reels / Shorts) | ~20 |
| 2 | Explainer video (2–3 min) | ~49 |
| 3 | Tutorial / how-to video | ~82 |
| 4 | Podcast episode outline (long-form conversation) | ~119 |
| 5 | Voiceover script (narrated content) | ~178 |
| 6 | Gemini Lyria audio piece prompt (chaosclub) | ~218 |
| 7 | Chaosclub voice note (spoken-word layer on a lyric) | ~265 |
| 8 | Interview prep doc (for The Prompt or any long-form) | ~301 |

Cross-template notes at the bottom (read-aloud rule, timecode trap, music rights, caption/transcript rule).

---


## 1. Short-form vertical video (TikTok / Reels / Shorts)

**Use:** 30–60 second vertical video. Hook-driven. One idea.

**Voice:** Conversational. First 1.5 seconds are load-bearing — if the hook is weak, the scroll already won. No throat-clearing. No "Hey guys." No sign-off that begs for follow.

**Structure:**
```
[0:00–0:03] HOOK — one sentence that creates a specific curiosity gap.
            Visual: {{pattern-interrupt, on-screen text, face close}}

[0:03–0:10] CONTEXT — one sentence. Why should they care.

[0:10–0:45] PAYOFF — the thing. Concrete. Specific. Show don't tell.
            Break into 2-3 visual beats to keep hand off the scroll button.

[0:45–0:60] CLOSE — one sentence that lands the point.
            No "follow for more." Let the value do the asking.

CAPTION (platform text overlay or description):
{{hook repeated or extended — platform algo reads this}}

HASHTAGS: 3-5 specific, 0 broad.
```

**Acceptance:** Hook passes the "thumb test" — if you paused at 2s, would you keep watching? Payoff is concrete, not abstract. No filler.

---

## 2. Explainer video (2–3 min)

**Use:** Tool demo, concept breakdown, "how X works" for a mid-attention audience (YouTube, embedded on a landing page).

**Voice:** Teacherly but not condescending. Ship a version that respects the viewer's time — 2:30 with no padding beats 5:00 with filler.

**Structure:**
```
[0:00–0:15] COLD OPEN — the question or problem, stated plainly.
            No logo card. No channel intro.

[0:15–0:30] STAKES — why this matters to the viewer, specifically.

[0:30–2:00] EXPLANATION — three beats max. One concept per beat.
            Beat 1: {{concept}} — show a concrete example
            Beat 2: {{concept}} — show a concrete example
            Beat 3: {{concept}} — show a concrete example
            B-roll / screen-recording note per beat: {{what's on screen}}

[2:00–2:30] SO WHAT — how the viewer uses this. One specific action.

[2:30–2:45] CLOSE — the single thing you want them to remember.

PRODUCTION NOTES:
  Cuts every: {{4-6 sec}} (attention hygiene)
  On-screen text: {{when and what}}
  Music bed: {{instrumental only, -18 dB under VO}}
```

**Acceptance:** Can be cut to 90 sec without losing the point. Has a "so what." No throat-clearing intro.

---

## 3. Tutorial / how-to video

**Use:** Step-by-step instruction. Viewer should be able to follow along and succeed.

**Voice:** Imperative. Present tense. Each step is one verb.

**Structure:**
```
[0:00–0:20] WHAT WE'RE DOING — one sentence outcome statement.
            "By the end of this you will have {{thing}}."

[0:20–0:40] PREREQS — what the viewer needs before starting.
            List on-screen. Wait 3 sec per bullet.

[0:40–end]  STEPS — numbered, one per section.
            Each step:
              1. State the step.
              2. Show the step.
              3. Show what success looks like.
              4. Call out the most common failure mode.

[close]     VERIFY — how the viewer confirms it worked.
            {{expected output / visible result}}

            IF IT DIDN'T WORK — one branching path.
            "If you see {{error}}, it's {{cause}}. Do {{fix}}."

PRODUCTION NOTES:
  Screen recording: {{required app / window}}
  Zoom: {{when to zoom in for small UI}}
  Cursor highlight: on
```

**Acceptance:** A viewer could pause after each step, execute, and succeed. Every step has a visible success signal. At least one failure mode called out.

---

## 4. Podcast episode outline (long-form conversation)

**Use:** 30–90 minute conversational episode with a guest or solo.

**Voice:** Notes, not script. You're building a map, not a teleprompter. Let the conversation breathe.

**Structure:**
```
EPISODE {{n}}: {{title}}
Guest: {{name, role, why-now}}
Duration target: {{mm:ss}}
Recording date: {{date}}

COLD OPEN (0:00–2:00)
  Hook clip pulled from body of interview (cut in post)
  Or: 30-sec teaser on what's coming

INTRO (2:00–4:00)
  Who guest is. Why this conversation matters now.
  One-sentence setup for the main thread of the episode.

ACT I — CONTEXT (4:00–15:00)
  Origin / backstory / how guest got here
  Questions:
    - {{question}}
    - {{question}}
    - {{question}}

ACT II — THE MEAT (15:00–55:00)
  The real reason this episode exists.
  Questions (ranked, cut from bottom if running long):
    - {{question}}
    - {{question}}
    - {{question}}
    - {{question}}
  Rabbit holes to chase if time: {{list}}
  Rabbit holes to avoid: {{list}}

ACT III — IMPLICATIONS (55:00–80:00)
  So what. What changes because of this.
  Questions:
    - {{question}}
    - {{question}}

CLOSE (80:00–end)
  Where to find the guest
  One specific ask of the listener — not "subscribe," something earned
  Tease next episode

SHOW NOTES (post-production):
  [timecode] — [topic]
  Resources mentioned: {{list}}
  Guest links: {{list}}
```

**Acceptance:** Outline survives contact with the conversation — flexible enough to follow the guest somewhere unexpected, structured enough to not get lost. Act II questions ranked so you can cut from bottom without losing the spine.

---

## 5. Voiceover script (narrated content — explainer, documentary-style)

**Use:** Pre-recorded narration over visuals. No face on camera.

**Voice:** Read-aloud cadence. Shorter sentences than written prose. Every sentence ends with a clear beat.

**Structure:**
```
SLATE: {{project-name}} / VO / take {{n}} / {{date}}
Duration target: {{mm:ss}}
Tone: {{conversational | authoritative | warm | dry}}
Pace: {{wpm — 140 conversational, 120 authoritative, 160 energetic}}

[SCENE 1 — {{visual-description}}]
(VO, warm)
{{line}} [pause]

{{line}} [pause]

{{line}}

[SCENE 2 — {{visual-description}}]
(VO)
{{line}}

{{line}} [emphasize: {{word}}]

...

PRONUNCIATION GUIDE:
  {{proper-noun}} = {{phonetic}}
  {{term}} = {{phonetic}}

TAKES TO PICK UP IF NEEDED: {{list}}
```

**Acceptance:** Read the whole script aloud. If you ran out of breath mid-sentence, the sentence is too long. If you stumbled on a word, replace it.

---

## 6. Gemini Lyria audio piece prompt (chaosclub)

**Use:** Generating an original audio track via Gemini Lyria 3 Pro / Clip for chaosclub. Prompt is the spec — model quality is bounded by prompt specificity.

**Voice:** Descriptive. Sensory. No metaphor unless the metaphor maps to a concrete musical choice.

**Structure:**
```
TRACK SLUG: {{slug}}
PAIRED LYRIC: {{lyric-id or title}}
TARGET DURATION: {{seconds}}
PREMIUM TIER: {{true | false}}

PROMPT (to Lyria):

  Genre: {{primary}} with elements of {{secondary}}
  Tempo: {{bpm}} ({{slow | medium | driving}})
  Key / mode: {{A minor | D Dorian | etc}}

  Instrumentation:
    - Lead: {{instrument, texture}}
    - Rhythm: {{instrument, pattern}}
    - Bass: {{instrument, register}}
    - Atmosphere: {{pads | field recording | silence}}

  Dynamics arc:
    0–{{n}}s: {{description}}
    {{n}}–{{n}}s: {{description}}
    {{n}}–{{end}}s: {{description}}

  Mood anchor (1 sentence): {{the feeling the track is trying to create}}

  Reference points: {{2-3 artists or tracks for Lyria to triangulate on}}
  Avoid: {{things the model drifts toward that don't fit}}

POST-GEN CHECKLIST:
  [ ] Drift check — did Lyria stay in the specified tempo range?
  [ ] Loop-points clean (for audio that needs to loop)
  [ ] No vocal leakage if instrumental
  [ ] R2 upload path: r2://{{bucket}}/{{filename}}.wav
  [ ] Firestore tracks/{{id}} updated with R2 key + duration + moodTags
```

**Acceptance:** Prompt is specific enough that two runs produce similar outputs. Mood anchor is one sentence, not a paragraph. Reference points are specific artists/tracks, not genres.

---

## 7. Chaosclub voice note (spoken-word layer on a lyric)

**Use:** Kyle reads a lyric aloud, or records a 30–90 second context note. Posted alongside the written lyric on chaosclub.co.

**Voice:** Low. Unrushed. Reading Room at Midnight. Don't perform the lyric — let it sit. If recording context, speak like you're talking to one person in the room, not an audience.

**Structure:**
```
PIECE: {{title}}
TYPE: {{lyric-read | context-note | both}}
DURATION TARGET: {{30-90s for context, lyric-read as long as it needs}}

IF LYRIC-READ:
  Breath marks in the lyric: {{/ where to pause, // for longer pause}}
  Lines to slow on: {{list}}
  Lines to leave unemphasized: {{list — the undertow often is}}
  One line not to read at all — it lives on the page only: {{optional}}

IF CONTEXT-NOTE:
  What prompted the piece. One sentence. Not the meaning of the piece.
  What you were doing when the line came. Concrete.
  A small refusal — what the piece is not about.
  {{no wrap-up. no lesson. end on the refusal.}}

RECORDING NOTES:
  Room: {{space with soft surfaces, mic close}}
  Mic distance: 4-6 inches
  Levels: peak -12 dB, RMS -18 dB
  Post: light compression, no reverb, no music bed
  File: r2://{{bucket}}/voice/{{slug}}.wav
```

**Acceptance:** The voice note does not explain the piece. It sits next to it. If you listen and feel like you've been taught something, re-record.

---

## 8. Interview prep doc (for The Prompt or any long-form)

**Use:** Prepping for a recorded conversation — podcast, video interview, live panel. Internal doc.

**Voice:** Notes to self. Candid. No audience here.

**Structure:**
```
INTERVIEW: {{guest-name}} — {{topic}}
RECORDING: {{date, time, platform}}
FORMAT: {{podcast | video | panel | live}}
DURATION: {{target mm:ss}}

WHY THIS GUEST, WHY NOW
{{one paragraph — the specific reason this conversation belongs in the
feed right now. if you can't answer this, cancel or reschedule.}}

WHAT I WANT THE LISTENER TO LEAVE WITH
{{one specific thing. not "insight." something concrete.}}

BACKGROUND
  Guest's current work: {{}}
  Recent signal: {{article, talk, project — something fresh to anchor to}}
  Things to AVOID bringing up: {{known-sensitive or already-covered}}

THE 5 QUESTIONS THAT MATTER
1. {{question}} — purpose: {{what this draws out}}
2. {{question}} — purpose: {{}}
3. {{question}} — purpose: {{}}
4. {{question}} — purpose: {{}}
5. {{question}} — purpose: {{}}

THE 2 QUESTIONS IF TIME
6. {{question}}
7. {{question}}

THE 1 QUESTION IF THE CONVERSATION GOES WHERE YOU HOPE
{{the risky one. the one that assumes trust built in the first 30 min.}}

CONTINGENCIES
  If guest goes off on {{topic}}: {{redirect or let it run — decide now}}
  If guest won't answer {{question}}: {{fallback question}}
  If running long: {{which questions to cut — rank ahead of time}}

POST-RECORDING
  Thank-you note draft: {{}}
  Episode angle if edit reveals a different thread: {{}}
```

**Acceptance:** The "why this guest, why now" is a real answer, not a generic one. The 1 risky question is actually risky. Cut-order for Act II is decided before you hit record.

---

## Cross-template notes

**Read-aloud rule.** Every video/audio template gets read aloud before it ships. Every one.

**The timecode trap.** Timecodes are planning aids, not commitments. If a beat runs 12 seconds instead of 10, fine — don't compress to hit a number.

**Music rights.** Default to licensed or original (Lyria) for any music bed. Copyright strikes on creator platforms compound — one strike on a chaosclub upload could put the whole account at risk.

**Caption and transcript.** Every piece of video/audio that ships publicly gets a transcript. Not negotiable for accessibility.
