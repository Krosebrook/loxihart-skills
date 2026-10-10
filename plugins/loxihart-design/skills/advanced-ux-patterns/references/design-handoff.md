# Design Handoff Templates

## Component Spec Template

Use this structure when speccing components for engineering handoff.

---

### [Component Name]

**Status:** Ready for development  
**Designer:** [Name]  
**Last updated:** [Date]  
**Figma link:** [URL]

#### States

| State | Description | Trigger |
|---|---|---|
| Default | Base appearance | No interaction |
| Hover | Cursor over component | Pointer enters |
| Focus | Keyboard / programmatic focus | Tab or click |
| Active / Pressed | During click/tap | Mousedown / pointerdown |
| Loading | Async operation in progress | Action triggered |
| Disabled | Not interactive | disabled attribute |
| Error | Validation failure | Blur or submit |
| Success | Validation passed | Blur confirmation |

#### Spacing

| Property | Value | Token |
|---|---|---|
| Padding (top/bottom) | 12px | `spacing-3` |
| Padding (left/right) | 16px | `spacing-4` |
| Gap (internal elements) | 8px | `spacing-2` |
| Margin below | 24px | `spacing-6` |

#### Typography

> Font family depends on brand profile — see `managing-design-briefs`.
> Loxihart: Space Grotesk (headings/labels) + Inter (body/helper). FlashFusion v3: Instrument Serif (headings, 400 only) + Geist (body) + Geist Mono (code). ⚠ Deprecated FF v2 fonts: Poppins, Inter, JetBrains Mono — do not specify.

| Element | Font | Size | Weight | Line Height | Color |
|---|---|---|---|---|---|
| Label | [heading-font] | 14px | 500 | 1.4 | `text-primary` |
| Placeholder | [body-font] | 14px | 400 | 1.4 | `text-muted` |
| Helper text | [body-font] | 12px | 400 | 1.5 | `text-muted` |
| Error text | [body-font] | 12px | 400 | 1.5 | `text-error` |

#### Colors

> Pull actual hex values from `managing-design-briefs` for your active profile.
> Loxihart: electric violet `#7C3AED` primary, void surface background, Space Grotesk headings.
> FlashFusion: neon-glass purple primary, dark-mode surface. Never hardcode generic blue/red/gray.

| Role | Light mode | Dark mode | Token |
|---|---|---|---|
| Background | `[bg-surface]` | `[bg-surface-dark]` | `bg-surface` |
| Border | `[border-default]` | `[border-default-dark]` | `border-default` |
| Border (focus) | `[brand-primary]` | `[brand-primary-dark]` | `border-focus` |
| Border (error) | `[semantic-error]` | `[semantic-error-dark]` | `border-error` |
| Text | `[text-primary]` | `[text-primary-dark]` | `text-primary` |

#### Motion / Animation

| Property | Value | Easing |
|---|---|---|
| Border color transition | 150ms | ease-out |
| Error message reveal | 200ms | ease-out |
| Focus ring | 100ms | ease-out |

#### Accessibility Requirements

```
Role: [ARIA role if custom component]
Label: [aria-label or aria-labelledby approach]
State attributes: [aria-expanded, aria-selected, aria-invalid, etc.]
Focus management: [where focus goes on open/close/complete]
Keyboard: [Tab, Enter, Space, Arrow, Escape behavior]
Screen reader: [what gets announced on state change]
```

#### Edge Cases

| Scenario | Expected Behavior |
|---|---|
| Long label text | Truncate with ellipsis, full text in tooltip |
| Empty state | Show placeholder copy, not empty space |
| Loading (>500ms) | Show skeleton, not blank |
| Network error | Show error state, retry CTA |
| Min/max content | Defined min-height, max-height with scroll |

---

## Interaction Spec Template

Use for flows with multiple steps or complex state transitions.

---

### [Flow Name] Interaction Spec

**Flow type:** [Onboarding / Form / Navigation / Data entry]  
**Entry point:** [Where flow begins]  
**Exit points:** [Completion, cancel, error states]

#### Flow Diagram

```
[Entry] 
  ↓
[Step 1: User fills form]
  ↓ (valid)  ↓ (invalid)
[Step 2]   [Show errors, stay on step 1]
  ↓
[Confirmation] → [Success state]
              → [Error state] → [Retry]
```

#### State Transitions

| From | Event | To | Side Effects |
|---|---|---|---|
| Empty | User types | Filling | Start validation timer |
| Filling | Blur | Validating | Run validation |
| Validating | Valid | Filled | Clear error, show success |
| Validating | Invalid | Error | Show error message |
| Error | User types | Filling | Start live validation |

#### Timing

| Interaction | Delay | Duration | Notes |
|---|---|---|---|
| Validation on blur | 0ms | Instant | No delay |
| Error message reveal | 0ms | 200ms fade-in | — |
| Success feedback | 0ms | 300ms fade-in | — |
| Toast auto-dismiss | 5000ms | 200ms fade-out | After 5s |
| Skeleton to content | 0ms | 150ms cross-fade | — |

---

## Responsive Behavior Spec

Use when component layout changes across breakpoints.

---

### [Component] Responsive Spec

| Breakpoint | Width Range | Layout | Changes |
|---|---|---|---|
| Mobile | 320–767px | Stack vertical | Full-width, single column |
| Tablet | 768–1023px | 2-column grid | Side-by-side |
| Desktop | 1024–1439px | 3-column grid | Standard layout |
| Wide | 1440px+ | 4-column grid | Max-width container |

**Max content width:** 1280px (centered with auto margins)  
**Gutter:** 16px (mobile), 24px (tablet), 32px (desktop)  
**Column gap:** 16px (mobile), 24px (desktop)

#### Image Srcsets

```html
<img
  src="image-800.webp"
  srcset="image-400.webp 400w, image-800.webp 800w, image-1200.webp 1200w"
  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
  alt="Description"
  width="800"
  height="450"
  loading="lazy"
>
```

---

## Accessibility Annotation Template

Attach these annotations to Figma files for engineering context.

---

### [Screen / Component] Accessibility Annotations

#### Focus Order

```
[1] Skip to main content link (visually hidden)
[2] Logo / home link
[3] Primary navigation items (left to right)
[4] Search input
[5] User menu button
[6] Main content (starts here after skip link)
```

#### ARIA Landmarks

```html
<header role="banner">           <!-- Page header -->
<nav aria-label="Main nav">      <!-- Primary navigation -->
<main>                           <!-- Main content -->
<aside aria-label="Filters">     <!-- Sidebar -->
<footer role="contentinfo">      <!-- Page footer -->
```

#### Custom Component Annotations

| Component | Role | Name Source | State | Notes |
|---|---|---|---|---|
| Dropdown trigger | `button` | Visible label | `aria-expanded` | Controls panel ID |
| Dropdown panel | `listbox` | — | — | `aria-labelledby` trigger |
| Search combobox | `combobox` | `<label>` | `aria-expanded` | `aria-controls` listbox |
| Notification | `status` | — | — | `aria-live="polite"` |
| Alert | `alert` | — | — | `aria-live="assertive"` |
| Loading region | `region` | — | `aria-busy` | `aria-label="Loading"` |

#### Screen Reader Behavior

```
On modal open:
- Focus moves to first focusable element (or modal heading)
- Background content: aria-hidden="true"
- Announce: modal title

On modal close:
- Focus returns to trigger element
- Background content: aria-hidden removed

On form error:
- Focus: first error field (on submit)
- Error message: aria-live="polite" OR aria-describedby on field
- Announce: error message text

On async content load:
- aria-live="polite" region announces load complete
- Example: "Search results updated. 23 results found."
```

---

## Handoff Checklist

### Before Design Handoff
- [ ] All states documented (default, hover, focus, active, disabled, loading, error, success)
- [ ] Spacing and typography in design tokens (not raw values)
- [ ] Dark mode variants (if applicable)
- [ ] Responsive breakpoints specified
- [ ] Animation durations and easings specified
- [ ] ARIA roles, labels, and states annotated
- [ ] Focus order annotated
- [ ] Edge cases covered (long text, empty state, loading, error)
- [ ] Figma auto-layout used (not fixed positioning)
- [ ] Real content in mockups (not Lorem ipsum)

### Engineering Acceptance Criteria
- [ ] Component renders correctly at all breakpoints
- [ ] All states visually correct
- [ ] Keyboard navigation works (Tab, Enter, Escape, Arrows as specified)
- [ ] Focus indicators visible (3px outline, ≥3:1 contrast)
- [ ] Screen reader announces correct name, role, state
- [ ] Motion respects prefers-reduced-motion
- [ ] Dark mode renders correctly
- [ ] Component passes axe-core automated check (0 violations)
- [ ] Interactive elements meet 24×24px minimum (WCAG 2.5.8 AA); 44×44px comfort target for mobile
- [ ] Tested on: Chrome, Firefox, Safari (desktop) + iOS Safari, Chrome Android
