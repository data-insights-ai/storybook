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
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm build-storybook
```

`pnpm format` rewrites the files in place; `pnpm lint` is ESLint (typescript-eslint, the React hooks rules, jsx-a11y) at zero findings. `pnpm test` runs every story in a browser four times — light and dark, at desktop width and at 390px — and fails on an accessibility violation in either, and measures the contrast of all visible text itself, at several points on each line, where axe cannot decide (chart labels, text over a pseudo-element). It also measures every surface: the same inset above and below its content, and the gaps between its head, body and foot on the space scale. `pnpm build` writes the installable package to `dist/lib`. The static Storybook build is written to `dist/storybook`.

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

The components work under a Content-Security-Policy without `'unsafe-inline'` styles: they set colours through element styles, never style elements. Of Base UI only ScrollArea, Select, Tabs and Slider add a style element, and the package uses none of them.

## Context and repeated views

Place persistent context controls (an organization or workspace switcher) in the `SidebarHeader`, as a `SidebarMenuButton` that opens a `Menu`. They come before navigation in both visual and keyboard order. The application owns selection state and authorization.

When a page has more than one tab strip, give each `Tabs` and its `TabPanel` the same unique `idPrefix`. Item values are unique within each strip. The prefix scopes their accessible relationship; values are encoded safely for document IDs.

```tsx
<Tabs idPrefix="entry-details" label="Entry views" value={view} onChange={setView} items={views} />
<TabPanel idPrefix="entry-details" value={view}>…</TabPanel>
```

`MenuItem` remains an action by default. Pass `checked` for a radio choice and put related choices in a labelled `MenuGroup`; the application owns the checked state. `disabled` uses the native button state and keyboard movement skips unavailable choices. `Menu align="start"` anchors to the trigger’s start edge; the existing end alignment remains the default.

A shell has one `main`: `AppShellContent`. `SidebarInset` is a plain box around the bar and the page. Give `SidebarProvider` a `skipLabel` and the first Tab stop is a skip link to the page.

`Dialog` is a native modal dialog (placement side, center or bottom), except an `md` side dialog inside a `list` or `detail` `Page` wide enough for its side column: it docks there and the page beside it stays usable. Either way focus moves in, Escape closes it and focus returns to the opener.

## Periods and counts

`DateRangePicker` takes a custom range on the calendar or typed into its first and last day; a partial or impossible day applies nothing, and a last day before the first is named under it instead of being swapped. `allowOpenEnd` adds "Until now": a custom range from a first day (and its time, with times on) with no end, applied as `{ from }`, so entries keep arriving in it. Without it the picker works as before.

`Seismograph` reads counts per period as pulses: up for what lies above a line, down for what lies below it, on one count scale; the highest periods carry their count. With `onSelect` a period is picked by a click or with the scrubber under the chart, a slider that arrows, Page Up/Down, Home and End move and a screen reader reads as the period and its counts. `scale="log"` is symmetric, so zero stays on the line. Colours are the chart tokens: `above` is `--di-chart-series`, `below` `--di-chart-compare`, the selection `--di-chart-highlight`.

## How it is put together

One package. Storybook 10, React 19, Vite.

Tokens are three layers in `src/styles/tokens`:

- **Primitive** — brand-book values. Components do not name these.
- **Semantic** — the tone steps (chrome, page, surface, inset, strip, plane), text, fill, the one gold, selection and focus, sidebar, status, severity. Dark remaps the same roles onto a navy ramp; it is designed, not inverted.
- **Component** — slots for one control, such as `--di-button-primary-bg`.

Depth is a step in tone, not a line. Gold marks the one thing that matters in a view and, in daylight, is never text. Selection and focus are cornflower. Severity is one scale (`SeverityMark`), a filled mark plus the word.

Space Grotesk is the page's name, figures and section heads. IBM Plex Sans is the interface, with a 14px body. IBM Plex Mono is identifiers, timestamps and the labels above values.

Buttons, fields, and tables are native elements. Where a control needs roving focus or a popup beyond that, the headless library is Base UI (`@base-ui/react`), the only one. The date calendars draw their month grid with `react-day-picker`; the typed day and time segments are the package's own.

Component stories take string args, so Controls can change the copy. Icons, actions, table cells, and other elements are children, filled in `render`, not edited as controls. Stories are in English. The Get started checklist in the sidebar is turned off.

## Patterns

Whole screens built only from public components. They are examples, not exports.

| Story | What it shows |
| --- | --- |
| Patterns / Security overview | Attention list, a navy hero with its figures, severity and sources. |
| Patterns / Case triage | A list beside its record (`Split variant="list"`), one view at a time on a phone. |
| Patterns / Organization home | An organization's home page, one story per role. |
| Patterns / Login | Sign-in. A card on a navy field. |
| Patterns / Watchlist | Identities under watch. |
| Patterns / Coverage | A list of connected sources. |
| Patterns / Architecture | A five-stage pipeline. |
| Patterns / Settings | Session, channels, availability. |

Sample copy is English. A product supplies its own strings.
