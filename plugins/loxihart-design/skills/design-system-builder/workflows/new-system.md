# New Design System Workflow

## Purpose
Set up a complete design system from scratch: charter, tokens, component structure, first components, and docs.

---

## Step 1: Define the Charter

Before writing any code, establish scope and stakeholders:

```markdown
## Design System Charter

### Purpose
- Ensure consistent user experience across [products]
- Accelerate development with reusable components
- Maintain brand identity and accessibility standards

### Scope
- **In scope:** [e.g., Web (React), Mobile (React Native), Marketing sites]
- **Out of scope:** [e.g., Print materials, video content]

### Principles
1. Accessible by default (WCAG 2.2 AA minimum)
2. Mobile-first responsive
3. Performance-optimized (<100KB bundle)
4. Developer-friendly APIs
5. Themeable for white-label use

### Stakeholders
- Design: [name] (lead), [name] (contributor)
- Engineering: [name] (lead), [name] (contributor)
- Product: [name] (stakeholder)
```

**Ask the user to fill in the bracketed fields.** If they don't know scope yet, default to "Web (React)" and note it can expand later.

---

## Step 2: Choose Tech Stack

Read `references/tech-stack-comparison.md` for the full breakdown. Short version:

| Stack | Recommended When |
|-------|-----------------|
| **Tailwind + CVA** | New systems, rapid dev, flexible styling (RECOMMENDED DEFAULT) |
| Styled Components | Need runtime theming, dynamic styles |
| CSS Modules | Need simplicity, SSR performance |
| Vanilla Extract | Need type safety + zero runtime |

If the user hasn't chosen, recommend Tailwind + CVA and explain why.

---

## Step 3: Set Up Token Architecture

Read `references/token-architecture.md` for the complete token system.

**Quick setup:**
1. Copy `assets/starter-tokens.json` to `tokens/tokens.json` as your starting point
2. Customize the primitive color values to match the brand
3. Copy `assets/style-dictionary.config.json` to the project root
4. Run `node scripts/build-tokens.js` to generate CSS/JS/iOS/Android outputs
5. Import `dist/tokens/variables.css` in your app entry point

---

## Step 4: Scaffold the Component Library

```
/design-system
├── tokens/
│   ├── colors.json
│   ├── spacing.json
│   ├── typography.json
│   └── build.js (Style Dictionary config)
├── primitives/       (Atoms)
│   ├── Button/
│   ├── Input/
│   ├── Text/
│   └── Icon/
├── components/       (Molecules)
│   ├── Card/
│   ├── FormField/
│   └── Alert/
├── patterns/         (Organisms)
│   ├── Navigation/
│   ├── Modal/
│   └── DataTable/
├── layouts/          (Templates)
│   ├── AppShell/
│   └── Dashboard/
└── docs/
    ├── getting-started.md
    ├── principles.md
    └── contributing.md
```

**First 5 components to build (in order):**
1. Button (most used, establishes variant/size pattern)
2. Text/Typography (establishes type scale)
3. Input (establishes form patterns)
4. Card (establishes layout/composition patterns)
5. Alert (establishes feedback patterns)

Scaffold each component using:
```bash
node scripts/generate-component.js Button primitives
node scripts/generate-component.js Text primitives
node scripts/generate-component.js Input primitives
node scripts/generate-component.js Card components
node scripts/generate-component.js Alert components
```

For each component, follow `workflows/add-component.md`.

---

## Step 5: Configure Tooling

**Package.json essentials:**
```json
{
  "name": "@company/design-system",
  "version": "0.1.0",
  "sideEffects": false,
  "exports": {
    ".": { "import": "./dist/index.js", "types": "./dist/index.d.ts" },
    "./button": { "import": "./dist/button.js", "types": "./dist/button.d.ts" }
  },
  "scripts": {
    "build": "tsup",
    "storybook": "storybook dev -p 6006",
    "test": "jest",
    "lint": "eslint . --ext .ts,.tsx",
    "release": "semantic-release"
  }
}
```

**Essential dev dependencies:**
- `class-variance-authority` — variant management
- `tailwindcss` — utility CSS
- `style-dictionary` — token transformation
- `@storybook/react` — component playground
- `jest` + `@testing-library/react` — testing
- `semantic-release` — automated versioning

---

## Step 6: Set Up Documentation

Read `workflows/document-system.md` for Storybook setup and component doc templates.

---

## Step 7: Establish Governance

Read `references/governance.md` for contribution workflows, versioning, and quality gates.

---

## Deliverables Checklist

After completing this workflow, the user should have:

- [ ] Design system charter document
- [ ] Token JSON files with Style Dictionary config
- [ ] Scaffolded component library with atomic design structure
- [ ] First 5 components implemented with tests and stories
- [ ] Storybook running locally
- [ ] Package.json configured for tree-shaking and publishing
- [ ] Contribution guide drafted
