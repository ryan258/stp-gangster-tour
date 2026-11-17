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

- `npm run check`: 0 errors, 0 warnings, 0 hints across 52 files; structural content and asset checks pass with 56 release obligations (35 previous + geography + 10 image provenance + 10 image rights).
- `npm run test:unit`: 39 tests passed, including rejection of AI tools as reviewers, orphan claims and sources, manifest drift, unknown ambience beds and malformed image records.
- `npm run build:preview` then `npm run test:browser`: 28 scenarios passed on Chromium (24 previous + 4 story motion and reading specs in `tests/browser/story.spec.ts`). This includes axe-core (WCAG 2.0/2.1/2.2 A and AA tags) on all 14 content routes, a phone-width check of the 16px text floor and 44px targets, an automated PWA test verifying `site.webmanifest` and iPadOS tags, and 4 story specs covering immediate motion cancellation on Calm view / reduced-motion / print toggles, phone-width chapter navigation and source disclosure rendering, full no-JS story reading, and graceful fallback when the optional motion chunk fails to load.
- Not run: `npm run links` (network), `node scripts/measure-performance.mjs`, real-device and assistive-technology checks. The map's enlarged SVG labels have not been inspected visually.

## Six storytelling studies (observed 2026-10-05, owner-run)

Ryan supplied the successful terminal output for the study verification sequence:

- `npm run check`: zero errors, warnings and hints across **64 files**; structural content and asset validation passed with **56 release obligations** remaining.
- `npm run test:unit -- tests/unit/studies.test.ts tests/unit/data-integrity.test.ts`: **44 tests passed**, comprising 13 study and 31 content-boundary cases.
- `npm run build:preview`: **22 pages built**, including all six studies and `/studies/`.
- `npm run test:browser -- tests/browser/studies.spec.ts`: **five Chromium scenarios passed**, covering study selections and source access at narrow width, complete no-JavaScript reading, paired-window synchronization and isolation, persistence and unsupported-feature fallbacks, reduced motion and explicit audio start.

The assistant did not rerun these suites. The full suite, human listening, editorial/provenance/rights approvals, Safari/iPad, voice control, screen readers and physical printing were not established by this targeted run. See [the study guide](storytelling-studies.md).

## Pop-up scene study verification

- `npm run test:unit -- tests/unit/popup.test.ts`: **2 tests passed** in 5ms, establishing that the Green Lantern Saloon illustration (`scene-arrangement.svg`) is sliced along paint-order comment headers into 4 depth layers (`translateZ`) with the reconstruction frame and label kept flat and unblurred, and that unconfigured scenes return `null`.
- `npm run test:browser -- tests/browser/story.spec.ts`: **4 Chromium scenarios passed**, confirming that calm mode and reduced motion disable scroll-driven timelines immediately, 320px reflow holds without clipping, and no-JS fallback renders complete content.

The shell first emitted `Requested version v22.22.3 is not currently installed`. Inspection traced this to the `.nvmrc` pin and the shell's `fnm --use-on-cd` hook: fnm did not list that version, although a separate installation was available on the assistant's PATH. The owner-run log did not include `node --version`, so its exact runtime is unrecorded; the runtime in this file's opening paragraph belongs to the earlier remediation record. The warning did not stop this verification sequence.

## Full suite after the review fixes and CI gating (observed 2026-11-03, owner-run)

Ryan ran `npm run check && npm run test:unit && npm run build:preview && npm run test:browser` and supplied the terminal output. The browser step ran after `npx playwright install chromium`.

- `npm run check`: 67 files, 0 errors, 0 warnings, 0 hints. Structural content and asset validation passed with 56 release obligations still open, unchanged by these edits.
- `npm run test:unit`: 5 files, **56 tests passed**, including `tests/unit/base-path.test.ts`.
- `npm run build:preview`: **22 pages built**.
- `npm run test:browser`: **40 Chromium scenarios passed** in 28.7 s on Playwright 1.63.0 with Chromium 153.0.8010.12 (r1243). They cover axe WCAG 2.x A/AA on 21 routes (the 14 earlier routes plus `/studies/` and the six studies), the 16px/44px floor on the same routes, the link/fragment/image crawler (now including the studies), and the story, studies, tour, audio and PWA scenarios. This is the first browser run of the studies against axe and the size floor.

Two earlier attempts failed all 33, then all 40, scenarios with `browserType.launch: Executable doesn't exist`: the machine held only Chromium r1248 while Playwright 1.63.0 needs r1243. No test ran in those attempts; installing r1243 cleared it. The output did not show which Node version Ryan's terminal used.

Changes covered by this run: review-state copy derived from the catalog (`src/lib/release.ts`), the "working preview" footer tag, null publication dates on the Sources page, `deploy.yml` calling `ci.yml`, the studies routes in the axe and crawler specs, and `scripts/check-base.mjs`.

Observed by the assistant, not owner-run: a scratch build with `ASTRO_BASE=/stp-gangster-tour` produced 22 pages and `check-base.mjs` found no root-relative URL outside the base. The same guard flagged 1,462 URLs when pointed at the root-built `dist-preview`, which shows it detects the fault. The assistant ran no test suites.

## Pop-ups for all seven chapters (observed 2026-11-03; suite owner-run, visuals assistant-observed)

Owner-run, same day, after the pop-up changes: `npm run check` (67 files, 0 errors, 0 warnings, 0 hints; 56 release obligations unchanged), `npm run test:unit` (5 files, **58 tests passed**, including 4 in `popup.test.ts` covering all seven scenes), `npm run build:preview` (22 pages) and `npm run test:browser` (**40 Chromium scenarios passed** in 25.6 s, including axe and the size floor on every chapter page with its animated pop-up). Those suites do not assert the scroll animation itself; the animation and the visuals below were observed by the assistant, which built a scratch copy of the site and drove it with Playwright's Chromium 153 (not the project's test suite), capturing scroll states for all seven chapters at 1280×800 and two at 390×844:

- Every chapter page builds with its pop-up (3–5 layers each; the "Illustrated scene study" disclosure is gone from stops 2–7, as it already was on stop 1).
- **Defect found and fixed:** in the production build the minifier merged `animation` and `animation-timeline` into one shorthand that Chrome 153 rejects, so the CSS-timeline version never ran and every pop-up stayed a flat static scene, chapter 1 included. A longhand rewrite made it run (`--hinge` falling from 72° to 0° on entry, `--cam` rising to 520 with the stage fading out), and the same day the scroll effects moved to GSAP ScrollTrigger (see the next section), which supersedes it.
- Motion, reduced motion and Calm view behave as designed (3 animations, then 0 and 0; the pin goes static, and Calm now shows a still illustration instead of hiding it). Forced colors and printing hide the scene.
- Seen but not fixed: on a 390 px phone each pop-up adds about 190svh of scroll with the small stage centred in blank space, and Lincoln Court's panel text is tiny. Safari/iPad was not tested; browsers without `animation-timeline: view()` get the still scene.

The visual result still needs Ryan's own look; no scene review or rights gate changed.

## GSAP ScrollTrigger and SplitText replace Motion and the CSS timelines (visuals assistant-observed 2026-11-03; suite owner-run 2026-11-04)

`src/scripts/story.ts` now uses GSAP 3.15.0 with ScrollTrigger and SplitText, `motion` is uninstalled, and `story.scss` no longer uses `animation-timeline`.

Owner-run on 2026-11-04, with all of the changes below in place: `npm run check` (67 files, 0 errors, 0 warnings, 0 hints; 56 release obligations unchanged), `npm run test:unit` (5 files, **58 tests passed**), `npm run build:preview` (22 pages) and `npm run test:browser` (**40 Chromium scenarios passed** in 45.4 s, including axe and the size floor on every route and the `story.spec.ts` Calm-view, reduced-motion, print and failed-chunk scenarios). Those suites do not assert the animation curves, the word reveals or the tab marking; the observations below come from the assistant, which built a scratch copy and drove it with Playwright's Chromium 153 (not the project suites):

- Chunk size: the story chunk grew from about 7.6 KB to about 48 KB gzipped (125 KB raw, including SplitText); it loads dynamically on the home and chapter pages. All other script chunks are unchanged.
- Headlines (SplitText): the home title and chapter headings split into words that rise and fade in; sampled opacity stayed at 0.55 or above while animating, and the original markup was restored when each reveal finished (home `h1` innerHTML equalled the static HTML). SplitText uses `aria: 'none'` so the words stay ordinary text. Calm view leaves no split markup behind.
- Chapter tabs: scrolling to `#record`, `#metagame` and `#evidence` set `aria-current="location"` on the matching "On this page" tab, and the mark stays under Calm view. Evidence cards and the home numerals animated and cleared their inline styles. No page errors.
- Pop-ups: screenshots at the same scroll states as the CSS-timeline version match it (unfold, dolly into the light, glow, fade) on all seven chapters; probe values followed the intended curves (`--hinge` 54° to 0°, `--cam` to 520, `--flood` to 0.9, stage opacity to 0 at the end), with no page errors.
- Home: parallax transforms were applied to 9 images and the progress bar scaled while scrolling; clicking Calm view cleared every inline transform and the progress style (`gsap.context().revert()`), set `data-story-motion="still"` and removed the pop-up track.
- Behaviour change: effects no longer stop when the tab is hidden. The browser stops running animation frames in a hidden tab, and tearing the pop-up track down on every tab switch would shift the page under the reader.
- `npm audit` now reports 4 vulnerabilities (1 moderate, 3 high): `fast-uri` (moderate), `undici` and `vite` via `launch-editor` (high, transitive) and `zod` (high, direct: oversized-collection memory exhaustion; the suggested fix is the breaking 3→4 upgrade). Ryan's 2026-10-05 audit reported none. GSAP has no dependencies, so these are newer advisories, not caused by this change; nothing was upgraded.

The visual result still needs Ryan's own look in a real browser (Safari and iPad were not tested), and the GitHub Actions run of `ci.yml` and the deploy gate has still never executed.

## Actors-and-costs board prototype, Chapter 05 (suite owner-run 2026-11-04; visuals assistant-observed)

Owner-run on 2026-11-04 with the board in place: `npm run check` (72 files, 0 errors, 0 warnings, 0 hints; 56 release obligations unchanged), `npm run test:unit` (6 files, **66 tests passed**, including `board.test.ts` and 37 data-integrity cases with the six new board ones), `npm run build:preview` (22 pages) and `npm run test:browser` (**42 Chromium scenarios passed** in 38.3 s, including the two new `board.spec.ts` scenarios, axe on every route and the size floor). The assistant had earlier built the preview (content gate passed with the new `board` collection) and checked the page in the in-app browser on the owner's running preview at 1916×949:

- The board was live, the beat followed the section being read (intro, record, metagame), the emphasised actors changed per beat, and chapter 5 no longer had a pop-up.
- Eight phrases became `role="button"` inline spans that wrap with the sentence; focusing one highlighted its actor, lit the other phrases for that actor and set the polite announcement ("Captors: Tried to constrain police contact"); Enter on a phrase did the same. Clicking an actor card moved focus to one of that actor's phrases.
- Defects found and fixed while looking: the site's nested `.experience-page button:not(.btn-secondary)` crimson fill was painting the phrases and cards, and `<button>` phrases could not wrap across lines. Phrases are now spans, and the cards use higher-specificity resets.
- Story chunk is now about 49 KB gzipped. Not checked: Safari and iPad, a screen reader, keyboard-only use beyond Enter on one phrase, and phone layout in a real device (the narrow layout is covered only by the new browser spec). The board adds eight tab stops to the chapter text.

The board's beats and phrase links are editorial choices and still need Ryan's review, and the visual result needs his own look.

## Board on all seven chapters (suite owner-run 2026-11-04; visuals assistant-observed)

Owner-run on 2026-11-04 with all seven boards and the card-order and emphasis fixes in place: `npm run check` (72 files, 0 errors, 0 warnings, 0 hints; 56 release obligations unchanged), `npm run test:unit` (6 files, **67 tests passed**, including 3 in `board.test.ts` that check every chapter and pin the card order), `npm run build:preview` (22 pages) and `npm run test:browser` (**43 Chromium scenarios passed** in 36.7 s, including "every chapter pins its board and steps it through three beats", axe on every route and the size floor). The assistant ran `node scripts/validate-content.mjs` (board data for all seven chapters passed: 53 phrase links, every actor linked at least once, every phrase present exactly once in its block) and `npm run build:preview` (22 pages), then drove a scratch copy with Playwright's Chromium and checked pages in the in-app browser:

- All seven chapters rendered with no pop-up, a live board at 1280×800, three beats stepping with the reading, emphasised actors changing per beat, 7 to 8 phrase buttons and 3 actor buttons each, and no page errors.
- **Defect found and fixed:** pinned, the board measured 762 to 809 px tall, too tall for a 800–900 px viewport, so the fit rule (`wantLive()`) correctly left it stacked. The layout was tightened (smaller heading, compact cards, tighter beat spacing, "Documented" spelled out only when stacked; the filled dot and the text for assistive technology still carry it) and now measures 581 to 649 px, so it pins when the viewport is at least about 750 px tall.
- In the in-app browser: at 852×664 the board stayed stacked with all three beats visible and no horizontal overflow; at an emulated 1280×900 it pinned, the "The reform" beat showed on Chapter 07, and focusing a phrase highlighted its actor and set the announcement.
- **Follow-up fix after Ryan's screenshot of Chapter 06:** the actor cards followed the metagame data order (Dillinger and Frechette before the Building manager) although the text introduces the manager first, and the inactive card (Officers) read as the "selected" one because it was simply darker. Cards are now sorted by the first phrase that links to each actor, and a Gleckman marker was added so Chapter 02 opens with him; active cards are bright with a gold edge, a gold dot and `aria-current="true"`, inactive ones are muted. Observed in the in-app browser at 1280×900: Chapter 06 lists Building manager, Dillinger and Frechette, Officers; the intro beat marks the first two and the record beat marks Officers only. A unit test now pins the order for three chapters.
- **Second follow-up, same screenshot series:** after the first fix Ryan reported that on load Officers still looked active. The inactive card still had a full visible outline, so it read as a selected box beside the gold-edged ones. Inactive cards now have no border and no fill (muted text only); only the current beat's cards look like boxes. Observed in the in-app browser at 1280×1000 on Chapter 06's intro beat: the two active cards are filled with gold edges and dots, and Officers is a plain muted row. Not yet run through the owner's chain.
- Not checked: Safari and iPad, a screen reader, a real phone, and the pop-up code, which is dormant but untouched (`PopUpScene.astro`, `popup.ts` and the pop-up block in `story.ts` and `story.scss` stay until the boards are approved). The 53 beat and phrase-link drafts need Ryan's editorial review.

## Casebook expansion, Paper Trails, Visual Story, and Title Sequences (observed 2026-11-13)

Verification across the expanded Casebook (71 side stories, 7 paper trail desks, 7 experiences), visual story layers, and title sequences:
- `npm run check`: 95 files, 0 errors, 0 warnings, 0 hints. Content schemas and cross-catalog validation passed; 116 release obligations remain open.
- `npm run test:unit`: 6 test files, **77 tests passed**, covering base paths, storage, board regressions, popup depth layers, studies, and data integrity.
- `npm run build:preview`: **100 static routes generated** in 2.1 s.
- Browser test suites:
  - `tour.spec.ts`: **15 passed**, verifying paper trails, side stories, strange finds, clues in plain sight, oddities in files, and equipment cards opening without JavaScript.
  - `story.spec.ts`: **6 passed**, verifying title sequence backdrops, cut-paper returns, Calm view, and live preference cancellations.
  - `bluff-pilot.spec.ts`: **4 passed**, verifying visitor chair shot reading, sound opt-in/handoff, and phone width accessibility.
  - `board.spec.ts`: **3 passed**, verifying beat stepping, marker emphasis, and stacked mobile fallback.
  - `a11y.spec.ts`: **22 passed**, zero WCAG 2.x A/AA violations and 16px font floor / 44px target floor across all checked routes.

## Cross-page cuts (observed 2026-11-15)

Owner-run after adding native cross-document View Transitions (`src/styles/story.scss`, `src/layouts/Layout.astro`) and browser coverage in `tests/browser/story.spec.ts`:
- `npm run build:preview && npm run test:browser`: **56 passed** in Chromium, including `cross-page cut carries the chapter title frame from the home story` (verifying `pageswap` `viewTransition` activation, `[data-cut-target]` tagging on `.story-home`, and `view-transition-name: chapter-frame` on the chapter page).
- Not checked: human visual acceptance of the cut feel, and non-Chromium browsers (unsupported browsers, reduced motion, Calm view, and no-JavaScript reading fall back to ordinary page loads).

## Reproduce focused checks

```sh
npm run check
npm run test:unit -- tests/unit/popup.test.ts tests/unit/studies.test.ts tests/unit/data-integrity.test.ts tests/unit/storage.test.ts
npm run build:preview
npm run test:browser -- tests/browser/story.spec.ts tests/browser/studies.spec.ts   # targeted tour & study specs
npm run test:browser   # complete tour + axe/size-floor specs
npm run links          # network: URL reachability and archive coverage
ASTRO_SITE=https://ryan258.github.io ASTRO_BASE=/stp-gangster-tour npm run build:preview && npm run check:base -- /stp-gangster-tour   # GitHub Pages subpath guard; rebuild without the variables afterwards
```

CI (`.github/workflows/ci.yml`) runs the check, unit tests, preview build, browser/axe suite and the subpath guard on pull requests and non-`main` pushes. `deploy.yml` calls that same workflow first, so a push to `main` is published only if all of it passes. As of this record CI has never run on GitHub; run it once through **Actions → CI → Run workflow** on a branch before relying on it as the deploy gate. The browser, axe and size-floor specs now include `/studies/` and the six study routes, which had no coverage before; their first run may expose real findings.

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
- The CI workflow and the deploy gate that calls it have never executed on GitHub, so the Ubuntu run of the browser suite and the subpath guard step are unproven there. Run **Actions → CI → Run workflow** on a branch first.

Capture device/browser versions, exact route/revision, observations and any remaining failure when completing manual work. Enter reviewer identity only for a review actually performed. Never convert a generator success or automated test into owner acceptance.

The optional performance harness is prepared but has not been run in this remediation. With the preview running, the owner can run the bounded three-run laboratory sequence:

```sh
node scripts/measure-performance.mjs
```

It writes `test-results/performance.json` and exits nonzero for missing/excessive LCP, CLS or decoded response-body bytes. Set `STP_PREVIEW_URL` when using a different local port. The default four-route run takes about a minute; running one route takes about fifteen seconds.

## Concurrent checkout activity

Other activity added commits and base-path helpers while this remediation ran. No staging, commit, push or publication command was issued by this remediation. Existing changes were preserved. Automated route checks target the origin-root preview; the concurrently introduced GitHub/subdirectory configuration is not deployment acceptance.
