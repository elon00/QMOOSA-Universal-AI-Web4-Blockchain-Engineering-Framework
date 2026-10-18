export type ScoreStatus = 'PASS' | 'FAIL' | 'BLOCKED' | 'NOT_RUN' | 'NOT_APPLICABLE';

export interface ScorecardItem {
  id: string;
  name: string;
  points: number;
  earnedPoints: number;
  status: ScoreStatus;
  description: string;
  acceptanceCriteria: string;
  evidence: string;
  testCommand?: string;
  lastRun?: string;
}

export interface ScorecardCategory {
  id: string;
  title: string;
  maxPoints: number;
  earnedPoints: number;
  items: ScorecardItem[];
}

export interface Chapter {
  id: string;
  number: string;
  title: string;
  part: string;
  summary: string;
  keyConcepts: string[];
  codeSample: {
    language: string;
    filename: string;
    code: string;
  };
  acceptanceCriteria: string[];
  testGate: string;
  genuineLinks: { label: string; url: string; note?: string }[];
}

export interface GenuineLinkItem {
  name: string;
  category: 'Blockchain' | 'RPC' | 'Protocols' | 'AI & RSI' | 'Testing & Security' | 'Science & Math' | 'Wallets & Tools' | 'GitHub Repos';
  url: string;
  description: string;
  officialTag?: string;
}

export interface QuickNodeRpcConfig {
  network: 'Arbitrum One' | 'Arbitrum Sepolia' | 'Arbitrum Nova';
  endpoint: string;
  apiKey: string;
  wssEndpoint: string;
  status: 'CONNECTED' | 'DISCONNECTED' | 'FALLBACK' | 'RATE_LIMITED';
  latencyMs: number;
  blockNumber: number;
  gasPriceGwei: number;
  clientVersion: string;
}

export interface X402Resource {
  id: string;
  name: string;
  path: string;
  costTokens: number;
  description: string;
  provider: string;
  requiresPqcProof: boolean;
}

export interface X402PaymentProof {
  proofId: string;
  resourceId: string;
  payerAddress: string;
  amount: number;
  tokenSymbol: string;
  timestamp: number;
  txHash: string;
  verified: boolean;
  signature: string;
}

export interface CodeQlRule {
  id: string;
  name: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  cwe: string;
  description: string;
  status: 'CLEAN' | 'VIOLATION_FOUND' | 'IGNORED';
  filePath: string;
  line: number;
}

export interface TestExecutionResult {
  id: string;
  suite: 'CodeQL' | 'Smoke' | 'Regression' | 'Sanity' | 'RealityGate';
  name: string;
  command: string;
  durationMs: number;
  status: ScoreStatus;
  output: string;
  timestamp: string;
}

export interface AgentModel {
  id: string;
  name: string;
  provider: 'Gemini' | 'Anthropic' | 'OpenAI' | 'Antigravity' | 'Local-Ollama';
  contextWindow: string;
  capabilities: string[];
}

export interface AgentPersona {
  id: string;
  name: string;
  role: string;
  avatar: string;
  systemPrompt: string;
  suggestedPrompts: string[];
}

export interface RavenExperiment {
  id: string;
  cycle: number;
  stage: 'OBSERVE' | 'DIAGNOSE' | 'PROPOSE' | 'PATCH' | 'TEST' | 'REVIEW' | 'APPROVE' | 'DEPLOY' | 'MONITOR';
  hypothesis: string;
  proposedDiff: string;
  benchmarkBefore: number;
  benchmarkAfter: number;
  approvedByHuman: boolean;
  status: 'PENDING' | 'IN_SANDBOX' | 'ACCEPTED' | 'REJECTED';
}

export interface ProteinPrediction {
  id: string;
  name: string;
  sequence: string;
  length: number;
  meanPlddt: number;
  status: 'FOLDED' | 'CALCULATING' | 'READY';
  pdbHash: string;
  deepmindRef: string;
}

export interface AlphaTensorMatrix {
  id: string;
  dimension: string;
  classicalOps: number;
  alphaTensorOps: number;
  speedupPercentage: number;
  rankDecomposition: string;
}
