'use client';

import React, { useMemo, useRef, useState } from 'react';
import { useMatrix } from '@/context/MatrixContext';
import type { EdgeKind } from '@/lib/types';

const KIND: Record<EdgeKind, string> = {
  feedforward: '#5b9fd4',
  feedback: '#e25b6c',
  bridge: '#3dcc8a',
  acoustic: '#e0b35a',
  measurement: '#8aa0b0',
};

const DOMAIN: Record<string, string> = {
  Physical: '#5b9fd4',
  Mental: '#c48adf',
  Bridge: '#3dcc8a',
  Vedic: '#e0b35a',
  Research: '#8aa0b0',
};

export default function ZoomMap() {
  const { nodes, edges, domainFilter, selected, setSelected, setHover, hover, sim, loopOn } = useMatrix();
  const [zoom, setZoom] = useState(0.72);
  const [pan, setPan] = useState({ x: 20, y: 20 });
  const drag = useRef<{ x: number; y: number } | null>(null);
  const visibleNodes = useMemo(
    () => (domainFilter === 'All' ? nodes : nodes.filter((n) => n.domain === domainFilter)),
    [nodes, domainFilter],
  );
  const ids = new Set(visibleNodes.map((n) => n.id));
  const visibleEdges = edges.filter((e) => ids.has(e.source) && ids.has(e.target));
  const byId = useMemo(() => Object.fromEntries(nodes.map((n) => [n.id, n])), [nodes]);
  const sat = Math.max(0.35, 1 - sim.stress / 180);

  return (
    <div>
      <div className="row" style={{ marginBottom: 8 }}>
        <button className="btn" onClick={() => setZoom((z) => Math.max(0.2, z / 1.15))}>-</button>
        <button className="btn" onClick={() => setZoom((z) => Math.min(2.5, z * 1.15))}>+</button>
        <span className="sub">{zoom.toFixed(2)}x · drag canvas to pan</span>
      </div>
      <div
        className="mapwrap"
        onWheel={(e) => {
          e.preventDefault();
          setZoom((z) => Math.min(2.5, Math.max(0.2, z * (e.deltaY > 0 ? 0.92 : 1.08))));
        }}
        onPointerDown={(e) => { drag.current = { x: e.clientX - pan.x, y: e.clientY - pan.y }; }}
        onPointerMove={(e) => {
          if (!drag.current) return;
          setPan({ x: e.clientX - drag.current.x, y: e.clientY - drag.current.y });
        }}
        onPointerUp={() => { drag.current = null; }}
      >
        <svg className="mapsvg" width={1400} height={1100} style={{ transform: `translate(${pan.x}px,${pan.y}px) scale(${zoom})` }}>
          {visibleEdges.map((e) => {
            const a = byId[e.source];
            const b = byId[e.target];
            if (!a || !b) return null;
            const midX = (a.x + b.x) / 2 + 40;
            const midY = (a.y + b.y) / 2 - 20;
            const alert = e.kind === 'feedback' && sim.stress > 60;
            return (
              <path
                key={e.id}
                d={`M ${a.x + 18} ${a.y + 18} Q ${midX} ${midY} ${b.x + 18} ${b.y + 18}`}
                fill="none"
                stroke={alert ? '#e25b6c' : KIND[e.kind]}
                strokeWidth={alert ? 2.4 : 1.4}
                opacity={0.75}
                className={loopOn && (e.kind === 'feedback' || e.kind === 'acoustic') ? 'loop' : undefined}
              />
            );
          })}
          {visibleNodes.map((n) => {
            const active = selected?.id === n.id || hover?.id === n.id;
            return (
              <g key={n.id} className="node" transform={`translate(${n.x},${n.y})`}
                onPointerEnter={() => setHover(n)} onPointerLeave={() => setHover(null)}
                onClick={(ev) => { ev.stopPropagation(); setSelected(n); }}>
                <circle r={active ? 16 : 13} cx={18} cy={18} fill={DOMAIN[n.domain]} opacity={sat} stroke={active ? '#fff' : '#071018'} />
                <text x={38} y={16} fill="#e8f1f6" fontSize={11}>{n.name}</text>
                <text x={38} y={30} fill="#8aa0b0" fontSize={9}>#{n.index} {n.domain}</text>
              </g>
            );
          })}
        </svg>
        {hover && (
          <div className="card" style={{ left: 12, top: 12 }}>
            <span className="badge" style={{ color: DOMAIN[hover.domain] }}>{hover.domain}</span>
            <div style={{ fontWeight: 700, marginTop: 6 }}>{hover.name}</div>
            <div className="sub">{hover.id} · {hover.icon} · → {hover.target}</div>
            <div style={{ marginTop: 6, fontSize: 12 }}>{hover.level3_application}</div>
            <div className="sub" style={{ marginTop: 6 }}>{hover.metric}</div>
          </div>
        )}
      </div>
    </div>
  );
}
