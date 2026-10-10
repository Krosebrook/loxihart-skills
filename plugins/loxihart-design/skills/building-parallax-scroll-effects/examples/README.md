# Examples

Four complete, self-contained HTML files. Same technique library, four
unrelated brand systems, so the patterns read as reusable rather than
tied to one look. Every file: Google Fonts via `preconnect` + `display=swap`,
CSS custom properties for all tokens, compositor-only animation, a full
`prefers-reduced-motion` contract, and a comment block at the top stating
what "working" looks like.

| File | Brand | Techniques shown | Stack |
|---|---|---|---|
| `the-marginalia.html` | Literary quarterly | Scroll-triggered reveal (clip-path, native CSS + fallback), sticky pin + pass-through | A + B |
| `ferrous-and-fold.html` | Precision-made objects | Depth-layer parallax (3 layers), scale-on-scroll focal piece | A |
| `loopline.html` | Workflow automation SaaS | Pointer/mouse parallax, horizontal scroll-linked panel | A |
| `ridgeline-supply.html` | Outdoor/trail gear | Depth-layer parallax via native CSS scroll-timeline with a real JS fallback, scroll-progress rail | A + B |

Open any file directly in a browser — no build step, no dependencies
beyond the Google Fonts CDN. Each targets a different pair of techniques
from `../references/technique-catalog.md` on purpose, so between the four
files every catalog entry except the scroll-scrubbed-media and
scroll-linked-theme-shift techniques is demonstrated in working code —
those two need a video/canvas asset or a multi-zone page respectively,
which don't fit a single-scene demo file.
