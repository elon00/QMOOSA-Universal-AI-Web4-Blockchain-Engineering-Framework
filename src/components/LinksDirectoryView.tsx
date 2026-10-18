import React, { useState } from 'react';
import { GENUINE_LINKS_DATA } from '../data/linksData';
import { GenuineLinkItem } from '../types';
import { ExternalLink, Search, Copy, Check, Bookmark, Globe } from 'lucide-react';

export const LinksDirectoryView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const categories = ['All', 'GitHub Repos', 'Blockchain', 'RPC', 'Protocols', 'AI & RSI', 'Testing & Security', 'Science & Math', 'Wallets & Tools'];

  const filteredLinks = GENUINE_LINKS_DATA.filter(link => {
    const matchesCat = selectedCategory === 'All' || link.category === selectedCategory;
    const matchesSearch =
      link.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.url.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center gap-1.5">
                <Bookmark className="w-3.5 h-3.5" /> Verified Technical References
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
                100% Genuine Direct Links
              </span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Genuine Links & Upstream Repository Directory
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Curated, verified links to official repositories, RFC specifications, enterprise RPC documentation, and scientific research code bases supporting the QMOOSA framework.
            </p>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3 pt-5 border-t border-slate-800/80 mt-5">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
            <input
              type="text"
              placeholder="Filter genuine links by name, URL, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap cursor-pointer transition-all ${
                  selectedCategory === cat
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Links Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLinks.map((link, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-3 group"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-400">
                  {link.category}
                </span>
                {link.officialTag && (
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                    {link.officialTag}
                  </span>
                )}
              </div>
              <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                {link.name}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                {link.description}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
              <span className="text-[11px] font-mono text-slate-500 truncate flex-1" title={link.url}>
                {link.url.replace('https://', '')}
              </span>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => handleCopy(link.url)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all cursor-pointer"
                  title="Copy URL"
                >
                  {copiedUrl === link.url ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 transition-all"
                  title="Open in new tab"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
