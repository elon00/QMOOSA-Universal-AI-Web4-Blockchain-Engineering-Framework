import React, { useState } from 'react';
import { Header } from './components/Header';
import { ScorecardView } from './components/ScorecardView';
import { BookReaderView } from './components/BookReaderView';
import { ArbitrumQuickNodeView } from './components/ArbitrumQuickNodeView';
import { X402BazaarView } from './components/X402BazaarView';
import { ConwayEngineView } from './components/ConwayEngineView';
import { PqcStudioView } from './components/PqcStudioView';
import { RavenReaView } from './components/RavenReaView';
import { AlphaFoldTensorView } from './components/AlphaFoldTensorView';
import { AiAgenticsView } from './components/AiAgenticsView';
import { TokenomicsLaunchpadView } from './components/TokenomicsLaunchpadView';
import { WalletQrView } from './components/WalletQrView';
import { TestingCodeqlView } from './components/TestingCodeqlView';
import { LinksDirectoryView } from './components/LinksDirectoryView';
import { INITIAL_SCORECARD_CATEGORIES } from './data/scorecardData';
import { CHAPTERS_DATA } from './data/chaptersData';
import { evaluateFullScorecard } from './utils/testRunner';
import { ScorecardCategory } from './types';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('scorecard');
  const [categories, setCategories] = useState<ScorecardCategory[]>(INITIAL_SCORECARD_CATEGORIES);
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [walletConnected, setWalletConnected] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string>('0x71C840A8129Fa483e5a20Eb4043b35C8349fa891');

  // Compute total earned points dynamically
  const totalScore = categories.reduce((sum, cat) => sum + cat.earnedPoints, 0);

  // The browser has no trusted CI evidence source; clicks cannot certify a repository.
  const handleRunFullAudit = () => {
    setIsAuditing(true);
    setCategories(previous => evaluateFullScorecard(previous));
    setIsAuditing(false);
  };

  const handleExecuteItem = (categoryId: string, itemId: string) => {
    setCategories(previous => previous.map(category => {
      if (category.id !== categoryId) return category;
      return {
        ...category,
        earnedPoints: 0,
        items: category.items.map(item => ({
          ...item,
          status: (item.status === 'NOT_APPLICABLE' ? 'NOT_APPLICABLE' : 'NOT_RUN') as 'NOT_RUN' | 'NOT_APPLICABLE',
          earnedPoints: 0,
          evidence: item.id === itemId
            ? 'NOT_RUN: No command was executed in this browser; validate through GitHub Actions with auditable logs.'
            : item.evidence
        }))
      };
    }));
  };

  const handleConnectWallet = () => {
    // Wallet integration is not implemented in this framework UI. Never fabricate a connection.
    setWalletConnected(false);
  };

  const handleDisconnectWallet = () => {
    setWalletConnected(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Universal Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        totalScore={totalScore}
        walletConnected={walletConnected}
        walletAddress={walletAddress}
        onConnectWallet={handleConnectWallet}
        onDisconnectWallet={handleDisconnectWallet}
        onRunAudit={handleRunFullAudit}
        isAuditing={isAuditing}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {activeTab === 'scorecard' && (
          <ScorecardView
            categories={categories}
            totalScore={totalScore}
            onRunAudit={handleRunFullAudit}
            isAuditing={isAuditing}
            onExecuteItem={handleExecuteItem}
          />
        )}

        {activeTab === 'book' && (
          <BookReaderView chapters={CHAPTERS_DATA} />
        )}

        {activeTab === 'quicknode' && (
          <ArbitrumQuickNodeView />
        )}

        {activeTab === 'x402' && (
          <X402BazaarView />
        )}

        {activeTab === 'conway' && (
          <ConwayEngineView />
        )}

        {activeTab === 'pqc' && (
          <PqcStudioView />
        )}

        {activeTab === 'raven-rea' && (
          <RavenReaView />
        )}

        {activeTab === 'agents' && (
          <AiAgenticsView />
        )}

        {activeTab === 'science' && (
          <AlphaFoldTensorView />
        )}

        {activeTab === 'tokenomics' && (
          <TokenomicsLaunchpadView />
        )}

        {activeTab === 'testing' && (
          <TestingCodeqlView />
        )}

        {activeTab === 'links' && (
          <LinksDirectoryView />
        )}
      </main>

      {/* Engineering Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>QMOOSA Universal AI–Web4 Framework (Arbitrum Edition 2026)</span>
            <span>•</span>
            <span className="text-slate-400">Commit e4f8a1290bb34c</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/elon00/qmoosa-web4-arbitrum"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              github.com/elon00/qmoosa-web4-arbitrum
            </a>
            <span>•</span>
            <span className="text-slate-400">Arbiscan Verified</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
