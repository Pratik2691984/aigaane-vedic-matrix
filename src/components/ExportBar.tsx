'use client';

import React from 'react';
import { useMatrix } from '@/context/MatrixContext';

export default function ExportBar({ targetId }: { targetId: string }) {
  const { nodes, edges, sim, selected, wearable } = useMatrix();

  const download = (name: string, blob: Blob) => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const exportSvg = () => {
    const root = document.getElementById(targetId);
    const svg = root?.querySelector('svg');
    if (!svg) return;
    const blob = new Blob([new XMLSerializer().serializeToString(svg)], { type: 'image/svg+xml' });
    download('vedic-matrix.svg', blob);
  };

  const exportPng = () => {
    const root = document.getElementById(targetId);
    const svg = root?.querySelector('svg');
    if (!svg) return;
    const xml = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    const url = URL.createObjectURL(new Blob([xml], { type: 'image/svg+xml' }));
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = 1600;
      c.height = 1200;
      const ctx = c.getContext('2d');
      if (!ctx) return;
      ctx.fillStyle = '#071018';
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.drawImage(img, 0, 0);
      c.toBlob((b) => b && download('vedic-matrix.png', b));
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  const exportJson = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      sim,
      selected: selected?.id ?? null,
      wearable,
      nodes: nodes.map((n) => n.id),
      edgeCount: edges.length,
    };
    download('vedic-matrix-state.json', new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }));
  };

  return (
    <div className="row">
      <button className="btn" onClick={exportPng}>PNG</button>
      <button className="btn" onClick={exportSvg}>SVG</button>
      <button className="btn gold" onClick={exportJson}>JSON state</button>
    </div>
  );
}
