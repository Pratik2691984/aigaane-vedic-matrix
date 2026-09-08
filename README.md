# aigaane-vedic-matrix

10-feature Body–Mind–Vedic controller for aigaane.in.

Routes:

- `/vedic-matrix` — map, 22-śruti explorer, **Vedic matrix engine** tab
- `/vedic-matrix/engine` — standalone production engine (rāga presets, telemetry, FHIR R4)

Public wording: English first, IAST in parentheses. See [TERMS.md](TERMS.md).
Audit lock: [AUDIT-MALKAUNS-PLOMP.md](AUDIT-MALKAUNS-PLOMP.md).

## Features

1. Hover cards
2. Zoomable map (0.2×–2.5×)
3. Connection lines (57 edges, 5 kinds)
4. Loop animations
5. Dynamic sliders (Matrix 3)
6. Vedic calculator (prastāra, meru, Virahaṅka, 22-śruti)
7. Body–mind quiz
8. Daily insight `(dayOfYear % 51) + 1`
9. Wearable ingest (mock + Web Bluetooth fallback)
10. Export PNG / SVG / JSON
11. Closed-form transfer engine + FHIR bundle (`src/components/tabs/VedicMatrixEngineTab.jsx`)

Rāga Malkauns is locked Audūva–Audūva: `{1/1, 6/5, 4/3, 8/5, 9/5}` (Re and Pa varjit).

```bash
npm install
npm run dev
# http://localhost:3000/vedic-matrix
# http://localhost:3000/vedic-matrix/engine
```
