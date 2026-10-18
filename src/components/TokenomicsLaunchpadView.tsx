import React, { useState } from 'react';
import { Layers, Rocket, Shield, AlertTriangle, CheckCircle2, ExternalLink, ArrowRight, Flame } from 'lucide-react';

export const TokenomicsLaunchpadView: React.FC = () => {
  // Tokenomics State
  const [initialSupply, setInitialSupply] = useState<number>(1000000000); // 1 Billion
  const [annualLimitBps, setAnnualLimitBps] = useState<number>(500); // 5.0%
  const [issuanceRequest, setIssuanceRequest] = useState<number>(35000000); // 35 Million requested
  const [circuitBreakerTripped, setCircuitBreakerTripped] = useState<boolean>(false);

  // Launchpad State
  const [tokenName, setTokenName] = useState<string>('QMOOSA Universal');
  const [tokenSymbol, setTokenSymbol] = useState<string>('QMOOSA');
  const [targetChain, setTargetChain] = useState<'Arbitrum One' | 'Arbitrum Sepolia'>('Arbitrum Sepolia');
  const [deployStatus, setDeployStatus] = useState<'IDLE' | 'SIMULATING' | 'DEPLOYED'>('IDLE');
  const [deployedContractAddress, setDeployedContractAddress] = useState<string>('');
  const [deployTxHash, setDeployTxHash] = useState<string>('');

  // Governed issuance calculation: M(t) = min(R(t), annual_emission_limit(t))
  const maxAllowedAnnualMint = Math.floor((initialSupply * annualLimitBps) / 10000);
  const actualMinted = circuitBreakerTripped ? 0 : Math.min(issuanceRequest, maxAllowedAnnualMint);
  const isCapped = issuanceRequest > maxAllowedAnnualMint;

  const handleSimulateDeploy = () => {
    setDeployStatus('SIMULATING');
    setTimeout(() => {
      const mockAddr = '0x' + Array.from(crypto.getRandomValues(new Uint8Array(20))).map(b => b.toString(16).padStart(2, '0')).join('');
      const mockTx = '0x' + Array.from(crypto.getRandomValues(new Uint8Array(32))).map(b => b.toString(16).padStart(2, '0')).join('');
      setDeployedContractAddress(mockAddr);
      setDeployTxHash(mockTx);
      setDeployStatus('DEPLOYED');
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" /> Governed Unlimited-Mint Standard
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
                Arbitrum ERC-20 Launchpad
              </span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Tokenomics Strategy & Arbitrum Token Launchpad
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Sustainable uncapped token issuance governed by the formula M(t) = min(R(t), annual_limit(t)), treasury locks, emergency circuit breakers, and one-click Arbitrum deployment simulation.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://sepolia.arbiscan.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 border border-slate-700 transition-all shrink-0"
            >
              <span>Arbiscan Sepolia</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Grid: Tokenomics Calculator & Launchpad */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Module 1: Governed Issuance Tokenomics Calculator */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span>Governed Issuance Calculator: M(t)</span>
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono">
              Formula: M(t) = min(R(t), Limit(t))
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-slate-400 font-mono text-[11px]">Initial Base Supply:</label>
                <input
                  type="number"
                  value={initialSupply}
                  onChange={(e) => setInitialSupply(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 font-mono text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-mono text-[11px]">Annual Inflation Cap (%):</label>
                <input
                  type="number"
                  step="0.5"
                  value={annualLimitBps / 100}
                  onChange={(e) => setAnnualLimitBps(Number(e.target.value) * 100)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 font-mono text-xs text-cyan-300"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-mono text-[11px]">Requested Mint Issuance R(t):</label>
              <input
                type="number"
                value={issuanceRequest}
                onChange={(e) => setIssuanceRequest(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 font-mono text-xs text-white"
              />
            </div>

            {/* Calculations Box */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5 font-mono text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Maximum Allowed Annual Mint:</span>
                <span className="text-slate-200 font-bold">{maxAllowedAnnualMint.toLocaleString()} tokens</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Requested Issuance:</span>
                <span className="text-slate-200 font-bold">{issuanceRequest.toLocaleString()} tokens</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-800/80 text-sm">
                <span className="text-cyan-400 font-bold">Approved Mint M(t):</span>
                <span className="text-emerald-400 font-extrabold">{actualMinted.toLocaleString()} tokens</span>
              </div>
              {isCapped && (
                <div className="text-[11px] text-amber-400 flex items-center gap-1.5 pt-1">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>Issuance request exceeded annual limit; rate-capped by smart contract rule.</span>
                </div>
              )}
            </div>

            {/* Emergency Circuit Breaker */}
            <div className="pt-2 flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div>
                <div className="font-bold text-slate-200 text-xs">Emergency Mint Circuit Breaker</div>
                <div className="text-[10px] text-slate-500">Freezes all token creation immediately if compromised</div>
              </div>
              <button
                onClick={() => setCircuitBreakerTripped(!circuitBreakerTripped)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold cursor-pointer transition-all ${
                  circuitBreakerTripped
                    ? 'bg-rose-950 text-rose-300 border border-rose-800'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {circuitBreakerTripped ? 'CIRCUIT TRIPPED (HALTED)' : 'ARMED (NORMAL)'}
              </button>
            </div>
          </div>
        </div>

        {/* Module 2: Arbitrum Token Launchpad */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Rocket className="w-4 h-4 text-emerald-400" />
              <span>Arbitrum ERC-20 Token Launchpad</span>
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono">
              Arbitrum Nitro Deployer
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-slate-400 font-mono text-[11px]">Token Name:</label>
                <input
                  type="text"
                  value={tokenName}
                  onChange={(e) => setTokenName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 font-mono text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-mono text-[11px]">Token Symbol:</label>
                <input
                  type="text"
                  value={tokenSymbol}
                  onChange={(e) => setTokenSymbol(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 font-mono text-xs text-cyan-300 font-bold"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-mono text-[11px]">Deployment Target Network:</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setTargetChain('Arbitrum Sepolia')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-mono cursor-pointer ${
                    targetChain === 'Arbitrum Sepolia'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                      : 'bg-slate-950 text-slate-400 border border-slate-800'
                  }`}
                >
                  Arbitrum Sepolia (421614)
                </button>
                <button
                  onClick={() => setTargetChain('Arbitrum One')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-mono cursor-pointer ${
                    targetChain === 'Arbitrum One'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                      : 'bg-slate-950 text-slate-400 border border-slate-800'
                  }`}
                >
                  Arbitrum One Mainnet (42161)
                </button>
              </div>
            </div>

            <button
              onClick={handleSimulateDeploy}
              disabled={deployStatus === 'SIMULATING'}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-600 hover:opacity-90 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
            >
              <Rocket className="w-3.5 h-3.5" />
              <span>{deployStatus === 'SIMULATING' ? 'Simulating Arbitrum Nitro Deployment...' : `Deploy ${tokenSymbol} to ${targetChain}`}</span>
            </button>

            {deployStatus === 'DEPLOYED' && (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-[11px]">
                <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Deployment Successful on {targetChain}</span>
                </div>
                <div className="text-slate-400">
                  Contract Address:
                  <div className="text-cyan-300 truncate">{deployedContractAddress}</div>
                </div>
                <div className="text-slate-400">
                  Transaction Hash:
                  <div className="text-slate-200 truncate">{deployTxHash}</div>
                </div>
                <div className="pt-1 flex justify-between items-center text-[10px]">
                  <span className="text-slate-500">Gas Used: 142,500 units (~$0.012)</span>
                  <a
                    href={`https://${targetChain === 'Arbitrum Sepolia' ? 'sepolia.' : ''}arbiscan.io/address/${deployedContractAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    <span>View on Arbiscan</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
