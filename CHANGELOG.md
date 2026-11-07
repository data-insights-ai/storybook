# Changelog

Each release, newest first: what changed and what a product has to do to take it. Releases before 0.24.0 are described by their tags' commits.

## 0.24.0

- `di-lint-tokens <dir>…` is a bin of the package: the token lint for a product's stylesheets. It also fails on any `--di-*` property a product sets other than the slots in `component.css` (rule `token`). `type` and `radius` now catch rem and em as well as px. See the README, "Check a product's stylesheets".
- `--di-disclosure-gap`, the step from a `Disclosure`'s head to its body, is a slot in `component.css`, so a page may tune it.
- `data-brand` on a region also draws `--di-chart-series` in the seal's ink: a product's signature chart on its brand surface takes the gold from the system instead of re-pointing the token.
- Upgrade: replace a re-pointed `--di-chart-series` with `data-brand` on the chart's region, and bind `--di-font-code` where a stylesheet named `--di-font-mono`.
