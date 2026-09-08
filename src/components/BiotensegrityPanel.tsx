'use client';

import React, { useMemo } from 'react';
import { computeBiotensegrity } from '@/lib/biotensegrity';

interface BiotensegrityProps {
  roughness: number;
  stress: number;
  vagalTone: number;
  targetFreq: number;
  srutiName: string;
}

export default function BiotensegrityPanel({
  roughness,
  stress,
  vagalTone,
  targetFreq,
  srutiName,
}: BiotensegrityProps) {
  const bioState = useMemo(
    () => computeBiotensegrity(roughness, stress, vagalTone, targetFreq),
    [roughness, stress, vagalTone, targetFreq],
  );

  const prestressHot = bioState.fascialPrestressKPa > 35;
  const coherent = bioState.duralResonanceCoherence > 0.75;

  return (
    <div className="bioten-container">
      <div className="bioten-header">
        <div>
          <div className="bioten-title">Biotensegrity Acoustic Transduction</div>
          <div className="bioten-subtitle">
            Fascial prestress · piezoelectric polarization · cellular mechanics
          </div>
        </div>
        <span className="bioten-card-val" style={{ color: 'var(--gold)', fontSize: '0.9rem' }}>
          {srutiName} ({targetFreq.toFixed(1)} Hz)
        </span>
      </div>

      <div className="bioten-status-bar">
        Mechanotransduction: {coherent
          ? 'Coherent harmonious integration (low shear)'
          : 'Phase asymmetry detected (dural dispersion)'}
      </div>

      <div className="bioten-grid">
        <div className="bioten-card">
          <span className="bioten-card-label">Fascial prestress (σ₀)</span>
          <span className="bioten-card-val" style={{ color: prestressHot ? 'var(--rose)' : 'var(--em)' }}>
            {bioState.fascialPrestressKPa} kPa
          </span>
          <span className="bioten-card-sub">Myofascial tension load</span>
        </div>
        <div className="bioten-card">
          <span className="bioten-card-label">Piezoelectric output</span>
          <span className="bioten-card-val">{bioState.piezoelectricPotentialMv} mV</span>
          <span className="bioten-card-sub">Collagen matrix streaming potential</span>
        </div>
        <div className="bioten-card">
          <span className="bioten-card-label">Cellular shear strain</span>
          <span className="bioten-card-val" style={{ color: '#a78bfa' }}>
            {bioState.cellularShearStrain}
          </span>
          <span className="bioten-card-sub">Integrin–cytoskeletal displacement</span>
        </div>
        <div className="bioten-card">
          <span className="bioten-card-label">Dural coherence</span>
          <span className="bioten-card-val" style={{ color: 'var(--gold)' }}>
            {(bioState.duralResonanceCoherence * 100).toFixed(1)}%
          </span>
          <span className="bioten-card-sub">Craniosacral reciprocal tension</span>
        </div>
      </div>
    </div>
  );
}
