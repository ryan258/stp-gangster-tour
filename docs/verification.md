# Verification & Quality Assurance Guide

This document describes the automated verification gates and manual review protocols established for **Saint Paul After Dark**.

---

## 1. Automated Verification Gates

All automated checks must pass cleanly with zero errors or warnings before committing changes.

### A. Type & Content Check
```bash
npm run check
```
Runs:
1. `astro check`: Validates TypeScript types across all `.astro`, `.ts`, and `.mjs` files.
2. `node ./scripts/validate-content.mjs`:
   - Validates JSON datasets against strict schemas in `scripts/content-schema.mjs`.
   - Validates reciprocal references across stops, claims, evidence, sources, metagames, locations, presenters, and people.
   - Verifies transcript sha256 digests against recorded audio narrations.
   - Spawns `scripts/check-svg.py` to validate XML parsing and dimensions of all SVG scenes.
   - Separates structural content passes from outstanding editorial release gates (checked coordinates, human listening reviews, rights approvals, lossless audio masters).

### B. Unit Testing
```bash
npm run test:unit
```
Runs Vitest unit tests in `tests/unit/` (`data-integrity.test.ts`, `storage.test.ts`) to verify:
- Stop sequencing, narrative word counts, and required narrative blocks.
- Claim statuses and source mappings.
- Evidence-to-claim and evidence-to-stop foreign key integrity.
- Metagame ownership.
- Edition synchronization.
- Local storage encoding, quota limits, and memory fallbacks.

### C. Browser End-to-End Testing
```bash
npm run build:preview
npm run test:browser
```
Runs Playwright tests against an Astro preview build verifying:
- Landing hero, brand elements, and route entry points.
- Prologue sequence and progression to Stop 1.
- Stop 1 narration controls and interactive condition selection.
- SvgMap rendering and 7-stop directory counts.
- Casebook evidence rendering and filter buttons.
- Sources ledger rendering for all 30 claims and 16 sources.

### D. Production Static Build
```bash
npm run build
```
Runs `validate-content.mjs --production` and compiles static HTML pages into `dist/`.

---

## 2. Audio Pipeline Verification

When adding or revising narration text:
1. Run audio generation pipeline:
   ```bash
   node ./scripts/generate-audio.mjs
   ```
2. The script synthesizes speech via macOS TTS, normalizes loudness to -16 LUFS via ffmpeg, writes CBR 128k MP3s, and updates SHA-256 digests in `src/data/media.json`.
3. Conduct listening review and log confirmation in `src/data/narration-reviews.json`.
