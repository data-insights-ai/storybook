# How the package is put together

One package, `@data-insights-ai/ui`: Storybook 10, React 19, Vite. The repository is public; the package on GitHub Packages is private.

## Tokens in three layers

`src/styles/tokens` holds three layers, so a theme can remap intent without a hunt through component files:

- **Primitive** (`primitive.css`): raw brand-book values, the paper and night ramps, navy, gold, cornflower, poppy, the status and severity colours, the type and space scales. Components do not name these.
- **Semantic** (`semantic.css`): roles. The tone steps (chrome, page, surface, inset, strip, plane, hero), text, fill, the one gold, selection and focus, sidebar, status, severity, chart. The dark remap under `[data-theme="dark"]` binds the same roles to the night ramp; it is designed, not inverted. The theme blocks carry no `:root` prefix, so a region with its own `data-theme` resolves the roles for itself.
- **Component** (`component.css`): slots for one control, such as `--di-button-primary-bg`, declared on `:root, [data-theme]` and again on `[data-density]`, so a region resolves them from its own theme and density. A custom property is substituted on the element that declares it; declaring a slot only at `:root` would hand a descendant region the literal colour of the outer theme. `component.css` ships in the package because its slots are the only `--di-*` properties a product may set.

`density.css` holds one value per density for control heights, row heights, insets and the gap ramp. `base.css` holds the element defaults, hyphenation, the reduced-motion rule and `[data-theme] { color: var(--di-text) }`, so a themed region takes its own ink. `primitives.css` holds the shared drawings (surface, row, option, ordinal) a component composes instead of drawing its own.

## CSS layers and the stylesheet

Every stylesheet is in a cascade layer: `@layer tokens, base, components, overrides`. The order is fixed by the first `@layer` statement a document sees, so `scripts/build-styles.mjs` prepends it to every `dist/lib/components/*.css` as well as to the flattened `dist/lib/styles.css`. Without that, a product that imports only `Button` (and so never loads `styles.css`) would register `components` first and `base.css`'s `button { color: inherit }` would beat the component's colour. The build fails if the statement disappears from `src/styles/styles.css`.

`styles.css` is one flattened sheet: the `@font-face` rules (Space Grotesk, IBM Plex Sans, IBM Plex Mono from `@fontsource`, OFL-1.1), the three token layers and the base rules. A product imports it once. The font files are not inlined into the stylesheet.

## Modules and tree-shaking

`pnpm build` emits one module per component to `dist/lib`, with `sideEffects` listing CSS only, so a product ships only what it imports; `scripts/check-treeshake.mjs` proves it. One module is one component, which is why two independent components never share a file. A component that is not exported from `src/index.ts` is absent from the package. `scripts/public-api.json` records the entry and the class names; `pnpm build` fails when they change without `check-api.mjs --write`.

`Icon` takes one Lucide icon as its child and does not import the set, so an app keeps only the icons it renders. `Chart` wraps one Recharts chart; the Storybook build merges Recharts into the same bundle so stories and components share one instance.

## Behaviour

Buttons, fields and tables are native elements. Where a control needs roving focus or a popup beyond that, the headless library is Base UI (`@base-ui/react`) and no other ([API rules](api-rules.md), "Native first"). The date calendars draw their month grid with `react-day-picker`; the typed day and time segments are the package's own. Rows of a long table are virtualised with `@tanstack/react-virtual`.

The components work under a Content-Security-Policy without `'unsafe-inline'` styles: they set colours through element styles, never style elements, and the Base UI parts that add a style element (ScrollArea, Select, Tabs, Slider) are not used.

## Storybook

Components sit in `src/components`, one folder per Storybook group ([Component groups](../reference/components.md)); the Foundations pages in `src/foundations` and the pattern screens in `src/screens` are stories without a package export. `.storybook/preview.tsx` imports the stylesheet, sorts the groups, wraps a story in `main` with a visually hidden `h1` when it has none, and records `on…` props as actions. `.storybook/tests` holds the checks that run against every story ([How the story tests judge a component](story-tests.md)). `pnpm storybook` serves the MCP addon (`@storybook/addon-mcp`) at `http://127.0.0.1:4500/mcp`, so an agent reads the catalogue while Storybook runs; `.mcp.json` points at it.

`.design-sync/` is what the design sync to claude.ai/design needs: `config.json` (what to bundle and what to skip), `conventions.md` (the header the design agent reads instead of this repository) and `NOTES.md` (what the sync tool's operator has to know). The sync carries only what `src/index.ts` exports.
