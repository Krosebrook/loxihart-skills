# Mobile UX Patterns

## Layout Foundations

### Touch Target Sizing
```
Minimum (WCAG 2.5.8 AA): 24×24px
Comfort target: 44×44px (Apple HIG) / 48×48dp (Material Design)
Spacing between targets: 8px minimum

Common failures:
- Icon-only nav items without padding: add padding to reach 44px
- Inline text links: pad vertically or use full-width buttons
- Checkboxes: clickable area must extend beyond the 16px box
- Close buttons: absolute positioned, often shrink to 24px

CSS:
.touch-target {
  min-height: 44px;
  min-width: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

### Safe Area Insets
```css
/* Fixed bottom elements (nav, CTAs, sticky buttons) */
.bottom-nav {
  padding-bottom: max(16px, env(safe-area-inset-bottom));
}

/* Fixed top elements */
.header {
  padding-top: max(0px, env(safe-area-inset-top));
}

/* Full-screen content */
.fullscreen {
  padding: env(safe-area-inset-top) env(safe-area-inset-right) 
           env(safe-area-inset-bottom) env(safe-area-inset-left);
}
```

### Viewport Meta Tag
```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
```
- `viewport-fit=cover`: allows content under home indicator / notch
- Never use `maximum-scale=1` (prevents user zoom — WCAG fail)
- Never use `user-scalable=no` (accessibility violation)

---

## Navigation Patterns

### Bottom Navigation Bar
**Best for:** 3–5 primary destinations, consumer apps, tab-first patterns
```
Structure: full-width, fixed bottom
Item anatomy: icon (24px) + label (12px below)
Active: filled icon + colored label
Inactive: outline icon + muted label
Badge: counter (max "99+") or dot for unread

Rules:
- 3–5 items (no more)
- Always show labels (never icon-only on mobile)
- Don't hide on scroll (too much cognitive overhead)
- Safe area padding (see above)
```

### Hamburger Drawer
**Best for:** Secondary nav, settings, 5+ nav items
```
Trigger: 3-line icon (top-left), avoid top-right (conflict with iOS back)
Width: 280–320px (leaves content visible as context)
Backdrop: rgba(0,0,0,0.5), tap closes
Animation: 200–250ms ease-out slide from left
Focus trap: Tab cycles within drawer
Escape key: closes drawer

Avoid: using drawer for primary nav when bottom bar fits the items
```

### Back Navigation
```
iOS: swipe right from left edge (native, don't break it)
Custom: back button in top-left header (consistent position)
Android: system back button (hardware or gesture)

Rules:
- Don't change URL without updating browser history
- Don't break native back gesture with custom swipe handlers
- If flow has multiple steps, back goes to previous step (not home)
```

---

## Gestures

### Standard Mobile Gestures (Don't Override)
```
Pinch-to-zoom: never disable, respect for accessibility
Swipe down (from top edge): notification center
Swipe up (from bottom edge): app switcher / home
Swipe from left edge: system back (iOS)
Long press: context menu (native)
```

### App Gesture Patterns
```
Pull-to-refresh:
- Threshold: 60–80px down from top of scrollable content
- Show spinner with rubber-band effect
- aria-live: announce "Refreshed" on complete
- Haptic feedback on trigger threshold

Swipe-to-delete:
- Reveal destructive action on swipe left
- Red background, white text "Delete"
- Tap action or complete swipe to execute
- Undo pattern: toast with 5s undo option

Swipe-to-dismiss (modals, notifications):
- Swipe down dismisses bottom sheet
- Swipe right can dismiss cards / notifications
- Velocity threshold: dismiss if fast enough even if below threshold

Long-press:
- Context menu after 500ms
- Haptic feedback on trigger
- Show copy/share/delete options
```

---

## Content Patterns

### Cards on Mobile
```
Full-width on small screens (<768px): edge-to-edge or 16px margins
Horizontal scroll cards: peek next card (show 80% of card) to indicate scrollability
Card tap area: full card clickable (one invisible anchor)
Image ratio: lock to 16:9 or 3:2 (prevent layout shift)
```

### Lists
```
List item height: minimum 44px (48dp)
Separator: 1px line after every item, OR 8px gap between items (not both)
Leading element: icon (24px) or avatar (32–40px)
Trailing element: chevron (navigate) or action (button)
Destructive items: red text
Swipe actions: see gestures above
```

### Typography on Mobile
```
Body: 16px minimum (browsers default to 16px, don't go smaller)
Caption: 13–14px minimum
Headlines: 20–28px (don't go larger unless hero)
Line length: 45–75 chars (measure by setting max-width on paragraphs)
Line height: 1.5–1.6 for body, 1.2–1.3 for headings

iOS text size respect:
- Use rem units, not px, so system text size settings scale content
- Test: Settings > Accessibility > Display & Text Size > Larger Text
```

### Images
```
Always set width and height attributes (prevents CLS)
object-fit: cover for fixed-size containers
srcset for responsive images
loading="lazy" for below-fold images
Max file size targets: thumbnail <30KB, hero <150KB, product <100KB
WebP with JPEG fallback
```

---

## Forms on Mobile

### Input Fields
```
- Trigger correct keyboard with input type (see form-patterns.md)
- Label always visible (floating label or above input)
- Input height: 44–48px (accommodates finger + thumb tap)
- Font size: 16px minimum (prevents iOS auto-zoom)
  <input style="font-size: 16px"> — or set in CSS globally for inputs
- Error messages: below input, visible above keyboard
```

### Keyboard Avoidance
```
Problem: keyboard pushes up content, hides current field
Fix:
1. scrollIntoView on focus: field.scrollIntoView({ block: 'center' })
2. Set body/root height dynamically: window.visualViewport.height
3. Avoid fixed-position elements below form (they overlap keyboard)
4. Test with keyboard open and field at bottom of screen
```

### Multi-Step on Mobile
```
- One field or group per screen for complex flows (checkout, onboarding)
- Progress indicator visible above keyboard (top of screen)
- "Next" button: large, full-width, anchored above keyboard
- Auto-advance to next field when logical (zip code auto-advances to city)
- Return key labeled contextually ("Next", "Done", "Search")
```

---

## Performance (Mobile-Specific)

### Network Awareness
```javascript
// Detect connection and adapt
const connection = navigator.connection;
if (connection.effectiveType === '2g' || connection.saveData) {
  // Serve lower-quality images, defer non-critical JS
}
```

### Touch Responsiveness
```css
/* Remove 300ms tap delay (old mobile browsers) */
html { touch-action: manipulation; }

/* Avoid paint during touch scroll */
.scroll-container { 
  -webkit-overflow-scrolling: touch; 
  will-change: transform;
}

/* Disable tap highlight color (handle focus styles yourself) */
* { -webkit-tap-highlight-color: transparent; }
```

### Reduce Motion
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## iOS-Specific Patterns

### Bottom Sheet
```
Pattern: modal sheet slides up from bottom, partial coverage
Uses: action sheets, share sheets, filter panels
Structure: 
  - Handle bar (drag indicator, 4×32px, rounded)
  - Header row with title and close button
  - Scrollable content
  - Fixed actions at bottom above safe area

Snapping heights: 25%, 50%, 90% of screen height
Keyboard: sheet rises with keyboard
Accessibility: role="dialog", aria-modal="true", focus trap
```

### Action Sheet
```
Trigger: destructive/multi-option actions
Structure: title (optional) > actions > "Cancel" (always last, highlighted)
Destructive action: red text, positioned before Cancel
Don't use for: navigation (use bottom nav), >5 actions (use modal with list)
```

### Pull-Down Navigation (Context)
```
iOS: contextual menu on long press
Android: long-press context menu is less convention-driven
Cross-platform: be explicit — show three-dot menu button
```

---

## Anti-Patterns

| Anti-Pattern | Problem | Fix |
|---|---|---|
| Input font-size < 16px | iOS auto-zooms to 16px, breaks layout | Set font-size: 16px on inputs |
| Hover-only interactions | No hover on touch | Use tap/click + focus |
| Tiny tap targets (<24px) | WCAG 2.5.8 AA fail; fat finger misses | Min 24×24px (AA); target 44×44px for comfort |
| Horizontal scrolling (layout) | Disorienting, unexpected | Only for content carousels, tables |
| Fixed elements blocking content | Keyboard, content overlap | Respect keyboard height, safe area insets |
| Disable zoom (user-scalable=no) | Accessibility violation | Remove entirely |
| Custom pull-to-refresh breaking native | Conflicts with system gesture | Use standard APIs (window.location reload) |
| Requiring swipe as only action | Not discoverable, inaccessible | Pair swipe with visible button |
| Sticky headers too tall (>64px) | Eats too much screen | Collapse header on scroll if needed |
| Auto-playing video with sound | Jarring, battery drain | Default muted, user unmutes |
