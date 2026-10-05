# Saint Paul After Dark

A personal, at-home history tour about the informal protection system associated with Saint Paul’s underworld, its victims, and the records that complicate the legend. Seven chapters connect people, places, money, coercion, and institutional change. There are no scores, accounts, location tracking, or booking flows.

**Current state: working preview, edition 0.5.0.** All thirteen content routes and a static 404 exist. Thirty claim records include disputes and qualifications; fourteen evidence items are source-linked explanations, not original transcripts or charters. Listening, illustration provenance/reference review, final editorial review, and real-device accessibility validation remain open. A successful structural check is not editorial certification.

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

Preview output goes to `dist-preview/` with a visible edition-status notice. `npm run build` is the production gate and intentionally fails while required reviews are pending; it removes stale `dist/` output before checking. `npm run preview:production` serves a separately accepted `dist/` build. Neither command deploys anything.

## What works

- Home, prologue, seven ordered stops, map/directory, casebook, sources, epilogue, and recovery page.
- Complete static reading, links, and native evidence disclosures without JavaScript.
- One catalog-driven presenter with relationship, comparison, document, and sequence layouts. Selection emphasizes text without moving keyboard focus.
- Optional local synthesized narration and ambience; no audio fetch before an explicit channel action. Pause, resume, replay, retry, mute, speed, separate volume buttons, Calm view, and silent page return.
- Local bookmark, visited-stop and evidence markers with strict runtime parsing, ID allowlists, UTF-8 byte limits, memory fallback notices, and a progress-only reset.
- People profiles, qualified connections, context-return links, printable source pages, copyable citations, and edition correction notes.
- Three approximate venue positions with linked geographic sources, independent access/condition notes, and four unplaced stops. A sourced USGS river layer gives geographic context; the map does not assert a historical shoreline or walking route.

## Project map

| Area | Responsibility |
| --- | --- |
| `src/data/` | Edition order, stops, claims, sources, evidence, people, relationships, metagames, presenters, locations, geography and media/review records |
| `src/lib/catalog.ts` | Build-time joins and URL helpers; not imported by browser controllers |
| `src/pages/`, `src/components/`, `src/layouts/` | Static pages and reusable reading/presenter/evidence/audio shell |
| `src/scripts/` | Small independent browser enhancements |
| `scripts/content-schema.mjs`, `validate-content.mjs`, `check-svg.py` | Schemas, cross-record checks, hashes, SVG parsing, audio probes, production obligations |
| `public/` | Served fonts, licenses, SVGs and MP3 derivatives |
| `production/` | Retained AIFF/WAV masters and original USGS geography; excluded from public output |
| `tests/` | Targeted content/storage and browser regression scenarios |

Read [architecture](docs/architecture.md), [evidence standards](docs/evidence-ledger.md), [verification](docs/verification.md), and the [remaining work](roadmap.md). The [specification](spec.md) preserves the intended finished-edition requirements. `history.md` and `research.md` are the editorial starting point; current visitor copy and corrections live in the validated catalog.

## Verification and editing

```sh
npm run check
npm run test:unit -- tests/unit/data-integrity.test.ts tests/unit/storage.test.ts
npm run test:browser -- tests/browser/tour.spec.ts
```

Build the preview before browser tests. Playwright uses an isolated loopback port and refuses an existing server, avoiding tests against stale output. See the verification record for observed results and untested environments.

Changing an introduction invalidates its narration digest. Regenerate only the affected stop:

```sh
node scripts/generate-audio.mjs the-safe-house-fails
```

The script retains a lossless master, probes the derivative and resets review to **pending**. It never grants listening or rights approval. `--ambience` explicitly regenerates the two deterministic noise textures. No generation runs implicitly with a build.

The river layer can be regenerated offline with `python3 scripts/clip-map.py`. It preserves review metadata only when the source and output hashes are unchanged; changed geometry returns to pending review. Source queries, reuse terms and hashes are retained in `src/data/geography.json`.

No reuse license for the project’s prose, illustrations, or synthesized voice has been assigned by this remediation. Font license notices are retained. Publication, commits, and deployment remain owner-controlled actions.
