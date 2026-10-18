import React, { useState } from 'react';
import { RavenExperiment } from '../types';
import { Layers, ArrowRight, CheckCircle2, ShieldAlert, Cpu, ExternalLink, Play, RotateCcw, FileCode, Check } from 'lucide-react';

const INITIAL_EXPERIMENT: RavenExperiment = {
  id: 'exp-2026-08',
  cycle: 4,
  stage: 'APPROVE',
  hypothesis: 'Replacing repetitive storage SSTORE reads in ArbitrumToken.sol transfer loop with cached calldata pointers reduces L2 execution gas by 14.8%.',
  proposedDiff: `--- a/contracts/QmoosaToken.sol\n+++ b/contracts/QmoosaToken.sol\n@@ -24,7 +24,7 @@ contract QmoosaToken is ERC20 {\n-    for (uint i = 0; i < recipients.length; i++) {\n-      _transfer(msg.sender, recipients[i], amounts[i]);\n+    uint256 len = recipients.length;\n+    for (uint256 i = 0; i < len; ) {\n+      _transfer(msg.sender, recipients[i], amounts[i]);\n+      unchecked { ++i; }\n     }`,
  benchmarkBefore: 42100,
  benchmarkAfter: 35850,
  approvedByHuman: false,
  status: 'PENDING'
};

export const RavenReaView: React.FC = () => {
  const [experiment, setExperiment] = useState<RavenExperiment>(INITIAL_EXPERIMENT);
  const [activeStep, setActiveStep] = useState<number>(6); // 'APPROVE'
  const [reaBytecode, setReaBytecode] = useState<string>('608060405234801561001057600080fd5b50600436106100365760003560e01c8063a9059cbb1461003b57806370a082311461006757');
  const [reaDecompiled, setReaDecompiled] = useState<string>('');
  const [isDecompiling, setIsDecompiling] = useState<boolean>(false);

  const loopStages = [
    'OBSERVE', 'DIAGNOSE', 'PROPOSE', 'PATCH', 'TEST', 'REVIEW', 'APPROVE', 'DEPLOY', 'MONITOR'
  ];

  const handleApprove = () => {
    setExperiment(prev => ({
      ...prev,
      approvedByHuman: true,
      stage: 'DEPLOY',
      status: 'ACCEPTED'
    }));
    setActiveStep(7); // DEPLOY
  };

  const handleDecompile = () => {
    setIsDecompiling(true);
    setTimeout(() => {
      setReaDecompiled(`// Decompiled by morluto/rea engine v1.4
// Source: Arbitrum EVM Bytecode
pragma solidity ^0.8.24;

interface IDecompiledContract {
  // Selector: 0xa9059cbb
  function transfer(address recipient, uint256 amount) external returns (bool);

  // Selector: 0x70a08231
  function balanceOf(address account) external view returns (uint256);
}

// Storage Layout Analysis:
// Slot 0: mapping(address => uint256) private _balances;
// Slot 1: mapping(address => mapping(address => uint256)) private _allowances;
// Reentrancy Vulnerability: CLEAN (Zero unprotected delegatecalls)`);
      setIsDecompiling(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" /> EverMind-AI/Raven RSI Loop
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-950 text-indigo-400 border border-indigo-800">
                morluto/rea Reverse Engineering
              </span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Governed Recursive Self-Improvement & REA Analysis
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Safe, bounded autonomous engineering combining EverMind-AI/Raven's 9-stage recursive improvement cycle with morluto/rea's AST binary decompiler under strict human approval gates.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://github.com/EverMind-AI/Raven"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 border border-slate-700 transition-all shrink-0"
            >
              <span>EverMind-AI / Raven</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://github.com/morluto/rea"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-cyan-950 hover:bg-cyan-900 text-cyan-300 text-xs font-medium flex items-center gap-1.5 border border-cyan-800 transition-all shrink-0"
            >
              <span>morluto / rea</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Raven 9-Stage Governed Loop */}
      <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>Raven RSI 9-Stage Governed Progression</span>
          </h3>
          <span className="text-xs font-mono text-cyan-400 font-semibold">
            Cycle #{experiment.cycle} • Stage: {loopStages[activeStep]}
          </span>
        </div>

        {/* Pipeline Step Indicators */}
        <div className="grid grid-cols-3 sm:grid-cols-9 gap-1.5">
          {loopStages.map((stage, idx) => {
            const isPassed = idx < activeStep;
            const isCurrent = idx === activeStep;
            return (
              <div
                key={stage}
                className={`p-2 rounded-lg text-center text-[10px] font-mono font-bold transition-all ${
                  isCurrent
                    ? 'bg-cyan-500 text-slate-950 ring-2 ring-cyan-300'
                    : isPassed
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : 'bg-slate-950 text-slate-600 border border-slate-900'
                }`}
              >
                {stage}
              </div>
            );
          })}
        </div>

        {/* Experiment Hypothesis & Benchmark Delta */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
            <div className="text-slate-400 font-mono text-[11px] font-bold">Hypothesis & Objective:</div>
            <p className="text-slate-300 leading-relaxed">{experiment.hypothesis}</p>
            <div className="pt-2 flex items-center justify-between font-mono text-[11px]">
              <span className="text-slate-400">Baseline Gas: {experiment.benchmarkBefore.toLocaleString()}</span>
              <span className="text-emerald-400 font-bold">
                Optimized Gas: {experiment.benchmarkAfter.toLocaleString()} (-14.8%)
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-mono text-[11px] font-bold">Human-in-the-Loop Gate:</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                  experiment.approvedByHuman
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : 'bg-amber-950 text-amber-400 border border-amber-800'
                }`}
              >
                {experiment.approvedByHuman ? 'APPROVED' : 'ACTION REQUIRED'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Security Policy Enforced: Autonomous agent cannot apply code patches to production contracts without explicit human cryptographic signature.
            </p>
            {!experiment.approvedByHuman ? (
              <button
                onClick={handleApprove}
                className="w-full py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:opacity-90 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Approve & Authorize Deployment</span>
              </button>
            ) : (
              <div className="text-xs text-emerald-400 font-mono flex items-center justify-center gap-1.5 p-2 rounded bg-emerald-950/40 border border-emerald-800">
                <CheckCircle2 className="w-4 h-4" />
                <span>Patch Approved by Human Auditor & Ready to Deploy</span>
              </div>
            )}
          </div>
        </div>

        {/* Patch Diff View */}
        <div className="rounded-xl bg-slate-950 border border-slate-800 p-3.5 font-mono text-xs overflow-x-auto space-y-1">
          <div className="text-slate-500 pb-1">Bounded Code Modification Diff:</div>
          <pre className="text-cyan-200/90 text-[11px] leading-relaxed">
            {experiment.proposedDiff}
          </pre>
        </div>
      </div>

      {/* morluto/rea Reverse Engineering Workbench */}
      <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">morluto/rea Bytecode & AST Decompiler</h3>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono">
            EVM Bytecode Analysis
          </span>
        </div>

        <div className="space-y-3 text-xs">
          <div className="space-y-1">
            <label className="text-slate-400 font-mono text-[11px]">Target Arbitrum Bytecode (Hex):</label>
            <textarea
              rows={2}
              value={reaBytecode}
              onChange={(e) => setReaBytecode(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 font-mono text-[11px] text-cyan-300/80 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <button
            onClick={handleDecompile}
            disabled={isDecompiling}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>{isDecompiling ? 'Decompiling via REA...' : 'Run REA Decompiler & AST Extraction'}</span>
          </button>

          {reaDecompiled && (
            <div className="rounded-xl bg-slate-950 border border-slate-800 p-3.5 font-mono text-xs overflow-x-auto shadow-inner">
              <div className="text-slate-500 pb-2">Decompiled Solidity Interface & Storage:</div>
              <pre className="text-emerald-300 text-[11px] leading-relaxed">
                {reaDecompiled}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
