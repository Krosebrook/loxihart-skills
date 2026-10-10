import type { Config } from 'tailwindcss';

/**
 * Abstrekkt Design System — tailwind.config.ts v1.0.0
 * All values mirror assets/tokens.json.
 * Do not add arbitrary values. Extend this config to add new tokens.
 */
const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './templates/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    // Override Tailwind defaults entirely — no defaults leak through
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#ffffff',
      black: '#1c1917',
      primary: {
        50: '#faf7f2',
        100: '#f5efe5',
        200: '#e8dccb',
        300: '#d6c4ad',
        400: '#c8a86a',
        500: '#a89150',
        600: '#8a7340',
        700: '#6d5a32',
        800: '#544428',
        900: '#3d3120',
      },
      neutral: {
        0: '#ffffff',
        50: '#fafaf9',
        100: '#f5f5f4',
        200: '#e7e5e4',
        300: '#d6d3d1',
        400: '#a8a29d',
        500: '#78716c',
        600: '#57534e',
        700: '#44403c',
        800: '#292524',
        900: '#1c1917',
      },
      success: {
        50: '#f0fdf4',
        400: '#4ade80',
        600: '#16a34a',
        700: '#15803d',
      },
      warning: {
        50: '#fffbeb',
        400: '#facc15',
        600: '#d97706',
        700: '#b45309',
      },
      error: {
        50: '#fef2f2',
        400: '#f87171',
        600: '#dc2626',
        700: '#b91c1c',
      },
      info: {
        50: '#f0f9ff',
        400: '#38bdf8',
        600: '#0284c7',
        700: '#0369a1',
      },
      surface: {
        background: '#ffffff',
        elevated: '#fafaf9',
        border: '#d6d3d1',
        'input-bg': '#ffffff',
        'disabled-bg': '#f5f5f4',
        muted: '#e7e5e4',
      },
    },
    fontFamily: {
      display: ["'Fraunces'", 'serif'],
      body: ["'Crimson Pro'", 'serif'],
      mono: ["'JetBrains Mono'", 'monospace'],
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
    },
    fontWeight: {
      body: '400',
      semi: '600',
      bold: '700',
    },
    lineHeight: {
      tight: '1.2',
      normal: '1.5',
      relaxed: '1.75',
    },
    letterSpacing: {
      tight: '-0.02em',
      normal: '0em',
      wide: '0.02em',
    },
    spacing: {
      0: '0px',
      1: '0.25rem',
      2: '0.5rem',
      3: '0.75rem',
      4: '1rem',
      6: '1.5rem',
      8: '2rem',
      12: '3rem',
      16: '4rem',
      20: '5rem',
      24: '6rem',
      32: '8rem',
    },
    borderRadius: {
      none: '0px',
      sm: '0.25rem',
      base: '0.375rem',
      md: '0.5rem',
      lg: '0.75rem',
      xl: '1rem',
      full: '9999px',
    },
    boxShadow: {
      none: 'none',
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    },
    transitionDuration: {
      instant: '0ms',
      fast: '150ms',
      normal: '200ms',
      slow: '300ms',
      slower: '500ms',
    },
    transitionTimingFunction: {
      linear: 'linear',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      animation: {
        fadeIn: 'fadeIn 200ms cubic-bezier(0, 0, 0.2, 1) forwards',
        fadeOut: 'fadeOut 200ms cubic-bezier(0.4, 0, 1, 1) forwards',
        slideIn: 'slideIn 300ms cubic-bezier(0, 0, 0.2, 1) forwards',
        slideOut: 'slideOut 300ms cubic-bezier(0.4, 0, 1, 1) forwards',
        scaleIn: 'scaleIn 300ms cubic-bezier(0, 0, 0.2, 1) forwards',
        scaleOut: 'scaleOut 200ms cubic-bezier(0.4, 0, 1, 1) forwards',
        pulse: 'pulse 1000ms linear infinite',
        spin: 'spin 600ms linear infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        fadeOut: { from: { opacity: '1' }, to: { opacity: '0' } },
        slideIn: {
          from: { transform: 'translateY(10px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        slideOut: {
          from: { transform: 'translateY(0)', opacity: '1' },
          to: { transform: 'translateY(10px)', opacity: '0' },
        },
        scaleIn: {
          from: { transform: 'scale(0.95)', opacity: '0' },
          to: { transform: 'scale(1)', opacity: '1' },
        },
        scaleOut: {
          from: { transform: 'scale(1)', opacity: '1' },
          to: { transform: 'scale(0.95)', opacity: '0' },
        },
        pulse: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
        spin: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
      },
      maxWidth: {
        container: '1320px',
      },
    },
  },
  plugins: [],
};

export default config;
