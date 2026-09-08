import type { SimState } from './types';

export function clamp(n: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, n));
}

export function computeSim(stress: number, vagalTone: number, layaBpm: number): SimState {
  const S = clamp(stress, 0, 100);
  const V = clamp(vagalTone, 0, 100);
  const L = clamp(layaBpm, 40, 180);
  const cortisol = 8 + S * 0.45;
  const vagal = Math.max(0, 100 - S * 0.75);
  const mixedVagal = clamp(0.5 * V + 0.5 * vagal, 0, 100);
  const heartRate = 60 + S * 0.4;
  const hrvRmssd = Math.max(10, 85 - S * 0.65 + (V - 50) * 0.2);
  const bandwidth = 40 + V * 0.6;
  const inhibitionGain = 1 - V / 120;
  const cytokines = Math.max(0.1, 1 - V / 110);
  const breathRate = L / 4;
  const coherence = Math.exp(-Math.pow((L - 60) / 28, 2));
  return {
    stress: S,
    vagalTone: mixedVagal,
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
  return clamp((85 - rmssd) / 0.65, 0, 100);
}

export function layaFromBpm(bpm: number): 'Vilambit' | 'Madhya' | 'Drut' {
  if (bpm < 72) return 'Vilambit';
  if (bpm < 110) return 'Madhya';
  return 'Drut';
}
