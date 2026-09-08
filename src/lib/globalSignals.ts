/** Prime-weighted date seed, rasa mix, psychoacoustics, 5-act lock. L must be 0. */

export const PRIME_WEIGHTS = { year: 7919, month: 701, day: 101, doy: 47, week: 13, weekday: 7, lunar: 19 } as const;
export const RASAS = ['Shringara','Hasya','Karuna','Raudra','Vira','Bhayanaka','Bibhatsa','Adbhuta','Santa'] as const;
export type RasaName = typeof RASAS[number];

export const LOCKED_5_ACT_PANELS = [
  { index: 1, act: 'Setup', rasa: 'Bhayanaka', verse: 'ghoram ghoram netram pasyet', trans: 'Threshold warning: the algorithmic eye awakens.', meter: 'GGGGGGGG', syllables: 8, matras: 16, target_bpm: 72, base_freq: 220.0, jnd_drift_hz: 1.8 },
  { index: 2, act: 'Rise', rasa: 'Hasya', verse: 'hartum na sakyam vittam ca', trans: 'Algorithmic absurdity: liquidity glitched, folly stays.', meter: 'GGLGGLGL', syllables: 8, matras: 13, target_bpm: 96, base_freq: 247.5, jnd_drift_hz: 0.5 },
  { index: 3, act: 'Climax', rasa: 'Karuna', verse: 'gitam sada mriyate na kadapi', trans: 'Timeless resonance: melody outliving structural decay.', meter: 'GLGLGLGLGLGL', syllables: 12, matras: 18, target_bpm: 128, base_freq: 330.0, jnd_drift_hz: 0.2 },
  { index: 4, act: 'Decel', rasa: 'Vira', verse: 'dhavatu dhavatu laksya-samipam', trans: 'Target sprint: athletic agency accelerating.', meter: 'GLLGLLGLLGG', syllables: 11, matras: 16, target_bpm: 100, base_freq: 293.33, jnd_drift_hz: 0.8 },
  { index: 5, act: 'Settle', rasa: 'Santa', verse: 'jagati samatara', trans: 'Universal calm: dynamic equilibrium restored.', meter: 'LLLLLLL', syllables: 7, matras: 7, target_bpm: 60, base_freq: 220.0, jnd_drift_hz: 0.0 },
] as const;

export function scanMatras(meter: string) {
  return meter.split('').reduce((s, c) => s + (c === 'G' ? 2 : 1), 0);
}

export function verificationLoss() {
  return LOCKED_5_ACT_PANELS.reduce((L, p) => L + Math.abs(scanMatras(p.meter) - p.matras) + Math.abs(p.syllables - p.meter.length), 0);
}

export function calculateSeed(dateStr: string): number {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  const start = Date.UTC(y, 0, 1);
  const doy = Math.floor((date.getTime() - start) / 86400000) + 1;
  const tmp = new Date(Date.UTC(y, m - 1, d));
  const jan4 = new Date(Date.UTC(y, 0, 4));
  const week = Math.ceil((((tmp.getTime() - jan4.getTime()) / 86400000) + jan4.getUTCDay() + 1) / 7);
  const weekday = (date.getUTCDay() + 6) % 7;
  const lunar = doy % 29.5;
  const seed =
    y * PRIME_WEIGHTS.year +
    m * PRIME_WEIGHTS.month +
    d * PRIME_WEIGHTS.day +
    doy * PRIME_WEIGHTS.doy +
    week * PRIME_WEIGHTS.week +
    weekday * PRIME_WEIGHTS.weekday +
    Math.floor(lunar * PRIME_WEIGHTS.lunar);
  return seed % 0x100000000;
}

export function calculateRasas(seed: number): Record<RasaName, number> {
  const phi = (1 + Math.sqrt(5)) / 2;
  const raw = RASAS.map((_, i) => Math.sin((seed % 100000) * (i + 1) * phi + (i * Math.PI) / 9) + 1);
  const total = raw.reduce((a, b) => a + b, 0);
  const out = {} as Record<RasaName, number>;
  RASAS.forEach((name, i) => { out[name] = Math.round((raw[i] / total) * 10000) / 100; });
  return out;
}

export function calculatePsychoacoustics(rasas: Record<string, number>) {
  const brightness =
    (rasas.Vira || 0) * 1.5 + (rasas.Raudra || 0) * 2 + (rasas.Hasya || 0) * 1.2 -
    ((rasas.Karuna || 0) * 1.3 + (rasas.Santa || 0) * 1.8 + (rasas.Bhayanaka || 0) * 0.8);
  const spectral_centroid_hz = Math.round(Math.max(600, Math.min(4500, 1800 + brightness * 25)) * 100) / 100;
  const volatility = (rasas.Bhayanaka || 0) + (rasas.Raudra || 0);
  const calm = rasas.Santa || 0;
  const dynamic_range_db = Math.round(Math.max(6, Math.min(24, 12 + (volatility - calm) * 0.25)) * 10) / 10;
  return {
    spectral_centroid_hz,
    dynamic_range_db,
    compression_ratio: dynamic_range_db < 10 ? '4:1' : '1.5:1',
    spatial_reverb_decay_sec: Math.round((1.2 + (rasas.Santa || 0) / 20) * 100) / 100,
  };
}

export const STYLE_SPECIFICATIONS = {
  comic_panel: {
    style: 'Graphic novel comic strip, 5-panel sequential narrative, bold ink, Ben-Day dots',
    format: '16:9',
    grid_layout: 'Asymmetric 5-box grid (top 2, bottom 3). Exactly 5 panels. No sixth cell. No duplicate acts.',
    color_space: 'CMYK pop with deep black shadows',
  },
  cinematic: {
    style: '35mm anamorphic still, atmospheric haze, film grain',
    format: '2.35:1',
    grid_layout: 'One wide frame, five focal points left to right. Not a 2x3 grid.',
    color_space: 'Teal and amber split tone',
  },
  academic: {
    style: 'Scientific plate, vector annotations, scansion waveforms',
    format: '1:1',
    grid_layout: 'Five modular segments only',
    color_space: 'Slate and gold traces',
  },
} as const;

export function masterCompositePrompt(dateStr: string, seed: number, styleKey: keyof typeof STYLE_SPECIFICATIONS = 'comic_panel') {
  const spec = STYLE_SPECIFICATIONS[styleKey];
  return `/imagine prompt: Complete 5-panel sequential page for Global Signal #${seed} on ${dateStr}. Composition: ${spec.grid_layout} Panel 1 Setup Bhayanaka bunker red alerts. Panel 2 Rise Hasya glitching servers. Panel 3 Climax Karuna golden gramophone in ruins. Panel 4 Decel Vira athletes on salt flats. Panel 5 Settle Santa figure over still water. Style: ${spec.style}. Palette: ${spec.color_space}. Crisp borders, captions under each act, exactly five boxes, no duplicate Vira or copied Panel 1 --ar ${spec.format} --v 6.0`;
}
