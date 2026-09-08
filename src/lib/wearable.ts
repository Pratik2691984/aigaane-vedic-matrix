import type { WearableTelemetryPayload } from './types';
import { clamp, layaFromBpm } from './simulation';

const SRUTI_HINTS = [
  'Sa (1/1)',
  'Komal Re — Kumudvatī (16:15)',
  'Re (9/8)',
  'Ga (5/4)',
  'Ma (4/3)',
  'Pa (3/2)',
  'Dha (5/3)',
  'Ni (15/8)',
];

export function mockWearable(seed = Date.now()): WearableTelemetryPayload {
  const r = (n: number) => {
    const x = Math.sin(seed / 1000 + n) * 10000;
    return x - Math.floor(x);
  };
  const hr = 58 + Math.round(r(1) * 28);
  const hrv = 22 + Math.round(r(2) * 70);
  const br = 8 + Math.round(r(3) * 10);
  const balance = clamp((hrv - 20) / 80, 0, 1);
  return {
    timestamp: Date.now(),
    heartRateBpm: hr,
    hrvRmssdMs: hrv,
    respiratoryRateBrpm: br,
    skinTemperatureCelsius: 36.2 + r(4) * 0.8,
    sleepPerformanceScore: Math.round(55 + r(5) * 40),
    derivedStates: {
      autonomicBalanceIndex: Number(balance.toFixed(3)),
      recommendedLayaTempo: layaFromBpm(hr),
      suggestedSrutiTuning: SRUTI_HINTS[Math.floor(r(6) * SRUTI_HINTS.length)],
    },
  };
}

export function ingestWearable(p: WearableTelemetryPayload) {
  const stress = clamp((85 - p.hrvRmssdMs) / 0.65, 0, 100);
  const vagal = clamp(p.derivedStates.autonomicBalanceIndex * 100, 0, 100);
  const laya =
    p.derivedStates.recommendedLayaTempo === 'vilambita'
      ? 60
      : p.derivedStates.recommendedLayaTempo === 'madhya'
        ? 96
        : 132;
  return { stress, vagal, laya, payload: p };
}
