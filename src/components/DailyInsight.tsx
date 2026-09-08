'use client';

import React, { useMemo } from 'react';
import { dailyInsight } from '@/lib/insights';
import { useMatrix } from '@/context/MatrixContext';

export default function DailyInsight() {
  const { nodes, setSelected } = useMatrix();
  const d = useMemo(() => dailyInsight(nodes), [nodes]);
  return (
    <div>
      <div className="sub">
        Day-of-year {d.day} · NodeIndex = ({d.day} % 51) + 1 = {d.index}
      </div>
      <h3 style={{ margin: '8px 0', color: '#e0b35a' }}>
        {d.node.name} <span className="badge">{d.band}</span>
      </h3>
      <p>{d.insight}</p>
      <p>{d.node.level3_application}</p>
      <p>
        <b>Practice:</b> {d.action}
      </p>
      <button className="btn gold" onClick={() => setSelected(d.node)}>
        Open node #{d.index}
      </button>
    </div>
  );
}
