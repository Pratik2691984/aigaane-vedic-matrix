'use client';

import React, { useState } from 'react';
import { MatrixProvider, useMatrix } from '@/context/MatrixContext';
import { acousticEngine } from '@/lib/secureAcoustics';
import ZoomMap from './ZoomMap';
import VedicCalculator from './VedicCalculator';
import BodyMindQuiz from './BodyMindQuiz';
import DailyInsight from './DailyInsight';
import WearablePanel from './WearablePanel';
import ExportBar from './ExportBar';
import type { Domain } from '@/lib/types';

const DOMAINS: Array<Domain | 'All'> = ['All', 'Physical', 'Mental', 'Bridge', 'Vedic', 'Research'];

function Shell() {
  const m = useMatrix();
  const [drone, setDrone] = useState(false);
  const [tab, setTab] = useState<'map' | 'calc' | 'quiz' | 'insight' | 'wear'>('map');
  const visible = m.domainFilter === 'All' ? m.nodes : m.nodes.filter((n) => n.domain === m.domainFilter);

  return (
    <div className="shell">
      <div id="matrix-root" className="panel stack">
        <header>
          <h1>Body–Mind–Vedic Matrix</h1>
          <p className="sub">51 subsystems · 22-śruti just intonation · English first, IAST in parentheses</p>
        </header>
        <div className="grid3">
          <div>
            <label className="meta">Stress S = {m.stress.toFixed(0)}</label>
            <input type="range" min={0} max={100} value={m.stress} onChange={(e) => m.setStress(+e.target.value)} />
          </div>
          <div>
            <label className="meta">Vagal tone V = {m.vagal.toFixed(0)}</label>
            <input type="range" min={0} max={100} value={m.vagal} onChange={(e) => m.setVagal(+e.target.value)} />
          </div>
          <div>
            <label className="meta">Laya L = {m.laya.toFixed(0)} BPM · śvāsa {m.sim.breathRate.toFixed(1)} / min</label>
            <input type="range" min={40} max={180} value={m.laya} onChange={(e) => m.setLaya(+e.target.value)} />
          </div>
        </div>
        <div className="metrics">
          <div>Cortisol <b>{m.sim.cortisol.toFixed(1)}</b></div>
          <div>HR <b>{m.sim.heartRate.toFixed(0)}</b></div>
          <div>RMSSD <b>{m.sim.hrvRmssd.toFixed(0)}</b> ms</div>
          <div>Bandwidth <b>{m.sim.bandwidth.toFixed(0)}</b>%</div>
          <div>Inhib. gain <b>{m.sim.inhibitionGain.toFixed(2)}</b></div>
          <div>Cytokines <b>{m.sim.cytokines.toFixed(2)}</b></div>
          <div>0.1 Hz coherence <b>{(m.sim.coherence * 100).toFixed(0)}</b>%</div>
        </div>
        <div className="row">
          <div style={{ flex: 1 }}>
            <label className="meta">Ādhāra ṣaḍja {m.baseSa.toFixed(1)} Hz</label>
            <input type="range" min={120} max={360} step={0.5} value={m.baseSa} onChange={(e) => { const v = +e.target.value; m.setBaseSa(v); acousticEngine.updateDroneFreq(v); }} />
          </div>
          <button className={drone ? 'btn rose' : 'btn em'} onClick={() => acousticEngine.toggleDrone(m.baseSa, setDrone)}>
            {drone ? 'Stop tānpūrā' : 'Tānpūrā drone'}
          </button>
          <button className={m.loopOn ? 'btn gold' : 'btn'} onClick={() => m.setLoopOn(!m.loopOn)}>
            {m.loopOn ? 'Loops on' : 'Loops off'}
          </button>
          <ExportBar targetId="matrix-root" />
        </div>
        <div className="tabs row">
          {DOMAINS.map((d) => (
            <button key={d} className={m.domainFilter === d ? 'on' : ''} onClick={() => m.setDomainFilter(d)}>{d}</button>
          ))}
        </div>
        <div className="tel">{m.telemetry}</div>
        <div className="tabs row">
          {(['map', 'calc', 'quiz', 'insight', 'wear'] as const).map((t) => (
            <button key={t} className={tab === t ? 'on' : ''} onClick={() => setTab(t)}>
              {t === 'map' ? 'Map + cards' : t === 'calc' ? 'Vedic calculator' : t === 'quiz' ? 'Quiz' : t === 'insight' ? 'Daily insight' : 'Wearable'}
            </button>
          ))}
        </div>
        {tab === 'map' && (
          <>
            <ZoomMap />
            <div className="list">
              {visible.map((n) => (
                <button key={n.id} className="item" onClick={() => { m.setSelected(n); const r = acousticEngine.trigger(n.srutiHint, m.baseSa); m.setTelemetry(`${n.domain} · ${n.name} · ${r.name} ${r.freq.toFixed(1)} Hz`); }} onMouseEnter={() => m.setHover(n)}>
                  <div className="sub">{n.id} · {n.icon}</div>
                  <div>{n.name}</div>
                </button>
              ))}
            </div>
          </>
        )}
        {tab === 'calc' && <VedicCalculator />}
        {tab === 'quiz' && <BodyMindQuiz />}
        {tab === 'insight' && <DailyInsight />}
        {tab === 'wear' && <WearablePanel />}
      </div>
      {m.selected && (
        <div className="popup" onClick={() => m.setSelected(null)}>
          <div className="inner" onClick={(e) => e.stopPropagation()}>
            <div className="badge">{m.selected.domain}</div>
            <h2 style={{ margin: '8px 0' }}>#{m.selected.index} {m.selected.name}</h2>
            <p className="sub">{m.selected.icon} · {m.selected.metric} · target {m.selected.target}</p>
            <p>{m.selected.level3_application}</p>
            <button className="btn gold" onClick={() => m.setSelected(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function VedicExplorer() {
  return (
    <MatrixProvider>
      <Shell />
    </MatrixProvider>
  );
}
