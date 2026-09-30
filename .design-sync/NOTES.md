# design-sync notes

Repo: datAInsights Storybook, public — https://github.com/data-insights-ai/storybook
Target project: "datAInsights Register" (`50fa49a6-04d7-435a-8d5c-567ff7cc04e7`)
Package: `@data-insights-ai/ui`. pnpm (`pnpm@12.5.1`, node >=22.12.0),
`pnpm i --frozen-lockfile`.

Read in order: **Load-bearing**, then **Tool limitations**, then **Stale by
design**. The run log at the bottom is history, not instruction.

## Load-bearing in `src` — remove any of these and the package breaks

These three are real packaging fixes the sync found. They matter to products
installing the package, not just to the converter.

- **`package.json` top-level `"types": "./dist/lib/index.d.ts"`.** The converter
  reads `pkgJson.types`/`typings`, then probes `dist/` for a *direct* `.d.ts`,
  which `dist/lib/*` does not satisfy — so without it it falls back to the repo
  root, enumerates **0 exports**, and reports a misleading `[TITLE_UNMAPPED] 64`.
  There is no config knob for the types root. It also makes the package visible
  to `moduleResolution: node` consumers.
- **`scripts/build-styles.mjs` prepends `@layer tokens, base, components,
  overrides;` to every `dist/lib/components/*.css`.** Layer order is fixed by the
  **first** `@layer` statement a document sees. Each component sheet opens with
  `@layer components {`, so if the order statement only lives in `src/styles.css`,
  a document that loads component CSS first registers `components` first and
  appends `tokens`/`base`/`overrides` *after* it — inverting the cascade.
  `base.css` has `button { color: inherit }`, which then beats
  `.di-btn-primary { color: … }`: every component renders with the wrong text
  colour, most visibly a navy label on the navy Primary fill. Layers trump
  specificity, so nothing in the component sheet can win.
  This hits **production**, not only the sync: `sideEffects` means a product
  importing only `Button` never loads `styles.css`. Storybook hides it because
  `preview.tsx` imports `src/styles.css` first. The build fails if the statement
  disappears from `src/styles.css`, so the two cannot drift.
  Do not try to fix this from `cfg.cssEntry` — the converter always *appends*
  it after the bundled CSS, so it can never reach the front from there.
- **`FieldHint.tsx` does `import "./Field.css"`.** `.di-field-hint` is defined in
  `Field.css`, which only TextField / Select / SearchField / ConfidenceField
  import, so a product tree-shaking `FieldHint` shipped it unstyled.
  Audited once: it was the only one. A naive scan also flags DataTable, Notice
  (`di-mono`) and Seal (`di-tick-rule`) — false positives, those classes live in
  `base.css`, which always ships. Scan `src/components/*.css` only.

`cfg.buildCmd` is `pnpm build`, which runs `pnpm lint:tokens` **first**. A sync
dying in `stages.build` with a list of `space` / `radius` / `type` / `colour` /
`layer` / `api` problems is the design-system lint, not the converter. Fix the
values.

## Load-bearing in `config.json`

- **`cssEntry: "dist/lib/styles.css"`** — the flattened sheet (`@font-face` +
  primitive/semantic/component + base) written by `scripts/build-styles.mjs`.
  Without it the bundle ships component CSS only: `[TOKENS_MISSING]` for 136
  `--di-*` vars, `[RENDER_THIN]` on IconTile and Sparkline, no fonts.
- **`extraEntries: ["recharts"]`** — merges recharts into `window.DataInsightsUI`
  so a story's direct `recharts` imports shim to the same instance `Chart.tsx`
  uses. Without it there are **two copies**: recharts identifies children by
  type, so `ResponsiveContainer` from the bundle does not recognise children
  built by the preview's copy and renders **nothing, silently** — no page error,
  no `[RENDER]` failure, and the render check still passes because the wrapper
  and its aria-label mount at the right size. Only the `<svg>` is missing.
  Measured when it was found: `_preview/Chart.js` was **1,010,288 bytes** with the
  second copy and **16,764** with `extraEntries` set. The direct importer was
  `src/foundations/guide/BrandCharts.tsx`.
  Expected warning, do **not** act on it: `[EXPORT_COLLISION] recharts exports
  1 name(s) the main package also exports: Tooltip`. The DS `Tooltip` wins,
  which is right — no story imports recharts' `Tooltip`. Do **not** apply the
  suggested `cfg.storyImports.bundle: ["recharts"]`; that recreates the
  duplicate and blanks every chart again. Re-check if a story ever imports
  `Tooltip` or `Legend` from recharts.
  *Generalises:* any package the DS uses internally **and** a story imports
  directly needs this, or the duplicate instance breaks anything inspecting
  child component types.
- **`titleMap` keys are title SEGMENTS, not full titles**, and the card group is
  the segment *before* the matched one — `Blocks/Inference/Confirm` → export
  `ConfirmPanel`, group `inference`. Renames: Confidence→ConfidenceField,
  Confirm→ConfirmPanel, Explain→ExplainPanel, Privacy→PrivacyBadge,
  Seal→SealValue, Skeleton→SkeletonTable, AppShell→Console.
  `null` excludes: `Foundations/*` (Color, Type, Logo, Scale, Decisions — doc
  pages with no component) and `Screens/*` (Architecture, Coverage, Inference,
  Login, Register, Settings, Watchlist). **A new Foundations page needs a new
  null**, or it gets scanned as a component.
- **`guidelinesGlob: ["src/foundations/*.mdx"]`** — the converter's defaults
  (`docs/*.md`, `docs/guides/**`, `guides/**`) match nothing here, which is why
  `guidelines/` came out empty and silent on the first upload. The six MDX brand
  documents (Essence, Register, Voice, Mark, Surfaces, Practice) are **docs**-type
  entries in storybook's `index.json`; the roster scan filters to **story**-type
  entries, so they were invisible to every earlier step.
  Paths keep the `src/foundations/` prefix (repo-relative to the package dir).
  Cosmetic; `index.md` links them correctly.
- **`dtsPropsFor.Button`** — see the union note under Tool limitations.
- **`readmeHeader: ".design-sync/conventions.md"`** — the design agent's header.
- **`overrides`** — five left, reasons under Tool limitations: `Modal` single
  card + `primaryStory: Confirm`; `Session` / `Tabs` / `Chart` column cards;
  `FieldHint/Empty` skipped. The `Button` and `StatusPill` entries are **gone** —
  their NightSheet stories render a themed region now and photograph cleanly.

**Screens are not synced.** `src/screens/*` are real components but are not
exported from `src/index.ts`, so they are not in the bundle. Adding them would
mean `extraEntries` pointing at TS source, which bundles a second copy of every
component they import — the recharts trap again. Think carefully first.

## Tool limitations, and what was done about each

### Preview decorators are not bundled — and that is fine here

`! preview decorator bundle failed: No loader is configured for ".woff2"`.
`.storybook/preview.tsx` imports `src/styles.css` → fontsource CSS → `.woff2`,
and the decorator bundler hardcodes `loader: {'.js':'jsx','.json':'json'}`
without reading `cfg.storyImports.loaders`. No config knob reaches it.

No `cfg.provider` is set, deliberately. The decorators provide only
`withThemeByDataAttribute` setting `data-theme="light"` — unnecessary, since
light is the bare `:root` default — and a `<main>` + visually-hidden `<h1>`
wrapper (`StoryCanvas`), which is storybook a11y scaffolding and must **not**
ship to designs. There is no provider to distill: theming is a CSS attribute,
not React context.

### Dark theme was root-only; both NightSheet stories were skipped for it

**Fixed 2026-09-30.** Kept here because the reasoning is the reasoning for the
whole token layer, and because the same failure will recur anywhere a token is
declared at one scope and read at another.

`Button/NightSheet` and `StatusPill/NightSheet` carried
`globals: { theme: "dark" }`. With decorators unbundled (above) the global was
dropped and both rendered in daylight — a navy primary fill where the point is
that after dark the fill turns gold.

A wrapper could not fix it, and the reason is the rule to remember: **a custom
property is substituted on the element that DECLARES it.** `component.css`
declared all 29 slots at `:root`, so `--di-button-primary-bg` resolved to navy
there and inherited down as a literal colour; re-pointing `--di-fill-strong` on a
descendant could never reach it. Measured at the time: the ground went dark
(`rgb(7,18,41)`) while the primary button stayed navy and the secondary went
near-white-on-near-white.

**What changed.** Three selectors: `semantic.css`'s two theme blocks dropped the
`:root` prefix, and `component.css` became `:root, [data-theme]`. Fourteen of the
29 slots read a role the night sheet remaps, and those fourteen are read by seven
stylesheets — Button, Card, DataTable, Field, SearchField, Panel, SkeletonTable.
Everything else binds to semantic roles directly and already inherited correctly.

A fourth change was needed and is the same bug one layer up: `base.css` sets
`body { color: var(--di-text) }`, which resolves at `body`, so a region inherited
the OUTER ink as a literal and its own `--di-text` was never read — navy prose on
the night sheet, in 186 of 302 stories. `base.css` now carries
`[data-theme] { color: var(--di-text) }`. Ink is not optional; the **surface** is
left to the author, so a region can sit on page, surface or nothing.

**Verified**, against the static Storybook build, not by reasoning:
- All three whole-document cases (no attribute / `light` / `dark`) compute
  identically before and after. The page-level contract did not move.
- All 302 stories re-rendered inside a painted dark region: **1** element lost
  contrast, a *disabled* control inside `SignIn`, and it computes identically
  under `html[data-theme="dark"]` — pre-existing, not from this change. See Open.
- Both NightSheet stories now render the region themselves and are **no longer
  skipped**, so the compare oracle photographs the dark contract every sync
  instead of prose asserting it.

**A region is not the way to put a dark surface on a light page.** That is
`--di-inverse-*` (AppShell, SignIn, Stage, Toast, Tooltip) and `--di-sidebar-*`
for the rail, and they mean something different: "a plane sitting on navy, in
either theme" versus "the register after dark". `--di-inverse-bg` is navy in
daylight and night-800 after dark; the night sheet's surface is neither. The
three mechanisms do not overlap. `Toast.css` also keeps its local re-pointing,
which now looks like the general case rather than a workaround.

### A top-layer `<dialog>` cannot be photographed on either side

`Modal` is a native `<dialog>` opened with `showModal()`, so its content is in
the browser's top layer. The harness screenshots the story **root**, and a
top-layer dialog leaves that root **0px** tall — measured: the dialog renders at
296.6px with all its copy while the root reports height 0. Identical in
storybook and in the preview, so compare reports `sb-error` on both. A capture
limitation, not a fidelity defect, and not a reason to change the component.

`cardMode: "single"` is separate and *intended*: a top-layer dialog would paint
over every sibling cell, so the card shows one representative modal.

The Modal card is verified instead by `package-validate.mjs`'s render check,
which reads geometry and text rather than a root screenshot and sees the full
297px modal. **If Modal's card regresses, the compare loop will NOT catch it —
check `.render-check.json`.**

### `skip` removes a story from the DESIGN SYSTEM, not just the oracle

Found by the designer, who noticed the Modal card showed one state while
storybook has five. A story in `overrides.<Name>.skip` is dropped from the
generated wrapper entirely: absent from `_preview/<Name>.js`, unreachable with
`?story=`, and — the part that matters — **it gets no section in
`<Name>.prompt.md`, the design agent's usage reference.** `Modal` was shipping
without `Plain` (no icon column) and `TypeToConfirm` (type the name back to arm
the commit): two distinct patterns the agent had no example of.

The fix is `.design-sync/previews/Modal.tsx`, which re-exports the three skipped
stories. The skip still applies to the oracle; the module, `?story=` and the
generated prompt.md get them back.

**Audit whenever skips change.** Evaluate `_preview/*.js` and read the
PascalCase keys off `__dsPreview` — that is what the card's own script does.
Note it is a top-level `var`, so in a Node `vm` it lands on the context object,
not on `ctx.window`. Compare against `sb-reference/index.json`, **not**
`.stories-map.json`, which already excludes skips and hides the very gap you are
looking for.

Audited 2026-09-25: of 273 storybook stories belonging to synced components, 5
were not renderable and all 5 were deliberate — the two NightSheet stories,
`FieldHint/Empty` (renders nothing by design, and it landed as `roots[0]`,
tripping the validator's `rootEmpty` check), and Modal's two, restored by the
owned preview. **Since 2026-09-30 the two NightSheet stories render, so the count
is 1**: `FieldHint/Empty`. Re-run the audit on the next sync.

Known cosmetic limitation: `<Name>.prompt.md`'s one-line
`Variants (see <Name>.html): …` header is generated from the non-skipped roster,
so Modal's still reads "Closed, Transition" even though the file carries
`### Plain` and `### TypeToConfirm` sections below it. Content is complete;
fixing the header would need a lib fork.

### Play-function stories are systematically `close`, and that is correct

Storybook runs `play` before photographing; compiled previews **never** run it.
So any story whose `play` clicks, types, selects or focuses is captured by
storybook post-interaction and by the preview at rest.

Signature, so later waves do not chase it as a styling defect: identical element
geometry on both sides plus a navy `#0A1F44` ring-shaped pixel surplus on the
storybook side only. Measured on `Chip/Active` (392 navy px vs 282, same 132×28
bbox) and `Chip/Available` (45 px of outset ring the preview lacks).

Grade `close` with the cause named. Do **not** hard-code the interaction result
into an owned preview — the resting render is what a design agent actually gets,
so faking it destroys the fidelity being verified. If one ever must grade
`match`, the only sound route is `skip`.

### A discriminated-union props type is flattened to its FIRST member, silently

`Button`'s props are `ButtonProps | LinkProps`, where the button branch carries
`href?: never` and the link branch `href: string`.
`dist/lib/components/Button.d.ts` holds the union correctly, but `lib/dts.mjs`
calls `type.getApparentType().getProperties()` on it and emitted **only**
`href?: never` — telling the design agent the exact opposite of the capability,
in both `Button.d.ts` and `Button.prompt.md`. Nothing warned: no `[DTS_PARSE]`,
no `[DTS_STYLE_SYSTEM]`, and compare cannot see it because the renders were
perfect. Caught only by reading the uploaded `.d.ts` back.

Worked around with `cfg.dtsPropsFor.Button`, the documented remedy. **Check any
component whose props are a union rather than an intersection:**
`grep -l "Props | .*Props" dist/lib/components/*.d.ts`. Today `Button` is the
only one. Read the emitted `.d.ts` back; do not assume.

### Two ways a sync silently fails to *verify* something

- **The driver's default story cap is 6.** `Button` has 16 stories and the driver
  captured `first 6 of 15` — silently excluding `Link` and `Link Disabled`, the
  only two stories that sync existed to verify. On any sync touching a component
  with more than 6 stories, pass `--max-stories` explicitly. Counts drift, so
  compute them rather than trusting a list:
  `for f in src/components/*.stories.tsx; do echo "$(grep -c '^export const ' $f) $f"; done | sort -rn`
  The cap is part of the capture key: changing it re-captures and clears grades
  even for components whose story set is unchanged.
- **A CSS-only change does not mark a component `changed`.** The diff keys on
  `sourceKeys` (jsx / d.ts / prompt.md), so a commit editing only
  `StatusPill.css` landed in `unchanged` and its grade would have carried
  forward with nobody looking at the designer's adjustment. The styling does
  re-ship (`upload.styling: true`), so the DESIGN is correct either way — it is
  the VERIFICATION that skips. Force a recapture.

### Expected noise — do not chase

- **The preview card page is white.** That is card chrome. A rendered *design*
  gets `background: #F4F1E8` and Space Grotesk from `styles.css`'s import
  closure — measured. It is why every sheet shows paper on the storybook side
  and white on the preview side.
- **Storybook's own static build cannot load the brand mark.** `Console/Chrome`
  and all four `SignIn` stories show a broken image on the **storybook** side;
  the package inlines the SVG as a `data:` URI while the storybook build emits a
  separate asset whose relative URL 404s in the capture context. The preview is
  the correct side — do not "fix" it.
- **`Icon` reflows to a different column count** in the preview's narrower
  container. Same icons, same styling. Framing.
- **`Chart` prints `[PORTAL?]`** suggesting `cardMode: "single"`. Ignore:
  `gridOverflow` measured `null`, and the Recharts tooltip only renders on hover
  so a static capture never shows it. `column` stays — `single` would drop three
  of the four chart stories from the card.
- **`Progress/Counting` is `close`** — a live JS counter the two panels cannot be
  captured at the same frame of.
- **A full `compare.mjs` run always `[SPOT_CHECK]`s two random carried-forward
  components** and reports them `needs-grade`. Designed pipeline check, not a
  regression. Confirm the two sheets and re-record; do not loop, do not `--force`.
- **Mark and label components are 20–30px tall** and unreadable at contact-sheet
  scale. Judge them from `_screenshots/compare/raw/*__{sb,ds}.png` recomposed and
  zoomed; confirm token values by decoding the PNG and counting pixels per
  colour. A 1px repeating gradient (the 8px tick rule) shows as broken clumps on
  a downscaled sheet — moire, not a bug.
- Known-triaged warnings: `[EXPORT_COLLISION] recharts … Tooltip`, and nothing
  else.

## Stale by design — three hand-authored files that never regenerate

Each has already gone stale at least once. Re-validate all three on any sync.

1. **`conventions.md`** — the design agent's header. The four specimen pages
   (Color, Type, Logo, Scale, Decisions) are rendered React, not markdown, so
   `guidelinesGlob` cannot carry them and their content is transcribed by hand.
   Shipping raw MDX has the same gap: the prose ships, but `<Misuse />`,
   `<ClearSpace />`, `<Cobrand />` and the specimen components reach a reader as
   bare tags, which is why the misuse rules and size minimums are copied in.
   Re-check against `guide/Specimens.tsx`, `guide/Guide.tsx`, `primitive.css` and
   `base.css`.
   *Caught stale twice:* 2026-09-25, a type table claiming Body 16px/weight 600
   when `base.css` sets 13px and headings ship 700 — transcribed from a
   `Type.stories.tsx` that was itself wrong. 2026-09-30, a code sample using
   `--di-space-3` (a name the value-named ramp deleted) and `--di-font-mono` (a
   primitive the same document forbids binding to), a space ramp missing 64 and
   96, a type table missing `-550`, and no mention of the brand tier at all.
2. **`cfg.dtsPropsFor.Button`** — a hand-written props body. If `Button`'s props
   change it goes stale silently, and the silence is the whole problem: nothing
   in the pipeline compares it to the real `.d.ts`.
3. **`.design-sync/previews/Modal.tsx`** — the only owned preview. Everything
   else uses generated previews. It re-exports the three skipped stories and
   must gain any story `Modal` adds.

## Open, outside the sync

**`IconTile/Inverse` — fixed 2026-09-30, after four syncs carrying it.** The
tokens were always right; `Icon.css` declared `color: var(--di-text)` on
`.di-icon`, and an explicit declaration outranks an inherited one, so the tile's
ivory ink never reached the glyph: navy on navy. The declaration is gone — an
icon takes the ink of its ground, which is what `color` inheriting already does.
Measured after: inverse 15.69:1, neutral 13.37:1.
It also silently mis-drew the **`ok`** tile, whose glyph was navy rather than
`--di-status-ok-fg`; that is now status green at 7.84:1. Two visible changes for
the designer, both corrections.

**`SignIn`'s daylight pin is incomplete — `--di-text-disabled` leaks.** A disabled
control on the sign-in card takes the night sheet's disabled ink while the card
stays daylight (2.87:1 on `SignIn/Verifying`). Identical under
`html[data-theme="dark"]` and inside a region, so it is pre-existing and was not
introduced by the theme-region work; a disabled control is also outside the WCAG
contrast minimum. Completing the pin needs a **new primitive**: daylight
`--di-text-disabled` is the bare hex `#6e6a5e`, nothing on the ramp matches it,
and `lint:tokens` correctly refuses a hex in a component. Naming it is a ramp
decision, so it was left alone. One line in `.di-login-card` once the primitive
exists.

## Guidance split

`AGENTS.md` is for agents working in the repo; `.design-sync/conventions.md` is
for the design agent. Same split as `~/code/frontend-template`. Note that
repo's **"don't invent components"** rule lives only in its `CLAUDE.md`, so its
design agent is never told — a gap that matters more here, because the
claude.ai/design agent *cannot* create a component and will improvise markup
that cannot ship.

Not ported from frontend-template, if wanted later: mechanical enforcement
(ESLint banning raw hex, a test failing when a component has no story, a Stop
hook running lint/typecheck/test, CI refusing PRs that delete story files) and a
definition-of-done checklist. This repo enforces less: `pnpm test` + axe,
`lint:tokens`, and the treeshake check in `pnpm build`.

## Run log

**2026-09-23 — aborted mid-flight.** Left an un-anchored project (30 components,
no `_ds_sync.json`) and empty `.ds-sync/` + `ds-bundle/` scaffolding, neither
gitignored — added, since this repo is public and both hold build output.

**2026-09-24 — first completed sync.** Re-adopted the aborted project rather than
creating a fresh one, so this took the atomic upload path. The uploaded state
predated `07bdc3c` ("slot-based component API"), so reconciliation deleted
`SealValue` and the four components that moved from Blocks to Primitives.
64 components, 261 stories: **239 match, 22 close, 0 mismatch.** Validate exited
0, 64/64 previews clean. Uploaded 335 files, deleted 20 stale paths. Every
`close` is a play-function story except `Progress/Counting`.
Foundations shipped only after the designer caught that the first upload
contained none — `guidelinesGlob` for the six MDX documents, hand-transcription
for the four rendered specimen pages.

**2026-09-25 — after a large API and token refactor.** Space scale renamed to
value-named `--di-space-2 4 6 8 12 16 24 32 48` (156 values across 51 files).
Nine string props became slots (`PanelMeta`, `StageFooter`, `ExplainFooter`,
`MetricNote`, `RecordCount`, `SessionDetail`, `StatTileDelta`, `LivingBasis`,
`SignInVersion`), all verified `match`. `tone` narrowed to status only;
`ai`→`inferred`, `gold`→`seal`, `info`/`default`→`neutral`, Sparkline
`ink`→`series`. `--di-accent`, `--di-font-display`, `--di-font-body` deleted as
duplicate names; `--di-inverse-*` roles added for surfaces on navy.
`Chart`'s stories were rewritten to compose `Chart` directly rather than
rendering `foundations/guide/BrandCharts`, so the library's own stories no longer
depend on unexported foundations helpers; all four still graded `match`, which
re-confirms `extraEntries`.
`titleMap` gained `Scale: null` and `Decisions: null`. `conventions.md` gained
the ramps, the refusals, the focus rule, "Compose, never invent" and "Exploring
a variation"; its type table was found stale and fixed.

**2026-09-29 — Button gained an anchor.** Two commits (`fc16840` StatusPill dot
nudge, `6bdcc11` Button `href`), package `0.1.8`. The union-flattening bug and
the default-cap-of-6 bug were both found here and are documented above.
`Button/Primary` became `close` (its play function clicks). Verified the new base
`text-decoration: none` does not kill `Ghost`'s gold underline. Canary picked
Chart, Radio, Icon, Menu, ConfidenceField; all five confirmed. `reference_drift`
explained: 355 → 357 entries from the two new stories.
The `/design-sync` skill was not installed; the staged `.ds-sync/` scripts ran
§7 end to end and `scriptsSha` still matched the anchor (`c0730d65e41fa758`), so
no pipeline churn.

**2026-09-30 — theme regions and two real bugs (not yet uploaded).** The token
layers learned to re-resolve inside a `data-theme` region (see Tool limitations),
which retired the `Button` and `StatusPill` overrides and let
`Foundations/Color`'s "After dark" section render live tokens instead of six
hand-copied hex literals. `IconTile/Inverse` was diagnosed and fixed after four
syncs (see Open). Both NightSheet stories now render their own region and dropped
`globals: { theme: "dark" }`, so they no longer depend on a decorator the preview
harness cannot bundle. **Re-capture `Button`, `StatusPill`, `IconTile` and the
seven slot-reading components** — Card, DataTable, Field, SearchField, Panel,
SkeletonTable, Button — on the next sync; `Icon.css` changed, which is a CSS-only
change and therefore will NOT mark them `changed` (see above), so force it.

**Not yet synced.** `b6da02e` ("Add a brand tier to the library") adds `PullQuote`
as a new component and extends `PageHeader` / `SectionTitle` with `tier`,
`Eyebrow` with `variant`, `FactList` with `layout="grid"`, `Notice` with
`size="comfort"`, `TextField` / `Select` with `labelTrack="prose"`, and `Stack`
with `gap` 64 / 96. `conventions.md` has been updated for it; nothing is
uploaded. Story counts moved, so pass `--max-stories 16`.

## Appendix: pnpm 12.5.1 native binary

`pnpm i` failing with `Failed to switch pnpm to v12.5.1 … Unknown system error -8`
means the native binary pnpm 12 installs via a build script was skipped, leaving
`node_modules/pnpm/pnpm` as a shebang-less `sh` placeholder — macOS returns
ENOEXEC (-8) when a program spawns that path directly. Idempotent fix:

```sh
P=~/Library/pnpm/.tools/pnpm/12.5.1/node_modules/pnpm
node $P/bin/pnpm.mjs --version   # fetches the @pnpm/exe.<target> package
node $P/install.js               # relinks the native binary over the placeholder
```

`file $P/pnpm` should then report `Mach-O 64-bit executable arm64`.
