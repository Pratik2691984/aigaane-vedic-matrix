import type { SimState } from './types';

export function clamp(n: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, n));
}

/** Educational transfer functions. Not a clinical assay. */
export function computeSim(stress: number, vagalTone: number, layaBpm: number): SimState {
  const S = clamp(stress, 0, 100);
  const V = clamp(vagalTone, 0, 100);
  const L = clamp(layaBpm, 40, 180);
  const cortisol = 8.5 + S * 0.22;
  const heartRate = 60 + S * 0.35 - V * 0.15;
  const hrvRmssd = Math.max(12, 80 - S * 0.6 + V * 0.4);
  const bandwidth = Math.max(10, Math.min(100, 50 - S * 0.4 + V * 0.5));
  const inhibitionGain = 1 - V / 120;
  const cytokines = Math.max(0.1, 1 - V / 110);
  const breathRate = L / 4;
  const coherence = Math.exp(-Math.pow(L - 60, 2) / (2 * Math.pow(15, 2)));
  return {
    stress: S,
    vagalTone: V,
    layaBpm: L,
    cortisol,
    heartRate,
    hrvRmssd,
    bandwidth,
    inhibitionGain,
    cytokines,
    breathRate,
    coherence,
  };
}

export function stressFromHrv(rmssd: number): number {
  return clamp((80 - rmssd) / 0.6, 0, 100);
}

export function layaFromBpm(bpm: number): 'vilambita' | 'madhya' | 'druta' {
  if (bpm < 72) return 'vilambita';
  if (bpm < 110) return 'madhya';
  return 'druta';
}
