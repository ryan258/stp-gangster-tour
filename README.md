# Saint Paul After Dark

A personal, at-home history tour about the informal protection system associated with Saint Paul’s underworld, its victims, and the records that complicate the legend. Seven chapters connect people, places, money, coercion, and institutional change. There are no scores, accounts, location tracking, or booking flows.

**Current state: working preview, edition 0.5.0.** All fourteen content routes (home, prologue, seven stops, map, casebook, sources, method, epilogue) and a static 404 exist. Thirty claim records include disputes and qualifications; fourteen evidence items are source-linked explanations, not original transcripts or charters. Listening, illustration provenance/reference review, final editorial review, and real-device accessibility validation remain open. A successful structural check is not editorial certification.

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
- Historian tools: a method page, a corrections log with per-claim correction links, nearest-snapshot archive links, and downloadable catalog data (JSON, BibTeX, CSL-JSON) under `/data/`.
- Comprehensive editorial experience redesign across all 14 routes: full-bleed `ExperienceHero` backdrops with marginalia and roman folios, interactive `ReadingTrail` with visited-stop tracking, chapter-level tabbed navigation, and paper-styled location files.
- A continuous homepage story: skyline opening, seven illustrated scenes, chapter navigation, and an epilogue. Motion 14 adds scroll-linked artwork, short entrances, and a journey progress line. Sources open in native disclosures beside each scene. Individual chapters use roomier reading sections, a sticky illustration, and source disclosures.
- Modular Sass (`.scss`) styling architecture carrying graphic noir aesthetics, self-hosted typography (`Playfair Display`, `Cinzel`, `Caveat` via Fontsource; `Source Sans 3`, `Barlow Condensed` from `public/fonts`), crimson accents, vintage ephemera treatments, and specialized experience stylesheets (`experience.scss`, `map.scss`).
- High-efficiency WebP image pipeline (`public/images/redesign/*.webp`) each with a 640px `srcset` variant, lazy loading below the fold and a provenance/rights record in `media.json` (images are release-gated like the scenes).
- Streamlined reading shell: the former "Work in progress" top banner has been removed from `Layout.astro` for an immersive reading presentation, with editorial notes preserved under Sources.
- Complete static reading, links, and native evidence disclosures without JavaScript.
- One catalog-driven presenter with relationship, comparison, document, and sequence layouts. Selection emphasizes text without moving keyboard focus.
- Optional local synthesized narration and ambience; no audio fetch before an explicit channel action. Pause, resume, replay, retry, mute, speed, separate volume buttons, Calm view, and silent page return.
- Local bookmark, visited-stop and evidence markers with strict runtime parsing, ID allowlists, UTF-8 byte limits, memory fallback notices, and a progress-only reset.
- People profiles, qualified connections, context-return links, printable source pages, copyable citations, and edition correction notes.
- Standalone iPad/iOS PWA support: web app manifest (`site.webmanifest`), 180×180 Apple touch icon, dark status bar (`#090b0e`), `viewport-fit=cover`, and safe-area inset protection for full-screen reading without Safari browser chrome when added to the Home Screen.
- Three approximate venue positions with linked geographic sources, independent access/condition notes, and four unplaced stops. A sourced USGS river layer gives geographic context; the map does not assert a historical shoreline or walking route.

## Story presentation

`src/pages/index.astro` draws the scrolling story from the existing validated edition and stop catalog. Narrated introductions, historical assertions, and review records are unchanged. The homepage is an overview; entering a full chapter uses the existing reading bookmark. Scrolling the overview does not mark all seven chapters as read.

`src/components/StoryMotion.astro` loads `src/scripts/story.ts` only on story and reading pages. Motion is bundled locally, with its mini Web Animations API engine for transforms; there are no CDN requests or scroll interception. Text is rendered in HTML and never waits for animation to become visible. Reference pages retain their static presentation.

Calm view, reduced motion, forced colors, printing, page exit, and tab visibility stop the effects and restore authored styles. Phone layouts keep images in normal flow without parallax. Desktop artwork uses native CSS sticky positioning. The chapter rail uses ordinary fragment links and `aria-current="step"`; it does not move focus or announce every scroll change.

Targeted verification for this presentation change (owner-run):

```sh
npm run check && npm run build:preview && npm run test:browser -- tests/browser/story.spec.ts
```

The new regression cases cover live preference changes, cancellation of hidden artwork, source disclosures and chapter navigation at 320px, JavaScript-free reading, and failure of the optional animation chunk. These tests have been added but not run by the assistant. `npm run build` remains the separate production gate.

## Project map

| Area | Responsibility |
| --- | --- |
| `src/data/` | Edition order, stops, claims, sources, evidence, people, relationships, metagames, presenters, locations, geography and media/review records |
| `src/lib/catalog.ts` | Build-time joins and URL helpers; not imported by browser controllers |
| `src/pages/`, `src/components/`, `src/layouts/` | Static pages, `ExperienceHero`, `ReadingTrail`, and reusable reading/presenter/evidence/audio shell |
| `src/styles/` | Modular Sass architecture (`_variables`, `_mixins`, `_base`, `_header-footer`, `_homepage`, `_inner-pages`, `experience.scss`, `map.scss`) |
| `src/scripts/` | Small independent browser enhancements |
| `scripts/content-schema.mjs`, `validate-content.mjs`, `check-svg.py` | Schemas, cross-record checks, hashes, SVG parsing, audio probes, production obligations |
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
