import React, { useState, useEffect, useRef } from 'react';
import { CONWAY_PRESETS, createEmptyGrid, createRandomGrid, applyPresetToGrid, stepConwayGrid, ConwayPreset } from '../utils/conwayEngine';
import { Cpu, Play, Pause, SkipForward, RotateCcw, Shuffle, Sparkles, ExternalLink, Hash } from 'lucide-react';

const ROWS = 36;
const COLS = 48;
const CELL_SIZE = 14;

export const ConwayEngineView: React.FC = () => {
  const [grid, setGrid] = useState<boolean[][]>(() => {
    return applyPresetToGrid(CONWAY_PRESETS[1], ROWS, COLS, 10, 16); // Start with Pulsar
  });
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [speedMs, setSpeedMs] = useState<number>(120);
  const [generation, setGeneration] = useState<number>(0);
  const [population, setPopulation] = useState<number>(48);
  const [stateHash, setStateHash] = useState<string>('9a7b21...440c');
  const [history, setHistory] = useState<{ gen: number; pop: number; hash: string }[]>([]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Draw grid on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#020617'; // slate-950
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines
    ctx.strokeStyle = '#0f172a'; // slate-900
    ctx.lineWidth = 0.5;
    for (let r = 0; r <= ROWS; r++) {
      ctx.beginPath();
      ctx.moveTo(0, r * CELL_SIZE);
      ctx.lineTo(COLS * CELL_SIZE, r * CELL_SIZE);
      ctx.stroke();
    }
    for (let c = 0; c <= COLS; c++) {
      ctx.beginPath();
      ctx.moveTo(c * CELL_SIZE, 0);
      ctx.lineTo(c * CELL_SIZE, ROWS * CELL_SIZE);
      ctx.stroke();
    }

    // Draw live cells
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (grid[r][c]) {
          // Gradient or glow for live cells
          ctx.fillStyle = '#22d3ee'; // cyan-400
          ctx.shadowColor = '#06b6d4';
          ctx.shadowBlur = 4;
          ctx.fillRect(c * CELL_SIZE + 1, r * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);
          ctx.shadowBlur = 0;
        }
      }
    }
  }, [grid]);

  // Simulation tick loop
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setGrid(prev => {
        const { next, population: pop, stateHash: hash } = stepConwayGrid(prev);
        setPopulation(pop);
        setStateHash(hash);
        setGeneration(g => {
          const nextG = g + 1;
          setHistory(h => [{ gen: nextG, pop, hash: hash.slice(0, 16) }, ...h.slice(0, 9)]);
          return nextG;
        });
        return next;
      });
    }, speedMs);

    return () => clearInterval(interval);
  }, [isRunning, speedMs]);

  const handleStep = () => {
    const { next, population: pop, stateHash: hash } = stepConwayGrid(grid);
    setGrid(next);
    setPopulation(pop);
    setStateHash(hash);
    setGeneration(g => g + 1);
    setHistory(h => [{ gen: generation + 1, pop, hash: hash.slice(0, 16) }, ...h.slice(0, 9)]);
  };

  const handleReset = () => {
    setIsRunning(false);
    const empty = createEmptyGrid(ROWS, COLS);
    setGrid(empty);
    setGeneration(0);
    setPopulation(0);
    setStateHash('0000000000000000');
    setHistory([]);
  };

  const handleRandomize = () => {
    setIsRunning(false);
    const random = createRandomGrid(ROWS, COLS, 0.22);
    setGrid(random);
    setGeneration(0);
    const { population: pop, stateHash: hash } = stepConwayGrid(random);
    setPopulation(pop);
    setStateHash(hash);
  };

  const loadPreset = (preset: ConwayPreset) => {
    setIsRunning(false);
    const loaded = applyPresetToGrid(preset, ROWS, COLS, 8, 12);
    setGrid(loaded);
    setGeneration(0);
    const { population: pop, stateHash: hash } = stepConwayGrid(loaded);
    setPopulation(pop);
    setStateHash(hash);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const col = Math.floor(x / CELL_SIZE);
    const row = Math.floor(y / CELL_SIZE);

    if (row >= 0 && row < ROWS && col >= 0 && col < COLS) {
      setGrid(prev => {
        const next = prev.map(r => [...r]);
        next[row][col] = !next[row][col];
        return next;
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" /> Deterministic Cellular Automaton
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-950 text-indigo-400 border border-indigo-800">
                Rule B3/S23 Standard
              </span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Conway Automaton Simulation Engine
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Deterministic B3/S23 cellular evolution engine with SHA-256 state hashing across generations. Used for decentralized workload modeling, agent scheduling entropy, and algorithmic exploration.
            </p>
          </div>

          <a
            href="https://conwaylife.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 border border-slate-700 transition-all shrink-0"
          >
            <span>ConwayLife.com</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
          <div className="text-xs text-slate-400">Current Generation</div>
          <div className="text-2xl font-mono font-bold text-white mt-1">#{generation}</div>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
          <div className="text-xs text-slate-400">Living Population</div>
          <div className="text-2xl font-mono font-bold text-cyan-400 mt-1">{population} cells</div>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
          <div className="text-xs text-slate-400">Evolution Rate</div>
          <div className="text-2xl font-mono font-bold text-indigo-300 mt-1">{speedMs} ms/gen</div>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
          <div className="text-xs text-slate-400">Deterministic State Hash</div>
          <div className="text-sm font-mono font-bold text-emerald-400 mt-1 truncate" title={stateHash}>
            {stateHash.slice(0, 16)}...
          </div>
        </div>
      </div>

      {/* Controls & Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Canvas Grid View */}
        <div className="lg:col-span-8 p-4 rounded-2xl bg-slate-950 border border-slate-800 shadow-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
            {/* Play / Step / Reset Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`px-3.5 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all ${
                  isRunning
                    ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-md'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                }`}
              >
                {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isRunning ? 'Pause' : 'Play'}</span>
              </button>

              <button
                onClick={handleStep}
                disabled={isRunning}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1 disabled:opacity-40 cursor-pointer"
              >
                <SkipForward className="w-3 h-3" />
                <span>Step</span>
              </button>

              <button
                onClick={handleRandomize}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1 cursor-pointer"
              >
                <Shuffle className="w-3 h-3" />
                <span>Random</span>
              </button>

              <button
                onClick={handleReset}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-300 text-xs font-mono flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Clear</span>
              </button>
            </div>

            {/* Speed Slider */}
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>Speed:</span>
              <input
                type="range"
                min="30"
                max="400"
                step="10"
                value={speedMs}
                onChange={(e) => setSpeedMs(Number(e.target.value))}
                className="w-24 accent-cyan-500"
              />
            </div>
          </div>

          {/* Interactive Canvas */}
          <div className="flex justify-center overflow-x-auto bg-slate-950 p-2 rounded-xl border border-slate-900 cursor-crosshair">
            <canvas
              ref={canvasRef}
              width={COLS * CELL_SIZE}
              height={ROWS * CELL_SIZE}
              onClick={handleCanvasClick}
              className="rounded-lg shadow-inner"
            />
          </div>
          <div className="text-[11px] text-slate-500 text-center font-mono">
            Click any cell on the grid to toggle life state manually.
          </div>
        </div>

        {/* Presets & Evolution Hash Audit Log */}
        <div className="lg:col-span-4 space-y-4">
          {/* Canonical Presets */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Canonical Test Presets</span>
            </h3>
            <div className="space-y-2">
              {CONWAY_PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => loadPreset(p)}
                  className="w-full text-left p-2.5 rounded-lg bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800 text-xs transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between font-semibold text-slate-200">
                    <span>{p.name}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-cyan-300 font-mono">
                      {p.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{p.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* State Hash Invariant History */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5 font-mono text-xs">
            <h4 className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-cyan-400" />
              <span>Deterministic Hash Audit Trail</span>
            </h4>
            <div className="space-y-1 text-[11px] max-h-48 overflow-y-auto scrollbar-thin">
              {history.length === 0 ? (
                <div className="text-slate-600">Run simulation to record state hash deltas...</div>
              ) : (
                history.map((h, i) => (
                  <div key={i} className="flex justify-between text-slate-300">
                    <span className="text-slate-500">G#{h.gen} (pop: {h.pop})</span>
                    <span className="text-cyan-300">{h.hash}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
