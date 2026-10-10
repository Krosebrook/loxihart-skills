/**
 * FlashFusion — Feature Card Component
 * 
 * Profile:        FlashFusion
 * Component:      Feature highlight card for product/marketing pages
 * Differentiator: Gradient accent border that animates on hover;
 *                 icon uses cyan accent instead of purple to create
 *                 triad contrast against the card's primary glow
 * States:         idle, hover (CSS), loading, error
 * Brief ref:      inline gate passed
 */

import { useState } from "react";

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif&family=Geist:wght@400;500&family=Geist+Mono:wght@400&display=swap');

    :root {
      --surface-base:    #0F0618;
      --surface-raised:  #1A0B2E;
      --surface-overlay: #251443;
      --border-primary:   rgba(168, 85, 247, 0.2);
      --border-active:    rgba(168, 85, 247, 0.4);
      --accent-primary:   #A855F7;
      --accent-secondary: #F472B6;
      --accent-cyan:      #22D3EE;
      --gradient-accent:  linear-gradient(90deg, #A855F7 0%, #F472B6 55%, #22D3EE 100%);
      --glow-primary:     0 0 20px rgba(168, 85, 247, 0.4);
      --glow-subtle:      0 0 12px rgba(168, 85, 247, 0.2);
      --text-primary:   #F8FAFC;
      --text-secondary: #CBD5E1;
      --text-tertiary:  #64748B;
      --font-heading: 'Instrument Serif', Georgia, serif;
      --font-body: 'Geist', system-ui, sans-serif;
      --text-xs:   12px;
      --text-sm:   14px;
      --text-base: 16px;
      --text-md:   20px;
      --text-lg:   24px;
      --space-2:  8px;
      --space-3:  12px;
      --space-4:  16px;
      --space-6:  24px;
      --space-8:  32px;
      --radius-md: 12px;
      --radius-lg: 16px;
      --radius-full: 999px;
      --color-success: #4ade80;
      --color-error:   #f87171;
    }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
      }
    }

    body {
      background: var(--surface-base);
      color: var(--text-primary);
      font-family: var(--font-body);
      -webkit-font-smoothing: antialiased;
      min-height: 100vh;
      display: grid;
      place-items: center;
      padding: var(--space-8);
    }

    :focus-visible {
      outline: 2px solid var(--accent-primary);
      outline-offset: 3px;
      border-radius: var(--radius-md);
    }
    :focus:not(:focus-visible) { outline: none; }

    @keyframes shimmer {
      from { background-position: -200% 0; }
      to   { background-position: 200% 0; }
    }
    .skeleton {
      background: linear-gradient(90deg, var(--surface-raised) 25%, var(--surface-overlay) 50%, var(--surface-raised) 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s ease-in-out infinite;
      border-radius: var(--radius-md);
    }

    @keyframes fadeSlideUp {
      from { opacity: 0; transform: translateY(14px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* ── Glass Card ── */
    .feature-card {
      background: rgba(15, 6, 24, 0.6);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-radius: var(--radius-lg);
      padding: var(--space-6);
      width: 100%;
      max-width: 360px;
      position: relative;
      cursor: pointer;
      transition: box-shadow 250ms ease, transform 200ms ease;

      /* Gradient border via pseudo-element */
      background-clip: padding-box;
      border: 1px solid rgba(168, 85, 247, 0.2);

      animation: fadeSlideUp 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
    }

    .feature-card::before {
      content: '';
      position: absolute;
      inset: -1px;
      border-radius: calc(var(--radius-lg) + 1px);
      background: var(--gradient-accent);
      opacity: 0;
      transition: opacity 250ms ease;
      z-index: -1;
    }

    .feature-card:hover {
      box-shadow: var(--glow-subtle);
      transform: translateY(-2px);
    }

    .feature-card:hover::before {
      opacity: 0.5; /* gradient border reveals on hover */
    }

    /* ── Icon wrapper — cyan accent, not purple (triad contrast) ── */
    .card-icon {
      width: 44px;
      height: 44px;
      border-radius: var(--radius-md);
      background: rgba(34, 211, 238, 0.1);
      border: 1px solid rgba(34, 211, 238, 0.25);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: var(--space-4);
      color: var(--accent-cyan);
      font-size: 20px;
    }

    .card-badge {
      display: inline-flex;
      align-items: center;
      padding: 2px 10px;
      border-radius: var(--radius-full);
      font-size: var(--text-xs);
      font-weight: 500;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      background: rgba(168, 85, 247, 0.15);
      color: var(--accent-primary);
      border: 1px solid rgba(168, 85, 247, 0.3);
      margin-bottom: var(--space-3);
    }

    .card-title {
      font-family: var(--font-heading);
      font-size: var(--text-md);
      font-weight: 700;
      color: var(--text-primary);
      line-height: 1.3;
      margin-bottom: var(--space-2);
    }

    .card-description {
      font-size: var(--text-sm);
      color: var(--text-secondary);
      line-height: 1.6;
      margin-bottom: var(--space-6);
    }

    .card-cta {
      display: inline-flex;
      align-items: center;
      gap: var(--space-2);
      font-size: var(--text-sm);
      font-weight: 500;
      color: var(--accent-primary);
      background: none;
      border: none;
      padding: 0;
      cursor: pointer;
      transition: gap 150ms ease, color 150ms ease;
    }
    .card-cta:hover {
      gap: 10px;
      color: var(--text-primary);
    }
    .card-cta-arrow { transition: transform 150ms ease; }
    .card-cta:hover .card-cta-arrow { transform: translateX(3px); }

    .card-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: var(--space-4);
      max-width: 780px;
    }

    .card-grid .feature-card:nth-child(2) { animation-delay: 80ms; }
    .card-grid .feature-card:nth-child(3) { animation-delay: 160ms; }
  `}</style>
);

function FeatureCard({ icon, badge, title, description, ctaLabel = "Learn more", isLoading = false, hasError = false }) {
  const [active, setActive] = useState(false);

  if (isLoading) {
    return (
      <div className="feature-card" aria-busy="true" aria-label="Loading feature...">
        <div className="skeleton" style={{ width: 44, height: 44, marginBottom: 16, borderRadius: 12 }} />
        <div className="skeleton" style={{ height: 16, width: "40%", marginBottom: 12 }} />
        <div className="skeleton" style={{ height: 24, width: "70%", marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 16, width: "100%", marginBottom: 4 }} />
        <div className="skeleton" style={{ height: 16, width: "85%" }} />
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="feature-card" role="alert" aria-live="assertive">
        <p style={{ color: "var(--color-error)", fontSize: "var(--text-sm)" }}>
          Failed to load feature
        </p>
        <button
          className="card-cta"
          style={{ marginTop: 12, color: "var(--text-secondary)" }}
          onClick={() => window.location.reload()}
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <article
      className="feature-card"
      aria-label={`${title} — ${description}`}
      onClick={() => setActive(!active)}
      onKeyDown={(e) => e.key === "Enter" && setActive(!active)}
      tabIndex={0}
      role="button"
      aria-pressed={active}
    >
      <div className="card-icon" aria-hidden="true">{icon}</div>
      {badge && <span className="card-badge">{badge}</span>}
      <h2 className="card-title">{title}</h2>
      <p className="card-description">{description}</p>
      <button className="card-cta" tabIndex={-1} aria-label={`${ctaLabel} about ${title}`}>
        {ctaLabel}
        <span className="card-cta-arrow" aria-hidden="true">→</span>
      </button>
    </article>
  );
}

export default function FlashFusionCards() {
  const features = [
    {
      icon: "⚡",
      badge: "New",
      title: "Instant Deployment",
      description: "Ship from localhost to production in under 60 seconds. Zero config. Automatic SSL, CDN, and rollback built in.",
      ctaLabel: "View docs"
    },
    {
      icon: "🔮",
      badge: "AI-Powered",
      title: "Predictive Routing",
      description: "Traffic is routed intelligently before the request completes. Latency drops without touching your code.",
      ctaLabel: "See how it works"
    },
    {
      icon: "🛡",
      badge: "Pro",
      title: "Edge Security",
      description: "DDoS protection, WAF rules, and bot filtering applied at the network layer — not in your application.",
      ctaLabel: "Explore security"
    }
  ];

  return (
    <>
      <GlobalStyles />
      <main aria-label="Product features">
        <div className="card-grid" role="list">
          {features.map((f) => (
            <div key={f.title} role="listitem">
              <FeatureCard {...f} />
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
