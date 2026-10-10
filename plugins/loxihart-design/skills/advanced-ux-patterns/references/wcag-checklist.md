# WCAG 2.2 Level AA — Complete Checklist

## Perceivable

### 1.1 Text Alternatives
- [ ] **1.1.1** Non-text content has text alternative (alt, aria-label, aria-labelledby)
  - Decorative images: `alt=""` or `role="presentation"`
  - Functional images (buttons): describe the action, not the image
  - Complex images (charts): describe data in caption or linked page
  - CAPTCHAs: provide audio alternative

### 1.2 Time-Based Media
- [ ] **1.2.1** Audio-only / video-only has transcript or description
- [ ] **1.2.2** Captions provided for prerecorded audio in video
- [ ] **1.2.3** Audio description OR media alternative for prerecorded video
- [ ] **1.2.4** Live captions for live audio in video
- [ ] **1.2.5** Audio description for prerecorded video

### 1.3 Adaptable
- [ ] **1.3.1** Information, structure, relationships conveyed programmatically (semantic HTML)
  - Headings use `<h1>`–`<h6>`, not styled `<div>`
  - Lists use `<ul>`, `<ol>`, `<dl>`
  - Tables use `<th>` with `scope`, `<caption>`
  - Forms use `<label>` with `for` attribute
- [ ] **1.3.2** Meaningful reading order (logical DOM order, not CSS-faked)
- [ ] **1.3.3** Instructions don't rely solely on shape/color/location ("click the green button")
- [ ] **1.3.4** Orientation not locked to portrait or landscape
- [ ] **1.3.5** Input purpose can be programmatically determined (autocomplete attributes)
  - `autocomplete="name"`, `"email"`, `"tel"`, `"street-address"`, etc.

### 1.4 Distinguishable
- [ ] **1.4.1** Color not the only visual means of conveying information
- [ ] **1.4.2** Audio control: auto-playing audio can be paused/stopped
- [ ] **1.4.3** Contrast — normal text ≥4.5:1, large text ≥3:1
  - Large text: ≥18pt regular OR ≥14pt bold
- [ ] **1.4.4** Text resize up to 200% without loss of content or function
- [ ] **1.4.5** Images of text avoided (use real text)
- [ ] **1.4.10** Reflow — content reflows at 320px width without horizontal scroll (except data tables, maps, toolbars)
- [ ] **1.4.11** Non-text contrast ≥3:1 (UI components, graphic elements)
- [ ] **1.4.12** Text spacing: no content/function loss when setting:
  - Line height ≥1.5× font size
  - Letter spacing ≥0.12× font size
  - Word spacing ≥0.16× font size
  - Paragraph spacing ≥2× font size
- [ ] **1.4.13** Hover/focus content (tooltips, popovers) is: dismissible (Escape), hoverable, persistent

---

## Operable

### 2.1 Keyboard Accessible
- [ ] **2.1.1** All functionality operable via keyboard
- [ ] **2.1.2** No keyboard trap (user can Tab away from any component)
- [ ] **2.1.4** Single-char keyboard shortcuts can be turned off / remapped (if implemented)

### 2.2 Enough Time
- [ ] **2.2.1** Timing adjustable (turn off, adjust, or extend)
  - Exception: real-time events (auctions, live scores)
- [ ] **2.2.2** Pause, stop, hide moving/scrolling/auto-updating content

### 2.3 Seizures and Physical Reactions
- [ ] **2.3.1** Nothing flashes >3 times/second

### 2.4 Navigable
- [ ] **2.4.1** Skip links (bypass repetitive nav: "Skip to main content")
- [ ] **2.4.2** Page titles describe topic/purpose
- [ ] **2.4.3** Focus order is logical and meaningful
- [ ] **2.4.4** Link purpose clear from link text alone OR link text + context
  - Avoid: "click here", "read more", "learn more"
- [ ] **2.4.5** Multiple ways to find pages (nav, search, sitemap, breadcrumbs)
- [ ] **2.4.6** Headings and labels descriptive
- [ ] **2.4.7** Keyboard focus visible
- [ ] **2.4.11** (2.2 AA) Focus not obscured by sticky headers/overlays (minimum: partially visible)
- [ ] **2.4.12** (2.2 **AAA**) Focus not fully obscured — note: AAA, not AA requirement
- [ ] **2.4.13** (2.2 **AAA**) Focus appearance: 2px outline, ≥3:1 contrast against adjacent color — note: AAA, not AA requirement

### 2.5 Input Modalities
- [ ] **2.5.1** Pointer gestures (multi-point, path-based) have single-pointer alternative
- [ ] **2.5.2** Pointer cancellation: mouseup/pointerup, not mousedown/pointerdown
- [ ] **2.5.3** Labels match accessible names (visible label included in accessible name)
- [ ] **2.5.4** Motion actuation: alternatives exist, can be disabled
- [ ] **2.5.7** (2.2) Dragging: alternative to drag operations
- [ ] **2.5.8** (2.2) Target size ≥24×24px (minimum), ≥44×44px recommended

---

## Understandable

### 3.1 Readable
- [ ] **3.1.1** `lang` attribute on `<html>` element
- [ ] **3.1.2** Language changes in content marked (`lang` on element)

### 3.2 Predictable
- [ ] **3.2.1** No context change on focus alone
- [ ] **3.2.2** No context change on input alone (unless warned)
- [ ] **3.2.3** Consistent navigation across pages
- [ ] **3.2.4** Consistent identification of same-function components
- [ ] **3.2.6** (2.2) Consistent help (contact, self-help) in same location

### 3.3 Input Assistance
- [ ] **3.3.1** Error identification: input error described in text
- [ ] **3.3.2** Labels or instructions provided for user input
- [ ] **3.3.3** Error suggestion: if error detected and suggestions known, provide them
- [ ] **3.3.4** Error prevention (legal, financial, data): reversible, checked, or confirmed
- [ ] **3.3.7** (2.2) Redundant entry: don't ask users to re-enter info already provided
- [ ] **3.3.8** (2.2) Accessible authentication: no cognitive test required unless alternative provided

---

## Robust

### 4.1 Compatible
- [ ] **4.1.2** Name, role, value programmatically determinable for all UI components
  - Custom components need ARIA roles, states, properties
  - `aria-expanded`, `aria-selected`, `aria-checked`, etc.
- [ ] **4.1.3** Status messages programmatically determinable without focus (aria-live)

---

## Quick Reference: Most Commonly Failed

| Criterion | Failure Pattern | Fix |
|---|---|---|
| 1.1.1 | Missing or meaningless alt text | Describe function, not appearance |
| 1.3.1 | Div soup, no semantic structure | Use semantic HTML elements |
| 1.4.3 | Low contrast text | Minimum 4.5:1 for normal text |
| 2.4.4 | "Click here" links | Descriptive link text |
| 2.4.7 | Invisible focus | Visible 2px outline, ≥3:1 contrast |
| 3.3.1 | Vague error messages | "Email is required" not "Invalid input" |
| 4.1.2 | Custom components missing ARIA | Add role, state, property attributes |

## Testing Tools
- Browser: Chrome DevTools Accessibility panel, Firefox Accessibility Inspector
- Extensions: axe DevTools, WAVE, Lighthouse
- Screen readers: NVDA (Windows), VoiceOver (Mac/iOS), TalkBack (Android)
- Contrast: WebAIM Contrast Checker, Colour Contrast Analyser
- Keyboard: Tab through entire page without mouse

## Practical Additions (Not in AA, Expected in Modern Builds)

These aren't WCAG 2.2 AA requirements but are standard practice:

- **`prefers-reduced-motion`** — Gate all CSS/JS animations behind `@media (prefers-reduced-motion: no-preference)`. WCAG 2.3.3 covers this at AAA; users with vestibular disorders depend on it. Tailwind: `motion-safe:` / `motion-reduce:` utilities.
- **Dark mode contrast** — If you ship a dark theme, verify contrast ratios independently. Light-mode passing values don't transfer.
- **Focus return on modal close** — Return focus to the trigger element on dialog dismiss. Not explicitly stated in AA but required for usable keyboard nav.

---

## WCAG 3.0 — Status as of 2025

WCAG 3.0 is in **Working Draft** — not finalized, not legally binding, not a replacement for 2.2.

Key structural changes coming:
- **Outcomes** replace success criteria (more flexible, goal-oriented framing)
- **Bronze / Silver / Gold** conformance levels replace A / AA / AAA
- **APCA (Accessible Perceptual Contrast Algorithm)** replaces the current 4.5:1 / 3:1 contrast ratios — more nuanced, context-dependent (font weight and size factor in directly)
- **Critical Errors** concept — any issue that blocks task completion for any user group triggers a conformance failure regardless of other passing criteria
- **Adept** rating (~equivalent to current AA) is the expected minimum target

**What to do now:**
- Keep implementing WCAG 2.2 AA — it's the current legal and contractual standard
- Monitor APCA: `https://www.myndex.com/APCA/` — the contrast math is different and worth learning early
- Don't ship hardcoded contrast values assuming 2.2 ratios will satisfy WCAG 3.0 — they may not

> **APCA forward-compat check (optional):** Run your contrast pairs through
> https://www.myndex.com/APCA/ alongside the current 4.5:1 check. If you're
> failing APCA significantly, your palette will need rework when WCAG 3.0 lands.
