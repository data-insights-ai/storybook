# datAInsights

Storybook for the datAInsights brand. Colour, type, and the mark come from the brand book. The screens are composed examples of a console. They are not a named product.

© 2026 datAInsights GmbH. All rights reserved. See [LICENSE](LICENSE). Reading this repository is allowed. Copying the design, the components, or the brand assets into another product is not. The package is not published to npm.

Rules for changing this repo are in `AGENTS.md`.

```bash
pnpm install
pnpm storybook
```

Opens on port 4500. While it is running, agents can read the component catalogue at `http://127.0.0.1:4500/mcp`.

```bash
pnpm typecheck
pnpm test
pnpm build
pnpm build-storybook
```

`pnpm test` runs every story in a browser. `pnpm build` writes the installable package to `dist/lib`. The static Storybook build is written to `dist/storybook`.

## Use a released version

A tag `v0.1.0` publishes `@data-insights-ai/ui@0.1.0` to GitHub Packages and uploads that Storybook to `https://storybook.data-insights.ai`. The tag and `version` in `package.json` are the same number. Projects pin that number.

In the app’s `.npmrc`:

```
@data-insights-ai:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

`NODE_AUTH_TOKEN` is a GitHub token with `read:packages`.

```bash
pnpm add @data-insights-ai/ui@0.1.2
```

```tsx
import "@data-insights-ai/ui/styles.css";
import { Button } from "@data-insights-ai/ui";
```

Import the stylesheet once. It carries the tokens, the base rules, and the woff2 faces. Importing a component pulls in that component and its own stylesheet, and leaves the unused components out. The app supplies React 18.3 or newer. Strings are props. `data-theme="dark"` on a parent switches the semantic tokens.

## Context and repeated views

Place persistent context controls in an `AppShellContext` directly inside `AppShellRail`. It appears below the brand and before navigation in both visual and keyboard order; `AppShellFoot` retains its footer position. The context is a dark token boundary, matching the rail even when the page is light, so composed controls resolve their own readable fills. The application owns selection state and authorization.

When a page has more than one tab strip, give each `Tabs` and its `TabPanel` the same unique `idPrefix`. Item values are unique within each strip. The prefix scopes their accessible relationship; values are encoded safely for document IDs.

```tsx
<Tabs idPrefix="entry-details" label="Entry views" value={view} onChange={setView} items={views} />
<TabPanel idPrefix="entry-details" value={view}>…</TabPanel>
```

`MenuItem` remains an action by default. Pass `checked` for a radio choice and put related choices in a labelled `MenuGroup`; the application owns the checked state. `disabled` uses the native button state and keyboard movement skips unavailable choices. `Menu align="start"` anchors to the trigger’s start edge; the existing end alignment remains the default.

A shell has one `main`: `AppShellContent`. `SidebarInset` is a plain box around the bar and the page. Give `SidebarProvider` a `skipLabel` (or `AppShell` its required one) and the first Tab stop is a skip link to the page.

`Drawer` is a dialog: focus moves in, Escape closes it and focus returns to the opener. It is modal by default; `modal={false}` keeps the page behind reachable from the keyboard. `Sheet` and `Modal` are native modal dialogs.

`Panel` and `EmptyState` can omit `index` when no ordinal belongs to the content. Omission removes the index rail completely.

## Periods and counts

`DateRangePicker` takes a custom range on the calendar or typed into its first and last day; a partial or impossible day applies nothing, and a last day before the first is named under it instead of being swapped. `allowOpenEnd` adds "Until now": a custom range from a first day (and its time, with times on) with no end, applied as `{ from }`, so entries keep arriving in it. Without it the picker works as before.

`Seismograph` reads counts per period as pulses: up for what lies above a line, down for what lies below it, on one count scale; the highest periods carry their count. With `onSelect` a period is picked by a click or with the scrubber under the chart, a slider that arrows, Page Up/Down, Home and End move and a screen reader reads as the period and its counts. `scale="log"` is symmetric, so zero stays on the line. Colours are the chart tokens: `above` is `--di-chart-series`, `below` `--di-chart-compare`, the selection `--di-chart-highlight`.

## How it is put together

One package. Storybook 10, React 19, Vite.

Tokens are three layers in `src/styles/tokens`:

- **Primitive** — brand-book values. Components do not name these.
- **Semantic** — page, surface, text, fill, focus, sidebar, status. Light is the console as drawn. Dark remaps the same roles from the toolbar.
- **Component** — slots for one control, such as `--di-button-primary-bg`.

Gold is one moment per view: the tittle in the mark, or the page eyebrow. Paused reuses that gold. Running is `#186D41` and failed is `#AB2E37`, the hues from the console screenshots, each above 5:1 on its wash.

Sansation is display and figures. IBM Plex Sans is the interface. IBM Plex Mono is identifiers, timestamps, and eyebrows.

Buttons, fields, and tables are native elements. A headless library is worth adding when a control needs roving focus or a popup, not before.

Component stories take string args, so Controls can change the copy. Icons, actions, table cells, and other elements are children, filled in `render`, not edited as controls. Stories are in English. The Get started checklist in the sidebar is turned off.

## Screens

| Story | What it shows |
| --- | --- |
| Screens / Login | Sign-in. A card on a navy field. |
| Screens / Watchlist | Identities under watch. |
| Screens / Coverage | A list of connected sources. |
| Screens / Architecture | A five-stage pipeline. |
| Screens / Settings | Session, channels, availability. |

Sample copy is English. A product supplies its own strings.
