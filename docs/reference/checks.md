# Checks

What each command runs and what fails it. All checks fail on any finding; there is no list of tolerated ones.

| Command | Runs |
| --- | --- |
| `pnpm format` / `pnpm format:check` | Prettier, print width 120 (`.prettierignore` leaves `*.md` and `*.mdx` alone) |
| `pnpm lint` | ESLint with `--max-warnings 0`: typescript-eslint, the React hooks rules, jsx-a11y. A rule is never switched off for the repo; an exception is `eslint-disable-next-line <rule> -- <why>` |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm test` | `scripts/test.mjs`: the Vitest projects `unit`, `layout`, `storybook`, `storybook-dark`, `storybook-phone`, `storybook-compact` in one run; `TEST_PAGES=n` in a gitignored `.env.local` runs each project on its own on `n` pages |
| `pnpm exec vitest run --project=unit` | only `src/**/*.test.ts` in Node |
| `pnpm lint:tokens` | `scripts/lint-tokens.mjs` over `src` (table below) |
| `pnpm lint:structure` | dependency-cruiser, `scripts/lint-layers.mjs`, `scripts/lint-conventions.mjs`, `scripts/lint-docs.mjs` (below) |
| `pnpm build` | `lint:structure`, `lint:tokens`, the Vite library build to `dist/lib`, `scripts/build-styles.mjs`, `scripts/check-treeshake.mjs`, `scripts/check-api.mjs` |
| `pnpm build-storybook` | the static site to `dist/storybook` |
| `pnpm check` | `format:check`, `lint`, `typecheck`, `test`, `build` |

CI (`.github/workflows/ci.yml`) runs `format:check`, `lint`, `typecheck`, `test`, `build` and `build-storybook` on every push; on a tag `v*` it also publishes ([Release](../how-to/release.md)).

## Token rules (`lint:tokens`)

| Rule | Fails on |
| --- | --- |
| `space` | A `gap`, `padding` or `margin` that is not a `--di-space-*` token. The ramp is 2, 4, 6, 8, 12, 16, 24, 32, 48, 64, 96, named by value |
| `radius` | A hand-set `border-radius` in px, rem or em. Use `--di-radius-micro`, `-control`, `-surface`, `-container` or `-pill` |
| `type` | A raw `font-size` in px, rem or em. Use a `--di-font-size-*` step |
| `size` | A raw length in component CSS (`src/components`, `styles/primitives.css`). Use a density token or a fixed measure from `component.css`. Exempt: values of 1px or less, borders, outlines and their offsets, strokes, underline offsets, a box-shadow ring of 2px or less, media and container query conditions |
| `colour` | A hex literal in a component |
| `layer` | A component binding to a primitive token (`--di-navy-900`, `--di-font-mono`) instead of a semantic role or a slot |
| `focus-ring` | An `outline` or `outline-offset` off the model: `outline: var(--di-focus-ring-width) solid var(--di-focus-ring-color)` or `none`; an offset of `var(--di-focus-ring-offset)`, `var(--di-focus-ring-inset)` or `0` |
| `api` | A prop typed `ReactNode` in `src/components` other than `children`, an option's `icon` or `Menu.trigger` |
| `token` | Only in a product (`di-lint-tokens`): a `--di-*` property set that is not a slot `component.css` declares |

The package ships the lint as `di-lint-tokens <dir>…` for a product's `.css` files, with the rules `space`, `radius`, `type`, `colour`, `layer`, `focus-ring` and `token`. An exception is a comment the lint reads: `/* di-lint-allow <rule>: <reason> */` above a block, or `di-lint-allow-file <rule>: <reason>` at the top of a file.

## Structure rules (`lint:structure`)

- `.dependency-cruiser.cjs`: no import cycles; no component imports a screen, a Foundations page or the Storybook chrome; `src/internal` imports nothing that is drawn; another folder reaches a component or a shared module only through its `index.ts`, while a component's own sub-folders reach each other directly; screens import from the package root (`src/index.ts`). `*.sample.ts` is exempt.
- `scripts/lint-layers.mjs`: every story meta carries one layer tag and a module never imports one from a higher layer; a story file, its folder and its meta `component` share one name and the title mirrors the folder; a module is one sidebar entry; every public component is rendered in a story and has a doc comment; every title's group is one `storySort` in `.storybook/preview.tsx` lists; no two component folders import each other; no folder below `src/components` holds more than eight entries.
- `scripts/lint-conventions.mjs`: every component `.design-sync/conventions.md` names is exported, every group and story title it names exists, and it lists every sidebar group.
- `scripts/lint-docs.mjs`: every story file under `src/components` has the `autodocs` tag, and no doc comment runs an inline code span over a line end or escapes a backtick.
- `scripts/check-api.mjs`: the package entry and its class names match `scripts/public-api.json`; `--write` records an intended change.
- `scripts/check-treeshake.mjs`: importing one component does not pull in the others.

## Story-test passes (`pnpm test`)

`vitest.config.ts` runs every story as a test in Chromium, in four passes, each check only where it can find something:

| Project | Theme, width, density | Checks |
| --- | --- | --- |
| `storybook` | light, desk | all surface checks, contrast, focus, axe |
| `storybook-dark` | dark, desk | contrast, axe |
| `storybook-phone` | light, 390px | all surface checks, contrast, focus, axe |
| `storybook-compact` | light, desk, compact | surface checks |
| `layout` | | `src/**/*.browser.test.tsx` and `.storybook/**/*.browser.test.ts`: page widths at 1920, 2560, 3440 and 390; chart motion; the contrast harness's own fixtures |
| `unit` | | `src/**/*.test.ts`, among them `src/styles/tokens/zones.test.ts` (neighbouring tone steps at least 3 apart in L\*) |

The checks live in `.storybook/tests`: `surfaces/` (nesting, clearance, spacing, toolbar heights, underlines), `contrast/` (text at several points per line, chart marks from `markContrast.ts`), `focus/` (Tab and arrow movement, ring geometry and contrast). `FOCUS_REPORT=1 pnpm test` prints the focus findings per story instead of failing. [How the story tests judge a component](../explanation/story-tests.md) says what each one measures and why.
