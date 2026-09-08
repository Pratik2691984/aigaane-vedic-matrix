/**
 * Biotensegrity mechanotransduction and acoustic resonance model.
 * Educational coupling of Plomp–Levelt roughness to fascial / cellular state.
 * Not a clinical assay and not a measurement of living fascia.
 */

export interface BiotensegrityState {
  fascialPrestressKPa: number;
  piezoelectricPotentialMv: number;
  cellularShearStrain: number;
  duralResonanceCoherence: number;
  visceralLock: number;
}

export const VISCERAL_LOCK_HZ = 136.1;

export function computeBiotensegrity(
  roughness: number,
  stress: number,
  vagalTone: number,
  frequency: number,
  layaBpm = 60,
): BiotensegrityState {
  const S = Math.min(100, Math.max(0, stress));
  const V = Math.min(100, Math.max(0, vagalTone));
  const R = Math.max(0, roughness);
  const f = Math.max(1, frequency);
  const L = Math.min(180, Math.max(40, layaBpm));

  const basePrestress = 25.0;
  const fascialPrestressKPa = basePrestress + S * 0.45 - V * 0.2;

  const coherenceFactor = Math.max(0.05, 1.0 - R * 4.0);
  const piezoelectricPotentialMv = f * 0.035 * coherenceFactor * (V / 100);

  const cellularShearStrain = Math.max(0.001, (S * 0.008) / (1.0 + V * 0.05));

  const duralResonanceCoherence = Math.min(
    1.0,
    Math.max(0.1, coherenceFactor * (1.0 - S / 150.0) * Math.exp(-Math.pow(L - 50, 2) / (2 * 18 * 18))),
  );

  const visceralLock = Math.exp(-Math.pow(f - VISCERAL_LOCK_HZ, 2) / (2 * 18 * 18));

  return {
    fascialPrestressKPa: Number(fascialPrestressKPa.toFixed(2)),
    piezoelectricPotentialMv: Number(piezoelectricPotentialMv.toFixed(2)),
    cellularShearStrain: Number(cellularShearStrain.toFixed(4)),
    duralResonanceCoherence: Number(duralResonanceCoherence.toFixed(3)),
    visceralLock: Number(visceralLock.toFixed(3)),
  };
}
