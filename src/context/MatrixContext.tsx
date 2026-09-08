'use client';

import React, { createContext, useContext, useMemo, useState } from 'react';
import { nodes, edges } from '@/data/graph';
import { computeSim, stressFromHrv } from '@/lib/simulation';
import { ingestWearable, mockWearable } from '@/lib/wearable';
import type { Domain, SimState, SubsystemNode, GraphEdge, WearableTelemetryPayload } from '@/lib/types';

type Ctx = {
  nodes: SubsystemNode[];
  edges: GraphEdge[];
  domainFilter: Domain | 'All';
  setDomainFilter: (d: Domain | 'All') => void;
  selected: SubsystemNode | null;
  setSelected: (n: SubsystemNode | null) => void;
  hover: SubsystemNode | null;
  setHover: (n: SubsystemNode | null) => void;
  stress: number;
  setStress: (n: number) => void;
  vagal: number;
  setVagal: (n: number) => void;
  laya: number;
  setLaya: (n: number) => void;
  sim: SimState;
  loopOn: boolean;
  setLoopOn: (b: boolean) => void;
  wearable: WearableTelemetryPayload | null;
  applyWearable: (p?: WearableTelemetryPayload) => void;
  telemetry: string;
  setTelemetry: (s: string) => void;
  baseSa: number;
  setBaseSa: (n: number) => void;
};

const C = createContext<Ctx | null>(null);

export function MatrixProvider({ children }: { children: React.ReactNode }) {
  const [domainFilter, setDomainFilter] = useState<Domain | 'All'>('All');
  const [selected, setSelected] = useState<SubsystemNode | null>(null);
  const [hover, setHover] = useState<SubsystemNode | null>(null);
  const [stress, setStress] = useState(28);
  const [vagal, setVagal] = useState(62);
  const [laya, setLaya] = useState(60);
  const [loopOn, setLoopOn] = useState(true);
  const [wearable, setWearable] = useState<WearableTelemetryPayload | null>(null);
  const [telemetry, setTelemetry] = useState('Ready. Hover a node or move a slider.');
  const [baseSa, setBaseSa] = useState(240);
  const sim = useMemo(() => computeSim(stress, vagal, laya), [stress, vagal, laya]);

  const applyWearable = (p?: WearableTelemetryPayload) => {
    const payload = p ?? mockWearable();
    const next = ingestWearable(payload);
    setWearable(payload);
    setStress(next.stress);
    setVagal(next.vagal);
    setLaya(next.laya);
    setTelemetry(
      `Wearable ingest \u00b7 HR ${payload.heartRateBpm} \u00b7 RMSSD ${payload.hrvRmssdMs} ms \u00b7 ABI ${payload.derivedStates.autonomicBalanceIndex}`,
    );
  };

  return (
    <C.Provider
      value={{
        nodes,
        edges,
        domainFilter,
        setDomainFilter,
        selected,
        setSelected,
        hover,
        setHover,
        stress,
        setStress,
        vagal,
        setVagal,
        laya,
        setLaya,
        sim,
        loopOn,
        setLoopOn,
        wearable,
        applyWearable,
        telemetry,
        setTelemetry,
        baseSa,
        setBaseSa,
      }}
    >
      {children}
    </C.Provider>
  );
}

export function useMatrix() {
  const v = useContext(C);
  if (!v) throw new Error('useMatrix outside provider');
  return v;
}

export { stressFromHrv };
