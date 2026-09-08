# aigaane-vedic-matrix

Drop-in Next.js App Router module for [aigaane.in](https://aigaane.in).

## Route

`/vedic-matrix` — 22-Śruti just-intonation lattice + tanpura drone + 51-subsystem graph.

## Copy into an existing Next.js app

```
src/app/vedic-matrix/page.tsx
src/components/VedicExplorer.tsx
src/lib/secureAcoustics.ts
src/lib/vedicCombinatorics.ts
src/data/subsystemGraph.json
```

Path alias `@/*` → `./src/*` is required.

## Local test

```bash
npm install
npm run dev
# open http://localhost:3000/vedic-matrix
```

## Notes

- AudioContext is client-only and gated behind user gesture (`trigger` / `toggleDrone`).
- Packed 32-bit śruti ratios: `(num << 16) | den`.
- Tabs filter the 51-subsystem list; śruti pads stay global.
- Combinatorics (`meruPrastara`, `sanyoga`) are exported for later Pingala UI, not yet wired into the explorer.
