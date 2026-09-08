'use client';

import React, { useState, useMemo } from 'react';
import {
  SHRUTI_22_MATRIX,
  RAGA_ARCHETYPES,
  calculateTelemetry,
  calculateHarmonicRoughness,
} from '@/lib/vedicMatrixEngine';

export default function VedicMatrixEngineTab() {
  const [selectedRagaKey, setSelectedRagaKey] = useState('malkauns');
  const activeRaga = RAGA_ARCHETYPES[selectedRagaKey];
  const [stress, setStress] = useState(activeRaga.defaultS);
  const [vagal, setVagal] = useState(activeRaga.defaultV);
  const [laya, setLaya] = useState(activeRaga.targetLaya);
  const [activeOutputTab, setActiveOutputTab] = useState('prompt');

  const handleRagaChange = (key) => {
    setSelectedRagaKey(key);
    const raga = RAGA_ARCHETYPES[key];
    setStress(raga.defaultS);
    setVagal(raga.defaultV);
    setLaya(raga.targetLaya);
  };

  const telemetry = useMemo(() => calculateTelemetry(stress, vagal, laya), [stress, vagal, laya]);
  const activeSvaras = useMemo(
    () => activeRaga.svaraIndices.map((idx) => SHRUTI_22_MATRIX[idx - 1]),
    [activeRaga],
  );

  const globalRoughness = useMemo(() => {
    let roughnessSum = 0;
    let count = 0;
    for (let i = 0; i < activeSvaras.length; i++) {
      for (let j = i + 1; j < activeSvaras.length; j++) {
        const f1 = activeRaga.basePitchHz * (activeSvaras[i].num / activeSvaras[i].den);
        const f2 = activeRaga.basePitchHz * (activeSvaras[j].num / activeSvaras[j].den);
        roughnessSum += calculateHarmonicRoughness(f1, f2, 6);
        count++;
      }
    }
    return count > 0 ? roughnessSum / count : 0.05;
  }, [activeSvaras, activeRaga.basePitchHz]);

  const coherence = Math.max(0.05, 1.0 - globalRoughness * 4.0);
  const vPiezo = activeRaga.basePitchHz * 0.035 * coherence * (vagal / 100.0);
  const duralCoherence = Math.min(1.0, Math.max(0.1, coherence * (1.0 - stress / 150.0)));

  const fhirPayload = useMemo(() => ({
    resourceType: 'Bundle',
    type: 'transaction',
    id: `bundle-${activeRaga.id.toLowerCase()}`,
    timestamp: new Date().toISOString(),
    entry: [
      {
        fullUrl: `urn:uuid:careplan-${activeRaga.id.toLowerCase()}`,
        resource: {
          resourceType: 'CarePlan',
          id: `careplan-${activeRaga.id.toLowerCase()}`,
          status: 'active',
          intent: 'plan',
          title: `Grand Unified Vedic-Acoustic Prescription: ${activeRaga.name}`,
          subject: { reference: 'Patient/VEDIC-TARGET-001' },
          period: { start: new Date().toISOString() },
          activity: [{
            detail: {
              kind: 'ServiceRequest',
              code: {
                coding: [{ system: 'http://snomed.info/sct', code: '410394004', display: 'Music therapy (procedure)' }],
              },
              scheduledTiming: {
                repeat: { frequency: 1, period: 1, periodUnit: 'd', duration: 24, durationUnit: 'min' },
              },
            },
          }],
        },
      },
      {
        fullUrl: `urn:uuid:obs-telemetry-${activeRaga.id.toLowerCase()}`,
        resource: {
          resourceType: 'Observation',
          id: `obs-telemetry-${activeRaga.id.toLowerCase()}`,
          status: 'final',
          code: { text: 'Biomechanical & Autonomic Prescriptive State' },
          valueString: `${activeRaga.name} at ${activeRaga.basePitchHz}Hz (${laya} BPM)`,
          extension: [
            { url: 'http://aigaane.in/fhir/rmssd', valueQuantity: { value: telemetry.rmssd, unit: 'ms' } },
            { url: 'http://aigaane.in/fhir/cortisol', valueQuantity: { value: telemetry.cortisol, unit: 'ug/dL' } },
            { url: 'http://aigaane.in/fhir/prestress', valueQuantity: { value: telemetry.fascialPrestress, unit: 'kPa' } },
            { url: 'http://aigaane.in/fhir/coherence', valueQuantity: { value: Number(coherence.toFixed(4)), unit: 'ratio' } },
            { url: 'http://aigaane.in/fhir/dural-resonance', valueQuantity: { value: Number(duralCoherence.toFixed(4)), unit: 'ratio' } },
            { url: 'http://aigaane.in/fhir/shruti-ratios', valueString: activeSvaras.map((s) => s.ratioStr).join(', ') },
          ],
        },
      },
    ],
  }), [activeRaga, laya, telemetry, coherence, duralCoherence, activeSvaras]);

  const box = { backgroundColor: '#1E293B', padding: '20px', borderRadius: '8px', border: '1px solid #334155' };

  return (
    <div style={{ padding: '24px', fontFamily: 'Inter, system-ui, sans-serif', color: '#E2E8F0', backgroundColor: '#0F172A', minHeight: '100vh' }}>
      <div style={{ borderBottom: '1px solid #334155', paddingBottom: '16px', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#F8FAFC', margin: 0 }}>Grand Unified Body-Mind-Vedic Engine</h1>
        <p style={{ fontSize: '14px', color: '#94A3B8', marginTop: '4px' }}>
          Production Node • 22-Sruti 5-Limit Lattice • Biotensegrity • FHIR R4 • Malkauns locked pentatonic (Re/Pa varjit)
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        {Object.entries(RAGA_ARCHETYPES).map(([key, r]) => (
          <button
            key={key}
            onClick={() => handleRagaChange(key)}
            style={{
              padding: '12px',
              textAlign: 'left',
              backgroundColor: selectedRagaKey === key ? '#1E293B' : '#0F172A',
              border: `2px solid ${selectedRagaKey === key ? '#38BDF8' : '#334155'}`,
              borderRadius: '8px',
              cursor: 'pointer',
              color: '#F8FAFC',
            }}
          >
            <div style={{ fontWeight: 600, fontSize: '15px' }}>{r.name}</div>
            <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '4px' }}>{r.rasa.split('(')[0]}</div>
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '24px' }}>
        <div style={box}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: '#38BDF8' }}>Physiological Control Vectors</h2>
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
              <span>Stress Index (S)</span><span style={{ fontWeight: 700 }}>{stress}</span>
            </div>
            <input type="range" min="0" max="100" value={stress} onChange={(e) => setStress(Number(e.target.value))} style={{ width: '100%', accentColor: '#EF4444' }} />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
              <span>Autonomic Vagal Tone (V)</span><span style={{ fontWeight: 700 }}>{vagal}</span>
            </div>
            <input type="range" min="0" max="100" value={vagal} onChange={(e) => setVagal(Number(e.target.value))} style={{ width: '100%', accentColor: '#10B981' }} />
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
              <span>Laya / Cadence (BPM)</span><span style={{ fontWeight: 700 }}>{laya} BPM</span>
            </div>
            <input type="range" min="30" max="140" value={laya} onChange={(e) => setLaya(Number(e.target.value))} style={{ width: '100%', accentColor: '#F59E0B' }} />
          </div>
        </div>

        <div style={box}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: '#38BDF8' }}>Calculated Telemetry and Mechanics</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
            <div style={{ background: '#0F172A', padding: '10px', borderRadius: '6px' }}>
              <div style={{ color: '#94A3B8' }}>RMSSD (Vagal HRV)</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#10B981' }}>{telemetry.rmssd} ms</div>
            </div>
            <div style={{ background: '#0F172A', padding: '10px', borderRadius: '6px' }}>
              <div style={{ color: '#94A3B8' }}>Serum Cortisol</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#EF4444' }}>{telemetry.cortisol} ug/dL</div>
            </div>
            <div style={{ background: '#0F172A', padding: '10px', borderRadius: '6px' }}>
              <div style={{ color: '#94A3B8' }}>Fascial Prestress</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#F59E0B' }}>{telemetry.fascialPrestress} kPa</div>
            </div>
            <div style={{ background: '#0F172A', padding: '10px', borderRadius: '6px' }}>
              <div style={{ color: '#94A3B8' }}>Resonance Factor (Psi)</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#38BDF8' }}>{telemetry.cardiorespiratoryResonance}</div>
            </div>
            <div style={{ background: '#0F172A', padding: '10px', borderRadius: '6px' }}>
              <div style={{ color: '#94A3B8' }}>Piezo Potential (V_piezo)</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#A855F7' }}>{vPiezo.toFixed(3)} mV</div>
            </div>
            <div style={{ background: '#0F172A', padding: '10px', borderRadius: '6px' }}>
              <div style={{ color: '#94A3B8' }}>Dural Coherence (R_dural)</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#EC4899' }}>{duralCoherence.toFixed(3)}</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ ...box, marginBottom: '24px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px', color: '#38BDF8' }}>
          Active 5-Limit Rational Tuning Ladder: {activeRaga.name}
        </h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #475569', color: '#94A3B8' }}>
                <th style={{ padding: '8px' }}>Svara</th>
                <th style={{ padding: '8px' }}>Sruti</th>
                <th style={{ padding: '8px' }}>Ratio (Q)</th>
                <th style={{ padding: '8px' }}>Cents</th>
                <th style={{ padding: '8px' }}>12-TET Dev</th>
                <th style={{ padding: '8px' }}>Acoustic Frequency</th>
              </tr>
            </thead>
            <tbody>
              {activeSvaras.map((s) => {
                const freq = (activeRaga.basePitchHz * (s.num / s.den)).toFixed(2);
                return (
                  <tr key={s.index} style={{ borderBottom: '1px solid #334155' }}>
                    <td style={{ padding: '8px', fontWeight: 700, color: '#F8FAFC' }}>{s.svara}</td>
                    <td style={{ padding: '8px' }}>{s.shruti}</td>
                    <td style={{ padding: '8px', color: '#38BDF8', fontFamily: 'monospace' }}>{s.ratioStr}</td>
                    <td style={{ padding: '8px' }}>{s.cents.toFixed(2)}c</td>
                    <td style={{ padding: '8px', color: s.tetDev > 0 ? '#10B981' : '#EF4444' }}>
                      {s.tetDev > 0 ? `+${s.tetDev}` : s.tetDev}c
                    </td>
                    <td style={{ padding: '8px', fontFamily: 'monospace' }}>{freq} Hz</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ backgroundColor: '#1E293B', borderRadius: '8px', border: '1px solid #334155', overflow: 'hidden' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid #334155', backgroundColor: '#0F172A' }}>
          <button onClick={() => setActiveOutputTab('prompt')} style={{ padding: '12px 20px', backgroundColor: activeOutputTab === 'prompt' ? '#1E293B' : 'transparent', color: activeOutputTab === 'prompt' ? '#38BDF8' : '#94A3B8', border: 'none', borderBottom: activeOutputTab === 'prompt' ? '2px solid #38BDF8' : 'none', cursor: 'pointer', fontWeight: 600 }}>Digital Audio Prompt</button>
          <button onClick={() => setActiveOutputTab('fhir')} style={{ padding: '12px 20px', backgroundColor: activeOutputTab === 'fhir' ? '#1E293B' : 'transparent', color: activeOutputTab === 'fhir' ? '#38BDF8' : '#94A3B8', border: 'none', borderBottom: activeOutputTab === 'fhir' ? '2px solid #38BDF8' : 'none', cursor: 'pointer', fontWeight: 600 }}>HL7 / FHIR R4 Bundle</button>
        </div>
        <div style={{ padding: '20px' }}>
          {activeOutputTab === 'prompt' && (
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '12px', color: '#E2E8F0' }}>
{`[SYSTEM DIRECTIVE: DIGITAL THERAPEUTIC AUDIO PRESCRIPTION]
Protocol ID: ${activeRaga.id}
Clinical Intent: Autonomic down-regulation, dural tension release, HRV maximization.

1. CONCEPTUAL AND AFFECTIVE DIRECTIVE (Rasa and Bhava)
Target Emotion: ${activeRaga.rasa}.
Temporal Frame: ${activeRaga.prahar}.
Somatic Mechanics: Maintain fascial prestress target of ${telemetry.fascialPrestress} kPa.
Acoustic Environment: Continuous contemplative timbre with no transient dynamic shocks.

2. ACOUSTIC ARCHITECTURE (Raga and 22-Sruti Matrix)
Raga: ${activeRaga.name}
Vadi: ${activeRaga.vadi} | Samvadi: ${activeRaga.samvadi}
Base Pitch (Adhara Sadja): ${activeRaga.basePitchHz} Hz
Pure Ratios:
${activeSvaras.map((s) => ` - ${s.svara} (${s.shruti}): ${s.ratioStr} (${s.cents}c)`).join('\n')}

Plomp-Levelt Roughness Ceiling: D_total <= 0.12 (Calculated Harmonic Roughness: ${globalRoughness.toFixed(4)})
Biotensegrity Coherence (C): ${coherence.toFixed(4)}

3. RHYTHMIC AND METRIC ARCHITECTURE (Laya and Tala)
Laya: Exactly ${laya} BPM (Cardiorespiratory Resonance Factor Psi = ${telemetry.cardiorespiratoryResonance}).
Dynamic Arc: Unmetered alap expanding into slow vilambit cycles, emphasizing harmonic alignment over transient percussion.`}
            </pre>
          )}
          {activeOutputTab === 'fhir' && (
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '12px', color: '#38BDF8' }}>
              {JSON.stringify(fhirPayload, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
