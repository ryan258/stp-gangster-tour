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
   - Validates JSON schemas and cross-references across stops, claims, evidence, sources, metagames, and people.
   - Verifies all referenced SVG scene files and MP3 audio files exist on disk with valid file digests.
   - Validates narration listening review status (`listeningReviewStatus === 'passed'`).

### B. Unit Testing
```bash
npm run test:unit
```
Runs Vitest unit tests in `tests/unit/` to verify:
- Stop sequencing and required narrative blocks.
- Claim statuses and source mappings.
- Evidence-to-claim and evidence-to-stop foreign key integrity.
- Metagame ownership.
- Edition synchronization.

### C. Browser End-to-End Testing
```bash
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
Compiles static HTML pages for all 13 routes into `dist/`.

---

## 2. Audio Pipeline Verification

When adding or revising narration text:
1. Run audio generation pipeline:
   ```bash
   node ./scripts/generate-audio.mjs
   ```
2. The script synthesizes speech via macOS TTS, normalizes loudness to -16 LUFS via ffmpeg, writes CBR 128k MP3s, and updates SHA-256 digests in `src/data/media.json`.
3. Conduct listening review and log confirmation in `src/data/narration-reviews.json`.
