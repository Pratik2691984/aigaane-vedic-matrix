# Audit lock — Malkauns pentatonic integrity & Plomp–Levelt aggregation

## 1. Rāga Malkauns (Audūva–Audūva)

Traditional Hindustani Malkauns / Malkosh is strictly pentatonic:

`{Sa, ga₂, ma₁, dha₂, ni₂} ≡ {1/1, 6/5, 4/3, 8/5, 9/5}`

Re and Pa are *varjit*. Inserting Pa (3/2) into the Malkauns ratio string or FHIR Observation extension destroys the rāga identity (the missing fifth is load-bearing).

Canonical source in this repo:

- `src/components/tabs/VedicMatrixEngineTab.jsx` → `RAGA_ARCHETYPES.malkauns.svaraIndices = [1, 7, 10, 16, 20]`
- FHIR `shruti-ratios` extension is derived from `activeSvaras` only, so Malkauns emits `1/1, 6/5, 4/3, 8/5, 9/5`.

Pa remains in the global 22-śruti matrix (index 14) and in rāgas that actually use it (Darbārī, Hamsadhwanī, Bhairavī).

## 2. Plomp–Levelt harmonic aggregation

For fundamentals \(F_1, F_2\) and \(H\) partials:

\[
d(f_1,f_2)=\mathrm{e}^{-3.5 s\Delta f}-\mathrm{e}^{-5.75 s\Delta f},\quad
s=\frac{0.24}{0.021 f_{\min}+19}
\]

\[
D_{\mathrm{total}}=\sum_{i=1}^{H}\sum_{j=1}^{H} a_i b_j\, d(i F_1,\, j F_2),\quad a_i=\frac{1}{i},\; b_j=\frac{1}{j}
\]

Implementation: `calculateHarmonicRoughness` (normalized by \(\sum_i a_i^2\)) and `src/lib/plompLevelt.ts` (`computeHarmonicRoughness`, unnormalized, used by the 22-śruti explorer).

These transfer functions are educational models, not clinical assays.
