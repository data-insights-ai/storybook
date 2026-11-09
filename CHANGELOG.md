# Changelog

Each release, newest first: what changed and what a product has to do to take it. Releases before 0.24.0 are described by their tags' commits.

## 0.29.0

- `Split` (`rail`, the default) puts the aside beside the main column by the split's own width, not the window's: once the main column keeps 40rem beside the 320px rail (about 984px of split). An app sidebar beside the split now counts, so a strip of tabs or a timeline in the main column is no longer squeezed between the two. Narrower, the aside follows the main column, or comes first with `asideFirst`. The rail split now stands in a frame (`.di-split-frame`, the container it is measured by), as the `list` split already did; `className` goes on that frame.
- A stacked `DataTable` card wraps the name and the scope of each tag in a compact `TagList` (`max`) inside the tag instead of cutting them; in a grid row they keep one line as before.
- Upgrade: a product that styled a rail split through `className` or a selector on `.di-split` checks that it still applies to the frame or to the split inside it.

## 0.28.1

- A `layout="measured"` table (`DataTable`, `InfiniteTable`, `CursorTable`) measures its columns again once it turns out to scroll sideways. A pill or tag beside a pinned filling name is no longer cut when the page opens at a width where the grid scrolls.
- `Sidebar` group labels wrap onto a second line instead of being cut at the sidebar's edge.
- Upgrade: nothing to change.

## 0.28.0

- `EventTimeline` and `TimelineSummary` draw categorical series, not severity tones. The caller declares `series: TimelineSeries[]` (`{ id, label }`, at most six); stacking and the key follow that order, and series i is drawn in `--di-chart-category-(i + 1)` (new tokens, light and dark, none red, orange or gold). `TimelineBar` counts per series id (`counts`), `TimelineEvent` and `TimelineCell` name their `series`, and every event's line has one length. `TimelineEpisode` carries `counts` and stretches per series; a summary row names its series in an inline `ChartKey` instead of a severity mark. What is not declared is not drawn, picked or counted, and a bar target is the caller's own bar; a bucket with nothing drawn is a `gap`. `ChartKey` takes `inline`.
- Upgrade: replace `toneLabels` with `series`; build bars as `{ start, end, counts }`, events and cells with `series` instead of `tone` (drop `magnitude`); drop `tone` and `toneLabel` from `TimelineSummaryEpisode`; read episode counts from `counts`; `TimelineTone` and the `--di-tsummary-severity` slot are gone.

## 0.27.0

- `@data-insights-ai/ui/checks`: the on-a-surface rule for a product's pages, as a script a browser test runs in its page (`page.evaluate(surfaceScript())`), with `SURFACES` and `GROUND`. Content stands on a surface (a strip `FigureRow` is one); only the page's frame stands on the bare ground, and the page's footer is the `footer` that ends `main`. A footer anywhere else, and a footer `FigureRow` on the ground, are findings. The entry imports no component or stylesheet. See the README, "Check a product's pages".
- Upgrade: replace the product's own copy of the rule with `surfaceScript()`; move a note that stands in a `footer` inside the page into a `Notice variant="line"` or the page's footer.

## 0.26.0

- `LoadError` counts down a wait of a minute or less and names the time a longer one ends (an hourly or daily allowance), in `locale`. Upgrade: `LoadErrorLabels.retryAfter` takes the seconds only; add `retryAt(time)`, and pass `locale`.

## 0.25.0

The list and feedback pieces the products each drew themselves, combined from all of them:

- `CursorTable`: an `InfiniteTable` fed by a server cursor list, with a skeleton while the first page loads, `CursorTableFailed` for a list that could not be read, `CursorTableEmpty` on a surface for a list that never held a row, and the table with its head kept and a `TableEmpty` child while a filter matches nothing; group rows and counted entries as `InfiniteTable` has them.
- `FilterSelect`, `FilterTags` and `RangeFilter` for a `FilterBar`: each reads its label in the bar and shows it in the sheet, whose copy takes its own id.
- `periodOf`, `periodSearch` and `anyTime`: a list's period in the URL with a default period, "any time" kept as `range=all`; `usePeriod` fixes a period's instants when it is chosen, so later pages read the same range, and moves a preset on a new `now`.
- `toast()`, `dismissToast()` and `Toasts`: receipts from anywhere, with one action or a download; a receipt stays while the reader points at or focuses it.
- `LoadError` (a failure in plain words, try again that waits out a rate limit and says how long, a reference to copy), `RouteBoundary` (a new `resetKey` tries the page again) with `PageFailure`, and `StaleNotice` (a list behind the server, announced once, focus to its heading after reading again).
- `ResourcePath` (where a record lives, each part linked while it exists, the app's router link through `renderLink`) and `TechnicalDetails` (raw identifiers to copy, empty ones left out).
- Upgrade: replace the product's own copies of these; nothing existing changed.

## 0.24.0

- `di-lint-tokens <dir>…` is a bin of the package: the token lint for a product's stylesheets. It also fails on any `--di-*` property a product sets other than the slots in `component.css` (rule `token`). `type` and `radius` now catch rem and em as well as px. See the README, "Check a product's stylesheets".
- `--di-disclosure-gap`, the step from a `Disclosure`'s head to its body, is a slot in `component.css`, so a page may tune it.
- `data-brand` on a region also draws `--di-chart-series` in the seal's ink and `--di-chart-highlight` in the text's ink, so the one value still differs from every series: a product's signature chart on its brand surface takes the gold from the system instead of re-pointing the tokens.
- Upgrade: replace a re-pointed `--di-chart-series` with `data-brand` on the chart's region, and bind `--di-font-code` where a stylesheet named `--di-font-mono` (the `layer` rule now checks products).
