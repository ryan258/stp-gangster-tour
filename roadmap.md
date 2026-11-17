# Completion plan — edition 0.5.0

This is a bounded personal reading experience. The next work completes its quality requirements; it does not add GPS, accounts, cloud sync, bookings, a backend, alternate history, or additional editions.

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
- [x] Standalone iPad/iOS PWA Home Screen support: web app manifest, 180×180 Apple touch icon, 192/512px icons, standalone display mode, safe-area inset protection, and automated Playwright verification.
- [x] Continuous homepage story & motion presentation: scroll-linked chapter journey with GSAP ScrollTrigger (replacing Motion 14 on 2026-11-03), sticky desktop artwork, native source disclosures beside each scene, instant Calm view / reduced-motion tear-down, and phone-width 320px reflow.
- [x] Six browser storytelling studies (`/studies/`): source-linked interactive experiments for shifting questions, margin redactions, paired-window sync, acoustic distance filtering, alternative openings with View Transitions, and dual-scale timelines, backed by `studies.json` and `study-schema.mjs`.
- [x] Scroll-driven 3D pop-up scenes for all seven chapters: `popup.ts` cuts each scene's SVG into depth layers by its own comment markers (Lincoln Court's three panels staggered), each unfolding and dollying to its own focal light, scrubbed by GSAP ScrollTrigger, preserving SVG digest integrity, with static fallbacks for Calm view, reduced motion, and no JavaScript. (The first version used CSS `animation-timeline` and silently never ran in production builds, because the minifier folded it into a shorthand Chrome rejects; ScrollTrigger replaced it.)
- [x] GSAP showcase direction (Ryan, 2026-11-03): GSAP + ScrollTrigger + SplitText drive every scroll effect on the home story and chapter pages (headline word reveals, staggered evidence cards, drifting chapter numerals, pop-up scrubs, parallax and progress); Motion 14 is removed. ScrollMagic was considered and dropped (v2 unmaintained, v3 a pre-release without Controller/Scene/pin) because ScrollTrigger covers its scenes, pinning and scrubbing. ScrollSmoother is deliberately not used. `studies.ts` still demonstrates the native Web Animations and View Transitions APIs on purpose.
- [x] Actors-and-costs board on all seven chapters (2026-11-04): after Ryan found the pop-up scenes flat and dated, every chapter got a content-driven board with linked text phrases (`board.json`, `ActorBoard.astro`, `story.ts`). The beats and the 53 phrase links are drafts that need Ryan's editorial review. **Decide next:** approve the boards, then retire the dormant pop-up code (`PopUpScene.astro`, `popup.ts`, its tests and CSS) and, if wanted, the eight scene SVGs, which removes 16 of the 56 release gates (8 reference reviews, 8 rights) at the cost of a schema change.
- [x] Casebook expansion (2026-11): 71 archival side stories across dedicated pages (`casebook-stories.json`, `src/pages/casebook/stories/*`) with route diagrams, parallel accounts, and scene sequences; 7 immersive casebook experiences (`casebook-experiences.json`, `src/pages/casebook/*`).
- [x] Interactive Paper Trails (2026-11): seven archival stories presented as interactive desks (cigar counter, paired letters, inventor's pitch, freight stages, call log, escape sequence, pocket ledger) linking each scene to claims and sources with full no-JS support (`paper-trails.json`, `PaperTrailDesk.astro`, `PaperTrailMotion.astro`).
- [x] Visual story artwork & layered scenes (2026-11): cinematic painted backdrop plates and 3-pose transparent character sprite sheets for all seven chapters, opening doorway, and walking visitor (`visual-story.json`, `VisualStory.astro`, `LayeredScene.astro`, `sprite-interpolation.ts`, `docs/visual-story-art.md`).
- [x] Editorial chapter heroes & title sequence (2026-11): typography-driven chapter headers, title sequence art/record frames, glyphs, and brand tokens (`TitleSequence.astro`, `EditorialChapterHero.astro`, `tokens.css`).
- [x] Cross-page cuts (2026-11-15): native cross-document View Transitions (`story.scss`, `Layout.astro`). The chapter title frame and title hold their place from the home story into a chapter and between chapters; the header stays put. Reduced motion, Calm view, no-JavaScript reading and unsupported browsers get an ordinary page load. Ryan ran `npm run build:preview && npm run test:browser` on 2026-11-15: 56 passed. The feel of the cut still needs his eye.
- [x] Brand theme refresh: ink palette `#171310`, updated touch icons, favicon, web manifest, and 320px reflow guarantees.
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

