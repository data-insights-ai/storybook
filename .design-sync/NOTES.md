# design-sync notes

Repo: datAInsights Storybook (public: https://github.com/data-insights-ai/storybook)
Target project: "datAInsights Register" (`50fa49a6-04d7-435a-8d5c-567ff7cc04e7`)

## Run 2026-09-24 (first completed sync)

- A previous run on 2026-09-23 aborted mid-flight. It left an **un-anchored**
  project (30 components, no `_ds_sync.json`) and empty local scaffolding
  (`.ds-sync/`, `ds-bundle/`). User chose to re-adopt that project rather than
  create a fresh one, so this run takes the **atomic** upload path.
- The uploaded state predated commit `07bdc3c` ("slot-based component API"):
  `SealValue` no longer exists (now `Primitives/Seal`), and Bars, Breadcrumb,
  Pagination and Stepper moved from Blocks to Primitives. The end-of-run
  reconciliation must delete those stale paths.
- `.ds-sync/` and `ds-bundle/` were **not** gitignored. Added, because this
  repo is public and both hold build output.
- Package manager is pnpm (`pnpm@12.5.1`, `engines.node >=22.12.0`).
  Install with `pnpm i --frozen-lockfile`.

## Environment quirk: pnpm 12.5.1 native binary

`pnpm i` failed with `Failed to switch pnpm to v12.5.1 ... Unknown system error -8`.
Cause: pnpm 12 ships a **native binary** installed by a build script. In
`~/Library/pnpm/.tools/pnpm/12.5.1/` that script had been skipped, so
`node_modules/pnpm/pnpm` was still the shebang-less `sh` placeholder — and macOS
returns ENOEXEC (-8) when a program spawns that path directly.

Fix (idempotent, safe to re-run):

```sh
P=~/Library/pnpm/.tools/pnpm/12.5.1/node_modules/pnpm
node $P/bin/pnpm.mjs --version   # fetches the @pnpm/exe.<target> package
node $P/install.js               # relinks the native binary over the placeholder
```

Afterwards `file $P/pnpm` reports `Mach-O 64-bit executable arm64` and the
version switch works.

## Converter setup (what made the build clean)

- **`package.json` had no top-level `types`** — only `exports["."].types`. The
  converter's `findTypesRoot` reads `pkgJson.types`/`typings` (then probes
  `dist/` for a *direct* `.d.ts`, which `dist/lib/*` doesn't satisfy), so it fell
  back to the repo root, found no entry, and enumerated **0 exports** — which
  surfaced misleadingly as `[TITLE_UNMAPPED] 64`. Added
  `"types": "./dist/lib/index.d.ts"`. This is also a genuine packaging fix:
  without it the package is invisible to `moduleResolution: node` consumers.
  There is no config knob for the types root — do not remove the field.
- **`cfg.cssEntry: "dist/lib/styles.css"`** is essential. Without it the bundle
  shipped component CSS only: no token layers, no base, no fonts →
  `[TOKENS_MISSING]` for 136 `--di-*` vars and `[RENDER_THIN]` on IconTile and
  Sparkline. `dist/lib/styles.css` (written by `scripts/build-styles.mjs`) is the
  flattened stylesheet: `@font-face` + primitive/semantic/component + base.
  Setting it fixed all of those at once.
- **`cfg.titleMap` keys are title SEGMENTS, not full titles**, and the card group
  is the segment *before* the matched one — so `Blocks/Inference/Confirm` →
  export `ConfirmPanel`, group `inference`. Renames needed: Confidence→
  ConfidenceField, Confirm→ConfirmPanel, Explain→ExplainPanel, Privacy→
  PrivacyBadge, Seal→SealValue, Skeleton→SkeletonTable, AppShell→Console.
- **Excluded via `titleMap: null`**: `Foundations/*` (Adoption, Color, Logo,
  Type — doc pages with no component) and `Screens/*` (Architecture, Coverage,
  Inference, Login, Register, Settings, Watchlist). The screens are real
  components under `src/screens/` but are deliberately **not** exported from
  `src/index.ts`, so they are not in the bundle. See Re-sync risks.
- **`cfg.overrides`**: Modal `cardMode: "single"` + `primaryStory: "Confirm"`
  (fixed/portal stories escape their grid cells); Session and Tabs
  `cardMode: "column"` (stories wider than a grid cell); FieldHint
  `skip: ["forms-fieldhint--empty"]` — that story renders nothing *by design*
  ("Empty text renders nothing at all"), and it landed as `roots[0]`, tripping
  the validator's `rootEmpty` check. Skipping it is cosmetic only; the API is
  still documented in the `.d.ts` and `.prompt.md`.

## Decorators are NOT bundled — and that is fine here

`! preview decorator bundle failed: No loader is configured for ".woff2"` —
`.storybook/preview.tsx` imports `../src/styles.css`, which `@import`s fontsource
CSS, which references `.woff2`. The decorator bundler hardcodes
`loader: {'.js':'jsx','.json':'json'}` and does **not** read
`cfg.storyImports.loaders`, so no config knob reaches it.

No `cfg.provider` is set, deliberately — the decorators provide only:
1. `withThemeByDataAttribute` setting `data-theme="light"`. This DS defines light
   as the bare `:root` default and remaps dark under `[data-theme="dark"]`, so
   the light previews need no attribute at all.
2. A `<main>` + visually-hidden `<h1>` wrapper (`StoryCanvas`). That is storybook
   a11y scaffolding and must **not** ship to designs.

There is no provider component in this DS to distill — theming is a CSS
attribute, not React context. Confirm this by eye in the compare loop rather
than assuming it.

## [GENERAL] Cascade-layer order — a real bug in the published package

**Symptom.** Every component rendered with the wrong text colour. Most visibly
`Button` Primary: the navy fill was right but the label was navy-on-navy and
therefore invisible. Measured `color` was `rgb(10,31,68)` on *all six* Button
variants — Danger should be `#8A1B1B`, Seal `#7A5C0E`.

**Root cause.** CSS cascade-layer order is fixed by the **first** `@layer`
statement a document sees. Each component stylesheet opens with
`@layer components {`, while the order statement
`@layer tokens, base, components, overrides;` lived only at the top of
`src/styles.css`. In the sync bundle the component CSS is concatenated first, so
`components` registered first and `tokens`/`base`/`overrides` were appended
*after* it — inverting the cascade. `src/styles/base.css` has
`button, … { font: inherit; color: inherit; }`; with `base` now outranking
`components`, that reset beat `.di-btn-primary { color: … }`. Layers trump
specificity, so nothing in the component sheet could win.

**This is not only a sync artifact.** `dist/lib/components/*.css` is what
products consume, and `sideEffects`/tree-shaking means a product importing only
`Button` never loads `styles.css` at all — so it would hit the same inverted
cascade in production. Storybook hid it because `.storybook/preview.tsx` imports
`src/styles.css` first.

**Fix.** `scripts/build-styles.mjs` now prepends the order statement to every
component stylesheet as it emits `dist/lib/components/*.css`, reading it from
`src/styles.css` so the two can't drift (it fails the build if that statement
disappears). Repeating a `@layer` statement is idempotent — naming an existing
layer never reorders it.

**Do not "fix" this in design-sync config.** The converter always *appends*
`cfg.cssEntry` after the bundled CSS (`package-build.mjs`: "appended — bundle
already had CSS"), so the order statement can never reach the front from there.
It has to come from the component sheets themselves.

## [GENERAL] Dark theme cannot render as a local island — both NightSheet stories are skipped

`Primitives/Button` and `Primitives/StatusPill` each have a `NightSheet` story
carrying `globals: { theme: "dark" }`. Storybook turns that into
`data-theme="dark"` on `<html>` via `withThemeByDataAttribute`. The preview
decorators are not bundled here (see the decorator note above), so the global is
dropped and the story renders in daylight — showing a navy primary fill where
the whole point is that **after dark the fill turns gold**
(`--di-fill-strong: var(--di-gold-500)`, semantic.css:177).

**Why it can't be fixed with a wrapper.** The dark palette is scoped
`:root[data-theme="dark"]`, and `component.css` maps component slots through
semantic ones (`--di-button-primary-bg: var(--di-fill-strong)`) **at `:root`**.
A custom property's computed value is substituted on the element that declares
it, so those component tokens lock to the daylight values at `:root`.
Re-pointing semantic tokens on a descendant `<div>` therefore cannot reach them.
This was tried and measured: the ground went dark (`rgb(7,18,41)`) while the
primary button stayed navy and the secondary went near-white-on-near-white.
Dark mode in this DS is a document-root contract, by design.

**Why not set it on `<html>` from the story.** A component card is ONE document
with ONE React root holding every story cell, so that would darken all of them.

**Why not set it only under `?story=`.** Compare captures per story, so that
would grade `match` while shipping a card that is still wrong — gaming the
oracle. Rejected deliberately.

**What was done instead.** Both stories are skipped from the cards
(`cfg.overrides.Button.skip`, `cfg.overrides.StatusPill.skip`). The dark-mode
contract is documented in `.design-sync/conventions.md`, which is where it
actually reaches the design agent. If a future sync wants these cards back, the
only sound route is rendering that story into an iframe with its own document.

## [GENERAL] recharts must ride the bundle global — `cfg.extraEntries: ["recharts"]`

**Symptom.** Every `Blocks/Chart` story rendered an empty cell. No page errors,
no `[RENDER]` failure — the card even passed the render check, because the
`ChartConfig` `<style>` block and the `.di-chart` wrapper (with its aria-label)
mounted at the correct 560×240. Only the chart itself was missing: no `<svg>`.

**Root cause.** Two copies of recharts. `Chart.tsx` renders
`<ResponsiveContainer>` and ships inside `_ds_bundle.js`, while the story's
helper `src/foundations/guide/BrandCharts.tsx` imports `Area, Bar,
CartesianGrid, Cell, ComposedChart, Line, XAxis, YAxis` from `recharts`
directly. Preview compiles bundle the story module's own imports, so recharts
was bundled a second time into `_preview/Chart.js` (**1,010,288 bytes**).
recharts identifies its children by type, so `ResponsiveContainer` from the
bundle's copy did not recognise children built by the preview's copy and
rendered nothing — silently, which is why no check caught it.

**Fix.** `cfg.extraEntries: ["recharts"]` merges recharts into
`window.DataInsightsUI`, so the story's imports shim to the same instance the DS
bundle uses. `_preview/Chart.js` fell to **16,764 bytes** and the charts draw.

**Expected warning, do not "fix" it.** The build now prints
`[EXPORT_COLLISION] recharts exports 1 name(s) the main package also exports:
Tooltip`. The DS's own `Tooltip` primitive wins, which is correct here: no story
imports recharts' `Tooltip` (the only recharts imports in `src/` are Area, Bar,
CartesianGrid, Cell, ComposedChart, Line, XAxis, YAxis, plus two type-only
imports). Do **not** apply the suggested `cfg.storyImports.bundle: ["recharts"]`
— that re-creates the duplicate instance and blanks every chart again. Re-check
this if a story ever starts importing `Tooltip` or `Legend` from recharts.

**Generalises:** any package the DS uses internally *and* a story imports
directly needs the same treatment, or the duplicate instance breaks anything
that inspects child component types.

## Solo phase results (verified before fan-out)

Graded exhaustively from images: Button (13 stories), Chart (4), DataTable (7),
Icon (3), Modal (2). All `match` except `Modal/Transition` (`close`, see below).

- Fonts are real on both sides (Space Grotesk + JetBrains Mono ship as woff2 via
  `cfg.cssEntry`); no `[FONT_MISSING]`. DataTable is the canary — its mono
  hashes and timestamps render in JetBrains Mono in both panels.
- A **rendered design** gets `background: #F4F1E8` (warm paper) and Space
  Grotesk from `styles.css`'s import closure — measured. The preview CARD page
  is white; that is card chrome, not a token failure, and it is why every sheet
  shows paper on the storybook side and white on the preview side. Ignore it.
- `Icon` reflows to a different column count in the preview (narrower
  container). Same icons, same styling — framing, graded `match`.
- `Modal/Transition` is `close`: storybook runs the story's play function and
  catches the opening backdrop; compiled previews never run play, so the preview
  shows the resting trigger button. Forcing `open` would photograph blank (top
  layer, root 0px).

## [GENERAL] Play-function stories are systematically `close`, and that is correct

Storybook runs a story's `play` function before photographing; compiled previews
**never** run `play`. So any story whose `play` clicks, types, selects or focuses
is photographed by storybook in its post-interaction state and by the preview in
its resting state.

**Signature** (learn it, so later waves don't chase it as a styling defect):
identical element geometry on both sides, plus a navy `#0A1F44` ring-shaped
pixel surplus on the storybook side only. Measured on `Chip/Active` (392 navy px
vs 282, same 132×28 bbox) and `Chip/Available` (45 px of outset ring the preview
lacks).

Confirmed on: `Modal/Transition`, `Checkbox/Checking`, `Radio/Selecting`,
`Switch/Toggling`, `SegmentedControl/Selecting`, `Chip/Active`, `Chip/Available`,
`SearchField/Default`, `TextField/Default`, `Select/Choosing`.

Grade `close` with the cause named. Do **not** hard-code the interaction result
into an owned preview: the resting render is what a design agent actually gets
from the component, so faking it would destroy the fidelity being verified. If
one ever must grade `match`, the only sound route is `cfg.overrides.<Name>.skip`.

## [GENERAL] FieldHint shipped unstyled — third real packaging bug, now fixed

`src/components/FieldHint.tsx` rendered `.di-field-hint` but imported **no
stylesheet**. That class is defined in `src/components/Field.css`, which only
TextField / Select / SearchField / ConfidenceField import. `dist/lib/components/
FieldHint.js` therefore had no CSS import at all, so a product tree-shaking
`FieldHint` out of `@data-insights-ai/ui` shipped it completely unstyled.

The compare oracle caught it because the **storybook side was the broken one**:
vite code-splits `Field.css` into a chunk the `Forms/FieldHint` story never
loads, while the preview loads the flattened `dist/lib/styles.css` and rendered
correctly. A preview that renders BETTER than the reference is still a finding.

Fixed: `src/components/FieldHint.tsx` now does `import "./Field.css";`.

**Audit result — it was the only one.** Every `src/components/*.tsx` was checked
for a side-effect import of the sheet defining each `di-*` class it renders. A
naive scan also flags DataTable, Notice (`di-mono`) and Seal (`di-tick-rule`),
but those are **false positives**: both classes are defined in
`src/styles/base.css`, which always ships via `styles.css`. Only scan
`src/components/*.css` and you will chase three ghosts.

## `[STORY_CAP]` — orchestrator decision for this sync

compare captures at most 6 stories per component by default. These exceed it, so
their tail stories are captured and graded only when the cap is raised:
Checkbox(7) Radio(7) Select(7) Switch(8) TextField(10) StatusPill(8, 1 skipped)
Panel(9) StatTile(7). Button was captured at 14 in the solo phase.
**This sync raises the cap for those components** — `TextField/AllStates` alone
exercises five field states, and the user asked for a full high-fidelity sync.
The cap is not part of the grade contract, so existing verdicts survive.

## Reading sheets for small components

Mark/label components are 20–30px tall and unreadable at contact-sheet scale.
Judge them from the raw PNGs (`_screenshots/compare/raw/*__sb.png` / `*__ds.png`)
recomposed side by side and zoomed; confirm exact token values by decoding the
PNG and counting pixels per colour. Also: a 1px repeating gradient (the 8px tick
rule) shows as broken clumps on a downscaled sheet — pure moire, not a bug.

## Result of this sync (2026-09-24)

64 components, 261 stories graded: **239 match, 22 close, 0 mismatch.** Validate
exited 0 with 64/64 previews rendering cleanly. Uploaded 335 files to
`datAInsights Register` and deleted 20 stale paths left by the aborted run
(the four components that moved from `blocks/` to `primitives/` in `07bdc3c`,
plus orphaned `tokens/*` — this build ships tokens inside `_ds_bundle.css`,
reachable through `styles.css`'s `@import` closure).

Every one of the 22 `close` verdicts is a play-function story (see the [GENERAL]
section above) except `Progress/Counting`, which is a live JS counter the two
panels cannot be captured at the same frame of.

Only one owned preview exists: `.design-sync/previews/Modal.tsx`. It exists
solely to keep `Confirm` on the Modal card after that story was skipped for the
oracle. Everything else uses generated previews.

## Re-sync risks — read this first next time

- **`--max-stories 12` is this sync's cap and it is part of the capture key.**
  Running a different cap re-captures and clears grades even for components whose
  story set is unchanged. Keep passing `--max-stories 12` or expect a full
  re-grade. Button is the only component with more (14): `All Variants` and
  `Night Sheet` are outside the cap. `All Variants` was image-verified by hand in
  the solo phase; `Night Sheet` is deliberately skipped.
- **A full `compare.mjs` run always `[SPOT_CHECK]`s two random carried-forward
  components** and reports them as `needs-grade`. That is the designed pipeline
  check, not a regression. Confirm the two sheets and re-record; do not chase it
  in a loop, and do not `--force`.
- **The three source fixes this sync made are load-bearing.** If
  `scripts/build-styles.mjs` stops prepending the `@layer` statement, every
  component's text colour breaks again (invisible Primary button label). If
  `package.json` loses top-level `types`, the converter enumerates 0 exports and
  reports a misleading `[TITLE_UNMAPPED] 64`. If `FieldHint.tsx` loses
  `import "./Field.css"`, it ships unstyled again.
- **`cfg.extraEntries: ["recharts"]` must stay.** Removing it silently blanks
  every chart with no error. The `[EXPORT_COLLISION]` warning it produces is
  expected; do not apply the fix the warning suggests.
- **Storybook's own static build cannot load the brand mark.** `Console/Chrome`
  and all four `SignIn` stories show a broken image on the STORYBOOK side while
  the preview renders it correctly (the package inlines the SVG as a
  `data:image/svg+xml` URI; the storybook build emits it as a separate asset
  whose relative URL 404s in the capture context). Graded `match` — the preview
  is the correct side. Do not "fix" the preview.
- **Screens are not synced.** `src/screens/*` are real components but are not
  exported from `src/index.ts`, so they are not in the bundle. They are excluded
  via `titleMap` nulls. Adding them would mean `cfg.extraEntries` pointing at TS
  source, which would bundle a second copy of every component they import — the
  same trap recharts fell into. Think carefully before doing it.
- **Partially verified:** `Modal/{Confirm,Plain,TypeToConfirm}` are skipped for
  the oracle because a top-layer `<dialog>` leaves the captured root 0px tall on
  BOTH sides. The Modal card is verified instead by the validator's render check
  (geometry + text), which reads the full 297px confirm modal. If Modal's card
  ever regresses, the compare loop will NOT catch it — check `.render-check.json`.
- **Known-triaged warnings** (do not chase): `[EXPORT_COLLISION] recharts …
  Tooltip`. Nothing else warns.
- **Unresolved, outside this sync:** `IconTile/Inverse` renders a navy tile with
  no visible glyph, identically in storybook and the preview, so the sync is
  faithful. Tokens look right (`--di-tile-inverse-bg: var(--di-ink)`,
  `--di-tile-inverse-fg: var(--di-sheet)`), so it is NOT the cascade-layer bug.
  Deliberately not papered over with an owned preview. Worth a designer's look.

## Re-sync 2026-09-25 — what changed and what to watch

This sync followed a large API and token refactor. Everything below is new
since 2026-09-24.

- **`pnpm build` now runs `pnpm lint:tokens` FIRST.** That is `cfg.buildCmd`, so
  a token violation anywhere in `src` fails the converter's build stage before
  esbuild ever runs. If a future sync dies in `stages.build` with a list of
  `space` / `radius` / `type` / `colour` / `layer` / `api` problems, that is the
  design-system lint, not the converter. Fix the values; do not bypass it.
- **The space scale was renamed and is now value-named:** `--di-space-2 4 6 8 12
  16 24 32 48` (`--di-space-12` is 12px). The old positional `--di-space-1…-7`
  names are gone. 156 spacing values across 51 files moved onto the ramp.
- **Nine string props became slots**, and five components now pick slots out of
  `children` by type (the `ModalFrame` pattern): `PanelMeta`, `StageFooter`,
  `ExplainFooter`, `MetricNote`, `RecordCount`, `SessionDetail`,
  `StatTileDelta`, `LivingBasis`, `SignInVersion`. All nine verified `match`
  against storybook this sync.
- **Prop vocabulary was unified.** `tone` now means status only; what is not a
  status got its own name (`surface` on Panel, `scope` on PrivacyBadge, `state`
  on CommandChip, `level` on ConfidenceField, `variant` on IconTile). Values
  `ai`→`inferred`, `gold`→`seal`, `info`/`default`→`neutral`, Sparkline
  `ink`→`series`. Every rename verified against the storybook render.
- **`--di-accent`, `--di-font-display` and `--di-font-body` were deleted** as
  duplicate names. New `--di-inverse-*` roles (bg / raised / border / text /
  muted / seal) exist for surfaces sitting on navy — Toast, Tooltip, SignIn and
  the current Stage all bind to them now instead of hand-mixed hexes.
- **`titleMap` gained `Scale: null` and `Decisions: null`; `Adoption` was
  removed** (that page was renamed to Decisions). Without those two nulls the
  new Foundations pages get scanned as components.
- **Foundations/Scale and Foundations/Decisions are `.tsx`, so `guidelinesGlob`
  cannot carry them** — same limitation as Color/Type/Logo. Their content is
  hand-copied into `.design-sync/conventions.md` under "The dimensional ramps"
  and "What this system refuses". **If those pages change, that header goes
  stale.** Re-validate on every sync touching foundations.
- **The conventions header's type table was found stale this sync** and
  corrected: it documented Body 16px/weight 600 when `base.css` sets 13px and
  every heading ships 700. It had been transcribed from a `Type.stories.tsx`
  that was itself wrong. Both are fixed; the table now names the token for each
  step. This is the exact failure the 2026-09-24 notes warned about — the header
  is hand-authored and does not regenerate.
- **Still unresolved (third sync running):** `IconTile/Inverse` renders a navy
  tile with no visible glyph, identically on both sides. Faithful sync, real
  design bug. Worth a designer's look.
- **`Chart` now prints `[PORTAL?]`** suggesting `cardMode: "single"`. Ignore it:
  `gridOverflow` measured `null`, nothing escapes its cells, and the Recharts
  tooltip only renders on hover so a static capture never shows it. `cardMode:
  "column"` stays — switching to `single` would drop three of the four chart
  stories from the card.
- **`Chart` stories were rewritten to compose `Chart` directly** rather than
  rendering `foundations/guide/BrandCharts`. The library's own stories no longer
  depend on unexported foundations helpers. All four graded `match`, which also
  re-confirms `cfg.extraEntries: ["recharts"]` is still load-bearing.

## Foundations — added after the first upload (same day)

The first upload shipped **no Foundations content at all**, which the designer
caught. Two separate misses:

1. **Six MDX brand documents were never in the roster.** `Essence`, `Register`,
   `Voice`, `Mark`, `Surfaces`, `Practice` are **docs**-type entries in
   storybook's `index.json`, and the roster scan filtered to **story**-type
   entries. They were invisible to every earlier step. Fixed with
   `cfg.guidelinesGlob: ["src/foundations/*.mdx"]` — `emitGuidelines` copies them
   to `guidelines/` with an `index.md`, and the generated README then emits
   "Read these before composing larger layouts." The converter's DEFAULT globs
   (`docs/*.md`, `docs/guides/**/*.md`, `guides/**/*.md`) match nothing in this
   repo, which is why the directory came out empty and silent.
2. **Four specimen pages** (`Color`, `Type`, `Logo`, `Adoption`) are excluded
   from the component roster via `titleMap` nulls — correct, they have no
   component — but their CONTENT was simply dropped. They are rendered React,
   not markdown, so `guidelinesGlob` cannot carry them.

**What was done about (2):** the concrete rules were written into
`.design-sync/conventions.md` and validated against source:
- the seven-role type scale (Display 48/600, Section 28/600, Body 16/400,
  Interface 13/500, Measurement mono 28/500, Identifier mono 13/400, Section
  mark mono 11/500 uppercase 0.12em) — verified against `Type.stories.tsx`
- the four lockups, the minimum sizes (20px digital / 10mm print / 16px-6mm
  mark) and the 1X clear-space rule — verified against `guide/Guide.tsx` and
  `Mark.mdx`
- the six misuse rules **with their reasons** — verified against
  `guide/Specimens.tsx` (exactly six there)

**Known limitation of shipping raw MDX:** the prose ships, but content rendered
by components inside it does NOT. `<Misuse />`, `<ClearSpace />`, `<Cobrand />`
and the specimen components appear to a reader as bare tags. That is exactly why
the misuse rules and the size minimums were copied into the conventions header
by hand. **If those specimen components change, the header goes stale** — it is
hand-authored, not generated. Re-check it against `guide/Specimens.tsx` and
`guide/Guide.tsx` on any sync that touches foundations.

**Re-sync note:** `guidelinesGlob` is repo-relative to the package dir, so the
emitted paths keep the `src/foundations/` prefix
(`guidelines/src/foundations/Register.mdx`). That is cosmetic; `index.md` links
them correctly.

## Guardrails added after comparing with ~/code/frontend-template

That repo splits guidance in two — `CLAUDE.md` (agents working in the repo,
including an "Automation: what is enforced, not just asked" section and a
definition-of-done checklist) and `.design-sync/conventions.md` (the design
agent). This repo has the same split: `AGENTS.md` + `.design-sync/conventions.md`.

Worth knowing: frontend-template's **"don't invent components"** rule lives in
`CLAUDE.md` (rule 7 + "Prefer composing existing components over writing new
markup"). Its `conventions.md` does **not** tell the design agent that — the
only trace is a parenthetical in a code sample. So the gap existed in both
projects. It matters more here because the claude.ai/design agent *cannot*
create a component; when one is missing it improvises markup that cannot ship.

Added to `conventions.md` (each value verified against source before writing):

- **Compose, never invent**, plus an explicit note that `Screens/*` are not in
  the bundle (they are not `src/index.ts` exports), so `RegisterScreen` and
  friends are not available and must be composed.
- **Never write a raw colour.** The reason is specific to this system: navy is
  both ink and action and the action fill turns **gold** after dark, so a
  hardcoded `#0A1F44` is right in daylight and invisible on the night sheet.
- **Focus follows its ground** — `--di-focus` navy on paper / Gold 400 after
  dark, `--di-sidebar-focus` gold on the navy rail — with the 2.1:1-vs-3:1 trap
  spelled out. The header previously mentioned focus **zero times**, and
  AGENTS.md:63 records that the prototype already made exactly this mistake.
- **Gold is a mark, not type** (full rule, incl. `#061631` on ivory).
- **No second yellow / no traffic-light green or red.**
- **Timestamps 24h UTC with `Z`; ordinals zero-padded two digits.**
- **Exploring a variation** — override token *values*, never component styling
  or hex; keep names AND roles; name the changed tokens at handoff so
  engineering can paste them into `src/styles/tokens/`. Modelled on
  frontend-template's "Exploring a palette", adapted to this token set.
- The rules are framed as **enforced** (`pnpm test` fails on axe), which is
  true here and gives an agent a reason to comply rather than a preference.

Added to `AGENTS.md`: a **"Compose, never invent"** section before Checks,
stating that a missing control is a library addition (component + story +
export), and that the synced design system carries only what `src/index.ts`
exports — so a control that never became a component cannot be designed with.

**Still not ported from frontend-template**, if you want it later: their
`CLAUDE.md` enumerates enforcement (ESLint bans raw hex in components, a
story-coverage test fails when a component has no story, a Stop hook runs
lint/typecheck/test, CI refuses PRs deleting story files without a label) and
ends with a definition-of-done checklist. This repo enforces less mechanically —
`pnpm test` + axe, and the treeshake check in `pnpm build`.
