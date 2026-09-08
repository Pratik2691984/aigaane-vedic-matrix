'use client';

import React, { useMemo, useState } from 'react';
import { acousticEngine } from '@/lib/secureAcoustics';
import graph from '@/data/subsystemGraph.json';

type Domain = 'All' | 'Physical' | 'Mental' | 'Vedic';

type Subsystem = {
  id: number;
  name: string;
  domain: Exclude<Domain, 'All'>;
  srutiHint?: number;
  note?: string;
};

const SUBSYSTEMS = graph.subsystems as Subsystem[];

export default function VedicExplorer() {
  const [baseSa, setBaseSa] = useState<number>(240);
  const [droneActive, setDroneActive] = useState<boolean>(false);
  const [telemetry, setTelemetry] = useState<string>('Ready. Click any Śruti node to calibrate.');
  const [activeTab, setActiveTab] = useState<Domain>('All');

  const srutiLabels = acousticEngine.getLabels();

  const visible = useMemo(
    () => (activeTab === 'All' ? SUBSYSTEMS : SUBSYSTEMS.filter((s) => s.domain === activeTab)),
    [activeTab]
  );

  const handleNoteClick = (idx: number) => {
    const res = acousticEngine.trigger(idx, baseSa);
    setTelemetry(`Activated: [${idx + 1}] ${res.name} | Frequency: ${res.freq.toFixed(2)} Hz | Interval: +${res.cents}¢`);
  };

  const handleDroneToggle = () => {
    acousticEngine.toggleDrone(baseSa, (active) => setDroneActive(active));
  };

  const handleFreqChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setBaseSa(val);
    acousticEngine.updateDroneFreq(val);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6 bg-slate-950 text-slate-100 rounded-2xl border border-slate-800 shadow-2xl space-y-6">
      <header className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-bold tracking-wide text-amber-400">
          Body-Mind-Vedic Subsystem Controller
        </h1>
        <p className="text-xs text-slate-400 font-mono mt-1">
          22-Śruti Pure Just Intonation Lattice & Combinatorial Architecture
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-400 font-mono">
            Ādhāra Ṣaḍja (Base Sa): <span className="text-amber-400 font-bold">{baseSa.toFixed(1)} Hz</span>
          </label>
          <input
            type="range"
            min="120"
            max="360"
            step="0.5"
            value={baseSa}
            onChange={handleFreqChange}
            className="accent-amber-500 cursor-pointer"
          />
        </div>

        <div className="flex items-end">
          <button
            onClick={handleDroneToggle}
            className={`w-full py-2 px-4 rounded-lg font-semibold text-sm transition-all ${
              droneActive
                ? 'bg-rose-600 hover:bg-rose-700 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {droneActive ? 'Stop Tanpura Drone' : 'Engage Tanpura Drone'}
          </button>
        </div>

        <div className="flex gap-2 items-end">
          {(['All', 'Physical', 'Mental', 'Vedic'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 text-xs font-mono rounded-lg transition-colors ${
                activeTab === tab
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="p-3 bg-black/60 border border-slate-800 rounded-lg font-mono text-xs text-emerald-400">
        {telemetry}
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
        {srutiLabels.map((lbl, idx) => (
          <button
            key={idx}
            onClick={() => handleNoteClick(idx)}
            className="p-3 bg-slate-900 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-800/80 active:scale-95 rounded-xl transition-all flex flex-col items-center justify-center gap-1 group"
          >
            <span className="text-xs text-slate-500 font-mono">#{idx + 1}</span>
            <span className="text-sm font-bold text-amber-200 group-hover:text-amber-400">{lbl}</span>
          </button>
        ))}
      </div>

      <section>
        <h2 className="text-sm font-mono text-slate-400 mb-2">
          Subsystems ({visible.length}/{SUBSYSTEMS.length}) — {activeTab}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-72 overflow-y-auto">
          {visible.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                if (typeof s.srutiHint === 'number') handleNoteClick(s.srutiHint);
                setTelemetry(`${s.domain} · ${s.name}${s.note ? ' — ' + s.note : ''}`);
              }}
              className="text-left p-3 rounded-lg border border-slate-800 bg-slate-900/70 hover:border-amber-500/40"
            >
              <div className="text-[10px] uppercase tracking-wide text-slate-500">{s.domain} · #{s.id}</div>
              <div className="text-sm text-amber-100">{s.name}</div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
