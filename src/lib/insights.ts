import type { SubsystemNode } from './types';

export function dayOfYear(d = new Date()): number {
  const start = Date.UTC(d.getFullYear(), 0, 0);
  const now = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
  return Math.floor((now - start) / 86400000);
}

export function spotlightIndex(d = new Date()): number {
  return (dayOfYear(d) % 51) + 1;
}

export function bandForIndex(i: number) {
  if (i <= 10) {
    return {
      band: 'Physical Foundation',
      insight: 'Cellular electrolytes drive peripheral nerve depolarization for sound processing.',
      action: 'Hydrate with balanced mineral salts prior to acoustic recitation.',
    };
  }
  if (i <= 24) {
    return {
      band: 'Cognition & Awareness',
      insight: 'Prefrontal executive inhibition gates sensory auditory distractions.',
      action: 'Perform 5 minutes of focused Dhāraṇā on a single Śruti tone.',
    };
  }
  if (i <= 33) {
    return {
      band: 'Physical & Chemical Bridges',
      insight: 'Diaphragmatic excursion stimulates vagal afferents, lowering cortisol.',
      action: 'Execute 0.1 Hz resonance breathing (4s inhale, 6s exhale).',
    };
  }
  if (i <= 45) {
    return {
      band: 'Vedic Sound & Prosody',
      insight: 'Microtonal intervals without acoustic beats stabilize brainstem auditory evoked potentials.',
      action: 'Listen to or chant pure Just Intonation scales (Sa → Pa).',
    };
  }
  return {
    band: 'Empirical Verification',
    insight: 'High-frequency heart rate variability tracks internal autonomic stability.',
    action: 'Correlate morning HRV readings against rhythmic vocal sessions.',
  };
}

export function dailyInsight(nodes: SubsystemNode[], d = new Date()) {
  const index = spotlightIndex(d);
  const node = nodes.find((n) => n.index === index) ?? nodes[0];
  return { index, node, ...bandForIndex(index), day: dayOfYear(d) };
}
