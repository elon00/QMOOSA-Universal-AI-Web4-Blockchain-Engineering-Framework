import { CodeQlRule } from '../types';

export const CODEQL_RULES: CodeQlRule[] = [
  {
    id: 'codeql/sol-reentrancy',
    name: 'Solidity Reentrancy (State Change After Call)',
    severity: 'CRITICAL',
    cwe: 'CWE-841: Improper Enforcement of Behavioral Workflow',
    description: 'Detects external calls made prior to internal state updates (Checks-Effects-Interactions pattern violation).',
    status: 'NOT_RUN',
    filePath: 'contracts/QmoosaToken.sol',
    line: 42
  },
  {
    id: 'codeql/sol-unbounded-mint',
    name: 'Unprotected Token Minting Authority',
    severity: 'CRITICAL',
    cwe: 'CWE-284: Improper Access Control',
    description: 'Flags public or external mint functions lacking access control modifiers (onlyOwner or AccessControl role).',
    status: 'NOT_RUN',
    filePath: 'contracts/GovernedTokenomics.sol',
    line: 28
  },
  {
    id: 'codeql/js-hardcoded-secret',
    name: 'Hardcoded Cryptographic Secret / Private Key',
    severity: 'HIGH',
    cwe: 'CWE-798: Use of Hard-coded Credentials',
    description: 'Scans for raw 0x 64-char hex strings or sensitive API credentials embedded directly into source code.',
    status: 'NOT_RUN',
    filePath: 'src/services/quickNodeClient.ts',
    line: 12
  },
  {
    id: 'codeql/crypto-insecure-algorithm',
    name: 'Use of Broken or Quantum-Vulnerable Primitives',
    severity: 'HIGH',
    cwe: 'CWE-327: Use of a Broken or Risky Cryptographic Algorithm',
    description: 'Flags usage of MD5, SHA-1, or pure non-hybrid classical algorithms without PQC fallback in post-2026 specs.',
    status: 'NOT_RUN',
    filePath: 'src/crypto/pqcHybrid.ts',
    line: 55
  },
  {
    id: 'codeql/sec-tainted-input',
    name: 'Unsanitized External User Input in Execution Path',
    severity: 'MEDIUM',
    cwe: 'CWE-20: Improper Input Validation',
    description: 'Verifies that RPC URLs, DID strings, and payment QR payload decodes are strictly validated before parsing.',
    status: 'NOT_RUN',
    filePath: 'src/protocols/x402Middleware.ts',
    line: 19
  },
  {
    id: 'codeql/proto-prototype-pollution',
    name: 'Prototype Pollution via Unbounded Object Merge',
    severity: 'MEDIUM',
    cwe: 'CWE-1321: Improperly Controlled Modification of Object Prototype',
    description: 'Ensures recursive configuration merge routines guard against __proto__ and constructor poisoning.',
    status: 'NOT_RUN',
    filePath: 'src/engine/conway.ts',
    line: 88
  }
];

// CodeQL is a server-side CLI/database analyzer. Browser UI cannot run it.
// The rule catalog must never be mistaken for actual SARIF results.
export function runCodeQlScan(_customRules?: CodeQlRule[]): {
  rulesScanned: number;
  passed: number;
  failed: number;
  violations: CodeQlRule[];
  scanDurationMs: number;
  commitHash: string;
  status: 'NOT_RUN';
} {
  return {
    rulesScanned: 0,
    passed: 0,
    failed: 0,
    violations: [],
    scanDurationMs: 0,
    commitHash: 'NOT_VERIFIED',
    status: 'NOT_RUN'
  };
}
