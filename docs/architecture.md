# Architecture

The application is a static Astro site. Each route is an independent HTML document; navigation does not depend on a client router or framework hydration. Browser code enhances an already readable page. There is no runtime backend or historical-source fetch.

## Content ownership

The edition manifest is the single reading-order authority. `src/lib/catalog.ts` joins it with stop records for static rendering. `scripts/content-schema.mjs` validates every authored data collection with Zod; `validate-content.mjs` applies cross-record ownership, ordering, reference, word-count, transcript, file-digest, geometry and release rules. `check-svg.py` uses Python’s XML parser and rejects active/external SVG content. `ffprobe` verifies MP3 codec and duration. Masters and derivatives have separate hashes.

`presenters.json` owns presenter copy and its evidence/claim references. `Presenter.astro` supplies four layout variants. Templates contain no independent historical scenes or fabricated quotations. Evidence cards explicitly identify paraphrases as tour explanations; source records retain their historical-record/account distinction.

A single visitor claim can appear in several contexts. Review its qualification in the claim ledger, stop text, presenter, profile, evidence item and illustration caption when changing it. Validation checks those links, not the historical truth of prose.

## Browser boundaries

- `storage.ts`: pure decoders plus independent progress/preferences persistence. Payloads are limited to 32 KiB UTF-8, known IDs and supported blocks. Invalid fields recover independently; unknown schema versions reset that record. Failed writes fall back for this document and show a persistent notice.
- `reading.ts`: visits and block bookmarks; debounced scroll writes flush before navigation. Source/profile visits do not establish narrative bookmarks. BFCache restoration does not immediately rewrite a newer bookmark.
- `casebook.ts`: native evidence disclosure tracking, fragment opening, filters, counts, empty state, reset and context returns. No arbitrary hash becomes a selector or arbitrary query parameter becomes a URL.
- `selection.ts`: pressed state and highlight only. It never changes focus, browser history, or scroll position.
- `audio.ts`: explicit audio lifecycle. Elements and their `src` are created only after a channel action. Generation counters reject stale asynchronous playback results; pagehide/visibility/BFCache pause sound. Calm view stops ambience while leaving narration alone. Unsupported independent volume disables ambience and directs the reader to device volume.
- `calm.ts`: preference/render bridge. It shares a preference event with audio; disabling Calm view never automatically starts sound.

The layout initializes optional enhancements separately. Controls start hidden and are shown only when JavaScript runs. Native text, links, and disclosures remain usable without enhancements. Browser modules import only the small edition manifest/state fields; the full research catalog and schemas stay at build time.

## Presentation and Sass styling

The visual system uses a modular Sass (`.scss`) architecture imported into `src/layouts/Layout.astro` via `src/styles/main.scss`:
- `_variables.scss`: Color tokens (pitch `#090b0e`, surface `#141820`, crimson accents `#d32f2f`/`#e53935`, warm bone `#f4efe6`, aged parchment `#ded4bf`), typography stacks (`Playfair Display`, `Cinzel`, `Caveat`, `Source Sans 3`), shadows, and transitions.
- `_mixins.scss`: Glassmorphism panels, vintage ephemera paper treatment, responsive breakpoints, and crimson/ghost button mixins.
- `_base.scss`: CSS resets, core typography, focus states, print rules, and 320px reflow guarantees without horizontal scrollbars.
- `_header-footer.scss`: Sticky glassmorphic header with brand tagline `| Money. Power. Vice. Consequences.`, active crimson glow indicator, `Calm view ☾` pill, and editorial footer.
- `_homepage.scss`: Redesigned homepage sections including the noir skyline hero banner, "Read the City Through Its Evidence" dossier trio (aged parchment card, tilted archival Hotel Ryan photo, debossed leather casebook cover), seven photographic chapter cards with dark vignette overlays, and an arched stone bridge quote banner.
- `_inner-pages.scss`: Carries the graphic noir styling across `/stops/[id]`, `/map/`, `/casebook/`, `/sources/`, `/prologue/`, and `/epilogue/`, styling evidence disclosure panels, crime presenters, and audio players.

All newly introduced photographic and banner assets are optimized WebP images (`public/images/redesign/*.webp`), reducing transfer weight by ~80% compared to raw images while preserving high fidelity.

Grid columns shrink below 320 pixels without horizontal overflow. Navigation wraps, controls have visible names suitable for voice input, and focus remains visible. Reduced-motion, forced-colors, and print styles are present. Automated coverage is not screen-reader or real-device certification.

The map separates approximate venue coordinates from historical event geometry, current condition, and current access. Four unknown positions remain unplaced. A local north-up equirectangular projection places the three approximate venues against clipped modern USGS NHD river geometry. `geography.json` retains source/query/reuse/review metadata and original/derived hashes. `scripts/clip-map.py` rebuilds the small layer from the retained extract without network access, invalidating review if the bytes change. The river supplies modern context, not a reconstructed historical shoreline. On small screens the complete seven-stop directory supplies the geographic descriptions and navigation.

## Build and media
 
`build.mjs` removes only its owned output directory, validates, and invokes Astro. Preview output and accepted production output use separate directories. Production rejects pending/stale reviews and unresolved rights; a failed gate leaves no stale accepted `dist/`.

`generate-audio.mjs` uses argument arrays with `execFileSync`, isolated temporary files, and explicit stop IDs. It retains AIFF narration masters and WAV ambience masters in `production/audio/`, which Astro does not publish. MP3 files are served locally. Every generation invalidates the corresponding listening review. Distribution-rights approval is separate from file generation and technical checks.

## Deployment and subpath routing

`astro.config.mjs` reads `ASTRO_SITE` and `ASTRO_BASE` from environment variables, defaulting to origin root (`/`) for local development, unit tests, and local browser previews. `src/lib/catalog.ts` provides centralized URL resolution (`base`, `routeURL`, `assetURL`, `stopURL`, `sourceURL`, `claimURL`), ensuring that internal navigation, asset links, font preloads, SVG scenes, and client-side bookmark/context-return URLs resolve correctly under either an origin root or a repository subpath (such as GitHub Pages at `/stp-gangster-tour/`).

GitHub Pages hosting is automated via `.github/workflows/deploy.yml`. On push to `main`, the workflow installs dependencies, verifies types and content schemas, runs focused unit tests, builds the preview edition using `actions/configure-pages` inputs, and deploys the preview artifact to GitHub Pages.

