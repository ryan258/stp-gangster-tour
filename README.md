# Saint Paul After Dark

**A digital history tour of Saint Paul’s underworld, 1900–1938**

A personal, at-home history tour about the informal protection system associated with Saint Paul’s underworld, its victims, and the records that complicate the legend. Seven chapters connect people, places, money, coercion, and institutional change. There are no scores, accounts, location tracking, or booking flows.

**Current state: working preview, edition 0.5.0.** The tour has seven main chapters and a Casebook with 71 side stories, seven interactive Paper Trails, and fourteen chapter evidence items. The claim ledger gives each assertion’s source, passage locator, and limits. Listening, illustration provenance/reference review, final editorial review, and real-device accessibility validation remain open.

## Run locally

Use Node **22.22.3** (`.nvmrc`) and npm. `package.json` allows supported even-major Node 22/24 runtimes; only the recorded runtime has been exercised here. Python 3 is needed for XML validation and `ffprobe` for audio format/duration checks. Audio regeneration additionally needs macOS `say` and `ffmpeg`.

```sh
npm ci
npm run dev
```

The development server binds to loopback. Content is checked before startup; restart it after editing catalog data to repeat the gate. No historical sources are fetched at build time or during reading. The application supports origin root as well as subpath deployments via `ASTRO_SITE` and `ASTRO_BASE`. GitHub Pages hosting is configured via `.github/workflows/deploy.yml` publishing to `https://ryan258.github.io/stp-gangster-tour/`. That workflow builds the preview edition, so its presence does not establish production acceptance.


To view the built working preview:

```sh
npm run build:preview
npm run preview
```

Preview output goes to `dist-preview/`. Edition notes and review records remain accessible in `/sources/#edition-status` (the top preview banner has been removed from the reading shell for a cleaner reading experience). `npm run build` is the production gate and intentionally fails while required reviews are pending; it removes stale `dist/` output before checking. `npm run preview:production` serves a separately accepted `dist/` build. Neither command deploys anything.

## What works

- Home, prologue, seven ordered stops, map/directory, casebook, sources, method, epilogue, and recovery page.
- Casebook → Paper trails presents seven archival stories as an interactive cigar counter, paired letters, an inventor’s pitch, freight stages, a call log, an escape sequence, and a pocket ledger. Each scene links to its claim and the story links to a source. The scene controls work without JavaScript.
- Casebook → Side stories opens dedicated pages in forms such as route diagrams, parallel accounts, and scene sequences. The **New stories from the old records** shortcut opens six additional stories, including a comparison of the Hudson trade-in accounts and a trace of the clothing examined in the Bremer case. Each scene links to the evidence. The Victoria Café recording is linked at Smithsonian Folkways.
- **Strange finds in the files** opens the Lincoln Court inventory, Gleckman’s court bill, Bremer’s sound inquiry, the Wildwood dispatches, the Grand Avenue refund trail, and the Sankey earnings papers. Each story lets readers open its key record detail and follow it to the source.
- **Between the lines** opens six more stories, including the hotel bill submitted by Barker’s jail courier, the Touhy basement hearing, and the trail from Saint Paul typewriter repair slips to the Bureau’s supply room.
- **Clues in plain sight** opens seven stories in seven forms, from a Buick spotted from a streetcar to an unclaimed cornmeal box containing a ransom note. The [source guide](reports/Clues%20in%20Plain%20Sight.md) gives the passages and the questions each record leaves open.
- **Stranger than the headlines** opens six more stories. Inspect the equipment in a smoke-making Hudson, follow the alligator lead from Georgia to Florida, and open the cast list for Billie Frechette’s carnival act. [Source guide](reports/Stranger%20Than%20the%20Headlines.md)
- **Oddities in Saint Paul files** opens six stories. Lift the scrap iron from a freight entry, compare the marks on two pistols, and open the call log that sent a newlywed to the Chicago Bureau office. [Source guide](reports/Oddities%20in%20Saint%20Paul%20Files.md)
- Historian tools: a method page, a corrections log with per-claim correction links, nearest-snapshot archive links, and downloadable catalog data (JSON, BibTeX, CSL-JSON) under `/data/`.
- Comprehensive editorial experience redesign across all 14 routes: full-bleed `ExperienceHero` backdrops with marginalia and roman folios, interactive `ReadingTrail` with visited-stop tracking, chapter-level tabbed navigation, and paper-styled location files.
- A continuous title sequence on the homepage and a direct entry on every chapter page. One thematic backdrop establishes each opening. A paper record gives the evidence room, and the cut-paper symbol marks the return. The chapter rail, reading tabs, and source disclosures remain available alongside the sequences.
- Graphic noir styling with the arched brand mark, ink and paper surfaces, copper and oxblood accents, and self-hosted Barlow Condensed and Source Sans 3. See the [visual handbook](brand/index.html) and [glyph guide](brand/glyphs.md) for design and usage details.
- High-efficiency WebP image pipeline (`public/images/redesign/*.webp`) each with a 640px `srcset` variant, lazy loading below the fold and a provenance/rights record in `media.json` (images are release-gated like the scenes).
- Streamlined reading shell: the former "Work in progress" top banner has been removed from `Layout.astro` for an immersive reading presentation, with editorial notes preserved under Sources.
- Complete static reading, links, and native evidence disclosures without JavaScript.
- One catalog-driven presenter with relationship, comparison, document, and sequence layouts. Selection emphasizes text without moving keyboard focus.
- Optional local synthesized narration and ambience; no audio fetch before an explicit channel action. Pause, resume, replay, retry, mute, speed, separate volume buttons, Calm view, and silent page return.
- Local bookmark, visited-stop and evidence markers with strict runtime parsing, ID allowlists, UTF-8 byte limits, memory fallback notices, and a progress-only reset.
- People profiles, qualified connections, context-return links, printable source pages, copyable citations, and edition correction notes.
- Standalone iPad/iOS PWA support with the arched Home Screen icon, ink theme color (`#171310`), `viewport-fit=cover`, and safe-area inset protection for full-screen reading when added to the Home Screen.
- Three approximate venue positions with linked geographic sources, independent access/condition notes, and four unplaced stops. A sourced USGS river layer gives geographic context; the map does not assert a historical shoreline or walking route.

## Story presentation

### Browser storytelling studies

The **Studies** navigation link opens six local experiments at `/studies/`: shifting a question, annotating a passage, comparing connected windows, changing sound perspective, revisiting an opening, and moving between two scales of time. Each has source-linked content, a complete reading fallback, and independent selected-view saving. Historical outcomes and the existing narration remain unchanged. See [the study guide and targeted verification commands](docs/storytelling-studies.md). Ryan's targeted verification on October 5, 2026 passed: zero Astro diagnostics, 44 unit tests, the 22-page preview build, and five Chromium browser scenarios. Human review and real-device acceptance remain open.

### Scroll-driven pop-up scenes

(Superseded on 2026-11-04 by the actors-and-costs board below; this code is dormant, not in use on any page.) Every chapter page (`stops/*`) carried an illustrated pop-up scene under its hero (`PopUpScene.astro`, `src/lib/popup.ts`, `src/styles/story.scss`). Each scene's reviewed SVG is sliced along its own comment boundaries into three to five perspective layers (`translateZ`) and a flat reconstruction frame; `popup.ts` holds each scene's layer stack, focal point and light colour. As the reader scrolls, GSAP ScrollTrigger scrubs the scene's CSS variables: it unfolds the scene from the floor (`rotateX`) and dollies the camera into its lit focal point (the saloon door, the hotel window, the stage, the headlights, the street lamp, the courtroom window). Lincoln Court's three panels stay side by side and visible, each at its own depth. SVG digests and hashes are unaltered; the build fails if a marker comment is reworded or a cut would split an SVG group. The scene stays static and fully visible without JavaScript, is a still, unpinned illustration under Calm view and `prefers-reduced-motion`, and is hidden under forced colors and printing.

### Actors-and-costs board

Every chapter page replaces the earlier pop-up scenes with a content-driven board. The chapter's metagame record (actors marked documented or analytical, what the pressure sought, the reported response, the expected benefit, who bore the costs, the limit of the evidence) sits in a column beside the reading. On wide, tall screens it pins and steps through three beats as each text section scrolls past (the pressure, the response, who bore the cost), emphasising the actors that beat concerns (boxed and bright with a gold edge and dot; the rest are plain muted rows with no box). Actor cards are listed in the order the text introduces them, not the data order. Phrases in the text (for example "The captors demanded $200,000") are links to their actor: hover or focus one and the actor lights up on the board and is announced politely; choose an actor on the board and it jumps to, and cycles through, those phrases. Without JavaScript, or on a narrow screen, the whole board is stacked text. `src/data/board.json` holds the beats and phrase links; `validate-content.mjs` fails the build if an actor name is unknown or a phrase is missing or not unique in its block. These links select among existing statements and add no claim, but they are editorial choices for Ryan to review. It pins only when its tallest beat fits the screen (about 750px of viewport height or more); otherwise it stays stacked. The pop-up scene code (`PopUpScene.astro`, `src/lib/popup.ts`, the pop-up block in `story.ts` and `story.scss`) is dormant but kept until the boards are approved, and each scene SVG now sits in a collapsed "Illustrated scene study" disclosure.

### Main tour

The homepage and all seven chapter routes render `src/components/TitleSequence.astro` from the validated stop catalog. Each chapter has one catalog-backed opening backdrop and a distinct cut-paper symbol. The record and return carry the evidence and the symbol. The existing chapter introductions remain the narration transcripts.

Scroll through the sequence or use its native links to go to the record, return to the symbol, and continue. These links work without JavaScript. Opening a beat by its link on the homepage saves the equivalent chapter location. Existing Under the Bluff bookmark fragments still resolve.

Short entrance cuts animate only the paper shapes. Native cross-document View Transitions (`src/styles/story.scss`, `src/layouts/Layout.astro`) carry the chapter title frame and title between the home story and chapter pages and between chapters while keeping the header steady. Calm view, reduced motion, forced colors, and no-JavaScript reading keep the scenes still and use ordinary page loads. Scene sound uses the catalog’s local synthesized atmosphere and starts by request. It stops on a cut, on leaving the opening or tab, or when Calm view is enabled. The separate chapter narration retains its own playback controls and transcript.

Targeted verification for presentation changes:

```sh
npm run check && npm run test:unit -- tests/unit/storage.test.ts tests/unit/data-integrity.test.ts && npm run build:preview && npm run test:browser -- tests/browser/story.spec.ts tests/browser/bluff-pilot.spec.ts
```

The focused checks cover evidence ownership, matching opening and return symbols, saved locations, 320px navigation, Calm view, sound handoff, and JavaScript-free reading. `npm run build` remains the separate human-gated production command.

## Project map

| Area | Responsibility |
| --- | --- |
| `src/data/` | Edition order, stops, claims, sources, evidence, people, relationships, metagames, presenters, locations, studies, board beats/markers, paper trails, casebook stories/experiences, visual story scenes, geography, and media/review records |
| `src/lib/` | Build-time joins, URL helpers, release-derived status, board formatting, SVG pop-up cutter, study reference resolution, paper trails, casebook experiences, and title sequence models; not imported by client runtimes |
| `src/pages/`, `src/components/`, `src/layouts/` | Static pages, `ExperienceHero`, `ReadingTrail`, `ActorBoard`, `MarkedText`, `PopUpScene`, `TitleSequence`, `EditorialChapterHero`, `PaperTrailDesk`, `VisualStory`, `LayeredScene`, `/studies/`, `/casebook/`, and reusable reading/presenter/evidence/audio shell |
| `src/styles/` | Modular Sass & CSS architecture (`_variables`, `_mixins`, `_base`, `_header-footer`, `_homepage`, `_inner-pages`, `board.scss`, `experience.scss`, `map.scss`, `story.scss`, `studies.scss`, `casebook.scss`, `casebook-experiences.scss`, `editorial-chapters.scss`, `paper-trails.scss`, `paper-trail-desk.scss`, `paper-trail-motion.scss`, `title-sequence.scss`, `title-feature.scss`, `title-symbol.scss`, `visual-story.scss`, `tokens.css`) |
| `src/scripts/` | Small independent browser enhancements (`story.ts`, `studies.ts`, `study-audio.ts`, `title-sequence.ts`, `visual-story.ts`, `layered-scene.ts`, `sprite-interpolation.ts`, `audio.ts`, `storage.ts`) |
| `scripts/` | Schemas, cross-record checks, subpath URL checks, hashes, SVG parsing, audio probes, story flow generator, production obligations |
| `public/` | Served fonts, licenses, SVGs, WebP illustrations, and MP3 derivatives |
| `production/` | Retained AIFF/WAV masters and original USGS geography; excluded from public output |
| `tests/` | Targeted content/storage and browser regression scenarios |

Read [architecture](docs/architecture.md), [evidence standards](docs/evidence-ledger.md), [verification](docs/verification.md), and the [remaining work](roadmap.md). The [specification](spec.md) preserves the intended finished-edition requirements. `history.md` and `research.md` are the editorial starting point; current visitor copy and corrections live in the validated catalog.

## Verification and editing

```sh
npm run check
npm run test:unit -- tests/unit/data-integrity.test.ts tests/unit/storage.test.ts
npm run test:browser
npm run links   # network: URL reachability and archive coverage
```

Build the preview before browser tests. Playwright uses an isolated loopback port and refuses an existing server, avoiding tests against stale output. See the verification record for observed results and untested environments.

Changing an introduction invalidates its narration digest. Regenerate only the affected stop:

```sh
node scripts/generate-audio.mjs the-safe-house-fails
```

The script retains a lossless master, probes the derivative and resets review to **pending**. It never grants listening or rights approval. `--ambience` explicitly regenerates the two deterministic noise textures. No generation runs implicitly with a build.

The river layer can be regenerated offline with `python3 scripts/clip-map.py`. It preserves review metadata only when the source and output hashes are unchanged; changed geometry returns to pending review. Source queries, reuse terms and hashes are retained in `src/data/geography.json`.

No reuse license for the project’s prose, illustrations, or synthesized voice has been assigned by this remediation. Font license notices are retained. Publication, commits, and deployment remain owner-controlled actions.
