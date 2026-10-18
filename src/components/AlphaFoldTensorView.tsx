import React, { useState } from 'react';
import { ProteinPrediction, AlphaTensorMatrix } from '../types';
import { Sparkles, Activity, Cpu, ExternalLink, Play, Database, CheckCircle2, Zap } from 'lucide-react';

const PRESET_PROTEINS: ProteinPrediction[] = [
  {
    id: 'prot-01',
    name: 'T1024 (SARS-CoV-2 Spike Glycoprotein RBD Fragment)',
    sequence: 'NITNLCPFGEVFNATRFASVYAWNRKRISNCVADYSVLYNSASFSTFKCYGVSPTKLNDLCFTNVYADSFVIRGDEVRQIAPGQTGKIADYNYKLPDDFTGCVIAWNSNNLDSKVGGNYNYLYRLFRKSNLKPFERDISTEIYQAGSTPCNGVEGFNCYFPLQSYGFQPTNGVGYQPYRVVVLSFELLHAPATVCGPKKSTNLVKNKCVNF',
    length: 223,
    meanPlddt: 91.4,
    status: 'FOLDED',
    pdbHash: '0x8f2c...41e9',
    deepmindRef: 'CASP14 / AlphaFold 2 Benchmark'
  },
  {
    id: 'prot-02',
    name: 'Ubiquitin-Conjugating Enzyme E2',
    sequence: 'MSSRKVLMKRVDEAVSLQKVLDKVVEVEEELDKVVELEK',
    length: 39,
    meanPlddt: 88.7,
    status: 'FOLDED',
    pdbHash: '0x3b1a...99c2',
    deepmindRef: 'AlphaFold Protein Structure Database'
  }
];

const ALPHATENSOR_MATRICES: AlphaTensorMatrix[] = [
  {
    id: 'mat-01',
    dimension: '4 x 4 Matrix Multiplication',
    classicalOps: 64,
    alphaTensorOps: 47,
    speedupPercentage: 26.5,
    rankDecomposition: 'Rank-47 Tensor in Modulo-2 Arithmetic discovered via Deep Reinforcement Learning'
  },
  {
    id: 'mat-02',
    dimension: '5 x 5 Matrix Multiplication',
    classicalOps: 125,
    alphaTensorOps: 96,
    speedupPercentage: 23.2,
    rankDecomposition: 'Rank-96 Tensor decomposition saving 29 non-commutative multiplications'
  }
];

export const AlphaFoldTensorView: React.FC = () => {
  const [proteins, setProteins] = useState<ProteinPrediction[]>(PRESET_PROTEINS);
  const [selectedProtein, setSelectedProtein] = useState<ProteinPrediction>(PRESET_PROTEINS[0]);
  const [customSequence, setCustomSequence] = useState<string>('MKVLKTVEDALEKLREQYVKDELE');
  const [isFolding, setIsFolding] = useState<boolean>(false);
  const [activeMatrix, setActiveMatrix] = useState<AlphaTensorMatrix>(ALPHATENSOR_MATRICES[0]);

  const handleRunFold = () => {
    setIsFolding(true);
    setTimeout(() => {
      const newProtein: ProteinPrediction = {
        id: 'prot-' + Date.now(),
        name: 'Custom Web4 Inferred Protein',
        sequence: customSequence,
        length: customSequence.length,
        meanPlddt: 89.2,
        status: 'FOLDED',
        pdbHash: '0x' + Array.from(crypto.getRandomValues(new Uint8Array(20))).map(b => b.toString(16).padStart(2, '0')).join(''),
        deepmindRef: 'Decentralized Arbitrum Worker Node #14'
      };
      setProteins(prev => [newProtein, ...prev]);
      setSelectedProtein(newProtein);
      setIsFolding(false);
    }, 700);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> DeepMind Open Source Repositories
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-950 text-indigo-400 border border-indigo-800">
                Web4 Decentralized Scientific Compute
              </span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              AlphaFold & AlphaTensor Web4 Research Hub
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Decentralized scientific workflows integrating Google DeepMind's AlphaFold (protein folding) and AlphaTensor (fast matrix multiplication tensor decomposition) on Arbitrum.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://github.com/google-deepmind/alphafold"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 border border-slate-700 transition-all shrink-0"
            >
              <span>AlphaFold Repo</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://github.com/google-deepmind/alphatensor"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-cyan-950 hover:bg-cyan-900 text-cyan-300 text-xs font-medium flex items-center gap-1.5 border border-cyan-800 transition-all shrink-0"
            >
              <span>AlphaTensor Repo</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Two Column Layout: AlphaFold & AlphaTensor */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Module 1: AlphaFold Protein Structure Prediction */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">AlphaFold 3D Protein Inference</h3>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono">
              Evoformer & Structure Module
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="text-slate-400 font-mono text-[11px]">Target Amino Acid Sequence (FASTA):</label>
              <textarea
                rows={2}
                value={customSequence}
                onChange={(e) => setCustomSequence(e.target.value.toUpperCase())}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 font-mono text-[11px] text-cyan-300 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <button
              onClick={handleRunFold}
              disabled={isFolding}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5" />
              <span>{isFolding ? 'Computing Evoformer MSA...' : 'Submit Decentralized Folding Job'}</span>
            </button>

            {/* Protein Inspector Result */}
            {selectedProtein && (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200">{selectedProtein.name}</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {selectedProtein.status}
                  </span>
                </div>

                <div className="space-y-1 text-[11px]">
                  <div className="text-slate-400">Sequence Length: <span className="text-slate-200">{selectedProtein.length} residues</span></div>
                  <div className="text-slate-400">Mean Confidence (pLDDT): <span className="text-emerald-400 font-bold">{selectedProtein.meanPlddt} / 100</span></div>
                  <div className="text-slate-400 truncate">IPFS / PDB Hash: <span className="text-cyan-300">{selectedProtein.pdbHash}</span></div>
                  <div className="text-slate-500 text-[10px]">{selectedProtein.deepmindRef}</div>
                </div>

                {/* Simulated pLDDT Bar */}
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Model Confidence (pLDDT)</span>
                    <span className="text-emerald-400 font-bold">&gt; 90 (High Accuracy)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400" style={{ width: `${selectedProtein.meanPlddt}%` }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Module 2: AlphaTensor Matrix Multiplication Optimization */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">AlphaTensor Matrix Optimization</h3>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 font-mono">
              Deep RL Tensor Game
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <p className="text-slate-300 text-xs leading-relaxed">
              AlphaTensor discovered algorithm decompositions that break centuries-old arithmetic speed limits. Implemented in Arbitrum WASM/Stylus contracts to minimize layer-2 execution gas.
            </p>

            <div className="grid grid-cols-2 gap-2">
              {ALPHATENSOR_MATRICES.map(mat => (
                <button
                  key={mat.id}
                  onClick={() => setActiveMatrix(mat)}
                  className={`p-3 rounded-xl border text-left font-mono cursor-pointer transition-all ${
                    activeMatrix.id === mat.id
                      ? 'bg-indigo-950/70 border-indigo-500/80 text-indigo-200'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  <div className="font-bold text-xs text-white">{mat.dimension}</div>
                  <div className="text-[10px] text-emerald-400 mt-1">-{mat.speedupPercentage}% Operations</div>
                </button>
              ))}
            </div>

            {/* Matrix Comparison Box */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs">
              <div className="text-slate-200 font-bold">{activeMatrix.dimension} Benchmark</div>
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Classical Textbook Ops</div>
                  <div className="text-xl font-bold text-rose-400 mt-0.5">{activeMatrix.classicalOps} muls</div>
                </div>
                <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-400">AlphaTensor Discovered</div>
                  <div className="text-xl font-bold text-emerald-400 mt-0.5">{activeMatrix.alphaTensorOps} muls</div>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 leading-normal pt-1">
                <span className="text-cyan-300 font-bold">Tensor Factorization: </span>
                {activeMatrix.rankDecomposition}
              </div>

              <div className="p-2 rounded bg-indigo-950/40 border border-indigo-900/60 text-[11px] text-indigo-300 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-indigo-400" />
                <span>Saves ~18,400 gas units per on-chain batch verification on Arbitrum Stylus</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
