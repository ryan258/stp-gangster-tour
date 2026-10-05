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
- [x] Add targeted data/storage/browser regression coverage. Observed results and limits are in `docs/verification.md`.

## Required before calling the edition finished

| Work | Concrete solution | Completion evidence |
| --- | --- | --- |
| Listening review | Audition all seven narration tracks and both noise textures, comparing the introductions and checking names, comfort, playback speeds and fades. Correct and regenerate affected tracks only. | Named reviewer, date, current content revision and matching digests in `narration-reviews.json`; no automatic pass. |
| Media provenance/rights | Establish the existing SVG authorship/reference basis and applicable synthesized-voice distribution terms; retain the actual permission or licensing basis. | Explicit approved rights metadata and reference/render review records. No invented CC/public-domain assignment. |
| Place-specific art | Compare the eight SVGs with identified architectural/place references, revise inaccurate details and inspect the actual mobile rendering. | Source IDs, reviewer, date, revision and visual review. Generalized reconstruction labels remain where appropriate. |
| Finished map | Add a sourced river/base layer with its reuse record, retain the checked approximate venue points, keep uncertain event sites unplaced, and check labels at mobile/desktop sizes. | `geography.json` completed with the actual base source and review; all seven directory actions remain available. |
| Editorial completion | Reconcile the complete visible catalog with passages, especially disputed attendance, person-specific outcomes, dates/locators and the Hamm setting conflict. | A documented editorial review; edition release status changes only after this work. |
| Device and assistive use | Verify Safari/iOS, VoiceOver, voice control, reduced motion, forced colors, 200–400% zoom, audio interruption and unsupported-mixer behavior with Ryan’s actual workflow. | Observed device/browser versions and findings; targeted fixes for failures. |
| Performance acceptance | Measure the specified cold-entry body-byte, LCP and CLS conditions on representative routes. | Three-run medians under the stated network/CPU profile; no certification inferred from bundle size. |

Production remains blocked by incomplete review records. The preview is usable for completing them. No commit, publication, provider purchase, or deployment is part of these next actions.
