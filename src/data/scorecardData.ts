import { ScorecardCategory } from '../types';

export const INITIAL_SCORECARD_CATEGORIES: ScorecardCategory[] = [
  {
    id: 'cat-01',
    title: 'Architecture & Baseline Audit',
    maxPoints: 8,
    earnedPoints: 0,
    items: [
      {
        id: 'item-01-1',
        name: 'Target Repository Discovery & SBOM Integrity',
        points: 4,
        earnedPoints: 0,
        status: 'NOT_RUN',
        description: 'Verify package dependencies, directory layout, lockfile integrity, and target repository identity (github.com/elon00/qmoosa-web4-arbitrum).',
        acceptanceCriteria: 'All 15 pinned dependencies resolved, valid package.json with zero unpinned wildcards, SBOM generated.',
        evidence: 'Awaiting execution of baseline repository audit...',
        testCommand: 'npm run audit:baseline'
      },
      {
        id: 'item-01-2',
        name: 'Baseline Security Assessment & Inventory Matrix',
        points: 4,
        earnedPoints: 0,
        status: 'NOT_RUN',
        description: 'Audit baseline vulnerabilities, check for exposed private credentials, and formulate integration matrix.',
        acceptanceCriteria: 'Zero critical vulnerabilities in base packages, reports/BASELINE_AUDIT.md populated.',
        evidence: 'Awaiting static vulnerability inventory scan...',
        testCommand: 'npm run audit:inventory'
      }
    ]
  },
  {
    id: 'cat-02',
    title: 'Blockchain & QuickNode RPC',
    maxPoints: 10,
    earnedPoints: 0,
    items: [
      {
        id: 'item-02-1',
        name: 'Arbitrum Nitro Architecture & Chain Adapter',
        points: 5,
        earnedPoints: 0,
        status: 'NOT_RUN',
        description: 'Configure and test multi-chain adapter for Arbitrum One (42161) and Arbitrum Sepolia (421614) with EIP-1559 gas tuning.',
        acceptanceCriteria: 'Chain ID matching, retryable ticket handler initialized, low gas L2 calldata calculation verified.',
        evidence: 'Awaiting Arbitrum chain adapter verification...',
        testCommand: 'npm run test:arbitrum-adapter'
      },
      {
        id: 'item-02-2',
        name: 'QuickNode RPC Streaming & Failover Circuit Breaker',
        points: 5,
        earnedPoints: 0,
        status: 'NOT_RUN',
        description: 'Verify QuickNode JSON-RPC endpoint connectivity, round-trip latency (<150ms), and automated failover switch.',
        acceptanceCriteria: 'Valid eth_blockNumber response, latency under 200ms threshold, fallback triggers on simulated 429.',
        evidence: 'Awaiting QuickNode RPC health check...',
        testCommand: 'npm run test:quicknode-rpc'
      }
    ]
  },
  {
    id: 'cat-03',
    title: 'x402 Bazaar & API Payments',
    maxPoints: 8,
    earnedPoints: 0,
    items: [
      {
        id: 'item-03-1',
        name: 'HTTP 402 Protocol & Payment Challenge Generator',
        points: 4,
        earnedPoints: 0,
        status: 'NOT_RUN',
        description: 'Implement RFC HTTP 402 Payment Required middleware with standardized challenge headers and pricing parameters.',
        acceptanceCriteria: 'Returns HTTP 402 with X-402-Payment-Required challenge, valid amount and token specifications.',
        evidence: 'Awaiting x402 header negotiation test...',
        testCommand: 'npm run test:x402-protocol'
      },
      {
        id: 'item-03-2',
        name: 'Bazaar Service Discovery & Proof Verification',
        points: 4,
        earnedPoints: 0,
        status: 'NOT_RUN',
        description: 'Index microservices on Bazaar discovery registry, verify cryptographic payment proofs, and prevent replay attacks.',
        acceptanceCriteria: 'Agent services discoverable via Bazaar metadata, payment proofs cryptographically validated.',
        evidence: 'Awaiting Bazaar registry verification...',
        testCommand: 'npm run test:bazaar-discovery'
      }
    ]
  },
  {
    id: 'cat-04',
    title: 'Conway Automaton Engine & Web4',
    maxPoints: 6,
    earnedPoints: 0,
    items: [
      {
        id: 'item-04-1',
        name: 'Conway B3/S23 Deterministic Life Engine',
        points: 3,
        earnedPoints: 0,
        status: 'NOT_RUN',
        description: 'Implement deterministic Conway Game of Life evolution with state hashing and canonical oscillator tests (Pulsar/Glider).',
        acceptanceCriteria: 'Hash matching across 100 generations, Gosper gun and Glider patterns oscillate with exact period.',
        evidence: 'Awaiting Conway determinism test run...',
        testCommand: 'npm run test:conway-engine'
      },
      {
        id: 'item-04-2',
        name: 'Web 4.0 Decentralized Identity & API Scope Keys',
        points: 3,
        earnedPoints: 0,
        status: 'NOT_RUN',
        description: 'Issue and verify Arbitrum DIDs (did:pkh:eip155:42161) and time-bound cryptographically scoped API keys.',
        acceptanceCriteria: 'Valid W3C DID format, verifiable presentation verification, API key rotation enforcement.',
        evidence: 'Awaiting Web4 DID resolution test...',
        testCommand: 'npm run test:web4-identity'
      }
    ]
  },
  {
    id: 'cat-05',
    title: 'Post-Quantum Cryptography & Security',
    maxPoints: 12,
    earnedPoints: 0,
    items: [
      {
        id: 'item-05-1',
        name: 'NIST ML-KEM-768 (Kyber) Lattice Key Encapsulation',
        points: 6,
        earnedPoints: 0,
        status: 'NOT_RUN',
        description: 'Execute NIST FIPS 203 ML-KEM key generation, encapsulation, and decapsulation with known-answer test vectors.',
        acceptanceCriteria: 'ML-KEM-768 shared secret matches across both parties, resistance to quantum Shor factorization.',
        evidence: 'Awaiting ML-KEM-768 vector validation...',
        testCommand: 'npm run test:pqc-ml-kem'
      },
      {
        id: 'item-05-2',
        name: 'NIST ML-DSA-65 (Dilithium) & Hybrid Arbitrum Signatures',
        points: 6,
        earnedPoints: 0,
        status: 'NOT_RUN',
        description: 'Verify ML-DSA-65 digital signatures combined with EVM ECDSA secp256k1 for quantum-resistant layer-2 transactions.',
        acceptanceCriteria: 'Hybrid signature passes dual verification; rejects tampered payloads and quantum impersonation.',
        evidence: 'Awaiting ML-DSA-65 hybrid signature test...',
        testCommand: 'npm run test:pqc-hybrid-sig'
      }
    ]
  },
  {
    id: 'cat-06',
    title: 'Raven RSI & REA Reverse Engineering',
    maxPoints: 10,
    earnedPoints: 0,
    items: [
      {
        id: 'item-06-1',
        name: 'EverMind-AI/Raven 9-Stage Governed Recursive Loop',
        points: 5,
        earnedPoints: 0,
        status: 'NOT_RUN',
        description: 'Execute OBSERVE -> DIAGNOSE -> PROPOSE -> PATCH -> TEST -> REVIEW -> APPROVE -> DEPLOY -> MONITOR with human signoff gate.',
        acceptanceCriteria: 'Raven loop runs in sandbox, benchmark delta recorded, unauthorized self-modification blocked.',
        evidence: 'Awaiting Raven RSI cycle evaluation...',
        testCommand: 'npm run test:raven-loop'
      },
      {
        id: 'item-06-2',
        name: 'morluto/rea Binary, AST & Contract Decompilation',
        points: 5,
        earnedPoints: 0,
        status: 'NOT_RUN',
        description: 'Perform static binary and EVM bytecode reverse-engineering, interface reconstruction, and vulnerability identification.',
        acceptanceCriteria: 'REA decompiler outputs function selectors, AST reconstructed with zero syntax corruption.',
        evidence: 'Awaiting REA bytecode audit run...',
        testCommand: 'npm run test:rea-analysis'
      }
    ]
  },
  {
    id: 'cat-07',
    title: 'Multimodel AI Agentics & Chatbots',
    maxPoints: 8,
    earnedPoints: 0,
    items: [
      {
        id: 'item-07-1',
        name: 'Specialized Engineering Agent Personas & Sandboxing',
        points: 4,
        earnedPoints: 0,
        status: 'NOT_RUN',
        description: 'Orchestrate specialized personas (Architecture, CodeQL, REA, Raven, Smart Contracts, SRE) with isolated context.',
        acceptanceCriteria: 'All 6 agent personas respond with domain-specific tool access and bounded capability policies.',
        evidence: 'Awaiting multi-agent orchestration test...',
        testCommand: 'npm run test:agent-personas'
      },
      {
        id: 'item-07-2',
        name: 'Secret Redaction Engine & Budget Quota Guard',
        points: 4,
        earnedPoints: 0,
        status: 'NOT_RUN',
        description: 'Enforce real-time regex sanitization masking private keys, QuickNode tokens, and API credentials from AI chat contexts.',
        acceptanceCriteria: '100% masking of 0x private keys and Bearer tokens; token budget throttling operational.',
        evidence: 'Awaiting secret redaction regex test...',
        testCommand: 'npm run test:secret-redaction'
      }
    ]
  },
  {
    id: 'cat-08',
    title: 'Tokenomics & Launchpad (Arbitrum)',
    maxPoints: 8,
    earnedPoints: 0,
    items: [
      {
        id: 'item-08-1',
        name: 'Governed Unlimited-Mint Strategy & Emission Limiter',
        points: 4,
        earnedPoints: 0,
        status: 'NOT_RUN',
        description: 'Verify governed issuance formula M(t) = min(R(t), annual_emission_limit(t)) with emergency circuit breaker.',
        acceptanceCriteria: 'Inflation bounded by governance cap, circuit breaker halts minting immediately on trigger.',
        evidence: 'Awaiting tokenomics emission rate simulation...',
        testCommand: 'npm run test:tokenomics-math'
      },
      {
        id: 'item-08-2',
        name: 'Arbitrum ERC-20 Launchpad & Bytecode Simulation',
        points: 4,
        earnedPoints: 0,
        status: 'NOT_RUN',
        description: 'Generate production-ready Arbitrum ERC-20 contract bytecode with treasury split, simulated deploy gas, and Arbiscan links.',
        acceptanceCriteria: 'Bytecode compiled, simulated deploy transaction executes on Sepolia fork with <0.005 ETH fee.',
        evidence: 'Awaiting Launchpad contract compilation test...',
        testCommand: 'npm run test:launchpad-bytecode'
      }
    ]
  },
  {
    id: 'cat-09',
    title: 'Multiwallet & Dynamic QR Payments',
    maxPoints: 6,
    earnedPoints: 0,
    items: [
      {
        id: 'item-09-1',
        name: 'Multi-Provider Web3 Wallet Connector',
        points: 3,
        earnedPoints: 0,
        status: 'NOT_RUN',
        description: 'Connect and synchronize state with MetaMask, WalletConnect, Coinbase, and injected Arbitrum providers.',
        acceptanceCriteria: 'Address resolution, chain switching to Arbitrum One/Sepolia, zero private key/seed phrase prompts.',
        evidence: 'Awaiting wallet adapter state machine test...',
        testCommand: 'npm run test:wallet-connector'
      },
      {
        id: 'item-09-2',
        name: 'EIP-681 Arbitrum Payment QR Code Engine',
        points: 3,
        earnedPoints: 0,
        status: 'NOT_RUN',
        description: 'Generate cryptographic QR codes encoding EIP-681 Arbitrum payment URIs with target address, token symbol, and wei value.',
        acceptanceCriteria: 'QR code validates against EIP-681 parser with chainID 42161 and checksum address.',
        evidence: 'Awaiting QR payment URI verification...',
        testCommand: 'npm run test:qr-payment-uri'
      }
    ]
  },
  {
    id: 'cat-10',
    title: 'CodeQL & Automated Testing Suite',
    maxPoints: 12,
    earnedPoints: 0,
    items: [
      {
        id: 'item-10-1',
        name: 'GitHub CodeQL Static Application Security Testing',
        points: 4,
        earnedPoints: 0,
        status: 'NOT_RUN',
        description: 'Execute CodeQL security queries detecting taint propagation, SQLi, XSS, broken crypto, and smart contract reentrancy.',
        acceptanceCriteria: 'Zero critical or high severity findings across smart contracts and TypeScript codebase.',
        evidence: 'Awaiting CodeQL security query execution...',
        testCommand: 'npm run test:codeql-audit'
      },
      {
        id: 'item-10-2',
        name: 'Automated Smoke & Sanity Test Suite',
        points: 4,
        earnedPoints: 0,
        status: 'NOT_RUN',
        description: 'Run automated smoke tests verifying runtime health and sanity tests validating mathematical/cryptographic invariants.',
        acceptanceCriteria: 'Smoke test latency under 500ms; sanity checks confirm deterministic math and state transitions.',
        evidence: 'Awaiting smoke and sanity execution...',
        testCommand: 'npm run test:smoke-sanity'
      },
      {
        id: 'item-10-3',
        name: 'Automated Regression Test Suite',
        points: 4,
        earnedPoints: 0,
        status: 'NOT_RUN',
        description: 'Run automated regression tests preventing replay of previous bugs, token balance overflows, and authorization bypasses.',
        acceptanceCriteria: 'All 18 regression test cases pass with exit code 0.',
        evidence: 'Awaiting regression test suite execution...',
        testCommand: 'npm run test:regression'
      }
    ]
  },
  {
    id: 'cat-11',
    title: 'Automation, CI/CD & Observability',
    maxPoints: 6,
    earnedPoints: 0,
    items: [
      {
        id: 'item-11-1',
        name: 'Self-Healing CI Pipeline & Reproducible Builds',
        points: 3,
        earnedPoints: 0,
        status: 'NOT_RUN',
        description: 'Verify GitHub Actions workflow, deterministic build artifacts, and bounded autonomous healing agent.',
        acceptanceCriteria: 'Build executes reproducibly with zero warnings; self-healing triggers PR without bypassing security.',
        evidence: 'Awaiting CI workflow validation...',
        testCommand: 'npm run test:ci-workflow'
      },
      {
        id: 'item-11-2',
        name: 'SRE Observability, RPC Telemetry & Gas Spike Alarms',
        points: 3,
        earnedPoints: 0,
        status: 'NOT_RUN',
        description: 'Monitor QuickNode RPC throughput, Arbitrum L2 gas price volatility, and automated circuit breaker trip thresholds.',
        acceptanceCriteria: 'Telemetry metrics streamed in JSON; alarms trip when simulated latency >500ms or error rate >5%.',
        evidence: 'Awaiting SRE observability telemetry...',
        testCommand: 'npm run test:sre-telemetry'
      }
    ]
  },
  {
    id: 'cat-12',
    title: 'Deployment Reality Gates (Arbitrum Sepolia/One)',
    maxPoints: 6,
    earnedPoints: 0,
    items: [
      {
        id: 'item-12-1',
        name: 'AlphaFold & AlphaTensor Web4 Scientific Compute Gate',
        points: 3,
        earnedPoints: 0,
        status: 'NOT_RUN',
        description: 'Validate DeepMind open source AlphaFold protein prediction pipeline and AlphaTensor matrix speedup algorithm.',
        acceptanceCriteria: 'AlphaFold pLDDT scores >85.0 on benchmark sequence; AlphaTensor demonstrates 4x4 matrix operation reduction.',
        evidence: 'Awaiting scientific compute verification...',
        testCommand: 'npm run test:alphafold-tensor'
      },
      {
        id: 'item-12-2',
        name: 'Final Reality Gate: Signed Deployment Manifest & 100/100',
        points: 3,
        earnedPoints: 0,
        status: 'NOT_RUN',
        description: 'Aggregate verified evidence across all 12 categories, generate signed manifest, and certify 100/100 readiness.',
        acceptanceCriteria: 'All 12 categories pass without exceptions; reports/FINAL_SCORECARD.json signed and exportable.',
        evidence: 'Awaiting final reality gate compilation...',
        testCommand: 'npm run mission:verify'
      }
    ]
  }
];
