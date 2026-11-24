# FlashFusion Newsletter Configuration

## Identity
- **Name:** FlashFusion
- **Tagline:** AI tools, workflows, and creator-tech — weekly
- **Aesthetic:** Dark-mode primary, neon-glass accents
- **Primary color:** #A855F7 (purple glow)
- **Accent gradient:** #A855F7 → #F472B6 → #22D3EE

## Delivery
- **Primary:** Substack (native editor, supports embeds, code blocks, images)
- **Secondary:** Email (plain HTML fallback)
- **Publishing cadence:** Weekly, typically Tuesday or Wednesday

## Substack Formatting

### Header Block
```
# [Issue Title]
*FlashFusion · Issue [N] · [Date]*
```

### Section Markers
Use horizontal rules (`---`) between sections. Substack renders these as clean dividers.

### Code Blocks
Substack supports fenced code blocks. Use for prompt examples, CLI commands, and automation snippets.

### Images
Reference by URL. Substack hosts images natively — upload during publishing.

## Section Templates

### 1. Lead Story (400–600 words)
```markdown
## [Tool/Trend Name]: [Opinionated Take in 8 Words or Fewer]

[2-paragraph setup: what it is, why it matters NOW]

[3-4 paragraphs: hands-on experience, specific use case, comparison to alternatives]

**The bottom line:** [1 sentence verdict]

**Try it:** [Link]
```

### 2. Quick Hits (3–5 items)
```markdown
## Quick Hits

**[Tool Name] [version]** — [What changed in 1 sentence]. [Why you care in 1 sentence]. [Link]

**[Tool Name]** — [Same pattern]. [Link]
```

### 3. Workflow of the Week
```markdown
## Workflow: [Descriptive Name]

**What it does:** [1 sentence]
**Tools:** [List]
**Time to set up:** [Estimate]

### Steps
1. [Step with specific detail]
2. [Step with specific detail]
3. [Step with specific detail]

**Pro tip:** [Non-obvious insight from actual usage]
```

### 4. Free Tier Spotlight
```markdown
## Free Find: [Tool Name]

[2-3 sentences on what it does and why the free tier is surprisingly good]

**Best for:** [Use case]
**Limitation:** [What the paid tier adds]
**Link:** [URL]
```

### 5. What I'm Building
```markdown
## What I'm Building

[2-3 paragraphs on a personal project, experiment, or tool combination being tested.
Honest about what's working and what isn't. Builds ongoing narrative across issues.]
```

## Depth Layering

FlashFusion is single-tier but depth-layered within each section:

- **Surface layer** (first sentence of each section): accessible to anyone
- **Technical layer** (body paragraphs): assumes comfort with AI tools, CLI, APIs
- **Power-user layer** (pro tips, workflow steps): assumes hands-on experience

This lets readers self-select depth without needing separate editions.

## Content Filters

**Include:** AI tools (Claude, ChatGPT, Midjourney, Cursor, v0, Bolt, etc.), personal productivity automation, creator-tech trends, prompt engineering techniques, n8n/Zapier/Make workflows, open-source tools, free tier discoveries.

**Exclude:** Enterprise procurement, analyst-style market sizing, compliance deep-dives, funding round analysis (unless it directly affects a tool's future), corporate partnership announcements.

## Tone Guide

Write like you're texting a technically sharp friend who asked "what should I try this week?"

- Opinionated: "Skip X, use Y instead" not "X and Y are both valid options"
- Specific: "I ran 50 prompts through both and Claude won 38" not "Claude performs well"
- Honest: "The free tier is better than the paid tier of [competitor]" or "This is overhyped"
- Action-oriented: Every section ends with something the reader can do right now
