/**
 * Mutation test for the NEW phase-2 behavioural suite.
 * 171/171 on first run is exactly when you should check the tests can fail.
 * Break the thing each test claims to verify; the test MUST go red.
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, symlinkSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve, join } from 'node:path';
import { REPO_ROOT, VERIFY_DIR } from './paths.mjs';
import { tmpdir } from 'node:os';
import { mkdtempSync } from 'node:fs';

const SRC = REPO_ROOT;
// Work dir lives OUTSIDE the repo: verify/ is now a subdirectory of
// REPO_ROOT, so copying the repo into verify/.p2mut recurses into itself.
const WORK = mkdtempSync(join(tmpdir(), 'p2mut-'));

const MUTS = [
  ['ghost-trail pool made unbounded',
   '03-motion-transform-effects/ghost-trail-duplicate.html',
   (s)=>s.replace('const TRAIL_LENGTH = 8;','const TRAIL_LENGTH = 40;')],
  ['staggered-card delay cap removed',
   '03-motion-transform-effects/staggered-card-entry.html',
   (s)=>s.replace('Math.min(i, MAX_STAGGER_ITEMS)','i')],
  ['typing-effect gains aria-live (announces every keystroke)',
   '05-visual-enhancement-decorative/typing-effect-reset.html',
   (s)=>s.replace('role="img" aria-label=""','role="img" aria-live="polite" aria-label=""')],
  ['hotspot popover no longer closes on Escape',
   '04-navigation-wayfinding/image-hotspot-pulse.html',
   (s)=>s.replace("if (e.key === 'Escape' && popover.classList.contains('open')) closePopover();","/* escape disabled */")],
  ['card-lift focus affordance removed (hover-only)',
   '03-motion-transform-effects/card-lift-perspective.html',
   (s)=>s.replace('.lift-card:hover, .lift-card:focus-visible {','.lift-card:hover {')],
  ['glitch cooldown removed (allows flash train)',
   '06-theming-display-mode-elevated-risk/image-glitch-flicker.html',
   (s)=>s.replace('setTimeout(() => { triggerBtn.disabled = false; }, BURST_MS + COOLDOWN_MS);','triggerBtn.disabled = false;')],
  ['icon buttons lose their accessible names',
   '03-motion-transform-effects/staggered-icon-pop.html',
   (s)=>s.replace("btn.setAttribute('aria-label', label);","")],
];

function runSuiteAgainst(workDir) {
  const suite = readFileSync('phase2-behavior-all.mjs','utf-8')
    .replace("const P = patternUrl;", `const P = (p) => 'file://' + resolve('${workDir}', p);`)
    .replace("[['chromium', chromium], ['firefox', firefox], ['webkit', webkit]]", "[['chromium', chromium]]");
  const runner = join(workDir, 'verify', '.p2run.mjs');
  writeFileSync(runner, suite);
  try { execFileSync('node',[runner],{encoding:'utf-8',stdio:'pipe',env:process.env}); return true; }
  catch { return false; }
}

// CONTROL FIRST. If an unmutated copy does not pass, every subsequent
// "CAUGHT" is meaningless — the copy is broken, not the mutation detected.
rmSync(WORK,{recursive:true,force:true});
cpSync(SRC, WORK, {recursive:true, filter:(src)=>!src.includes('node_modules')});
// the copy needs the installed deps to run at all
try { symlinkSync(join(VERIFY_DIR,'node_modules'), join(WORK,'verify','node_modules'), 'dir'); } catch {}
const controlPassed = runSuiteAgainst(WORK);
console.log(`[CONTROL ] unmutated copy -> ${controlPassed ? 'PASS' : 'FAIL'} (must be PASS)`);
if (!controlPassed) {
  console.log('\nABORT: the unmutated copy does not pass, so mutation results are meaningless.');
  console.log('Usually means the copied tree cannot resolve its dependencies.');
  rmSync(WORK,{recursive:true,force:true});
  process.exit(1);
}

let survived = 0;
for (const [name, rel, fn] of MUTS) {
  rmSync(WORK,{recursive:true,force:true});
  cpSync(SRC, WORK, {recursive:true, filter:(src)=>!src.includes('node_modules')});
  try { symlinkSync(join(VERIFY_DIR,'node_modules'), join(WORK,'verify','node_modules'), 'dir'); } catch {}
  const p = resolve(WORK, rel);
  const orig = readFileSync(p,'utf-8');
  const mut = fn(orig);
  if (mut === orig) { console.log(`[SETUP ERROR] ${name}`); survived++; continue; }
  writeFileSync(p, mut);

  const red = !runSuiteAgainst(WORK);
  if (!red) survived++;
  console.log(`[${red?'CAUGHT ':'SURVIVED'}] ${name}`);
}
rmSync(WORK,{recursive:true,force:true});
console.log(`\n=== ${MUTS.length-survived}/${MUTS.length} mutations caught ===`);
console.log(survived===0 ? 'PHASE-2 SUITE VALIDATED — the tests can actually fail.'
                         : `${survived} MUTATION(S) SURVIVED — those tests assert nothing useful.`);
process.exit(survived?1:0);
