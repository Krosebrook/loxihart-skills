# Reference 03 — UX Architecture

Navigation, layout, form, data, and feedback system definitions.
All behaviors are deterministic. No implicit states.

---

## Navigation System

### Global Architecture
Pattern: Horizontal sticky header (desktop), hamburger overlay (mobile)

### State Machine
```
[IDLE]
  hover → [HOVERED] 150ms ease-out, bg change
  click → [ACTIVE] locked until click elsewhere
  tab/focus → [FOCUSED] visible focus ring

[ACTIVE] → [IDLE] on outside click
[FOCUSED] → [IDLE] on Escape
```

### Responsive Rules
| Breakpoint | Behavior |
|---|---|
| ≥ 768px | Horizontal nav inline, all items visible |
| < 768px | Logo + hamburger, full-width dropdown on toggle |

### Active State
- `aria-current="page"` on current link
- Visual: `border-b-2 border-primary-400`, `text-primary-700`

---

## Layout System

### Grid
- 12-column, 1rem gutter
- Container max-widths: 540px → 720px → 960px → 1140px → 1320px

### Breakpoints
```
sm:  640px
md:  768px
lg:  1024px
xl:  1280px
2xl: 1536px
```

### Page Spacing
| Viewport | Margin | Section Padding |
|---|---|---|
| Mobile | `--spacing-6` (1.5rem) | `--spacing-12` vertical |
| Tablet | `--spacing-8` (2rem) | `--spacing-16` vertical |
| Desktop | `--spacing-12` (3rem) | `--spacing-20` vertical |

**Rule:** All margin, padding, gap values MUST come from the spacing scale. No arbitrary values.

---

## Form System

### Input State Machine
```
[DEFAULT] border-neutral-300, surface-input-bg
  → focus: border-primary-400, shadow-sm, 200ms ease-out
  → type: [FILLED] maintain focus border while valid
  → blur:
      if valid → [DEFAULT] or [FILLED] (no border change)
      if invalid → [ERROR] border-error-600, bg-error-50

[ERROR]
  → re-focus: [FOCUSED_ERROR] border-primary-400 (focus ring)
  → correct input → [VALID] border-success-600, bg-success-50, checkmark

[DISABLED] border-neutral-200, disabled-bg, cursor-not-allowed, no events
[LOADING] same as disabled + spinner
```

### Validation Rules
1. Validate on blur (first pass)
2. Validate on each keystroke after first blur
3. Error message: `role="alert"`, `aria-live="polite"`, links to input via `aria-describedby`
4. Touch target minimum: 48×48px on mobile

### Required Field Rules
- Visual: `*` after label text, `text-error-600`
- Attribute: `required` on input element
- Never: placeholder as substitute for label

### Form Layout Rules
- Always `<label htmlFor="id">` with matching `id` on input
- Error text below input, not inline
- Helper text below input, below error text if both present

---

## Data System

### Table State Machine
```
[DEFAULT] rows unsorted
  → column header click: [SORTED_ASC] indicator, aria-sort="ascending"
  → click again: [SORTED_DESC] indicator reversed
  → pagination click: [LOADING] skeleton rows, disabled interaction
    → [DEFAULT] new data, scroll preserved

[ROW_HOVER] bg-neutral-50 (150ms)
[ROW_SELECTED] bg-primary-50, aria-selected="true"

[FILTER_OPEN]
  → apply: [LOADING] → [DEFAULT] filtered
  → Escape: [DEFAULT] no change
```

### Empty State Template
```
Container padding: --spacing-12 vertical
Icon: neutral-300, 2rem size
Headline: text-neutral-900, text-lg, font-semi
Description: text-neutral-600, text-sm, font-body
CTA: Primary button (if action available)
```

### Loading State (Skeleton)
- Background: neutral-200
- Animation: pulse 1s ease-in-out infinite (opacity 0.5 → 1)
- `role="status"`, `aria-live="polite"`
- Content hidden until loaded (not shimmer-only, actual content hidden)

---

## Feedback System

### Toast Positioning
- Desktop: `fixed bottom-4 right-4`
- Mobile: `fixed bottom-4 left-4 right-4`
- Z-index: `z-50`
- Stack direction: newest on top
- Max visible: 5 (older auto-dismiss at 6th)

### Alert (Persistent, Inline)
```
Variants: info | warning | error | success
Structure: border-l-4 [type-color], bg-[type-50], text-[type-700]
Dismiss: optional close button (same as toast close)
State: [VISIBLE] → click close → [CLOSING] 200ms fadeOut → [HIDDEN]
```

### Error Hierarchy
1. **Form inline errors** — below individual field, `role="alert"`
2. **Page-level error** — Alert component at top of form
3. **Toast errors** — Network/async failures
4. **Full page error** — Route-level failures (separate page)

### Empty States (per context)
| Context | Headline | Description | CTA |
|---|---|---|---|
| No data | "Nothing here yet." | Specific to context. | Create action |
| Search no results | "No results for '[query]'." | "Try different terms." | Clear search |
| Error state | "Failed to load." | "Check connection and retry." | Retry button |
| No permissions | "Access restricted." | Contact admin if needed. | None |
