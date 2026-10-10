/**
 * Shared path resolution for the verification suites.
 *
 * WHY THIS EXISTS: every suite originally hardcoded absolute paths from the
 * machine they were written on (/home/claude/...). All six passed locally
 * and would have failed on the first CI run and for anyone who cloned the
 * repo — including a typecheck that silently resolved a *different*
 * TypeScript than the one package.json installs, so it reported a version
 * the project never depends on.
 *
 * Caught by a clean-room test, not by any of the suites themselves.
 * Everything here resolves relative to this file, so a checkout works from
 * anywhere.
 */
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';

/** verify/ — the directory this file lives in. */
export const VERIFY_DIR = dirname(fileURLToPath(import.meta.url));

/** Repo root — the parent of verify/. */
export const REPO_ROOT = resolve(VERIFY_DIR, '..');

/** Absolute path to a pattern file, e.g. patternPath('03-x/y.html'). */
export const patternPath = (rel) => resolve(REPO_ROOT, rel);

/** file:// URL for a pattern, for page.goto(). */
export const patternUrl = (rel) => 'file://' + patternPath(rel);

/** Somewhere under verify/ — reports, temp dirs, artifacts. */
export const verifyPath = (...parts) => join(VERIFY_DIR, ...parts);

/** Resolve a dependency inside verify/node_modules. */
export const depPath = (...parts) => join(VERIFY_DIR, 'node_modules', ...parts);

/** Category directories holding the patterns (excludes verify/, .github/). */
export const CATEGORY_PREFIXES = ['01-', '02-', '03-', '04-', '05-', '06-'];
