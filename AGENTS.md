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
| A chart | `Chart` wraps one Recharts chart. `ChartConfig` names each series and sets its colour; `Chart` exposes that colour as `--color-<key>`. `ChartTooltip` and `ChartLegend` read the same config. Colours are `--di-chart-series`, `--di-chart-accent` (one value), `--di-chart-muted`, and `--di-chart-band`. Do not draw a one-off SVG chart. |
| An icon | `Icon`, with one Lucide icon as its child. Import that icon by name from `lucide-react` (`import { Search } from "lucide-react"`). `Icon` does not import the set, so the app keeps only the icons it renders. Do not import `lucide-react`’s `icons` namespace, and do not add a `name` prop that maps to every icon. |
| A console example | `src/screens`, composed from components |
| Storybook chrome (checklist, theme, test wrapper) | `.storybook` |

`pnpm build` writes the package to `dist/lib` as one module per component, so an app can tree-shake. `sideEffects` lists CSS only. `pnpm build-storybook` writes the static site to `dist/storybook`. Both directories are gitignored. A component that is not exported from `src/index.ts` is absent from the package a product installs. Do not fold the components back into a single JavaScript file, and do not inline the font files into the stylesheet.

There is one name per value in the token files too. `--di-accent` was an alias of `--di-seal`, and `--di-font-display` and `--di-font-body` were second and third names for `--di-font-ui`; all three are gone. Type runs `--di-font-size-100`…`-1000`, and the top two steps are the display tier the brand pages use — a product screen never goes above `--di-font-size-700`.

Tokens are three layers. Primitive values live in `primitive.css`. Semantic roles (`--di-text`, `--di-bg-page`, status, sidebar) live in `semantic.css`, with a dark remap under `[data-theme="dark"]`. Component slots such as `--di-button-primary-bg` live in `component.css`. A component binds to a semantic or component token. It does not name a primitive colour, typeface, or radius.

## Brand

Foundations in this Storybook are the source for applying the brand. Colour, type, scale (space, radius, control height, the index column), the mark, voice, motion, the Register rules and the decision record behind them are written there. Do not send a designer or an agent to a separate brand book, and do not copy personal contact details into these pages.

The system is the **Register**: the surface is a record, not a dashboard. Everything below follows from that.

- Warm paper (`--di-paper` `#F4F1E8`) is the page. Sheet (`#FCFBF7`) is a panel, a field, a card. Grid (`#FFFFFF`) is the one cold surface, for a table only. Rule (`#DCD5C3`) is a hairline, never a fill.
- Navy (`#0A1F44`) is the ink **and** the action. There is no invented accent: the one filled control on a sheet is navy, so it is never unclear which button commits. After dark the fill turns gold, because navy cannot act against a navy ground. That is the only exception.
- Gold means sealed, not important. A filled dot (`--di-seal` `#C9A24A`) is a value that was recorded and can be verified. A hollow ring (`--di-ai-ring` `#A6811F`) is a value a model inferred, with nothing vouching for it. No mark means nothing is on record. The mark is never the only channel: the word beside it carries the meaning too.
- Small gold text on paper uses Seal ink (`#7A5C0E`). Gold 500 and Gold 600 are marks, not type — Gold 600 on paper does not clear AA at small sizes, and on ivory it needs `#061631` rather than navy to clear it. Gold text on navy uses Gold 400.
- Status is verified `#155230` on wash `#E7EFE5`, anomaly `#6E4708` on `#F7EDD5`, critical `#8A1B1B` on `#F8E6E2`, recorded `#0A1F44` on `#E6E9F0`. Anomaly runs on the gold ramp rather than inventing a second yellow. Each word stays above 5:1. Keep this set; a generic traffic-light green or red breaks the register.
- Space Grotesk is everything a person reads as prose. JetBrains Mono is everything a machine wrote: identifiers, hashes, timestamps, measured values, and § marks. Which track a string sits in states where it came from. Figures are tabular.
- Radii are moderate: 4px for anything that takes a value (fields, selects, checkboxes), 6px buttons, 8px panels, 12px a frame holding panels. Control heights are 28 / 32 / 36px, and 32 is the standard. Space is `--di-space-1`…`-7`: 4, 8, 12, 16, 24, 32, 48. `Foundations/Scale` draws all three ramps.
- Depth is drawn with a 1px rule. Only a detached plane — a menu, a modal, a toast — gets a shadow, and a technical one. No blur behind text: a mono value behind frosted glass has no measurable contrast.
- The one ornament is the 8px tick rule (`.di-tick-rule`), and it only closes a block that reports a measurement.
- Motion runs at one of two durations and no others: `--di-duration` 120ms and `--di-duration-slow` 200ms, ease-out, one change at a time. A waiting indicator is the exception and loops until the wait ends: `Spinner` turns, `SkeletonTable`'s bars breathe on opacity, staggered by row. Even there nothing sweeps — a gradient travelling over a register is the one loading animation every other tool in this field already uses. A modal fades and settles one step (`@starting-style` plus `allow-discrete`, so it animates out as well as in), a drawer arrives from its own edge, a menu drops 4px, a toast rises 10px. Nothing scales and fades at once, and `prefers-reduced-motion` drops all of it in `base.css`.
- A toast runs on navy, not on paper: it is the system reporting back, not another entry on the sheet. It re-points its own tokens so a `Button` in the action slot reads on that ground.

Every panel, table, drawer, notice and empty state carries a 38px index column (`--di-index-col`) holding an ordinal, a letter or a § mark. It is the system's fingerprint. A drawer keeps the ordinal of the row it opened from. A failure keeps its ordinal, tinted.

Focus is navy on paper and gold on the night sheet and the navy rail. The prototype rang every focus in seal gold; gold on paper measures 2.1:1, under the 3:1 a focus indicator has to clear, so the ring follows its ground instead.

Nothing a model proposes runs before an operator confirms it, and the confirmation states basis, scope and reversibility first. What follows is a receipt carrying an audit id (`Toast`), never an undo.

The sign-in card pins the daylight colours, including in the dark theme, because it sits on a navy sheet either way. Text on that sheet (the footer) has its own solid navy background. Text on the dotted canvas (the window title) has a solid background too. Contrast has to be measurable.

## Stories and components

Every component lives in `src/components`; the story `title` decides where it lands in the sidebar, and there are five groups:

- `Primitives/` — **a leaf: it exposes no slot a caller fills with a component.** It renders the text, figures and marks it was handed and nothing else can go inside it. Button, Badge, StatusPill, Chip, Icon, IconTile, Seal, Eyebrow, Kbd, TickRule, TextLink, VersionTag, KeyValues, Bars, Sparkline, Distribution, Pagination, Breadcrumb, Stepper, Tooltip, Waiting/{Progress,Skeleton,Spinner}.
- `Forms/` — a labelled control: TextField, SearchField, Select, Checkbox, Radio, Switch, SegmentedControl, FieldHint.
- `Blocks/` — **it holds something**: it composes other components, or it exposes a slot for them. Panel, DataTable, Notice, Toast, Modal, FactList, Drawer, Menu, Tabs, EmptyState, StatTile, Metric, LivingCard, CommandBar, SignIn and the rest.
- `Patterns/` — a whole arrangement: AppShell, Layout.
- `Screens/` — a console example, composed from the above.

The test is one question: **can another component go inside it?** `KeyValues` holds `KeyValue`, and `KeyValue` takes two strings — nothing else fits, so it is a Primitive. `Stat` looks just as small, but its `children` holds a `StatusPill` on the Watchlist screen, so it is a Block. `Pagination` and `SkeletonTable` are bulky and still Primitives: you place them into a frame, they frame nothing. Size is not the axis; what can be put inside is.

One sidebar entry is one component, and **one module is one component**. An independent component does not share a file with another one: `pnpm build` emits a module per file, so `Breadcrumb` living in `Tabs.tsx` means a product importing a breadcrumb also ships `Tabs` and `Stepper`. Where several are one family they get a folder rather than one merged entry (`Primitives/Waiting/Progress`, `/Skeleton`, `/Spinner`; `Blocks/Inference/Explain`, `/Confirm`, `/Confidence`, `/Privacy`; `Patterns/Layout/Stack`, `/Grid`, `/Numbered`, `/Toolbar`).

A sub-component that only exists inside its parent — `TableCell`, `NoticeTitle`, `PanelFooter`, `ModalIcon` — stays in the parent's file and the parent's entry. The test is whether anything else imports it: `FactList` sat in `Modal.tsx` until the Register screen used it inside a `Drawer`, which is the moment it stopped being Modal's.

Every export in `src/index.ts` appears in a story. An export with no story is in the package and invisible to the designer. A story meta's `component` is the component that story renders: three components under one meta make the Docs page and Show code describe the wrong one.

There is one name per thing. `RingDot` was an alias for `<SealMark state="inferred" />`; two names for one mark is the same failure as two props for one line of hint text.

A Drawer belongs in `Blocks/` because it contains Buttons and StatusPills; a Button belongs in `Primitives/` because it contains nothing. When a component grows to hold another one, move its title.

`.storybook/preview.tsx` sorts those groups in that order and everything inside them alphabetically **by title, not by file name** — `Choice.stories.tsx` is titled `Forms/Checkbox`. Stories inside one file keep the order the file declares. Storybook reads that comparator out of the file and evaluates it on its own, so it has to be plain JavaScript with no type annotations and no references to anything outside it.

Anything with a transition gets a story that runs it: `Blocks/Toast` → Arriving, `Blocks/Modal` → Transition, `Blocks/Drawer` → Transition, `Primitives/Waiting/Skeleton` → Resolving, `Primitives/Waiting/Progress` → Counting. A play function that asserts on an element mid-animation has to use `waitFor`, because the element starts at `opacity: 0`.

### The one API rule

Ask what can go in. **Only ever text → a `string` prop. Anything that can hold a component → a slot.** No prop is typed `ReactNode`; that type is the sign the decision was never made.

A slot is a named sub-component written as a child, `<Parent><ParentSlot>`: `NoticeIcon`, `PanelFooter`, `TableToolbar`, `ChannelValue`, `SessionMark`, `ToastAction`, `ConfirmActions`. React has no `<slot>`, so the frame places its slots with CSS grid areas and the caller may write them in any order. Two frames cannot: `DataTable` (a `<div>` is invalid inside `<table>`) and `ModalFrame` pick their slots out of `children` by type, and each says so in a comment.

Where a component takes exactly one leading node, that node is the first child and there is no slot for it — `Button`, `CommandRow`, `PrivacyBadge`, `Icon`. `TextField` puts the label-side slot in plain `children`, because the field has only one.

Two `ReactNode`s survive on purpose, and only these two. `NavItem.icon` is a field on the `ConsoleChrome` data a product hands the shell, not a slot on a component. `Menu`'s `trigger` is a render prop, because the menu has to put its own `aria-expanded` and ref onto a button the caller owns. Anything else typed `ReactNode` is a decision that was skipped.

A variant is one union prop, never a family of booleans or a second prop that can contradict the first: `hintTone`, not `hint` plus `error` plus `sealHint`; `layout`, not `inline` plus `split`.

`tone` names one axis and one only: status on the shared ramp, `neutral | ok | warn | danger`, plus `recorded` and `inferred` on `StatusPill`. What is not a status carries its own name — `surface` on `Panel`, `scope` on `PrivacyBadge`, `state` on `CommandChip`, `level` on `ConfidenceField`, `variant` on `Button` and `IconTile`. `neutral` is the word for “nothing special”; `default` and `info` were two more words for it and are gone. The hollow ring is `inferred` wherever it appears, never `ai`, and gold as a value is `seal` — a public prop does not name a colour.

A line that reports a measured value is a slot, not a string. A count, a timestamp, a version, a delta, a caveat or a basis arrives sealed, in the mono track, or with a state beside it, and a `string` can carry none of that: `PanelMeta`, `StageFooter`, `ExplainFooter`, `MetricNote`, `RecordCount`, `SessionDetail`, `StatTileDelta`, `LivingBasis`, `SignInVersion`. Prose a person reads — `title`, `label`, `caption`, `legend`, `body` and every `*Label` accessible name — stays a string. A field says one thing at a time, so `TextField` and `Select` take one `hint` string and one `hintTone` of `neutral | sealed | error`, and `error` also sets `aria-invalid`.

A control mark centres on the **first line** of its label — never on the whole block, never on the label's top edge. `--di-choice-line` is that line, and `Checkbox`, `Radio` and `Switch` all bind to it. `Switch` defaults to `layout="inline"`, the checkbox's geometry; `layout="row"` is the settings column, and the distance it opens is that column, not slack.

- Every visible string is a prop. Storybook stories are written in English. A product passes its own language in from outside. Components ship with no baked-in language.
- A slot is filled in the story `render`, with `control: false`.
- `DataTable` does not take a `rows` array. The caller maps its own data into `TableHead`, `TableBody`, `TableRow`, `TableIndex`, and `TableCell`. The table supplies the frame and the caption; `TableToolbar` and `TableFooter` are slots the caller writes as children. Its scroll container is a named, focusable region, because a scrollable area has to be reachable from the keyboard.
- `Pagination` is controlled. The caller owns `page` and which rows are visible. Previous and next call `onPageChange` with the next page.
- String props stay on `args`, so Controls can change the copy.
- A boolean prop is always `true` or `false` in `args`. An unset boolean shows “Set boolean” instead of a toggle. Use the component’s real default: `dot: true`, `padded: true`, `disabled: false`.
- Helper text is a string, default `""`. An unset node becomes an object control, and Edit then breaks the field.
- A select or radio (`variant`, `size`, `tone`, `type`) has one option chosen in `args`. Use the component’s real default: `variant: "primary"`, `size: "md"`, `tone: "neutral"`, `type: "button"` or `"text"`.
- Event listeners (`onRemove`, `onClick`, and any other `on…` prop) stay callback props. `.storybook/preview.tsx` excludes `/^on[A-Z].*/` from Controls and records the calls as actions. A play function that asserts the call passes `fn()` from `storybook/test`.
- Buttons, fields, and tables stay native elements, including the select, the checkbox, the radio and the segmented control. `Modal` is a native `<dialog>`, so focus is trapped and the page behind goes inert; `Menu` and `Tabs` implement roving focus directly. No headless library is installed — add one only if a control needs more than that.
- `Switch` is a `role="switch"` button, not a checkbox: it reports the state of the system, not of a form. It is controlled, because a switch commits as it moves.
- Screens are compositions. They stay inside the Storybook canvas: no fixed min-width wider than the preview. Tables scroll inside their own frame.
- Storybook’s Get started checklist, the menu guide, and the “what’s new” notification stay off in `.storybook/main.ts`.

## Storybook for agents

`pnpm storybook` serves the official MCP addon at `http://127.0.0.1:4500/mcp`. `.mcp.json` points at that address. The server answers only while that process is running.

Before using a component, call `docs-list`, then `docs-show` for that component. Before writing or changing a story, call `get-storybook-story-instructions`. After a UI change, call `test-run`. When a tool’s suggestion differs from this file, this file decides slots, booleans, copy, and colour.

Controls, viewport, measure, and outline are already part of Storybook itself. Do not add `@storybook/addon-essentials`, `@storybook/addon-links`, or a coverage or Chromatic addon unless someone asks. Those either duplicate what is already here or send the workbench to another service.

## Compose, never invent

Build a screen from the components that exist. When something is missing, **add it to the library** — a component in `src/components`, a story beside it, an export from `src/index.ts` — rather than writing one-off markup inside a screen. One-off markup binds to no token, skips the dark remap, carries no focus treatment and no accessible name, and is invisible to `pnpm test`.

This holds outside the repo too. The design system synced to claude.ai/design carries only what `src/index.ts` exports, so a control that never became a component cannot be designed with; it gets approximated, and the approximation cannot ship. If a design needs something that is not here, that is a request for a component, not a licence to improvise one.

## Keeping to the system

`pnpm lint:tokens` is the check. It reads `src` and fails on five things, each of which the codebase had already done:

| Rule | What fails |
| --- | --- |
| `space` | A `gap`, `padding` or `margin` that is not a `--di-space-*` token. The ramp is 2, 4, 6, 8, 12, 16, 24, 32, 48, named by value. |
| `radius` | A hand-set `border-radius`. Use `--di-radius-micro` \| `-control` \| `-surface` \| `-container` \| `-pill`. |
| `type` | A raw `font-size` in px. Use a `--di-font-size-*` step. |
| `colour` | A hex literal in a component. It is correct in daylight and wrong on the night sheet, because the token flips and a hex cannot. |
| `layer` | A component binding to a primitive. A primitive has no dark counterpart; bind to a semantic role, or define a local `--di-*` from it where a surface re-points its own roles, as `Toast` and the current `Stage` do. |
| `api` | A prop typed `ReactNode` in `src/components` other than `children`, `NavItem.icon` or `Menu.trigger`. |

`pnpm build` runs it first, so drift cannot reach the package. `pnpm check` is typecheck, lint and test together.

An exception has to say why, in a comment the lint reads:

```css
/* di-lint-allow-file layer: the sign-in card pins the daylight palette in
 * both themes, because it sits on a navy sheet either way. */
```

`di-lint-allow <rule>: <reason>` covers the block it sits above; `di-lint-allow-file <rule>: <reason>` at the top covers the file. Two files use it: `SignIn.css`, which must not follow the theme, and the Foundations specimen stylesheets, which show literal brand colours because that is what they are showing. A rule with no stated reason is drift with a comment on it.

## Checks

Visible text meets WCAG AA. Status is a word plus a mark, not colour alone. An icon-only button has an accessible name. Focus is visible: navy on ivory, gold on the navy sidebar.

A screen has one `main` and one `h1`. Component stories get that wrapper from `.storybook/preview.tsx` when the story does not render its own heading. `pnpm test` fails on axe violations. The Accessibility panel also counts inconclusive results, so a gradient or a dotted background behind text still counts as a failure to fix in the markup.

Before handing work back, run `pnpm check` — typecheck, `lint:tokens` and the story tests. Run `pnpm build` when a public component or `src/index.ts` changed.

## Release

`version` in `package.json` and the git tag are the same number: `0.1.0` is the tag `v0.1.0`. Pushing that tag publishes `@data-insights-ai/ui` to GitHub Packages and uploads the built Storybook to `https://storybook.data-insights.ai`. A visual change on `main` does not publish. Push a tag only when a release was asked for.
