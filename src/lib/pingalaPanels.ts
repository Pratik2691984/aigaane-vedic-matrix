/** Locked 5-act Piṅgala scansion. Loss L must be 0. */

export type PanelLock = {
  index: number;
  act: string;
  rasa: string;
  meter: string;
  syllables: number;
  matras: number;
  bpm: number;
};

export const PANEL_LOCK: PanelLock[] = [
  { index: 1, act: 'Setup', rasa: 'Bhayānaka', meter: 'GGGGGGGG', syllables: 8, matras: 16, bpm: 72 },
  { index: 2, act: 'Rise', rasa: 'Hāsya', meter: 'GGLGGLGL', syllables: 8, matras: 13, bpm: 96 },
  { index: 3, act: 'Climax', rasa: 'Karuṇa', meter: 'GLGLGLGLGLGL', syllables: 12, matras: 18, bpm: 128 },
  { index: 4, act: 'Decel', rasa: 'Vīra', meter: 'GLLGLLGLLGG', syllables: 11, matras: 16, bpm: 100 },
  { index: 5, act: 'Settle', rasa: 'Sānta', meter: 'LLLLLLL', syllables: 7, matras: 7, bpm: 60 },
];

export function scanMatras(meter: string): number {
  return meter.split('').reduce((s, c) => s + (c === 'G' ? 2 : 1), 0);
}

export function verificationLoss(panels: Array<{ meter: string; syllables: number; matras: number }>): number {
  return panels.reduce((loss, p, i) => {
    const lock = PANEL_LOCK[i];
    if (!lock) return loss + 99;
    return loss + Math.abs(p.matras - lock.matras) + Math.abs(p.syllables - lock.syllables) + Math.abs(scanMatras(p.meter) - lock.matras);
  }, 0);
}
