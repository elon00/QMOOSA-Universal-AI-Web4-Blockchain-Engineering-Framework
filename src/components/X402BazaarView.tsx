import React, { useState } from 'react';
import { X402Resource, X402PaymentProof } from '../types';
import { Activity, ShieldCheck, ExternalLink, ArrowRight, CheckCircle2, AlertCircle, ShoppingBag, Coins } from 'lucide-react';

const INITIAL_RESOURCES: X402Resource[] = [
  {
    id: 'res-01',
    name: 'AlphaFold 3D Protein Folding Inference API',
    path: '/api/v1/compute/protein-inference',
    costTokens: 15.0,
    description: 'Autonomous microservice predicting 3D coordinate structures for amino acid sequences with pLDDT scoring.',
    provider: 'did:pkh:eip155:42161:0x98124...71ab',
    requiresPqcProof: true
  },
  {
    id: 'res-02',
    name: 'AlphaTensor Matrix Multiplication Optimizer',
    path: '/api/v1/math/tensor-decomposition',
    costTokens: 8.5,
    description: 'Discovers reduced tensor decomposition for matrix multiplication benchmarks to save Arbitrum execution gas.',
    provider: 'did:pkh:eip155:42161:0x3429a...1102',
    requiresPqcProof: false
  },
  {
    id: 'res-03',
    name: 'CodeQL Static Taint Analysis Microservice',
    path: '/api/v1/security/codeql-scan',
    costTokens: 5.0,
    description: 'On-demand AST semantic taint propagation query checking smart contracts before mainnet deployment.',
    provider: 'did:pkh:eip155:42161:0x87a12...fa99',
    requiresPqcProof: true
  }
];

export const X402BazaarView: React.FC = () => {
  const [resources] = useState<X402Resource[]>(INITIAL_RESOURCES);
  const [selectedResource, setSelectedResource] = useState<X402Resource>(INITIAL_RESOURCES[0]);
  const [paymentStatus, setPaymentStatus] = useState<'IDLE' | 'CHALLENGE_402' | 'PROOF_GENERATED' | 'SETTLED'>('IDLE');
  const [generatedProof, setGeneratedProof] = useState<X402PaymentProof | null>(null);
  const [logs, setLogs] = useState<string[]>([
    '[X402_INIT] x402 Foundation Bazaar Discovery Engine v2.0 ready.',
    '[REGISTRY] 3 microservices indexed on Arbitrum network.',
    '[CLIENT] Ready to query paid autonomous resources.'
  ]);

  const requestResource = (resource: X402Resource) => {
    setSelectedResource(resource);
    setPaymentStatus('CHALLENGE_402');
    setLogs(prev => [
      `[HTTP_REQ] GET ${resource.path}`,
      `[HTTP_RES] 402 Payment Required`,
      `[HEADERS] X-402-Payment-Required: true`,
      `[HEADERS] X-402-Amount: ${resource.costTokens} QMOOSA`,
      `[HEADERS] X-402-Recipient: ${resource.provider}`,
      `[HEADERS] X-402-Chain: Arbitrum-One (42161)`,
      ...prev.slice(0, 6)
    ]);
  };

  const payAndSettle = () => {
    const proof: X402PaymentProof = {
      proofId: 'proof_' + Math.random().toString(36).substring(2, 10),
      resourceId: selectedResource.id,
      payerAddress: '0x71C...a891',
      amount: selectedResource.costTokens,
      tokenSymbol: 'QMOOSA',
      timestamp: Date.now(),
      txHash: '0x' + Array.from(crypto.getRandomValues(new Uint8Array(32))).map(b => b.toString(16).padStart(2, '0')).join(''),
      verified: true,
      signature: '0x' + Array.from(crypto.getRandomValues(new Uint8Array(65))).map(b => b.toString(16).padStart(2, '0')).join('')
    };

    setGeneratedProof(proof);
    setPaymentStatus('SETTLED');
    setLogs(prev => [
      `[WALLET_SIGN] User approved ${selectedResource.costTokens} QMOOSA transfer.`,
      `[PROOF_GENERATED] Proof ID: ${proof.proofId}`,
      `[TX_SETTLED] Arbitrum Tx: ${proof.txHash.slice(0, 18)}...`,
      `[HTTP_RES] 200 OK — Access Granted to ${selectedResource.name}`,
      ...prev.slice(0, 6)
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" /> RFC HTTP 402 Protocol
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-950 text-indigo-400 border border-indigo-800">
                Bazaar Discovery v2
              </span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              x402 Bazaar Protocol & Agent Microservices
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Standardized HTTP 402 Payment Required negotiation allowing autonomous AI agents to discover, negotiate, and settle payments for computing APIs with Arbitrum tokens.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://x402.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 border border-slate-700 transition-all"
            >
              <span>x402.org</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://github.com/x402-foundation/x402"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-cyan-950 hover:bg-cyan-900 text-cyan-300 text-xs font-medium flex items-center gap-1.5 border border-cyan-800 transition-all"
            >
              <span>GitHub / x402</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Bazaar Discovery Registry & Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Available Microservices */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-cyan-400" />
                <span>Bazaar Service Catalog</span>
              </h3>
              <span className="text-xs font-mono text-cyan-400">Indexed on Arbitrum</span>
            </div>

            <div className="space-y-2.5">
              {resources.map(res => (
                <div
                  key={res.id}
                  onClick={() => requestResource(res)}
                  className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                    selectedResource.id === res.id
                      ? 'bg-cyan-950/70 border-cyan-500/80 shadow-md shadow-cyan-950/40'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-slate-200">
                    <span className="truncate pr-2">{res.name}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono shrink-0">
                      {res.costTokens} QMOOSA
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{res.description}</p>
                  <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span>{res.path}</span>
                    {res.requiresPqcProof && (
                      <span className="text-indigo-400 font-semibold">PQC Proof Required</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live HTTP 402 Negotiation & Settlement Panel */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>HTTP 402 Interactive Negotiation Flow</span>
              </h3>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                  paymentStatus === 'SETTLED'
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : paymentStatus === 'CHALLENGE_402'
                    ? 'bg-amber-950 text-amber-400 border border-amber-800'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {paymentStatus}
              </span>
            </div>

            {/* Negotiation Details */}
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2 font-mono text-[11px]">
                <div className="text-slate-400 flex items-center justify-between">
                  <span>Selected Microservice:</span>
                  <span className="text-slate-200 font-bold">{selectedResource.name}</span>
                </div>
                <div className="text-slate-400 flex items-center justify-between">
                  <span>Cost:</span>
                  <span className="text-cyan-300 font-bold">{selectedResource.costTokens} QMOOSA (~$0.02)</span>
                </div>
                <div className="text-slate-400 flex items-center justify-between">
                  <span>Provider DID:</span>
                  <span className="text-slate-300">{selectedResource.provider}</span>
                </div>
              </div>

              {/* Action Button */}
              {paymentStatus === 'CHALLENGE_402' && (
                <div className="p-3.5 rounded-lg bg-amber-950/40 border border-amber-800/60 space-y-3">
                  <div className="flex items-center gap-2 text-amber-300 font-semibold text-xs">
                    <AlertCircle className="w-4 h-4" />
                    <span>HTTP 402 Challenge Received: Payment Required to Access Resource</span>
                  </div>
                  <button
                    onClick={payAndSettle}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:opacity-90 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md"
                  >
                    <Coins className="w-3.5 h-3.5" />
                    <span>Sign Arbitrum Settlement ({selectedResource.costTokens} QMOOSA)</span>
                  </button>
                </div>
              )}

              {paymentStatus === 'SETTLED' && generatedProof && (
                <div className="p-3.5 rounded-lg bg-emerald-950/40 border border-emerald-800/60 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-300 font-semibold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Payment Settled & Cryptographic Proof Verified</span>
                  </div>
                  <div className="font-mono text-[10px] text-slate-300 space-y-1">
                    <div>Tx Hash: <span className="text-emerald-400">{generatedProof.txHash}</span></div>
                    <div>Proof ID: <span className="text-cyan-300">{generatedProof.proofId}</span></div>
                    <div>Settlement: <span className="text-slate-200">Arbitrum Nitro Sequencer Verified</span></div>
                  </div>
                </div>
              )}
            </div>

            {/* Protocol Event Stream Log */}
            <div className="rounded-lg bg-slate-950 border border-slate-800 p-3 font-mono text-[10px] space-y-1 text-slate-300 max-h-36 overflow-y-auto scrollbar-thin">
              {logs.map((log, i) => (
                <div key={i} className="leading-tight">
                  <span className="text-cyan-400">&gt; </span>
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
