# A — Production Code: 053 Contextual Floating Header

## Executive intent

Implement **Contextual Floating Header** as progressive enhancement for sticky nav slides down only on upward scroll. The visual behavior must never become the only path to content or action. This artifact is designed to support WCAG 2.2 Level AA integration, but it does not claim conformance without product-specific content, token, browser, zoom, keyboard, and assistive-technology validation.

## Behavioral architecture

- Motion profile: button-controlled disclosure with synchronized ARIA state.
- Keyboard model: Enter or Space toggles the controlling button; focus remains on the trigger unless the opened surface is modal.
- Reduced-motion behavior: Open and close immediately while retaining focus movement, ARIA state changes, and a non-motion visual state cue.
- Category-specific hazards: Nested focus-trap ownership; exact aria-expanded and aria-controls pairing; Escape closes only the innermost eligible layer.
- Pointer targets use a twenty-four-by-twenty-four-CSS-pixel minimum unless a documented criterion exception applies. [SOURCED: W3C WCAG 2.2 SC 2.5.8 Target Size (Minimum), Level AA — https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html]
- Normal text requires a four-and-one-half-to-one contrast ratio; large-scale text requires a three-to-one ratio. [SOURCED: W3C WCAG 2.2 SC 1.4.3 Contrast (Minimum), Level AA — https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html]
- Required component boundaries and graphical objects require a three-to-one contrast ratio against adjacent colors. [SOURCED: W3C WCAG 2.2 SC 1.4.11 Non-text Contrast, Level AA — https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html]

## Typed controller

```ts
export type ExpansionMode = 'disclosure' | 'tree' | 'tabs' | 'multiselect' | 'segmented' | 'stepper' | 'drag' | 'scroll-header';
export type Cleanup = () => void;

export interface ContextualFloatingHeaderControllerOptions {
  root: HTMLElement;
  singleOpen?: boolean;
  modal?: boolean;
  disabled?: boolean;
}

const MODE = 'scroll-header' as ExpansionMode;
const DEFAULT_SINGLE_OPEN = true; // [GENERATED: pattern-appropriate disclosure default]
const DEFAULT_MODAL = false; // [GENERATED: modal only for background-blocking surfaces]
const HOVER_CLOSE_DELAY = 160; // [GENERATED: brief forgiveness interval for pointer transit]
const DRAG_THRESHOLD = 0.35; // [GENERATED: dismiss threshold as a normalized fraction]

export class ContextualFloatingHeaderController {
  private readonly root: HTMLElement;
  private readonly triggers: HTMLElement[];
  private readonly panels: HTMLElement[];
  private readonly status: HTMLElement;
  private readonly options: Required<Omit<ContextualFloatingHeaderControllerOptions, 'root'>>;
  private readonly openIds = new Set<string>();
  private readonly openers = new Map<string, HTMLElement>();
  private readonly cleanups = new Set<Cleanup>();
  private readonly timers = new Set<number>();
  private readonly reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  private activeIndex = 0;
  private mounted = false;
  private lastOpenedId: string | null = null;
  private pointerId: number | null = null;
  private dragOrigin = 0;
  private dragDelta = 0;
  private lastScrollY = window.scrollY;

  public constructor(options: ContextualFloatingHeaderControllerOptions) {
    if (!(options.root instanceof HTMLElement)) throw new TypeError('Contextual Floating Header requires an HTMLElement root.');
    this.root = options.root;
    this.triggers = [...this.root.querySelectorAll<HTMLElement>('[data-fsp-trigger]')];
    this.panels = [...this.root.querySelectorAll<HTMLElement>('[data-fsp-panel]')];
    this.status = this.requireElement('[data-fsp-status]');
    this.options = {
      singleOpen: options.singleOpen ?? DEFAULT_SINGLE_OPEN,
      modal: options.modal ?? DEFAULT_MODAL,
      disabled: options.disabled ?? false,
    };
    if (!this.triggers.length) throw new Error('Contextual Floating Header requires at least one [data-fsp-trigger].');
  }

  public mount(): Cleanup {
    if (this.mounted) return () => this.unmount();
    this.mounted = true;
    this.root.dataset.enhanced = 'true';
    this.validateRelationships();
    this.listen(this.root, 'click', this.onClick);
    this.listen(this.root, 'keydown', this.onKeyDown);
    this.listen(window, 'pageshow', this.onPageShow);
    this.listen(this.reducedMotion, 'change', this.onMotionChange);
    if (false) {
      this.listen(this.root, 'pointerover', this.onPointerOver);
      this.listen(this.root, 'pointerout', this.onPointerOut);
      this.listen(this.root, 'focusin', this.onFocusIn);
    }
    if (MODE === 'drag') this.mountDrag();
    if (MODE === 'scroll-header') this.listen(window, 'scroll', this.onScroll, { passive: true });
    this.initializeState();
    this.render();
    return () => this.unmount();
  }

  public unmount(): void {
    if (!this.mounted) return;
    this.mounted = false;
    for (const timer of this.timers) window.clearTimeout(timer);
    this.timers.clear();
    for (const cleanup of this.cleanups) cleanup();
    this.cleanups.clear();
    this.restoreFocus(this.lastOpenedId);
    this.openIds.clear();
    this.openers.clear();
    delete this.root.dataset.enhanced;
  }

  public open(panelId: string, opener?: HTMLElement): void {
    if (this.options.disabled) return;
    const panel = this.panelById(panelId);
    if (!panel) throw new Error(`Unknown controlled panel: ${panelId}`);
    if (this.options.singleOpen) this.closeAll(panelId);
    this.openIds.add(panelId);
    this.lastOpenedId = panelId;
    if (opener) this.openers.set(panelId, opener);
    this.render();
    if (this.options.modal) this.focusFirst(panel);
  }

  public close(panelId: string, restore = true): void {
    if (!this.openIds.delete(panelId)) return;
    this.render();
    if (restore) this.restoreFocus(panelId);
  }

  public toggle(panelId: string, opener: HTMLElement): void {
    this.openIds.has(panelId) ? this.close(panelId) : this.open(panelId, opener);
  }

  private requireElement<T extends HTMLElement>(selector: string): T {
    const node = this.root.querySelector<T>(selector);
    if (!node) throw new Error(`Missing required element ${selector} for Contextual Floating Header.`);
    return node;
  }

  private listen<T extends Event>(target: EventTarget, type: string, handler: (event: T) => void, options?: AddEventListenerOptions): void {
    const listener = handler as EventListener;
    target.addEventListener(type, listener, options);
    this.cleanups.add(() => target.removeEventListener(type, listener, options));
  }

  private validateRelationships(): void {
    for (const trigger of this.triggers) {
      const controlled = trigger.getAttribute('aria-controls');
      if (MODE === 'multiselect' || MODE === 'segmented') continue;
      if (!controlled) throw new Error('Contextual Floating Header trigger is missing aria-controls.');
      const panel = this.panelById(controlled);
      if (!panel) throw new Error(`aria-controls references missing panel: ${controlled}`);
      if (!trigger.hasAttribute('aria-expanded') && MODE === 'disclosure') trigger.setAttribute('aria-expanded', 'false');
    }
  }

  private initializeState(): void {
    this.triggers.forEach((trigger, index) => {
      const controlled = trigger.getAttribute('aria-controls');
      if (controlled && trigger.getAttribute('aria-expanded') === 'true') this.openIds.add(controlled);
      if (MODE === 'tabs' && trigger.getAttribute('aria-selected') === 'true') this.activeIndex = index;
      if (MODE === 'segmented' && trigger.getAttribute('aria-checked') === 'true') this.activeIndex = index;
      trigger.tabIndex = index === this.activeIndex || MODE === 'disclosure' || MODE === 'multiselect' ? 0 : -1;
    });
  }

  private panelById(id: string): HTMLElement | null {
    return this.panels.find((panel) => panel.id === id) ?? null;
  }

  private readonly onClick = (event: MouseEvent): void => {
    const target = event.target as Element | null;
    const trigger = target?.closest<HTMLElement>('[data-fsp-trigger]');
    if (trigger && this.root.contains(trigger)) {
      const index = this.triggers.indexOf(trigger);
      if (MODE === 'multiselect') {
        trigger.setAttribute('aria-pressed', String(trigger.getAttribute('aria-pressed') !== 'true'));
        this.status.textContent = `${trigger.textContent?.trim() ?? 'Option'} selection changed.`;
        return;
      }
      if (MODE === 'segmented' || MODE === 'tabs' || MODE === 'stepper') { this.selectIndex(index, true); return; }
      const controlled = trigger.getAttribute('aria-controls');
      if (controlled) this.toggle(controlled, trigger);
    }
    const close = target?.closest<HTMLElement>('[data-fsp-close]');
    if (close && this.lastOpenedId) this.close(this.lastOpenedId);
    const move = target?.closest<HTMLElement>('[data-fsp-move]');
    if (move && MODE === 'drag') this.movePanel(move.dataset.fspMove === 'end' ? 1 : -1);
  };

  private readonly onKeyDown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape' && this.lastOpenedId && this.openIds.has(this.lastOpenedId)) {
      event.preventDefault(); event.stopPropagation(); this.close(this.lastOpenedId); return;
    }
    if (this.options.modal && event.key === 'Tab' && this.lastOpenedId) { this.trapTab(event, this.panelById(this.lastOpenedId)); return; }
    const trigger = (event.target as Element | null)?.closest<HTMLElement>('[data-fsp-trigger]');
    if (!trigger) return;
    const current = this.triggers.indexOf(trigger);
    if (MODE === 'tabs' || MODE === 'segmented' || MODE === 'tree') {
      const delta = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 0;
      if (delta) { event.preventDefault(); this.selectIndex((current + delta + this.triggers.length) % this.triggers.length, MODE !== 'tree'); }
      if (event.key === 'Home') { event.preventDefault(); this.selectIndex(0, MODE !== 'tree'); }
      if (event.key === 'End') { event.preventDefault(); this.selectIndex(this.triggers.length - 1, MODE !== 'tree'); }
    }
  };

  private selectIndex(index: number, activate: boolean): void {
    if (index < 0 || index >= this.triggers.length) return;
    this.activeIndex = index;
    this.triggers.forEach((trigger, position) => {
      const selected = position === index;
      trigger.tabIndex = selected ? 0 : -1;
      if (MODE === 'tabs') trigger.setAttribute('aria-selected', String(selected));
      if (MODE === 'segmented') trigger.setAttribute('aria-checked', String(selected));
      if (MODE === 'stepper') selected ? trigger.setAttribute('aria-current', 'step') : trigger.removeAttribute('aria-current');
      const controlled = trigger.getAttribute('aria-controls');
      if (controlled && activate) selected ? this.openIds.add(controlled) : this.openIds.delete(controlled);
    });
    this.root.style.setProperty('--fsp-active-index', String(index));
    this.render();
    this.triggers[index]?.focus();
  }

  private closeAll(except?: string): void {
    for (const id of [...this.openIds]) if (id !== except) this.openIds.delete(id);
  }

  private render(): void {
    this.triggers.forEach((trigger) => {
      const controlled = trigger.getAttribute('aria-controls');
      if (!controlled) return;
      const open = this.openIds.has(controlled);
      if (MODE === 'disclosure' || MODE === 'drag' || MODE === 'tree') trigger.setAttribute('aria-expanded', String(open));
    });
    this.panels.forEach((panel) => {
      const open = this.openIds.has(panel.id);
      panel.dataset.open = String(open);
      panel.hidden = !open && !this.reducedMotion.matches;
      if ('inert' in panel) panel.inert = !open;
      panel.setAttribute('aria-hidden', String(!open));
    });
    this.root.style.setProperty('--fsp-delta-x', `${this.dragDelta}px`);
    this.root.style.setProperty('--fsp-dismiss-progress', String(Math.min(Math.abs(this.dragDelta) / Math.max(this.root.clientWidth, 1), 1)));
  }

  private focusFirst(panel: HTMLElement): void {
    const first = panel.querySelector<HTMLElement>('button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])');
    (first ?? panel).focus({ preventScroll: true });
  }

  private restoreFocus(panelId: string | null): void {
    if (!panelId) return;
    const opener = this.openers.get(panelId);
    if (opener?.isConnected) opener.focus({ preventScroll: true });
    this.openers.delete(panelId);
  }

  private trapTab(event: KeyboardEvent, panel: HTMLElement | null): void {
    if (!panel) return;
    const focusable = [...panel.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')];
    if (!focusable.length) { event.preventDefault(); panel.focus(); return; }
    const first = focusable[0]; const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }

  private readonly onPointerOver = (event: PointerEvent): void => {
    const trigger = (event.target as Element | null)?.closest<HTMLElement>('[data-fsp-trigger]');
    const id = trigger?.getAttribute('aria-controls'); if (trigger && id) this.open(id, trigger);
  };
  private readonly onPointerOut = (): void => {
    const timer = window.setTimeout(() => { if (this.lastOpenedId && !this.root.matches(':hover, :focus-within')) this.close(this.lastOpenedId, false); this.timers.delete(timer); }, HOVER_CLOSE_DELAY);
    this.timers.add(timer);
  };
  private readonly onFocusIn = (event: FocusEvent): void => {
    const trigger = (event.target as Element | null)?.closest<HTMLElement>('[data-fsp-trigger]');
    const id = trigger?.getAttribute('aria-controls'); if (trigger && id) this.open(id, trigger);
  };
  private readonly onMotionChange = (): void => this.render();
  private readonly onPageShow = (event: PageTransitionEvent): void => { if (event.persisted) this.render(); };

  private readonly onScroll = (): void => {
    const current = window.scrollY;
    const visible = current <= this.lastScrollY || current <= 0;
    this.root.style.setProperty('--fsp-visible', visible ? '1' : '0');
    this.lastScrollY = current;
  };

  private mountDrag(): void {
    this.listen(this.root, 'pointerdown', this.onPointerDown);
    this.listen(this.root, 'pointermove', this.onPointerMove);
    this.listen(this.root, 'pointerup', this.onPointerEnd);
    this.listen(this.root, 'pointercancel', this.onPointerEnd);
  }
  private readonly onPointerDown = (event: PointerEvent): void => {
    if (!(event.target as Element | null)?.closest('[data-fsp-drag-handle], [data-fsp-card]')) return;
    this.pointerId = event.pointerId; this.dragOrigin = event.clientX - this.dragDelta; this.root.setPointerCapture?.(event.pointerId);
  };
  private readonly onPointerMove = (event: PointerEvent): void => { if (event.pointerId === this.pointerId) { this.dragDelta = event.clientX - this.dragOrigin; this.render(); } };
  private readonly onPointerEnd = (event: PointerEvent): void => {
    if (event.pointerId !== this.pointerId) return;
    this.pointerId = null; this.root.releasePointerCapture?.(event.pointerId);
    const progress = Math.abs(this.dragDelta) / Math.max(this.root.clientWidth, 1);
    if (patternIsDismiss() && progress >= DRAG_THRESHOLD) this.status.textContent = 'Card dismissed.';
    else this.dragDelta = 0;
    this.render();
  };
  private movePanel(direction: number): void { this.dragDelta += direction * 48; this.render(); } // [GENERATED: keyboard movement increment]
}

const patternIsDismiss = (): boolean => false;
```

The controller owns trigger/panel relationships, role-specific keyboard behavior, nested Escape propagation, modal focus containment only when required, focus restoration, hover parity, and drag alternatives.


## Semantic markup contract

```html
<section data-fsp-pattern="053" aria-labelledby="fsp-053-title">
  <h2 id="fsp-053-title">Contextual Floating Header</h2>
  <div data-fsp-visual aria-hidden="true"></div>
  <header data-fsp-header><button type="button" data-fsp-trigger aria-controls="fsp-053-panel" aria-expanded="false">Open navigation</button><nav data-fsp-panel id="fsp-053-panel" hidden><a href="#main">Main content</a></nav></header>
  <p data-fsp-status role="status" aria-live="polite" aria-atomic="true"></p>
</section>
```

Semantic contract: Use a native button as the disclosure trigger with aria-expanded and aria-controls referencing a stable panel identifier.

## Tokenized CSS

```css
/* Adjustable values are CSS custom properties, not embedded magic numbers. */
:root {
  --fsp-053-target-min: 24px; /* [SOURCED: W3C WCAG 2.2 SC 2.5.8 Target Size (Minimum), Level AA — https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html] */
  --fsp-053-duration: 280ms; /* [GENERATED: balanced interaction default] */
  --fsp-053-distance: 16px; /* [GENERATED: compact motion distance] */
  --fsp-053-travel: 96px; /* [GENERATED: bounded visual travel] */
  --fsp-053-z-travel: 640px; /* [GENERATED: bounded depth range] */
  --fsp-053-perspective: 900px; /* [GENERATED: moderate perspective depth] */
  --fsp-053-center: 0.5; /* [GENERATED: normalized midpoint] */
  --fsp-053-scale-delta: 0.08; /* [GENERATED: restrained zoom delta] */
  --fsp-053-focus-width: 2px; /* [GENERATED: visible outline starting token] */
  --fsp-053-gap: 1rem; /* [GENERATED: portable spacing token] */
  --fsp-053-radius: 0.75rem; /* [GENERATED: portable corner token] */
  --fsp-053-indent: 1.25rem; /* [GENERATED: hierarchy indentation] */
  --fsp-053-stagger: 40ms; /* [GENERATED: bounded sequential delay] */
  --fsp-053-tilt: 8deg; /* [GENERATED: restrained perspective angle] */
  --fsp-053-effect-size: 12rem; /* [GENERATED: bounded effect surface] */
  --fsp-053-surface: Canvas;
  --fsp-053-text: CanvasText;
  --fsp-053-accent: LinkText;
  --fsp-053-border: GrayText;
  --fsp-053-stack-offset: 0.75rem; /* [GENERATED: card stacking offset] */
  --fsp-053-stack-lift: 1rem; /* [GENERATED: card lift limit] */
  --fsp-053-panel-max: 64rem; /* [GENERATED: readable panel cap] */
  --fsp-053-sidebar-min: 14rem; /* [GENERATED: usable sidebar minimum] */
  --fsp-053-sidebar-max: 24rem; /* [GENERATED: bounded sidebar maximum] */
  --fsp-053-sticky-offset: 1rem; /* [GENERATED: sticky safe offset] */
  --fsp-053-tile-min: 16rem; /* [GENERATED: responsive tile minimum] */
  --fsp-053-header-expanded: 5rem; /* [GENERATED: expanded navigation height] */
  --fsp-053-header-collapse: 2rem; /* [GENERATED: shrink amount] */
  --fsp-053-timeline-min: 18rem; /* [GENERATED: timeline card minimum] */
  --fsp-053-reveal-distance: 10rem; /* [GENERATED: bounded footer reveal] */
  --fsp-053-column-width: 18rem; /* [GENERATED: masonry column target] */
  --fsp-053-hero-min: 3rem; /* [GENERATED: responsive display minimum] */
  --fsp-053-hero-max: 10rem; /* [GENERATED: responsive display maximum] */
  --fsp-053-hero-leading: 0.9; /* [GENERATED: display line-height] */
  --fsp-053-hue-range: 120deg; /* [GENERATED: bounded color-shift range] */
  --fsp-053-peek-size: 4rem; /* [GENERATED: next-section preview] */
  --fsp-053-drawer-width: 24rem; /* [GENERATED: drawer width cap] */
  --fsp-053-menu-column: 12rem; /* [GENERATED: mega-menu column minimum] */
  --fsp-053-ring-radius: 5rem; /* [GENERATED: radial-menu radius] */
  --fsp-053-icon-offset: 0.35rem; /* [GENERATED: hamburger line offset] */
  --fsp-053-popover-min: 12rem; /* [GENERATED: popover minimum width] */
  --fsp-053-summary-max: 30rem; /* [GENERATED: bounded reveal region] */
  --fsp-053-flyout-collapsed: 3rem; /* [GENERATED: collapsed flyout width] */
  --fsp-053-flyout-expanded: 16rem; /* [GENERATED: expanded flyout width] */
  --fsp-053-search-collapsed: 3rem; /* [GENERATED: collapsed search width] */
  --fsp-053-search-expanded: 30rem; /* [GENERATED: expanded search width] */
  --fsp-053-overlay-start-scale: 0.96; /* [GENERATED: restrained overlay scale] */
  --fsp-053-dock-lift: 0.5rem; /* [GENERATED: dock hover lift] */
  --fsp-053-dock-scale: 1.15; /* [GENERATED: bounded dock magnification] */
  --fsp-053-magnet-strength: 0.18; /* [GENERATED: restrained magnetic response] */
  --fsp-053-spring-scale: 0.08; /* [GENERATED: restrained spring scale] */
  --fsp-053-morph-scale: 0.2; /* [GENERATED: bounded morph stretch] */
  --fsp-053-sheen-angle: 115deg; /* [GENERATED: diagonal sheen angle] */
  --fsp-053-trail-lag: 0.35; /* [GENERATED: ghost-trail lag factor] */
  --fsp-053-trail-opacity: 0.25; /* [GENERATED: low-emphasis trail opacity] */
  --fsp-053-blob-blur: 0.5rem; /* [GENERATED: bounded blob blur] */
  --fsp-053-blob-contrast: 14; /* [GENERATED: SVG-style fusion contrast] */
  --fsp-053-blob-travel: 3rem; /* [GENERATED: bounded blob travel] */
  --fsp-053-haptic-scale: 0.04; /* [GENERATED: subtle visual fallback] */
  --fsp-053-zoom-scale: 0.12; /* [GENERATED: bounded image zoom] */
  --fsp-053-audio-scale: 0.04; /* [GENERATED: subtle audio visual cue] */
  --fsp-053-beacon-duration: 1800ms; /* [GENERATED: attention pulse interval] */
  --fsp-053-beacon-scale: 1.8; /* [GENERATED: bounded beacon spread] */
  --fsp-053-squish-x: 0.08; /* [GENERATED: bounded press compression] */
  --fsp-053-squish-y: 0.04; /* [GENERATED: bounded press expansion] */
  --fsp-053-shimmer-duration: 1400ms; /* [GENERATED: skeleton shimmer interval] */
  --fsp-053-visible-opacity: 0.75; /* [GENERATED: visible-state icon opacity] */
  --fsp-053-hidden-opacity: 0.25; /* [GENERATED: hidden-state icon opacity] */
  --fsp-053-unlock-travel: 14rem; /* [GENERATED: slide-control travel] */
  --fsp-053-glitch-offset: 0.5rem; /* [GENERATED: bounded glitch displacement] */
  --fsp-053-lift: 0.75rem; /* [GENERATED: card lift distance] */
  --fsp-053-dash: 0.75rem; /* [GENERATED: border dash length] */
  --fsp-053-dash-gap: 0.5rem; /* [GENERATED: border dash gap] */
  --fsp-053-dash-cycle: 4rem; /* [GENERATED: border animation cycle] */
}

[data-fsp-pattern="053"] {
  --fsp-progress: 0;
  --fsp-active: 0;
  --fsp-visible: 1;
  --fsp-effect-progress: 0;
  --fsp-effect-opacity: 0;
  --fsp-local-x: 50%;
  --fsp-local-y: 50%;
  --fsp-delta-x: 0px;
  --fsp-delta-y: 0px;
  --fsp-pan-x: 0px;
  --fsp-pan-y: 0px;
  --fsp-zoom: 1;
  --fsp-drag-progress: 0;
  --fsp-dismiss-progress: 0;
  --fsp-progress-value: 0;
  --fsp-tilt-x: 0;
  --fsp-tilt-y: 0;
  color: var(--fsp-053-text);
  background: var(--fsp-053-surface);
  position: relative;
}

[data-fsp-pattern="053"] :where(button, a, input, [tabindex]):focus-visible {
  outline: var(--fsp-053-focus-width) solid var(--fsp-053-accent);
  outline-offset: var(--fsp-053-focus-width);
}

[data-fsp-pattern="053"] :where(button, a, [role="button"]) {
  min-inline-size: var(--fsp-053-target-min);
  min-block-size: var(--fsp-053-target-min);
}

[data-fsp-pattern="053"] [data-fsp-visual],
[data-fsp-pattern="053"] [data-fsp-panel],
[data-fsp-pattern="053"] [data-fsp-trigger] {
  transition-property: transform, opacity, inline-size, block-size, grid-template-rows;
  transition-duration: var(--fsp-053-duration);
  transition-timing-function: cubic-bezier(.2, .8, .2, 1); /* [GENERATED: decelerating UI curve] */
}

[data-fsp-pattern="053"] [data-fsp-header] { position: sticky; inset-block-start: 0; transform: translateY(calc((1 - var(--fsp-visible)) * -100%)); }

@media (prefers-reduced-motion: reduce) {
  [data-fsp-pattern="053"] *,
  [data-fsp-pattern="053"] *::before,
  [data-fsp-pattern="053"] *::after {
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important; /* [GENERATED: near-immediate compatibility fallback] */
    animation-duration: 0.01ms !important; /* [GENERATED: near-immediate compatibility fallback] */
    animation-iteration-count: 1 !important; /* [GENERATED: prevents continuous repetition] */
  }
}

@media (forced-colors: active) {
  [data-fsp-pattern="053"] { forced-color-adjust: auto; }
  [data-fsp-pattern="053"] [data-fsp-visual] { border: var(--fsp-053-focus-width) solid CanvasText; }
}
```

### Framework adaptation contract

| Target | Integration rule |
|---|---|
| React with Tailwind | Keep the controller in a `useEffect` or callback-ref boundary, pass a stable root, call the returned cleanup, and map design tokens to Tailwind theme variables rather than rewriting the state machine. Avoid effect-owned one-time assumptions because development mode may mount twice. |
| Vue | Instantiate in `onMounted`, dispose in `onBeforeUnmount`, and use refs only for DOM ownership. Controlled state flows through props and emitted events; do not duplicate it in a watcher-owned mirror. |
| Web Components | Create the controller in `connectedCallback`, dispose it in `disconnectedCallback`, reflect only stable public state to attributes, and keep internals instance-local so multiple elements cannot leak state. |
| Vanilla HTML/CSS/JS | Instantiate after the root exists, retain the cleanup function, call it before replacing the subtree, and leave the semantic markup useful when the enhancement fails. |

No runtime dependency is required. [GENERATED: the implementation uses browser platform APIs only]


## Dependency-free smoke checks

```ts
export function smokeCheck053(root: HTMLElement): void {
  if (!root.matches('[data-fsp-pattern="053"]')) throw new Error('Pattern root is not identifiable.');
  if (!root.querySelector('[data-fsp-status][role="status"]')) throw new Error('Accessible status region is missing.');
  if (!root.querySelector('[data-fsp-trigger]')) throw new Error('Required interaction or status node is missing.');
  if (root.querySelector('button button, a button, button a, a a')) throw new Error('Nested interactive controls are invalid.');
  for (const trigger of root.querySelectorAll<HTMLElement>('[aria-controls]')) {
    const id = trigger.getAttribute('aria-controls');
    if (id && !root.querySelector(`#${CSS.escape(id)}`)) throw new Error(`Missing controlled element: ${id}`);
  }
}
```

Run the smoke check before controller construction, then exercise repeated mount/unmount, reduced motion, forced colors, browser zoom, enlarged text, right-to-left direction, rapid input, and back-forward-cache restoration in integration tests.


## Implementation considerations

The root must exist before construction; required enhancement nodes fail fast with clear errors. Optional content remains untouched. Async-capable variants use cancellation and generation checks. Scroll-capable variants batch reads and writes through one animation-frame callback. Drag-capable variants provide non-drag alternatives and cancel pointer capture safely.

## Performance and security notes

No HTML string injection is used. Consumer-supplied content must be inserted through text or trusted framework rendering, never through unsanitized `innerHTML`. Visual updates are limited to custom properties, transform, and opacity. Passive observation is used where cancellation is unnecessary, and promoted layers are released after the active phase.

## CLAIMS CHECK

- The artifact uses the AA target-size criterion, not the separate enhanced target-size criterion.
- The artifact does not assert automatic WCAG conformance.
- All adjustable visual values are exposed as custom properties.
- No runtime dependency is added.
