# Navigation Pattern Library

## Global Navigation Patterns

### Top Navigation Bar
**Best for:** Marketing sites, SaaS dashboards, desktop-first apps
```
Structure:
[Logo] [Nav Items] [Search] [CTAs] [User Menu]

Rules:
- Max 5–7 primary items (NN/g research; Miller's paper is about working memory chunks, not navigation — but the practical limit holds)
- Current page: aria-current="page"
- Sticky: position: sticky; top: 0; z-index: 100
- Background: opaque (not transparent) when sticky
- Mobile: collapses at ≤768px

ARIA:
<nav aria-label="Main navigation">
  <ul role="list">
    <li><a href="/" aria-current="page">Home</a></li>
    <li><a href="/products">Products</a></li>
  </ul>
</nav>
```

### Left Sidebar Navigation
**Best for:** Complex SaaS apps, admin panels, dashboards with many sections
```
Structure:
[Logo]
[Primary Nav]
[---divider---]
[Secondary Nav]
[Settings]
[User Profile]

Rules:
- Collapsible to icon-only (tooltip on hover when collapsed)
- Active section: highlighted background, left border accent
- Nested items: expand/collapse with chevron
- Keyboard: focus on section to expand/collapse
- Mobile: drawer (slide in from left, overlay backdrop)

Width: 200–240px expanded, 56–64px collapsed
```

### Bottom Navigation (Mobile)
**Best for:** Mobile-first apps, consumer products, 3–5 primary destinations
```
Rules:
- 3–5 items maximum
- Icon + label (label always visible, not just on active)
- Active: filled icon, colored label
- Badge: unread count, dot for new content
- Position: fixed bottom, safe area inset padding

ARIA:
<nav aria-label="Primary navigation">
  <a href="/home" aria-current="page">
    <svg aria-hidden="true">...</svg>
    <span>Home</span>
  </a>
</nav>

CSS:
padding-bottom: max(16px, env(safe-area-inset-bottom));
```

### Mega Menu
**Best for:** E-commerce, large content sites with deep category trees
```
Rules:
- Trigger: hover on desktop (300ms delay), click on touch
- Max 3 columns
- Include featured image/promo in last column (optional)
- Close on: click outside, Escape, focus leaves menu
- Keyboard: arrow keys navigate within menu
- ARIA: aria-expanded on trigger, role="dialog" on panel

Don't use for: apps with <20 nav items (overkill)
```

---

## Wayfinding Patterns

### Breadcrumbs
**Best for:** E-commerce, file managers, documentation, multi-level content
```html
<nav aria-label="Breadcrumb">
  <ol>
    <li><a href="/">Home</a></li>
    <li><a href="/electronics">Electronics</a></li>
    <li><a href="/electronics/phones">Phones</a></li>
    <li aria-current="page">iPhone 16 Pro</li>
  </ol>
</nav>
```
```
CSS separator: 
li + li::before { content: "›"; padding: 0 8px; color: #666; }

Rules:
- Current page: not a link (last item)
- Max visible: 4–5 levels (truncate middle levels on mobile)
- Don't show on top-level pages
- Schema.org BreadcrumbList markup for SEO
```

### Progress Stepper
**Best for:** Checkout, onboarding, multi-step forms, wizards
```html
<nav aria-label="Checkout progress">
  <ol>
    <li class="completed"><span aria-hidden="true">✓</span> Cart</li>
    <li class="active" aria-current="step">Shipping</li>
    <li>Payment</li>
    <li>Review</li>
  </ol>
</nav>
```
```
States: completed (checkmark), active (highlighted), upcoming (muted)
Clickable steps: only if user can safely navigate back
Mobile: compress to "Step 2 of 4" text
```

### Tabs (Content Switching)
**Best for:** Switching parallel views without page reload
```html
<div role="tablist" aria-label="Account settings">
  <button role="tab" aria-selected="true" aria-controls="profile-panel" id="profile-tab">
    Profile
  </button>
  <button role="tab" aria-selected="false" aria-controls="security-panel" id="security-tab" tabindex="-1">
    Security
  </button>
</div>
<div role="tabpanel" id="profile-panel" aria-labelledby="profile-tab">
  <!-- content -->
</div>
```
```
Keyboard:
- Tab: moves focus into/out of tablist
- Arrow Left/Right: moves between tabs
- Home/End: first/last tab
- Enter/Space: activates tab

Visual:
- Active tab: distinct bottom border or background
- Tab overflow on mobile: horizontal scroll (no arrows needed)
```

### Pagination
**Best for:** Tables, search results, article listings — structured sequential content
```html
<nav aria-label="Search results pages">
  <a href="?page=2" aria-label="Previous page">←</a>
  <a href="?page=1">1</a>
  <a href="?page=2" aria-current="page">2</a>
  <a href="?page=3">3</a>
  <span aria-hidden="true">...</span>
  <a href="?page=12">12</a>
  <a href="?page=3" aria-label="Next page">→</a>
</nav>
```
```
Rules:
- Show page count ("Page 2 of 12" or "Showing 11–20 of 120")
- Max visible page buttons: 5–7
- Ellipsis for skipped pages
- Disable Prev/Next at boundaries (aria-disabled="true")
- URL-based pagination (?page=2) for bookmarkability
```

### "Load More" Button
**Best for:** Social feeds, activity logs, search results with no natural end
```html
<button onclick="loadMore()" aria-label="Load more articles (10 currently shown)">
  Load more
</button>
<div aria-live="polite" class="sr-only">
  <!-- "20 articles loaded" announced after load -->
</div>
```
```
Rules:
- Announce new count after loading (aria-live)
- Show loading state (spinner + "Loading...")
- Focus management: focus first new item after loading
- Keyboard accessible: Tab to button, Enter/Space activates
- Show total if known: "Load 10 more (32 remaining)"
```

---

## Contextual Navigation

### Sidebar Table of Contents
**Best for:** Long documentation, articles, legal documents
```
Rules:
- Fixed position (sticky alongside scrolling content)
- Active section highlighted based on scroll position
  (IntersectionObserver for current section)
- Links scroll smoothly to anchors
- Collapsible on mobile (Show/Hide TOC)
- Max depth: 2 levels (h2 + h3)
```

### In-Page Anchor Links
```html
<!-- Jump links at article top -->
<nav aria-label="Page contents">
  <ul>
    <li><a href="#overview">Overview</a></li>
    <li><a href="#installation">Installation</a></li>
    <li><a href="#configuration">Configuration</a></li>
  </ul>
</nav>

<!-- Section anchors -->
<h2 id="installation">Installation</h2>
```

### Related Content / "See Also"
```
Position: bottom of content, or sidebar
Pattern: card list with title + category + read time
Don't auto-play or auto-scroll (user triggers)
```

---

## Search Patterns

### Site Search
```html
<form role="search" action="/search">
  <label for="search" class="sr-only">Search</label>
  <input type="search" id="search" name="q" placeholder="Search docs...">
  <button type="submit" aria-label="Submit search">
    <svg aria-hidden="true"><!-- search icon --></svg>
  </button>
</form>
```
```
Placement: header right (desktop), full-width at top (mobile)
Auto-suggest: trigger after 2–3 chars, max 8 results
Clear button: appears when field has value
No results: show search term + suggestions + alternative CTAs
Results page: show count, filters, sorting
```

### Command Palette (⌘K)
**Best for:** Power users, developer tools, complex SaaS apps
```
Trigger: keyboard shortcut (⌘K / Ctrl+K), or "Quick actions" button
Dialog: centered modal, full-width search input at top
Results: grouped by category, keyboard-navigable
Actions: recently used at top, fuzzy matching
ARIA: role="dialog", aria-modal="true", aria-label="Command palette"
Escape: closes and returns focus to trigger
```

---

## Mobile Navigation

### Hamburger Drawer
**When:** 5+ nav items that can't fit in bottom bar
```
Trigger: ☰ button in header (top-left conventional, top-right iOS)
Animation: slide from left (225ms ease-out)
Backdrop: semi-transparent overlay, click closes
Escape: closes drawer, returns focus to hamburger button
Focus trap: Tab cycles within open drawer
ARIA: 
  <button aria-expanded="false" aria-controls="nav-drawer">Menu</button>
  <nav id="nav-drawer" aria-hidden="true">...</nav>
```

### Swipe Gestures
```
Back swipe: iOS convention (swipe right from left edge)
  — handled natively by iOS Safari for history navigation
Tab switching: horizontal swipe on tab content (not on tabbar itself)
Pull to refresh: show spinner at top, trigger refresh on release
Delete: swipe left to reveal delete action (with undo)

Don't rely on swipe as only affordance:
- Add visible buttons for discoverability
- Or provide clear affordance hint (arrow, "swipe to")
```

---

## Anti-Patterns

| Anti-Pattern | Problem | Fix |
|---|---|---|
| Dropdown on hover (desktop) | Touch devices, keyboard fail | Click/focus trigger with explicit close |
| Auto-playing carousels | Attention hijack, accessibility | Manual controls, pause button |
| Hamburger on desktop | Hides primary navigation | Keep nav visible on desktop |
| Orphan pages (no nav back) | User gets lost | Always have way back: breadcrumb, back button, global nav |
| Different nav on different pages | Disorienting | Consistent nav across all pages |
| Deeply nested nav (3+ levels) | Cognitive overload | Flatten IA, use landing pages for sub-sections |
| Infinite scroll with footer | Footer unreachable | Paginate or "Load more" to allow footer access |
| Active state unclear | User loses location | Always indicate current page/section |
| Missing skip link | Keyboard users tab through nav on every page | `<a href="#main">Skip to content</a>` as first body element |
