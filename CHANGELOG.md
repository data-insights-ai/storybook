# Changelog

Each release, newest first: what changed and what a product has to do to take it. Releases before 0.24.0 are described by their tags' commits.

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
