import React, { useState } from 'react';
import { Chapter } from '../types';
import { BookOpen, Search, Copy, Check, ExternalLink, Code2, ShieldAlert, Terminal, Layers } from 'lucide-react';

interface BookReaderViewProps {
  chapters: Chapter[];
}

export const BookReaderView: React.FC<BookReaderViewProps> = ({ chapters }) => {
  const [selectedChapterId, setSelectedChapterId] = useState<string>('ch-01');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  const selectedChapter = chapters.find(c => c.id === selectedChapterId) || chapters[0];

  const filteredChapters = chapters.filter(c =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.number.includes(searchQuery)
  );

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Table of Contents Sidebar */}
      <div className="lg:col-span-4 bg-slate-900/70 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-4 max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white tracking-wide">Table of Contents</h3>
          </div>
          <span className="text-xs font-mono text-cyan-400 font-semibold">20 Chapters</span>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search chapters or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Chapter List */}
        <div className="overflow-y-auto space-y-1.5 pr-1 flex-1 scrollbar-thin">
          {filteredChapters.map((ch) => {
            const isSelected = ch.id === selectedChapter.id;
            return (
              <button
                key={ch.id}
                onClick={() => setSelectedChapterId(ch.id)}
                className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-start gap-2.5 cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-950/80 border border-cyan-700/80 text-cyan-200 shadow-md shadow-cyan-950/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <span className="font-mono font-bold text-[11px] px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400">
                  {ch.number}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-200 truncate">{ch.title}</div>
                  <div className="text-[10px] text-slate-500 truncate mt-0.5">{ch.part}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Chapter Content Display */}
      <div className="lg:col-span-8 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        {/* Chapter Header */}
        <div className="border-b border-slate-800 pb-5 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
              {selectedChapter.part}
            </span>
            <span className="text-xs font-mono text-slate-500">
              Chapter {selectedChapter.number}
            </span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            {selectedChapter.title}
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed pt-1">
            {selectedChapter.summary}
          </p>
        </div>

        {/* Key Engineering Concepts */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Key Engineering Disciplines & Concepts</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {selectedChapter.keyConcepts.map((concept, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0"></span>
                <span>{concept}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Code Artifact / Reference Implementation */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono text-slate-300 font-semibold">
                {selectedChapter.codeSample.filename}
              </span>
            </div>
            <button
              onClick={() => handleCopyCode(selectedChapter.codeSample.code)}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1 transition-all cursor-pointer"
            >
              {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>

          <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 font-mono text-xs p-4 shadow-inner">
            <pre className="overflow-x-auto text-cyan-200/90 leading-relaxed scrollbar-thin">
              <code>{selectedChapter.codeSample.code}</code>
            </pre>
          </div>
        </div>

        {/* Acceptance Criteria & Test Gates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2.5">
            <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>Acceptance Criteria</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {selectedChapter.acceptanceCriteria.map((c, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2.5">
            <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-indigo-400" />
              <span>Mandatory Reality Test Gate</span>
            </h4>
            <div className="p-2.5 rounded bg-slate-900 border border-slate-800 font-mono text-xs text-cyan-300 break-all">
              $ {selectedChapter.testGate}
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              Test execution must output clean exit status 0 and log unforgeable evidence to earn readiness score.
            </p>
          </div>
        </div>

        {/* Genuine References & Source Links */}
        <div className="pt-2 border-t border-slate-800/80 space-y-2">
          <h4 className="text-xs font-semibold text-slate-400">Genuine Technical Documentation</h4>
          <div className="flex flex-wrap gap-2">
            {selectedChapter.genuineLinks.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-cyan-500/50 text-cyan-300 hover:text-cyan-200 text-xs font-mono flex items-center gap-1.5 transition-all"
              >
                <span>{link.label}</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
