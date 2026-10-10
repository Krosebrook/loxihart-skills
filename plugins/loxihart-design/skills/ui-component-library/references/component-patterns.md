# Component Patterns Reference

## Table of Contents
- CVA Component Anatomy
- Compound Components
- Headless Hooks
- Render Props

---

## CVA Component Anatomy

The standard pattern for all styled components using Tailwind + class-variance-authority:

```tsx
import { useState, useRef, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

// 1. Define variants
const componentVariants = cva(
  'base-styles rounded font-medium transition-colors',
  {
    variants: {
      size: {
        sm: 'text-sm px-2 py-1',
        md: 'text-base px-4 py-2',
        lg: 'text-lg px-6 py-3',
      },
      variant: {
        primary: 'bg-blue-600 text-white hover:bg-blue-700',
        secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
        ghost: 'bg-transparent hover:bg-gray-100',
      },
    },
    defaultVariants: { size: 'md', variant: 'primary' },
  }
);

// 2. Props interface extends HTML attributes + variants
interface Props
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof componentVariants> {
  loading?: boolean;
}

// 3. forwardRef for ref forwarding, spread rest props
export const Component = forwardRef<HTMLButtonElement, Props>(
  ({ className, size, variant, loading, children, ...props }, ref) => (
    <button
      ref={ref}
      className={componentVariants({ size, variant, className })}
      disabled={loading || props.disabled}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <Spinner /> : children}
    </button>
  )
);

Component.displayName = 'Component';
```

**Key patterns to replicate across all components:**
- `forwardRef` for ref forwarding
- CVA for variant management
- Extend native HTML attributes
- `className` escape hatch
- `...rest` spread
- `displayName` for DevTools

---

## Compound Components

Flexible composition using React Context:

```tsx
const TabsContext = createContext<{ active: string; setActive: (v: string) => void } | null>(null);

function Tabs({ defaultValue, children }: { defaultValue: string; children: React.ReactNode }) {
  const [active, setActive] = useState(defaultValue);
  return (
    <TabsContext.Provider value={{ active, setActive }}>
      <div>{children}</div>
    </TabsContext.Provider>
  );
}

Tabs.List = ({ children }: { children: React.ReactNode }) => (
  <div role="tablist" className="flex border-b">{children}</div>
);

Tabs.Trigger = ({ value, children }: { value: string; children: React.ReactNode }) => {
  const { active, setActive } = useContext(TabsContext)!;
  return (
    <button role="tab" aria-selected={active === value} onClick={() => setActive(value)}>
      {children}
    </button>
  );
};

Tabs.Content = ({ value, children }: { value: string; children: React.ReactNode }) => {
  const { active } = useContext(TabsContext)!;
  if (active !== value) return null;
  return <div role="tabpanel">{children}</div>;
};

// Usage — consumer controls composition
<Tabs defaultValue="tab1">
  <Tabs.List>
    <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
    <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="tab1">Content 1</Tabs.Content>
  <Tabs.Content value="tab2">Content 2</Tabs.Content>
</Tabs>
```

**When to use:** Components with multiple related sub-parts that consumers need to arrange flexibly (tabs, accordions, menus, dialogs).

---

## Headless Hooks

Encapsulate behavior without any styling:

```tsx
export function useDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (!triggerRef.current?.contains(e.target as Node) &&
          !contentRef.current?.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsOpen(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen]);

  return {
    isOpen, setIsOpen, triggerRef, contentRef,
    triggerProps: { onClick: () => setIsOpen(!isOpen), 'aria-expanded': isOpen, 'aria-haspopup': true as const },
    contentProps: { hidden: !isOpen },
  };
}
```

**When to use:** Reusable behavior that should work across different design systems. The consumer brings their own styles.

---

## Render Props

Flexible rendering with data injection:

```tsx
interface DataFetcherProps<T> {
  url: string;
  children: (state: { data: T | null; loading: boolean; error: Error | null }) => React.ReactNode;
}

function DataFetcher<T>({ url, children }: DataFetcherProps<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [url]);

  return <>{children({ data, loading, error })}</>;
}

// Usage — consumer controls rendering
<DataFetcher<User> url="/api/user">
  {({ data, loading, error }) => {
    if (loading) return <Spinner />;
    if (error) return <ErrorMessage error={error} />;
    return <UserProfile user={data!} />;
  }}
</DataFetcher>
```

**When to use:** Components that fetch/compute data and let consumers decide how to render it.
