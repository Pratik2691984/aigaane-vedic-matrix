'use client';

import React, { useMemo, useState } from 'react';
import { meruPrastara, prastaraStrings, virahanka, matraSum, sanyoga } from '@/lib/vedicCombinatorics';
import { acousticEngine, SRUTI_LABELS } from '@/lib/secureAcoustics';
import { useMatrix } from '@/context/MatrixContext';

export default function VedicCalculator() {
  const { baseSa, laya, setTelemetry } = useMatrix();
  const [n, setN] = useState(4);
  const strings = useMemo(() => prastaraStrings(n), [n]);
  const meru = useMemo(() => meruPrastara(n), [n]);
  const vir = useMemo(() => virahanka(n + 4), [n]);

  return (
    <div className="stack">
      <label className="meta">Prāstāra length n = {n} · 2^{n} = {1 << n} patterns · sanyoga({n},2) = {sanyoga(n, 2)}</label>
      <input type="range" min={2} max={6} value={n} onChange={(e) => setN(+e.target.value)} />
      <div className="sub">Virahanka S(0..{n + 4}): {vir.join(', ')}</div>
      <div className="sub">Meru row {n}: {meru[n].join(' ')}</div>
      <div className="list">
        {strings.map((s) => (
          <button
            key={s}
            className="item"
            onClick={() => {
              acousticEngine.playPattern(s, baseSa, laya);
              setTelemetry(`Tāla pattern ${s} · mātrā ${matraSum(s)} · ${laya} BPM · Sa ${baseSa} Hz`);
            }}
          >
            <b>{s}</b>
            <div className="sub">mātrā {matraSum(s)}</div>
          </button>
        ))}
      </div>
      <div className="pads">
        {SRUTI_LABELS.map((lbl, i) => (
          <button
            key={lbl}
            className="pad"
            onClick={() => {
              const r = acousticEngine.trigger(i, baseSa);
              setTelemetry(`${r.name} · ${r.freq.toFixed(2)} Hz · ${r.ratio} · +${r.cents}¢`);
            }}
          >
            <small>#{i + 1}</small>
            {lbl}
          </button>
        ))}
      </div>
    </div>
  );
}
