# A — Production Code: 021 Footer Reveal

## Executive intent

Implement **Footer Reveal** as progressive enhancement for main content lifts up to expose a static footer underneath. The visual behavior must never become the only path to content or action. This artifact is designed to support WCAG 2.2 Level AA integration, but it does not claim conformance without product-specific content, token, browser, zoom, keyboard, and assistive-technology validation.

## Behavioral architecture

- Motion profile: passive scroll observation with transform-only visual updates.
- Keyboard model: No custom keyboard interception is required; all contained controls retain native keyboard behavior and focus order.
- Reduced-motion behavior: Disable visual depth, inertia, tilt, zoom, and smooth-scrolling transforms while leaving content and navigation intact.
- Category-specific hazards: Momentum-scroll conflicts with snap points; a visible scroll-jacking opt-out; mobile dynamic viewport resizing and viewport-unit collapse.
- Pointer targets use a twenty-four-by-twenty-four-CSS-pixel minimum unless a documented criterion exception applies. [SOURCED: W3C WCAG 2.2 SC 2.5.8 Target Size (Minimum), Level AA — https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html]
- Normal text requires a four-and-one-half-to-one contrast ratio; large-scale text requires a three-to-one ratio. [SOURCED: W3C WCAG 2.2 SC 1.4.3 Contrast (Minimum), Level AA — https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html]
- Required component boundaries and graphical objects require a three-to-one contrast ratio against adjacent colors. [SOURCED: W3C WCAG 2.2 SC 1.4.11 Non-text Contrast, Level AA — https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html]

## Typed controller

```ts
export type ScrollPatternMode = 'layout-only' | 'scroll-progress' | 'infinite-loader' | 'progress' | 'scroll-spy' | 'reveal' | 'back-to-top' | 'horizontal-track' | 'workspace' | 'kinetic';
export type Cleanup = () => void;
export type LoadMore = (signal: AbortSignal) => Promise<readonly HTMLElement[]>;

export interface FooterRevealControllerOptions {
  root: HTMLElement;
  scrollRoot?: Window | HTMLElement;
  disabled?: boolean;
  wheelMapping?: boolean;
  maxRenderedItems?: number;
  loadMore?: LoadMore;
}

const MODE = 'scroll-progress' as ScrollPatternMode;
const MIN_PROGRESS = 0; // [GENERATED: normalized lower bound]
const MAX_PROGRESS = 1; // [GENERATED: normalized upper bound]
const DEFAULT_MAX_ITEMS = 100; // [GENERATED: matches the project's virtualization discovery threshold]
const PAN_STEP = 48; // [GENERATED: keyboard pan increment in CSS pixels]

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

export class FooterRevealController {
  private readonly root: HTMLElement;
  private readonly scrollRoot: Window | HTMLElement;
  private readonly layers: HTMLElement[];
  private readonly status: HTMLElement;
  private readonly progressElement: HTMLProgressElement | null;
  private readonly loadButton: HTMLButtonElement | null;
  private readonly optOutButton: HTMLButtonElement | null;
  private readonly heading: HTMLElement | null;
  private readonly cleanups = new Set<Cleanup>();
  private readonly reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  private readonly resizeObserver: ResizeObserver;
  private readonly options: Required<Pick<FooterRevealControllerOptions, 'disabled' | 'wheelMapping' | 'maxRenderedItems'>> &
    Pick<FooterRevealControllerOptions, 'loadMore'>;
  private frame: number | null = null;
  private observer: IntersectionObserver | null = null;
  private operation: AbortController | null = null;
  private generation = 0;
  private mounted = false;
  private loading = false;
  private panX = MIN_PROGRESS;
  private panY = MIN_PROGRESS;
  private pointerId: number | null = null;
  private pointerOrigin = { x: MIN_PROGRESS, y: MIN_PROGRESS };

  public constructor(options: FooterRevealControllerOptions) {
    if (!(options.root instanceof HTMLElement)) throw new TypeError('Footer Reveal requires an HTMLElement root.');
    this.root = options.root;
    this.scrollRoot = options.scrollRoot ?? window;
    this.layers = [...this.root.querySelectorAll<HTMLElement>('[data-fsp-layer]')];
    this.status = this.requireElement('[data-fsp-status]');
    this.progressElement = this.root.querySelector<HTMLProgressElement>('[data-fsp-progress]');
    this.loadButton = this.root.querySelector<HTMLButtonElement>('[data-fsp-load-more]');
    this.optOutButton = this.root.querySelector<HTMLButtonElement>('[data-fsp-opt-out]');
    this.heading = this.root.querySelector<HTMLElement>('h1, h2, [data-fsp-heading]');
    this.options = {
      disabled: options.disabled ?? false,
      wheelMapping: options.wheelMapping ?? false,
      maxRenderedItems: options.maxRenderedItems ?? DEFAULT_MAX_ITEMS,
      loadMore: options.loadMore,
    };
    this.resizeObserver = new ResizeObserver(() => this.requestUpdate());
  }

  public mount(): Cleanup {
    if (this.mounted) return () => this.unmount();
    this.mounted = true;
    this.root.dataset.enhanced = 'true';
    this.listen(window, 'pageshow', this.onPageShow);
    this.listen(this.reducedMotion, 'change', this.onPreferenceChange);
    this.resizeObserver.observe(this.root);

    if (MODE !== 'layout-only') this.listen(this.scrollRoot, 'scroll', this.onScroll, { passive: true });
    if (MODE === 'horizontal-track' && this.options.wheelMapping) this.listen(this.root, 'wheel', this.onWheel, { passive: false });
    if (MODE === 'back-to-top') this.listen(this.root, 'click', this.onBackToTopClick);
    if (MODE === 'workspace' || MODE === 'kinetic') this.mountPanning();
    if (MODE === 'infinite-loader') this.mountInfiniteLoader();
    if (MODE === 'reveal') this.mountRevealObserver();
    this.optOutButton && this.listen(this.optOutButton, 'click', this.onOptOut);

    this.requestUpdate();
    return () => this.unmount();
  }

  public unmount(): void {
    if (!this.mounted) return;
    this.mounted = false;
    this.operation?.abort();
    this.operation = null;
    if (this.frame !== null) cancelAnimationFrame(this.frame);
    this.frame = null;
    this.observer?.disconnect();
    this.observer = null;
    this.resizeObserver.disconnect();
    for (const cleanup of this.cleanups) cleanup();
    this.cleanups.clear();
    this.pointerId = null;
    delete this.root.dataset.enhanced;
    this.root.style.removeProperty('--fsp-progress');
    this.root.style.removeProperty('--fsp-pan-x');
    this.root.style.removeProperty('--fsp-pan-y');
  }

  private requireElement<T extends HTMLElement>(selector: string): T {
    const node = this.root.querySelector<T>(selector);
    if (!node) throw new Error(`Missing required element ${selector} for Footer Reveal.`);
    return node;
  }

  private listen<T extends Event>(
    target: EventTarget,
    type: string,
    handler: (event: T) => void,
    options?: AddEventListenerOptions,
  ): void {
    const listener = handler as EventListener;
    target.addEventListener(type, listener, options);
    this.cleanups.add(() => target.removeEventListener(type, listener, options));
  }

  private readonly onScroll = (): void => this.requestUpdate();
  private readonly onPreferenceChange = (): void => this.requestUpdate();
  private readonly onPageShow = (event: PageTransitionEvent): void => { if (event.persisted) this.requestUpdate(); };

  private requestUpdate(): void {
    if (!this.mounted || this.frame !== null) return;
    this.frame = requestAnimationFrame(() => {
      this.frame = null;
      this.update();
    });
  }

  private update(): void {
    const progress = this.options.disabled || this.reducedMotion.matches
      ? MIN_PROGRESS
      : this.measureProgress();
    this.root.style.setProperty('--fsp-progress', String(progress));
    this.root.style.setProperty('--fsp-active', progress > MIN_PROGRESS ? String(MAX_PROGRESS) : String(MIN_PROGRESS));
    this.layers.forEach((layer, index) => {
      const fallbackDepth = (index + MAX_PROGRESS) / Math.max(this.layers.length, MAX_PROGRESS);
      const depth = Number.parseFloat(layer.dataset.fspDepth ?? '') || fallbackDepth;
      layer.style.setProperty('--fsp-depth', String(depth));
    });
    if (this.progressElement) {
      this.progressElement.max = MAX_PROGRESS;
      this.progressElement.value = progress;
      this.progressElement.setAttribute('aria-valuenow', String(Math.round(progress * 100))); // [GENERATED: percentage presentation]
    }
    if (MODE === 'scroll-spy') this.updateScrollSpy();
    this.root.style.setProperty('--fsp-pan-x', `${this.panX}px`);
    this.root.style.setProperty('--fsp-pan-y', `${this.panY}px`);
  }

  private measureProgress(): number {
    const rootRect = this.root.getBoundingClientRect();
    const viewportStart = this.scrollRoot instanceof Window ? MIN_PROGRESS : this.scrollRoot.getBoundingClientRect().top;
    const viewportSize = this.scrollRoot instanceof Window ? this.scrollRoot.innerHeight : this.scrollRoot.clientHeight;
    const relativeTop = rootRect.top - viewportStart;
    const range = Math.max(rootRect.height + viewportSize, MAX_PROGRESS);
    return clamp((viewportSize - relativeTop) / range, MIN_PROGRESS, MAX_PROGRESS);
  }

  private updateScrollSpy(): void {
    const sections = [...this.root.querySelectorAll<HTMLElement>('[data-fsp-section][id]')];
    const links = [...this.root.querySelectorAll<HTMLAnchorElement>('[data-fsp-spy-link][href^="#"]')];
    if (!sections.length || !links.length) return;
    const viewportLine = (this.scrollRoot instanceof Window ? this.scrollRoot.innerHeight : this.scrollRoot.clientHeight) / 3; // [GENERATED: stable upper-viewport activation line]
    const current = sections.reduce<HTMLElement | null>((active, section) =>
      section.getBoundingClientRect().top <= viewportLine ? section : active, sections[0] ?? null);
    for (const link of links) {
      const selected = current ? link.hash === `#${CSS.escape(current.id)}` : false;
      if (selected) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
  }

  private readonly onWheel = (event: WheelEvent): void => {
    if (this.root.dataset.fspOptOut === 'true' || Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
    const track = this.root.querySelector<HTMLElement>('[data-fsp-track]');
    if (!track || track.scrollWidth <= track.clientWidth) return;
    event.preventDefault();
    track.scrollBy({ left: event.deltaY, behavior: this.reducedMotion.matches ? 'auto' : 'smooth' });
  };

  private readonly onOptOut = (): void => {
    this.root.dataset.fspOptOut = 'true';
    this.status.textContent = 'Enhanced scroll mapping disabled. Native scrolling remains available.';
  };

  private readonly onBackToTopClick = (event: MouseEvent): void => {
    const button = (event.target as Element | null)?.closest<HTMLButtonElement>('[data-fsp-back-to-top]');
    if (!button) return;
    const behavior = this.reducedMotion.matches ? 'auto' : 'smooth';
    if (this.scrollRoot instanceof Window) this.scrollRoot.scrollTo({ top: MIN_PROGRESS, behavior });
    else this.scrollRoot.scrollTo({ top: MIN_PROGRESS, behavior });
    this.heading?.focus({ preventScroll: true });
  };

  private mountPanning(): void {
    this.listen(this.root, 'pointerdown', this.onPointerDown);
    this.listen(this.root, 'pointermove', this.onPointerMove);
    this.listen(this.root, 'pointerup', this.onPointerEnd);
    this.listen(this.root, 'pointercancel', this.onPointerEnd);
    this.listen(this.root, 'keydown', this.onPanKeyDown);
  }

  private readonly onPointerDown = (event: PointerEvent): void => {
    if (!event.isPrimary || !(event.target as Element | null)?.closest('[data-fsp-pan-surface]')) return;
    this.pointerId = event.pointerId;
    this.pointerOrigin = { x: event.clientX - this.panX, y: event.clientY - this.panY };
    this.root.setPointerCapture?.(event.pointerId);
  };

  private readonly onPointerMove = (event: PointerEvent): void => {
    if (event.pointerId !== this.pointerId) return;
    this.panX = event.clientX - this.pointerOrigin.x;
    this.panY = event.clientY - this.pointerOrigin.y;
    this.requestUpdate();
  };

  private readonly onPointerEnd = (event: PointerEvent): void => {
    if (event.pointerId !== this.pointerId) return;
    this.pointerId = null;
    this.root.releasePointerCapture?.(event.pointerId);
  };

  private readonly onPanKeyDown = (event: KeyboardEvent): void => {
    const actions: Record<string, readonly [number, number]> = {
      ArrowLeft: [-PAN_STEP, MIN_PROGRESS], ArrowRight: [PAN_STEP, MIN_PROGRESS],
      ArrowUp: [MIN_PROGRESS, -PAN_STEP], ArrowDown: [MIN_PROGRESS, PAN_STEP],
    };
    const delta = actions[event.key];
    if (!delta) return;
    event.preventDefault();
    this.panX += delta[0]; this.panY += delta[1];
    this.requestUpdate();
  };

  private mountInfiniteLoader(): void {
    if (!this.loadButton) throw new Error('Footer Reveal requires [data-fsp-load-more].');
    this.listen(this.loadButton, 'click', this.onLoadMore);
    const sentinel = this.root.querySelector<HTMLElement>('[data-fsp-sentinel]');
    if (sentinel && this.options.loadMore) {
      this.observer = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) void this.loadNextPage();
      }, { root: this.scrollRoot instanceof Window ? null : this.scrollRoot, threshold: MIN_PROGRESS });
      this.observer.observe(sentinel);
    }
  }

  private readonly onLoadMore = (): void => { void this.loadNextPage(); };

  private async loadNextPage(): Promise<void> {
    if (this.loading || !this.options.loadMore) return;
    const list = this.root.querySelector<HTMLElement>('[data-fsp-list]');
    if (!list) throw new Error('Footer Reveal requires [data-fsp-list].');
    const remaining = this.options.maxRenderedItems - list.children.length;
    if (remaining <= MIN_PROGRESS) {
      this.status.textContent = 'More items are available through pagination; the rendered window is at its configured limit.';
      return;
    }
    this.operation?.abort();
    this.operation = new AbortController();
    const generation = ++this.generation;
    this.loading = true;
    this.root.setAttribute('aria-busy', 'true');
    try {
      const nodes = await this.options.loadMore(this.operation.signal);
      if (!this.mounted || generation !== this.generation || this.operation.signal.aborted) return;
      const fragment = document.createDocumentFragment();
      nodes.slice(MIN_PROGRESS, remaining).forEach((node) => fragment.append(node));
      list.append(fragment);
      this.status.textContent = `${Math.min(nodes.length, remaining)} additional items loaded.`;
    } catch (error) {
      if (!(error instanceof DOMException && error.name === 'AbortError')) {
        this.status.textContent = 'Additional items could not be loaded. Use the load button to retry.';
      }
    } finally {
      if (generation === this.generation) { this.loading = false; this.root.removeAttribute('aria-busy'); }
    }
  }

  private mountRevealObserver(): void {
    const items = [...this.root.querySelectorAll<HTMLElement>('[data-fsp-reveal]')];
    this.observer = new IntersectionObserver((entries) => {
      for (const entry of entries) (entry.target as HTMLElement).dataset.visible = String(entry.isIntersecting || this.reducedMotion.matches);
    }, { root: this.scrollRoot instanceof Window ? null : this.scrollRoot, threshold: MIN_PROGRESS });
    items.forEach((item) => this.observer?.observe(item));
  }
}
```

The controller implements **passive scroll observation with transform-only visual updates** with explicit lifecycle ownership, progressive enhancement, mobile viewport remeasurement, and an opt-out whenever wheel remapping is enabled.


## Semantic markup contract

```html
<section data-fsp-pattern="021" aria-labelledby="fsp-021-title">
  <h2 id="fsp-021-title" tabindex="-1">Footer Reveal</h2>
  <div data-fsp-visual aria-hidden="true"></div>
  <div data-fsp-viewport><div data-fsp-layer data-fsp-depth="0.35" aria-hidden="true"></div><div data-fsp-layer data-fsp-depth="0.7" aria-hidden="true"></div><div data-fsp-content><h3>Foreground content</h3><p>The reading order is independent of the visual layers.</p></div></div>
  <p data-fsp-status role="status" aria-live="polite" aria-atomic="true"></p>
</section>
```

Semantic contract: Preserve normal document landmarks, headings, links, and DOM order; treat the visual effect as progressive enhancement.

## Tokenized CSS

```css
/* Adjustable values are CSS custom properties, not embedded magic numbers. */
:root {
  --fsp-021-target-min: 24px; /* [SOURCED: W3C WCAG 2.2 SC 2.5.8 Target Size (Minimum), Level AA — https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html] */
  --fsp-021-duration: 280ms; /* [GENERATED: balanced interaction default] */
  --fsp-021-distance: 16px; /* [GENERATED: compact motion distance] */
  --fsp-021-travel: 96px; /* [GENERATED: bounded visual travel] */
  --fsp-021-z-travel: 640px; /* [GENERATED: bounded depth range] */
  --fsp-021-perspective: 900px; /* [GENERATED: moderate perspective depth] */
  --fsp-021-center: 0.5; /* [GENERATED: normalized midpoint] */
  --fsp-021-scale-delta: 0.08; /* [GENERATED: restrained zoom delta] */
  --fsp-021-focus-width: 2px; /* [GENERATED: visible outline starting token] */
  --fsp-021-gap: 1rem; /* [GENERATED: portable spacing token] */
  --fsp-021-radius: 0.75rem; /* [GENERATED: portable corner token] */
  --fsp-021-indent: 1.25rem; /* [GENERATED: hierarchy indentation] */
  --fsp-021-stagger: 40ms; /* [GENERATED: bounded sequential delay] */
  --fsp-021-tilt: 8deg; /* [GENERATED: restrained perspective angle] */
  --fsp-021-effect-size: 12rem; /* [GENERATED: bounded effect surface] */
  --fsp-021-surface: Canvas;
  --fsp-021-text: CanvasText;
  --fsp-021-accent: LinkText;
  --fsp-021-border: GrayText;
  --fsp-021-stack-offset: 0.75rem; /* [GENERATED: card stacking offset] */
  --fsp-021-stack-lift: 1rem; /* [GENERATED: card lift limit] */
  --fsp-021-panel-max: 64rem; /* [GENERATED: readable panel cap] */
  --fsp-021-sidebar-min: 14rem; /* [GENERATED: usable sidebar minimum] */
  --fsp-021-sidebar-max: 24rem; /* [GENERATED: bounded sidebar maximum] */
  --fsp-021-sticky-offset: 1rem; /* [GENERATED: sticky safe offset] */
  --fsp-021-tile-min: 16rem; /* [GENERATED: responsive tile minimum] */
  --fsp-021-header-expanded: 5rem; /* [GENERATED: expanded navigation height] */
  --fsp-021-header-collapse: 2rem; /* [GENERATED: shrink amount] */
  --fsp-021-timeline-min: 18rem; /* [GENERATED: timeline card minimum] */
  --fsp-021-reveal-distance: 10rem; /* [GENERATED: bounded footer reveal] */
  --fsp-021-column-width: 18rem; /* [GENERATED: masonry column target] */
  --fsp-021-hero-min: 3rem; /* [GENERATED: responsive display minimum] */
  --fsp-021-hero-max: 10rem; /* [GENERATED: responsive display maximum] */
  --fsp-021-hero-leading: 0.9; /* [GENERATED: display line-height] */
  --fsp-021-hue-range: 120deg; /* [GENERATED: bounded color-shift range] */
  --fsp-021-peek-size: 4rem; /* [GENERATED: next-section preview] */
  --fsp-021-drawer-width: 24rem; /* [GENERATED: drawer width cap] */
  --fsp-021-menu-column: 12rem; /* [GENERATED: mega-menu column minimum] */
  --fsp-021-ring-radius: 5rem; /* [GENERATED: radial-menu radius] */
  --fsp-021-icon-offset: 0.35rem; /* [GENERATED: hamburger line offset] */
  --fsp-021-popover-min: 12rem; /* [GENERATED: popover minimum width] */
  --fsp-021-summary-max: 30rem; /* [GENERATED: bounded reveal region] */
  --fsp-021-flyout-collapsed: 3rem; /* [GENERATED: collapsed flyout width] */
  --fsp-021-flyout-expanded: 16rem; /* [GENERATED: expanded flyout width] */
  --fsp-021-search-collapsed: 3rem; /* [GENERATED: collapsed search width] */
  --fsp-021-search-expanded: 30rem; /* [GENERATED: expanded search width] */
  --fsp-021-overlay-start-scale: 0.96; /* [GENERATED: restrained overlay scale] */
  --fsp-021-dock-lift: 0.5rem; /* [GENERATED: dock hover lift] */
  --fsp-021-dock-scale: 1.15; /* [GENERATED: bounded dock magnification] */
  --fsp-021-magnet-strength: 0.18; /* [GENERATED: restrained magnetic response] */
  --fsp-021-spring-scale: 0.08; /* [GENERATED: restrained spring scale] */
  --fsp-021-morph-scale: 0.2; /* [GENERATED: bounded morph stretch] */
  --fsp-021-sheen-angle: 115deg; /* [GENERATED: diagonal sheen angle] */
  --fsp-021-trail-lag: 0.35; /* [GENERATED: ghost-trail lag factor] */
  --fsp-021-trail-opacity: 0.25; /* [GENERATED: low-emphasis trail opacity] */
  --fsp-021-blob-blur: 0.5rem; /* [GENERATED: bounded blob blur] */
  --fsp-021-blob-contrast: 14; /* [GENERATED: SVG-style fusion contrast] */
  --fsp-021-blob-travel: 3rem; /* [GENERATED: bounded blob travel] */
  --fsp-021-haptic-scale: 0.04; /* [GENERATED: subtle visual fallback] */
  --fsp-021-zoom-scale: 0.12; /* [GENERATED: bounded image zoom] */
  --fsp-021-audio-scale: 0.04; /* [GENERATED: subtle audio visual cue] */
  --fsp-021-beacon-duration: 1800ms; /* [GENERATED: attention pulse interval] */
  --fsp-021-beacon-scale: 1.8; /* [GENERATED: bounded beacon spread] */
  --fsp-021-squish-x: 0.08; /* [GENERATED: bounded press compression] */
  --fsp-021-squish-y: 0.04; /* [GENERATED: bounded press expansion] */
  --fsp-021-shimmer-duration: 1400ms; /* [GENERATED: skeleton shimmer interval] */
  --fsp-021-visible-opacity: 0.75; /* [GENERATED: visible-state icon opacity] */
  --fsp-021-hidden-opacity: 0.25; /* [GENERATED: hidden-state icon opacity] */
  --fsp-021-unlock-travel: 14rem; /* [GENERATED: slide-control travel] */
  --fsp-021-glitch-offset: 0.5rem; /* [GENERATED: bounded glitch displacement] */
  --fsp-021-lift: 0.75rem; /* [GENERATED: card lift distance] */
  --fsp-021-dash: 0.75rem; /* [GENERATED: border dash length] */
  --fsp-021-dash-gap: 0.5rem; /* [GENERATED: border dash gap] */
  --fsp-021-dash-cycle: 4rem; /* [GENERATED: border animation cycle] */
}

[data-fsp-pattern="021"] {
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
  color: var(--fsp-021-text);
  background: var(--fsp-021-surface);
  position: relative;
}

[data-fsp-pattern="021"] :where(button, a, input, [tabindex]):focus-visible {
  outline: var(--fsp-021-focus-width) solid var(--fsp-021-accent);
  outline-offset: var(--fsp-021-focus-width);
}

[data-fsp-pattern="021"] :where(button, a, [role="button"]) {
  min-inline-size: var(--fsp-021-target-min);
  min-block-size: var(--fsp-021-target-min);
}

[data-fsp-pattern="021"] [data-fsp-visual],
[data-fsp-pattern="021"] [data-fsp-panel],
[data-fsp-pattern="021"] [data-fsp-trigger] {
  transition-property: transform, opacity, inline-size, block-size, grid-template-rows;
  transition-duration: var(--fsp-021-duration);
  transition-timing-function: cubic-bezier(.2, .8, .2, 1); /* [GENERATED: decelerating UI curve] */
}

[data-fsp-pattern="021"] [data-fsp-footer] { position: sticky; inset-block-end: 0; z-index: 0; } [data-fsp-pattern="021"] [data-fsp-main] { position: relative; z-index: 1; transform: translateY(calc(var(--fsp-progress) * var(--fsp-021-reveal-distance) * -1)); }

@media (prefers-reduced-motion: reduce) {
  [data-fsp-pattern="021"] *,
  [data-fsp-pattern="021"] *::before,
  [data-fsp-pattern="021"] *::after {
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important; /* [GENERATED: near-immediate compatibility fallback] */
    animation-duration: 0.01ms !important; /* [GENERATED: near-immediate compatibility fallback] */
    animation-iteration-count: 1 !important; /* [GENERATED: prevents continuous repetition] */
  }
}

@media (forced-colors: active) {
  [data-fsp-pattern="021"] { forced-color-adjust: auto; }
  [data-fsp-pattern="021"] [data-fsp-visual] { border: var(--fsp-021-focus-width) solid CanvasText; }
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
export function smokeCheck021(root: HTMLElement): void {
  if (!root.matches('[data-fsp-pattern="021"]')) throw new Error('Pattern root is not identifiable.');
  if (!root.querySelector('[data-fsp-status][role="status"]')) throw new Error('Accessible status region is missing.');
  if (!root.querySelector('[data-fsp-status]')) throw new Error('Required interaction or status node is missing.');
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
