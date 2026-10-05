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

### Phase 3: Core Application & Interactions (v0.4 — Current State)
- [x] **Astro Static Architecture:** Fully pre-rendered static routes for all 13 pages (Landing, Prologue, Map, 7 Stops, Casebook, Sources, and Epilogue).
- [x] **Four Interactive Presenters:**
  - `RelationshipPresenter`: Three conditions of the O'Connor arrangement (Stop 1).
  - `ComparisonPresenter`: Financial net-worth vs. juror tampering (Stop 2), documented venue vs. 1970s folklore (Stop 3), extortion demands vs. family response (Stop 5), and convictions vs. charter reform (Stop 7).
  - `DocumentPresenter`: Extortion communications vs. forensic silver-nitrate fingerprinting (Stop 4).
  - `SequencePresenter`: Dated three-stage apartment standoff at Lincoln Court (Stop 6).
- [x] **Interactive SvgMap:** Interactive geographic directory of all 7 stops with address, historical name, access level, and precision indicators.
- [x] **Casebook Inspector:** Tracks inspected evidence items locally, with filter controls and a safe reset flow.
- [x] **Accessibility & Calm View:** Quick-toggle low-sensory mode, keyboard navigation, live status announcer, and skip links.
- [x] **Test Harnesses:**
  - Vitest unit tests verifying data integrity and cross-references.
  - Playwright browser tests covering full tour progression, presenters, and casebook states.

---

## Future Roadmap (v0.5 – v1.0)

### Phase 4: Field Guide & Offline Enhancements (v0.5)
- [ ] **Offline PWA Support:** Service worker precaching for audio and scene vectors to support walking exploration with poor cell reception.
- [ ] **Printable Walking Dossier:** CSS `@media print` stylesheets formatting each stop into a concise field-guide page with QR codes and historical walking directions.
- [ ] **GPS Proximity Prompting:** Optional geolocation cue when a user approaches within 100 meters of a verified stop (e.g. Wabasha & 4th, Saint Paul Hotel, Landmark Center).

### Phase 5: Archival Photography & Expanded Ledger (v1.0)
- [ ] **Archival Photo Overlays:** Optional historic photo comparisons from Minnesota Historical Society public collections for stops with verified contemporary imagery.
- [ ] **Audio Narration Voice Options:** Alternative voice profiles (e.g., masculine baritone vs. feminine documentary voice) selectable in Audio preferences.
- [ ] **Searchable Claim Explorer:** Full-text filter in `sources.astro` for searching across claim assertions, judicial docket numbers, and historical names.
