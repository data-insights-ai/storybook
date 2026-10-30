# datAInsights Storybook

This repository is the component workbench for the datAInsights brand. It is not a product. Stories, chrome, and sample copy do not name a product, a suite, or a codename. Screens under `src/screens` show patterns a product can be assembled from.

A designer reviews work in Storybook (`pnpm storybook`, port 4500). Change what Storybook shows. Leave the installable package and the licence intact unless a release was asked for.

## Composing a product screen

Components carry no outer margin; spacing belongs to the container. A product screen is assembled like this:

- `AppShellContent` is a vertical flow (inside `SidebarInset` as well, below the `AppShellBar`): its direct children — `PageHeader`, a `Notice`, a `DataTable`, a `Panel`, a form — are spaced 24px apart. Do not add margins to separate them.
- Inside a block, group with `Stack` (`gap={8|12|16|24|32}`); a section of related blocks is one `Stack`, so the page sees it as a single child.
- A form is a `Stack gap={16}` of fields, followed by `Actions` for its buttons. A one-line form (pick a value and apply it) is a `Toolbar`: the fields, then the button. A toolbar that contains fields aligns every control on the control row, so buttons line up with inputs and an error line does not move them.
- Fields stretch to their container. Constrain a form's width by placing it in a `Panel` or a `Grid` column, not by sizing the controls.
- Large screens (1920px and 2560px) are part of the layout, not an afterthought: `AppShellContent` follows the window; `Page width="list"` and `"detail"` keep a side column at `--di-rail-width` on the right from a page width of 1280px (a record's `PageAside` and every `md` `Sheet` the page opens, docked; otherwise empty) and the content takes the rest, so a table never runs across the whole window; `"full"` is an overview on the whole frame; `"form"` keeps its measure (it grows at 1920); a dashboard is a `Grid`, which adds columns as the page widens; a `Chart` grows taller. `pnpm test` checks these at 1920, 2560, 3440 and 390 (`src/components/layout/page/Page/Page.browser.test.tsx`).
- A `DataTable` with no rows is not rendered empty: show an `EmptyState` instead. A `DataTable` or `InfiniteTable` is its own frame: never wrap it in a `Panel` (two frames, and the panel's clipping breaks the sticky head).
- A record's detail page with heavy sub-lists or more than about three sections is split into tabs (`TabNav`), each tab its own URL, so it is deep-linkable, keyboard navigable and kept on back: the record's settings tab holds its sections and, last, its `DangerZone`.
- A tabbed page's header (eyebrow, title, one description of the page) never holds a tab's action. Every tab panel starts with the same `ListToolbar`: the search on the left, the tab's one primary action in `ListToolbarEnd` with its `n` key, an optional `ListToolbarNote` under it; no heading of its own. A page without tabs keeps its primary action in `PageHeaderAside`, with the same key. Each tab shows the same `EmptyState` style.
- A list read by date keeps its period in one `DateRangePicker` in its `ListToolbar`, after the filters. The product passes `locale`, `weekStartsOn` and `timeZone` from its settings, keeps the period in the URL (`serializeDateRange`, `parseDateRange`) and sends the server the instants `resolveDateRange` gives; a preset that runs up to now has no end, so new entries still arrive in it.
- Keys are one scheme on every page and need no binding: a `SearchField` answers `/`, a `Button` with `shortcut="n"` is the primary create action, a `DetailSection` Edit answers `e`, Esc closes, `?` opens `ShortcutHelp` (mounted once in the shell). In a `DataTable` Up and Down move between rows, Home and End to the first and the last, and Enter opens the row. Keys never fire while the reader types. Every `Sheet`, `Modal`, `CreateFlow` step and section form starts in its first field.

The screens under `src/screens` follow these rules; copy from them, not from memory.

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
| A new reusable control | its concept folder in `src/components`, a story beside it, an export from `src/index.ts` |
| A chart | `Chart` wraps one Recharts chart. `ChartConfig` names each series and sets its colour; `Chart` exposes that colour as `--color-<key>`. `ChartTooltip` and `ChartLegend` read the same config. Colours are `--di-chart-series`, `--di-chart-highlight` (the one value, poppy), `--di-chart-compare` (the series the recorded one is measured against, cornflower — also `LevelMeter`'s comparison track), `--di-chart-muted`, and `--di-chart-band`; an ordered status scale (low → warn → danger, a stacked severity, a meter's zones) is `--di-chart-series`, `--di-chart-warn`, `--di-chart-danger` — not the status dots, which sit too close together to tell apart side by side. Do not draw a one-off SVG chart. The one drawn chart is `EventTimeline`, because Recharts zooms by index rather than time and cannot pan or pinch at the rate a gesture asks for; a chart that needs that is a change to `EventTimeline`, not a second drawing. `TimelineSummary` tells the same bars as a few episodes on one strip, for the reader who does not need to zoom; it folds them with `timelineEpisodes` rather than drawing them again. |
| An icon | `Icon`, with one Lucide icon as its child. Import that icon by name from `lucide-react` (`import { Search } from "lucide-react"`). `Icon` does not import the set, so the app keeps only the icons it renders. Do not import `lucide-react`’s `icons` namespace, and do not add a `name` prop that maps to every icon. |
| A console example | `src/screens`, composed from components |
| Storybook chrome (checklist, theme, test wrapper) | `.storybook` |

`pnpm build` writes the package to `dist/lib` as one module per component, so an app can tree-shake. `sideEffects` lists CSS only. `pnpm build-storybook` writes the static site to `dist/storybook`. Both directories are gitignored. A component that is not exported from `src/index.ts` is absent from the package a product installs. Do not fold the components back into a single JavaScript file, and do not inline the font files into the stylesheet.

There is one name per value in the token files too. `--di-accent` was an alias of `--di-seal`, and `--di-font-display` and `--di-font-body` were second and third names for `--di-font-ui`; all three are gone. Type runs `--di-font-size-100`…`-1000`, and the top two steps are the display tier the brand pages use — a product screen never goes above `--di-font-size-700`. `-550` is 18px and the ladder's one interpolated step: 16 to 20 is where prose hierarchy lives on a brand page, and with nothing between them a page lede, a section lede and a card heading all landed on 16. It is the only interpolation the ramp gets; a second one would mean the ladder was wrong, not short.

Tokens are three layers. Primitive values live in `primitive.css`. Semantic roles (`--di-text`, `--di-bg-page`, status, sidebar) live in `semantic.css`, with a dark remap under `[data-theme="dark"]`. A product themes its document with `ThemeProvider` from the person's choice (`auto`, `light` or `dark`; `auto` follows the device), writes `data-theme="auto"` on `<html>` in its page so the ground follows the device before its script runs, and offers the choice with `SidebarThemeChoice` in the sidebar's footer (`themeLabels` has its words in English, German and Spanish). The choice is the person's preference on the server, never browser storage. Component slots such as `--di-button-primary-bg` live in `component.css`. A component binds to a semantic or component token. It does not name a primitive colour, typeface, or radius.

## Brand

Foundations in this Storybook are the source for applying the brand. Colour, type, scale (space, radius, control height, the index column), the mark, voice, motion, the Register rules and the decision record behind them are written there. Do not send a designer or an agent to a separate brand book, and do not copy personal contact details into these pages.

The system is the **Register**: the surface is a record, not a dashboard. Everything below follows from that.

- Warm paper (`--di-paper` `#F4F1E8`) is the page. Sheet (`#FCFBF7`) is a panel, a field, a card. Grid (`#FFFFFF`) is the one cold surface, for a table only. Rule (`#DCD5C3`) is a hairline, never a fill.
- Navy (`#0A1F44`) is the ink **and** the action. No accent acts: the one filled control on a sheet is navy, so it is never unclear which button commits. After dark the fill turns gold, because navy cannot act against a navy ground. That is the only exception.
- Two accents stand beside navy and gold, never in their place. Poppy (`--di-highlight` `#D23C2E`) marks the place a page is about — a key figure, a quote, the core claim; `--di-highlight-ink` `#A42A1F` is poppy as text on paper and `--di-highlight-tint` `#FADFDA` the ground under a marked passage. Cornflower (`--di-signal` `#2B6CB0`) signals — a second series, a note that something is new; `--di-signal-ink` `#1F5288`, `--di-signal-tint` `#DFE9F5`. After dark both roles remap (`#FF7F6E`, `#79AEEA`); the brandbook's `-night` names are that remap, not tokens. Brandbook v0.5 calls poppy `--di-mark`; it is `--di-highlight` here, matching `Highlight`, because “mark” means the logo mark and the seal mark and nothing else. At most one accent per page, and the two meet only in a chart. Neither is a status, so neither is a `tone`: poppy is not critical, and a failure stays danger `#9E2020`. Poppy on a page is `Highlight` (`passage` lays the tint, `figure` sets the ink); cornflower in a chart is `--di-chart-compare`. Neither fills a button. Cornflower never sits directly on a navy surface (3.0:1), so not on the rail, a toast, a tooltip or a `Badge`. Bare `--di-highlight` is 4.2:1 on paper — a mark or a large figure, never body text.
- Gold means sealed, not important. A filled dot (`--di-seal` `#C9A24A`) is a value that was recorded and can be verified. A hollow ring (`--di-ai-ring` `#A6811F`) is a value a model inferred, with nothing vouching for it. No mark means nothing is on record. The mark is never the only channel: the word beside it carries the meaning too.
- Small gold text on paper uses Seal ink (`#7A5C0E`). Gold 500 and Gold 600 are marks, not type — Gold 600 on paper does not clear AA at small sizes, and on ivory it needs `#061631` rather than navy to clear it. Gold text on navy uses Gold 400.
- Status is verified `#155230` on wash `#E7EFE5`, anomaly `#6E4708` on `#F7EDD5`, critical `#8A1B1B` on `#F8E6E2`, recorded `#0A1F44` on `#E6E9F0`. Anomaly runs on the gold ramp rather than inventing a second yellow. Each word stays above 5:1. Keep this set; a generic traffic-light green or red breaks the register.
- Space Grotesk is everything a person reads as prose. JetBrains Mono is everything a machine wrote: identifiers, hashes, timestamps, measured values, and section numbers. Which track a string sits in states where it came from. Figures are tabular. Every interface label — a field, a stat, a legend, a segment, a select, a section's meta — is prose: one style, `--di-label-*` in `component.css`, the UI track at the label step in sentence case, never letter-spaced capitals. Mono capitals are the brand `Eyebrow` only.
- Radii are moderate: 4px for anything that takes a value (fields, selects, checkboxes), 6px buttons, 8px panels, 12px a frame holding panels. Control heights are 28 / 32 / 36px, and 32 is the standard. Space is named by value — `--di-space-2 4 6 8 12 16 24 32 48 64 96` — so `--di-space-12` is 12px: fine at the bottom where the density is, coarse above 16. The last two steps are the brand tier, the way the top two type steps are: 48 separates the parts of a brand page, 64 and 96 separate the parts from each other, and a console screen stops at 48. `Foundations/Scale` draws all three ramps.
- Depth is drawn with a 1px rule. Only a detached plane — a menu, a modal, a toast — gets a shadow, and a technical one. No blur behind text: a mono value behind frosted glass has no measurable contrast.
- The one ornament is the 8px tick rule (`.di-tick-rule`), and it only closes a block that reports a measurement.
- Motion runs at one of two durations and no others: `--di-duration` 120ms and `--di-duration-slow` 200ms, ease-out, one change at a time. A waiting indicator is the exception and loops until the wait ends: `Spinner` turns, `SkeletonTable`'s and `SkeletonPage`'s bars and `AppLoader`'s dots breathe on opacity, staggered, and `RouteProgress` eases along the bar's bottom rule. A skeleton or loader appears only after 150ms (`Delayed`), with its space held from the first frame, so a fast load neither flashes nor shifts the page. A page change keeps the shell: `RouteProgress` in `AppShellBar`, a `SkeletonPage` of the target's shape in the content; `AppLoader` is only for the start, before there is a shell. Even there nothing sweeps — a gradient travelling over a register is the one loading animation every other tool in this field already uses. A modal fades and settles one step (`@starting-style` plus `allow-discrete`, so it animates out as well as in), a drawer arrives from its own edge, a menu drops 4px, a toast rises 10px. Nothing scales and fades at once, and `prefers-reduced-motion` drops all of it in `base.css`.
- A toast runs on navy, not on paper: it is the system reporting back, not another entry on the sheet. It re-points its own tokens so a `Button` in the action slot reads on that ground.

Indexed records carry a 38px index column (`--di-index-col`) holding an ordinal or a letter. It is the system's fingerprint when sequence or record identity matters. A drawer keeps the ordinal of the row it opened from. A failure keeps its ordinal, tinted. Ordinary forms, first-use empty states, and panels or tiles that are not one of a sequence (a row of different measures, the facts on one record) omit the index; never invent a number to fill a decorative rail.

Focus is navy on paper and gold on the night sheet and the navy rail. The prototype rang every focus in seal gold; gold on paper measures 2.1:1, under the 3:1 a focus indicator has to clear, so the ring follows its ground instead.

Nothing a model proposes runs before an operator confirms it, and the confirmation states basis, scope and reversibility first. What follows is a receipt carrying an audit id (`Toast`), never an undo.

The sign-in card pins the daylight colours, including in the dark theme, because it sits on a navy sheet either way. Text on that sheet (the footer) has its own solid navy background. Text on the dotted canvas (the window title) has a solid background too. Contrast has to be measurable.

## Stories and components

Every component lives in `src/components`, under the folder of its concept, in a folder of its own named after it: `forms/text/TextField/` holds `TextField.tsx`, `TextField.css`, `TextField.stories.tsx`, its tests and an `index.ts`. Another folder imports the component through that `index.ts`, never a file inside it. A module several components share (the field frame, the choice frame, the date range arithmetic) gets a folder and an `index.ts` the same way; a shared stylesheet (`forms/dates/Calendar.css`) sits beside the components that import it, and a helper that draws nothing sits in `src/internal`. Screens import what a product imports, the package root (`../index`). The concepts:

| Folder | Holds |
| --- | --- |
| `actions/` | Button, CountButton, CopyValue, RowActions, BulkActionBar |
| `navigation/` | Breadcrumb, CommandBar, Menu, Pagination, Stepper, Tabs, TabNav, TextLink; `Sidebar/` the sidebar and its parts behind one index |
| `forms/` | `field/` Field (the frame), FieldHint, SaveBar; `text/` TextField, TextArea, SearchField, QuantityField, TokenField, FileField; `choice/` Choice (the frame), Checkbox, Radio, ChoiceGroup, Switch, ChoiceCards, SegmentedControl, ToggleGroup; `select/` Select, ComboBox, MultiComboBox; `dates/` dateRange, segments, calendar, DateField, TimeField, DateRangePicker |
| `data/` | `records/` RecordCard, LivingCard, Channel, Session, FactList, KeyValues, NewEntries; `figures/` Stat, StatTile; `text/` Eyebrow, Highlight, Kbd, TickRule, CodeBlock, PullQuote; `table/` DataTable, InfiniteTable, ListToolbar |
| `marks/` | Badge, Chip, StatusPill, Tag, VersionTag, SealValue, Icon (with the `IconSet` gallery the docs show), IconTile |
| `feedback/` | DangerZone, Delayed, EmptyState, Notice, Toast, Tooltip, TooltipTarget; `waiting/` AppLoader, Progress, RouteProgress, SkeletonPage, SkeletonTable, Spinner |
| `overlays/` | ConfirmDialog, CreateFlow, Flyout, Modal, Sheet, ShortcutHelp; `useModalDialog/` the dialog behaviour Modal and Sheet share |
| `inference/` | ConfidenceField, ConfirmPanel, ExplainPanel, PrivacyBadge, and the `Inference.css` they share |
| `layout/` | `arrangement/` Stack, Grid, Toolbar, Numbered, Split, FieldStack, InlineForm, Actions; `page/` Page, PageHeader, SectionTitle, Panel, Stage, DetailSection, pageSide (the side column a Sheet docks in); `folding/` Accordion, Disclosure |
| `charts/` | Bars, Chart, ChartCard, CoverageMatrix, Distribution, LevelMeter, Seismograph, Sparkline, TrendChart |
| `timeline/` | ChainTimeline, EventTimeline (with its `marks/` and `navigation/`), PeriodTimeline, WeekTimeline, TimelineSummary; `scale/` and `types/`, shared by EventTimeline and TimelineSummary |
| `shell/` | AppShell, SignIn, SkipLink, ThemeProvider |

A folder names what a component is about, and the story `title` follows it; what can go inside a component is its layer tag. Sample data that only a story or a screen reads sits beside it as `*.sample.ts` (`timeline/timeline.sample.ts`, `shell/chrome.sample.ts`), which the package build leaves out. The package's entry and its class names are recorded in `scripts/public-api.json`; `pnpm build` fails when they change, and `node scripts/check-api.mjs --write` records an intended change.

The story `title` decides where a component lands in the sidebar, and it is grouped by purpose: where a person would look for the component's job. The title is `<Group>/<Subgroup>/<Component>`, ends in the meta component's name, and mirrors the component's folder. `.storybook/preview.tsx` sorts the groups in this order:

- `Introduction`, then `Foundations/` — the brand, the tokens and the reasoning behind them (Essence, Register, Color, Type, Scale, Logo, Pages, Decisions and the rest). No package component lives here.
- `Actions/` — what a person presses: Button, CountButton, CopyValue, RowActions, BulkActionBar.
- `Forms/` — labelled controls, in `Field/`, `Text/`, `Choice/`, `Select/` and `Dates/`.
- `Data/` — what a person reads: `Records/` (the cards, FactList, KeyValues, Channel, Session), `Figures/` (Stat, StatTile), `Text/` (Eyebrow, Highlight, Kbd, CodeBlock, PullQuote) and `Table/`.
- `Marks/` — what every other component draws with: Badge, StatusPill, Chip, Tag, VersionTag, SealValue, Icon, IconTile. A mark imports no other component, so it sits below them all.
- `Feedback/` — Notice, Toast, EmptyState, DangerZone, Delayed, Tooltip; `Waiting/` the loaders, progress and skeletons.
- `Overlays/`, `Navigation/` — what opens over the page, and how a person moves through it.
- `Layout/` — `Arrangement/` (Stack, Grid, Numbered, Toolbar, Split, FieldStack, InlineForm), `Page/` (Page, the headers, Panel, Stage, DetailSection), `Folding/` (Accordion, Disclosure).
- `Charts/`, `Timeline/`, `Inference/` — what a screen measures, what happened when, and what the system inferred.
- `Shell/` — AppShell, SignIn, ThemeProvider. A product renders `AppShell` full-bleed from its slots. The Storybook window the screens sit in, with the sample chrome they share, is `.storybook/Console.tsx`: each screen story adds it as a decorator, and it is not in the package.
- `Screens/` — a console example, composed from the above.

A group gets subgroups only where a natural one exists, and a flat group runs to about eight or ten entries before it needs one (Navigation holds ten). Inside a group, entries sort alphabetically by title.

What a component may hold is a second axis, and it is a tag on its story meta, not a place in the sidebar: `layer:primitive`, `layer:form`, `layer:block` or `layer:pattern` (and `layer:foundation`, `layer:screen`). A component never imports one from a higher layer.

- `layer:primitive` — **a leaf: it exposes no slot a caller fills with a component.** It renders the text, figures and marks it was handed and nothing else can go inside it: Button, Badge, StatusPill, Pagination, Breadcrumb, Tooltip, the loaders.
- `layer:form` — a labelled control.
- `layer:block` — **it holds something**: it composes other components, or it exposes a slot for them. Panel, DataTable, Notice, Toast, Modal, Sheet, Menu, Tabs, StatTile, SignIn.
- `layer:pattern` — a whole arrangement: AppShell, Sidebar, ShortcutHelp, ThemeProvider and the arrangement components.

A deprecated export says so in its doc comment, `@deprecated Removed in <version>: <why>`, with what to use instead, and every story that shows it carries the tag `status:deprecated`.

The test is one question: **can another component go inside it?** `KeyValues` holds `KeyValue`, and `KeyValue` takes two strings — nothing else fits, so it is a primitive. `Stat` looks just as small, but its `children` holds a `StatusPill` on the Watchlist screen, so it is a block. `Pagination` and `SkeletonTable` are bulky and still primitives: you place them into a frame, they frame nothing. Size is not the axis; what can be put inside is.

One sidebar entry is one component, and **one module is one component**. An independent component does not share a file with another one: `pnpm build` emits a module per file, so `Breadcrumb` living in `Tabs.tsx` means a product importing a breadcrumb also ships `Tabs` and `Stepper`. Where several are one family they get a subgroup rather than one merged entry (`Feedback/Waiting/Progress`, `/SkeletonTable`, `/Spinner`; `Layout/Arrangement/Stack`, `/Grid`, `/Numbered`, `/Toolbar`).

A component whose drawing takes more than one module keeps the parts in a folder of its own, and only the component and its slots are exported: `timeline/` holds `EventTimeline` and the scale, marks and navigation it is drawn from (beside the other timelines), and `timeline/summary/` holds `TimelineSummary` and the episodes it is told in.

A sub-component that only exists inside its parent — `TableCell`, `NoticeTitle`, `PanelFooter`, `ModalIcon` — stays in the parent's file and the parent's entry. The test is whether anything else imports it: `FactList` sat in `Modal.tsx` until the Register screen used it inside a drawer, which is the moment it stopped being Modal's.

Every export in `src/index.ts` appears in a story. An export with no story is in the package and invisible to the designer. A story meta's `component` is the component that story renders: three components under one meta make the Docs page and Show code describe the wrong one.

There is one name per thing. `RingDot` was an alias for `<SealMark state="inferred" />`; two names for one mark is the same failure as two props for one line of hint text.

A Sheet is `layer:block` because it contains Buttons and StatusPills; a Button is `layer:primitive` because it contains nothing. When a component grows to hold another one, change its tag.

`.storybook/preview.tsx` sorts the entries of a group alphabetically **by title, not by file name**. Stories inside one file keep the order the file declares. Storybook reads that comparator out of the file and evaluates it on its own, so it has to be plain JavaScript with no type annotations and no references to anything outside it.

Anything with a transition gets a story that runs it: `Feedback/Toast` → Arriving, `Overlays/Modal` → Transition, `Feedback/Waiting/SkeletonTable` → Resolving, `Feedback/Waiting/Progress` → Counting, `Feedback/Waiting/RouteProgress` → Navigating, `Feedback/Delayed` → Appearing. A play function that asserts on an element mid-animation has to use `waitFor`, because the element starts at `opacity: 0`.

### The one API rule

Ask what can go in. **Only ever text → a `string` prop. Anything that can hold a component → a slot.** No prop is typed `ReactNode`; that type is the sign the decision was never made.

A slot is a named sub-component written as a child, `<Parent><ParentSlot>`: `NoticeIcon`, `PanelFooter`, `TableToolbar`, `ChannelValue`, `SessionMark`, `ToastAction`, `ConfirmActions`. React has no `<slot>`, so the frame places its slots with CSS grid areas and the caller may write them in any order. Two frames cannot: `DataTable` (a `<div>` is invalid inside `<table>`) and `ModalFrame` pick their slots out of `children` by type, and each says so in a comment.

Where a component takes exactly one leading node, that node is the first child and there is no slot for it — `Button`, `CommandRow`, `PrivacyBadge`, `Icon`. `TextField` puts the label-side slot in plain `children`, because the field has only one.

Two `ReactNode`s survive on purpose, and only these two. `NavItem.icon` is a field on the `NavGroup` data a product hands `AppShellRail`, not a slot on a component. `Menu`'s `trigger` is a render prop, because the menu has to put its own `aria-expanded` and ref onto a button the caller owns. Anything else typed `ReactNode` is a decision that was skipped.

A variant is one union prop, never a family of booleans or a second prop that can contradict the first: `hintTone`, not `hint` plus `error` plus `sealHint`; `layout`, not `inline` plus `split`.

`tone` names one axis and one only: status on the shared ramp, `neutral | ok | warn | danger`, plus `recorded` and `inferred` on `StatusPill`. What is not a status carries its own name — `surface` on `Panel`, `scope` on `PrivacyBadge`, `state` on `CommandChip`, `level` on `ConfidenceField`, `variant` on `Button`, `IconTile` and `Eyebrow`, `layout` on `FactList` and `Switch`, `labelTrack` on `TextField` and `Select`, `size` on `Button` and `Notice`, `gap` on `Stack`. `neutral` is the word for “nothing special”; `default` and `info` were two more words for it and are gone. The hollow ring is `inferred` wherever it appears, never `ai`, and gold as a value is `seal` — a public prop does not name a colour.

`tier` is the axis a heading carries, `console | brand`, on `PageHeader` and `SectionTitle`. `console` is the product screen: 28px and 20px over a 12px lede, and like `brand` it carries no bottom margin — the page or `Stack` around it owns the rhythm. `brand` is the display tier, measured to 16ch and 22ch over a lede at `--di-font-size-550`, and it carries no bottom margin — a brand page's rhythm belongs to the `Stack` around it, not to the header. Two tiers of one header, not two headers: a second component would be a second name for the same job.

`Eyebrow` is one union prop for the same reason. `sealed` is the section label beside the seal with a rule to the edge, and there is one of those per view. `plain` is the label alone, which repeats down a brand page, and it is what `PageHeader` and `SectionTitle` render from their `eyebrow` string — a page that repeated the sealed one would be claiming a seal per heading. The distance beneath it is `--di-eyebrow-gap`, so a head retunes it without the eyebrow knowing which head it sits in.

A brand page is assembled from those: `PageHeader` and `SectionTitle` at `tier="brand"`, `Stack` at `gap={48}`, `{64}` or `{96}`, `FactList layout="grid"`, `PullQuote`, `Grid` for a two-column band, `Notice size="comfort"`, and `TextField`/`Select` at `labelTrack="prose"` where a person fills a form in for themselves. There is no parallel set of brand components, and `src/foundations/guide/Guide.tsx` renders the Foundations pages from exactly these, which is what keeps it true: the brand-page vocabulary used to live only in that file's stylesheet, so a product installing the package could not reach it and approximated it instead.

A line that reports a measured value is a slot, not a string. A count, a timestamp, a version, a delta, a caveat or a basis arrives sealed, in the mono track, or with a state beside it, and a `string` can carry none of that: `PanelMeta`, `StageFooter`, `ExplainFooter`, `RecordCount`, `SessionDetail`, `StatTileDelta`, `LivingBasis`, `SignInVersion`. Prose a person reads — `title`, `label`, `caption`, `legend`, `body` and every `*Label` accessible name — stays a string. The one exception is the heading of a page or a section, because it can hold a `Highlight`: `PageHeaderTitle` and `SectionTitleHeading` are slots, and what sits beside them is `PageHeaderAside` and `SectionTitleMeta`. A `Panel`, `Modal` or `Card` title stays a string — the page marks one place, and it is never a panel's title. A field says one thing at a time, so `TextField` and `Select` take one `hint` string and one `hintTone` of `neutral | sealed | error`, and `error` also sets `aria-invalid`.

A control mark centres on the **first line** of its label — never on the whole block, never on the label's top edge. `--di-choice-line` is that line, and `Checkbox`, `Radio` and `Switch` all bind to it. `Switch` defaults to `layout="inline"`, the checkbox's geometry; `layout="row"` is the settings column, and the distance it opens is that column, not slack.

- Every visible string is a prop. Storybook stories are written in English. A product passes its own language in from outside. Components ship with no baked-in language. A word every app needs comes with a preset in English, German and Spanish to pick from (`themeLabels`, and `emptySegmentLabels` for an empty date or time segment read by a screen reader); the default is the English one.
- A slot is filled in the story `render`, with `control: false`.
- `DataTable` does not take a `rows` array. The caller maps its own data into `TableHead`, `TableBody`, `TableRow`, `TableIndex`, and `TableCell`. The table supplies the frame and the caption; `TableToolbar` and `TableFooter` are slots the caller writes as children. Its scroll container is a named, focusable region, because a scrollable area has to be reachable from the keyboard.
- `Pagination` is controlled. The caller owns `page` and which rows are visible. Previous and next call `onPageChange` with the next page.
- String props stay on `args`, so Controls can change the copy.
- A boolean prop is always `true` or `false` in `args`. An unset boolean shows “Set boolean” instead of a toggle. Use the component’s real default: `dot: true`, `padded: true`, `disabled: false`.
- Helper text is a string, default `""`. An unset node becomes an object control, and Edit then breaks the field.
- A select or radio (`variant`, `size`, `tone`, `type`) has one option chosen in `args`. Use the component’s real default: `variant: "primary"`, `size: "md"`, `tone: "neutral"`, `type: "button"` or `"text"`.
- Event listeners (`onRemove`, `onClick`, and any other `on…` prop) stay callback props. `.storybook/preview.tsx` excludes `/^on[A-Z].*/` from Controls and records the calls as actions. A play function that asserts the call passes `fn()` from `storybook/test`.
- Buttons, fields, and tables stay native elements, including the select, the checkbox, the radio and the segmented control. `Modal` is a native `<dialog>`, so focus is trapped and the page behind goes inert; `Menu` and `Tabs` implement roving focus directly. Where a control needs more than a native element gives, the headless library is Base UI (`@base-ui/react`) and no other: `TabNav`, `TextLink`, the `Sidebar` family, `ComboBox`, `MultiComboBox` and the popover and sheet of `DateField` and `DateRangePicker` use it. Base UI has no date field, so `DateField`, `TimeField` and the range picker's typed days and times share one segmented input in `forms/dates/segments` (each segment a spinbutton, names and placeholders from Intl), and the month grid is `react-day-picker`, pinned exactly, in `forms/dates/calendar`; its date-fns stays inside that grid, while our own date arithmetic uses `@internationalized/date`. Of Base UI only ScrollArea, Select, Tabs and Slider add a style element; keep them out unless the CSP note in the README changes with them.
- `Switch` is a `role="switch"` button, not a checkbox: it reports the state of the system, not of a form. It is controlled, because a switch commits as it moves.
- Screens are compositions. They stay inside the Storybook canvas: no fixed min-width wider than the preview. Tables scroll inside their own frame.
- Storybook’s Get started checklist, the menu guide, and the “what’s new” notification stay off in `.storybook/main.ts`.

## Storybook for agents

`pnpm storybook` serves the official MCP addon at `http://127.0.0.1:4500/mcp`. `.mcp.json` points at that address. The server answers only while that process is running.

Before using a component, call `docs-list`, then `docs-show` for that component. Before writing or changing a story, call `get-storybook-story-instructions`. After a UI change, call `test-run`. When a tool’s suggestion differs from this file, this file decides slots, booleans, copy, and colour.

Controls, viewport, measure, and outline are already part of Storybook itself. Do not add `@storybook/addon-essentials`, `@storybook/addon-links`, or a coverage or Chromatic addon unless someone asks. Those either duplicate what is already here or send the workbench to another service.

`.design-sync/conventions.md` is the header the DesignSync tool sends to the design agent on claude.ai, which cannot read this file. It is written for someone composing screens (which component for which job, slots, tones, tokens, layout, the mark) and holds no implementation rule. When a component or a sidebar group is added, renamed or removed, update it in the same change.

## Compose, never invent

Build a screen from the components that exist. When something is missing, **add it to the library** — a component in `src/components`, a story beside it, an export from `src/index.ts` — rather than writing one-off markup inside a screen. One-off markup binds to no token, skips the dark remap, carries no focus treatment and no accessible name, and is invisible to `pnpm test`.

This holds outside the repo too. The design system synced to claude.ai/design carries only what `src/index.ts` exports, so a control that never became a component cannot be designed with; it gets approximated, and the approximation cannot ship. If a design needs something that is not here, that is a request for a component, not a licence to improvise one.

## Keeping to the system

`pnpm lint:tokens` is the check. It reads `src` and fails on five things, each of which the codebase had already done:

| Rule | What fails |
| --- | --- |
| `space` | A `gap`, `padding` or `margin` that is not a `--di-space-*` token. The ramp is 2, 4, 6, 8, 12, 16, 24, 32, 48, 64, 96, named by value. |
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

## Structure

Every story meta carries one layer tag, `layer:foundation`, `layer:primitive`, `layer:form`, `layer:block`, `layer:pattern` or `layer:screen`, and a module never imports one from a higher layer. `pnpm lint:structure` checks that and the rest of the structure, and `pnpm build` runs it:

- `.dependency-cruiser.cjs`: no import cycles; no component imports a screen, a Foundations page or the Storybook chrome; `src/internal` imports nothing that is drawn; another folder reaches a component or a shared module only through its `index.ts`, while a component's own subfolders reach each other directly; screens import from the package root. Sample data (`*.sample.ts`) is not package code and is exempt.
- `scripts/lint-conventions.mjs`: every component `.design-sync/conventions.md` names is exported, every group and story title it names exists, and it lists every sidebar group.
- `scripts/lint-layers.mjs`: the layer tags and their direction; a story file, its folder and its meta component share one name and the title mirrors the folder; a module is one sidebar entry; every public component is rendered in a story (as JSX or as its meta component) and has a doc comment; every title's group is one `storySort` lists; no two concept folders import each other.

All three fail on any finding; there is no list of tolerated ones. A change that cannot pass them changes the structure, or the rule with a reason, never the check's input.

## Checks

Visible text meets WCAG AA. Status is a word plus a mark, not colour alone. An icon-only button has an accessible name. Focus is visible: navy on ivory, gold on the navy sidebar.

A screen has one `main` and one `h1`. Component stories get that wrapper from `.storybook/preview.tsx` when the story does not render its own heading. `pnpm test` fails on axe violations in both themes: the `storybook` project runs every story light, `storybook-dark` runs it again dark (`initialGlobals` in `vitest.config.ts`), clears the root's theme before each story and checks after it that the root is dark. Axe measures aria-hidden text too, but at one point, and it leaves a node "incomplete" when it cannot model what is behind it — an SVG under every chart label, a pseudo-element such as the `Stepper` connector, an overlap — while the story test fails on violations only. `.storybook/contrast` closes that gap: after each story, in both themes, it measures every visible text node at the start, middle and end of each line, reads the paint stack there (layers below composited to the first opaque one, an SVG shape by the stroke and fill that cover the point, semi-transparent layers above counted over text and ground) and fails on the worst point under 4.5:1, or 3:1 for large text. It fails instead of skipping what it cannot measure: gradient or pattern text, a gradient, background image, `<img>`, SVG `<image>` or canvas under or over text, text the hit test does not return at a point (a `clip-path`, which is not modelled), and text that cannot be scrolled into view. Not measured, because not shown: `display: none`, `visibility: hidden`, opacity 0, `.di-sr`, the part of a line its own box or an ancestor clips with `overflow` (a remainder a pixel wide or less is the visually hidden pattern, so hide text with `.di-sr` or that pattern with no padding), anything beyond the document's top or left edge, and a point an opaque layer covers. Inactive content is out, as in WCAG: disabled controls, a control or composite input group marked `aria-disabled` (not a section), `[inert]`, and what an open modal dialog makes inert (a popover shown above it is still measured). `.storybook/contrast/visibleContrast.browser.test.ts` proves each failing case with a fixture. There is no phone-width project; a story that needs 390px pins `viewport` in its `globals`.

Before handing work back, run `pnpm check` — typecheck, `lint:structure`, `lint:tokens`, the story tests, and the unit tests beside pure modules (`src/**/*.test.ts`, for arithmetic a story cannot show). Run `pnpm build` when a public component or `src/index.ts` changed.

## Release

`version` in `package.json` and the git tag are the same number: `0.1.0` is the tag `v0.1.0`. Pushing that tag publishes `@data-insights-ai/ui` to GitHub Packages and uploads the built Storybook to `https://storybook.data-insights.ai`. A visual change on `main` does not publish. Push a tag only when a release was asked for.
