# Token Architecture Reference

## Table of Contents
- Three-Tier Token System
- Token JSON Format
- Style Dictionary Configuration
- Platform Outputs
- Dark Mode / Theming

---

## Three-Tier Token System

```
Tier 1: Primitive Tokens (raw values)
├── blue-50: #eff6ff
├── blue-500: #3b82f6
└── blue-900: #1e3a8a

Tier 2: Semantic Tokens (contextual meaning)
├── color-primary: {blue-500}
├── color-background: {gray-50}
└── color-text: {gray-900}

Tier 3: Component Tokens (component-specific)
├── button-bg: {color-primary}
├── button-text: white
└── button-padding: {space-4}
```

**Why three tiers:**
- Tier 1 changes rarely (brand refresh)
- Tier 2 changes for themes (dark mode swaps semantic values)
- Tier 3 changes for component redesigns (without touching brand or theme)

---

## Token JSON Format

```json
{
  "color": {
    "primitive": {
      "blue": {
        "50": { "value": "#eff6ff" },
        "500": { "value": "#3b82f6" },
        "900": { "value": "#1e3a8a" }
      },
      "gray": {
        "50": { "value": "#f9fafb" },
        "500": { "value": "#6b7280" },
        "900": { "value": "#111827" }
      }
    },
    "semantic": {
      "primary": { "value": "{color.primitive.blue.500}" },
      "background": { "value": "#ffffff" },
      "surface": { "value": "{color.primitive.gray.50}" },
      "text": { "value": "{color.primitive.gray.900}" },
      "text-muted": { "value": "{color.primitive.gray.500}" },
      "border": { "value": "{color.primitive.gray.200}" },
      "error": { "value": "#ef4444" },
      "success": { "value": "#22c55e" },
      "warning": { "value": "#f59e0b" }
    }
  },
  "spacing": {
    "0": { "value": "0" },
    "1": { "value": "0.25rem" },
    "2": { "value": "0.5rem" },
    "3": { "value": "0.75rem" },
    "4": { "value": "1rem" },
    "6": { "value": "1.5rem" },
    "8": { "value": "2rem" },
    "12": { "value": "3rem" }
  },
  "typography": {
    "fontSize": {
      "xs": { "value": "0.75rem" },
      "sm": { "value": "0.875rem" },
      "base": { "value": "1rem" },
      "lg": { "value": "1.125rem" },
      "xl": { "value": "1.25rem" },
      "2xl": { "value": "1.5rem" }
    },
    "fontWeight": {
      "normal": { "value": "400" },
      "medium": { "value": "500" },
      "semibold": { "value": "600" },
      "bold": { "value": "700" }
    },
    "lineHeight": {
      "tight": { "value": "1.25" },
      "normal": { "value": "1.5" },
      "relaxed": { "value": "1.75" }
    }
  },
  "borderRadius": {
    "none": { "value": "0" },
    "sm": { "value": "0.125rem" },
    "md": { "value": "0.375rem" },
    "lg": { "value": "0.5rem" },
    "full": { "value": "9999px" }
  },
  "shadow": {
    "sm": { "value": "0 1px 2px 0 rgb(0 0 0 / 0.05)" },
    "md": { "value": "0 4px 6px -1px rgb(0 0 0 / 0.1)" },
    "lg": { "value": "0 10px 15px -3px rgb(0 0 0 / 0.1)" }
  }
}
```

---

## Style Dictionary Configuration

```javascript
// build-tokens.js
const StyleDictionary = require('style-dictionary');

StyleDictionary.registerFormat({
  name: 'css/custom-properties',
  formatter: function({ dictionary }) {
    return `:root {\n${dictionary.allTokens
      .map(token => `  --${token.name}: ${token.value};`)
      .join('\n')}\n}`;
  }
});

module.exports = {
  source: ['tokens/**/*.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'dist/tokens/',
      files: [{
        destination: 'variables.css',
        format: 'css/variables'
      }]
    },
    js: {
      transformGroup: 'js',
      buildPath: 'dist/tokens/',
      files: [{
        destination: 'tokens.js',
        format: 'javascript/es6'
      }]
    },
    ts: {
      transformGroup: 'js',
      buildPath: 'dist/tokens/',
      files: [{
        destination: 'tokens.d.ts',
        format: 'typescript/es6-declarations'
      }]
    },
    ios: {
      transformGroup: 'ios-swift',
      buildPath: 'dist/tokens/ios/',
      files: [{
        destination: 'StyleDictionary.swift',
        format: 'ios-swift/class.swift',
        className: 'StyleDictionary'
      }]
    },
    android: {
      transformGroup: 'android',
      buildPath: 'dist/tokens/android/',
      files: [{
        destination: 'colors.xml',
        format: 'android/colors'
      }]
    }
  }
};
```

**Build command:**
```bash
npx style-dictionary build --config build-tokens.js
```

---

## Platform Outputs

**CSS (generated):**
```css
:root {
  --color-primary: #3b82f6;
  --color-background: #ffffff;
  --color-text: #111827;
  --spacing-4: 1rem;
  --font-size-base: 1rem;
  --border-radius-md: 0.375rem;
}
```

**TypeScript (generated):**
```typescript
export const ColorPrimary = '#3b82f6';
export const ColorBackground = '#ffffff';
export const Spacing4 = '1rem';
```

**iOS Swift (generated):**
```swift
public class StyleDictionary {
  public static let colorPrimary = UIColor(red: 0.235, green: 0.510, blue: 0.965, alpha: 1)
}
```

---

## Dark Mode / Theming

**Approach: Swap semantic tokens, keep primitives unchanged.**

```json
// tokens/themes/dark.json
{
  "color": {
    "semantic": {
      "background": { "value": "{color.primitive.gray.900}" },
      "surface": { "value": "{color.primitive.gray.800}" },
      "text": { "value": "{color.primitive.gray.50}" },
      "text-muted": { "value": "{color.primitive.gray.400}" }
    }
  }
}
```

**CSS output for dark mode:**
```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-background: #111827;
    --color-surface: #1f2937;
    --color-text: #f9fafb;
    --color-text-muted: #9ca3af;
  }
}
```

Components that use `var(--color-background)` automatically adapt — no component code changes needed. This is why the three-tier system matters.
