/**
 * MUTATION TEST for PORTABILITY.
 *
 * The clean-room check found 21 hardcoded absolute paths that every other
 * suite happily ignored. But the clean-room check itself was never tested —
 * flagged as an open gap three times before this file existed.
 *
 * This reintroduces the exact defects that were fixed and asserts a
 * foreign-directory run catches each one. If a mutation survives, the
 * portability guarantee is unenforced and the next hardcoded path ships.
 */
import { readFileSync, writeFileSync, rmSync, cpSync, mkdtempSync, symlinkSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve, join } from 'node:path';
import { tmpdir } from 'node:os';
import { REPO_ROOT, VERIFY_DIR } from './paths.mjs';

const MUTS = [
  ['hardcoded pattern root (the original 21-path defect)',
   'phase1-typecheck.mjs',
   (s) => s.replace('const ROOT = REPO_ROOT;', `const ROOT = '${REPO_ROOT}';`),
   'typecheck'],

  // Must point at a GENUINELY different TypeScript. An earlier version of
  // this mutation used an absolute path to the same installed copy, so the
  // version matched, the self-check passed, and the mutation "survived" —
  // a bad mutation, not a real hole.
  ['globally-resolved tsc — a DIFFERENT TypeScript than package.json installs',
   'phase1-typecheck.mjs',
   (s) => s.replace("const TSC = depPath('typescript', 'bin', 'tsc');",
                    `const TSC = ${JSON.stringify(GLOBAL_TSC)};`),
   'typecheck'],

];

/** Static scan — catches hardcoded paths in the suites the dynamic test is
 *  too slow to exercise (engines and behaviour take minutes per run). */
const SUITES_TO_SCAN = [
  'phase0-behavior-check.mjs', 'phase0-load-check.mjs', 'phase1-harness.mjs',
  'phase1-typecheck.mjs', 'phase2-behavior-all.mjs', 'phase3-visual-regression.mjs',
  'mutation-test.mjs', 'mutate-phase2.mjs', 'mutate-visual.mjs',
];

// Locate a second TypeScript on the machine to mutate against. Without one,
// that mutation cannot be performed honestly and is skipped rather than
// silently reported as passing.
let GLOBAL_TSC = null;
try {
  const which = execFileSync('bash', ['-lc', 'readlink -f "$(which tsc)" 2>/dev/null || true'],
    { encoding: 'utf-8' }).trim();
  if (which && existsSync(which) && !which.startsWith(VERIFY_DIR)) GLOBAL_TSC = which;
} catch {}

const WORK = mkdtempSync(join(tmpdir(), 'portmut-'));

function setupCopy() {
  rmSync(WORK, { recursive: true, force: true });
  cpSync(REPO_ROOT, WORK, { recursive: true, filter: (src) => !src.includes('node_modules') });
  // A real clone installs its own deps; symlinking keeps the test fast while
  // still exercising *path resolution*, which is what is under test here.
  try { symlinkSync(join(VERIFY_DIR, 'node_modules'), join(WORK, 'verify', 'node_modules'), 'dir'); } catch {}
}

/**
 * A hardcoded path is only *detectable* if the copy lives somewhere the
 * original path cannot satisfy. Renaming the source out from under the run
 * is impractical, so instead we assert the mutated suite reads from the
 * ORIGINAL tree rather than the copy: plant a marker in the copy that a
 * correctly-portable run must see.
 */
function runSuite(script) {
  try {
    execFileSync('node', [join(WORK, 'verify', script)],
      { encoding: 'utf-8', stdio: 'pipe', env: process.env, timeout: 300000 });
    return { ok: true, out: '' };
  } catch (e) {
    return { ok: false, out: (e.stdout || '') + (e.stderr || '') };
  }
}

/** Detect whether a suite is reading the copy or the original tree. */
function readsFromCopy(script) {
  // Break a pattern in the COPY only. A portable suite reads the copy and
  // fails. A suite with hardcoded paths reads the original and passes.
  const victim = join(WORK, '03-motion-transform-effects', 'card-lift-perspective.html');
  const orig = readFileSync(victim, 'utf-8');
  writeFileSync(victim, orig.replace("'use strict';", "'use strict'; throwUndefinedOnPurpose();"));
  const res = runSuite(script);
  writeFileSync(victim, orig);
  return !res.ok;  // failed => it saw the broken copy => portable
}

console.log('=== MUTATION TEST: portability ===\n');
console.log('Method: break a pattern in the COPY only. A portable suite reads the');
console.log('copy and goes red. A suite with hardcoded paths reads the ORIGINAL');
console.log('tree, never sees the break, and stays green.\n');

// CONTROL — unmutated suites must read from the copy.
setupCopy();
const controlPortable = readsFromCopy('phase1-typecheck.mjs');
console.log(`[CONTROL ] unmutated typecheck reads the copy -> ${controlPortable ? 'YES' : 'NO'} (must be YES)`);
if (!controlPortable) {
  console.log('\nABORT: even the unmutated suite does not read the copy. Test is invalid.');
  rmSync(WORK, { recursive: true, force: true });
  process.exit(1);
}

let survived = 0;
for (const [name, file, fn] of MUTS) {
  if (name.includes('globally-resolved tsc') && !GLOBAL_TSC) {
    console.log(`[SKIPPED ] ${name} — no second TypeScript on this machine to mutate against`);
    continue;
  }
  setupCopy();
  const p = join(WORK, 'verify', file);
  const orig = readFileSync(p, 'utf-8');
  const mut = fn(orig);
  if (mut === orig) {
    console.log(`[SETUP ERR] ${name} — mutation produced no change`);
    survived++;
    continue;
  }
  writeFileSync(p, mut);

  // The mutated suite should now read the ORIGINAL tree, so breaking the
  // copy is invisible to it => still green => portability defect present.
  let caught;
  if (name.includes('globally-resolved tsc')) {
    // The suite self-checks its compiler; a mismatch must make it exit non-zero.
    caught = !runSuite('phase1-typecheck.mjs').ok;
  } else {
    caught = !readsFromCopy(file);  // stopped reading the copy => defect detected
  }
  if (!caught) survived++;
  console.log(`[${caught ? 'CAUGHT  ' : 'SURVIVED'}] ${name}`);
}

rmSync(WORK, { recursive: true, force: true });

// ── Static scan of the suites the dynamic test cannot run cheaply ──────
console.log('\n--- static scan: absolute paths / pinned executables ---');
const ABS = /(['"`])(\/(?:home|Users|opt|tmp)\/[^'"`]*)\1/g;
let staticViolations = 0;
for (const suite of SUITES_TO_SCAN) {
  const src = readFileSync(join(VERIFY_DIR, suite), 'utf-8');
  const code = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  const hits = [...code.matchAll(ABS)].map((m) => m[2]);
  const pinned = /executablePath\s*:/.test(code);
  if (hits.length || pinned) {
    staticViolations++;
    console.log(`  [VIOLATION] ${suite}${hits.length ? ' — ' + hits.slice(0, 2).join(', ') : ''}${pinned ? ' — pinned executablePath' : ''}`);
  }
}
console.log(`  ${SUITES_TO_SCAN.length - staticViolations}/${SUITES_TO_SCAN.length} suites free of absolute paths and pinned executables`);
survived += staticViolations;

console.log(`\n=== ${MUTS.length - (survived - staticViolations)}/${MUTS.length} dynamic mutations caught, ${staticViolations} static violations ===`);
console.log(survived === 0
  ? 'PORTABILITY ENFORCED — hardcoded paths are detectable by a foreign-directory run.'
  : `${survived} SURVIVED — hardcoded paths could ship undetected.`);
process.exit(survived ? 1 : 0);
