# Saint Paul After Dark

> *Every city has rules. Saint Paul had an arrangement.*

An interactive, graphic-noir web tour exploring seven places in Saint Paul's underworld history through original vector scenes, primary evidence records, an interactive city map, and a connected analytical narrative examining municipal corruption, refuge, and reform.

---

## Overview

Between 1900 and 1936, Saint Paul operated under the "O'Connor system"—an informal municipal arrangement instituted by Police Chief John O'Connor that granted visiting criminals refuge on three conditions: check in upon arrival, pay tribute to intermediaries, and commit no major crimes within city limits.

This project investigates how that bargain functioned, who benefited, who absorbed the exported costs, and what forensic and political forces ultimately dismantled it.

- **7 Sourced Locations:** Green Lantern Saloon, Saint Paul Hotel, Castle Royal Caves, Hamm Brewery area, Lincoln Court Apartments, and the Federal Courthouse.
- **30 Verified Claims (C01–C30):** Grounded in federal appellate court dockets, FBI case archives, Minnesota Historical Society research, and period newspaper accounts.
- **14 Evidence Records (E01–E14):** Court transcripts, corporate charters, ransom letters, and latent silver-nitrate fingerprint records.
- **Four Reusable Interaction Presenters:** Relationship diagrams, dated comparisons, sequential timelines, and forensic document viewers.
- **Audio Narration & Ambience:** Self-hosted narration tracks and rain/room tone ambience.
- **Calm View & Low-Effort Navigation:** One-click reduced sensory mode removing decorative textures and animations; full keyboard and screen-reader accessibility.

---

## Technical Stack & Architecture

- **Framework:** [Astro](https://astro.build/) (v5 static output mode)
- **Language:** TypeScript (strict type checking)
- **Styling:** Vanilla CSS design tokens (`tokens.css` + `global.css`) — zero heavy UI dependencies or Tailwind
- **Assets:** Self-hosted typography (Barlow Condensed & Source Sans 3 with OFL licenses), responsive SVG scenes, CBR 128k MP3 narration
- **State & Storage:** Local browser `localStorage` manager with safe quota boundaries and memory fallbacks
- **Testing:**
  - Content validation script: `scripts/validate-content.mjs`
  - Unit testing: [Vitest](https://vitest.dev/)
  - Browser E2E testing: [Playwright](https://playwright.dev/)

---

## Project Structure

```
stp-gangster-tour/
├── astro.config.mjs         # Astro static output configuration
├── package.json             # Scripts and dependencies
├── spec.md                  # Comprehensive functional & technical specification
├── history.md               # Complete 7-stop historical narrative draft
├── research.md              # Research ledger: claims, evidence, and citations
├── roadmap.md               # Milestone tracking and upcoming work
├── docs/                    # Architecture, verification, and editorial guides
│   ├── architecture.md
│   ├── evidence-ledger.md
│   └── verification.md
├── scripts/
│   ├── validate-content.mjs # Validates JSON cross-references and media files
│   └── generate-audio.mjs   # Speech-synthesis and ffmpeg audio pipeline
├── public/
│   ├── fonts/               # Self-hosted WOFF2 fonts
│   ├── licenses/            # Font licenses
│   └── media/
│       ├── audio/           # Narration tracks and ambience beds
│       └── scenes/          # Original graphic-noir SVG scenes
├── src/
│   ├── components/          # Reusable Astro components
│   │   ├── AudioPlayer.astro
│   │   ├── ComparisonPresenter.astro
│   │   ├── DocumentPresenter.astro
│   │   ├── EvidenceItem.astro
│   │   ├── Header.astro / Footer.astro
│   │   ├── RelationshipPresenter.astro
│   │   ├── SequencePresenter.astro
│   │   └── SvgMap.astro
│   ├── data/                # Validated JSON data files
│   ├── layouts/Layout.astro # Root layout with SEO and Calm view injector
│   ├── pages/               # Static route definitions
│   │   ├── index.astro      # Tour landing page
│   │   ├── prologue.astro   # Contextual prologue
│   │   ├── map.astro        # Interactive cartographic stop selector
│   │   ├── stops/[id].astro # Dynamic 7-stop reading route
│   │   ├── casebook.astro   # Evidence inspector and progress tracker
│   │   ├── sources.astro    # Full claims (C01–C30) & sources (S01–S16) ledger
│   │   └── epilogue.astro   # Historical synthesis and closing actions
│   ├── scripts/             # Client-side TypeScript controllers
│   └── styles/              # CSS tokens and global base styles
└── tests/
    ├── unit/                # Vitest data integrity tests
    └── browser/             # Playwright end-to-end user journey tests
```

---

## Getting Started

### Prerequisites

- Node.js 18+ (tested on Node 22+)
- npm 9+

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

Visit [http://localhost:4321](http://localhost:4321) to explore the tour locally.

---

## Verification & Testing

Run deterministic gates quietly:

```bash
# 1. Type check and content cross-reference validation
npm run check

# 2. Vitest data integrity unit test suite
npm run test:unit

# 3. Playwright end-to-end browser test suite
npm run test:browser

# 4. Production static build
npm run build
```

---

## Content Integrity & Ethics Policy

- **Fact vs. Lore:** Primary records (court opinions, incorporation filings, police archives) are strictly distinguished from period accounts, retrospective folklore, and tour interpretations.
- **Victim & Community Visibility:** The tour emphasizes who absorbed the costs of the arrangement (neighboring towns, kidnapping victims, unrepresented citizens), rejecting glorification of criminal violence.
- **Privacy & Respect:** Zero runtime user tracking, telemetry, or remote font tracking. All assets are self-contained.
