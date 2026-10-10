import { ParallaxController, type Cleanup } from './parallax-controller.js';

const ROOT_SELECTOR = '[data-fsp-pattern="001"]';

const root = document.querySelector<HTMLElement>(ROOT_SELECTOR);
if (!root) throw new Error(`Expected ${ROOT_SELECTOR} in the reference application.`);

const controller = new ParallaxController({ root });
let cleanup: Cleanup = controller.mount();

window.addEventListener('pagehide', (event: PageTransitionEvent) => {
  // A persisted page remains alive in the back/forward cache; its controller must
  // remain mounted so pageshow can resynchronize stored state without a flash.
  if (!event.persisted) cleanup();
});

Object.assign(window, {
  __FSP_PATTERN_001__: {
    unmount: (): void => controller.unmount(),
    mount: (): Cleanup => {
      cleanup = controller.mount();
      return cleanup;
    },
    getDisabled: (): boolean => controller.disabled,
  },
});
