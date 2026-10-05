# Completion plan — edition 0.5.0

This is a bounded personal reading experience. The next work completes its quality requirements; it does not add GPS, accounts, a PWA, bookings, a backend, alternate history, or additional editions.

## Implemented corrections

- [x] Complete static routes, recovery page, previous/next controls, reading blocks, casebook profiles and relationships, sources/credits and context returns.
- [x] Consolidate presenter copy in a validated catalog and remove unsupported details/overstated historical labels.
- [x] Validate record shapes, enums, dates, URLs, references, ownership, duplicate values, word counts and narration text digests.
- [x] Parse SVGs, reject active content, verify media/master hashes and probe MP3 format/duration.
- [x] Separate preview and production gates/output, with no automatically invented listening or rights approval.
- [x] Validate saved progress and preferences, bound UTF-8 bytes, recover malformed fields, preserve preferences on reset, and visibly report unavailable persistence.
- [x] Repair audio end/error/retry/cancellation, mute, Calm view, independent volumes, ducking and silent return behavior.
- [x] Retain original masters for regenerated narration and ambience outside published output.
- [x] Improve small-screen reflow, link contrast, keyboard focus, visible voice-control labels, no-JavaScript controls and printable sources.
- [x] Replace guessed geographic positions with three attributed approximate venue coordinates and four unplaced stops.
- [x] Add the sourced USGS river base, retain original/derived hashes and reuse attribution, inspect the rendered overview, and provide offline reproducible generation.
- [x] Configure GitHub Pages hosting and deployment workflow (`.github/workflows/deploy.yml`) with base-path and origin-URL resolution for subpath publication.
- [x] Extend the graphic noir redesign across the entire reading experience: full-bleed `ExperienceHero` components with marginalia and Roman folios, interactive `ReadingTrail` with visited status, tabbed navigation, and paper-styled location files (`experience.scss`, `map.scss`).
- [x] Streamline layout presentation by removing the intrusive "Work in progress" preview bar from `Layout.astro` while preserving complete edition status and review notes in `sources.astro#edition-status`.
- [x] Configure asynchronous image decoding (`decoding="async"`) across all newly introduced WebP assets, ensuring verified error-free loading under Playwright headless test runs.
- [x] Harmony pass (2026-10-05): self-hosted all fonts (no third-party requests), compact scrolling header on small screens, 16px type floor and 44px targets, favicon/canonical/Open Graph/robots/sitemap, `noindex` while unreviewed.
- [x] Image provenance catalog (`media.images`) with release gates, `srcset` variants and lazy loading; human-reviewer enforcement in the schema; geography review reset to pending (it had been recorded by an assistant).
- [x] Data hygiene: orphan claim/source checks, real `supports` text, catalog-derived counts and ambience/chapter notes, C29 now cited, S16 attached to Lincoln Court as an address lead.
- [x] Historian layer, first pass: method page, corrections log with per-claim correction links, archive snapshot links where one exists, `/data/` catalog + BibTeX + CSL-JSON, link-check report, axe and size-floor browser tests, CI workflow.
- [x] Add targeted data/storage/browser regression coverage with 320px reflow verification across all routes. Observed results and limits are in `docs/verification.md`.


## Required before calling the edition finished

| Work | Concrete solution | Completion evidence |
| --- | --- | --- |
| Listening review | Audition all seven narration tracks and both noise textures, comparing the introductions and checking names, comfort, playback speeds and fades. Correct and regenerate affected tracks only. | Named reviewer, date, current content revision and matching digests in `narration-reviews.json`; no automatic pass. |
| Media provenance/rights | Establish the existing SVG authorship/reference basis and applicable synthesized-voice distribution terms; retain the actual permission or licensing basis. | Explicit approved rights metadata and reference/render review records. No invented CC/public-domain assignment. |
| Place-specific art | Compare the eight SVGs with identified architectural/place references, revise inaccurate details and inspect the actual mobile rendering. | Source IDs, reviewer, date, revision and visual review. Generalized reconstruction labels remain where appropriate. |
| Editorial completion | Reconcile the complete visible catalog with passages, especially disputed attendance, person-specific outcomes, dates/locators and the Hamm setting conflict. | A documented editorial review; edition release status changes only after this work. |
| Device and assistive use | Verify Safari/iOS, VoiceOver, voice control, reduced motion, forced colors, 200–400% zoom, audio interruption and unsupported-mixer behavior with Ryan’s actual workflow. | Observed device/browser versions and findings; targeted fixes for failures. |
| Image provenance/rights | Record author, tool/method and distribution basis for each of the 10 WebP images. | `provenanceStatus: confirmed`, named reviewer, date and revision per image in `media.json`. |
| Geography review | Human review of the USGS river layer and rendered map. | Named reviewer and date in `geography.json`. |
| Performance acceptance | Measure the specified cold-entry body-byte, LCP and CLS conditions on representative routes. | Three-run medians under the stated network/CPU profile; no certification inferred from bundle size. |

## Next (historian layer, after the reviews above)

- Sentence-level attribution (inline claim markers validated at build; attribution is per passage today).
- Archive snapshots for the nine sources without one (`npm run links` lists them); consider primary newspaper and archive records for the 27 single-source claims.
- Sourced chronology; full-text search (spec currently lists search as out of scope — decide first).
- Choose and add a licence for code, prose, images and voice.

Production remains blocked by incomplete review records. The preview is usable for completing them. GitHub Pages automatically deploys the built preview edition via GitHub Actions on push to `main`.

