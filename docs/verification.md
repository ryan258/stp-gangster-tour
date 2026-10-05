# Verification record

Remediation date: **2026-10-05**. Content/presentation revision: **0.5.0**. Runtime: macOS, Node **22.22.3**. This file separates observed automated results from unfinished editorial and real-device work.

## Observed checks
 
- Astro type checking: zero errors, warnings and hints across all 39 Astro and TypeScript files after experience redesign and layout updates.
- Structural catalog/asset validation: passes with release obligations explicitly reported. Validates all dataset shapes, references, ownership, duplicates, enums, source URLs/dates, word budgets, intro digests, file/master hashes, SVG XML/dimensions and MP3 codec/duration.
- Targeted Vitest files: 31 tests passed on Vitest 5.0.3. Includes malformed catalog variants, missing/altered assets, production refusal, byte limits, stale IDs, and independently recoverable storage fields.
- Targeted Chromium browser file: 8 scenarios passed against the built preview. Covers all content routes and local links/fragments, SVG and WebP rendering across the new full-bleed `ExperienceHero`, `ReadingTrail`, chapter layouts, and map boards; 320px overflow on all routes; skip-link/focus behavior; silent entry; filters/profiles/reset; bookmark and source round trip; write failure; no-JavaScript reading; controlled audio state transitions; cancellation races; and unsupported-volume fallback.
- Sass and visual styling: Dart Sass compiled cleanly via Astro zero-config support. All deprecation warnings resolved using `@use 'sass:color'` with `color.adjust`. 320px reflow verified across `'/'`, `/stops/the-arrangement/`, `/casebook/`, `/sources/`, and `/map/` with exact 320px bounding box alignment.
- Image assets & WebP pipeline: 10 visual assets in `public/images/redesign/` converted to optimized WebP (`.webp`) at 85 quality, reducing total footprint from 15.8 MB down to 3.1 MB while achieving >42 dB PSNR. Configured asynchronous image decoding (`decoding="async"`), resolving lazy-loading race conditions and verifying complete load (`complete && naturalWidth > 0`) for every image on every route.
- Streamlined layout: removed top preview banner from `Layout.astro` for an uninterrupted reading experience, verifying that all fragment links (`/sources/#edition-status`) and page headings continue to resolve cleanly.
- Final map follow-up: repeated the two affected Chromium route/reflow scenarios after adding the river layer; both passed. Rebuilt all fourteen pages and reran the 31 focused unit cases and Astro/content checks.
- Dependency audit: `npm audit` reported zero known vulnerabilities across runtime and development dependencies after upgrading Astro to 7.3.5, Vitest to 5.0.3, @astrojs/check to 0.9.10, and installing `sass`. This is the registry’s result on the recorded date, not a guarantee of absence of defects.
- Production build: refused as intended on 35 incomplete review obligations (9 listening, 17 rights, 8 scene/reference, 1 editorial). Stale `dist/` was absent afterward; the preview remained intact.
- Geography: retained the USGS NHD source polygon, confirmed the intersecting named Mississippi River flowline, clipped two rings/74 vertices, recorded reuse attribution and hashes, and inspected the desktop rendering. Three venue coordinates were cross-checked by published name/address and remain explicitly approximate. The small-screen directory retains all seven actions.
- Preview build: thirteen content routes and `404.html`; draft output is separate from production.
- GitHub Pages hosting: verified static build under `ASTRO_BASE=/stp-gangster-tour` and `ASTRO_SITE=https://ryan258.github.io`. All fourteen routes, asset URLs, media links, and bookmark returns correctly resolve under the repository subpath. Automated deployment configured in `.github/workflows/deploy.yml`.
- Audio regeneration: seven AIFF narration masters and two WAV noise masters retained under `production/audio/`; all MP3 derivatives and digest records regenerated. This is technical production, **not listening approval**.


The audio browser scenario uses controllable media doubles. It checks lifecycle, volume arithmetic and displayed controls. It does not establish acoustic quality, pronunciation, actual iOS mixer support, or human comfort.

## Harmony pass and historian layer (observed 2026-10-05, owner-run)

- `npm run check`: 0 errors, 0 warnings, 0 hints across 49 files; structural content and asset checks pass with 56 release obligations (35 previous + geography + 10 image provenance + 10 image rights).
- `npm run test:unit`: 39 tests passed, including rejection of AI tools as reviewers, orphan claims and sources, manifest drift, unknown ambience beds and malformed image records.
- `npm run build:preview` then `npm run test:browser`: 23 scenarios passed on Chromium. This adds axe-core (WCAG 2.0/2.1/2.2 A and AA tags) on all 14 content routes and a phone-width check of the 16px text floor and 44px targets. SVG text is excluded from the size check because it scales with the viewBox; the map's text alternative and directory carry that content.
- Not run: `npm run links` (network), `node scripts/measure-performance.mjs`, real-device and assistive-technology checks. The map's enlarged SVG labels have not been inspected visually.

## Reproduce focused checks

```sh
npm run check
npm run test:unit -- tests/unit/data-integrity.test.ts tests/unit/storage.test.ts
npm run build:preview
npm run test:browser   # tour + axe/size-floor specs
npm run links          # network: URL reachability and archive coverage
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
