# Component Catalog

Advanced component implementations organized by category. Each entry includes the recommended approach and key implementation considerations.

---

## Data Display

### Virtualized Table
Handle 10,000+ rows without performance degradation.
- **Library:** `react-window` or `@tanstack/react-virtual`
- **Key patterns:** Fixed header, column resizing, row selection, sort indicators
- **Performance:** Only render visible rows (typically 20-50 of thousands)
- **Accessibility:** `role="grid"`, `aria-rowcount`, keyboard arrow navigation between cells

### Infinite Scroll Grid
Instagram/Pinterest-style content grid that loads more on scroll.
- **Library:** `react-intersection-observer` + `@tanstack/react-query`
- **Key patterns:** Intersection Observer for trigger, skeleton loading placeholders, scroll position restoration
- **Performance:** Load 20-50 items per batch, debounce scroll events

### Data Visualization (Charts)
D3 + React integration for interactive charts.
- **Library:** `recharts` (simple), `d3` + React (custom), `visx` (composable)
- **Key patterns:** Responsive container, tooltip on hover, legend toggle, animation on data change
- **Accessibility:** `aria-label` on chart, data table fallback for screen readers

---

## Interactive

### Drag and Drop
Reorderable lists, kanban boards, file drop zones.
- **Library:** `@dnd-kit/core` (modern, accessible) or `react-beautiful-dnd` (legacy)
- **Key patterns:** Drag handle, drop indicators, keyboard reordering (Space to grab, Arrow to move, Space to drop)
- **Accessibility:** `aria-grabbed`, `aria-dropeffect`, live region announcing position changes

### Command Palette (Cmd+K)
Spotlight-style search and action interface.
- **Key patterns:** Global keyboard shortcut listener, fuzzy search (fuse.js), categorized results, keyboard navigation
- **Accessibility:** `role="combobox"`, `aria-autocomplete="list"`, `aria-activedescendant` for highlighted item
- **Performance:** Debounce search input (150ms), virtualize long result lists

### File Upload
Drag-drop zone with progress tracking and preview.
- **Key patterns:** Drag-over visual indicator, file type validation, upload progress bar, image thumbnail preview, multi-file support
- **Accessibility:** Visible drop zone label, keyboard-accessible file input, progress announced via `aria-valuenow`

### Rich Text Editor
WYSIWYG editing with formatting toolbar.
- **Library:** `tiptap` (modern, extensible) or `slate` (low-level control)
- **Key patterns:** Toolbar with formatting buttons, keyboard shortcuts (Ctrl+B bold), paste handling, collaborative editing support
- **Accessibility:** Toolbar as `role="toolbar"`, formatting announced to screen readers

### Modal / Dialog
Accessible overlay with focus management.
- **Key patterns:** Focus trap (Tab cycles within modal), close on Escape, close on backdrop click, return focus to trigger on close, scroll lock on body
- **Accessibility:** `role="dialog"`, `aria-modal="true"`, `aria-labelledby` pointing to heading

### Tooltip / Popover
Contextual information on hover or focus.
- **Key patterns:** Delay before show (300ms), position calculation (flip if near edge), arrow pointing to trigger
- **Accessibility:** Tooltip content linked via `aria-describedby`, keyboard-triggered on focus, dismiss on Escape

---

## Forms

### Autocomplete / Combobox
Search input with filtered suggestions.
- **Key patterns:** Debounced API calls (200ms), keyboard navigation (Up/Down arrows), highlight matching text, clear button, loading indicator
- **Accessibility:** `role="combobox"`, `aria-autocomplete="list"`, `aria-activedescendant`, `aria-expanded`

### Multi-Select
Tag-based selection with search and checkboxes.
- **Key patterns:** Tags showing selected items, remove tag on click or Backspace, search filter, select all/none, max selection limit
- **Accessibility:** Each tag as `role="option"` with `aria-selected`, live region announcing selection count changes

### Date Picker
Calendar-based date selection with range support.
- **Library:** `react-day-picker` or `@internationalized/date`
- **Key patterns:** Month/year navigation, range selection (start/end), preset ranges ("Last 7 days"), disabled dates, locale-aware formatting
- **Accessibility:** Calendar grid as `role="grid"`, arrow key navigation between days, `aria-label` with full date

### Color Picker
Visual color selection with format inputs.
- **Key patterns:** Hue/saturation canvas, hex/RGB/HSL text inputs, preset swatches, eyedropper tool (if supported), opacity slider
- **Accessibility:** Slider inputs with `aria-valuetext` ("Hue: 200 degrees"), live preview region

---

## Layout

### Split Panes
Resizable panels with drag divider.
- **Key patterns:** Drag handle between panels, min/max constraints, collapse to zero, persist sizes in localStorage, vertical/horizontal orientation
- **Accessibility:** Divider as `role="separator"` with `aria-valuenow` (panel size percentage), keyboard resize with Arrow keys

### Masonry Grid
Pinterest-style variable-height layout.
- **Library:** CSS `columns` (simple) or `react-masonry-css` (controlled)
- **Key patterns:** Column-based layout, responsive column count, lazy load images, smooth transitions on resize
- **Performance:** Use CSS columns for simple cases, JS calculation only when items need ordering control

### Carousel / Slider
Accessible horizontal scrolling content.
- **Key patterns:** Previous/next buttons, dot indicators, swipe support (touch events), auto-play with pause on hover, loop option
- **Accessibility:** `role="region"` with `aria-roledescription="carousel"`, `aria-label` per slide, pause button for auto-play (WCAG 2.2.2)

### Virtualized List
Efficiently render thousands of items.
- **Library:** `react-window` (simple) or `@tanstack/react-virtual` (flexible)
- **Key patterns:** Dynamic item heights, scroll-to-index, overscan (render extra items for smooth scrolling)
- **Performance:** Measure items lazily, cache measurements, use `will-change: transform` on scroll container
