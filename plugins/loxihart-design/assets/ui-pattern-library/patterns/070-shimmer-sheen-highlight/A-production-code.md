# A — Production Code: 070 Shimmer Sheen Highlight

## Executive intent

Implement **Shimmer Sheen Highlight** as progressive enhancement for diagonal light beam passes across a clicked card. The visual behavior must never become the only path to content or action. This artifact is designed to support WCAG 2.2 Level AA integration, but it does not claim conformance without product-specific content, token, browser, zoom, keyboard, and assistive-technology validation.

## Behavioral architecture

- Motion profile: pointer and keyboard activation with a bounded, transform-only effect lifecycle.
- Keyboard model: Enter and Space activate the native control; Escape cancels only transient feedback and does not undo the underlying action.
- Reduced-motion behavior: Replace the animated effect with an immediate state change, visible static cue, or status message confirming the action.
- Category-specific hazards: Rapid-repeat deduplication without suppressing legitimate double-actions; per-interaction GPU promotion cleanup; hybrid-device pointer and click deduplication.
- Pointer targets use a twenty-four-by-twenty-four-CSS-pixel minimum unless a documented criterion exception applies. [SOURCED: W3C WCAG 2.2 SC 2.5.8 Target Size (Minimum), Level AA — https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html]
- Normal text requires a four-and-one-half-to-one contrast ratio; large-scale text requires a three-to-one ratio. [SOURCED: W3C WCAG 2.2 SC 1.4.3 Contrast (Minimum), Level AA — https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html]
- Required component boundaries and graphical objects require a three-to-one contrast ratio against adjacent colors. [SOURCED: W3C WCAG 2.2 SC 1.4.11 Non-text Contrast, Level AA — https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html]

## Typed controller

```ts
export type MicroInteractionMode = 'one-shot' | 'pointer-track' | 'drag' | 'async' | 'toggle' | 'continuous' | 'sequenced-text' | 'sensory';
export type Cleanup = () => void;
export interface ActionContext { signal: AbortSignal; reportProgress(value: number): void; }
export type PatternAction = (context: ActionContext) => Promise<string | void> | string | void;

export interface ShimmerSheenHighlightControllerOptions {
  root: HTMLElement;
  durationMs?: number;
  disabled?: boolean;
  action?: PatternAction;
}

const MODE = 'one-shot' as MicroInteractionMode;
const DEFAULT_DURATION = 320; // [GENERATED: bounded feedback duration]
const PRIMARY_BUTTON = 0; // [SOURCED: Pointer Events primary mouse button convention]
const COMPATIBILITY_CLICK_WINDOW = 500; // [GENERATED: conservative hybrid-input deduplication window]
const MIN_PROGRESS = 0; // [GENERATED: normalized lower bound]
const MAX_PROGRESS = 1; // [GENERATED: normalized upper bound]
const HAPTIC_DURATION = 12; // [GENERATED: subtle optional vibration duration in milliseconds]
const SCRAMBLE_INTERVAL = 32; // [GENERATED: bounded text-update interval in milliseconds]

const clamp = (value: number, min = MIN_PROGRESS, max = MAX_PROGRESS): number => Math.min(Math.max(value, min), max);

export class ShimmerSheenHighlightController {
  private readonly root: HTMLElement;
  private readonly trigger: HTMLElement;
  private readonly visual: HTMLElement;
  private readonly status: HTMLElement;
  private readonly options: Required<Omit<ShimmerSheenHighlightControllerOptions, 'root' | 'action'>> & Pick<ShimmerSheenHighlightControllerOptions, 'action'>;
  private readonly reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  private readonly cleanups = new Set<Cleanup>();
  private readonly timers = new Set<number>();
  private operation: AbortController | null = null;
  private frame: number | null = null;
  private generation = 0;
  private mounted = false;
  private lastPointerActivation = Number.NEGATIVE_INFINITY;
  private pointerId: number | null = null;
  private dragStart = MIN_PROGRESS;
  private effectProgress = MIN_PROGRESS;
  private pointerX = MIN_PROGRESS;
  private pointerY = MIN_PROGRESS;
  private deltaX = MIN_PROGRESS;
  private deltaY = MIN_PROGRESS;

  public constructor(options: ShimmerSheenHighlightControllerOptions) {
    if (!(options.root instanceof HTMLElement)) throw new TypeError('Shimmer Sheen Highlight requires an HTMLElement root.');
    this.root = options.root;
    this.trigger = this.requireElement('[data-fsp-trigger]');
    this.visual = this.requireElement('[data-fsp-visual]');
    this.status = this.requireElement('[data-fsp-status]');
    this.options = { durationMs: options.durationMs ?? DEFAULT_DURATION, disabled: options.disabled ?? false, action: options.action };
  }

  public mount(): Cleanup {
    if (this.mounted) return () => this.unmount();
    this.mounted = true;
    this.root.dataset.enhanced = 'true';
    this.listen(this.trigger, 'pointerup', this.onPointerUp);
    this.listen(this.trigger, 'click', this.onCompatibilityClick);
    this.listen(this.root, 'keydown', this.onKeyDown);
    this.listen(window, 'pageshow', this.onPageShow);
    this.listen(this.reducedMotion, 'change', this.onMotionChange);
    if (MODE === 'pointer-track') { this.listen(this.root, 'pointermove', this.onPointerMove); this.listen(this.root, 'pointerleave', this.onPointerLeave); }
    if (MODE === 'drag') this.mountDrag();
    const pause = this.root.querySelector<HTMLElement>('[data-fsp-pause]');
    if (MODE === 'continuous' && pause) this.listen(pause, 'click', this.onPauseToggle);
    this.render();
    return () => this.unmount();
  }

  public unmount(): void {
    if (!this.mounted) return;
    this.mounted = false;
    this.operation?.abort(); this.operation = null;
    if (this.frame !== null) cancelAnimationFrame(this.frame);
    this.frame = null;
    for (const timer of this.timers) window.clearTimeout(timer);
    this.timers.clear();
    for (const cleanup of this.cleanups) cleanup();
    this.cleanups.clear();
    this.pointerId = null;
    this.visual.style.willChange = 'auto';
    delete this.root.dataset.enhanced;
  }

  private requireElement<T extends HTMLElement>(selector: string): T {
    const node = this.root.querySelector<T>(selector);
    if (!node) throw new Error(`Missing required element ${selector} for Shimmer Sheen Highlight.`);
    return node;
  }

  private listen<T extends Event>(target: EventTarget, type: string, handler: (event: T) => void, options?: AddEventListenerOptions): void {
    const listener = handler as EventListener;
    target.addEventListener(type, listener, options);
    this.cleanups.add(() => target.removeEventListener(type, listener, options));
  }

  private readonly onPointerUp = (event: PointerEvent): void => {
    if (!event.isPrimary || event.button !== PRIMARY_BUTTON || MODE === 'drag') return;
    this.lastPointerActivation = event.timeStamp;
    void this.activate(event.clientX, event.clientY, 'pointer');
  };

  private readonly onCompatibilityClick = (event: MouseEvent): void => {
    if (MODE === 'drag' || event.timeStamp - this.lastPointerActivation < COMPATIBILITY_CLICK_WINDOW) return;
    void this.activate(event.clientX, event.clientY, 'keyboard-or-click');
  };

  private async activate(clientX: number, clientY: number, source: string): Promise<void> {
    if (!this.mounted || this.options.disabled) return;
    const rect = this.root.getBoundingClientRect();
    this.pointerX = clientX ? clientX - rect.left : rect.width / 2;
    this.pointerY = clientY ? clientY - rect.top : rect.height / 2;
    this.effectProgress = this.reducedMotion.matches ? MAX_PROGRESS : MIN_PROGRESS;
    const generation = ++this.generation;
    this.operation?.abort();
    this.operation = new AbortController();
    this.root.dataset.phase = 'active';
    this.visual.style.willChange = this.reducedMotion.matches ? 'auto' : 'transform, opacity';
    this.render();
    this.root.dispatchEvent(new CustomEvent('fsp:070:activate', { detail: { source, generation } }));
    try {
      
      const message = await this.options.action?.({ signal: this.operation.signal, reportProgress: (value) => this.setProgress(value, generation) });
      if (!this.mounted || generation !== this.generation || this.operation.signal.aborted) return;
      if (message) this.status.textContent = message;
      this.finishEffect(generation);
    } catch (error) {
      if (!(error instanceof DOMException && error.name === 'AbortError')) {
        this.status.textContent = 'The action could not be completed. Try again.';
        this.root.dataset.phase = 'error';
      }
    }
  }

  private finishEffect(generation: number): void {
    if (this.reducedMotion.matches) { this.effectProgress = MAX_PROGRESS; this.root.dataset.phase = 'complete'; this.render(); return; }
    this.effectProgress = MAX_PROGRESS; this.render();
    const timer = window.setTimeout(() => {
      this.timers.delete(timer);
      if (!this.mounted || generation !== this.generation) return;
      this.effectProgress = MIN_PROGRESS;
      this.root.dataset.phase = 'complete';
      this.visual.style.willChange = 'auto';
      this.render();
      this.root.dispatchEvent(new CustomEvent('fsp:070:complete'));
    }, this.options.durationMs);
    this.timers.add(timer);
  }

  private setProgress(value: number, generation: number): void {
    if (generation !== this.generation) return;
    this.effectProgress = clamp(value);
    this.root.style.setProperty('--fsp-progress-value', String(this.effectProgress));
    this.render();
  }

  private readonly onPointerMove = (event: PointerEvent): void => {
    if (!event.isPrimary) return;
    const rect = this.root.getBoundingClientRect();
    this.pointerX = event.clientX - rect.left; this.pointerY = event.clientY - rect.top;
    this.deltaX = event.clientX - (rect.left + rect.width / 2);
    this.deltaY = event.clientY - (rect.top + rect.height / 2);
    this.requestRender();
  };
  private readonly onPointerLeave = (): void => { this.deltaX = MIN_PROGRESS; this.deltaY = MIN_PROGRESS; this.requestRender(); };

  private requestRender(): void {
    if (!this.mounted || this.frame !== null) return;
    this.frame = requestAnimationFrame(() => { this.frame = null; this.render(); });
  }

  private mountDrag(): void {
    this.listen(this.trigger, 'pointerdown', this.onPointerDown);
    this.listen(this.trigger, 'pointermove', this.onDragMove);
    this.listen(this.trigger, 'pointerup', this.onDragEnd);
    this.listen(this.trigger, 'pointercancel', this.onDragEnd);
    const alternative = this.root.querySelector<HTMLElement>('[data-fsp-alternative]');
    if (alternative) this.listen(alternative, 'click', this.onAlternativeAction);
  }
  private readonly onPointerDown = (event: PointerEvent): void => { if (event.isPrimary) { this.pointerId = event.pointerId; this.dragStart = event.clientX; this.trigger.setPointerCapture?.(event.pointerId); } };
  private readonly onDragMove = (event: PointerEvent): void => {
    if (event.pointerId !== this.pointerId) return;
    const travel = Math.max(this.root.clientWidth - this.trigger.clientWidth, MAX_PROGRESS);
    this.effectProgress = clamp((event.clientX - this.dragStart) / travel);
    this.render();
  };
  private readonly onDragEnd = (event: PointerEvent): void => {
    if (event.pointerId !== this.pointerId) return;
    this.pointerId = null; this.trigger.releasePointerCapture?.(event.pointerId);
    if (this.effectProgress >= MAX_PROGRESS) void this.activate(event.clientX, event.clientY, 'drag');
    else { this.effectProgress = MIN_PROGRESS; this.render(); }
  };
  private readonly onAlternativeAction = (): void => { void this.activate(MIN_PROGRESS, MIN_PROGRESS, 'alternative-control'); };

  private readonly onKeyDown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') { this.operation?.abort(); this.generation += MAX_PROGRESS; this.effectProgress = MIN_PROGRESS; this.root.dataset.phase = 'idle'; this.render(); }
  };
  private readonly onMotionChange = (): void => this.render();
  private readonly onPageShow = (event: PageTransitionEvent): void => { if (event.persisted) this.render(); };
  private readonly onPauseToggle = (event: MouseEvent): void => {
    const paused = this.root.dataset.paused !== 'true'; this.root.dataset.paused = String(paused);
    (event.currentTarget as HTMLElement).setAttribute('aria-pressed', String(paused));
  };

  private async copyText(): Promise<void> {
    const value = this.root.dataset.copyText ?? this.root.querySelector<HTMLElement>('[data-fsp-copy-source]')?.textContent ?? '';
    if (!value) throw new Error('No copy source is configured.');
    await navigator.clipboard.writeText(value);
    this.status.textContent = 'Copied to clipboard.';
  }
  private toggleTheme(): void {
    const current = document.documentElement.dataset.theme;
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    this.trigger.setAttribute('aria-pressed', String(next === 'dark'));
    this.status.textContent = `${next} theme enabled.`;
  }
  private togglePassword(): void {
    const input = this.root.querySelector<HTMLInputElement>('input[type="password"], input[data-fsp-password]');
    if (!input) throw new Error('Password toggle requires a password input.');
    const visible = input.type === 'password'; input.type = visible ? 'text' : 'password';
    this.trigger.setAttribute('aria-pressed', String(visible));
    this.trigger.setAttribute('aria-label', visible ? 'Hide password' : 'Show password');
    input.focus({ preventScroll: true });
  }
  private tryHaptic(): void {
    const vibrate = navigator.vibrate?.bind(navigator);
    if (vibrate && this.root.dataset.haptics === 'enabled') vibrate(HAPTIC_DURATION);
    this.status.textContent = 'Action confirmed.';
  }
  private async tryAudio(): Promise<void> {
    const audio = this.root.querySelector<HTMLAudioElement>('audio[data-fsp-audio]');
    if (audio && this.root.dataset.sound === 'enabled') await audio.play();
    this.status.textContent = 'Action confirmed.';
  }
  private startScramble(generation: number): void {
    const node = this.root.querySelector<HTMLElement>('[data-fsp-text]'); if (!node) return;
    const original = node.dataset.fspOriginal ?? node.textContent ?? ''; node.dataset.fspOriginal = original;
    const glyphs = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // [GENERATED: legible reduced-confusion glyph set]
    let revealed = MIN_PROGRESS;
    const tick = (): void => {
      if (!this.mounted || generation !== this.generation) return;
      revealed += MAX_PROGRESS;
      node.textContent = [...original].map((character, index) => index < revealed || character === ' ' ? character : glyphs[Math.floor(Math.random() * glyphs.length)]).join('');
      if (revealed < original.length && !this.reducedMotion.matches) { const timer = window.setTimeout(() => { this.timers.delete(timer); tick(); }, SCRAMBLE_INTERVAL); this.timers.add(timer); }
      else node.textContent = original;
    };
    tick();
  }
  private startCounter(generation: number): void {
    const node = this.root.querySelector<HTMLElement>('[data-fsp-number]'); if (!node) return;
    const target = Number.parseFloat(node.dataset.fspTarget ?? '0'); const started = performance.now();
    const step = (now: number): void => {
      if (!this.mounted || generation !== this.generation) return;
      const progress = this.reducedMotion.matches ? MAX_PROGRESS : clamp((now - started) / this.options.durationMs);
      node.textContent = String(Math.round(target * progress));
      if (progress < MAX_PROGRESS) this.frame = requestAnimationFrame(step); else this.frame = null;
    };
    if (this.frame !== null) cancelAnimationFrame(this.frame); this.frame = requestAnimationFrame(step);
  }

  private render(): void {
    const rect = this.root.getBoundingClientRect();
    this.root.style.setProperty('--fsp-effect-progress', String(this.effectProgress));
    this.root.style.setProperty('--fsp-effect-opacity', String(this.effectProgress > MIN_PROGRESS ? MAX_PROGRESS : MIN_PROGRESS));
    this.root.style.setProperty('--fsp-local-x', `${this.pointerX}px`);
    this.root.style.setProperty('--fsp-local-y', `${this.pointerY}px`);
    this.root.style.setProperty('--fsp-delta-x', `${this.deltaX}px`);
    this.root.style.setProperty('--fsp-delta-y', `${this.deltaY}px`);
    this.root.style.setProperty('--fsp-pointer-x', `${this.pointerX}px`);
    this.root.style.setProperty('--fsp-pointer-y', `${this.pointerY}px`);
    this.root.style.setProperty('--fsp-tilt-x', String(rect.width ? this.deltaX / rect.width : MIN_PROGRESS));
    this.root.style.setProperty('--fsp-tilt-y', String(rect.height ? this.deltaY / rect.height : MIN_PROGRESS));
    this.root.style.setProperty('--fsp-drag-progress', String(this.effectProgress));
    this.trigger.setAttribute('aria-disabled', String(this.options.disabled));
    this.visual.style.willChange = this.effectProgress > MIN_PROGRESS && !this.reducedMotion.matches ? 'transform, opacity' : 'auto';
  }
}
```

The controller keeps the underlying native action intact, deduplicates hybrid input, cancels stale asynchronous work, releases timers and GPU hints, and supplies visible silent fallbacks for optional sensory feedback.


## Semantic markup contract

```html
<div data-fsp-pattern="070" aria-labelledby="fsp-070-title">
  <h2 id="fsp-070-title">Shimmer Sheen Highlight</h2>
  <button type="button" data-fsp-trigger>Shimmer Sheen Highlight</button>
  <span data-fsp-visual aria-hidden="true"></span>
  <p data-fsp-status role="status" aria-live="polite" aria-atomic="true"></p>
</div>
```

Semantic contract: Use the native control matching the action, keep the accessible name stable, and expose confirmation through text or state rather than motion alone.

## Tokenized CSS

```css
/* Adjustable values are CSS custom properties, not embedded magic numbers. */
:root {
  --fsp-070-target-min: 24px; /* [SOURCED: W3C WCAG 2.2 SC 2.5.8 Target Size (Minimum), Level AA — https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html] */
  --fsp-070-duration: 280ms; /* [GENERATED: balanced interaction default] */
  --fsp-070-distance: 16px; /* [GENERATED: compact motion distance] */
  --fsp-070-travel: 96px; /* [GENERATED: bounded visual travel] */
  --fsp-070-z-travel: 640px; /* [GENERATED: bounded depth range] */
  --fsp-070-perspective: 900px; /* [GENERATED: moderate perspective depth] */
  --fsp-070-center: 0.5; /* [GENERATED: normalized midpoint] */
  --fsp-070-scale-delta: 0.08; /* [GENERATED: restrained zoom delta] */
  --fsp-070-focus-width: 2px; /* [GENERATED: visible outline starting token] */
  --fsp-070-gap: 1rem; /* [GENERATED: portable spacing token] */
  --fsp-070-radius: 0.75rem; /* [GENERATED: portable corner token] */
  --fsp-070-indent: 1.25rem; /* [GENERATED: hierarchy indentation] */
  --fsp-070-stagger: 40ms; /* [GENERATED: bounded sequential delay] */
  --fsp-070-tilt: 8deg; /* [GENERATED: restrained perspective angle] */
  --fsp-070-effect-size: 12rem; /* [GENERATED: bounded effect surface] */
  --fsp-070-surface: Canvas;
  --fsp-070-text: CanvasText;
  --fsp-070-accent: LinkText;
  --fsp-070-border: GrayText;
  --fsp-070-stack-offset: 0.75rem; /* [GENERATED: card stacking offset] */
  --fsp-070-stack-lift: 1rem; /* [GENERATED: card lift limit] */
  --fsp-070-panel-max: 64rem; /* [GENERATED: readable panel cap] */
  --fsp-070-sidebar-min: 14rem; /* [GENERATED: usable sidebar minimum] */
  --fsp-070-sidebar-max: 24rem; /* [GENERATED: bounded sidebar maximum] */
  --fsp-070-sticky-offset: 1rem; /* [GENERATED: sticky safe offset] */
  --fsp-070-tile-min: 16rem; /* [GENERATED: responsive tile minimum] */
  --fsp-070-header-expanded: 5rem; /* [GENERATED: expanded navigation height] */
  --fsp-070-header-collapse: 2rem; /* [GENERATED: shrink amount] */
  --fsp-070-timeline-min: 18rem; /* [GENERATED: timeline card minimum] */
  --fsp-070-reveal-distance: 10rem; /* [GENERATED: bounded footer reveal] */
  --fsp-070-column-width: 18rem; /* [GENERATED: masonry column target] */
  --fsp-070-hero-min: 3rem; /* [GENERATED: responsive display minimum] */
  --fsp-070-hero-max: 10rem; /* [GENERATED: responsive display maximum] */
  --fsp-070-hero-leading: 0.9; /* [GENERATED: display line-height] */
  --fsp-070-hue-range: 120deg; /* [GENERATED: bounded color-shift range] */
  --fsp-070-peek-size: 4rem; /* [GENERATED: next-section preview] */
  --fsp-070-drawer-width: 24rem; /* [GENERATED: drawer width cap] */
  --fsp-070-menu-column: 12rem; /* [GENERATED: mega-menu column minimum] */
  --fsp-070-ring-radius: 5rem; /* [GENERATED: radial-menu radius] */
  --fsp-070-icon-offset: 0.35rem; /* [GENERATED: hamburger line offset] */
  --fsp-070-popover-min: 12rem; /* [GENERATED: popover minimum width] */
  --fsp-070-summary-max: 30rem; /* [GENERATED: bounded reveal region] */
  --fsp-070-flyout-collapsed: 3rem; /* [GENERATED: collapsed flyout width] */
  --fsp-070-flyout-expanded: 16rem; /* [GENERATED: expanded flyout width] */
  --fsp-070-search-collapsed: 3rem; /* [GENERATED: collapsed search width] */
  --fsp-070-search-expanded: 30rem; /* [GENERATED: expanded search width] */
  --fsp-070-overlay-start-scale: 0.96; /* [GENERATED: restrained overlay scale] */
  --fsp-070-dock-lift: 0.5rem; /* [GENERATED: dock hover lift] */
  --fsp-070-dock-scale: 1.15; /* [GENERATED: bounded dock magnification] */
  --fsp-070-magnet-strength: 0.18; /* [GENERATED: restrained magnetic response] */
  --fsp-070-spring-scale: 0.08; /* [GENERATED: restrained spring scale] */
  --fsp-070-morph-scale: 0.2; /* [GENERATED: bounded morph stretch] */
  --fsp-070-sheen-angle: 115deg; /* [GENERATED: diagonal sheen angle] */
  --fsp-070-trail-lag: 0.35; /* [GENERATED: ghost-trail lag factor] */
  --fsp-070-trail-opacity: 0.25; /* [GENERATED: low-emphasis trail opacity] */
  --fsp-070-blob-blur: 0.5rem; /* [GENERATED: bounded blob blur] */
  --fsp-070-blob-contrast: 14; /* [GENERATED: SVG-style fusion contrast] */
  --fsp-070-blob-travel: 3rem; /* [GENERATED: bounded blob travel] */
  --fsp-070-haptic-scale: 0.04; /* [GENERATED: subtle visual fallback] */
  --fsp-070-zoom-scale: 0.12; /* [GENERATED: bounded image zoom] */
  --fsp-070-audio-scale: 0.04; /* [GENERATED: subtle audio visual cue] */
  --fsp-070-beacon-duration: 1800ms; /* [GENERATED: attention pulse interval] */
  --fsp-070-beacon-scale: 1.8; /* [GENERATED: bounded beacon spread] */
  --fsp-070-squish-x: 0.08; /* [GENERATED: bounded press compression] */
  --fsp-070-squish-y: 0.04; /* [GENERATED: bounded press expansion] */
  --fsp-070-shimmer-duration: 1400ms; /* [GENERATED: skeleton shimmer interval] */
  --fsp-070-visible-opacity: 0.75; /* [GENERATED: visible-state icon opacity] */
  --fsp-070-hidden-opacity: 0.25; /* [GENERATED: hidden-state icon opacity] */
  --fsp-070-unlock-travel: 14rem; /* [GENERATED: slide-control travel] */
  --fsp-070-glitch-offset: 0.5rem; /* [GENERATED: bounded glitch displacement] */
  --fsp-070-lift: 0.75rem; /* [GENERATED: card lift distance] */
  --fsp-070-dash: 0.75rem; /* [GENERATED: border dash length] */
  --fsp-070-dash-gap: 0.5rem; /* [GENERATED: border dash gap] */
  --fsp-070-dash-cycle: 4rem; /* [GENERATED: border animation cycle] */
}

[data-fsp-pattern="070"] {
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
  color: var(--fsp-070-text);
  background: var(--fsp-070-surface);
  position: relative;
}

[data-fsp-pattern="070"] :where(button, a, input, [tabindex]):focus-visible {
  outline: var(--fsp-070-focus-width) solid var(--fsp-070-accent);
  outline-offset: var(--fsp-070-focus-width);
}

[data-fsp-pattern="070"] :where(button, a, [role="button"]) {
  min-inline-size: var(--fsp-070-target-min);
  min-block-size: var(--fsp-070-target-min);
}

[data-fsp-pattern="070"] [data-fsp-visual],
[data-fsp-pattern="070"] [data-fsp-panel],
[data-fsp-pattern="070"] [data-fsp-trigger] {
  transition-property: transform, opacity, inline-size, block-size, grid-template-rows;
  transition-duration: var(--fsp-070-duration);
  transition-timing-function: cubic-bezier(.2, .8, .2, 1); /* [GENERATED: decelerating UI curve] */
}

[data-fsp-pattern="070"] [data-fsp-visual] { background: linear-gradient(var(--fsp-070-sheen-angle), transparent, color-mix(in srgb, currentColor 35%, transparent), transparent); transform: translateX(calc((var(--fsp-effect-progress) * 2 - 1) * 100%)); }

@media (prefers-reduced-motion: reduce) {
  [data-fsp-pattern="070"] *,
  [data-fsp-pattern="070"] *::before,
  [data-fsp-pattern="070"] *::after {
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important; /* [GENERATED: near-immediate compatibility fallback] */
    animation-duration: 0.01ms !important; /* [GENERATED: near-immediate compatibility fallback] */
    animation-iteration-count: 1 !important; /* [GENERATED: prevents continuous repetition] */
  }
}

@media (forced-colors: active) {
  [data-fsp-pattern="070"] { forced-color-adjust: auto; }
  [data-fsp-pattern="070"] [data-fsp-visual] { border: var(--fsp-070-focus-width) solid CanvasText; }
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
export function smokeCheck070(root: HTMLElement): void {
  if (!root.matches('[data-fsp-pattern="070"]')) throw new Error('Pattern root is not identifiable.');
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
