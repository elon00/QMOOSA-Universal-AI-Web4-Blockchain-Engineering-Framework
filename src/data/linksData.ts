import { GenuineLinkItem } from '../types';

export const GENUINE_LINKS_DATA: GenuineLinkItem[] = [
  // GitHub Repos
  {
    name: 'qmoosa-web4-arbitrum Repository',
    category: 'GitHub Repos',
    url: 'https://github.com/elon00/qmoosa-web4-arbitrum',
    description: 'Target GitHub repository for the QMOOSA Universal AI–Web4–Arbitrum Framework.',
    officialTag: 'User Target Repo'
  },
  {
    name: 'EverMind-AI / Raven',
    category: 'AI & RSI',
    url: 'https://github.com/EverMind-AI/Raven',
    description: 'Multi-agent orchestration and governed self-evolving recursive improvement engine.',
    officialTag: 'Upstream Open Source'
  },
  {
    name: 'morluto / rea',
    category: 'Testing & Security',
    url: 'https://github.com/morluto/rea',
    description: 'Reverse Engineer Anything: automated code, binary, application and runtime analysis engine.',
    officialTag: 'Upstream Open Source'
  },
  {
    name: 'Google DeepMind / AlphaFold',
    category: 'Science & Math',
    url: 'https://github.com/google-deepmind/alphafold',
    description: 'Open source protein structure prediction pipeline by Google DeepMind integrated into Web4 decentralized compute.',
    officialTag: 'DeepMind Science'
  },
  {
    name: 'Google DeepMind / AlphaTensor',
    category: 'Science & Math',
    url: 'https://github.com/google-deepmind/alphatensor',
    description: 'Deep reinforcement learning algorithm discovering faster matrix multiplication and tensor decompositions.',
    officialTag: 'DeepMind Science'
  },

  // Blockchain & RPC
  {
    name: 'Arbitrum Official Docs',
    category: 'Blockchain',
    url: 'https://docs.arbitrum.io/',
    description: 'Complete documentation for Arbitrum One, Arbitrum Nova, Nitro rollups, and Stylus.',
    officialTag: 'Official Arbitrum'
  },
  {
    name: 'Arbiscan (Arbitrum One Explorer)',
    category: 'Blockchain',
    url: 'https://arbiscan.io/',
    description: 'Live block explorer, token tracker, and contract verification for Arbitrum One (ChainID 42161).',
    officialTag: 'Etherscan for Arbitrum'
  },
  {
    name: 'Arbiscan Sepolia Testnet Explorer',
    category: 'Blockchain',
    url: 'https://sepolia.arbiscan.io/',
    description: 'Block explorer for Arbitrum Sepolia testnet (ChainID 421614) for zero-risk contract testing.',
    officialTag: 'Testnet Explorer'
  },
  {
    name: 'QuickNode Official Website',
    category: 'RPC',
    url: 'https://www.quicknode.com/',
    description: 'Enterprise Web3 infrastructure, high-throughput RPC, Streams, and Webhooks.',
    officialTag: 'Official QuickNode'
  },
  {
    name: 'QuickNode Documentation',
    category: 'RPC',
    url: 'https://www.quicknode.com/docs',
    description: 'API guides, WebSocket streaming, and RPC endpoints for Ethereum, Arbitrum, and 40+ chains.',
    officialTag: 'RPC Documentation'
  },
  {
    name: 'QuickNode Arbitrum RPC Portal',
    category: 'RPC',
    url: 'https://www.quicknode.com/chains/arbitrum',
    description: 'Dedicated high-speed Arbitrum One and Sepolia RPC endpoints with sub-100ms response times.',
    officialTag: 'QuickNode Chains'
  },

  // Protocols
  {
    name: 'x402 Foundation Official Site',
    category: 'Protocols',
    url: 'https://x402.org/',
    description: 'Standardized HTTP 402 Payment Required status code specification and open payment facilitator network.',
    officialTag: 'Official x402'
  },
  {
    name: 'x402 Foundation GitHub',
    category: 'Protocols',
    url: 'https://github.com/x402-foundation/x402',
    description: 'Open source reference implementations, client libraries, and middleware for x402 payments.',
    officialTag: 'Upstream Protocol'
  },
  {
    name: 'x402 Specification v2',
    category: 'Protocols',
    url: 'https://github.com/x402-foundation/x402/blob/main/specs/x402-specification-v2.md',
    description: 'Draft specification for resource pricing, cryptographic payment proofs, and Bazaar discovery.',
    officialTag: 'Specification'
  },
  {
    name: 'Conway LifeWiki Rules',
    category: 'Protocols',
    url: 'https://conwaylife.com/',
    description: 'Cellular automaton rules, deterministic oscillator registries, and Conway Game of Life encyclopaedia.',
    officialTag: 'Cellular Automata'
  },

  // Security & Cryptography
  {
    name: 'NIST Post-Quantum Cryptography Project',
    category: 'Testing & Security',
    url: 'https://csrc.nist.gov/projects/post-quantum-cryptography',
    description: 'National Institute of Standards and Technology official post-quantum standardization hub.',
    officialTag: 'NIST Standard'
  },
  {
    name: 'NIST FIPS 203 (ML-KEM Standard)',
    category: 'Testing & Security',
    url: 'https://csrc.nist.gov/pubs/fips/203/final',
    description: 'Module-Lattice-Based Key-Encapsulation Mechanism standard (derived from CRYSTALS-Kyber).',
    officialTag: 'FIPS 203 Final'
  },
  {
    name: 'NIST FIPS 204 (ML-DSA Standard)',
    category: 'Testing & Security',
    url: 'https://csrc.nist.gov/pubs/fips/204/final',
    description: 'Module-Lattice-Based Digital Signature Algorithm standard (derived from CRYSTALS-Dilithium).',
    officialTag: 'FIPS 204 Final'
  },
  {
    name: 'GitHub CodeQL Documentation',
    category: 'Testing & Security',
    url: 'https://codeql.github.com/docs/',
    description: 'Industry-standard semantic code analysis engine for finding zero-day security vulnerabilities.',
    officialTag: 'GitHub CodeQL'
  },
  {
    name: 'Slither Smart Contract Static Analyzer',
    category: 'Testing & Security',
    url: 'https://github.com/crytic/slither',
    description: 'Trail of Bits static analysis framework for Solidity smart contracts, catching reentrancy and bugs.',
    officialTag: 'Smart Contract Audit'
  },

  // Smart Contracts & Wallets
  {
    name: 'OpenZeppelin Contracts',
    category: 'Wallets & Tools',
    url: 'https://docs.openzeppelin.com/contracts/5.x/',
    description: 'Battle-tested library of secure smart contracts for Ethereum and Arbitrum (ERC20, AccessControl).',
    officialTag: 'OpenZeppelin'
  },
  {
    name: 'Foundry Book',
    category: 'Wallets & Tools',
    url: 'https://book.getfoundry.sh/',
    description: 'Fast, portable, and modular toolkit for Ethereum application development written in Rust.',
    officialTag: 'Foundry'
  },
  {
    name: 'Reown AppKit (formerly Web3Modal)',
    category: 'Wallets & Tools',
    url: 'https://docs.reown.com/appkit/overview',
    description: 'Multi-chain wallet connection suite supporting MetaMask, Coinbase, and WalletConnect v2.',
    officialTag: 'Wallet SDK'
  },
  {
    name: 'EIP-681 Ethereum QR Scheme',
    category: 'Wallets & Tools',
    url: 'https://eips.ethereum.org/EIPS/eip-681',
    description: 'Standardized URL format for transaction requests and payment QR codes in Ethereum/Arbitrum wallets.',
    officialTag: 'Ethereum Standard'
  }
];
