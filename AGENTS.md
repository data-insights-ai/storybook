# datAInsights Storybook

This repository is the component workbench for the datAInsights brand. It is not a product. Stories, chrome, and sample copy do not name a product, a suite, or a codename. Screens under `src/screens` show patterns a product can be assembled from.

A designer reviews work in Storybook (`pnpm storybook`, port 4500). Change what Storybook shows. Leave the installable package and the licence intact unless a release was asked for.

## Public repository

The git repository is public: https://github.com/data-insights-ai/storybook

A commit is world-readable. Git history stays public after a later edit. The installable package `@data-insights-ai/ui` on GitHub Packages is private. That privacy covers the package only. It does not cover this repository.

Commit work that can stay public: brand tokens, components, stories, invented sample copy, and the licence.

Keep these out of files, stories, comments, commit messages, and workflow logs:

- Real people, their companies, their domains, and their personal addresses
- Customer names, customer data, and unpublished product or project names
- Credentials, tokens, `.env` values, and internal hostnames
- Paths or links into private repositories
- Screenshots or exports that show a real account

Sample people use invented names. Their email addresses are `name@data-insights.ai`. The current sample operator is Nora Feld, `nora.feld@data-insights.ai`.

`LICENSE` stays the datAInsights GmbH notice. All rights reserved. Do not replace it with an open-source licence.

## Where work goes

| Change | Where |
| --- | --- |
| Colour, type, radius | `src/styles/tokens` |
| A control’s look | that component’s CSS, using semantic `--di-*` tokens |
| A new reusable control | `src/components`, a story beside it, an export from `src/index.ts` |
| A console example | `src/screens`, composed from components |
| Storybook chrome (checklist, theme, test wrapper) | `.storybook` |

`pnpm build` writes the package to `dist/lib` as one module per component, so an app can tree-shake. `sideEffects` lists CSS only. `pnpm build-storybook` writes the static site to `dist/storybook`. Both directories are gitignored. A component that is not exported from `src/index.ts` is absent from the package a product installs. Do not fold the components back into a single JavaScript file, and do not inline the font files into the stylesheet.

Tokens are three layers. Primitive values live in `primitive.css`. Semantic roles (`--di-text`, `--di-bg-page`, status, sidebar) live in `semantic.css`, with a dark remap under `[data-theme="dark"]`. Component slots such as `--di-button-primary-bg` live in `component.css`. A component binds to a semantic or component token. It does not name a primitive colour, typeface, or radius.

## Brand

The datAInsights brand book is the source for colour, type, and the mark.

- Navy is the voice. Ivory is the page. Ink is body text. Gold is one moment per view: the tittle in the mark, or a single eyebrow.
- Small gold text on ivory uses Gold 700 (`#7C5F17`). Gold 600 does not clear WCAG AA at that size. Gold text on navy uses Gold 400.
- Paused uses the gold ramp (Gold 700 `#7C5F17` on ivory, Gold 400 on navy). Running is `#186D41` on wash `#E0E7DC`. Failed is `#AB2E37` on wash `#F1E0DB`. Those are the console hues, and each word stays above 5:1. Keep this set. A second yellow, or a generic traffic-light green or red, breaks the console.
- Sansation is display and figures. IBM Plex Sans is the interface. IBM Plex Mono is identifiers, timestamps, and eyebrows.
- The console uses those families at a denser size than the editorial scale in the brand book.
- Motion stays under 240ms, ease-out, one change at a time.

The sign-in card pins the light console colours, including in the dark theme, because it sits on the navy painting. Text on that painting (the kicker, the footer) has its own solid navy background. Text on the dotted canvas (the window title) has a solid background too. Contrast has to be measurable.

## Stories and components

- Every visible string is a prop. Storybook stories are written in English. A product passes its own language in from outside. Components ship with no baked-in language.
- A React node (an icon, an action, table rows and cells) is a child slot, filled in the story `render`, with `control: false`. `PageHeader` puts trailing content in `children`. `SectionTitle` puts the trailing text in `children`. `Notice` uses `NoticeIcon`, `NoticeTitle`, `NoticeBody`, and `NoticeAction`. `Button` takes the icon as its first child. `TextField` puts the label-side slot in `children`. `CellLead` takes a `CellIcon` child.
- `DataTable` does not take a `rows` array. The caller maps its own data into `TableHead`, `TableBody`, `TableRow`, and `TableCell`. The table supplies the frame, the caption, and an optional footer slot.
- `Pagination` is controlled. The caller owns `page` and which rows are visible. Previous and next call `onPageChange` with the next page.
- String props stay on `args`, so Controls can change the copy.
- A boolean prop is always `true` or `false` in `args`. An unset boolean shows “Set boolean” instead of a toggle. Use the component’s real default: `dot: true`, `padded: true`, `disabled: false`.
- Helper text is a string, default `""`. An unset node becomes an object control, and Edit then breaks the field.
- A select or radio (`variant`, `size`, `tone`, `type`) has one option chosen in `args`. Use the component’s real default: `variant: "primary"`, `size: "md"`, `tone: "neutral"` or `"info"`, `type: "button"` or `"text"`.
- Event listeners (`onRemove`, `onClick`, and any other `on…` prop) stay callback props. `.storybook/preview.tsx` excludes `/^on[A-Z].*/` from Controls and records the calls as actions. A play function that asserts the call passes `fn()` from `storybook/test`.
- Buttons, fields, and tables stay native elements. Add a headless library when a control needs roving focus or a popup (a menu, listbox, combobox, or dialog), and not before.
- Screens are compositions. They stay inside the Storybook canvas: no fixed min-width wider than the preview. Tables scroll inside their own frame.
- Storybook’s Get started checklist, the menu guide, and the “what’s new” notification stay off in `.storybook/main.ts`.

## Checks

Visible text meets WCAG AA. Status is a word plus a mark, not colour alone. An icon-only button has an accessible name. Focus is visible: navy on ivory, gold on the navy sidebar.

A screen has one `main` and one `h1`. Component stories get that wrapper from `.storybook/preview.tsx` when the story does not render its own heading. `pnpm test` fails on axe violations. The Accessibility panel also counts inconclusive results, so a gradient or a dotted background behind text still counts as a failure to fix in the markup.

Before handing work back, run `pnpm typecheck` and `pnpm test`. Run `pnpm build` when a public component or `src/index.ts` changed.

## Release

`version` in `package.json` and the git tag are the same number: `0.1.0` is the tag `v0.1.0`. Pushing that tag publishes `@data-insights-ai/ui` to GitHub Packages. A visual change on `main` does not publish. Push a tag only when a release was asked for.
