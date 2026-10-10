#!/usr/bin/env node
/**
 * a11y-check.js — Quick accessibility check for a React component
 *
 * Usage:
 *   node scripts/a11y-check.js Button
 *   node scripts/a11y-check.js SearchInput --verbose
 *
 * Validates:
 *   - Component file exists
 *   - Uses semantic HTML elements (not div for interactive)
 *   - Has ARIA attributes where needed
 *   - Has keyboard event handlers
 *   - Has forwardRef for ref forwarding
 *   - Has displayName for DevTools
 *
 * This is a static analysis check — run axe-core tests for runtime validation.
 */

const fs = require('fs');
const path = require('path');

const componentName = process.argv[2];
const verbose = process.argv.includes('--verbose');

if (!componentName) {
  console.error('Usage: node a11y-check.js <ComponentName> [--verbose]');
  process.exit(1);
}

// Search for component file
const searchPaths = [
  `${componentName}/${componentName}.tsx`,
  `primitives/${componentName}/${componentName}.tsx`,
  `components/${componentName}/${componentName}.tsx`,
  `patterns/${componentName}/${componentName}.tsx`,
  `src/${componentName}/${componentName}.tsx`,
  `src/components/${componentName}/${componentName}.tsx`,
];

let filePath = null;
for (const p of searchPaths) {
  if (fs.existsSync(p)) {
    filePath = p;
    break;
  }
}

if (!filePath) {
  console.error(`Component file not found. Searched:\n${searchPaths.map(p => `  ${p}`).join('\n')}`);
  process.exit(1);
}

const content = fs.readFileSync(filePath, 'utf-8');
const issues = [];
const passes = [];

// Check 1: forwardRef
if (content.includes('forwardRef')) {
  passes.push('Uses forwardRef for ref forwarding');
} else {
  issues.push('Missing forwardRef — consumers cannot attach refs');
}

// Check 2: displayName
if (content.includes('displayName')) {
  passes.push('Has displayName for React DevTools');
} else {
  issues.push('Missing displayName — component will show as Anonymous in DevTools');
}

// Check 3: Semantic elements
const hasButton = /<button[\s>]/.test(content);
const hasInput = /<input[\s>]/.test(content);
const hasLink = /<a[\s>]/.test(content);
const hasDiv = /<div[\s>]/.test(content);

if (content.includes('onClick') && !hasButton && !hasLink) {
  issues.push('Has onClick but no <button> or <a> — likely using <div> as interactive element');
} else if (hasButton || hasInput || hasLink) {
  passes.push('Uses semantic HTML elements');
}

// Check 4: ARIA attributes
const ariaPatterns = [
  /aria-label/,
  /aria-labelledby/,
  /aria-describedby/,
  /aria-expanded/,
  /aria-selected/,
  /aria-disabled/,
  /aria-busy/,
  /aria-live/,
  /role=/,
];

const ariaFound = ariaPatterns.filter(p => p.test(content));
if (ariaFound.length > 0) {
  passes.push(`Has ${ariaFound.length} ARIA attribute(s)`);
} else if (hasDiv && content.includes('onClick')) {
  issues.push('No ARIA attributes on interactive element');
}

// Check 5: Keyboard handlers
const keyboardPatterns = [
  /onKeyDown/,
  /onKeyUp/,
  /onKeyPress/,
  /handleKey/,
];
const hasKeyboard = keyboardPatterns.some(p => p.test(content));

if (hasKeyboard) {
  passes.push('Has keyboard event handlers');
} else if (hasButton) {
  passes.push('Uses <button> (keyboard support built-in)');
} else if (content.includes('onClick')) {
  issues.push('Has click handler but no keyboard handler — not keyboard accessible');
}

// Check 6: Disabled state
if (content.includes('disabled') || content.includes('aria-disabled')) {
  passes.push('Handles disabled state');
}

// Check 7: Loading state
if (content.includes('loading') || content.includes('aria-busy')) {
  passes.push('Handles loading state');
}

// Report
console.log(`\nAccessibility check: ${componentName}`);
console.log(`File: ${filePath}`);
console.log('─'.repeat(50));

if (passes.length > 0) {
  console.log('\nPassing:');
  passes.forEach(p => console.log(`  ✅ ${p}`));
}

if (issues.length > 0) {
  console.log('\nIssues:');
  issues.forEach(i => console.log(`  ❌ ${i}`));
}

if (issues.length === 0) {
  console.log('\n✅ No static accessibility issues found');
  console.log('   (Run axe-core tests for runtime validation)');
} else {
  console.log(`\n❌ ${issues.length} issue(s) found`);
}

process.exit(issues.length > 0 ? 1 : 0);
