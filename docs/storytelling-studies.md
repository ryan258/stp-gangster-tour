# Six browser storytelling studies

Open `/studies/` in the local development preview, or choose **Studies** in the tour navigation. Each experiment has a separate route, a source-linked reading version, and a **Read all views** control. These are editable studies, not editorially accepted additions to the finished edition.

| Study | Try | Narrative question | Browser mechanism |
| --- | --- | --- | --- |
| One place. Three questions. | Follow the money, protection, then costs | Does shifting emphasis change the apparent meaning of the arrangement? | Named actor emphasis and relationship paths; optional Web Animations |
| Read it again. | Compare the hotel account with the court record and the boundary | Does identifying a sentence's basis change how it reads? | CSS Custom Highlight; the selected excerpt is also printed beside its qualification |
| Put the accounts together. | Open the record in another tab and choose a thread in either | What changes when setting and record can be considered together? | BroadcastChannel; random pairing room; complete single-page counterpart |
| Listen from somewhere else. | Choose a perspective, start sound, pause, change perspective | Can an atmosphere suggest distance without claiming to be evidence? | Web Audio gain/filter graph over existing catalog media; complete transcript |
| The second first impression. | Opening → consequence → return | Do the same words acquire another meaning? | Optional same-document View Transition plus local selected-view persistence |
| Two days. Several decades. | Widen the view, then return to the two days | What does institutional context add to an event account? | Two explicitly selected timelines and optional Web Animations; spacing is not proportional |

## Scope and evidence

Historical text, captions for the experiments, interpretation, qualifications and claim references live in `src/data/studies.json`. Existing introductions and media files are unchanged. The studies reuse catalogued artwork through `ArtImage.astro`; there are no new images, audio derivatives, historical sources or runtime third-party requests. No listening, editorial, rights or provenance review is marked complete.

`scripts/study-schema.mjs` defines the study schema and cross-catalog checks. It is included in the existing content/build gate. Unknown claims, media, stops, actors and passage references fail validation, as do highlights that no longer match the passage. Production release obligations remain intact.

Interpretive relationship arrows do not assert specific transactions or a documented meeting. Adjacent timeline entries do not assert causation. The returning study's final note is new editorial interpretation, clearly identified alongside the unchanged opening.

## Reading and browser fallbacks

- All views are pre-rendered. Without JavaScript, all text, source links, timelines, paired viewpoints and the audio transcript are readable.
- Optional controls appear only after their controller initializes. No essential action requires dragging, timed response, location permission or typing.
- The latest chosen frame is stored under a study-specific, base-path- and content-revision-scoped key. Tour bookmarks and progress are untouched. Unknown or oversized stored values are ignored; denied storage produces a visible temporary-state notice.
- Named frame fragments can link to a view. Selection replaces the current history entry; it does not create a long Back-button trail.
- Calm view, reduced motion, forced colors, printing and hidden pages stop study animation. All views print, including both window counterparts.
- Highlighting has a text excerpt fallback. View Transitions and Web Animations are optional; immediate selection is the fallback.
- BroadcastChannel is limited to the same origin and storage partition. The companion link carries an opaque random room ID. Messages accept only a handshake or a rendered frame ID. An independently opened study gets a different room. The room is pairing convenience, not an authentication boundary. No cross-device synchronization is provided.
- Audio sources are assigned only after **Start sound**. A perspective change pauses sound; **Start sound** continues the narration with the selected treatment. Page exit, hidden tabs and printing pause sound. Calm view allows an explicitly started narration without ambience; removing Calm view never starts a channel. Failed or unsupported audio leaves the transcript.

## Verification record

The assistant started a separate development preview. Its normal content/asset preflight passed again after the final data and schema edits, retaining 56 release obligations. A live browser inspection confirmed the index, the annotation page and a native highlight matching the selected catalog passage. Selecting “Follow the influence” in the place window also changed the linked record windows through BroadcastChannel. These observations are not a complete browser, type, accessibility or audio acceptance pass.

Ryan ran the targeted verification on **2026-10-05** and supplied the terminal output:

- `npm run check`: 64 files, zero errors, warnings or hints. Structural content and asset validation passed with 56 release obligations still open.
- `npm run test:unit -- tests/unit/studies.test.ts tests/unit/data-integrity.test.ts`: **44 passed** (13 study tests and 31 content-boundary tests).
- `npm run build:preview`: **22 pages built**, including the six studies and their index.
- `npm run test:browser -- tests/browser/studies.spec.ts`: **five Chromium scenarios passed**.

This is an owner-run targeted pass. The assistant did not rerun the suites. No human listening, editorial, rights, provenance or real-device review is granted by these results. The supplied output did not identify the Node executable/version used for this run.

The added study coverage includes:

- `tests/unit/studies.test.ts`: bounded/versioned storage, allowlisted cross-window messages, pairing IDs and invalid study references.
- `tests/browser/studies.spec.ts`: six routes at narrow width, no-JavaScript reading, paired and independent windows, persisted selections, failed storage, unsupported APIs, reduced motion, and explicit audio start.

To reproduce these results when a later change warrants it, run from the project root:

```sh
npm run check && npm run test:unit -- tests/unit/studies.test.ts tests/unit/data-integrity.test.ts && npm run build:preview && npm run test:browser -- tests/browser/studies.spec.ts
```

The ordinary `npm run build` remains the human-gated production command. No deployment or publication is part of these studies.

### Node version-manager warning

Before this successful run, the shell reported that requested version `v22.22.3` was not installed. The project pins `22.22.3` in `.nvmrc`; the shell's `fnm --use-on-cd` hook tries to select it. Inspection found that exact version absent from `fnm list`, while a separate Node `22.22.3` installation was available on the assistant's PATH. The warning therefore concerns the version manager's installation inventory; it did not prevent the supplied commands from completing. The exact runtime used in Ryan's run remains unrecorded.

The one-time shell setup command is:

```sh
fnm install 22.22.3 --use
```

This installation has not been performed by the assistant. The project pin and shell configuration were not changed.

Real Safari/iPad behavior, voice control, screen-reader use, listening quality, cross-window behavior in standalone PWA mode, physical printing and the narrative value of the six forms still need human exploration. The key editorial comparison is whether each interaction makes a meaningful difference to understanding, and whether that difference earns the effort of using it.

The GitNexus index used during implementation was ten commits behind HEAD. Its validator impact result was LOW, but schema/header results were UNKNOWN; owning-source reads supplied the missing dependencies. No reanalysis was run. If refreshing the index later:

```sh
node .gitnexus/run.cjs analyze --index-only
```
