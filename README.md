# aigaane-vedic-matrix

10-feature Body–Mind–Vedic controller for aigaane.in.

Route: `/vedic-matrix`

Public wording: English first, IAST in parentheses. See [TERMS.md](TERMS.md).

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

```bash
npm install
npm run dev
# http://localhost:3000/vedic-matrix
```
