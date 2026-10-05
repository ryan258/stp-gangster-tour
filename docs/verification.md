# Verification record

Remediation date: **2026-10-05**. Content/presentation revision: **0.5.0**. Runtime: macOS, Node **22.22.3**. This file separates observed automated results from unfinished editorial and real-device work.

## Observed checks
 
- Astro type checking: zero errors, warnings and hints after the static application migration and Sass integration.
- Structural catalog/asset validation: passes with release obligations explicitly reported. Validates all dataset shapes, references, ownership, duplicates, enums, source URLs/dates, word budgets, intro digests, file/master hashes, SVG XML/dimensions and MP3 codec/duration.
- Targeted Vitest files: 31 tests passed on Vitest 5.0.3 after the tooling update. Includes malformed catalog variants, missing/altered assets, production refusal, byte limits, stale IDs, and independently recoverable storage fields.
- Targeted Chromium browser file: 8 scenarios passed against the built preview. Covers all content routes and local links/fragments, SVG and WebP rendering, 320px overflow on all routes, skip-link/focus behavior, silent entry, filters/profiles/reset, bookmark and source round trip, write failure, no-JavaScript reading, controlled audio state transitions, cancellation races, and unsupported-volume fallback.
- Sass and visual styling: Dart Sass compiled cleanly via Astro zero-config support. All deprecation warnings resolved using `@use 'sass:color'` with `color.adjust`. 320px reflow verified across `'/'`, `/stops/the-arrangement/`, `/casebook/`, `/sources/`, and `/map/` with exact 320px bounding box alignment.
- Image assets & WebP pipeline: 10 newly introduced visual assets in `public/images/redesign/` converted to optimized WebP (`.webp`) at 85 quality, reducing total footprint from 15.8 MB down to 3.1 MB while achieving >42 dB PSNR. Playwright verified all images load completely with `naturalWidth > 0`.
- Final map follow-up: repeated the two affected Chromium route/reflow scenarios after adding the river layer; both passed. Rebuilt all fourteen pages and reran the 31 focused unit cases and Astro/content checks.
- Dependency audit: `npm audit` reported zero known vulnerabilities across runtime and development dependencies after upgrading Astro to 7.3.5, Vitest to 5.0.3, @astrojs/check to 0.9.10, and installing `sass`. This is the registry’s result on the recorded date, not a guarantee of absence of defects.
- Production build: refused as intended on 35 incomplete review obligations (9 listening, 17 rights, 8 scene/reference, 1 editorial). Stale `dist/` was absent afterward; the preview remained intact.
- Geography: retained the USGS NHD source polygon, confirmed the intersecting named Mississippi River flowline, clipped two rings/74 vertices, recorded reuse attribution and hashes, and inspected the desktop rendering. Three venue coordinates were cross-checked by published name/address and remain explicitly approximate. The small-screen directory retains all seven actions.
- Preview build: thirteen content routes and `404.html`; draft output is separate from production.
- GitHub Pages hosting: verified static build under `ASTRO_BASE=/stp-gangster-tour` and `ASTRO_SITE=https://ryan258.github.io`. All fourteen routes, asset URLs, media links, and bookmark returns correctly resolve under the repository subpath. Automated deployment configured in `.github/workflows/deploy.yml`.
- Audio regeneration: seven AIFF narration masters and two WAV noise masters retained under `production/audio/`; all MP3 derivatives and digest records regenerated. This is technical production, **not listening approval**.


The audio browser scenario uses controllable media doubles. It checks lifecycle, volume arithmetic and displayed controls. It does not establish acoustic quality, pronunciation, actual iOS mixer support, or human comfort.

## Reproduce focused checks

```sh
npm run check
npm run test:unit -- tests/unit/data-integrity.test.ts tests/unit/storage.test.ts
npm run build:preview
npm run test:browser -- tests/browser/tour.spec.ts
```

Python 3 and ffprobe are required by the asset validator. Browser tests require an installed Playwright Chromium browser and permission to bind loopback port 4337. They refuse to reuse an existing server. Package installation and advisory lookups require network access; site reading and builds do not fetch historical sources.

Production validation is an expected refusal until actual review records are complete:

```sh
npm run build
```

This removes stale `dist/` and stops on release obligations. The usable preview remains in `dist-preview/`.

## Still unverified

- Human listening at each speed, pronunciation, narration comfort, ambience fades and long-session fatigue.
- SVG place-reference comparisons, provenance, and distribution-rights records.
- Complete editorial passage reconciliation; original trial/laboratory records are not implicitly checked because a retrospective source is linked.
- Safari/iOS audio restrictions, real background interruptions, VoiceOver, voice control, forced-color appearance and high zoom with the actual assistive setup.
- Formal cold-entry performance acceptance: 390×844 viewport, 1.6 Mbps down, 150 ms RTT, 4× CPU, median of three cold runs; body bytes at five seconds ≤1,500,000, LCP ≤2.5s, CLS ≤0.1. Local fast-network route tests do not establish these targets.

Capture device/browser versions, exact route/revision, observations and any remaining failure when completing manual work. Enter reviewer identity only for a review actually performed. Never convert a generator success or automated test into owner acceptance.

The optional performance harness is prepared but has not been run in this remediation. With the preview running, the owner can run the bounded three-run laboratory sequence:

```sh
node scripts/measure-performance.mjs
```

It writes `test-results/performance.json` and exits nonzero for missing/excessive LCP, CLS or decoded response-body bytes. Set `STP_PREVIEW_URL` when using a different local port. The default four-route run takes about a minute; running one route takes about fifteen seconds.

## Concurrent checkout activity

Other activity added commits and base-path helpers while this remediation ran. No staging, commit, push or publication command was issued by this remediation. Existing changes were preserved. Automated route checks target the origin-root preview; the concurrently introduced GitHub/subdirectory configuration is not deployment acceptance.
