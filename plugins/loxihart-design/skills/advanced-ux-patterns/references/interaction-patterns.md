# Interaction Patterns Library

## Navigation Patterns

### Global Navigation
**When:** Primary app navigation, always-visible top-level tasks
```
- Max 5–7 items (NN/g research; Miller's paper is about working memory chunks, not navigation — but the practical limit holds)
- Active state: distinct color + optionally underline/bold
- Sticky on scroll for SaaS/dashboards
- Mobile: collapse to bottom bar (5 items max) or hamburger drawer
- ARIA: nav[aria-label="Main navigation"] + aria-current="page" on active
```
**Anti-pattern:** Hamburger on desktop — hides primary navigation from discovery

### Breadcrumbs
**When:** 3+ hierarchy levels, file systems, e-commerce categories
```html
<nav aria-label="Breadcrumb">
  <ol>
    <li><a href="/">Home</a></li>
    <li><a href="/products">Products</a></li>
    <li><span aria-current="page">Running Shoes</span></li>
  </ol>
</nav>
```
**Pattern:** Separator via CSS `::before` not DOM text (cleaner screen reader output)

### Tabs
**When:** Switching between related content views; content is parallel, not sequential
```
- Only one tab active at a time
- Selected: aria-selected="true", tabindex="0"
- Others: aria-selected="false", tabindex="-1"
- Arrow keys navigate between tabs (roving tabindex)
- Tab key moves to panel content
- Role: tablist > tab > tabpanel
```
**Anti-pattern:** Tabs for sequential steps (use stepper). Tabs for unrelated content (use nav).

### Accordion
**When:** FAQs, settings groups, mobile nav, content with optional expansion
```
- aria-expanded="true|false" on trigger button
- aria-controls points to panel id
- Panel: role="region", aria-labelledby points to trigger
- Single-expand vs multi-expand: both valid, be consistent
```

### Pagination
**When:** Tables, search results, large ordered lists. ≥50 items typically.
```
- Current page: aria-current="page", aria-disabled="true"
- Previous/Next: descriptive aria-labels ("Go to page 3")
- Show total pages/items when possible
- Prefer "Load more" for social feeds (infinite scroll is inaccessible for keyboard)
```

---

## Input Patterns

### Autocomplete / Combobox
**When:** Search fields, city pickers, tag input, anything with >10 options
```
- role="combobox" on input
- aria-expanded="true" when list open
- aria-autocomplete="list"
- aria-controls points to listbox id
- Options: role="option", aria-selected
- Keyboard: Arrow keys navigate, Enter selects, Escape closes
- Filter as user types; highlight matched characters
```

### Multi-step Forms / Stepper
**When:** Complex flows (checkout, onboarding, registration). >4 fields or >1 concern.
```
- Show progress (Step 2 of 4 / progress bar)
- Validate each step before advancing
- Allow backwards navigation (don't clear later steps)
- aria-label="Step 1 of 4: Account information" on section
- Save partial state (don't lose data on back)
```

### Inline Validation
**When:** All forms. Validate after blur (not on every keystroke), confirm on submit.
```
Pattern:
1. User focuses field
2. User types
3. On blur: validate
4. Show error immediately below input (not tooltip)
5. On submit: re-validate all, focus first error
   
ARIA:
- aria-invalid="true" on error
- aria-describedby points to error message id
- Error message: role="alert" OR associated via aria-describedby
```

### Search
**When:** ≥50 content items, complex filtering needs, SaaS dashboards
```
- role="search" on landmark
- Placeholder: "Search products..." (descriptive)
- Submit: explicit button OR Enter key
- Results: aria-live="polite" with count ("23 results found")
- Empty state: constructive guidance, not just "No results"
- Clear button: visible, labeled ("Clear search")
```

### File Upload
**When:** Profile photos, attachments, bulk import
```
- Custom button over input[type=file] (label as trigger)
- Accepted types shown: ".jpg, .png, .pdf — max 10MB"
- Drag-drop zone: visual indicator, keyboard accessible
- Progress: progress[value][max] with aria-label
- Error: specific ("File too large", "Format not supported")
- Multiple files: list each with name/size/remove button
```

---

## Feedback Patterns

### Toast Notifications
**When:** Non-blocking confirmations (saved, sent, copied). Auto-dismiss ≥5s.
```
- Position: bottom-right (desktop), bottom-center (mobile)
- role="status" for success/info (polite)
- role="alert" for errors (assertive — use sparingly)
- Include action ("Undo") when relevant
- Don't stack >3; queue them
- Manual dismiss button always present
```
**Anti-pattern:** Using toasts for errors requiring user action (use inline errors or modal)

### Modal Dialogs
**When:** Destructive actions (confirm delete), critical decisions, focused tasks (edit form)
```
- Focus moves to dialog on open (first focusable or heading)
- Focus trapped inside dialog while open
- Escape key closes
- aria-modal="true", role="dialog"
- aria-labelledby points to dialog heading
- Background: inert attribute OR aria-hidden="true" on root
- Returns focus to trigger on close
```
**Anti-pattern:** Modals for complex workflows (use page/drawer). Nested modals.

### Skeleton Screens
**When:** Loading states for content >300ms
```
- Match shape/layout of real content (not generic spinners)
- aria-busy="true" on container
- aria-label="Loading..." on container
- Animate with pulse (subtle shimmer, not distracting flash)
- CSS: animation: pulse 1.5s ease-in-out infinite
```

### Empty States
**When:** No content, no search results, first-time use
```
Good empty state has:
1. Illustration (contextual, not generic)
2. Heading ("No projects yet")
3. Description (1–2 sentences of context)
4. Primary CTA ("Create your first project")
5. Secondary link if applicable
```

### Loading Indicators
```
< 100ms: No indicator needed
100ms–1s: Spinner (non-blocking)
1s–5s: Progress bar (determinate if possible)
> 5s: Progress bar + estimated time + cancel option
```

---

## Data Display Patterns

### Data Tables
**When:** Comparison, sorting, filtering structured data
```html
<table>
  <caption>Q3 Sales by Region</caption>
  <thead>
    <tr>
      <th scope="col" aria-sort="ascending">
        <button>Region <span aria-hidden="true">↑</span></button>
      </th>
    </tr>
  </thead>
  <tbody>...</tbody>
</table>
```
```
- Sortable: button in th, aria-sort="ascending|descending|none"
- Selectable rows: checkbox in first column
- Row actions: revealed on hover/focus OR always-visible icon buttons
- Sticky header: position: sticky; top: 0
- Responsive: horizontal scroll with overflow-x: auto on wrapper
- Pagination below table
```

### Cards
**When:** Content discovery, visual hierarchy, non-tabular data
```
- Clickable card: single <a> or <button> wraps card OR use aria-label on one link
  - Avoid: multiple nested links/buttons in a clickable card
  - Pattern: invisible absolutely-positioned link overlay
- Image: aspect-ratio: 16/9 or 3/2, object-fit: cover
- Card hover: subtle elevation or border change (not huge transform)
- Loading: skeleton with same dimensions
```

### Dashboards
**When:** At-a-glance KPIs, real-time monitoring, executive views
```
Layout priority (left→right, top→bottom):
1. Alert/critical items (red band if issues)
2. Primary KPI (big number, trend arrow)
3. Supporting charts (trend over time)
4. Detail tables (drill-down)

Time controls: always present, position: top-right of chart
Refresh: auto-refresh interval selector OR manual button
```

---

## Disclosure / Progressive Disclosure Patterns

### Tooltip
**When:** Additional context for abbreviated labels, icon-only buttons
```
- Triggered by focus AND hover
- role="tooltip", aria-describedby on trigger
- Never required to complete task (supplement, not replace labels)
- Delay: 300ms hover, 0ms focus
- Escape dismisses
- Not for interactive content (use popover)
```

### Popover
**When:** Rich content preview, date pickers, color pickers, overflow menus
```
- role="dialog" (if interactive) or role="tooltip" (if read-only)
- Focus management: if interactive, trap focus inside
- Escape closes, returns focus to trigger
- Click outside closes
- Positioning: floating-ui / Popper.js (handles viewport collisions)
```

### Collapsible / Show More
**When:** Long content sections, truncated descriptions, expandable rows
```
- Button with aria-expanded="true|false"
- aria-controls points to expandable section
- Text changes: "Show more" → "Show less"
- Never hide content needed to complete tasks
```

---

## State Management Patterns

### Optimistic UI
**When:** High-confidence mutations (like, follow, checkbox)
```
1. Update UI immediately
2. Fire async request
3. On success: no visual change
4. On error: revert UI + show toast error
```

### Undo Pattern
**When:** Destructive actions (delete, archive, bulk operations)
```
1. Execute action
2. Show "Undo" toast for 5–10s
3. If undo: reverse action
4. If timeout: permanently apply
5. If navigation: permanently apply
```

### Optimistic Pagination
**When:** Infinite scroll / "Load more"
```
- Pre-fetch next page when user is 2–3 items from end
- "Load more" button: keyboard accessible, announces count loaded
- URL updates with page param (bookmarkable state)
- Scroll position preserved on back navigation
```

---

## Anti-Patterns

| Pattern | Problem | Better Approach |
|---|---|---|
| Hover-only interactions | Inaccessible keyboard/mobile | Focus + hover triggers |
| Auto-advancing carousels | Accessibility, motion sickness | Pause button, manual controls |
| Disabling submit buttons | Users don't know why | Enable + show inline errors on submit |
| Confirmation dialogs for everything | Friction, click fatigue | Undo pattern for reversible actions |
| Infinite scroll with no footer | Can't reach footer content | "Load more" button or paginated |
| Tab order different from visual order | Confusing for keyboard users | DOM order = visual order |
| Focus returning to top on modal close | Disorienting | Return focus to trigger element |
| Tooltips on mobile | No hover on touch | Put content inline or in info icon + popover |
