# Pattern 001 Token Mapping

## Executive summary

The integration uses a three-layer token model: primitives define raw values, semantic tokens describe product intent, and Pattern `001` aliases consume only those semantic tokens. [GENERATED: design-system architecture] This prevents the parallax implementation from hard-coding a product palette or reaching directly into primitive values.

## Mapping table

| Generic pilot concern | Pattern alias | Reference semantic token | Purpose |
|---|---|---|---|
| Component surface | `--fsp-001-surface` | `--surface-default` | Elevated readable content surface |
| Primary text | `--fsp-001-text` | `--text-primary` | Heading and essential content |
| Accent | `--fsp-001-accent` | `--action-primary` | Interactive and decorative accent |
| Boundary | `--fsp-001-border` | `--border-default` | Component edge and separation |
| Minimum target | `--fsp-001-target-min` | `--target-minimum` | Twenty-four CSS-pixel pointer-target floor [SOURCED: WCAG 2.2 SC 2.5.8, Level AA, subject to criterion exceptions] |
| Focus width | `--fsp-001-focus-width` | `--focus-ring-width` | Visible focus treatment |
| Internal gap | `--fsp-001-gap` | `--space-4` | Component rhythm |
| Radius | `--fsp-001-radius` | `--radius-lg` | Surface shape |
| Duration | `--fsp-001-duration` | `--duration-standard` | Non-essential visual transition |
| Easing | `--fsp-001-easing` | `--easing-standard` | Decelerating transition curve |
| Travel | `--fsp-001-travel` | Component-local bounded value | Maximum decorative layer displacement |

## Contrast evidence

The calculated dark and light token pairs are recorded in `reports/contrast-report.json`. Normal text pairs are checked against four-and-one-half to one. [SOURCED: WCAG 2.2 SC 1.4.3, Level AA] Focus and boundary pairs are checked against three to one where they communicate component state or boundary. [SOURCED: WCAG 2.2 SC 1.4.11, Level AA]

## Implementation Considerations

A real product should map the component aliases to existing semantic tokens rather than copying these primitive values. When the product theme changes, rerun the contrast test with the resolved computed colors for every supported theme and state.

## Performance/Security Notes

Token mapping is static CSS and adds no runtime lookup, network dependency, or script execution. `color-mix()` is used only for decorative or surface blending; essential contrast checks target stable semantic foreground/background pairs.

## Recommended Next Steps

Replace the reference semantic token values with the target product’s validated tokens, preserve the Pattern `001` aliases, and rerun the automated contrast and forced-colors cases.

## CLAIMS CHECK

- Primitive values are isolated from component rules.
- Pattern `001` consumes semantic aliases.
- Both light and dark reference pairs pass the applicable automated contrast thresholds.
- Product-specific contrast remains unverified until real tokens are supplied.
