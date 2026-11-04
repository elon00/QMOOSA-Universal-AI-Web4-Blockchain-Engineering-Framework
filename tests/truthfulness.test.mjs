import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const src = (name) => readFileSync(new URL('../src/' + name, import.meta.url), 'utf8');

// These tests assert only source-level anti-fabrication invariants.
// They do NOT verify transactions, signatures, contracts, or chain state.
test('catalog does not issue PASS or automatically award scorecard points', () => {
  const code = src('utils/testRunner.ts');
  assert.match(code, /status: 'NOT_RUN'/);
  assert.doesNotMatch(code, /status: 'PASS'|status: 'PASS' as/);
  assert.doesNotMatch(code, /earnedPoints:\s*item\.points/);
  assert.match(code, /earnedPoints: 0/);
});

test('UI cannot certify all categories or grant points on click', () => {
  const code = src('App.tsx');
  assert.doesNotMatch(code, /status: 'PASS'|earnedPoints:\s*item\.points|VERIFIED PASS/);
  assert.doesNotMatch(code, /confetti\s*\(/);
  assert.match(code, /evaluateFullScorecard\(previous\)/);
});

test('CodeQL catalog has no fabricated CLEAN rules or synthetic duration', () => {
  const code = src('utils/codeqlEngine.ts');
  assert.doesNotMatch(code, /status: 'CLEAN'|Math\.random\(/);
  assert.match(code, /status: 'NOT_RUN'/);
  assert.match(code, /rulesScanned: 0/);
  const ui = src('components/TestingCodeqlView.tsx');
  assert.doesNotMatch(ui, /CodeQL Scan Completed Cleanly|Exit Status: 0 OK/);
  assert.match(ui, /NOT_RUN/);
});

test('x402 browser cannot fabricate payment receipts or SETTLED', () => {
  const code = src('components/X402BazaarView.tsx');
  assert.doesNotMatch(code, /getRandomValues|Math\.random|proofId:|verified:\s*true|TX_SETTLED|SETTLED'/);
  assert.match(code, /setPaymentStatus\('BLOCKED'\)/);
  assert.match(code, /No payment was signed/);
});

test('launchpad cannot generate fake deployment hashes', () => {
  const code = src('components/TokenomicsLaunchpadView.tsx');
  assert.doesNotMatch(code, /getRandomValues|mockTx|mockAddr|setDeployStatus\('DEPLOYED'\)|Deployment Successful on/);
  assert.match(code, /setDeployStatus\('BLOCKED'\)/);
});

test('scorecard exports cannot assert VERIFIED 100/100', () => {
  const code = src('components/ScorecardView.tsx');
  assert.doesNotMatch(code, /MISSION COMPLETED SUCCESSFULLY|Earn 100\/100|verifiedScore:/);
  assert.match(code, /NOT_CERTIFIED/);
});
