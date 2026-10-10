export type Cleanup = () => void;

type MotionState = 'active' | 'disabled' | 'reduced' | 'suspended';

export interface ParallaxControllerOptions {
  root: HTMLElement;
  storageKey?: string;
}

const MIN_PROGRESS = 0; // [GENERATED: normalized lower bound]
const MAX_PROGRESS = 1; // [GENERATED: normalized upper bound]
const ACTIVE_THRESHOLD = 0.001; // [GENERATED: avoids promoting a layer for effectively zero movement]

const clamp = (value: number, minimum: number, maximum: number): number =>
  Math.min(Math.max(value, minimum), maximum);

export class ParallaxController {
  readonly #root: HTMLElement;
  readonly #layers: readonly HTMLElement[];
  readonly #toggle: HTMLButtonElement;
  readonly #status: HTMLElement;
  readonly #storageKey: string;
  readonly #reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  readonly #cleanups = new Set<Cleanup>();
  readonly #intersectionObserver: IntersectionObserver;
  readonly #resizeObserver: ResizeObserver;

  #mounted = false;
  #visible = true;
  #disabled = false;
  #frame: number | null = null;

  constructor(options: ParallaxControllerOptions) {
    this.#root = options.root;
    this.#layers = [...this.#root.querySelectorAll<HTMLElement>('[data-parallax-layer]')];
    this.#toggle = this.#requireElement<HTMLButtonElement>('[data-parallax-toggle]');
    this.#status = this.#requireElement<HTMLElement>('[data-parallax-status]');
    this.#storageKey = options.storageKey ?? 'fsp.pattern-001.motion-disabled';
    this.#disabled = this.#readStoredPreference();

    this.#intersectionObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        this.#visible = entry?.isIntersecting ?? true;
        this.#requestUpdate();
      },
      { threshold: MIN_PROGRESS },
    );

    this.#resizeObserver = new ResizeObserver(() => this.#requestUpdate());
  }

  mount(): Cleanup {
    if (this.#mounted && this.#root.dataset.enhanced === 'true') {
      return () => this.unmount();
    }
    // Repair a lifecycle-marker mismatch instead of silently returning a stale instance.
    this.#mounted = true;
    this.#root.dataset.enhanced = 'true';

    this.#listen(window, 'scroll', this.#onViewportChange, { passive: true });
    this.#listen(window, 'resize', this.#onViewportChange, { passive: true });
    if (window.visualViewport) {
      this.#listen(window.visualViewport, 'resize', this.#onViewportChange, { passive: true });
      this.#listen(window.visualViewport, 'scroll', this.#onViewportChange, { passive: true });
    }
    this.#listen(window, 'pageshow', this.#onPageShow);
    this.#listen(this.#reducedMotionQuery, 'change', this.#onMotionPreferenceChange);
    this.#listen(this.#toggle, 'click', this.#onToggle);

    this.#intersectionObserver.observe(this.#root);
    this.#resizeObserver.observe(this.#root);
    this.#syncToggle();
    this.#requestUpdate();

    return () => this.unmount();
  }

  unmount(): void {
    if (!this.#mounted) return;
    this.#mounted = false;

    if (this.#frame !== null) cancelAnimationFrame(this.#frame);
    this.#frame = null;
    this.#intersectionObserver.disconnect();
    this.#resizeObserver.disconnect();

    for (const cleanup of this.#cleanups) cleanup();
    this.#cleanups.clear();

    delete this.#root.dataset.enhanced;
    delete this.#root.dataset.active;
    delete this.#root.dataset.motion;
    this.#root.style.removeProperty('--parallax-progress');
  }

  get disabled(): boolean {
    return this.#disabled;
  }

  #requireElement<T extends HTMLElement>(selector: string): T {
    const element = this.#root.querySelector<T>(selector);
    if (!element) throw new Error(`Pattern 001 integration is missing ${selector}.`);
    return element;
  }

  #listen<T extends Event>(
    target: EventTarget,
    type: string,
    handler: (event: T) => void,
    options?: AddEventListenerOptions,
  ): void {
    const listener = handler as EventListener;
    target.addEventListener(type, listener, options);
    this.#cleanups.add(() => target.removeEventListener(type, listener, options));
  }

  readonly #onViewportChange = (): void => this.#requestUpdate();

  readonly #onMotionPreferenceChange = (): void => {
    this.#announce(
      this.#reducedMotionQuery.matches
        ? 'Reduced motion is active. Decorative depth movement is disabled.'
        : 'Reduced motion is no longer active. Decorative depth movement follows your motion setting.',
    );
    this.#requestUpdate();
  };

  readonly #onPageShow = (event: PageTransitionEvent): void => {
    if (!event.persisted) return;
    this.#disabled = this.#readStoredPreference();
    this.#syncToggle();
    this.#requestUpdate();
  };

  readonly #onToggle = (): void => {
    this.#disabled = !this.#disabled;
    this.#writeStoredPreference();
    this.#syncToggle();
    this.#announce(
      this.#disabled
        ? 'Parallax motion disabled. Native scrolling and all content remain available.'
        : 'Parallax motion enabled. Native scrolling remains unchanged.',
    );
    this.#requestUpdate();
  };

  #requestUpdate(): void {
    if (!this.#mounted || this.#frame !== null) return;
    this.#frame = requestAnimationFrame(() => {
      this.#frame = null;
      this.#update();
    });
  }

  #update(): void {
    const motionState = this.#resolveMotionState();
    const progress = motionState === 'active' ? this.#measureProgress() : MIN_PROGRESS;
    const active = motionState === 'active' && progress > ACTIVE_THRESHOLD;

    this.#root.dataset.motion = motionState;
    this.#root.dataset.active = String(active);
    this.#root.style.setProperty('--parallax-progress', String(progress));

    for (const [index, layer] of this.#layers.entries()) {
      const fallbackDepth = (index + MAX_PROGRESS) / Math.max(this.#layers.length, MAX_PROGRESS);
      const requestedDepth = Number.parseFloat(layer.dataset.parallaxDepth ?? '');
      const depth = Number.isFinite(requestedDepth) ? requestedDepth : fallbackDepth;
      layer.style.setProperty('--parallax-depth', String(clamp(depth, MIN_PROGRESS, MAX_PROGRESS)));
    }
  }

  #resolveMotionState(): MotionState {
    if (this.#disabled) return 'disabled';
    if (this.#reducedMotionQuery.matches) return 'reduced';
    if (!this.#visible) return 'suspended';
    return 'active';
  }

  #measureProgress(): number {
    const bounds = this.#root.getBoundingClientRect();
    const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
    const scrollRange = Math.max(bounds.height - viewportHeight, MAX_PROGRESS);
    return clamp(-bounds.top / scrollRange, MIN_PROGRESS, MAX_PROGRESS);
  }

  #syncToggle(): void {
    this.#toggle.setAttribute('aria-pressed', String(this.#disabled));
    this.#toggle.textContent = this.#disabled ? 'Enable depth motion' : 'Disable depth motion';
  }

  #announce(message: string): void {
    this.#status.textContent = '';
    requestAnimationFrame(() => {
      if (this.#mounted) this.#status.textContent = message;
    });
  }

  #readStoredPreference(): boolean {
    try {
      return window.sessionStorage.getItem(this.#storageKey) === 'true';
    } catch {
      return false;
    }
  }

  #writeStoredPreference(): void {
    try {
      window.sessionStorage.setItem(this.#storageKey, String(this.#disabled));
    } catch {
      // Storage denial is non-fatal; the current-session state remains functional.
    }
  }
}
