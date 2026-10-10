# Build Component Workflow

## Purpose
Step-by-step process for designing, implementing, testing, and documenting a production-ready UI component.

---

## Step 1: Design the API

Before writing any code, define the component's props interface.

**Questions to answer:**
- What content does it accept? (`children`, `label`, `title`)
- What visual variants exist? (`variant`, `size`)
- What states does it have? (`disabled`, `loading`, `error`)
- What events does it emit? (`onClick`, `onChange`, `onClose`)
- What composition slots does it need? (`leftIcon`, `rightIcon`, `header`, `footer`)

**Use the component checklist from SKILL.md to validate the API before building.**

Read `references/component-patterns.md` for the CVA pattern, compound component pattern, or headless hook pattern — choose based on your component's needs:
- Standard component (Button, Input, Card) → CVA pattern
- Multi-part component (Tabs, Accordion, Menu) → Compound component pattern
- Behavior-only (dropdown logic, modal focus trap) → Headless hook pattern

---

## Step 2: Scaffold Files

Start from the template:
```bash
# Copy the component template
cp assets/component-template.tsx ComponentName/ComponentName.tsx
```

**Required files for every component:**
```
ComponentName/
├── ComponentName.tsx        (implementation)
├── ComponentName.test.tsx   (unit + a11y tests)
├── ComponentName.stories.tsx (Storybook)
└── index.ts                  (barrel export)
```

---

## Step 3: Implement

1. Fill in the CVA variants with actual Tailwind/CSS classes
2. Replace the generic HTML element with the correct semantic element
3. Add component-specific props
4. Implement keyboard handlers (Tab, Enter, Space, Escape, Arrow keys as needed)
5. Add ARIA attributes — read `references/component-catalog.md` for the correct ARIA pattern for your component type
6. Handle all states: default, hover, focus, active, disabled, loading, error

---

## Step 4: Write Tests

Read `references/testing-performance.md` for test templates. At minimum:

```bash
# Run the a11y check
node scripts/a11y-check.js ComponentName
```

**Required test cases:**
- [ ] Renders with default props
- [ ] Applies variant/size classes correctly
- [ ] Calls event handlers (onClick, onChange)
- [ ] Responds to keyboard input (Enter, Space, Escape)
- [ ] Disables interaction when `disabled` or `loading`
- [ ] Forwards ref correctly
- [ ] Spreads rest props
- [ ] Passes axe accessibility audit (zero violations)

---

## Step 5: Create Storybook Stories

One story per variant + key states:
- Default
- Each variant (primary, secondary, ghost, danger)
- Each size (sm, md, lg)
- Disabled state
- Loading state
- With composition (icons, custom content)
- Real-world usage example

---

## Step 6: Document

Every component needs:
- Brief description (what it does, when to use it)
- Usage examples (basic + advanced)
- Props table (name, type, default, description)
- Accessibility notes (keyboard, ARIA, screen reader behavior)
- Best practices (do/don't patterns)

---

## Step 7: Quality Check

Run through the quality gates from SKILL.md before shipping:

- [ ] TypeScript types exported
- [ ] Accessibility tested (keyboard + screen reader)
- [ ] Unit tests pass (over 80% coverage)
- [ ] Storybook story for every variant and state
- [ ] Performance profiled (no unnecessary re-renders)
- [ ] Dark mode verified
- [ ] Mobile responsive (tested 320px–1920px)
- [ ] No console errors or warnings
