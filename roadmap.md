# Saint Paul After Dark: Roadmap & Milestones

This document tracks development milestones, current production status, and planned future iterations for the **Saint Paul After Dark** interactive history tour.

---

## Completed Milestones

### Phase 1: Research, Specification & Content Ledger (v0.1–v0.2)
- [x] **Historical Draft (`history.md`):** Complete seven-stop reading route spanning the 1900 O'Connor truce to the 1936 civil service reforms.
- [x] **Research Ledger (`research.md`):** Formal cataloging of 30 historical claims (C01–C30), 14 primary evidence treatments (E01–E14), 16 bibliography sources (S01–S16), and 7 metagame analytical frameworks (M01–M07).
- [x] **Technical & Functional Specification (`spec.md`):** Detailed specification v0.4 detailing accessibility standards, interaction presenters, audio parameters, and local data storage limits.

### Phase 2: Assets & Data Architecture (v0.3)
- [x] **Vector Scene Art:** Created 8 graphic-noir SVG illustrations adhering to hard black/white/crimson palette (`scene-skyline`, `scene-arrangement`, `scene-hotel`, `scene-caves`, `scene-hamm`, `scene-lincoln`, `scene-courthouse`, `scene-bremer`).
- [x] **Audio Narration & Ambience:** Synthesized 7 introduction tracks normalized to -16 LUFS with Daniel/Samantha voice models, accompanied by 2 subtle environmental beds (city rain and room tone).
- [x] **Self-Hosted Typography:** Packaged Barlow Condensed Semibold and Source Sans 3 Regular/Semibold with OFL licenses.
- [x] **Validated Content Store (`src/data/`):** 11 strictly structured JSON datasets powering stops, claims, evidence, media, and people.
- [x] **Automated Content Validator (`scripts/validate-content.mjs`):** Script checking reciprocal IDs, media files, and digest integrity.

### Phase 3: Core Application & Presenters (v0.4)
- [x] **Astro Static Architecture:** Fully pre-rendered static routes for all 13 pages (Landing, Prologue, Map, 7 Stops, Casebook, Sources, and Epilogue).
- [x] **Four Interactive Presenter Patterns:** Relationship, comparison, document, and sequence interaction patterns.
- [x] **Interactive Directory & Cartography:** Seven-stop directory with address, historical name, access level, and precision indicators.
- [x] **Casebook Inspector:** Tracks inspected evidence items locally, with filter controls and a safe reset flow.
- [x] **Accessibility & Calm View:** Quick-toggle low-sensory mode, keyboard navigation, live status announcer, and skip links.
- [x] **Test Harnesses:** Vitest unit suite and Playwright browser tests.

### Phase 4: Schema Rigor & Editorial Refinement (v0.5 — Current Working Preview)
- [x] **Strict Zod Content Schema (`scripts/content-schema.mjs`):** Formal Zod definitions validating all 11 catalog datasets.
- [x] **Unified Interactive Presenter (`src/components/Presenter.astro`):** Consolidated presenter architecture driven by `src/data/presenters.json`.
- [x] **Python SVG Validation (`scripts/check-svg.py`):** Structural XML well-formedness and dimension check integrated into validation pipeline.
- [x] **Transparent Location Epistemology (`src/data/locations.json`):** Separation of historical identity from current condition, verified access, and geographic coordinates. Unplaced venues cleanly track pending status.
- [x] **Explicit Release Gate System:** Distinguishes structural verification passes from outstanding release obligations (checked coordinates, human listening reviews, distribution rights, and lossless audio masters).
- [x] **Enhanced Reading & Navigation Controller (`src/scripts/reading.ts`):** Scroll-aware block tracking, bookmark persistence, and accessible navigation (`StopNav.astro`, `ClaimLinks.astro`, `404.astro`).

---

## Future Roadmap (v0.6 – v1.0)

### Phase 5: Release Gates & Editorial Certification (v0.6)
- [ ] **Venue Coordinates Verification:** Resolve checked latitude/longitude coordinates and event footprints for the primary historic venues (The Saint Paul Hotel, Wabasha Street Caves, Landmark Center).
- [ ] **Human Narration & Rights Certification:** Formal human listening reviews, pronunciation verification, and distribution rights sign-offs logged in `src/data/narration-reviews.json`.
- [ ] **Lossless Master Archiving:** Retain uncompressed master audio files in `public/media/masters/`.

### Phase 6: Field Guide & Offline Enhancements (v0.7)
- [ ] **Offline PWA Support:** Service worker precaching for audio and scene vectors to support walking exploration with poor cell reception.
- [ ] **Printable Walking Dossier:** CSS `@media print` stylesheets formatting each stop into a concise field-guide page with QR codes and historical walking directions.
- [ ] **GPS Proximity Prompting:** Optional geolocation cue when a user approaches within 100 meters of a verified stop.

### Phase 7: Archival Photography & Expanded Ledger (v1.0)
- [ ] **Archival Photo Overlays:** Optional historic photo comparisons from Minnesota Historical Society public collections for stops with verified contemporary imagery.
- [ ] **Audio Narration Voice Options:** Alternative voice profiles selectable in Audio preferences.
- [ ] **Searchable Claim Explorer:** Full-text filter in `sources.astro` for searching across claim assertions, judicial docket numbers, and historical names.
