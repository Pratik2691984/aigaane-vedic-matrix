'use client';

import React, { useMemo, useState } from 'react';
import { computeBiotensegrity, VISCERAL_LOCK_HZ } from '@/lib/biotensegrity';
import { computeHarmonicRoughness } from '@/lib/plompLevelt';
import { acousticEngine, SRUTI_LABELS } from '@/lib/secureAcoustics';
import { useMatrix } from '@/context/MatrixContext';
import { RAGA_ARCHETYPES } from '@/lib/vedicMatrixEngine.js';

const PACKED = [1/1, 256/243, 16/15, 10/9, 9/8, 32/27, 6/5, 5/4, 81/64, 4/3, 27/20, 45/32, 729/512, 3/2, 128/81, 8/5, 5/3, 27/16, 16/9, 9/5, 15/8, 243/128];

/** 0-based lattice slots for Malkauns {Sa, ga2, ma1, dha2, ni2}. */
const MALKAUNS_IDX = (RAGA_ARCHETYPES.malkauns.svaraIndices as number[]).map((n) => n - 1);

export default function BiotensegrityPanel() {
  const m = useMatrix();
  const [malkaunsOnly, setMalkaunsOnly] = useState(true);
  const [idx, setIdx] = useState(0);
  const allowed = malkaunsOnly ? MALKAUNS_IDX : PACKED.map((_, i) => i);
  const safeIdx = allowed.includes(idx) ? idx : allowed[0];
  const ratio = PACKED[safeIdx] ?? 1;
  const freq = m.baseSa * ratio;
  const roughness = useMemo(() => computeHarmonicRoughness(m.baseSa, ratio, 8), [m.baseSa, ratio]);
  const bio = useMemo(
    () => computeBiotensegrity(roughness, m.stress, m.vagal, freq, m.laya),
    [roughness, m.stress, m.vagal, freq, m.laya],
  );
  const prestressHot = bio.fascialPrestressKPa > 35;
  const coherent = bio.duralResonanceCoherence > 0.55;

  return (
    <div className="stack">
      <div className="bioten-container">
        <div className="bioten-header">
          <div>
            <div className="bioten-title">Fascial lattice (biotensegrity model)</div>
            <div className="bioten-subtitle">
              {malkaunsOnly
                ? '[MALKAUNS MODE] — indices [1, 7, 10, 16, 20] · Re and Pa varjit'
                : '[22-ŚRUTI FASCIA EXPLORER — GLOBAL LATTICE]'}
            </div>
          </div>
          <span className="bioten-card-val" style={{ color: 'var(--gold)', fontSize: '0.9rem' }}>
            {SRUTI_LABELS[safeIdx]} · {freq.toFixed(1)} Hz
          </span>
        </div>

        <div className="row">
          <button className={malkaunsOnly ? 'btn gold' : 'btn'} onClick={() => { setMalkaunsOnly(true); setIdx(0); }}>
            Malkauns mode
          </button>
          <button className={!malkaunsOnly ? 'btn gold' : 'btn'} onClick={() => setMalkaunsOnly(false)}>
            22-śruti lattice
          </button>
        </div>

        <label className="meta">Active microtone (śruti) #{safeIdx + 1}</label>
        <input
          type="range"
          min={0}
          max={21}
          value={safeIdx}
          onChange={(e) => {
            const next = +e.target.value;
            const nearest = allowed.reduce((best, i) => (Math.abs(i - next) < Math.abs(best - next) ? i : best), allowed[0]);
            setIdx(nearest);
          }}
        />
        <div className="row">
          <button className="btn gold" onClick={() => {
            const r = acousticEngine.trigger(safeIdx, m.baseSa);
            m.setTelemetry(`Fascia model · ${r.name} ${r.freq.toFixed(1)} Hz · roughness ${roughness.toFixed(3)}`);
          }}>Play śruti</button>
        </div>

        <div className="bioten-status-bar">
          {coherent
            ? 'Model state: low shear, higher dural coherence proxy'
            : 'Model state: higher phase scatter (raise vagal tone or lower stress)'}
        </div>

        <div className="bioten-grid">
          <div className="bioten-card">
            <span className="bioten-card-label">Fascial prestress (σ₀)</span>
            <span className="bioten-card-val" style={{ color: prestressHot ? 'var(--rose)' : 'var(--em)' }}>
              {bio.fascialPrestressKPa} kPa
            </span>
            <span className="bioten-card-sub">Myofascial tension load (model)</span>
          </div>
          <div className="bioten-card">
            <span className="bioten-card-label">Piezoelectric proxy</span>
            <span className="bioten-card-val">{bio.piezoelectricPotentialMv} mV</span>
            <span className="bioten-card-sub">Collagen streaming potential (model)</span>
          </div>
          <div className="bioten-card">
            <span className="bioten-card-label">Cellular shear strain</span>
            <span className="bioten-card-val" style={{ color: '#a78bfa' }}>{bio.cellularShearStrain}</span>
            <span className="bioten-card-sub">Integrin–cytoskeletal displacement (model)</span>
          </div>
          <div className="bioten-card">
            <span className="bioten-card-label">Dural coherence proxy</span>
            <span className="bioten-card-val" style={{ color: 'var(--gold)' }}>
              {(bio.duralResonanceCoherence * 100).toFixed(1)}%
            </span>
            <span className="bioten-card-sub">Peaks near slow laya (vilambita)</span>
          </div>
          <div className="bioten-card">
            <span className="bioten-card-label">Visceral lock vs {VISCERAL_LOCK_HZ} Hz</span>
            <span className="bioten-card-val">{(bio.visceralLock * 100).toFixed(1)}%</span>
            <span className="bioten-card-sub">Distance of active tone from 136.1 Hz</span>
          </div>
          <div className="bioten-card">
            <span className="bioten-card-label">Plomp–Levelt roughness</span>
            <span className="bioten-card-val">{roughness.toFixed(3)}</span>
            <span className="bioten-card-sub">Sa to current śruti, 8 partials</span>
          </div>
        </div>
      </div>
    </div>
  );
}
