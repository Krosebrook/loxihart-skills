/**
 * MUTATION TEST for the visual regression suite.
 *
 * A baseline diff that never goes red is just 32 PNGs on disk. This injects
 * visual changes of decreasing obviousness and asserts each one is caught,
 * then asserts an unmutated copy still passes.
 *
 * The subtle cases matter most: a 1px border shift or a slightly-off colour
 * is exactly the regression a human reviewer misses and a diff should not.
 */
import { readFileSync, writeFileSync, rmSync, cpSync, mkdtempSync, symlinkSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve, join } from 'node:path';
import { tmpdir } from 'node:os';
import { REPO_ROOT, VERIFY_DIR } from './paths.mjs';

const WORK = mkdtempSync(join(tmpdir(), 'vismut-'));

const MUTS = [
  ['OBVIOUS  — button colour changed',
   '03-motion-transform-effects/rubber-band-squish.html',
   (s) => s.replace('background: #b45309;', 'background: #7c3aed;')],

  ['MODERATE — element shifted 12px',
   '04-navigation-wayfinding/underline-growth-track.html',
   (s) => s.replace('nav { display: flex; gap: 2rem; }', 'nav { display: flex; gap: 2rem; margin-left: 12px; }')],

  ['SUBTLE   — 1px border width change',
   '05-visual-enhancement-decorative/glow-perimeter-trail.html',
   (s) => s.replace('inset: -2px;', 'inset: -3px;')],

  ['SUBTLE   — text colour shifted one shade',
   // Replaces an earlier font-weight mutation that produced a 0px diff:
   // system-ui has no 900 weight, so it rendered identically. A mutation
   // that does not change the render tests nothing.
   '03-motion-transform-effects/card-lift-perspective.html',
   (s) => s.replace('color: #475569;', 'color: #5a6b82;')],

  ['REGRESSION — reduced-motion handling removed',
   // Baselines are captured under reduced motion with animations NOT
   // force-paused, so deleting this block lets the shimmer animate and the
   // render diverges. This is the property that makes the baselines double
   // as an accessibility regression test — and it only works because the
   // harness stopped suppressing animation itself.
   '01-loading-progress-feedback/skeleton-screen-shimmer.html',
   (s) => s.replace('@media (prefers-reduced-motion: reduce) {\n    .skel::after { animation: none; display: none; }\n  }', '')],
];

function setupCopy() {
  rmSync(WORK, { recursive: true, force: true });
  cpSync(REPO_ROOT, WORK, { recursive: true, filter: (src) => !src.includes('node_modules') });
  try { symlinkSync(join(VERIFY_DIR, 'node_modules'), join(WORK, 'verify', 'node_modules'), 'dir'); } catch {}
}

function runVisualCheck() {
  try {
    execFileSync('node', [join(WORK, 'verify', 'phase3-visual-regression.mjs')],
      { encoding: 'utf-8', stdio: 'pipe', env: process.env });
    return true;   // green
  } catch { return false; }  // red
}

console.log('=== MUTATION TEST: visual regression suite ===\n');

// CONTROL FIRST — an unmutated copy must pass, or every "CAUGHT" below is
// just the copy being broken rather than the diff working.
setupCopy();
const control = runVisualCheck();
console.log(`[CONTROL ] unmutated copy -> ${control ? 'PASS' : 'FAIL'} (must be PASS)`);
if (!control) {
  console.log('\nABORT: unmutated copy fails, so mutation results are meaningless.');
  rmSync(WORK, { recursive: true, force: true });
  process.exit(1);
}

let survived = 0;
for (const [name, rel, fn] of MUTS) {
  setupCopy();
  const p = resolve(WORK, rel);
  const orig = readFileSync(p, 'utf-8');
  const mut = fn(orig);
  if (mut === orig) {
    console.log(`[SETUP ERR] ${name} — mutation produced no change`);
    survived++;
    continue;
  }
  writeFileSync(p, mut);
  const red = !runVisualCheck();
  if (!red) survived++;
  console.log(`[${red ? 'CAUGHT  ' : 'SURVIVED'}] ${name}`);
}

rmSync(WORK, { recursive: true, force: true });
console.log(`\n=== ${MUTS.length - survived}/${MUTS.length} visual mutations caught ===`);
console.log(survived === 0
  ? 'VISUAL SUITE VALIDATED — baseline diffing detects real changes, including subtle ones.'
  : `${survived} SURVIVED — the diff tolerance is too loose or the baselines are stale.`);
process.exit(survived ? 1 : 0);
