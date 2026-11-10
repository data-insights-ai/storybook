# datAInsights design system

This repository is the component workbench for the datAInsights brand. It is not a product: stories, chrome and sample copy name no product, suite or codename. A designer reviews work in Storybook (`pnpm storybook`, port 4500); change what Storybook shows.

## Read before you change

The docs under `docs/` are binding, not background. Before:

- **any change to a component's look or a screen:** [docs/explanation/register.md](docs/explanation/register.md) (the brand and the rules that follow from it);
- **a new component, a new prop or a rename:** [docs/how-to/add-a-component.md](docs/how-to/add-a-component.md) and [docs/explanation/api-rules.md](docs/explanation/api-rules.md);
- **a pattern screen or advice to a product on composing one:** [docs/how-to/compose-a-product-screen.md](docs/how-to/compose-a-product-screen.md); the screens under `src/screens` follow it, copy from them, not from memory;
- **a failing check you do not understand:** [docs/reference/checks.md](docs/reference/checks.md) and [docs/explanation/story-tests.md](docs/explanation/story-tests.md);
- **a release:** [docs/how-to/release.md](docs/how-to/release.md).

## Where work goes

| Change | Where |
| --- | --- |
| Colour, type, radius, space, density | `src/styles/tokens` (primitive values, semantic roles, component slots, density) |
| A control's look | that component's CSS, bound to semantic `--di-*` roles or its slots in `component.css`, never a primitive, a hex or a raw size |
| A new reusable control | its group folder in `src/components`, a story beside it, an export from `src/index.ts`, its line in `.design-sync/conventions.md` |
| A chart | `Chart` wraps one Recharts chart; the one drawn chart is `EventTimeline`. No one-off SVG chart |
| An icon | `Icon` with one Lucide icon as its child, imported by name from `lucide-react`; never the `icons` namespace or a `name` prop |
| A console example | `src/screens`, composed from public components; a `null` for its title in `.design-sync/config.json` |
| Storybook chrome (checklist, theme, test wrapper) | `.storybook` |
| A rule the design agent needs | `.design-sync/conventions.md`, in the same change as the component or group it names |

Build from the components that exist. When something is missing, add it to the library; never one-off markup inside a screen.

## Checks and the gate

Before handing work back, run `pnpm check`: `format:check`, `lint`, `typecheck`, the story tests and the unit tests, then `pnpm build` with `lint:structure`, `lint:tokens` and the API check. All of them fail on any finding; a change that cannot pass changes the structure or the rule with a stated reason, never the check's input. Prettier formats the code (`pnpm format`); ESLint is at zero findings, and a rule is never switched off for the repo: a line that needs an exception carries `eslint-disable-next-line <rule> -- <why>`. A lint exception in CSS is `di-lint-allow <rule>: <reason>`.

## Storybook for agents

`pnpm storybook` serves the MCP addon at `http://127.0.0.1:4500/mcp` (`.mcp.json` points there); it answers only while that process runs. Before using a component, call `docs-list`, then `docs-show` for it. Before writing or changing a story, call `get-storybook-story-instructions`. After a UI change, call `test-run`. When a tool's suggestion differs from the docs, the docs decide. Do not add `@storybook/addon-essentials`, `@storybook/addon-links` or a coverage or Chromatic addon unless asked.

## Dependencies and release

npm packages are installed only 7 days after their release (`minimumReleaseAge` in `pnpm-workspace.yaml`). Only a security fix for an advisory that affects what the package ships may skip the wait: add exactly that `name@version` to `minimumReleaseAgeExclude` after checking the release (its diff against the previous version, the usual publisher, provenance where the package publishes it, no new install scripts), name the check in the commit, and remove the entry once the version is 7 days old. Fixes for development tooling wait.

A release is the version bump, its `CHANGELOG.md` entry and the tag `vX.Y.Z` pushed to GitHub; CI publishes. Never publish from a machine, and push a tag only when a release was asked for. There are no deprecated exports: a rename takes the old name out in the same version and the changelog carries old → new. The changelog names no consumer, product, repository or file of a consumer.

## Public repository

The git repository is public: https://github.com/data-insights-ai/storybook. A commit is world-readable and stays so after a later edit. The package `@data-insights-ai/ui` on GitHub Packages is private; that privacy covers the package only.

Commit what can stay public: brand tokens, components, stories, invented sample copy, the licence. Keep out of files, stories, comments, commit messages and workflow logs: real people, their companies, domains and personal addresses; customer names and data; unpublished product or project names; credentials, tokens, `.env` values and internal hostnames; paths or links into private repositories; screenshots or exports that show a real account. Sample people use invented names with `name@data-insights.ai` addresses; the current sample operator is Nora Feld, `nora.feld@data-insights.ai`. `LICENSE` stays the datAInsights GmbH notice; do not replace it with an open-source licence.

## Documentation

Keep documentation small and true: update it in the same change as the code, and rewrite or delete what is no longer accurate instead of appending. No status logs, plans or hand-off files in the repo.

| File | Content |
| --- | --- |
| `AGENTS.md` | working rules (this file) |
| `README.md` | what the repo is, in a few lines |
| `docs/README.md` | the index of the documentation |
| `docs/tutorials/` | learning by doing: run Storybook, a first product screen |
| `docs/how-to/` | one task each: install, compose a screen, check a product, add a component, release |
| `docs/reference/` | facts: component groups, checks, pattern screens; Storybook and the token files are the reference for components and values |
| `docs/explanation/` | why: the Register, the API rules, the package architecture, the story tests |
| `CHANGELOG.md` | per release, what changed and what a product has to do (shipped in the package) |
| `.design-sync/conventions.md` | what the design agent on claude.ai reads; `.design-sync/NOTES.md` what the sync tool's operator needs |
