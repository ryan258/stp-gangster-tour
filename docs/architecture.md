# Architecture & Design System

This document outlines the architectural patterns, styling conventions, state management, and component systems used in **Saint Paul After Dark**.

---

## 1. Static Generation (SSG) with Astro

The site runs on Astro v5 configured in `output: 'static'` mode:
- **Zero Server Overhead:** All HTML pages are pre-compiled during `npm run build` into `dist/`.
- **Pre-rendered Routes:**
  - `/` — Landing page with hero illustration and resume bookmark prompt.
  - `/prologue/` — Concise narrative framing.
  - `/map/` — SvgMap directory.
  - `/stops/[id]/` — Seven static stop routes generated via `getStaticPaths()`.
  - `/casebook/` — Evidence item dossier and inspection tracker.
  - `/sources/` — Claims (C01–C30) and sources (S01–S16) ledger.
  - `/epilogue/` — Narrative closing and completion review.
- **Island Hydration:** Client-side JavaScript is selectively attached only where needed:
  - Audio playback controller (`src/scripts/audio.ts`)
  - Presenter button toggles (`src/scripts/selection.ts`)
  - Casebook filtering and bookmark tracking (`src/scripts/casebook.ts`, `src/scripts/storage.ts`)
  - Calm view preference toggling (`src/scripts/calm.ts`)

---

## 2. Design System & Tokens

Styles are defined using native CSS custom properties without third-party frameworks:

### Color Palette (`src/styles/tokens.css`)
- `--color-ink`: `#0B0C10` (Dark, immersive noir background)
- `--color-paper`: `#F3EFE6` (Warm archival paper for body text)
- `--color-surface-card`: `#151820` (Subtle contrast card backgrounds)
- `--color-muted`: `#9A9AA0` (Secondary metadata and footnotes)
- `--color-accent`: `#C62F42` (Vivid crimson accent reserved for focal points)
- `--color-border`: `#282C37` (Structural containment borders)
- `--color-border-subtle`: `#1E222B` (Divider lines)

### Typography
- **Title & Headings:** `Barlow Condensed`, `sans-serif` (Self-hosted WOFF2, Semibold 600/700).
- **Body & Controls:** `Source Sans 3`, `sans-serif` (Self-hosted WOFF2, Regular 400 and Semibold 600).
- **Measure:** Line-height at 1.5–1.65, line-length bounded to 60–75 characters (`--container-prose-width: 820px`).

### Calm View Mode
Users can toggle **Calm view** at any time. When `.calm-mode` is added to `<html>`:
- Decorative shadows and high-contrast gradients are suppressed.
- Motion transitions are eliminated (`transition: none !important`).
- Halftone backgrounds and ambient noise overlays are disabled.
- Essential content contrast remains fully accessible.

---

## 3. Reusable Interactive Presenters

To honor Spec R2, seven distinct locations are experienced through four reusable presentation components that render full text before JavaScript runs:

1. **`RelationshipPresenter.astro`**
   - Displays interrelated participants, institutional conditions, and mechanisms.
   - Used in Stop 1 (The Three Conditions: Check-in, Pay, Keep crimes outside).
2. **`ComparisonPresenter.astro`**
   - Compares two perspectives, records, or timelines (e.g. Tax Net-Worth vs. Juror Tampering in Stop 2, Corporate Charter vs. 1970s folklore in Stop 3, Extortion vs. Response in Stop 5, Convictions vs. Civil Service Reform in Stop 7).
3. **`DocumentPresenter.astro`**
   - Contrasts primary documentary text with forensic traces (e.g. Hamm Ransom Letters vs. FBI Silver-Nitrate Fingerprints in Stop 4).
4. **`SequencePresenter.astro`**
   - Renders a multi-stage dated timeline (e.g. Lincoln Court apartment standoff in Stop 6).

---

## 4. State & Local Storage (`src/scripts/storage.ts`)

Progress and preferences are managed strictly on the client using `localStorage`:
- **Progress Key:** `stp-after-dark:progress:v1`
  - `bookmark: { stopId, blockId }`
  - `visitedStops: string[]`
  - `inspectedEvidence: string[]`
  - `endingReached: boolean`
- **Preferences Key:** `stp-after-dark:preferences:v1`
  - `calmView: boolean`
  - `narrationVolume: number`
  - `ambienceVolume: number`
  - `playbackSpeed: number`
- **Safety Protections:**
  - Payload length capped at 32 KiB.
  - Safe memory fallbacks for restricted iframe or cookie-disabled modes.
  - Resetting progress explicitly leaves preferences intact.
