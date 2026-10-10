/**
 * .storybook/theme.js — Branded Storybook theme
 *
 * Usage: Import this in .storybook/manager.js:
 *   import { addons } from '@storybook/manager-api';
 *   import theme from './theme';
 *   addons.setConfig({ theme });
 */

import { create } from '@storybook/theming/create';

export default create({
  base: 'light',

  // Brand
  brandTitle: 'Design System',       // Replace with your system name
  brandUrl: 'https://your-site.com', // Replace with your docs URL
  // brandImage: '/logo.svg',        // Optional: path to logo

  // UI colors
  colorPrimary: '#3b82f6',   // Matches your --color-primary token
  colorSecondary: '#2563eb',

  // Toolbar
  appBg: '#f9fafb',
  appContentBg: '#ffffff',
  appBorderColor: '#e5e7eb',
  appBorderRadius: 6,

  // Typography
  fontBase: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  fontCode: '"JetBrains Mono", "Fira Code", monospace',

  // Text
  textColor: '#111827',
  textInverseColor: '#ffffff',

  // Toolbar active color
  barTextColor: '#6b7280',
  barSelectedColor: '#3b82f6',
  barBg: '#ffffff',

  // Form
  inputBg: '#ffffff',
  inputBorder: '#e5e7eb',
  inputTextColor: '#111827',
  inputBorderRadius: 6,
});
