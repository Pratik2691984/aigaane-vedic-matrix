'use client';

import React from 'react';
import { useMatrix } from '@/context/MatrixContext';
import { mockWearable } from '@/lib/wearable';

export default function WearablePanel() {
  const { wearable, applyWearable } = useMatrix();
  const p = wearable;

  const realBt = async () => {
    if (typeof navigator === 'undefined' || !('bluetooth' in navigator)) {
      applyWearable(mockWearable());
      return;
    }
    try {
      await (navigator as Navigator & { bluetooth: { requestDevice: (o: object) => Promise<unknown> } }).bluetooth.requestDevice({
        acceptAllDevices: true,
      });
    } catch {
      /* user cancelled — mock */
    }
    applyWearable(mockWearable());
  };

  return (
    <div className="stack">
      <div className="row">
        <button className="btn em" onClick={() => applyWearable()}>
          Ingest mock telemetry
        </button>
        <button className="btn" onClick={realBt}>
          Web Bluetooth (fallback mock)
        </button>
      </div>
      {p ? (
        <div className="metrics">
          <div>HR <b>{p.heartRateBpm}</b> bpm</div>
          <div>RMSSD <b>{p.hrvRmssdMs}</b> ms</div>
          <div>Resp <b>{p.respiratoryRateBrpm}</b></div>
          <div>Skin <b>{p.skinTemperatureCelsius.toFixed(2)}</b> °C</div>
          <div>Sleep <b>{p.sleepPerformanceScore}</b></div>
          <div>ABI <b>{p.derivedStates.autonomicBalanceIndex}</b></div>
          <div>Laya <b>{p.derivedStates.recommendedLayaTempo}</b></div>
          <div>Śruti <b>{p.derivedStates.suggestedSrutiTuning}</b></div>
        </div>
      ) : (
        <div className="sub">No wearable payload yet. Low HRV auto-upscales stress via Matrix 3.</div>
      )}
    </div>
  );
}
