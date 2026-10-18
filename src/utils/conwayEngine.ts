// Conway Automaton Engine B3/S23
import { syncSha256Simulated } from './cryptoUtils';

export interface ConwayPreset {
  id: string;
  name: string;
  description: string;
  category: 'Oscillator' | 'Spaceship' | 'Gun' | 'Methuselah';
  pattern: [number, number][]; // [row, col] coordinates relative to offset
}

export const CONWAY_PRESETS: ConwayPreset[] = [
  {
    id: 'glider',
    name: 'Glider',
    category: 'Spaceship',
    description: 'Smallest spaceship; travels diagonally across the grid every 4 generations.',
    pattern: [[0, 1], [1, 2], [2, 0], [2, 1], [2, 2]]
  },
  {
    id: 'pulsar',
    name: 'Pulsar (Period 3)',
    category: 'Oscillator',
    description: 'Period-3 oscillator, naturally occurring and symmetrical.',
    pattern: [
      [1, 3], [1, 4], [1, 5], [1, 9], [1, 10], [1, 11],
      [3, 1], [3, 6], [3, 8], [3, 13],
      [4, 1], [4, 6], [4, 8], [4, 13],
      [5, 1], [5, 6], [5, 8], [5, 13],
      [6, 3], [6, 4], [6, 5], [6, 9], [6, 10], [6, 11],
      [8, 3], [8, 4], [8, 5], [8, 9], [8, 10], [8, 11],
      [9, 1], [9, 6], [9, 8], [9, 13],
      [10, 1], [10, 6], [10, 8], [10, 13],
      [11, 1], [11, 6], [11, 8], [11, 13],
      [13, 3], [13, 4], [13, 5], [13, 9], [13, 10], [13, 11]
    ]
  },
  {
    id: 'gosper-gun',
    name: 'Gosper Glider Gun',
    category: 'Gun',
    description: 'First known gun discovered by Bill Gosper (1970). Continuously shoots gliders.',
    pattern: [
      [5, 1], [5, 2], [6, 1], [6, 2],
      [5, 11], [6, 11], [7, 11], [4, 12], [8, 12], [3, 13], [9, 13], [3, 14], [9, 14],
      [6, 15], [4, 16], [8, 16], [5, 17], [6, 17], [7, 17], [6, 18],
      [3, 21], [4, 21], [5, 21], [3, 22], [4, 22], [5, 22], [2, 23], [6, 23],
      [1, 25], [2, 25], [6, 25], [7, 25],
      [3, 35], [4, 35], [3, 36], [4, 36]
    ]
  },
  {
    id: 'acorn',
    name: 'Acorn (Methuselah)',
    category: 'Methuselah',
    description: 'A 7-cell seed that takes 5,206 generations to stabilize, generating 13 gliders.',
    pattern: [[1, 2], [2, 4], [3, 1], [3, 2], [3, 5], [3, 6], [3, 7]]
  }
];

export function createEmptyGrid(rows: number, cols: number): boolean[][] {
  return Array.from({ length: rows }, () => Array(cols).fill(false));
}

export function createRandomGrid(rows: number, cols: number, density: number = 0.2): boolean[][] {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => Math.random() < density)
  );
}

export function applyPresetToGrid(
  preset: ConwayPreset,
  rows: number,
  cols: number,
  offsetRow: number = 5,
  offsetCol: number = 5
): boolean[][] {
  const grid = createEmptyGrid(rows, cols);
  for (const [r, c] of preset.pattern) {
    const targetR = (r + offsetRow + rows) % rows;
    const targetC = (c + offsetCol + cols) % cols;
    grid[targetR][targetC] = true;
  }
  return grid;
}

export function stepConwayGrid(grid: boolean[][]): { next: boolean[][]; population: number; stateHash: string } {
  const rows = grid.length;
  const cols = grid[0].length;
  const next = createEmptyGrid(rows, cols);
  let population = 0;
  let serialized = '';

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let liveNeighbors = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = (r + dr + rows) % rows;
          const nc = (c + dc + cols) % cols;
          if (grid[nr][nc]) liveNeighbors++;
        }
      }

      const isAlive = grid[r][c];
      const willLive = isAlive ? (liveNeighbors === 2 || liveNeighbors === 3) : (liveNeighbors === 3);
      next[r][c] = willLive;
      if (willLive) {
        population++;
        serialized += `${r},${c};`;
      }
    }
  }

  const stateHash = syncSha256Simulated(serialized || 'empty-grid');
  return { next, population, stateHash };
}
