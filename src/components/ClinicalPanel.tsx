'use client';

import React from 'react';
import { useMatrix } from '@/context/MatrixContext';

export default function ClinicalPanel() {
  const { sim, stress, vagal, laya } = useMatrix();
  const layaName = laya < 72 ? 'slow (vilambita)' : laya < 110 ? 'medium (madhya)' : 'fast (druta)';
  return (
    <div className="stack">
      <p className="sub">
        Working bench — educational physiology model. Not a medical device and not a diagnosis.
      </p>
      <div className="metrics">
        <div>Cortisol model <b>{sim.cortisol.toFixed(2)}</b> ug/dL</div>
        <div>Heart rate <b>{sim.heartRate.toFixed(1)}</b> BPM</div>
        <div>RMSSD <b>{sim.hrvRmssd.toFixed(1)}</b> ms</div>
        <div>Executive bandwidth <b>{sim.bandwidth.toFixed(0)}</b>%</div>
        <div>Resonance Ψ <b>{sim.coherence.toFixed(3)}</b></div>
        <div>Breath estimate <b>{sim.breathRate.toFixed(1)}</b> / min</div>
      </div>
      <pre className="tel" style={{ whiteSpace: 'pre-wrap' }}>{`Cortisol = 8.5 + (S × 0.22)
HR = 60 + (S × 0.35) − (V × 0.15)
RMSSD = max(12, 80 − S×0.60 + V×0.40)
Bandwidth = clamp(50 − S×0.40 + V×0.50, 10, 100)
Ψ = exp(−(L − 60)² / (2 × 15²))

S=${stress.toFixed(0)}  V=${vagal.toFixed(0)}  L=${laya.toFixed(0)} BPM ${layaName}
Peak cardiorespiratory lock when laya ≈ 60 BPM (0.1 Hz).`}</pre>
    </div>
  );
}
