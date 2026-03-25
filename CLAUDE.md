# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Starsight — a browser-based AR celestial navigation app. Uses phone camera + device orientation to identify stars and capture sextant sights. Computes position fix from unknown starting location using plate-solving (blind star identification from angular separation patterns) and multi-body least-squares / Gauss-Newton COP fix.

Companion project to [Celestial Navigator](../celestial/) — shares the computation engine but has a distinct AR-first UI.

## Commands

```bash
node test-engine.js               # Run computation engine test suite
```

No build, lint, or compile steps. Open `index.html` directly in a browser (or serve locally for camera access — HTTPS required for `getUserMedia`).

## Architecture

- `index.html` — Main app: AR camera overlay, sight capture, fix computation. All CSS inline.
- `engine.js` — Computation engine extracted from Celestial Navigator: ephemeris (VSOP87 Sun, Standish planets, lunar theory, J2000 star catalog), Hs→Ho correction, sight reduction, least-squares + direct fix, plate-solving star identification.
- `sw.js` — Service worker (cache-first PWA)
- `manifest.json` — PWA manifest
- `test-engine.js` — Node.js test harness for engine.js

## Key Conventions

- **No build step.** Plain JS/CSS, no frameworks, no ES modules.
- **engine.js is shared computation.** When modifying astronomical functions, keep in sync with Celestial Navigator's index.html (both derive from the same algorithms).
- **Commit format:** `<type>: <description>` (feat/fix/docs/test/chore). Keep messages neutral and professional.
- **Design:** Dark theme (#06091a bg, #c8a84b gold accent), same typography as Celestial Navigator (Cinzel headers, Share Tech Mono data, Crimson Pro body).
- **Camera access requires HTTPS** in production. For local dev, `localhost` works without HTTPS.
