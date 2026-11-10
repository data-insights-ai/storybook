# design-sync notes

Repo: datAInsights Storybook, public — https://github.com/data-insights-ai/storybook
Target project: "datAInsights Register"; its id is `projectId` in `config.json`.
Package: `@data-insights-ai/ui`. pnpm (`pnpm@12.5.1`, node >=22.12.0),
`pnpm i --frozen-lockfile`.

Read in order: **Load-bearing**, then **Tool limitations**, then **Stale by design**.

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
  `@layer components {`, so if the order statement only lives in `src/styles/styles.css`,
  a document that loads component CSS first registers `components` first and
  appends `tokens`/`base`/`overrides` *after* it — inverting the cascade.
  `base.css` has `button { color: inherit }`, which then beats
  `.di-btn-primary { color: … }`: every component renders with the wrong text
  colour, most visibly a navy label on the navy Primary fill. Layers trump
  specificity, so nothing in the component sheet can win.
  This hits **production**, not only the sync: `sideEffects` means a product
  importing only `Button` never loads `styles.css`. Storybook hides it because
  `preview.tsx` imports `src/styles/styles.css` first. The build fails if the statement
  disappears from `src/styles/styles.css`, so the two cannot drift.
  Do not try to fix this from `cfg.cssEntry` — the converter always *appends*
  it after the bundled CSS, so it can never reach the front from there.
- **`FieldHint.tsx` does `import "./Field.css"`.** `.di-field-hint` is defined in
  `Field.css`, which only TextField / Select / SearchField
  import, so a product tree-shaking `FieldHint` shipped it unstyled.
  Audited once: it was the only one. A naive scan also flags DataTable, Notice
  (`di-mono`) and Seal (`di-tick-rule`) — false positives, those classes live in
  `base.css`, which always ships. Scan `src/components/**/*.css` only.

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
  the segment *before* the matched one — `Overlays/Dialog` → export
  `Dialog`, group `overlays`. Since 2026-10-29 every title ends in its
  meta component's name, so the six title renames were removed.
  Since the 2026-10-30 group move a title is `Group/Component`, or
  `Group/Sub/Component` in Forms, Text (`Blocks`) and Layout (`Page`, `Arrange`),
  so those cards group under the sub-folder.
  `AppShell→Console` was **removed 2026-10-16**: `Patterns/AppShell` became the
  slot-based `AppShell` a product renders (meta `component: AppShell`), and
  `Console` is now the Storybook-window variant no product renders and no story
  owns. The card is `AppShell`. Since 0.10.0 `Console` and `ConsoleFrame` live in
  `.storybook/console/Console.tsx`, outside the bundle.
  `null` excludes: `Foundations/*` (Start here, Color, Type, Space and shape,
  Our look, Logo — doc pages with no component) and every `Patterns/*` story (Architecture, Case
  triage, Coverage, Create flow, Detail page, Inference, List page, Login,
  Organization home, Register, Security overview, Settings, Watchlist).
  **A new Foundations story or pattern needs a new null**, or it gets scanned
  as a component. The converter's source is not in this repo; the check is
  that every `Foundations/*` and `Patterns/*` story title's last segment is a
  key here.
- **`guidelinesGlob: ["src/foundations/**/*.mdx"]`** matches nothing since 2026-10-30: every
  Foundations page is a story now (so the story tests check it), excluded by a `null` above. The
  guidelines a design agent reads are `conventions.md` (`readmeHeader`).
- **`dtsPropsFor.Button`** — see the union note under Tool limitations.
- **`readmeHeader: ".design-sync/conventions.md"`** — the design agent's header.
- **`overrides`** — reasons under Tool limitations: `Tabs` / `Chart` / `AppShell`
  column cards (`AppShell` added 2026-10-16 for `[GRID_OVERFLOW] wide`);
  `FieldHint/Empty` skipped; `AppShell/MobileNavigationNight` and
  `ComboBox/Night` skipped because they set `globals: { theme: "dark" }` — see
  "A story that themes through a global" below. The `Button` and `StatusPill` entries are **gone** —
  their NightSheet stories render a themed region now and photograph cleanly.

**Patterns are not synced.** `src/screens/*` are real components but are not
exported from `src/index.ts`, so they are not in the bundle. Adding them would
mean `extraEntries` pointing at TS source, which bundles a second copy of every
component they import — the recharts trap again. Think carefully first.

## Tool limitations, and what was done about each

### Preview decorators are not bundled — and that is fine here

`! preview decorator bundle failed: No loader is configured for ".woff2"`.
`.storybook/preview.tsx` imports `src/styles/styles.css` → fontsource CSS → `.woff2`,
and the decorator bundler hardcodes `loader: {'.js':'jsx','.json':'json'}`
without reading `cfg.storyImports.loaders`. No config knob reaches it.

No `cfg.provider` is set, deliberately. The decorators provide only
`withThemeByDataAttribute` setting `data-theme="light"` — unnecessary, since
light is the bare `:root` default — and a `<main>` + visually-hidden `<h1>`
wrapper (`StoryCanvas`), which is storybook a11y scaffolding and must **not**
ship to designs. There is no provider to distill: theming is a CSS attribute,
not React context.

### A story that themes through a global renders in daylight

`globals: { theme: "dark" }` only works through the Storybook decorator, and the
decorator is not bundled. The preview renders such a story in daylight, so
compare grades it `mismatch` for a reason that is not the component.

Two stories still do it: `AppShell/MobileNavigationNight` and `ComboBox/Night`.
Both are skipped. Every other `*Night` story in the roster renders its own
`data-theme="dark"` region (`ContextControls theme="dark"`, `LongNameShell
theme="dark"`, the `NightSheet` stories) and grades `match`, which is how the
dark contract gets photographed. **The fix is in the story, not here**: render
the region instead of setting the global, then drop the skip. Until then the
design agent has no worked example of either component after dark — the skip
removes the story from `<Name>.prompt.md` too.

`grep -rn 'theme: "dark"' src/components --include='*.stories.tsx'` finds any new one.

### A top-layer `<dialog>` cannot be photographed on either side

`Dialog` (and `ConfirmDialog` on it) is a native `<dialog>` opened with
`showModal()`, so its content is in the browser's top layer. The harness
screenshots the story **root**, and a top-layer dialog leaves that root **0px**
tall — measured on the earlier modal: the dialog rendered at 296.6px with all its
copy while the root reported height 0. Identical in storybook and in the preview,
so compare reports `sb-error` on both. A capture limitation, not a fidelity
defect, and not a reason to change the component. Verify an open dialog with
`package-validate.mjs`'s render check, which reads geometry and text rather
than a root screenshot (`.render-check.json`).

The earlier modal used `cardMode: "single"` and an owned preview; both went with
it in 0.11.0. If `Dialog`'s open stories photograph empty on the next sync, give
it the same: a single card, and an owned preview for any story the oracle has to
skip.

### `skip` removes a story from the DESIGN SYSTEM, not just the oracle

A story in `overrides.<Name>.skip` is dropped from the generated wrapper
entirely: absent from `_preview/<Name>.js`, unreachable with `?story=`, and —
the part that matters — **it gets no section in `<Name>.prompt.md`, the design
agent's usage reference.** The fix is an owned preview,
`.design-sync/previews/<Name>.tsx`, which re-exports the skipped stories: the
skip still applies to the oracle; the module, `?story=` and the generated
prompt.md get them back.

**Audit whenever skips change.** Evaluate `_preview/*.js` and read the
PascalCase keys off `__dsPreview` — that is what the card's own script does.
Note it is a top-level `var`, so in a Node `vm` it lands on the context object,
not on `ctx.window`. Compare against `sb-reference/index.json`, **not**
`.stories-map.json`, which already excludes skips and hides the very gap you are
looking for. Today's skips: `FieldHint/Empty` (renders nothing by design),
`AppShell/MobileNavigationNight` and `ComboBox/Night` (themed through a global,
above). Re-run the audit on the next sync.

### Play-function stories are systematically `close`, and that is correct

Storybook runs `play` before photographing; compiled previews **never** run it.
So any story whose `play` clicks, types, selects or focuses is captured by
storybook post-interaction and by the preview at rest.

Signature, so later waves do not chase it as a styling defect: identical element
geometry on both sides plus a navy `#0A1F44` ring-shaped pixel surplus on the
storybook side only. Measured on a pressed and an offered mono `Tag` (392 navy px
vs 282, same 132×28 bbox; 45 px of outset ring the preview lacks).

Grade `close` with the cause named. Do **not** hard-code the interaction result
into an owned preview — the resting render is what a design agent actually gets,
so faking it destroys the fidelity being verified. If one ever must grade
`match`, the only sound route is `skip`.

### A discriminated-union props type is flattened to its FIRST member, silently

`Button`'s props are `ButtonProps | LinkProps`, where the button branch carries
`href?: never` and the link branch `href: string`.
`dist/lib/components/actions/Button/Button.d.ts` holds the union correctly, but `lib/dts.mjs`
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
  gets the paper ground (`--di-paper-ground`) and IBM Plex Sans from `styles.css`'s import
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

## Stale by design — two hand-authored files that never regenerate

Each has already gone stale at least once. Re-validate both on any sync.

1. **`conventions.md`** — the design agent's header. The four specimen pages
   (Color, Type, Logo, Scale, Decisions) are rendered React, not markdown, so
   `guidelinesGlob` cannot carry them and their content is transcribed by hand.
   Shipping raw MDX has the same gap: the prose ships, but `<Misuse />`,
   `<ClearSpace />`, `<Cobrand />` and the specimen components reach a reader as
   bare tags, which is why the misuse rules and size minimums are copied in.
   Re-check against `guide/Specimens.tsx`, `guide/Guide.tsx`, `primitive.css` and
   `base.css`, and against `docs/explanation/register.md`; the two drift together.
2. **`cfg.dtsPropsFor.Button`** — a hand-written props body. If `Button`'s props
   change it goes stale silently, and the silence is the whole problem: nothing
   in the pipeline compares it to the real `.d.ts`.

## Open, outside the sync

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

`AGENTS.md` and `docs/` are for agents working in the repo; `.design-sync/conventions.md`
is for the design agent on claude.ai, which cannot read the repo. That agent also
*cannot* create a component and will improvise markup that cannot ship, which is
why "Compose, never invent" stands in `conventions.md` and not only in the docs.

## Appendix: pnpm 12.5.1 native binary

`pnpm i` failing with `Failed to switch pnpm to v12.5.1 … Unknown system error -8`
means the native binary pnpm 12 installs via a build script was skipped, leaving
`node_modules/pnpm/pnpm` as a shebang-less `sh` placeholder — macOS returns
ENOEXEC (-8) when a program spawns that path directly. Idempotent fix:

```sh
P="$PNPM_HOME"/.tools/pnpm/12.5.1/node_modules/pnpm
node $P/bin/pnpm.mjs --version   # fetches the @pnpm/exe.<target> package
node $P/install.js               # relinks the native binary over the placeholder
```

`file $P/pnpm` should then report `Mach-O 64-bit executable arm64`.
