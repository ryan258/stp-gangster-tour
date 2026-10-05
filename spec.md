# Feature: Saint Paul After Dark

**Working subtitle:** An interactive history of the city that sheltered the underworld.
**Status:** Implementation contract v0.5; a complete reading preview exists. Production acceptance remains open; see `docs/verification.md` and `roadmap.md`.
**Created:** October 3, 2026.
**Specification revised:** October 5, 2026. Technical references checked on this date; historical passage checks remain dated October 3, 2026.
**Current project state:** Static Astro application with thirteen content routes and a 404, validated JSON, local media, retained audio masters, Git history, and targeted tests. The history draft and research ledger remain editorial starting points; the runtime catalog records corrections.
**Scope:** A personal creative project with one complete, bounded first edition.

**Contract language:** “Must” and “shall” describe required behavior. “Target” describes a production goal to measure. Proposed copy and scene treatments may change without expanding the seven-stop scope. This is a specification, not evidence that the experience has been built, historically verified in full, or accepted by Ryan.

Jump to [stop interactions](#r2-seven-locations-one-narrative), [art and audio](#r3-visual-and-sound-direction), [page behavior](#r4-pages-map-scenes-and-navigation), [technical foundation](#r12-technical-foundation-and-local-build-interface), [production readiness](#r13-editorial-production-assets-and-readiness), or [acceptance criteria](#acceptance-criteria-ears-style).

## Goal

Create an immersive, accessible web tour that lets visitors explore seven places in Saint Paul's gangster history through original graphic-noir scenes, historical evidence, an interactive city map, and a connected story about corruption, refuge, violence, and accountability.

The central question is **“How did a city become a safe place for dangerous people—and what broke the arrangement?”** The visitor follows the relationships between places, people, money, and protection. A second, connected question is **“Who could shape other people's choices, and who absorbed the consequences?”** Each stop examines a period metagame: the incentives, informal arrangements, information, or institutional rules influencing the events. Visitors' choices determine what they investigate next; historical outcomes remain fixed. “Metagame” is the tour's analytical term, not vocabulary attributed to historical participants.

The experience should feel like stepping into a meticulously illustrated noir documentary. The city is recognizable: Mississippi River bluffs, sandstone caves, hotel windows, residential streets, and the old federal courthouse. Its identity must come from Saint Paul, rather than interchangeable gangster imagery.

## Constraints

- **Finite edition:** One prologue, seven stops, one epilogue. Target 30–45 minutes for the guided route, with individual stops usable in 3–5 minute sessions. These are pacing targets to verify during the build, not promised durations.
- **Accessible from home:** The complete experience works without travel, location permission, an account, typing, or a timed challenge. Mobile use at a location is supported through the same content.
- **Primary use:** Ryan can begin, investigate one place, stop without ceremony, and return later without remembering where he was. Secondary use is an uninterrupted guided tour or free exploration by someone unfamiliar with Saint Paul. There are no commercial, classroom-assessment, or tourism-booking requirements.
- **Personal accessibility:** Support Ryan's use of voice control, large targets, short sessions, and low-effort navigation. Essential actions must not require dragging, precise pointing, repeated tapping, or remembering shortcuts.
- **Original art direction:** Translate the requested *Sin City* reference into hard black-and-white contrast, selective crimson, sculpted shadows, graphic compositions, and cinematic panel changes. Create original artwork, layouts, characters, and prose.
- **History leads:** Real people and events are sourced. Reconstruction, interpretation, and local legend are distinguishable at the point of use. No invented historical dialogue or fabricated archival documents presented as authentic.
- **Small technical footprint:** Astro in static-output mode, TypeScript, ordinary CSS, SVG, and local validated JSON content. Use full-document navigation and small browser enhancements; see R12. No required server, database, paid map service, runtime AI, or visitor account.
- **Readable foundation:** Pre-render the narrative, evidence text, source links, and ordinary navigation. If client-side JavaScript fails or is disabled, the complete reading route remains available; saved progress, selection highlighting, and audio controls may be unavailable with a plain explanation. Do not require the map or an app-loading screen to reach the story.
- **Bounded production:** Design for a solo 2–4 week build burst. Reuse interaction components and audio beds while giving each location its own composition. A full 3D city is outside this edition.
- **Work boundary:** Ryan authorized implementation and correction of the reviewed issues. Staging, commits, pushing, deployment and publication require separate explicit delegation.

## Requirements

### R1. Opening and visitor journey

The opening shows a high-contrast Saint Paul skyline above the river, one crimson reflection, the title, and a short original line:

> Every city has rules. Saint Paul had an arrangement.

This is proposed editorial copy, not a historical quotation. The first screen offers **Begin the tour**, **Explore the map**, and, when available, **Resume**. Sound and Calm view are available before entry. There is no mandatory cinematic, loading ritual, or onboarding form.

The prologue introduces the protection arrangement in under 150 words and previews the question the tour will answer. Visitors can skip directly to any stop. The guided sequence follows the order below, with dates clearly shown when the story changes period. It does not pretend these events happened on one night or that the narrative order is an efficient walking route.

At each stop, the visitor can read or listen to a short introduction, inspect two or three evidence items, follow a related person or place, and continue. A visible **Next stop** remains available throughout. Exploration enriches the tour without blocking its progress.

Use the same reading pattern throughout: **Where and when → What happened → Reading the metagame → Inspect the evidence → Continue**. These describe content order; they need not become repetitive headings. Each stop includes a 30–50 word synopsis and roughly 300–450 words of core narrative, including a 120–180 word introduction suitable for narration. Evidence explanations target 60–120 words each. Avoid padding to meet a count. The epilogue targets 200–300 words. The 30–45 minute estimate includes optional inspection and listening; the uninterrupted text route can be shorter.

Narration covers the introduction only. Label its control **Listen to introduction** so visitors do not expect a complete audio tour. Facts essential to understanding the story appear in the visible reading route; evidence offers support and depth. Every relationship destination supplies enough local context to make sense when entered out of order.

| Entry or action | Required result |
| --- | --- |
| Begin the tour | Open the prologue. Preserve existing progress; only Start over clears it. |
| Resume | Show the saved stop/block and a short context reminder. Prefer Resume visually when a valid bookmark exists, without hiding Begin or Map. |
| Explore the map | Show all seven named stops in an ordered list alongside the map, including locations awaiting verification. |
| Next / Previous | Follow the fixed editorial order, even after a jump from the map. Stop 1 returns to the prologue; stop 7 continues to the epilogue. |
| Related person / place | Open a contextual profile or linked stop without marking unrelated stops visited. Provide an obvious return to the originating stop. |
| Reach the epilogue | Record that the ending was opened; do not claim all stops or evidence were read. Show visited and unvisited places without a score. |

Use stable visible navigation labels: **Home**, **Map**, **Casebook**, **Sources**, **Calm view**, and **Mute** when audio is active. Show **Stop N of 7** within a stop. Do not hide essential navigation until the visitor scrolls or discovers a hotspot.

### R2. Seven locations, one narrative

The [history draft](history.md) supplies the narrative; [research.md](research.md) owns claims C01–C30, evidence E01–E14, sources S01–S16, and interpretive premises M01–M07. Preserve these IDs during content conversion. The following is the edition's interaction inventory, not new historical evidence. Every evidence title resolves to its treatment in the ledger.

| Stop / period | Question and material | What the visitor can do and what changes |
| --- | --- | --- |
| **1. The Arrangement — Green Lantern / Wabasha**; 1900–1928, with later consequences | Who maintained the bargain? **E01 The conditions**, **E02 The intermediary**, **M01**; C01–C05. | Select **Check in**, **Pay**, or **Keep major crimes elsewhere**. Highlight that condition and its participants in an editorial relationship diagram. All three descriptions remain readable together; no implied signed contract. |
| **2. A Suite Above the Street — Saint Paul Hotel**; 1920s–1938 | Who could influence a decision? **E03 The money trail**, **E04 The jury and the loans**, **M02**; C07–C11. | Select **Tax evidence** or **Juror influence**. Highlight the corresponding dated proceeding and connections, with its specific finding and limitation. Never merge the two cases or imply hotel complicity. |
| **3. Under the Bluff — Castle Royal**; 1933, with separately dated later memory | What establishes a venue, and what establishes attendance? **E05 The 1933 notice**, **E06 A guest list without a register**, **M03**; C06, C12–C14. | Select **Business record** or **Visitor stories**. Highlight the claim, source date, and support limit in a comparison. Keep both visible and label the later memory layer. No control resolves disputed attendance into fact. |
| **4. The Price of Protection — Hamm brewery context**; June 1933 onward | Who bore the costs? **E07 A person and an uncertain footprint**, **E08 The message becomes evidence**, **M04**; C15–C17, C30. | Select **Ransom communication** or **Investigative trace**. Emphasize the intended demand or the physical evidence described by the account. No fingerprint-matching puzzle; the site remains a context location until supported otherwise. |
| **5. The Deal Breaks — Lexington / Goodrich area**; January–February 1934 | Can a captor control the response? **E09 A demand is not compliance**, **E10 Changing the target**, **M05**; C18–C22. | Select **The demand** or **The reported response**. Highlight the corresponding part of the attributed timeline; a secondary link compares Hamm's chapter. The visitor never chooses what the family should have done. |
| **6. The Safe House Fails — Lincoln Court**; March 1934 | Where did refuge stop working? **E11 A boundary changes the case**, **E12 Report, surveillance, confrontation**, **M06**; C23–C24. | Select dated stages **Report**, **Surveillance**, **Confrontation and escape**, or use Previous/Next panel. Selection outlines one of three panels; the whole text sequence stays present. No autoplay, simulated gunfire or tactical choice. |
| **7. On the Record — former federal courthouse / Landmark**; 1934–1938 | What changed people, and what changed institutions? **E13 Name the actual outcome**, **E14 Change the appointment rule**, **M07**; C09–C10, C25–C28. | Select **Legal outcomes** or **Appointment rules**. Emphasize the relevant rows in a dated comparison. A courthouse illustration is context, not proof that every event or appeal occurred in that room. |

These are seven distinct investigations built from four reusable presentations: **relationship**, **comparison**, **sequence**, and **document**. Every presentation renders its complete text before JavaScript runs. Optional selection changes emphasis, a caption, or the illustrated panel; it never changes a historical result, hides a necessary qualification, or unlocks the next stop. Use ordinary buttons with a selected state and native links; no drag-and-drop board or custom gesture controls.

The sequence is thematic, not a single night or walking itinerary. Each stop has its own period label; later testimony, publication dates, and retrospective interpretation are identified as such. Keep victims and residents visible as people. Attribute allegations and distinguish arrest, acquittal, mistrial, conviction, appeal, and reform. No invented dialogue, private thoughts, composite witnesses, or graphic injury detail.

The epilogue connects the mechanisms examined, then offers **Revisit the map**, **Open casebook**, and links to unopened stops. Opening it records only that the ending was opened. There is no completion score or suggestion that all evidence has been understood.

### R3. Visual and sound direction

The visual treatment is graphic noir grounded in each place: large ink shapes, warm paper, hard light, and limited crimson. New art is labeled **Illustrated reconstruction**; documented details have reference IDs, and interpretive interiors or weather are identified. Rain, lighting, and empty-room staging establish atmosphere without claiming those conditions existed at the event's time. Do not render alleged visitors, gunshots, documents, signatures, or headlines as evidence.

| Element | First-edition decision |
| --- | --- |
| Color | Ink `#0B0C10`, paper `#F3EFE6`, muted text `#B8B8BC`, accent `#C62F42`. Treat these as tokens, not pre-certified contrast pairs. Use paper for essential text on dark surfaces; crimson is never the only status cue. |
| Type | Self-host **Barlow Condensed Semibold** for short titles and **Source Sans 3 Regular/Semibold** for reading and controls. These projects supply OFL licensing; preserve the exact downloaded fonts' license notices. Use sans-serif fallbacks, `font-display: swap`, at most three WOFF2 files, and no remotely served font CSS. [Barlow license][barlow-license]; [Source Sans license][source-sans-license]. |
| Reading | Body 18–20 CSS px, line-height at least 1.5, measure 60–70 characters; sentence case, selectable HTML, no typewriter reveal. Metadata is at least 16 CSS px. Long titles wrap; do not shrink them to fit a fixed height. |
| Composition | One dominant scene, quiet reading surface, visible continuation. Paper texture and halftone stay behind art, never essential text. No page of interchangeable image cards. |
| Motion | Native scrolling, optional opacity/light changes of at most 300 ms; no continuous animation in v1. Reduced motion and Calm view remove decorative transitions. No parallax, camera shake, flashes, scroll hijacking, or loading cinematic. |
| Sound | Seven introductions; two optional reusable beds: subdued outdoor weather/city texture and quiet interior room tone. No intelligible background speech, startling cues, or required music. Zero ambience is acceptable; three beds is the ceiling. |

| Scene / asset ID | Required composition and historical boundary | Narrow-screen treatment |
| --- | --- | --- |
| Green Lantern / `scene-arrangement` | Dark street, isolated doorway, surrounding figures left indistinct; an adjacent conceptual boundary diagram carries the mechanism. Verify facade references or label the setting generalized. | Doorway remains the focal point; diagram becomes a readable list. |
| Hotel / `scene-hotel` | Hotel facade with one lit window and a clearly interpretive room vignette. No unsupported headquarters room number. | Window/facade crop; financial and jury comparisons remain HTML below. |
| Castle Royal / `scene-caves` | Sandstone arches, tables, bandstand and restrained curtain accent. No famous gangsters or alleged murder victims placed in the room. | Preserve the arch and table silhouettes, not a tiny full-width panorama. |
| Hamm / `scene-hamm` | Brewery-area industrial forms and a quiet document surface. Context landscape, not a claimed exact seizure point. | Industrial silhouette above the human/event summary; no decorative ransom handwriting. |
| Bremer / `scene-bremer` | Residential street/intersection impression, interrupted routine conveyed without reenacting injury. No invented exact curb or identifiable schoolchildren. | Street geometry is suggestive; the intersection's textual qualification remains adjacent. |
| Lincoln Court / `scene-lincoln` | One composition containing three panels for the sourced sequence; hallway reconstruction carries no tactical floor-plan claim. | Stack all three panels; selection outlines a panel rather than hiding the other accounts. |
| Courthouse / `scene-courthouse` | Verified building reference and an interpretive courtroom detail, opening into a dated comparison in HTML. | Building/courtroom detail above the outcome list; no unreadably reduced evidence wall. |

The opening and epilogue reuse the city map or scene art. There are seven scene compositions, not separate desktop/mobile paintings or a separate skyline commission. Crops and export sizes are derivatives of a reviewed master; details essential to understanding must survive every crop or appear in text. R13 specifies the asset completion records.

**Audio behavior:** narration covers the same introduction text shown on the page, approximately 60–90 seconds at normal speed; clarity outranks hitting a duration. Use one original, contemporary narrator or consistently disclosed synthetic voice, never an impersonation or fake historical broadcast. Playback is optional; producing seven reviewed recordings is required for completion. Local recording or local text-to-speech is the default production method. A paid provider requires its own authorized production action.

| Event | Required result |
| --- | --- |
| Fresh load, refresh, navigation, or restored browser page | Both channels stopped. Attach audio sources only after an explicit play request, so no audio is fetched on entry. Saved volume never implies playback consent. |
| **Listen to introduction** | Start this track only; clear mute, show Loading until playback succeeds, then Playing. If its saved volume is zero, restore a modest nonzero level so explicit Play is not silently inaudible. |
| **Pause**, **Resume introduction**, **Restart introduction** | Pause retains this page's position; Resume continues it; Restart begins at zero. A full navigation resets track position. |
| **Mute** | Pause both channels and retain their positions while this document remains open. Unmute does not start either channel; each requires an explicit Play action. |
| **Enable ambience** | Start only the chosen bed. If Calm view is on, explain that it suppresses ambience; do not turn Calm view off silently. |
| Narration starts / pauses / ends | If ambience was already enabled, reduce its level while speech plays, then restore its chosen level; never start a stopped bed. At track end show Replay introduction. |
| Page hidden or audio interrupted | Pause both channels. Returning to the page leaves them paused. |
| Loading fails or playback is blocked | Show Unavailable, preserve text and navigation, offer one explicit Retry audio control; never loop retries or display Playing without successful playback. |

Provide speeds 0.75×, 1×, 1.25×, and 1.5×, plus **Quieter**/**Louder** controls for each channel; dragging a slider is never required. Start narration at 70% and ambience at 20% of the app's range unless valid saved levels exist; duck ambience to 25% of its chosen level during narration. These are relative settings, not loudness guarantees. Normalize recordings consistently and inspect intelligibility at the R13 listening gate.

Verify actual level control on the supported browsers rather than assuming an accepted media-volume assignment changes audible output; this API has compatibility limits. A small native audio gain implementation is permissible. If reliable app-level mixing is unavailable, offer narration with **Use your device's volume controls**, omit ineffective level buttons, and disable ambience for that session. Do not play an uncontrolled background bed under speech. Record this explicit fallback in the browser checks. [Media volume compatibility][media-volume].

Calm view removes decorative texture and motion and pauses ambience; requested narration may continue. Disabling Calm view restarts nothing. Apply valid saved Calm state before decorative effects run. System reduced motion independently disables motion even when Calm is off. If JavaScript is unavailable, the matching introduction remains readable and the audio area explains that playback controls require JavaScript.

### R4. Pages, map, scenes, and navigation

Generate **thirteen content pages plus one 404 document**. Every route opens directly from static HTML and uses ordinary full-document links; v1 has no client router, route prefetching, or view-transition framework. A short CSS entrance effect may decorate a newly opened scene without delaying it. Preserve browser Back/Forward and never replay sound on restoration.

| Route | Required page content and primary next action |
| --- | --- |
| `/` | Title, premise, one-sentence content note about historical abduction/violence, Begin the tour, Explore the map, and Resume when valid saved state exists. Calm view is visible; content note is not a blocking interstitial. |
| `/prologue/` | Prologue, period framing, introduction to evidence versus interpretation, **Start with The Arrangement**. |
| `/stops/{slug}/` × 7 | Period and Stop N of 7, synopsis, scene/description, narrated introduction, remaining story, complete metagame, two evidence disclosures, related links, place status, Previous/Next. |
| `/map/` | SVG city overview, accessible seven-stop list in narrative order, status labels and an unplaced section. Every list item opens its stop without needing a pin. |
| `/casebook/` | Inspected items, all-evidence catalog, people/relationships, reading bookmark and Start over. Direct links into this page never require collecting an item first. |
| `/sources/` | Sources with author/institution, date if known, passage locators, external links, claim qualifications, art/audio/font credits, and edition/check dates. Distinguish a document's date from the date of the event it describes. |
| `/epilogue/` | Ending, visited/unopened stop links, Map and Casebook; no score or forced reset. |
| Unknown URL → `404.html` | Explain that the page is missing; offer Begin, Map, and valid Resume. Do not turn unknown paths into successful copies of the home page. |

The seven slugs are `the-arrangement`, `a-suite-above-the-street`, `under-the-bluff`, `the-price-of-protection`, `the-deal-breaks`, `the-safe-house-fails`, and `on-the-record`. Stop IDs equal those stable slugs. Narrative block IDs are `intro`, `record`, and `metagame`; prologue/epilogue use `opening`. Evidence links use `#evidence-E01` through `#evidence-E14`; people use `/casebook/#person-{stable-name}`; sources use `/sources/#source-S01` and corresponding IDs. IDs, not prose titles, determine URLs.

**Layout:** at widths of at least 960 CSS px, place the scene beside a readable narrative column in a container no wider than 1440 CSS px. Use one column below that width. DOM reading order stays consistent; CSS must not reorder keyboard focus. On a 390 × 844 viewport, show title, period and a route into the introduction without a full-screen image barrier. Keep the mobile scene at most 40svh and 320 CSS px high, allow a useful crop, and provide its description in ordinary text. At narrower/zoomed widths, all comparisons become stacked labeled blocks.

Global navigation always exposes Home, Map, Casebook, Sources and Calm view without an icon-only hamburger. It may wrap; on narrow or highly zoomed screens it scrolls naturally instead of consuming the viewport. Local Previous/Next links appear near the introduction and after the story, with destination names. Buttons never cover text, focus, safe areas, or native browser controls. No sticky bottom control bar is required.

**Evidence interaction:** use native inline `<details>`/`<summary>` disclosures on every viewport; no evidence modal or drawer in v1. The summary is the evidence title with its provenance label. Evidence HTML and citations are present in the static document. At most three optional scene controls open matching disclosures and focus their summaries; a visible **Inspect this scene** list provides the same destinations. Closing a disclosure leaves focus at its summary. Decorative hotspot controls are added only when JavaScript is active; the list works as fragment links without it. [Native disclosure behavior][html-details].

An explicit evidence fragment opens that disclosure after enhancement; without JavaScript, its fragment lands at the native summary, which the visitor can expand. An unknown evidence fragment keeps the current stop and gives a brief recovery message when enhancement is available. Merely opening/closing a disclosure or selecting a comparison does not add browser history entries. A direct link, ordinary Next/Previous, or a people/source link does. Selection does not auto-scroll through a sequence or move focus unexpectedly.

**Map:** use a self-hosted SVG overview showing the river and sourced neighborhood/landmark relationships. Its base geography also needs a source and reuse record. Verified markers are native links with text names and associated location qualifications; approximate areas use visibly different labeled outlines, and context markers say Context location. Unknown geometry gets no invented point. There is no pan/zoom control in v1. An adjacent ordered list supplies every action and state, including Current/Visited labels where known. When everything is unplaced in a draft, retain the list with an honest status rather than plotting guessed positions; R9 sets the finished-map threshold.

Ordinary navigation retains native focus behavior and updates the document title. An explicit Resume follows the saved internal route/block and focuses its heading, with the stop synopsis as a reminder. Back/Forward preserves available scroll position; restored pages revalidate storage and remain silent without resetting the bookmark. The URL takes precedence over saved progress. Same-page selections, casebook filters, and source visits do not become new reading bookmarks.

### R5. Evidence, people, sources, and the casebook

Evidence may be a sourced photograph, short attributed excerpt, map detail, or original explanatory diagram. Each item has its title, readable text, provenance, claim references, passage citation, **What this supports**, and a material limitation when needed. A decorative image is never its only readable form. Retain E01–E14, two per stop; an additional item is permitted only for a distinct point, with three per stop/twenty-one overall as the ceiling.

An item becomes **Inspected** only when a visitor deliberately opens it or follows a valid evidence link and its text opens. Pre-rendering, preload, selection of a related comparison, and ordinary scrolling do not count. Restoring an already-open disclosure does not invent a new inspection. Reopening is idempotent. Announce Added to casebook once when that action saves a new item; when persistence fails, use the R8 temporary-state notice instead of claiming it was saved. Never announce every save. This state records an action, not comprehension.

| Casebook state or action | Required presentation |
| --- | --- |
| No inspected evidence | “Open evidence at any stop to keep it here.” Offer the map and the complete catalog; do not imply the stories are locked. |
| Some inspected evidence | Group items by stop in story order, each with title, short description, provenance and **Return to evidence**. Show “N items inspected,” not a completion percentage. |
| **All evidence** / **Inspected** | Two ordinary filter buttons, with selected state. All evidence is the default; the inspected grouping is available without searching. Reset the filter on a new document load. |
| Unknown/unavailable saving | Explain that saved history could not be loaded or is temporary; keep the full catalog and people available. Do not mistake failure to read storage for proof that nothing has been inspected. |
| JavaScript unavailable | Show the full static catalog and people with a short explanation that automatic saving is unavailable. Hide controls that would do nothing. |
| Start over | Open an inline confirmation, explain that progress will clear but preferences remain; focus **Keep progress**. Confirmation clears only project progress and returns home; cancellation returns focus to the trigger. No modal needed. |

All people and relationships are available from the outset. Seed profiles only for people needed by the seven chapters, with a concise role, relevant period, claim-backed connections, qualifications, and links to their stops. Avoid a biography project or collectible roster. A relationship contains a readable sentence, source support and period. Label editorial inference as Interpretation; no unlabeled line can imply a payment, order, guilt, or direct contact. A simple list is the primary relationship view; optional diagrams repeat the same information.

A people or internal-source link from a stop may include `?from={known-stop-id}` before the anchor. With JavaScript, the destination renders **Back to [stop title]** using that validated ID; without it, offer the saved reading stop or Map. Never accept an arbitrary return URL. Opening a profile/source preserves the bookmark. The static fallback offers Map and ordinary browser Back remains useful; do not rely solely on a remembered browser history entry.

The Sources page lists every source used by production content, its locators and supported uses, plus clear notes for material disputes. It also lists credits/licenses for actual media, including generated origin where relevant. Prefer named source titles over raw URLs. External sources open in the same tab by default, are labeled external, and never fetch in the background. If one becomes inaccessible, the local summary and bibliographic locator remain readable; no runtime source availability checker is needed. A **Copy link** action may be added only with failure feedback and an ordinary selectable URL fallback; it is not required.

Material provenance and claim support are separate:

| Material label | Meaning |
| --- | --- |
| **Historical record** | Identifiable original document, photograph or object with creator/date/context. Its existence does not make every assertion in it true. |
| **Historical account** | A later description, including scholarship or an institutional retrospective. |
| **Tour explanation** | An original summary, comparison, or diagram built from identified sources. |
| **Reconstruction** | New art of a past setting, with documented versus interpretive details distinguished. |
| **Local legend** | An attributed circulating story; evidence of the tradition does not establish its events. |

Claim support is **Supported**, **Disputed**, or **Unverified**. Supported claims may still depend on attributed accounts. Carry required attribution and uncertainty wherever a claim appears, including narration, diagrams, cards and map labels. Do not display numerical truth scores. A summary of a historical record is a Tour explanation whose source is a Historical record; it must not look like the record itself. Newly drawn ransom notes are not authentic handwriting samples, and a source link is not image permission.

### R6. Content integrity and data contract

Store application content as local JSON collections, validated by schemas and cross-record checks at build time. Plain text and explicitly typed blocks become escaped semantic HTML; neither the long research Markdown files nor remote archive HTML is executed or parsed at runtime. Source and evidence IDs remain those in the ledger. Stop order, URLs, navigation, casebook catalog and the source index all derive from the same manifest.

| Record | Required fields and meaning |
| --- | --- |
| Edition | Stable edition ID, content revision, seven ordered stop IDs, prologue/epilogue blocks, required asset IDs, historical-check date, and presentation revision. Dates are real review dates, not the current build time. |
| Stop | Stable ID/slug, order, title, period, synopsis, `intro`/`record`/`metagame` blocks, scene/narration IDs, evidence IDs, related person/stop IDs, location ID, presenter type and named selections. |
| Narrative block | Stable block ID; paragraph/list/comparison type; plain text; factual/interpretive/editorial role; claim IDs for factual or interpretive premises. Transitions need no invented historical citation. |
| Person | Stable name-based ID, name/aliases, concise role and period, supporting claims, related stop IDs, required qualifications. |
| Claim | C-ID, bounded assertion, support status, evidence basis (direct record / attributed account / cross-source), source IDs with precise locators, support explanation, required attribution/qualification, passage-check status/date, revision. |
| Evidence | E-ID, one owning stop, title, description/text, material label, claim IDs, source locators, supports/limits text, optional media IDs and presenter content. |
| Source | S-ID, title, creator/institution, URL, publication date or explicit unknown, consultation date, source type and specific locators. |
| Media | ID, local files and computed file digests, kind, creator/origin, source references, rights basis and notice/permission record, required credit, material label, dimensions/duration, description/transcript, review status, reviewed revision and reviewed file digests. Generated origin is recorded. |
| Relationship | Two entity IDs, period, readable assertion, documented/interpretive label, premise claims and qualifications. An inferred connection must not be rendered as a documented contact. |
| Metagame | M-ID, owning stop, period, actors/aims (documented or inferred), mechanism, expected benefit, people bearing costs, observed response or evidentiary limit, premise claims, Interpretation label. Later memory has a separate dated block. |
| Location | Historical name, event/context role, independent precision/condition/access fields, geometry or null, supporting source/locator, and date/source for any current-access assertion. See R9. |

Use known-precision dates, retaining year/month/range labels without inventing missing days. Encode unknowns as explicit null/status values. Claims with Disputed/Unverified status require a nonempty qualification; attributed-account claims require visible attribution even when Supported. A block cannot suppress the qualification attached to its source claim. These fields help enforce presentation; they do not make an automated validator capable of judging prose truth.

**Narration consistency:** derive its transcript from the reviewed intro text actually shown, including material attribution and uncertainty, with citation UI removed. Store a SHA-256 digest of that spoken text after Unicode NFC and LF-newline normalization. Narration metadata records the same digest, voice, duration, and listening review of the current audio-file digest. An intro change or replaced audio file invalidates the affected review. Ordinary nonspoken citation formatting must not produce a false script match or require unrelated narration changes.

**Production validation fails** on duplicate IDs/slugs/orders; dangling references; wrong stop or evidence counts; missing required blocks/metagames; unreviewed material claims; absent attribution/qualifications; missing required media or rights records; stale transcript/media review; unsupported geometry; unsafe links; or a required record still marked draft. Report record ID, field, reason and relevant source path. Unknown geometry/access, qualified disputes, an absent optional archival image, or zero ambience do not by themselves fail—subject to the finished-map rule in R9.

A local preview may tolerate unfinished art/audio/review records, visibly marked **Work in progress**. It must still reject invalid structure, unsafe content and dangling references. Production build cannot silently downgrade to preview mode when validation fails. Keep the distinction in commands as well as UI; successful preview rendering is not release evidence.

Imported text, URL state and local storage are untrusted data. Accept only the bounded known IDs and intended HTTP(S) citation URLs or local asset paths. Escape text, reject executable schemes, prevent paths escaping the asset directories, and do not use arbitrary imported HTML/SVG as live UI. Only reviewed local SVG produced for this project may be inlined. Schemas run before rendering; presentation catches optional-media failures without removing the narrative.

Maintain the relationship between intent, research and production: spec.md owns desired behavior; research.md owns evidence/qualifications; history.md is the reviewed prose baseline; application records own rendered copy. A factual or interpretive production edit must update the affected research/history record and its revision as appropriate. Do not keep a second independently edited transcript or source list. Code and observed behavior remain the source of truth about what the application actually does.

### R7. Accessibility and low-effort use

Use [WCAG 2.2 AA][wcag] as the implementation target, supplemented by Ryan's needs. The following are explicit product requirements, not a claim that an automated scan certifies accessibility:

- Every tour action works with keyboard, touch, and visible-label voice control. Accessible names include the visible wording. Core use requires no text entry, gestures, or custom speech engine.
- Main controls and scene targets are at least 44 × 44 CSS pixels, with space between them. Inline prose links remain conventional readable links. The larger target is a deliberate project choice beyond the WCAG AA minimum. [W3C target-size guidance][targets].
- Normal text meets 4.5:1 contrast; large text and essential control boundaries/states meet applicable 3:1 requirements. Color alone conveys no state. [W3C contrast guidance][contrast].
- Focus is visible and unobscured. Navigation, headings, landmarks, images, disclosures, and status messages have meaningful semantics. Decorative SVG and texture stay out of the accessibility tree.
- All narrative and evidence remain available with audio muted, motion reduced, images unavailable, or the map unused. Explain meaningful visual content in text.
- Support text enlargement to 200% and reflow at a 320 CSS pixel viewport, including the equivalent 400% desktop zoom case. Offer the list equivalent for spatial content; do not require horizontal scrolling to read the story.
- Do not impose timers, forced automatic advancement, memory tests, or required fine motor tasks. Pausing for hours does not reset a stop.
- Every stop begins with a concise synopsis. Resume returns to a useful reading position with a short reminder of context.
- Supply a skip-to-content link, a descriptive page title, and a consistent heading hierarchy. Respect text-spacing overrides and forced-colors mode; focus and selected states remain visible without decorative backgrounds.
- Announce material errors and deliberate state changes politely. Do not announce scroll bookmarks, animate the reading focus, or repeat casebook status on every render. Evidence-open confirmation may say **Added to casebook** once.

### R8. Progress, resilience, and performance

Save progress and preferences separately, scoped to this project:

| State | Meaning and update rule |
| --- | --- |
| Reading bookmark | Last opened prologue, stop, or epilogue plus a stable narrative block ID. On entry use the first block; after intentional scrolling settles use the last block heading at or above the reading area's top, or the first block if none has passed it. Do not move keyboard focus while saving. |
| Visited stops | Set of known stop IDs added only after the stop's readable content opens; no reading-time threshold or claim of mastery. |
| Inspected evidence | Set of known item IDs added when readable evidence opens. No duplicate entries. |
| Ending reached | True after the epilogue opens; independent of the visited count. |
| Preferences | Calm view, channel volumes, and narration speed. Playback state and permission to make sound are never persisted. |

The map, casebook, sources, evidence disclosures and comparison selections preserve the reading bookmark. Resume restores its block with a context reminder; a deleted block falls back to the start of the same stop. Offer **Start over** in the casebook as specified in R5; on confirmation clear only this tour's progress and return home. Preserve accessibility/audio preferences. Starting from the beginning through Begin does not erase visited stops or evidence.

Version stored data and validate its structure, allowed values, and referenced IDs when loading. Drop obsolete set entries while preserving valid ones; reject malformed fields independently when safe. An unknown schema version resets the affected record rather than attempting an undocumented migration. A removed bookmark destination falls back to the first unvisited stop, or the map if all stops were visited. Explain a recovered/reset bookmark once. Never call storage-wide clearing methods.

Keep an in-memory state copy. If reads or writes fail, continue with temporary state for the current document and one nonblocking notice: **Progress cannot be saved. You can keep exploring, but progress may reset when you open another page or close this one.** Because navigation opens a new document, temporary progress may reset between pages; do not promise an in-memory cross-page session. Do not retry on every scroll or show repeated alerts. Save on meaningful state changes, with bounded/debounced bookmark writes, not solely on page unload. No account, analytics, remote progress sync, or guarantee of cross-tab synchronization is needed. State that saving applies to this browser and can be lost if its site data is cleared.

Keep each cold entry, including direct stop URLs, at or below **1,500,000 transferred resource-body bytes** through five seconds after load with no visitor interaction. Count HTML, styles, scripts, fonts, images, and any speculative requests; do not subtract automatically fetched media. Do not attach an audio source before its explicit play request; `preload="none"` alone is not the transfer guarantee. Load additional scene media as needed; do not preload all seven scenes.

Use LCP ≤2.5 seconds and CLS ≤0.1 as acceptance budgets for the landing page and the heaviest stop in a reproducible mobile lab profile: 390 × 844 CSS pixels, cold cache, 1.6 Mbps download, 750 Kbps upload, 150 ms latency, and 4× CPU slowdown in a supporting Chromium tool. Report the median of three runs per page, measured byte totals, exact tool/browser version, host hardware, and throttling method. A pass describes that profile, not all visitor devices. If budgets fail, reduce critical assets or processing before adding effects; changing a budget requires an explicit spec revision.

Use responsive images, reserve media dimensions, and self-host approved assets. On a failed media request, keep the text and continuation controls visible and offer a retry. Full offline caching is outside the first edition; do not imply that an interrupted connection guarantees access to unvisited stops.


Use the storage keys `stp-after-dark:progress:v1` and `stp-after-dark:preferences:v1`, each with an internal schema version and content revision. Bound payload size at 32 KiB per key before parsing; truncate nothing silently. Validate enumerations, known IDs, speeds, and finite 0–1 volume values. Preserve valid preferences if progress fails, and valid progress if preferences fail. On a storage write failure, stop automatic write attempts for that document; the next page may try again. No cookies or persistent pageview history are needed.

Bookmarks are block-based, not pixel offsets. On a fresh direct entry, store the first readable block; an explicit valid narrative-block fragment overrides it, while an evidence fragment preserves the stop's narrative bookmark. After intentional scrolling settles, save the last narrative heading at or above the reading area's top (or the first block if none has passed it); passing through evidence or a related-link area does not replace it with an evidence/source ID. Flush a pending valid update on deliberate navigation if storage works. Browser-restored pages re-read storage without overwriting a newer bookmark merely because an old page is visible.

Treat the per-entry transfer cap as the aggregate gate. Planning allocations are 850 KB scene/map imagery, 250 KB fonts, 250 KB HTML/CSS/JavaScript, and 150 KB reserve; these are decimal bytes and may be traded within the total. Critical imagery loads promptly with explicit dimensions; below-fold evidence images load only when needed. Initial compressed JavaScript should target at most 80 KB. Do not ship the complete research corpus or all audio metadata/files to every stop. A missing optional enhancement must not disable working native links or evidence disclosures.

### R9. Present-day place context

Every stop separates three independent facts: **location precision** (`exact`, `approximate`, `unknown`), **site condition** (`extant`, `altered`, `demolished`, `unverified`), and **access** (`public`, `private`, `restricted`, `unknown`). A site can be demolished and precisely located, or extant with unknown access. The on-location section is secondary to the complete remote experience.

Exact event-site geometry needs evidence of the historical footprint; a current business address alone is insufficient. A contextual landmark needs a source establishing that landmark's position and is labeled **Context location**, even when its own position is exact. Approximate geometry needs a source-backed area and a visible **Approximate area** treatment, not an ordinary exact pin. Unknown geometry is absent and the stop appears in the unplaced list. Never use a centroid or present-day venue to imply the precise kidnapping location.

Only show an external map link after checking its destination and whether it represents the event site or a contextual landmark. Label private residences and restricted interiors appropriately. Do not imply public entry, an accessible entrance, current opening hours, or a walkable connection without current supporting information. Unknown access information is stated plainly. GPS tracking and turn-by-turn routing are outside this edition.

The finished map must include checked positions for at least the hotel, caves venue, and former courthouse, labeled as venue/context positions with supporting geography. Other stops may remain approximate or unplaced when honest qualification is the best available result. This gives the map a meaningful geographic function without requiring invented event pins. All seven remain in the list. This threshold is a production requirement, not a claim that the current research has supplied these coordinates.

### R10. Definition of impressive

The first polished scene is **The Arrangement**. It must demonstrate the opening transition, location art, readable story, three-condition comparison, both E01/E02 evidence items, M01, one reviewed introduction recording, map/list navigation, and Calm view before its visual pattern is extended to all seven locations. This is a quality reference, not permission to stop at a one-scene demo.

The finished edition must have seven recognizable compositions, consistent typography, purposeful transitions, complete evidence views, and a satisfying epilogue. Original scene illustration supplies the atmosphere; stock cards, placeholder photographs, and decorative particle effects cannot substitute for it. Review the same scenes with sound and motion off: they should still communicate place, tension, and hierarchy.

| Completion evidence | Minimum required observation |
| --- | --- |
| Visual treatment | Each scene has its specified Saint Paul setting, focal composition, readable typography, intact mobile crop, and visible evidence controls in both normal and Calm views. Art has been compared with its identified place references; invented details remain labeled. |
| Complete edition | Prologue, seven stops, epilogue, fourteen-to-twenty-one evidence items, source index/credits, casebook, seven narration tracks, and any included ambience are present. No broken controls, draft copy, missing media, or unresolved required asset reviews. |
| Reliable access | The core paths in the verification table below work, including a quiet return after interruption. Unverified device/assistive-technology combinations are named explicitly. |
| Historical integrity | Material claims have passage-level support or visible qualifications; person-specific court outcomes and location precision are reviewed; content gate passes. |

If production exceeds the burst window, simplify layering, remove optional ambience beds, or use fewer unique transition treatments first. Keep all seven stories, readable equivalents, historical qualifications, and recovery behavior. Do not silently call a one-stop prototype or missing-narration build the finished edition. Completion is a local product state and never authorizes publication.

### R11. The metagames behind the events

Each stop includes one concise **Reading the metagame** explanation accessible in the ordinary reading route. It identifies the actors, what they sought, the leverage or rule they used, the expected benefit, who bore the cost, and a documented response or a stated limit of the evidence. Aims may be documented or inferred, but that distinction must be visible. Coerced victims are not described as consenting participants.

Use the seven source-bound interpretations in [history.md](history.md) and their [audit](research.md#metagame-audit) as the initial editorial baseline:

| ID / stop | Mechanism to investigate | Evidence boundary |
| --- | --- | --- |
| M01 / 1 | Conditional refuge, intermediaries, incentives to preserve the arrangement | No claim of universal police complicity, public consent, or a crime-free city. |
| M02 / 2 | Financial relationships and influence over jurors | Distinguish specific court findings from broad reputation; no unsupported hotel complicity. |
| M03 / 3 | A distinctive nightclub competing for attention | Documented venue history does not establish a criminal strategy or famous visitors. Date later legend separately. |
| M04 / 4 | Immediate ransom versus the wider costs of violating local restraint | Interpret incentives without inventing private deliberations or treating a victim as a payoff token. |
| M05 / 5 | Target selection and coercive control over the family's response | Attribute investigative reconstructions; distinguish a demand from actual compliance. |
| M06 / 6 | Concealment, observation, and limits of local refuge | No assumed apartment-specific protection agreement, paid informer, or invented motive. |
| M07 / 7 | Exposure, adjudication, and appointment/tenure rules | Explain concrete institutional mechanisms without claiming all corruption ended. |

Every factual premise links to checked claims. The analysis is labeled **Tour explanation / Interpretation**, even when its premises are supported. A relationship diagram distinguishes documented contacts from analytical connections; arrows must not silently assert a payment, order, or causal relationship. Explain observations that limit the interpretation alongside those that support it.

Historical outcomes remain fixed. No numerical payoff matrix, optimization challenge, hidden-mastermind reveal, or invented secret is required. The purpose is to understand power and constrained choices. A visitor can read the complete analysis without solving a puzzle, manipulating a diagram, or opening optional evidence. Its short version is included in the relevant introduction when essential to that stop's meaning; final narration must match the reviewed text.

### R12. Technical foundation and local build interface

Choose **Astro static output, strict TypeScript, plain CSS and native browser APIs**. Astro's page routing supplies independent HTML documents; its schema-validated content collections can load the local JSON records. Use a separate cross-record/content gate for rules schemas alone cannot express. No React/Vue runtime, state-management package, animation library, map SDK, server adapter, database or external API is required. [Astro pages][astro-pages]; [content collections][astro-content].

Implementation amendment: use the tested Node 22.22.3 patch recorded in `.nvmrc` and npm. Node 24 is an allowed upgrade path in `package.json`, but has not been tested in this remediation. Keep the lockfile and tested direct tool versions. Astro’s current package engine requires Node 22.12 or later. [Astro prerequisites][astro-install].

| Implemented project area | Responsibility |
| --- | --- |
| `src/pages/`, `src/layouts/` | Thirteen content routes, explicit static 404, common navigation/metadata and reading shell. |
| `src/data/`, `scripts/content-schema.mjs`, `src/lib/catalog.ts` | JSON records, Zod schemas and edition manifest; no fetched live content. |
| `src/components/`, `src/styles/` | Scene, disclosure, comparison, sequence, relationship list, map/list and audio controls; one shared set of design tokens. |
| `src/scripts/`, `src/lib/` | Independent enhancements for storage, audio, evidence/selection and Resume; small shared validators/state helpers. |
| `src/assets/`, `public/media/`, `public/licenses/` | Reviewed image sources, optimized derivatives, audio exports and notices. Large editable masters may live under a non-published `production/` directory. |
| `scripts/`, `tests/` | Content/media gates and targeted unit/browser checks. Generated reports identify the content revision and observed environment. |

This names responsibilities, not a requirement to create empty folders or a plugin architecture. Each browser enhancement initializes independently: an audio error cannot disable evidence or navigation; a storage error cannot block the page. Essential navigation is native HTML. Theme/Calm initialization is tiny and fails to the readable static design. Browser JavaScript receives only the fields it uses, not whole archival records or the build-time content loader.

The implemented build interface exposes these commands. `build:preview` writes visibly labeled draft output to `dist-preview/`; production output is separate:

| Command | Contract |
| --- | --- |
| `npm run dev` | Local work-in-progress preview; draft media/reviews allowed with visible labeling, invalid/unsafe structure rejected. |
| `npm run check` | Type checking plus structural/cross-record checks; success establishes structure only. Report missing production evidence separately; the full production gate is part of build. |
| `npm run test:unit -- <file>` | Run the selected Vitest file for content, storage or audio-state behavior. |
| `npm run test:browser -- --grep <scenario>` | Run selected Playwright scenarios against local output; no paid or external services. |
| `npm run build` | Require full production content/media validation, then write only successful static output to `dist/`. A failed gate must not leave an output that appears newly accepted. |
| `npm run preview` | Serve `dist-preview/` locally; show its edition/revision. `preview:production` serves a separately accepted `dist/`. Neither guarantees agreement with unbuilt changes. |

Use root-relative routes with directory index output and a real 404 on a compatible static host. Record base-path assumptions in the eventual README; v1 targets an origin root, not arbitrary subfolder installation. Per-page title and description derive from the stop/edition; there is no invented live domain, review rating or business listing. Build and runtime make no historical-source fetches. Package installation is the only expected network-dependent setup step once local media is present. Static-host deployment is portable and remains a separately authorized action. [Astro deployment output][astro-deploy].

### R13. Editorial production, assets, and readiness

The history is the source-backed starting point, not a file to paste verbatim into the interface. During production conversion, remove author-facing directions such as instructions about what an illustration should do. Preserve the actual historical boundaries in visitor language. Display a concise reconstruction/uncertainty note beside the material it qualifies, rather than surrounding every paragraph with process instructions. Source IDs and validation fields belong in the source/evidence layer, not in the main story's sentences.

Before recording, verify that each introduction works when heard alone, includes any material attribution, and matches its visible text. Keep the 120–180 word/60–90 second targets flexible enough for clear names and dates. Pronunciation notes for people and places belong in a production record with the basis used; listen to the rendered result. A synthetic or human narrator is credited accurately. The exact voice is an asset-production choice within the local-production default, not an unfinished product behavior or permission to buy a provider.

| Required deliverable | Production and review requirement |
| --- | --- |
| Seven scene masters and responsive derivatives | Use R3 compositions. Keep a reference list and interpretation note per scene. Prefer original illustration; if generated, retain the prompt/origin and inspect architecture, human details and misleading document-like elements. Export WebP in approximately 640/1280/1920 px widths as appropriate, with actual dimensions and crop focal point. Do not upscale a small source merely to meet a number. |
| One SVG city overview | Sourced base geography, three checked venue/context positions required by R9, honest unknowns and a complete list. Keep geographic and conceptual relationship diagrams visually distinct. |
| Fourteen evidence presentations | Each can be complete as an original text/diagram treatment. An archival image is optional unless the item's actual argument depends on its visual detail; that case requires the image or a revised truthful treatment. No mandatory hunt for fourteen archival scans. |
| Seven narration tracks | Keep a lossless local master and a broadly playable MP3 export, target at most 2 MB per introduction. Record duration, transcript digest, audio digest, voice/origin and reuse basis. Listen once through every final track for wording, pronunciation, clipping, missing/duplicated speech and consistent level. |
| Zero to two initial ambience beds | Original or licensed, reusable across stops with no startling cue or intelligible speech. Include a third only if it adds a distinct setting. Verify seams/level and preserve rights/credits; absence of optional ambience is not unfinished content. |
| Fonts and credits | The three local WOFF2 files in R3, notices, and complete source/art/audio credits. Confirm the actual asset files match their origin and rights records. |

Review records name the file/content revision, method, reviewer (agent or human), date and result. A deterministic hash/schema check records consistency; a visual comparison records what was seen; a listening review records what was heard. None is silently renamed Ryan's approval. Recheck only changed material and dependencies, not the entire historical corpus after a spelling or layout adjustment.

| Readiness state | Required evidence |
| --- | --- |
| **Specification ready for planning** | Behavior, scope, data, scene/interaction inventory, production defaults and acceptance rules are specified. Historical gaps have explicit safe dispositions. This is the present deliverable, subject to Ryan's review. |
| **Local reading preview** | All seven sourced text routes, map/list and evidence are navigable. Missing production assets are clearly marked; this state fails the full production gate. |
| **Complete local edition** | All required media and source/rights reviews, geographic minimum, fourteen-to-twenty-one evidence items, seven metagames, matching narration, and the required behavior/performance checks pass. Any untested device/assistive-technology coverage is named; no known failure of a mandatory requirement is waived. |
| **Published edition** | A complete local edition plus Ryan's explicit authorization for the specific publication action and host. Completion alone never authorizes it. |

Actual footprint/source acquisitions remain production evidence to collect, not reasons to invent facts or expand the edition. If a room-specific reference is unavailable, retain an explicitly interpretive room; if an archival image is unavailable, use the reviewed summary; if an event point is unknown, retain its context/unplaced treatment. Required scenes, narration, readable evidence, minimum map geography and accessibility behavior cannot be replaced by completion language.

## Acceptance Criteria (EARS style)

- **AC01 — Entry:** WHEN the landing page opens, the system SHALL show Begin, Map, sound state, and Calm view without requiring an animation, permission prompt, or form.
- **AC02 — Guided route:** WHEN Begin is activated, the system SHALL enter the prologue and provide a continuous route through exactly seven stops and the epilogue.
- **AC03 — Free exploration:** WHEN a named map pin or its list equivalent is activated, the system SHALL open the same stop without prerequisites.
- **AC04 — Complete stops:** WHEN a stop opens, the system SHALL provide its period, synopsis, distinct finished scene, narrative, two or three evidence items, sources, and continuation controls.
- **AC05 — Scene parity:** WHEN a scene hotspot is available, the system SHALL expose the same action as a visible labeled list control operable by keyboard and voice control.
- **AC06 — Evidence:** WHEN evidence is opened, the system SHALL show its readable content, provenance, source, and any material uncertainty, then record it once in the casebook.
- **AC07 — History:** IF a claim is disputed or unverified, or its presentation uses legend or reconstruction, THEN the system SHALL include the applicable qualification wherever it appears and SHALL NOT silently promote it to fact.
- **AC08 — Choice:** WHEN a visitor follows a relationship or skips evidence, the system SHALL change the exploration path without changing historical outcomes or blocking continuation.
- **AC09 — Navigation:** WHEN a stop URL is loaded directly or reached through Back/Forward, the system SHALL restore that stop without autoplay; IF the URL is unknown, THEN it SHALL offer the map as recovery.
- **AC10 — Quiet start:** WHEN a page is freshly loaded, the system SHALL remain silent until explicit audio activation; WHEN muted, it SHALL silence narration and ambience immediately.
- **AC11 — Playback:** WHEN narration starts, the system SHALL expose its matching text, pause and speed controls, stop other narration, and lower enabled ambience or apply the R3 no-mixing fallback; WHEN leaving the stop, it SHALL stop that narration.
- **AC12 — Reduced effects:** IF reduced motion is requested by the operating system, THEN the system SHALL suppress nonessential motion before rendering; WHEN Calm view is enabled, it SHALL also remove decorative texture and stop ambience without losing content.
- **AC13 — Accessible operation:** WHEN the tour is traversed by keyboard, the system SHALL expose every action with visible focus, logical order, no unintended trap, and predictable focus for inline evidence, comparison controls, and reset confirmation.
- **AC14 — Size and reflow:** WHEN viewed at 320 CSS pixels or with enlarged text, the system SHALL preserve readable content and operable controls; main controls SHALL retain their specified target sizes and contrast.
- **AC15 — Equivalents:** IF audio, illustrations, or the graphical map are unavailable or unused, THEN the system SHALL preserve the same historical content and route through text and ordinary controls.
- **AC16 — Resume:** WHEN a returning visitor selects Resume with valid saved state, the system SHALL restore their bookmarked narrative page/block with a context reminder, inspected evidence, and preferences without restarting audio.
- **AC17 — Storage failure:** IF saved state is corrupt, obsolete, or unwritable, THEN the system SHALL recover usable state or a fresh session, explain any loss of saving, and keep navigation functional.
- **AC18 — Reset:** WHEN Start over is confirmed, the system SHALL clear tour progress while preserving accessibility preferences; cancellation SHALL preserve progress.
- **AC19 — Media failure:** IF a media request fails, THEN the system SHALL retain text, source links, and continuation, with a retry action for the failed media.
- **AC20 — Content gate:** WHEN production content is validated, the build SHALL reject the invalid or incomplete records enumerated in R6 with an actionable ID/field/reason report; an incomplete preview SHALL NOT pass that gate.
- **AC21 — Place honesty:** IF a place is approximate, private, demolished, or not verified, THEN its map and visit context SHALL state that status and SHALL NOT invent present-day access assurances.
- **AC22 — Completion:** WHEN the epilogue is reached, the system SHALL explain the protection system and its unraveling, allow revisiting all seven stops, and offer uninspected material without penalizing the visitor.
- **AC23 — Performance:** WHEN the R8 cold-load checks are run on the production build, the application SHALL meet its transfer cap and median LCP/CLS budgets under the recorded profile and SHALL make no audio request before explicit activation.
- **AC24 — Finished edition:** WHEN the edition is declared complete, it SHALL contain all seven finished scenes and narration tracks, the complete casebook/map, sourced copy, and the epilogue, with no placeholder interactions or media.
- **AC25 — Reading fallback:** IF JavaScript fails or is disabled, THEN the static pages SHALL expose the complete narrative, evidence text, citations, and ordinary route links, with an explanation of unavailable enhancements.
- **AC26 — URL precedence:** WHEN a direct stop/evidence URL opens with a conflicting saved bookmark, the system SHALL honor the URL, open valid evidence with JavaScript (or expose its native summary without it), and recover an invalid fragment at that stop; it SHALL NOT redirect to the bookmark.
- **AC27 — Bookmark protection:** WHEN the visitor opens Map, Casebook, Sources, or an evidence disclosure, the system SHALL retain the narrative bookmark; WHEN Begin is used, it SHALL preserve collected progress; WHEN Start over is confirmed, it SHALL clear only the tour's progress keys.
- **AC28 — Audio lifecycle:** WHEN Mute, Calm view, page visibility, interruption, or playback failure changes the audio state, the system SHALL follow the R3 event table and SHALL require explicit activation to resume a stopped channel.
- **AC29 — Casebook states:** IF no evidence is inspected, THEN the casebook SHALL explain how to add it and offer the map; WHEN an item is reopened, it SHALL remain a single entry with a working link to its source stop.
- **AC30 — Content changes:** IF introduction text changes without a matching reviewed narration revision, THEN production validation SHALL fail; WHEN an obsolete saved block or item is encountered, the system SHALL apply the R8 recovery rule without losing unrelated valid state.
- **AC31 — Unplaced locations:** IF a stop has unknown geometry, THEN the map SHALL omit its geographic marker and expose it in the unplaced list and seven-stop route; IF its geometry is approximate or contextual, THEN both map and text SHALL show that qualification.
- **AC32 — Data boundaries:** IF stored fields, URL IDs, or imported text contain invalid values or markup, THEN the system SHALL reject or escape them without executing them, following unapproved links, or clearing other applications' data.
- **AC33 — Quiet network:** WHEN any tour page is loaded and used without activating an external link, the system SHALL serve its required content/assets locally and SHALL make no third-party tracking, font, map, or source-fetch request.
- **AC34 — Reading and control presentation:** WHEN text spacing is overridden, forced colors is enabled, or visible-label voice control is used, the system SHALL retain readable content and identifiable, operable controls without a pointing-only fallback.
- **AC35 — Metagames:** WHEN any stop is read, the system SHALL expose its source-bound metagame explanation with actors, aims, mechanism, benefits/costs, and an observed response or evidentiary limit; it SHALL distinguish documented conduct from inferred motives and later memory, and SHALL make the same analysis available without interactive diagrams or puzzles.

- **AC36 — Scene presentations:** WHEN any R2 comparison or sequence control is selected, the system SHALL visibly identify that selection without changing the historical account, losing its qualifications, or removing the complete text alternative; IF enhancement is unavailable, THEN the static comparison SHALL remain readable.
- **AC37 — Complete casebook:** WHEN the casebook is opened empty, populated, or without saving capability, it SHALL provide the corresponding R5 state, the full evidence catalog, and all relevant people/relationships without collection prerequisites.
- **AC38 — Context return:** WHEN a person/source destination has a valid originating stop ID, it SHALL offer the R5 return link without replacing the reading bookmark; IF the ID is invalid or JavaScript is unavailable, THEN Map SHALL remain available and no arbitrary return URL SHALL be followed.
- **AC39 — Static output:** WHEN the production build succeeds, it SHALL emit the thirteen R4 content routes and a 404 document with local assets and direct-entry reading content; IF production validation fails, THEN it SHALL NOT represent stale or partial output as a newly accepted build.
- **AC40 — Content model:** WHEN a factual/interpretive block or attributed claim is rendered, it SHALL resolve its R6 premise references and required attribution/qualification; IF those records are missing or invalid, THEN production validation SHALL fail.
- **AC41 — Media revisions:** IF a narration transcript, audio file, or required reviewed media revision changes, THEN its previous affected review SHALL become stale and the production gate SHALL require a matching review record.
- **AC42 — Asset delivery:** WHEN a scene is displayed, it SHALL use a reviewed responsive export with dimensions and a meaningful crop/text equivalent; WHEN audio is requested, it SHALL use the matching reviewed local recording and expose loading/failure/end states.
- **AC43 — Geographic minimum:** WHEN the edition is declared complete, the map SHALL include checked venue/context geometry for the hotel, caves and courthouse, plus all seven list entries; unsupported event geometry SHALL remain approximate or unplaced as evidence permits.
- **AC44 — Failure isolation:** IF audio, storage or a selection enhancement fails, THEN other controls and the complete native reading/evidence route SHALL remain usable; the system SHALL explain the affected capability without claiming unrelated progress was lost.
- **AC45 — Production copy:** WHEN an edition passes the production content review, its story and narration SHALL contain visitor-facing prose with material historical qualifications, matching spoken text, complete credits and no authoring instructions or placeholder media presented as finished.

Verification during implementation should target changed behavior and the criteria it affects. At the final integration stage, cover the guided route, free exploration, interrupted-session recovery, and reduced-effects route. Include bounded visual, keyboard, and screen-reader checks; distinguish observed behavior from untested assistive technology. Give Ryan copyable commands for full suites or long-running checks instead of running them repeatedly. A documentation-only spec draft needs no application test run.

| Verification slice | Criteria and meaningful evidence |
| --- | --- |
| Content validation | AC04, AC07, AC20, AC24, AC30–31, AC35, AC40–41, AC45: validate all authored records; use focused invalid fixtures for broken references, missing qualifications, stale narration, and unsupported geometry. Review seven metagame explanations for premise support, limits, and temporal separation. Passage/art/rights review remains separate from a schema pass. |
| Journey and evidence | AC01–09, AC22, AC26, AC29, AC36–38: guided route, direct entry into stop 5, one cross-stop relationship and return, all four presenter types, empty/reopened casebook, invalid return ID, Back/Forward, invalid path/fragment. |
| Progress and failure recovery | AC16–19, AC27, AC30, AC32, AC44: refresh at a block, navigate through the map, deny storage, corrupt one field, supply obsolete IDs and an unknown schema version, cancel/confirm reset, and fail a media request. |
| Audio and reduced effects | AC10–12, AC28, AC41–42: cold load, play/pause/restart, switch stops, mute/unmute, Calm on/off, rejected playback, hide/restore the tab, and restore a browser history entry. Check actual silence, level changes and the no-mixing fallback as well as control labels. |
| Accessible reading and operation | AC05, AC13–15, AC25, AC34: keyboard-only route, native evidence disclosure, comparison selection and inline reset confirmation, voice activation by visible label, screen-reader landmarks/headings/statuses, 200% text, 320-pixel reflow, text spacing, forced colors, blocked images, and JavaScript disabled. |
| Delivery and visual finish | AC21, AC23–24, AC31, AC33, AC39, AC42–43: inspect all seven desktop/mobile compositions once, network/byte audit, recorded performance runs, and source-backed place labels. |

Record browser and OS versions at verification time. Use desktop Chromium and Safari, iOS Safari, and a Firefox reading/navigation check as the compatibility baseline. Prioritize Ryan's actual browser and voice-control combination when known; do not make him repeat broad manual audits. One bounded VoiceOver/Safari and visible-label voice-control pass establishes observations for those combinations, not every assistive technology. Preserve observed failures and limitations rather than treating a scanner score as conformance or user acceptance.

## Out of Scope

- A playable criminal career, combat, alternate history, morality scoring, branching historical outcomes, or a chatbot speaking as a real person.
- A fully modeled 3D city, WebXR, augmented reality, mandatory WebGL, or a film-length production.
- GPS collection, geofenced unlocks, navigation while driving, route optimization, transport booking, or a claim that all stops form one accessible walking route.
- Accounts, social feeds, comments, competitive collectibles, leaderboards, payments, tickets, subscriptions, advertising, or commercial analytics.
- A CMS, backend, runtime content generation, cloud progress sync, service worker, full offline/PWA support, client router, pan/zoom map, or evidence modal/drawer.
- Full-length audio narration of every evidence item, custom speech recognition, a search interface, multilingual editions, and cross-tab progress synchronization.
- Additional cities, unlimited historical content, or more than seven core stops in the first edition.
- Fabricated period broadcasts, unsourced quotes, misleading archival imitations, and unsupported claims about who visited a place.
- Deployment, publication, or any stage/commit/push action under this documentation request.

## Decisions, remaining evidence, and revision record

The October 3 historical baseline remains in [history.md](history.md) and [research.md](research.md): sixteen sources, thirty claims, seven metagame interpretations and fourteen evidence treatments. This specification revision does not claim a new historical check or promote uncertain locations, cave attendance or exact courtroom associations to fact.

**Product decisions are now made:** seven fixed stops; four reusable evidence/interpretation presenters; static Astro/TypeScript/JSON; full-document navigation; inline disclosures; complete casebook catalog; local progress; Barlow Condensed/Source Sans typography; seven original scene compositions and recordings; optional ambience; and explicit production gates. R12 fixes the build interface and R13 fixes what qualifies as finished.

**Remaining evidence and execution:** obtain geographic support for the three required venue markers, preserve honest treatment of other locations, produce/review media, convert the researched prose into visitor copy, and verify the implemented behavior. Exact dependency patches and narrator voice are recorded during their bounded implementation/production steps. Hosting credentials, provider purchases and publication are not assumptions needed to finish this spec.

**Revision 0.4 — October 5, 2026:** develops scene interactions and responsive art direction, resolves navigation/disclosure choices, defines casebook/source return behavior, chooses the static stack, tightens content/media revision checks, and adds R12–R13 plus AC36–AC45. AC13/AC26/AC27 are reconciled with inline disclosures; existing IDs retain their original intent. The earlier draft's all-unplaced map remains a valid preview; a complete edition now requires the three specified venue positions.

The next phase is a short implementation plan and bounded tasks derived from this contract. This request completes the specification; it does not create application files, install dependencies, produce art/audio, initialize Git, or publish. Ryan can review or change these defaults without being asked to retype the history. A structural documentation check establishes consistency, not implementation or personal acceptance.

## Technical references

These official project/browser references were checked October 5, 2026 to support the selected approach. They are implementation references, not additions to the historical source count.

- [Astro pages and static routing][astro-pages], [content collection validation][astro-content], [runtime prerequisites][astro-install], and [static deployment output][astro-deploy].
- [MDN native disclosure behavior][html-details] and [media volume compatibility][media-volume].
- [Barlow OFL notice][barlow-license] and [Adobe Source Sans OFL notice][source-sans-license]. Keep the notices accompanying the actual chosen font files.
- [WCAG 2.2][wcag], [target size][targets], and [contrast][contrast] inform R7; satisfying individual checks is not conformance certification.

[wcag]: https://www.w3.org/TR/WCAG22/ "W3C: Web Content Accessibility Guidelines 2.2"
[targets]: https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum "W3C: Understanding Target Size (Minimum)"
[contrast]: https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html "W3C: Understanding Contrast (Minimum)"


[astro-pages]: https://docs.astro.build/en/basics/astro-pages/ "Astro: Pages"
[astro-content]: https://docs.astro.build/en/guides/content-collections/ "Astro: Content collections"
[astro-install]: https://docs.astro.build/en/install-and-setup/ "Astro: Installation prerequisites"
[astro-deploy]: https://docs.astro.build/en/guides/deploy/ "Astro: Deployment output"
[html-details]: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/details "MDN: Native disclosure element"
[barlow-license]: https://github.com/jpt/barlow/blob/main/OFL.txt "Barlow: SIL Open Font License"
[source-sans-license]: https://github.com/adobe-fonts/source-sans/blob/release/LICENSE.md "Source Sans: SIL Open Font License"
[media-volume]: https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/volume "MDN: Media volume compatibility"
