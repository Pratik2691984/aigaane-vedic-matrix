/**
 * Plomp–Levelt sensory dissonance kernel and 5-limit ratio helpers.
 * Educational model. Not a clinical assay.
 */

export interface RoughnessPoint {
  frequency: number;
  roughness: number;
}

/** Syntonic comma (pramāṇa śruti): 81/80 ≈ 21.506 ¢ */
export const SYNTONIC_COMMA = 81 / 80;
export const SYNTONIC_COMMA_CENTS = 1200 * Math.log2(SYNTONIC_COMMA);

/**
 * Elementary Plomp–Levelt pairwise roughness between two pure partials.
 * d(f1, f2) = e^{-3.5 s Δf} − e^{-5.75 s Δf}
 * s = 0.24 / (0.021 f_min + 19)
 */
export function pairRoughness(f1: number, f2: number): number {
  const fMin = Math.min(f1, f2);
  const deltaF = Math.abs(f1 - f2);
  if (deltaF === 0) return 0;
  const s = 0.24 / (0.021 * fMin + 19);
  return Math.exp(-3.5 * s * deltaF) - Math.exp(-5.75 * s * deltaF);
}

/**
 * Total sensory roughness of interval (f0, f0·ratio) across N harmonic
 * partials with 1/n amplitude falloff.
 */
export function computeHarmonicRoughness(
  f0: number,
  ratio: number,
  numPartials = 8,
): number {
  const fTarget = f0 * ratio;
  let totalDissonance = 0;
  for (let i = 1; i <= numPartials; i++) {
    const fA = i * f0;
    const aA = 1 / i;
    for (let j = 1; j <= numPartials; j++) {
      const fB = j * fTarget;
      const aB = 1 / j;
      totalDissonance += aA * aB * pairRoughness(fA, fB);
    }
  }
  return totalDissonance;
}

export function ratioToCents(num: number, den: number): number {
  return 1200 * Math.log2(num / den);
}

export function tetRatioFromCents(cents: number): number {
  return Math.pow(2, cents / 1200);
}

/** JI roughness minus 12-TET roughness for the same nominal scale degree. */
export function roughnessDeltaVsTet(
  f0: number,
  jiRatio: number,
  tetCents: number,
  numPartials = 8,
): { ji: number; tet: number; delta: number } {
  const ji = computeHarmonicRoughness(f0, jiRatio, numPartials);
  const tet = computeHarmonicRoughness(f0, tetRatioFromCents(tetCents), numPartials);
  return { ji, tet, delta: ji - tet };
}
