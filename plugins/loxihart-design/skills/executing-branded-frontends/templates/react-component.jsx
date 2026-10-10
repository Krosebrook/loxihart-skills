/**
 * FRONTEND-DESIGN SKILL — REACT ARTIFACT TEMPLATE
 * =================================================
 * Profile:        [Loxihart | FlashFusion | Custom]
 * Component:      [component name]
 * Differentiator: [the one design decision that makes this memorable]
 * States:         [empty, loading, error, success, ...]
 * Brief ref:      [brief file or "inline gate passed"]
 *
 * Replace all [PLACEHOLDER] values before delivery.
 * Remove this comment block from final output.
 */

import { useState, useEffect, useCallback } from "react";

// =====================================================
// DESIGN TOKENS
// Import from designs/[profile]-tokens.md
// Apply as inline CSS vars via a style tag injected at root,
// or use the token object below for computed values.
// =====================================================
const tokens = {
  // Paste relevant token values here for JS-driven styles
  // Example: accentPrimary: '#A855F7'  (FlashFusion)
  //          accent: 'hsl(262, 83%, 68%)'  (Loxihart)
};

// =====================================================
// FONT INJECTION
// Include in the component if this is a standalone artifact.
// For project builds, move to index.html or global CSS.
// =====================================================
const FontLoader = () => (
  <>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    {/* Loxihart:         Space Grotesk:700 + Inter:400;500 */}
    {/* FlashFusion: Instrument Serif (400) + Geist (400/500) + Geist Mono (400)   */}
    <link href="[FONT_URL]" rel="stylesheet" />
  </>
);

// =====================================================
// CSS VARIABLES INJECTION
// Inject tokens as CSS variables at :root for use
// in all class-based styles within this artifact.
// =====================================================
const GlobalStyles = () => (
  <style>{`
    :root {
      /* Paste full token set from designs/[profile]-tokens.md */
      /* [TOKENS] */

      --ease-out-smooth:   cubic-bezier(0.25, 0.46, 0.45, 0.94);
      --ease-out-spring:   cubic-bezier(0.34, 1.56, 0.64, 1);
      --duration-fast:   150ms;
      --duration-medium: 250ms;
      --duration-slow:   400ms;
    }

    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }

    body {
      background: var(--surface-base);
      color: var(--text-primary);
      font-family: var(--font-body);
      -webkit-font-smoothing: antialiased;
    }

    :focus-visible {
      outline: 2px solid var(--accent, var(--accent-primary));
      outline-offset: 3px;
      border-radius: var(--radius-sm);
    }
    :focus:not(:focus-visible) { outline: none; }

    @keyframes shimmer {
      from { background-position: -200% 0; }
      to   { background-position: 200% 0; }
    }
    .skeleton {
      background: linear-gradient(
        90deg,
        var(--surface-raised) 25%,
        var(--surface-overlay) 50%,
        var(--surface-raised) 75%
      );
      background-size: 200% 100%;
      animation: shimmer 1.5s ease-in-out infinite;
      border-radius: var(--radius-sm);
    }

    @keyframes fadeSlideUp {
      from { opacity: 0; transform: translateY(12px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* [COMPONENT_STYLES] */
  `}</style>
);

// =====================================================
// STATE TYPES
// =====================================================
/** @typedef {'idle' | 'loading' | 'error' | 'success' | 'empty'} ComponentState */

// =====================================================
// COMPONENT
// =====================================================

/**
 * [ComponentName] — [one-sentence description]
 *
 * @param {Object} props
 * @param {string} [props.className]
 */
export default function [ComponentName]({ className = "" }) {
  /** @type {[ComponentState, Function]} */
  const [state, setState] = useState("idle");
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  // -- Data fetching / side effects --
  useEffect(() => {
    // [EFFECT_LOGIC]
  }, []);

  // -- Handlers --
  const handleAction = useCallback(() => {
    // [ACTION_LOGIC]
  }, []);

  // -- Render: Loading --
  if (state === "loading") {
    return (
      <div aria-busy="true" aria-label="Loading [content]..." className={className}>
        {/* Skeleton from animation-system.md */}
        <div className="skeleton" style={{ height: "20px", width: "60%", marginBottom: "8px" }} />
        <div className="skeleton" style={{ height: "20px", width: "80%" }} />
      </div>
    );
  }

  // -- Render: Error --
  if (state === "error") {
    return (
      <div role="alert" aria-live="assertive" className={className}>
        <p style={{ color: "var(--color-error)" }}>
          {error?.message || "[Default error message]"}
        </p>
        <button onClick={handleAction}>
          Try again
        </button>
      </div>
    );
  }

  // -- Render: Empty --
  if (state === "empty" || (state === "idle" && !data)) {
    return (
      <div role="status" aria-label="[Empty state description]" className={className}>
        {/* [EMPTY_STATE_CONTENT] */}
        <p style={{ color: "var(--text-secondary)" }}>
          [Empty state message with call to action]
        </p>
        <button onClick={handleAction}>
          [Primary action]
        </button>
      </div>
    );
  }

  // -- Render: Success / Idle with data --
  return (
    <>
      <FontLoader />
      <GlobalStyles />
      <main aria-label="[Component description]" className={className}>
        {/* [COMPONENT_MARKUP] */}

        {/* Success state */}
        {state === "success" && (
          <div role="status" aria-live="polite">
            [Success confirmation message]
          </div>
        )}
      </main>
    </>
  );
}

// =====================================================
// PROP VALIDATION (remove if using TypeScript)
// =====================================================
// [ComponentName].propTypes = {
//   className: PropTypes.string,
// };
