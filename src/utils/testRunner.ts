import { TestExecutionResult, ScoreStatus, ScorecardCategory } from '../types';

// This is a command catalog, not a browser-side test engine.
// Never claim a PASS without the command's real process exit code and inspectable evidence.
export const TEST_SUITES_DEFINITION = [
  { id: 'smoke-01', suite: 'Smoke' as const, name: 'QuickNode Arbitrum RPC Health & Latency', command: 'npm run test:quicknode-rpc', durationMs: 0 },
  { id: 'smoke-02', suite: 'Smoke' as const, name: 'Conway Automaton Tick Determinism', command: 'npm run test:conway-tick', durationMs: 0 },
  { id: 'smoke-03', suite: 'Smoke' as const, name: 'PQC ML-KEM-768 Shared Secret Agreement', command: 'npm run test:pqc-ml-kem', durationMs: 0 },
  { id: 'smoke-04', suite: 'Smoke' as const, name: 'x402 Protocol Challenge Generation', command: 'npm run test:x402-smoke', durationMs: 0 },
  { id: 'regr-01', suite: 'Regression' as const, name: 'x402 Replay Attack Prevention', command: 'npm run test:x402-replay-prevention', durationMs: 0 },
  { id: 'regr-02', suite: 'Regression' as const, name: 'Governed Token Minting Emission Ceiling', command: 'forge test --match-test testFuzz_EmissionLimitExceeded', durationMs: 0 },
  { id: 'regr-03', suite: 'Regression' as const, name: 'Solidity Reentrancy Lock Check', command: 'forge test --match-contract ReentrancyAttackTest', durationMs: 0 },
  { id: 'sanity-01', suite: 'Sanity' as const, name: 'Arbitrum EIP-1559 Calldata Fee Arithmetic', command: 'npm run test:sanity-gas-math', durationMs: 0 },
  { id: 'sanity-02', suite: 'Sanity' as const, name: 'DID PKH Format & Checksum Verification', command: 'npm run test:sanity-did-format', durationMs: 0 },
  { id: 'codeql-01', suite: 'CodeQL' as const, name: 'CodeQL Static Application Security Testing (SAST)', command: 'codeql database analyze db --format=sarif-latest --output=codeql-results.sarif', durationMs: 0 },
  { id: 'gate-01', suite: 'RealityGate' as const, name: 'Reality Gate: Full Integration Verification', command: 'npm run mission:verify --strict --target arbitrum', durationMs: 0 }
];

export async function executeSingleTest(testId: string): Promise<TestExecutionResult> {
  const def = TEST_SUITES_DEFINITION.find(test => test.id === testId);
  if (!def) throw new Error(`Unknown test definition: ${testId}`);
  return {
    id: def.id,
    suite: def.suite,
    name: def.name,
    command: def.command,
    durationMs: 0,
    status: 'NOT_RUN',
    output: `NOT_RUN: This is a browser-only command catalog. No subprocess, CodeQL database, contract test, RPC request or deployment was executed. Run "${def.command}" in a controlled project environment and attach the real CI run, commit SHA, exit code and logs before granting PASS.`,
    timestamp: new Date().toISOString()
  };
}

// No proof ingestion or independently verified attestations exist in this UI.
// A click must never upgrade scorecard entries to PASS or award production points.
export function evaluateFullScorecard(categories: ScorecardCategory[]): ScorecardCategory[] {
  return categories.map(category => ({
    ...category,
    earnedPoints: 0,
    items: category.items.map(item => ({
      ...item,
      status: (item.status === 'NOT_APPLICABLE' ? 'NOT_APPLICABLE' : 'NOT_RUN') as ScoreStatus,
      earnedPoints: 0,
      evidence: 'NOT_VERIFIED: No signed CI evidence or on-chain receipt was checked by this browser UI.',
      lastRun: undefined
    }))
  }));
}
