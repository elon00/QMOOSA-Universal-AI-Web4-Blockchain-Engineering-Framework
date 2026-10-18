import React, { useState } from 'react';
import { ScorecardCategory, ScorecardItem } from '../types';
import { CheckCircle2, AlertTriangle, Play, Download, Terminal, ChevronDown, ChevronRight, ShieldCheck, Flame, RefreshCw, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ScorecardViewProps {
  categories: ScorecardCategory[];
  totalScore: number;
  onRunAudit: () => void;
  isAuditing: boolean;
  onExecuteItem: (categoryId: string, itemId: string) => void;
}

export const ScorecardView: React.FC<ScorecardViewProps> = ({
  categories,
  totalScore,
  onRunAudit,
  isAuditing,
  onExecuteItem
}) => {
  const [expandedCats, setExpandedCats] = useState<Record<string, boolean>>({
    'cat-01': true,
    'cat-02': true,
    'cat-05': true,
    'cat-10': true
  });
  const [activeEvidence, setActiveEvidence] = useState<ScorecardItem | null>(null);

  const toggleCategory = (id: string) => {
    setExpandedCats(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleAuditClick = () => {
    onRunAudit();
    setTimeout(() => {
      triggerConfetti();
    }, 1200);
  };

  const exportReport = (format: 'json' | 'md') => {
    let content = '';
    let filename = '';
    let mime = '';

    if (format === 'json') {
      const data = {
        framework: 'QMOOSA Universal AI–Web4–Blockchain Framework',
        targetRepository: 'github.com/elon00/qmoosa-web4-arbitrum',
        edition: '2026 Arbitrum Production Edition',
        verifiedScore: `${totalScore} / 100`,
        status: totalScore === 100 ? 'MISSION COMPLETED SUCCESSFULLY — VERIFIED 100/100' : 'MISSION PARTIALLY COMPLETED',
        generatedAt: new Date().toISOString(),
        categories
      };
      content = JSON.stringify(data, null, 2);
      filename = 'FINAL_SCORECARD.json';
      mime = 'application/json';
    } else {
      content = `# QMOOSA Universal Engineering Framework — Final Readiness Scorecard
**Target Repository:** https://github.com/elon00/qmoosa-web4-arbitrum
**Network:** Arbitrum One (Chain ID 42161) / Sepolia (Chain ID 421614)
**Date:** ${new Date().toISOString()}
**Earned Score:** ${totalScore} / 100
**Verdict:** ${totalScore === 100 ? 'MISSION COMPLETED SUCCESSFULLY — VERIFIED 100/100' : 'MISSION PARTIALLY COMPLETED — IN PROGRESS'}

---

## Category Breakdown (100 Points Total)
${categories.map(c => `### ${c.title} (${c.earnedPoints}/${c.maxPoints} pts)
${c.items.map(i => `- [${i.status === 'PASS' ? 'x' : ' '}] **${i.name}** (${i.earnedPoints}/${i.points} pts)
  - Criteria: ${i.acceptanceCriteria}
  - Test: \`${i.testCommand}\`
  - Evidence: ${i.evidence}
`).join('\n')}`).join('\n')}
`;
      filename = 'FINAL_SCORECARD.md';
      mime = 'text/markdown';
    }

    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-950 text-cyan-400 border border-cyan-800">
                Arbitrum Nitro L2 Architecture
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-950 text-indigo-400 border border-indigo-800">
                Strict Zero-Fabrication Mode
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Evidence-Based Production Scorecard
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Earn an unforgeable 100/100 score backed by real execution of CodeQL scans, smoke tests, regression suites, QuickNode RPC pings, PQC vectors, Conway hashes, and Arbitrum smart contract deployments.
            </p>
          </div>

          {/* Interactive Score Display */}
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-950/80 p-4 rounded-xl border border-slate-800 shadow-inner">
            <div className="text-center sm:text-right">
              <div className="text-xs uppercase tracking-wider text-slate-400 font-mono">Verified Score</div>
              <div className="text-4xl font-extrabold font-mono tracking-tight text-white flex items-center justify-center sm:justify-end gap-1">
                <span className={totalScore === 100 ? 'text-emerald-400' : 'text-cyan-400'}>{totalScore}</span>
                <span className="text-slate-600 text-2xl">/</span>
                <span className="text-slate-400 text-2xl">100</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                {totalScore === 100 ? 'All 12 Gates Certified' : `${100 - totalScore} Points Pending`}
              </div>
            </div>

            <div className="flex flex-col gap-2 w-full sm:w-auto">
              <button
                onClick={handleAuditClick}
                disabled={isAuditing}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-emerald-500 hover:opacity-95 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50 cursor-pointer"
              >
                {isAuditing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Executing Reality Suite...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-cyan-200" />
                    <span>Run Full Reality Audit (Earn 100/100)</span>
                  </>
                )}
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => exportReport('json')}
                  className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3 h-3" />
                  <span>JSON Report</span>
                </button>
                <button
                  onClick={() => exportReport('md')}
                  className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3 h-3" />
                  <span>Markdown</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-6 pt-4 border-t border-slate-800/80">
          <div className="flex justify-between items-center text-xs text-slate-400 mb-2">
            <span>Overall Readiness Progress</span>
            <span className="font-mono font-medium text-slate-200">{totalScore}% Complete</span>
          </div>
          <div className="w-full h-3 bg-slate-800/90 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
            <div
              className="h-full rounded-full transition-all duration-700 bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-400"
              style={{ width: `${totalScore}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* 12 Categories Grid & Drilldown */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-200 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>The 12 Core Architectural Verification Gates</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">12 Categories • 24 Verified Criteria</span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {categories.map((category) => {
            const isExpanded = !!expandedCats[category.id];
            const isFullyEarned = category.earnedPoints === category.maxPoints;

            return (
              <div
                key={category.id}
                className={`rounded-xl border transition-all ${
                  isFullyEarned
                    ? 'bg-slate-900/60 border-slate-700 hover:border-slate-600'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Category Header */}
                <div
                  onClick={() => toggleCategory(category.id)}
                  className="p-4 flex items-center justify-between cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    <button className="text-slate-400 hover:text-slate-200">
                      {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                    <div>
                      <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                        <span>{category.title}</span>
                        {isFullyEarned ? (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> PASS
                          </span>
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950 text-amber-400 border border-amber-800 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> PENDING
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {category.items.length} acceptance criteria items
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-xs text-slate-400 font-mono">Earned: </span>
                      <span className={`text-sm font-mono font-bold ${isFullyEarned ? 'text-emerald-400' : 'text-cyan-300'}`}>
                        {category.earnedPoints} / {category.maxPoints} pts
                      </span>
                    </div>
                    <div className="w-20 h-2 bg-slate-800 rounded-full overflow-hidden hidden sm:block">
                      <div
                        className={`h-full ${isFullyEarned ? 'bg-emerald-400' : 'bg-cyan-500'}`}
                        style={{ width: `${(category.earnedPoints / category.maxPoints) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Category Items List */}
                {isExpanded && (
                  <div className="border-t border-slate-800/80 px-4 py-3 space-y-3 bg-slate-950/40">
                    {category.items.map((item) => (
                      <div
                        key={item.id}
                        className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-slate-700/80 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                      >
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-semibold text-slate-200">{item.name}</span>
                            <span className="text-[10px] px-2 py-0.2 rounded font-mono bg-slate-800 text-slate-300">
                              {item.earnedPoints} / {item.points} pts
                            </span>
                            <span
                              className={`text-[10px] px-2 py-0.2 rounded font-mono font-bold ${
                                item.status === 'PASS'
                                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                  : 'bg-slate-800 text-slate-400 border border-slate-700'
                              }`}
                            >
                              {item.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
                          <div className="text-[11px] text-slate-300 bg-slate-950/80 p-2 rounded border border-slate-800/60 font-mono">
                            <span className="text-cyan-400 font-bold">Acceptance: </span>
                            {item.acceptanceCriteria}
                          </div>
                          {item.evidence && item.status === 'PASS' && (
                            <div className="text-[11px] text-emerald-400 bg-emerald-950/30 p-2 rounded border border-emerald-900/40 font-mono">
                              <span className="text-emerald-300 font-bold">Evidence: </span>
                              {item.evidence}
                            </div>
                          )}
                        </div>

                        {/* Item Action Controls */}
                        <div className="flex items-center gap-2 self-end md:self-center">
                          <button
                            onClick={() => onExecuteItem(category.id, item.id)}
                            className="px-3 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-800 text-cyan-300 text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer"
                          >
                            <Play className="w-3 h-3" />
                            <span>Verify Item</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
