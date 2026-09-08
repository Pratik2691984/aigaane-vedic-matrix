# aigaane-vedic-matrix

Complete 10-feature Body–Mind–Vedic controller for aigaane.in.

Live route: `/vedic-matrix`

## Features

1. Hover cards — domain badge, Lucide token name, 5-level popup
2. Zoomable map — 0.2×–2.5× pan/zoom SVG canvas, domain clusters
3. Connection lines — 57 directed edges (51 target links + loop extras), 5 kinds
4. Loop animations — dash pulse on feedback + acoustic edges
5. Dynamic sliders — Matrix 3 transfer functions (stress, vagal, laya)
6. Vedic calculator — 2^n prāstāra, Meru, Virahanka, 22-śruti JI audio
7. Body–mind quiz — 10-item bank mapped to node ids
8. Daily insights — `NodeIndex = (dayOfYear % 51) + 1`
9. Wearable telemetry — mock JSON + Web Bluetooth request with mock fallback
10. Export — PNG, SVG, JSON system state

## Run

```bash
npm install
npm run dev
# http://localhost:3000/vedic-matrix
```
