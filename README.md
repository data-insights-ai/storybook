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

Import the stylesheet once. It carries the tokens, the base rules, and the woff2 faces. Importing a component pulls in that component and its own stylesheet, and leaves the unused components out. The app supplies React 19 or newer: components take `ref` as a prop. Strings are props. `data-theme="dark"` on a parent switches the semantic tokens.

The components work under a Content-Security-Policy without `'unsafe-inline'` styles: they set colours through element styles, never style elements. Of Base UI only ScrollArea, Select, Tabs and Slider add a style element, and the package uses none of them.

## Upgrade to 0.19.2

0.19.2 needs no code change. The sidebar's current page is a selection like every other: the pale selection tint with the navy edge (`#A9CBF3` after dark) instead of gold, and the sidebar trigger's hover is the warm inset tone. Gold is left to the one thing in the view. An app that set `--di-sidebar-active` or `--di-sidebar-mark` itself keeps its own values.

## Upgrade to 0.19.1

0.19.1 needs no code change. A `Tag` that acts (`onClick` or `onRemove`) in a toolbar or filter bar is as tall as the fields beside it and keeps its one line; an icon in a tag sits on the line of its words instead of above them.

## Upgrade to 0.19

0.19 needs one code change: `SearchField` no longer takes `size`. A search is as tall as every other field, so drop `size="sm"`.

A toolbar or filter bar is one height. The Filters trigger of a `FilterBar` and the buttons of `ToolbarSelection` are `md` now, the height of the fields beside them. Buttons an app puts in a toolbar beside a field or a search are `md` too: drop their `size="sm"`. `sm` stays for a row of buttons alone, such as a table row's actions.

## Upgrade to 0.18

0.18 needs one code change: every `InfiniteTable` takes `retryLabel`, the words of the footer's button after a page did not arrive.

```tsx
<InfiniteTable loadingLabel={t("table.loadingMore")} retryLabel={t("table.retry")} … />
```

A fetch that ends (`loadingMore` back to false) without a row more while `hasMore` holds counts as a page that did not arrive: the table no longer calls `onLoadMore` again on its own until the reader presses that button or `count`, `hasMore` or `memoryKey` change, so a failing server is not asked in a loop.

`TableCell` takes `colSpan`: a number of columns, or `"all"` for every column to the row's end, so a separator row is one `<TableRow><TableCell colSpan="all">`. A cell across columns wraps its words instead of widening the grid.

`EventTimeline` breaks its axis by default: a stretch with no bar, event or marker that would take more than a quarter of the plot is drawn as a break a few pixels wide (shaded, the axis and the midline cut by two slashes), in the view and the overview; the time either side keeps one rate. Pass `axis="continuous"` to keep time at one rate throughout.

A side `Dialog` docked in a page's side column now closes when what opened it is pressed again (a button, a link, a selectable row), and that button or link carries `aria-expanded` meanwhile; another row of the same list still shows its record. An opener that set `aria-expanded` itself keeps its own value.

## Upgrade to 0.16

0.16 adds API and needs no code change; bump `@data-insights-ai/ui` to `0.16.0` and move the filter rows over:

- **Filter bar.** `FilterBar` keeps the search and filters above a list on one row at every width. As the bar's own width shrinks, its items fold one by one into the sheet behind the Filters trigger (the lowest `priority` first, among equals the last written) and come back as it grows; those left keep their order, and below 480px of bar only the kept items (the search), the trigger and `FilterBarEnd` stay. Each `FilterBarItem` draws its control for the bar or the sheet from the page's own state, so a filter set inline is still set in the sheet, and while it is folded the trigger counts it. `sheet="complete"` (the default) shows every item in the sheet; `FilterBarSheet` holds fields only the sheet has, counted in `count`. Everything applies as it changes, in the bar and in the sheet (a typed field after about 300ms, as the search); Done only closes, `onClear` clears, and the page keeps no draft. `countLabel` gives the count in words ("2 set"), which the trigger adds to its name. Only direct `FilterBarItem` children are items; the bar needs a parent that can shrink (`min-width: 0` in a flex row). A `Toolbar role="search"` that wrapped, or a "More filters" button with its own `Dialog`, can switch:

  ```tsx
  <FilterBar label="Filter cases" filtersLabel="Filters" countLabel={(n) => `${n} set`}
    closeLabel="Close" doneLabel="Done" clearLabel="Clear all" onClear={clear}>
    <FilterBarItem name="search" keep grow>
      {(place) => <SearchField id={place === "bar" ? "q" : "q-sheet"} label="Search" value={q} onChange={…} />}
    </FilterBarItem>
    <FilterBarItem name="severity" active={severity !== ""}>
      {(place) => <Select id={`severity-${place}`} label="Severity" hideLabel={place === "bar"} …>…</Select>}
    </FilterBarItem>
    <FilterBarEnd><Menu …/></FilterBarEnd>
  </FilterBar>
  ```

## Upgrade to 0.15

0.15 adds API and needs no code change; bump `@data-insights-ai/ui` to `0.15.0` and check the brand pages:

- **Named points.** `PointList` sets a band of named points on a brand page, such as trust tiles or what a release carries: each `Point` is a heading (`title`) over a paragraph (the child), side by side down to one column on a phone, and a short last row shares the width. `heading` sets the level every name takes (`2`, `3` by default, or `4`), so the page outline stays right. The heading runs 18 to 20px with the width of the list (`--di-brand-point-title-size`), the paragraph is 16px (`--di-brand-point-body-size`), and the points wrap at `--di-points-min` (240px). A page that built these from its own `div`s, headings and grid can switch:

  ```tsx
  <PointList heading={3}>
    <Point title="Works offline">The licence and sign-in ship with the installer.</Point>
  </PointList>
  ```

## Upgrade to 0.14.1

0.14.1 needs no code change.

- `Grid fill` lets a short last row share the width: five cards in three columns end in two wider ones instead of an empty cell. A `Panel wide` still takes a row to itself.
- A `Toolbar` in a table cell keeps its actions on one line, so "Open" and the row's "…" no longer break under each other when another column fills the table.

## Upgrade to 0.14

0.14 adds API and needs no code change; bump `@data-insights-ai/ui` to `0.14.0` and check the brand pages:

- `MenuItem` takes `href`, or `render={<Link to="/de" />}` for a router's link, the way `Button` does: a menu of places (languages, workspaces) holds real links that open in a new tab. `onSelect` is optional on a link item. A local wrapper that made a menu item navigate can go.
- The brand titles climb faster with the width of their head (`0.5rem + 8cqi` for a page title, `1rem + 4cqi` for a section title, same bounds), so a title in a half-width column no longer sits at its minimum. An app that overrode `--di-brand-title-size` or `--di-brand-section-title-size` to the same values can drop the override.

## Upgrade to 0.13.2

0.13.2 needs no code change. A folded `Disclosure` no longer lengthens the page: an absolutely placed descendant, such as the screen-reader status of a `CopyValue`, is now clipped with the rest of the body.

## Upgrade to 0.13.1

0.13.1 declares what the components already need: React 19 or newer (`react` and `react-dom` `>=19`). Components take `ref` as a prop, which React 18 ignores, so on React 18 a menu or popover never found its trigger. An app on React 18 upgrades React first; no code change is needed after that.

## Upgrade to 0.13

0.13 adds API and needs no code change; bump `@data-insights-ai/ui` to `0.13.0` and check the brand pages:

- **Button links through a router.** `Button` takes `render`, as `TextLink` does: `<Button render={<Link to="/pricing" />} variant="secondary">See pricing</Button>` navigates without a page load. A blocked link (`disabled` or `loading`) is an `<a>` without an address, as with `href`. `Breadcrumb` items and `FlyoutItem` take the same `render`.
- **Brand tier for questions and facts.** `Disclosure tier="brand"` sets a question at 18 px over a 16 px answer, for an FAQ. `FactList tier="brand"` sets any layout to be read: values at 16 px, a label beside them at 14 px, a caption above them at 12 px. A page that restyled `.di-disclosure-title` or replaced `FactList` with its own `<dl>` can switch back.
- **Brand titles follow their column.** The brand title (`PageHeader tier="brand"`), its section title, `PullQuote` and the hero `Figure` are sized by the width of the block they stand in, not the window's: a title in half a page is set for half a page. `PullQuote` takes the full width of its column.
- **Long words hyphenate.** Every heading hyphenates words of twelve letters or more in the language its `lang` names ("Sicherheits-produkte") instead of breaking them without a hyphen. Set `lang` on the document or the section.
- **Size variables.** Tune a size by its variable, never by restyling a class: `--di-brand-title-size`, `--di-brand-section-title-size`, `--di-brand-lede-size`, `--di-brand-quote-size`, `--di-figure-hero-size`, `--di-disclosure-title-size`, `--di-brand-disclosure-title-size`, `--di-brand-disclosure-body-size`, `--di-brand-fact-label-size`, `--di-brand-fact-caption-size`, `--di-brand-fact-value-size` and `--di-brand-fact-statement-size`. Set one on the element that holds the block, or on `:root`.
- **Phones.** Above a page title the breadcrumb shows the way back to the parent ("← Watchlists"), not the current page again. Side, centre and bottom dialogs follow the visible part of the window, so an on-screen keyboard no longer slides a sheet off the page behind it, and the page behind no longer scrolls in Safari. A date input keeps the width it is given.
- **Dialogs.** A dialog opened from an end-aligned table cell or toolbar reads from the start again. `DialogFooter note` says at the footer's start why the action waits ("Choose at least one permission"); put no text between the buttons.
- **A secret shown once.** `SecretReveal` shows a new API key or enrollment token: why to copy it now, the whole value left to right in a box of its own, and a "Copy key" button that confirms. Use it in place of a `Notice` over a `CopyValue`.
- **Notifications.** `FlyoutItem detail` adds a line under the title for where and by whom ("Production · Alex Admin"); unread entries keep their dot, so no unread badge is needed.
- **Breadcrumbs take the eyebrow's place.** A `PageHeader` with `PageHeaderCrumbs` no longer draws its `eyebrow`: a detail page names where it belongs once, in one line.
- **Switches.** A switch in `layout="row"` stays within a reading width (`--di-switch-row-width`, 36rem) of its label instead of the far edge of a wide form. A single switch in a form keeps the default `inline` layout, control first; `row` is for a column of settings.
- **Toolbars.** The search field shrinks before a filter wraps to a second row, and stops growing at 28rem.
- **Danger zone.** A `Panel tone="danger"` with `heading={2}` is named at a `DetailSection` title's size, so it reads as one more section of the page; its edge marks it.
- **More on a phone.** A tap on the bar's "More" before its popover has loaded opens it once loaded instead of being lost.

## Upgrade to 0.12

0.12 needs no code change; bump `@data-insights-ai/ui` to `0.12.0` and check the screens:

- **Sidebar.** Ivory `#fbf8f1` in daylight, a step lighter than the page; near black `#081221` after dark, a step deeper. The current page is marked by a gold edge (`--di-sidebar-mark`: gold 700 in daylight, gold 400 after dark).
- **Page head.** The page name scales with the head from 28 px on a phone to 34 px on a desk; the lede is 16 px. Leave a little more room above the fold on a phone.
- **Panels.** A `Panel` with `heading={2}` is a section of the page and names itself at 20 px; other panel titles stay at 16 px.
- **CopyValue.** A value of several lines (a command, a configuration) keeps its lines and indent and wraps at spaces; a one-line value still wraps only at address boundaries.
- **App bar (0.12.1).** The overflow menu of `AppShellBarEnd` loads when the end folds, not with the first page; a product that raised its first-page budget for the popover can lower it again.

## Upgrade to 0.11

0.11 merges many components into fewer and removes the old names and props outright: there are no aliases, wrappers or ignored props to fall back on. [MIGRATION-0.11.md](MIGRATION-0.11.md) lists each change as old → new with a short example, grouped by component, and the files in each product that change. The Storybook sidebar is regrouped into those fourteen groups, so story links change; imports from the package do not.

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

Components sit in `src/components`, one folder per Storybook group: Actions, Forms, Tables, Records, Figures, Text, Status, Feedback, Charts, Timelines, Layout, Navigation, Overlays and Shell. `Foundations/Start here` shows each group with the question it answers and a live example.

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
