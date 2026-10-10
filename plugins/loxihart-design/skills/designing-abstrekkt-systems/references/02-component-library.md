# Reference 02 — Component Library

Full component specifications, state machines, prop interfaces, and ARIA requirements.
All implementations are in templates/*.tsx.

---

## Component Requirements (All components)

Every component MUST include:
1. TypeScript props interface — strict, no `any`
2. Variant system — enum-based, explicit states only
3. Complete state machine (all applicable states)
4. ARIA implementation
5. Token-only styling (no hardcoded values)
6. Production-ready usage example

---

## Button

**Template:** `templates/Button.tsx`

### Props Interface
```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'base' | 'lg';
  children: ReactNode;
  isLoading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
}
```

### State Machine
```
[DEFAULT]
  → hover (150ms ease-out): bg primary-500
  → active (instant): bg primary-600
  → focus (200ms): ring-2 ring-primary-400 ring-offset-2
  → loading: spinner visible, aria-busy=true, disabled interaction
  → disabled: neutral-200 bg, neutral-400 text, cursor-not-allowed
```

### ARIA
- `aria-busy`: true when loading
- `aria-disabled`: true when disabled or loading
- Keyboard: Tab focus, Enter/Space activate

### Token Binding
- Primary: `bg-primary-400` → `hover:bg-primary-500` → `active:bg-primary-600`
- Focus: `focus:ring-2 focus:ring-primary-400 focus:ring-offset-2`
- Disabled: `disabled:bg-neutral-200 disabled:text-neutral-400`
- Spacing: `px-4 py-2` (base), `px-3 py-2` (sm), `px-6 py-3` (lg)
- Radius: `rounded-base` → `rounded-md`

---

## Input

**Template:** `templates/Input.tsx`

### Props Interface
```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  error?: string;
  success?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  helperText?: string;
}
```

### State Machine
```
[DEFAULT] neutral-300 border, surface-input-bg
  → focus (200ms ease-out): primary-400 border, shadow-sm
  → filled (valid): primary-400 border maintained
  → error: error-600 border, error-50 bg
  → success: success-600 border, success-50 bg, checkmark icon
  → disabled: neutral-200 border, disabled-bg, cursor-not-allowed, no events
  → loading: disabled-bg, spinner, no interaction
```

### ARIA
- `htmlFor` → `id` association on all labels
- `aria-invalid`: true when error state
- `aria-describedby`: points to error element id
- Error message: `role="alert"`, `aria-live="polite"`
- Required: `required` attribute + visual `*`

### Token Binding
- Border default: `border-neutral-300`
- Border focused: `border-primary-400`
- Border error: `border-error-600`
- Background error: `bg-error-50`
- Border success: `border-success-600`
- Background success: `bg-success-50`

---

## Card

**Template:** `templates/Card.tsx`

### Props Interface
```typescript
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'elevated' | 'outlined' | 'flat';
  interactive?: boolean;
  children: ReactNode;
}
```

### State Machine
```
elevated: shadow-base → hover: shadow-md (200ms ease-out)
outlined: border-neutral-300 → hover: border-primary-400 (200ms)
flat: bg-neutral-50 → hover: bg-neutral-100 (200ms)
interactive=true: cursor-pointer, active:scale-98
```

### Token Binding
- Radius: `rounded-lg`
- Padding: `p-6`
- Elevated shadow: `shadow-base` → `hover:shadow-md`
- Outlined border: `border-2 border-neutral-300` → `hover:border-primary-400`

---

## Modal

**Template:** `templates/Modal.tsx`

### Props Interface
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  actions?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  isDismissible?: boolean;
}
```

### State Machine
```
[CLOSED] display:none, no portal render
  → open: portal mounted, backdrop fadeIn (200ms), content slideIn (300ms)
  → [OPEN] focus trapped inside modal
    → Escape key (if isDismissible): trigger onClose
    → backdrop click (if isDismissible): trigger onClose
    → close button click: trigger onClose
  → [CLOSING] content slideOut (200ms), backdrop fadeOut (200ms)
    → [CLOSED] portal unmounted
```

### ARIA
- `role="dialog"`
- `aria-modal="true"`
- `aria-labelledby="modal-title"` (title id)
- Focus trap: Tab cycles within modal
- Body overflow: hidden when open
- Escape: closes if `isDismissible`

### Behavior Rules
- `document.body.style.overflow = 'hidden'` when open
- Uses `createPortal(_, document.body)`
- Backdrop is `aria-hidden="true"`
- First focusable element receives focus on open

---

## Navbar

**Template:** `templates/Navbar.tsx`

### Props Interface
```typescript
interface NavItem {
  label: string;
  href: string;
  isActive?: boolean;
}

interface NavbarProps {
  logo: string;
  items: NavItem[];
  onNavClick?: (href: string) => void;
  userMenu?: ReactNode;
}
```

### State Machine
```
desktop (≥768px): horizontal nav inline
mobile (<768px): hamburger toggle
  → open: [aria-expanded=true], mobile menu visible
  → close: Escape or click outside, [aria-expanded=false]
active link: aria-current="page", primary-700 text, border-b-2 border-primary-400
hover link: neutral-900 text (150ms ease-out)
```

### ARIA
- `role="navigation"` on `<nav>`
- `aria-label="Main navigation"`
- `aria-current="page"` on active link
- `aria-expanded` on mobile toggle button
- `aria-label="Toggle navigation menu"` on hamburger

---

## Table

**Template:** `templates/Table.tsx`

### Type Interface
```typescript
interface TableColumn<T> {
  key: keyof T;
  header: string;
  sortable?: boolean;
  render?: (value: any, row: T) => ReactNode;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  onSort?: (key: keyof T, direction: 'asc' | 'desc') => void;
  isLoading?: boolean;
  selectedRows?: Set<number>;
  onSelectRow?: (index: number) => void;
}
```

### State Machine
```
[DEFAULT] unsorted
  → sort click: [SORTED_ASC] indicator shows, aria-sort="ascending"
  → sort click again: [SORTED_DESC] indicator reverses, aria-sort="descending"
row hover: bg-neutral-50 (150ms)
row selected: bg-primary-50, aria-selected="true"
loading: empty tbody with loading text, disabled all interaction
empty: colspan full-width empty state message
```

### ARIA
- `role="table"` (explicit)
- Column headers: `scope="col"`
- Sortable buttons: `aria-sort="ascending|descending|none"`
- Row selection: `aria-rowcount`, `aria-rowindex`
- Checkbox: `aria-label="Select row N"`

---

## Toast / ToastContainer

**Template:** `templates/Toast.tsx`

### Type Interface
```typescript
type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  type: ToastType;
  message: string;
  duration?: number; // ms, 0 = persistent
  onClose: () => void;
  id: string;
}

interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}
```

### State Machine
```
[HIDDEN]
  → trigger: [ENTERING] slideIn animation (300ms ease-out)
    → [VISIBLE]
      → auto-dismiss after `duration` ms (default 5000)
        OR manual close click
      → [EXITING] slideOut animation (200ms ease-in)
        → [HIDDEN]
```

### Type-to-Token Mapping
| Type | bg | border-l | text |
|---|---|---|---|
| success | `bg-success-50` | `border-success-400` | `text-success-700` |
| error | `bg-error-50` | `border-error-400` | `text-error-700` |
| warning | `bg-warning-50` | `border-warning-400` | `text-warning-700` |
| info | `bg-info-50` | `border-info-400` | `text-info-700` |

### ARIA
- `role="status"` on Toast
- `aria-live="polite"` on Toast
- `aria-label="${type}: ${message}"`
- Container: `aria-live="polite"` + `aria-atomic="false"`
- Close button: `aria-label="Dismiss notification"`
- Position: `fixed bottom-4 right-4 z-50`

---

## Missing Components (Extend from these patterns)

These use the same token/state/ARIA pattern established above:

### Badge
- Props: `{ variant: 'solid' | 'outlined'; color: 'primary' | 'success' | 'warning' | 'error' | 'neutral'; children: ReactNode }`
- Radius: `rounded-full`
- Size: `px-2 py-0.5 text-xs font-semi`

### Tooltip
- Props: `{ content: string; position: 'top' | 'bottom' | 'left' | 'right'; children: ReactNode }`
- State: hidden → visible (150ms fade-in on hover/focus)
- ARIA: `role="tooltip"`, `aria-describedby` on trigger

### Tabs
- Props: `{ tabs: { id: string; label: string; content: ReactNode }[]; defaultTab?: string }`
- State: active tab border-b-2 border-primary-400
- ARIA: `role="tablist"`, `role="tab"`, `aria-selected`, `role="tabpanel"`, `aria-controls`

### Select
- Props: `{ options: { value: string; label: string }[]; value: string; onChange: (v: string) => void; disabled?: boolean }`
- State: closed → open (200ms slideIn), focused item highlighted
- ARIA: `aria-expanded`, `aria-haspopup="listbox"`, `role="listbox"`, `aria-selected`
