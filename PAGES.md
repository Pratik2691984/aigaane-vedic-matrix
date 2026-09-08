# Staging Navrasa off aigaane.in

aigaane.in is a different repo/SPA. Do not merge PR #5 until audio smoke passes on a URL that is *not* the Nakshatra app.

## Instant (no Pages toggle)
Open the raw file via jsDelivr:

https://cdn.jsdelivr.net/gh/Pratik2691984/aigaane-vedic-matrix@main/public/navrasa.html

## GitHub Pages (one dashboard click)
1. Repo → Settings → Pages
2. Source: Deploy from a branch
3. Branch: `main` / folder: `/docs`
4. After the first build:
   https://pratik2691984.github.io/aigaane-vedic-matrix/navrasa.html

Copy `public/navrasa.html` → `docs/navrasa.html` before enabling `/docs`.

## Production later
Copy `public/navrasa.html` into the *actual* aigaane.in public root and put a file-first nginx/Vercel rule *before* the SPA fallback.
