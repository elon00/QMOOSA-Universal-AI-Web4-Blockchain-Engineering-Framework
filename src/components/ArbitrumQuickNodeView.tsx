import React, { useState } from 'react';
import { QuickNodeRpcConfig } from '../types';
import { Globe, Activity, Zap, Shield, ArrowUpRight, CheckCircle2, RefreshCw, AlertCircle } from 'lucide-react';

export const ArbitrumQuickNodeView: React.FC = () => {
  const [selectedNetwork, setSelectedNetwork] = useState<'Arbitrum One' | 'Arbitrum Sepolia'>('Arbitrum One');
  const [isPinging, setIsPinging] = useState(false);
  const [failoverActive, setFailoverActive] = useState(false);
  const [blockHeight, setBlockHeight] = useState(298419230);
  const [latency, setLatency] = useState(48);
  const [lastCheck, setLastCheck] = useState('Just now');
  const [logs, setLogs] = useState<string[]>([
    '[INIT] QuickNode Arbitrum client initialized.',
    '[RPC] Primary endpoint: https://arbitrum-mainnet.quiknode.pro/QN_SECURE_TOKEN',
    '[SYNC] Connected to Arbitrum Nitro Sequencer. Block #298,419,230',
    '[CIRCUIT_BREAKER] Failover policy: Active (Auto-fallback to secondary on 3 timeouts)'
  ]);

  const handlePing = () => {
    setIsPinging(true);
    setTimeout(() => {
      const simulatedLatency = Math.floor(Math.random() * 45) + 38;
      const newBlock = blockHeight + Math.floor(Math.random() * 4) + 1;
      setBlockHeight(newBlock);
      setLatency(simulatedLatency);
      setIsPinging(false);
      setLastCheck(new Date().toLocaleTimeString());
      setLogs(prev => [
        `[RPC_CALL] eth_blockNumber -> ${newBlock} (Latency: ${simulatedLatency}ms)`,
        `[GAS_TRACKER] L2 Gas: 0.10 Gwei | L1 Calldata Posting: 12.4 Gwei`,
        ...prev.slice(0, 7)
      ]);
    }, 450);
  };

  const toggleFailover = () => {
    setFailoverActive(!failoverActive);
    setLogs(prev => [
      `[FAILOVER_MANAGER] Secondary backup RPC ${!failoverActive ? 'FORCED ACTIVE' : 'RESTORED PRIMARY'}.`,
      ...prev.slice(0, 7)
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
                <Globe className="w-3.5 h-3.5" /> QuickNode Certified Partner
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
                Arbitrum Nitro Layer-2
              </span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              QuickNode RPC Hub & Arbitrum Infrastructure
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              High-throughput JSON-RPC endpoints, low-latency sequencer streaming, automated failover management, and live gas metrics for Arbitrum One and Arbitrum Sepolia.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://www.quicknode.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 border border-slate-700 transition-all"
            >
              <span>QuickNode.com</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://arbiscan.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-cyan-950 hover:bg-cyan-900 text-cyan-300 text-xs font-medium flex items-center gap-1.5 border border-cyan-800 transition-all"
            >
              <span>Arbiscan Explorer</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Network Select & Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Target Network</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
          <div className="text-lg font-bold text-white font-mono flex items-center justify-between">
            <span>{selectedNetwork}</span>
            <span className="text-xs text-cyan-400 font-mono">
              {selectedNetwork === 'Arbitrum One' ? 'ID 42161' : 'ID 421614'}
            </span>
          </div>
          <div className="flex gap-1.5 pt-1">
            <button
              onClick={() => setSelectedNetwork('Arbitrum One')}
              className={`px-2 py-0.5 rounded text-[11px] font-mono cursor-pointer ${
                selectedNetwork === 'Arbitrum One'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              Mainnet
            </button>
            <button
              onClick={() => setSelectedNetwork('Arbitrum Sepolia')}
              className={`px-2 py-0.5 rounded text-[11px] font-mono cursor-pointer ${
                selectedNetwork === 'Arbitrum Sepolia'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              Sepolia Testnet
            </button>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>RPC Round-Trip Latency</span>
            <Zap className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">
            {latency} ms
          </div>
          <div className="text-xs text-slate-400 flex items-center gap-1 font-mono">
            <span className="text-emerald-400">●</span> Sub-100ms ultra-low latency
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Latest Arbitrum Block</span>
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            #{blockHeight.toLocaleString()}
          </div>
          <div className="text-xs text-slate-400 font-mono">
            Updated {lastCheck}
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Circuit Breaker Status</span>
            <Shield className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="text-lg font-bold font-mono text-white flex items-center gap-2">
            <span className={failoverActive ? 'text-amber-400' : 'text-emerald-400'}>
              {failoverActive ? 'FALLBACK ACTIVE' : 'PRIMARY ACTIVE'}
            </span>
          </div>
          <button
            onClick={toggleFailover}
            className="text-[11px] font-mono text-cyan-400 hover:underline cursor-pointer"
          >
            {failoverActive ? 'Reset to Primary RPC' : 'Simulate Provider Outage'}
          </button>
        </div>
      </div>

      {/* Interactive QuickNode Control & Live Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>RPC Diagnostics & Actions</span>
            </h3>

            <div className="space-y-2 text-xs">
              <label className="text-slate-400 font-mono">Simulated RPC Endpoint URL:</label>
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800 font-mono text-slate-300 text-[11px] break-all">
                https://{selectedNetwork === 'Arbitrum One' ? 'arbitrum-mainnet' : 'arbitrum-sepolia'}.quiknode.pro/[REDACTED_API_KEY]/
              </div>
              <p className="text-[10px] text-slate-500">
                Security Policy: API keys are securely redacted and never transmitted to the browser bundle.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <button
                onClick={handlePing}
                disabled={isPinging}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin' : ''}`} />
                <span>{isPinging ? 'Querying QuickNode...' : 'Ping RPC (eth_blockNumber)'}</span>
              </button>

              <button
                onClick={() => {
                  setLogs(prev => [
                    `[STREAMS] Initialized QuickNode Webhook Stream for ERC-20 Transfer events.`,
                    `[STREAMS] Filter: Contract 0xQMOOSA... | Destination: /api/v1/webhooks/arbitrum`,
                    ...prev.slice(0, 7)
                  ]);
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1.5 border border-slate-700 cursor-pointer"
              >
                <span>Simulate QuickNode Stream</span>
              </button>
            </div>
          </div>
        </div>

        {/* Real-time Telemetry Log Terminal */}
        <div className="lg:col-span-6 p-5 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-3 shadow-inner">
          <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              <span>QuickNode RPC Live Event Stream</span>
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Arbitrum Nitro Sequencer</span>
          </div>

          <div className="space-y-1.5 text-[11px] text-cyan-300/90 leading-relaxed max-h-56 overflow-y-auto scrollbar-thin">
            {logs.map((log, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-slate-600 select-none">&gt;</span>
                <span className={log.includes('FALLBACK') || log.includes('ALERT') ? 'text-amber-400' : 'text-slate-300'}>
                  {log}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
