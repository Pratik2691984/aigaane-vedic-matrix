'use client';

import React, { useMemo, useState } from 'react';
import { acousticEngine } from '@/lib/secureAcoustics';
import {
  computeHarmonicRoughness,
  roughnessDeltaVsTet,
  SYNTONIC_COMMA,
  SYNTONIC_COMMA_CENTS,
} from '@/lib/plompLevelt';
import { useMatrix } from '@/context/MatrixContext';
import BiotensegrityPanel from './BiotensegrityPanel';

interface SrutiData {
  index: number;
  symbol: string;
  nameIast: string;
  ratioStr: string;
  num: number;
  den: number;
  tetCents: number;
}

const SRUTI_SPECS: SrutiData[] = [
  { index: 1, symbol: 'Sa', nameIast: 'Kṣamā / Ṣaḍja', ratioStr: '1/1', num: 1, den: 1, tetCents: 0 },
  { index: 2, symbol: 're₁', nameIast: 'Tīvrā', ratioStr: '256/243', num: 256, den: 243, tetCents: 100 },
  { index: 3, symbol: 're₂', nameIast: 'Kumudvatī', ratioStr: '16/15', num: 16, den: 15, tetCents: 100 },
  { index: 4, symbol: 'Re₃', nameIast: 'Mandā', ratioStr: '10/9', num: 10, den: 9, tetCents: 200 },
  { index: 5, symbol: 'Re₄', nameIast: 'Chandovatī', ratioStr: '9/8', num: 9, den: 8, tetCents: 200 },
  { index: 6, symbol: 'ga₁', nameIast: 'Dayāvatī', ratioStr: '32/27', num: 32, den: 27, tetCents: 300 },
  { index: 7, symbol: 'ga₂', nameIast: 'Rañjanī', ratioStr: '6/5', num: 6, den: 5, tetCents: 300 },
  { index: 8, symbol: 'Ga₃', nameIast: 'Raktikā', ratioStr: '5/4', num: 5, den: 4, tetCents: 400 },
  { index: 9, symbol: 'Ga₄', nameIast: 'Raudrī', ratioStr: '81/64', num: 81, den: 64, tetCents: 400 },
  { index: 10, symbol: 'ma₁', nameIast: 'Krodhā', ratioStr: '4/3', num: 4, den: 3, tetCents: 500 },
  { index: 11, symbol: 'ma₂', nameIast: 'Vajrikā', ratioStr: '27/20', num: 27, den: 20, tetCents: 500 },
  { index: 12, symbol: 'Ma₃', nameIast: 'Prasāriṇī', ratioStr: '45/32', num: 45, den: 32, tetCents: 600 },
  { index: 13, symbol: 'Ma₄', nameIast: 'Prīti', ratioStr: '729/512', num: 729, den: 512, tetCents: 600 },
  { index: 14, symbol: 'Pa', nameIast: 'Mārjanī', ratioStr: '3/2', num: 3, den: 2, tetCents: 700 },
  { index: 15, symbol: 'dha₁', nameIast: 'Kṣiti', ratioStr: '128/81', num: 128, den: 81, tetCents: 800 },
  { index: 16, symbol: 'dha₂', nameIast: 'Raktā', ratioStr: '8/5', num: 8, den: 5, tetCents: 800 },
  { index: 17, symbol: 'Dha₃', nameIast: 'Sandīpinī', ratioStr: '5/3', num: 5, den: 3, tetCents: 900 },
  { index: 18, symbol: 'Dha₄', nameIast: 'Ālāpinī', ratioStr: '27/16', num: 27, den: 16, tetCents: 900 },
  { index: 19, symbol: 'ni₁', nameIast: 'Madantī', ratioStr: '16/9', num: 16, den: 9, tetCents: 1000 },
  { index: 20, symbol: 'ni₂', nameIast: 'Rohiṇī', ratioStr: '9/5', num: 9, den: 5, tetCents: 1000 },
  { index: 21, symbol: 'Ni₃', nameIast: 'Ramyā', ratioStr: '15/8', num: 15, den: 8, tetCents: 1100 },
  { index: 22, symbol: 'Ni₄', nameIast: 'Ugrā', ratioStr: '243/128', num: 243, den: 128, tetCents: 1100 },
];

export default function SrutiExplorer() {
  const m = useMatrix();
  const [selected, setSelected] = useState<SrutiData>(SRUTI_SPECS[0]);
  const [drone, setDrone] = useState(false);

  const jiRatio = selected.num / selected.den;
  const jiCents = useMemo(() => Math.round(1200 * Math.log2(jiRatio)), [jiRatio]);
  const deltaCents = jiCents - selected.tetCents;
  const targetFreq = m.baseSa * jiRatio;
  const plomp = useMemo(
    () => computeHarmonicRoughness(m.baseSa, jiRatio, 8),
    [m.baseSa, jiRatio],
  );
  const vsTet = useMemo(
    () => roughnessDeltaVsTet(m.baseSa, jiRatio, selected.tetCents, 8),
    [m.baseSa, jiRatio, selected.tetCents],
  );

  const play = (s: SrutiData) => {
    setSelected(s);
    const r = acousticEngine.trigger(s.index - 1, m.baseSa);
    m.setTelemetry(
      `${s.symbol} · ${s.nameIast} · ${r.freq.toFixed(2)} Hz · Δ ${deltaLabel(Math.round(1200 * Math.log2(s.num / s.den) - s.tetCents))} vs 12-TET`,
    );
  };

  return (
    <div className="stack">
      <div className="row">
        <div>
          <h2 style={{ margin: 0, color: 'var(--gold)' }}>22-Śruti Sensory Explorer</h2>
          <p className="sub">
            5-limit JI · Plomp–Levelt 8-partial kernel · syntonic comma {SYNTONIC_COMMA.toFixed(4)} ({SYNTONIC_COMMA_CENTS.toFixed(3)} ¢)
          </p>
        </div>
        <button className={drone ? 'btn rose' : 'btn em'} onClick={() => acousticEngine.toggleDrone(m.baseSa, setDrone)}>
          {drone ? 'Halt tānpūrā drone' : 'Engage tānpūrā (Sa–Pa)'}
        </button>
      </div>

      <div className="grid3">
        <div>
          <label className="meta">Base pitch (ādhāra ṣaḍja) {m.baseSa.toFixed(1)} Hz</label>
          <input
            type="range"
            min={100}
            max={360}
            step={0.1}
            value={m.baseSa}
            onChange={(e) => {
              const v = +e.target.value;
              m.setBaseSa(v);
              acousticEngine.updateDroneFreq(v);
            }}
          />
        </div>
        <div>
          <label className="meta">Systemic stressor S = {m.stress.toFixed(0)}</label>
          <input type="range" min={0} max={100} value={m.stress} onChange={(e) => m.setStress(+e.target.value)} />
        </div>
        <div>
          <label className="meta">Autonomic vagal tone V = {m.vagal.toFixed(0)}</label>
          <input type="range" min={0} max={100} value={m.vagal} onChange={(e) => m.setVagal(+e.target.value)} />
        </div>
      </div>

      <div className="metrics">
        <div>
          Swara <b>{selected.symbol}</b>
          <div className="sub">{selected.nameIast} · {selected.ratioStr}</div>
        </div>
        <div>
          Pitch <b>{targetFreq.toFixed(2)} Hz</b>
          <div className="sub">
            {jiCents} ¢ · Δ {deltaLabel(deltaCents)} vs 12-TET
          </div>
        </div>
        <div>
          JI roughness <b>{plomp.toFixed(3)}</b>
          <div className="sub">Plomp–Levelt · 8 partials</div>
        </div>
        <div>
          12-TET roughness <b>{vsTet.tet.toFixed(3)}</b>
          <div className="sub">Δ {vsTet.delta >= 0 ? '+' : ''}{vsTet.delta.toFixed(3)} (JI − TET)</div>
        </div>
        <div>
          RMSSD <b>{m.sim.hrvRmssd.toFixed(0)}</b> ms
          <div className="sub">Cortisol {m.sim.cortisol.toFixed(2)} μg/dL · BW {m.sim.bandwidth.toFixed(0)}% · Ψ {(m.sim.coherence * 100).toFixed(0)}%</div>
        </div>
      </div>

      <div className="pads" style={{ gridTemplateColumns: 'repeat(11, 1fr)' }}>
        {SRUTI_SPECS.map((s) => {
          const on = selected.index === s.index;
          return (
            <button
              key={s.index}
              className="pad"
              style={on ? { borderColor: 'var(--gold)', background: '#2a2110' } : undefined}
              onClick={() => play(s)}
            >
              <small>#{s.index}</small>
              {s.symbol}
              <small>{s.ratioStr}</small>
            </button>
          );
        })}
      </div>

      <BiotensegrityPanel
        roughness={plomp}
        stress={m.stress}
        vagalTone={m.vagal}
        targetFreq={targetFreq}
        srutiName={`${selected.symbol} · ${selected.nameIast}`}
      />
    </div>
  );
}

function deltaLabel(n: number): string {
  return `${n >= 0 ? '+' : ''}${n} ¢`;
}
