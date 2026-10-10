# React 19 Gotchas — Steps 5–6 (Types, Utils, Components)

## The ones that actually bite

1. **`ref` is a normal prop.** `forwardRef` is no longer required — but keep
   it for library components consumed by pre-19 apps; drop it only when the
   consumer floor is 19+. Pick one convention per compile, note it in patterns.md.
2. **`defaultProps` on function components: gone.** Default parameters only.
   CVA `defaultVariants` covers variant defaults cleanly.
3. **Forms:** `useActionState` / `useFormStatus` replace hand-rolled
   pending/error state for action-based forms — but artifact/sandbox targets
   without a server runtime should stay on controlled `useState` forms.
   Never HTML `<form>` submission in claude.ai artifacts.
4. **StrictMode double-invoke** still runs effects twice in dev — token-system
   side effects (theme injection, media-query listeners) must be idempotent
   with cleanup.
5. **`use client` boundaries** (Next.js consumers): everything in the
   component library that touches state/refs is client; keep tokens.css and
   pure display components server-safe.

## Utils contract (`lib/utils.ts`)

- `cn(...inputs)` — clsx + tailwind-merge; the *only* sanctioned way to
  compose classes
- `trapFocus(el)` — modal/dialog focus containment with teardown returned
- `announce(msg, polite?)` — aria-live region announcer (create once, reuse)
- `prefersReducedMotion()` — media query read, used by any animated component

## Component conventions (Step 6)

CVA for variants (`variant`/`size`/`tone`), typed with `VariantProps`;
spread `...props` last so consumers can override; every interactive component
ships keyboard handling + `:focus-visible` + `aria-*` complete — a11y is in
the definition of done, not a follow-up ticket; no raw palette values, token
vars only (compile gate rejects hex in components).
