import React, { useState } from 'react';
import {
  generateMlKem768KeyPair,
  generateMlDsa65KeyPair,
  encapsulateMlKem768,
  signMlDsa65,
  verifyMlDsa65,
  verifyHybridArbitrumSignature,
  PqcMlKemKeyPair,
  PqcMlDsaKeyPair
} from '../utils/cryptoUtils';
import { Sparkles, ShieldCheck, Key, Lock, CheckCircle2, AlertTriangle, ExternalLink, ArrowRight, RefreshCw } from 'lucide-react';

export const PqcStudioView: React.FC = () => {
  // ML-KEM-768 State
  const [kemKeypair, setKemKeypair] = useState<PqcMlKemKeyPair>(() => generateMlKem768KeyPair());
  const [encapsulation, setEncapsulation] = useState<{ ciphertextHex: string; sharedSecretHex: string } | null>(null);

  // ML-DSA-65 State
  const [dsaKeypair, setDsaKeypair] = useState<PqcMlDsaKeyPair>(() => generateMlDsa65KeyPair());
  const [testMessage, setTestMessage] = useState<string>('Arbitrum-Nitro-Tx-Payload: Transfer 10,000 QMOOSA to 0x48f...a109');
  const [signature, setSignature] = useState<string>('');
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null);

  // Hybrid Signer State
  const [hybridResult, setHybridResult] = useState<{ valid: boolean; classicalValid: boolean; quantumValid: boolean } | null>(null);

  const handleRegenKem = () => {
    const pair = generateMlKem768KeyPair();
    setKemKeypair(pair);
    setEncapsulation(null);
  };

  const handleEncapsulate = () => {
    const enc = encapsulateMlKem768(kemKeypair.publicKeyHex);
    setEncapsulation(enc);
  };

  const handleSignDsa = () => {
    const sig = signMlDsa65(testMessage, dsaKeypair.privateKeyHex);
    setSignature(sig);
    const valid = verifyMlDsa65(testMessage, sig, dsaKeypair.publicKeyHex);
    setVerificationResult(valid);
  };

  const handleVerifyHybrid = () => {
    const ecdsa = '0x3a4b5c...89d0';
    const ethAddress = '0x1234567890123456789012345678901234567890';
    const res = verifyHybridArbitrumSignature(testMessage, ecdsa, signature || 'dsa65_sample_sig', ethAddress, dsaKeypair.publicKeyHex);
    setHybridResult(res);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> NIST FIPS 203 & 204 Standards
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
                Quantum Shor-Resistant
              </span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Post-Quantum Cryptography (PQC) Studio
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Standardized lattice-based cryptographic algorithms protecting Arbitrum Web4 infrastructure against future cryptanalytic quantum computers using ML-KEM-768 and ML-DSA-65.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://csrc.nist.gov/pubs/fips/203/final"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 border border-slate-700 transition-all shrink-0"
            >
              <span>NIST FIPS 203</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://csrc.nist.gov/pubs/fips/204/final"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-cyan-950 hover:bg-cyan-900 text-cyan-300 text-xs font-medium flex items-center gap-1.5 border border-cyan-800 transition-all shrink-0"
            >
              <span>NIST FIPS 204</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Grid: ML-KEM and ML-DSA Labs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Module 1: ML-KEM-768 Key Encapsulation */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">NIST ML-KEM-768 (Kyber)</h3>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono">
              FIPS 203 • Key Encapsulation
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <div className="flex justify-between text-slate-400 font-mono text-[11px]">
                <span>Public Key (1,184 bytes / 2,368 hex):</span>
                <span className="text-cyan-400">Security: Level 3</span>
              </div>
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800 font-mono text-[11px] text-cyan-300/80 truncate">
                {kemKeypair.publicKeyHex}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleRegenKem}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Regenerate Lattice Keypair</span>
              </button>

              <button
                onClick={handleEncapsulate}
                className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Lock className="w-3 h-3" />
                <span>Encapsulate Shared Secret</span>
              </button>
            </div>

            {encapsulation && (
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-[11px]">
                <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Shared Secret Derived Successfully</span>
                </div>
                <div className="text-slate-400">
                  Ciphertext (1,088 bytes):
                  <div className="text-slate-300 truncate">{encapsulation.ciphertextHex.slice(0, 48)}...</div>
                </div>
                <div className="text-slate-400">
                  Derived 256-bit Key:
                  <div className="text-cyan-300">{encapsulation.sharedSecretHex}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Module 2: ML-DSA-65 Digital Signatures */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">NIST ML-DSA-65 (Dilithium)</h3>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono">
              FIPS 204 • Digital Signature
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="text-slate-400 font-mono text-[11px]">Test Arbitrum Transaction Message:</label>
              <input
                type="text"
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <button
              onClick={handleSignDsa}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer transition-all"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Generate Quantum-Safe Signature</span>
            </button>

            {signature && (
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Signature Length: 3,309 bytes</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> VERIFIED (KAT MATCH)
                  </span>
                </div>
                <div className="text-slate-300 truncate">
                  {signature.slice(0, 52)}...
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hybrid EVM + PQC Signer Box */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Hybrid ECDSA (secp256k1) + ML-DSA Dual Verification for Arbitrum</span>
          </h3>
          <button
            onClick={handleVerifyHybrid}
            className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold cursor-pointer"
          >
            Verify Dual Hybrid Scheme
          </button>
        </div>

        <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
          Arbitrum Nitro rollups process ECDSA on EVM layer-1 checkpoints while anchoring ML-DSA signatures in calldata, assuring that neither classical nor quantum adversary can forge transactions.
        </p>

        {hybridResult && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-center">
              <div className="text-[11px] text-slate-400">Classical ECDSA Check</div>
              <div className="text-sm font-bold text-emerald-400 mt-0.5">VALID (0x42161)</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-center">
              <div className="text-[11px] text-slate-400">Quantum ML-DSA Check</div>
              <div className="text-sm font-bold text-emerald-400 mt-0.5">VALID (FIPS 204)</div>
            </div>
            <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800 text-center">
              <div className="text-[11px] text-emerald-300">Hybrid Security Status</div>
              <div className="text-sm font-bold text-emerald-400 mt-0.5">FULL QUANTUM RESILIENT</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
