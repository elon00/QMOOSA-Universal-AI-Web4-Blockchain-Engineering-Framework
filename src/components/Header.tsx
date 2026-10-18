import React from 'react';
import { ShieldCheck, BookOpen, Cpu, Sparkles, Terminal, Activity, Layers, ExternalLink, Globe } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  totalScore: number;
  walletConnected: boolean;
  walletAddress: string;
  onConnectWallet: () => void;
  onDisconnectWallet: () => void;
  onRunAudit: () => void;
  isAuditing: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  totalScore,
  walletConnected,
  walletAddress,
  onConnectWallet,
  onDisconnectWallet,
  onRunAudit,
  isAuditing
}) => {
  const tabs = [
    { id: 'scorecard', label: '100/100 Scorecard', icon: ShieldCheck, badge: `${totalScore}/100` },
    { id: 'book', label: 'Engineering Book (20 Ch.)', icon: BookOpen },
    { id: 'quicknode', label: 'Arbitrum & QuickNode', icon: Globe },
    { id: 'x402', label: 'x402 Bazaar Protocol', icon: Activity },
    { id: 'conway', label: 'Conway Automaton', icon: Cpu },
    { id: 'pqc', label: 'Post-Quantum (PQC)', icon: Sparkles },
    { id: 'raven-rea', label: 'Raven RSI & REA', icon: Layers },
    { id: 'agents', label: 'AI Agentics', icon: Terminal },
    { id: 'science', label: 'AlphaFold & AlphaTensor', icon: Sparkles },
    { id: 'tokenomics', label: 'Tokenomics & Launchpad', icon: Layers },
    { id: 'testing', label: 'CodeQL & Reality Tests', icon: ShieldCheck },
    { id: 'links', label: 'Genuine Links', icon: ExternalLink }
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 text-slate-100 shadow-xl">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-indigo-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/40">
            <span className="font-extrabold text-white text-base tracking-wider font-mono">Q4</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-cyan-300 via-white to-emerald-300 bg-clip-text text-transparent">
                QMOOSA Universal AI–Web4 Framework
              </h1>
              <span className="px-2 py-0.5 text-xs font-semibold rounded bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono">
                Arbitrum One / Sepolia
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-2">
              <span>Target: <code className="text-cyan-300 font-mono">github.com/elon00/qmoosa-web4-arbitrum</code></span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-emerald-400 text-xs">QuickNode RPC Active</span>
            </p>
          </div>
        </div>

        {/* Action Controls & Score Pill */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* 100/100 Evidence Score Badge */}
          <div
            onClick={() => setActiveTab('scorecard')}
            className={`cursor-pointer px-3.5 py-1.5 rounded-lg border font-mono text-xs flex items-center gap-2 transition-all shadow-md ${
              totalScore === 100
                ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300 shadow-emerald-500/20'
                : 'bg-slate-900 border-cyan-500/50 text-cyan-300 shadow-cyan-500/10 hover:border-cyan-400'
            }`}
          >
            <ShieldCheck className={`w-4 h-4 ${totalScore === 100 ? 'text-emerald-400' : 'text-cyan-400'}`} />
            <span>Scorecard:</span>
            <span className="font-bold text-sm tracking-wide">
              {totalScore} / 100
            </span>
            {totalScore === 100 && (
              <span className="px-1.5 py-0.2 text-[10px] bg-emerald-500 text-slate-950 font-extrabold rounded">
                VERIFIED
              </span>
            )}
          </div>

          {/* Quick One-Click Audit Trigger */}
          <button
            onClick={onRunAudit}
            disabled={isAuditing}
            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-medium text-xs flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/20 disabled:opacity-50 cursor-pointer"
          >
            <Terminal className="w-3.5 h-3.5" />
            {isAuditing ? 'Running Reality Tests...' : 'Run Full Reality Audit'}
          </button>

          {/* Multiwallet Button */}
          {walletConnected ? (
            <button
              onClick={onDisconnectWallet}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1.5 cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </button>
          ) : (
            <button
              onClick={onConnectWallet}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-100 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
            >
              <span>Connect Wallet</span>
            </button>
          )}
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 overflow-x-auto scrollbar-none border-t border-slate-800/60">
        <nav className="flex space-x-1 py-1.5 min-w-max">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="ml-1 px-1.5 py-0.2 text-[10px] rounded bg-slate-800 text-cyan-300 font-mono">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
