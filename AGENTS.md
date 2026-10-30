# datAInsights Storybook

This repository is the component workbench for the datAInsights brand. It is not a product. Stories, chrome, and sample copy do not name a product, a suite, or a codename. Patterns under `src/screens` show whole screens a product can be assembled from.

A designer reviews work in Storybook (`pnpm storybook`, port 4500). Change what Storybook shows. Leave the installable package and the licence intact unless a release was asked for.

## Composing a product screen

Components carry no outer margin; spacing belongs to the container. A product screen is assembled like this:

- `AppShellBar` is one row at every width: the `SidebarTrigger`, the page's name (a `Breadcrumb`, which shows only the current page on a phone), then `AppShellBarEnd` with app-wide controls and status, which folds into one overflow button (`moreLabel`) when it does not fit beside the name. What must stay visible goes in `AppShellBarKeep` after the overflow: the notification bell, whose count is its point, and at most one more control. Status words ("Demo data off", "Admin sealed") and a refresh fold. Below 900px the `Sidebar` is a drawer from the inline start that the trigger opens.
- `AppShellContent` is a vertical flow (inside `SidebarInset` as well, below the `AppShellBar`): its direct children — `PageHeader`, a `Notice`, a `DataTable`, a `Panel`, a form — are spaced 24px apart. Do not add margins to separate them. The shell frames the page; a `Page` rendered outside it (an error route) keeps the same frame itself, and sticky heads stop at the window's top instead of under the bar (`--di-sticky-top` is 0 outside the shell).
- Inside a block, group with `Stack` (`gap={8|12|16|24|32}`); a section of related blocks is one `Stack`, so the page sees it as a single child.
- A form is a `Stack variant="form"` of fields (16px apart), followed by `Toolbar align="end"` for its buttons. A one-line form (pick a value and apply it) is a `Toolbar`: the fields, then the button; a one-line add form, where the first field takes the free width, is `Toolbar fillFirst`. A toolbar that contains fields aligns every control on the control row, so buttons line up with inputs and an error line does not move them.
- Every field draws its label with `FieldLabel` and its one line with `FieldHint`; a control a product draws itself takes the same two, so `required` (the mark after the label), read-only (its own tone `--di-bg-readonly`, a step above disabled, no frame, full ink) and an error read alike in every field. On a touch screen a field is 40px tall.
- Fields stretch to their container. Constrain a form's width by placing it in a `Panel` or a `Grid` column, not by sizing the controls.
- Large screens (1920px and 2560px) are part of the layout, not an afterthought: `AppShellContent` follows the window; `Page width="list"` and `"detail"` keep a side column at `--di-rail-width` on the right from a page width of 1280px (a record's `PageAside` and every `md` side `Dialog` the page opens, docked; otherwise empty) and the content takes the rest, so a table never runs across the whole window; `"full"` is an overview on the whole frame; `"form"` keeps its measure (it grows at 1920); a dashboard is a `Grid`, which adds columns as the page widens; a `Chart` grows taller. `pnpm test` checks these at 1920, 2560, 3440 and 390 (`src/components/layout/page/Page/Page.browser.test.tsx`).
- A `DataTable` with no rows is not rendered empty: show a `Notice variant="empty"` instead. A `DataTable` has no frame of its own: it sits on a surface, usually a `Panel`, and takes that panel's ground (`padded={false}` lets it run to the edges). An `InfiniteTable` that scrolls with the page (the register is the page) stays outside a `Panel`, whose clipping would break the sticky head; one that is a block among others takes `maxRows`, scrolls in its own frame with the head held at the frame's top, and sits in a `Panel` like any table. Under a table, `Pagination` ends the footer row: the count at the start, the pages at the end, both on the table's text edges.
- A record's detail page with heavy sub-lists or more than about three sections is split into tabs (`TabNav`), each tab its own URL, so it is deep-linkable, keyboard navigable and kept on back: the record's settings tab holds its sections and, last, its `DangerZone`.
- A tabbed page's header (eyebrow, title, one description of the page) never holds a tab's action. Every tab panel starts with the same list toolbar (`Toolbar role="search"`): the search on the left, the tab's one primary action in `ToolbarEnd` with its `n` key, an optional `ToolbarNote` under it; no heading of its own. A page without tabs keeps its primary action in `PageHeaderAside`, with the same key. Each tab shows the same `Notice variant="empty"` style.
- A list read by date keeps its period in one `DateRangePicker` in its list toolbar, after the filters. The product passes `locale`, `weekStartsOn` and `timeZone` from its settings, keeps the period in the URL (`serializeDateRange`, `parseDateRange`) and sends the server the instants `resolveDateRange` gives; a preset that runs up to now has no end, so new entries still arrive in it.
- Keys are one scheme on every page and need no binding: a `SearchField` answers `/`, a `Button` with `shortcut="n"` is the primary create action, a `DetailSection` Edit answers `e`, Esc closes, `?` opens `ShortcutHelp` (mounted once in the shell). In a `DataTable` Up and Down move between rows, Home and End to the first and the last, and Enter opens the row. Keys never fire while the reader types. Every `Dialog`, `CreateFlow` step and section form starts in its first field.

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
| A chart | `Chart` wraps one Recharts chart. `ChartConfig` names each series and sets its colour; `Chart` exposes that colour as `--color-<key>`. `ChartTooltip` and `ChartLegend` read the same config. Colours are `--di-chart-series`, `--di-chart-highlight` (the one value, gold), `--di-chart-compare` (the series the recorded one is measured against, cornflower — also `LevelMeter`'s comparison track), `--di-chart-muted`, and `--di-chart-band`; an ordered status scale (low → warn → danger, a stacked severity, a meter's zones) is `--di-chart-series`, `--di-chart-warn`, `--di-chart-danger` — not the status dots, which sit too close together to tell apart side by side. Do not draw a one-off SVG chart. The one drawn chart is `EventTimeline`, because Recharts zooms by index rather than time and cannot pan or pinch at the rate a gesture asks for; a chart that needs that is a change to `EventTimeline`, not a second drawing. `TimelineSummary` tells the same bars as a few episodes on one strip, for the reader who does not need to zoom; it folds them with `timelineEpisodes` rather than drawing them again. |
| An icon | `Icon`, with one Lucide icon as its child. Import that icon by name from `lucide-react` (`import { Search } from "lucide-react"`). `Icon` does not import the set, so the app keeps only the icons it renders. Do not import `lucide-react`’s `icons` namespace, and do not add a `name` prop that maps to every icon. |
| A console example | `src/screens`, composed from components |
| Storybook chrome (checklist, theme, test wrapper) | `.storybook` |

`pnpm build` writes the package to `dist/lib` as one module per component, so an app can tree-shake. `sideEffects` lists CSS only. `pnpm build-storybook` writes the static site to `dist/storybook`. Both directories are gitignored. A component that is not exported from `src/index.ts` is absent from the package a product installs. Do not fold the components back into a single JavaScript file, and do not inline the font files into the stylesheet.

There is one name per value in the token files too. Three roles name the three families: `--di-font-display` (Space Grotesk), `--di-font-ui` (IBM Plex Sans) and `--di-font-code` (IBM Plex Mono). Type runs `--di-font-size-100`…`-1000`, and the top two steps are the display tier the brand pages use — a product screen never goes above `--di-font-size-700`. `-550` is 18px and the ladder's one interpolated step: 16 to 20 is where prose hierarchy lives on a brand page, and with nothing between them a page lede, a section lede and a card heading all landed on 16. It is the only interpolation the ramp gets; a second one would mean the ladder was wrong, not short.

Tokens are three layers. Primitive values live in `primitive.css`. Semantic roles (`--di-text`, `--di-bg-page`, status, sidebar) live in `semantic.css`, with a dark remap under `[data-theme="dark"]`. A product themes its document with `ThemeProvider` from the person's choice (`auto`, `light` or `dark`; `auto` follows the device), writes `data-theme="auto"` on `<html>` in its page so the ground follows the device before its script runs, and offers the choice with `SidebarThemeChoice` in the sidebar's footer (`themeLabels` has its words in English, German and Spanish). The choice is the person's preference on the server, never browser storage. Component slots such as `--di-button-primary-bg` live in `component.css`. A component binds to a semantic or component token. It does not name a primitive colour, typeface, or radius.

## Brand

Foundations in this Storybook are the source for applying the brand. Colour, type, scale (space, radius, control height, the index column), the mark, voice, motion, the Register rules and the decision record behind them are written there. Do not send a designer or an agent to a separate brand book, and do not copy personal contact details into these pages.

The system is the **Register**: the surface is a record, not a dashboard. Everything below follows from that.

- Paper is the ground, and depth is a step in tone, not a line. Daylight runs chrome `#E9E8E3` (the sidebar, one step below), ground `#F3F2EE` (`--di-bg-page`), surface `#FDFDFB` (a panel, a table, a list pane), inset `#EAE9E4` (a group inside a surface), strip `#E9E8E3` (a figure row without a hero) and plane `#FFFFFF` (a menu, a lifted row). The ground is one token, so a warmer ground is one line in `primitive.css`. A table sits on a surface without a frame of its own; inside a `Panel` it takes the panel's ground.
- After dark the theme is designed, not inverted: chrome `#071733`, ground `#0A1F44` (brand navy, never near-black), surface `#0F2A57`, inset and strip `#081838` (a step below the ground), plane `#133068`, hero `#1A3A78`. `zones.test.ts` keeps every neighbouring pair at least 3 apart in L*.
- Navy (`#0A1F44`) is the ink **and** the action. No accent acts: the one filled control is navy, so it is never unclear which button commits. After dark the fill turns paper-white, because navy cannot act against a navy ground.
- Gold marks **the one thing** that matters in a view: the first `AttentionItem`, a verdict, the one value of a chart. `--di-one` `#C9A24A` is the mark, `--di-one-edge` `#A6811F` its edge, `--di-one-ink` its words — navy in daylight, gold (`#D9B45E`, `#E6C677`) after dark. In daylight gold is never text and never a wash under prose; the one object may carry a small gold pill with navy words that names it (`AttentionItem`'s `emphasisLabel`, `--di-text-on-one`). After dark gold text is allowed. The seal (`--di-seal`, `Button variant="seal"`, `Badge tone="seal"`) is the same gold and therefore a brand moment only: sign-in, the brand mark, empty and onboarding states, licence and certificate seals. It never appears in an operational view beside the one thing; an operational "seal" or "rotate key" is `primary` or `secondary`. Components draw the record marks (the sealed dot, the inferred ring, the inference surfaces, a done step) in `--di-mark`, `--di-mark-ring`, `--di-mark-surface`, `--di-mark-ink` and `--di-inverse-mark`: neutral ink by default, mapped to the seal's gold by a brand context, `data-brand` on the region (`SignIn` and the Foundations pages set it; `data-brand="false"` opts a region out). A portal — `Tooltip`, `Menu`, `Flyout`, the date pickers' popovers — renders outside the region and draws the neutral mark; a brand moment keeps its seals out of portals. `Dialog` is a native dialog in place and keeps the region's brand. A component never binds `--di-seal` or `--di-ai-*` directly, except the brand-moment controls themselves: `Button variant="seal"`, `Badge tone="seal"`, `AppLoader`'s mark. Links, breadcrumbs and the `link` button underline in cornflower, not gold.
- Selection and focus are cornflower (`--di-select`, `--di-focus`: `#2B6CB0` in daylight, `#79AEEA` after dark), never gold. A selected list row is one step up (`--di-bg-selected`) with a cornflower edge.
- Poppy (`--di-highlight` `#D23C2E`) marks a passage on a brand page and only there (`Highlight`). It is not a status: a failure is the severity scale's critical, and says so in words. Neither poppy nor cornflower fills a button.
- Severity is one scale for every product and every chart, drawn as `SeverityMark`: a filled mark plus the word, never colour alone and never the text's own colour. Critical `#B3161B`, high `#D9481A`, medium `#B57400`; after dark `#FF5F5A`, `#FF7A3D`, `#FF8A2A` — medium runs orange so it never reads as gold. Status (`tone`) stays its own set: verified `#155230` on `#E2ECE0`, warn `#8A4500` on `#FBE7CF` (its own amber, not gold), critical `#8A1B1B` on `#F8E2DD`, each word above 5:1.
- Charts do not move. Data arrives pushed, so a draw-in would replay on every update, and a dashed forecast drawn beside its solid series reads as two things happening at once. Every series sets `isAnimationActive={false}`; the plot fades in once on mount (`--di-duration`, none under reduced motion); updates appear at once; bars do not grow. A dashed continuation starts on the solid series' last point (both series carry that point), and a comparison series simply appears. `charts/motion.browser.test.tsx` renders every chart story and fails on any other animation or a mark that changes shape after mount.
- Underline means a link. Only a link (`TextLink`, `Button variant="link"`) or a disclosure is underlined; a ghost button is a button without a frame, never underlined; no decorative underline, no underlined name that does not open anything, no dotted definition underline. A link is the text colour with a cornflower underline (`TextLink`), the same in prose and at a block's edge, where an action link may add a trailing → (↗ for an external page; `TextLink trail`), never in prose. `quiet` mutes the colour and keeps the reading face and the underline; an id a machine wrote that opens its record is `mono`. A name that opens a record is a link, or the whole row is the target with a hover tint. `.storybook/tests/surfaces/underline.ts` fails a story with underlined text outside `a[href]`, `button`, `summary` or a link or button role.
- Never a surface on the same surface: a box that draws a border or shadow on its own ground colour is a card on a card. A nested group takes the inset tone or drops its frame (`surfaces/nesting.ts`). Text and controls keep at least 12px from the inner edge of the surface that holds them; table rows, menu rows and media run full-bleed by design (`surfaces/clearance.ts`, its allow-list says why). A surface holds its content at the same inset above as below (within 2px), and its parts — head, body, foot — sit a step of the space scale apart (`surfaces/spacing.ts`, measured on a copy at the surface's content height, so a panel stretched by its row is judged by its padding; its allow-list says why). One bold voice per block: only the title is bold; a lead, the body, a note are regular weight.
- Three families. Space Grotesk (`--di-font-display`, bold) names and counts: the page's name at 1.75rem, a figure, a section head. IBM Plex Sans (`--di-font-ui`) is what a person reads, and the body is 14px. IBM Plex Mono (`--di-font-code`) is what a machine wrote — identifiers, hashes, timestamps — and the label above a value: `--di-mono-label-*`, capitals at 0.1em, for a figure, a table column, a navigation group. A field's label stays prose in sentence case (`--di-label-*`). Headings balance (`text-wrap: balance`), body text is `pretty`. All three families are OFL-1.1, from `@fontsource`.
- Radii are moderate: 4px for anything that takes a value, 6px buttons, 8px an inset, 12px a surface. Space is named by value — `--di-space-2 4 6 8 12 16 24 32 48 64 96` — so `--di-space-12` is 12px. A console screen stops at 48. `Foundations/Scale` draws all three ramps.
- Density and size are two axes. A component's `size` (sm, md, lg) is its role; the density (`data-density="comfortable|compact"` on the root or any region, set from the person's profile through `DensityProvider`) scales every size. `styles/tokens/density.css` holds one value per density: control heights `--di-control-h-sm|md|lg` (28/32/36, compact 24/28/32), `--di-row-h`, `--di-option-h`, `--di-pill-h`, `--di-kbd-h`, `--di-icon-*`, the surface insets `--di-inset` and `--di-inset-group`, and the gap ramp `--di-gap-*` (named by the comfortable value; a rung lower in compact). Comfortable is the default and the values the console shipped with. The body stays 14px in both, and on a touch screen compact keeps the comfortable 40px targets. A component's gaps, paddings and sizes use these tokens; the page frame (`--di-content-pad`, the rhythm between page blocks) stays on `--di-space-*`. Component slots in `component.css` are re-declared on `[data-density]`, so a region resolves them from its own density. Never a density prop on a component. `Foundations/Density` shows the matrix.
- Components draw with shared building blocks in `styles/primitives.css`, so a look exists once: the surface (`surfaceClass()` from `src/internal/surface`: planes `sheet`, `inset`, `hero`; edges `danger` and `one`; a surface inside a surface sinks to the inset tone), the selected row (`.di-row`, `.di-row-current`: one tint and the cornflower edge for a list item, a nav link, a table row, a timeline episode), the option row in a popup (`.di-option`), and the ordinal of a real sequence (`.di-ordinal`). Every pill is a `Badge` (`StatusPill`, `VersionTag`, `PrivacyBadge`, the counts in tabs, the sidebar and `CountButton`); a key is a `Kbd` (`tone="onControl"` inside a button); a caption above a title is an `Eyebrow`. A component never draws its own surface, pill, row or eyebrow.
- Rules run only between figures in a `FigureRow` and between the rows of a table. A header has no rule under it. A surface may carry a soft shadow (`--di-elevation-surface`); a detached plane — a menu, a modal, a toast — a stronger one. No blur behind text.
- Motion runs at one of two durations and no others: `--di-duration` 120ms and `--di-duration-slow` 200ms, ease-out, one change at a time. A waiting indicator is the exception and loops until the wait ends: `Spinner` turns, `SkeletonTable`'s and `SkeletonPage`'s bars and `AppLoader`'s dots breathe on opacity, staggered, and `RouteProgress` eases along the bar's bottom rule. A skeleton or loader appears only after 150ms (`Delayed`), with its space held from the first frame. A page change keeps the shell: `RouteProgress` in `AppShellBar`, a `SkeletonPage` of the target's shape in the content; `AppLoader` is only for the start. A modal fades and settles one step, a drawer arrives from its own edge, a menu drops 4px, a toast rises 10px. Nothing scales and fades at once, and `prefers-reduced-motion` drops all of it in `base.css`.
- A toast runs on navy, not on paper: it is the system reporting back. It re-points its own tokens so a `Button` in the action slot reads on that ground.

A screen is composed in a fixed order:

- The header only orients: `PageHeader` holds the page's name (`h1`), a status pill beside it and a `MetaLine` (as of when, from where) — right of the name on a desktop, under it on a phone. No kicker, no claim, no rule, no button in the header.
- The first block is what needs the person: an `AttentionList` of at most three items, item 01 full width with the one button and the gold edge. When nothing is due it renders `AttentionClear` ("Everything is running") instead.
- A navy hero (`Panel surface="hero"`) appears only with a signature visual (a chart that is the screen's argument) and is closed by a `FigureRow variant="footer"`. Figures without a hero sit on a strip (`variant="strip"`). Rules separate figures, nothing else.
- A list beside its record is `Split variant="list"`: the list pane runs full height a step above the ground, the selected row a step above that with a cornflower edge; on a phone the list and the record are two views with a back link.
- Meta lines break between items, never inside one. A row of action buttons (`Toolbar align="end"`) stacks full width on a phone.

A number appears only where the order is information: the rows of a register (the 38px index column, `--di-index-col`, of a `DataTable`), the steps of a process (`Steps`), the rank in an `AttentionList`, the phases of a story. A panel, a sheet, a tile or an empty state carries no number of its own and has no prop for one: a sheet opened from a row names its record in its `eyebrow`, and a failure says so in words beside its title. Never invent a number to fill a rail.

Focus is cornflower in both themes (`#2B6CB0` on paper, `#79AEEA` after dark), so it is never confused with the gold of the one thing.

Nothing a model proposes runs before an operator confirms it, and the confirmation states basis, scope and reversibility first. What follows is a receipt carrying an audit id (`Toast`), never an undo.

The sign-in page follows the theme: the paper ground `#F3F2EE` with one surface card and the navy button in daylight, the navy ground `#0A1F44` with a navy surface card and the paper-white button after dark, IBM Plex Sans at 400 for its text. The identity provider's hosted login copies exactly that (ground, primary, font), so the two read as one place. No rules in or under the card: depth is a step in tone. Text on it has a solid background; contrast has to be measurable.

A region a story pins to `data-theme="light"` or `"dark"` (a swatch in Foundations, the hero zone) is a designed object of that theme, not a gap in coverage: the dark project measures it in the theme it pins, which is the theme it ships in. Do not add a dark variant of it for the sake of the test.

## Stories and components

Every component lives in `src/components`, under the folder of its concept, in a folder of its own named after it: `forms/text/TextField/` holds `TextField.tsx`, `TextField.css`, `TextField.stories.tsx`, its tests and an `index.ts`. Another folder imports the component through that `index.ts`, never a file inside it. A module several components share (the field frame, the choice frame, the date range arithmetic) gets a folder and an `index.ts` the same way; a shared stylesheet (`forms/dates/Calendar.css`) sits beside the components that import it, and a helper that draws nothing sits in `src/internal`. Patterns import what a product imports, the package root (`../index`). The concepts:

| Folder | Holds |
| --- | --- |
| `actions/` | Button (primary, secondary, ghost, link, danger, seal, inferred; `badge`), Toolbar (list toolbar, selection bar, unsaved changes, form end, row actions, one-line form), CopyValue; deprecated until 0.12.0, each a thin wrapper: BulkActionBar, RowActions (Toolbar), CountButton (Button `badge`) |
| `navigation/` | Breadcrumb, CommandBar, Menu, TextLink; `views/` Tabs, TabNav; `sequence/` Pagination, Steps (Stepper, Numbered and Stage deprecated); `Sidebar/` the sidebar and its parts behind one index, in `menu/`, `frame/` and `state/` |
| `forms/` | `field/` Field (the frame), FieldLabel, FieldHint, FieldConfidence (a field’s `confidence`; ConfidenceField deprecated), SaveBar (deprecated: `Toolbar sticky="bottom"`); `text/` TextField, TextArea, SearchField, QuantityField, FileField; `choice/` Choice (the frame), Checkbox, Radio, ChoiceGroup (list, segments, cards; SegmentedControl, ToggleGroup, ChoiceCards deprecated), Switch; `select/` Select, ComboBox, MultiComboBox (`freeEntry`; TokenField deprecated); `dates/` dateRange, segments, calendar, DateField, TimeField, DateRangePicker |
| `data/` | `records/` AttentionList, RecordCard (`layout` card or row), FactList, ProposalPanel; `figures/` Figure, FigureRow, Sparkline; `table/` DataTable, InfiniteTable, ListToolbar (deprecated: `Toolbar role="search"`), NewEntries. Deprecated until 0.12.0, each a thin wrapper over its replacement: LivingCard, Session, Channel (RecordCard), KeyValues, ExplainRow (FactList), ExplainPanel, ConfirmPanel (ProposalPanel), Stat, StatRow, StatTile, HeroFigure (Figure), Bars (Sparkline) |
| `text/` | Eyebrow, Highlight, Kbd, MetaLine, TickRule, CodeBlock, PullQuote |
| `marks/` | Badge, Tag (`mono`, `pressed`, `onRemove`, `inferred`; Chip, VersionTag and CommandChip deprecated), Icon (with the `IconSet` gallery the docs show), IconTile; `status/` StatusPill, SeverityMark, SealValue |
| `feedback/` | DangerZone (deprecated: `Panel tone="danger"`), Delayed, Notice (`variant` banner, empty, line; EmptyState and AttentionClear deprecated), Toast, Tooltip, TooltipTarget; `waiting/` Loading (`shape` inline, app, list, detail, form, table), Progress, RouteProgress; AppLoader, SkeletonPage, SkeletonTable, Spinner (deprecated: `Loading`) |
| `overlays/` | Dialog (placement side, center, bottom), ConfirmDialog and ShortcutHelp built on it, CreateFlow, Flyout; Modal and Sheet (deprecated: `Dialog`); `useModalDialog/` the native dialog behaviour |
| `inference/` | PrivacyBadge (deprecated: `StatusPill icon`) |
| `layout/` | `arrangement/` Stack, Grid, Actions (deprecated: `Toolbar align`), FieldStack (deprecated: `Stack variant="form"`), InlineForm (deprecated: `Toolbar fillFirst`); `panes/` Split, ListDetail (deprecated: `Split variant="list"`); `page/` Page, PageHeader, Panel (with `DangerAction`), DetailSection, pageSide (the side column a side Dialog docks in), SectionTitle and Hero (deprecated: `PageHeader level={2}`, `Panel surface="hero"`); `folding/` Disclosure (and `DisclosureGroup`), Accordion (deprecated: `Disclosure toggle="head"`) |
| `charts/` | Chart, ChartCard (deprecated: `Panel` with a `Figure size="compact"`, in a `Grid`); `time/` TrendChart, Seismograph; `compare/` Bars (deprecated: `Sparkline`), Distribution (its rows are `LevelMeter`s), CoverageMatrix, LevelMeter (Storybook `Status/`; the one track and fill for a meter, a quota, a breakdown row and a field's confidence; moves to the Status folder in the final move) |
| `timeline/` | ChainTimeline, EventTimeline (with its `marks/` and `navigation/`), PeriodTimeline (rows of spans on a date or number axis: licences, quiet hours), WeekTimeline (deprecated: `PeriodTimeline`), TimelineSummary; `scale/` and `types/`, shared by EventTimeline and TimelineSummary |
| `shell/` | AppShellBar (with `AppShellBarEnd` and `AppShellBarKeep`), AppShellContent, SignIn, SkipLink, ThemeProvider, DensityProvider |

A folder names what a component is about, and the story `title` follows it; what can go inside a component is its layer tag. Sample data that only a story or a pattern reads sits beside it as `*.sample.ts` (`timeline/timeline.sample.ts`, `shell/chrome.sample.ts`), which the package build leaves out. The package's entry and its class names are recorded in `scripts/public-api.json`; `pnpm build` fails when they change, and `node scripts/check-api.mjs --write` records an intended change.

The story `title` decides where a component lands in the sidebar, and it is grouped by purpose: where a person would look for the component's job. The title is `<Group>/<Subgroup>/<Component>`, ends in the meta component's name, and mirrors the component's folder. `.storybook/preview.tsx` sorts the groups in this order:

- `Introduction`, then `Foundations/` — the brand, the tokens and the reasoning behind them (Essence, Register, Color, Type, Scale, Logo, Pages, Decisions and the rest). No package component lives here.
- `Actions/` — what a person presses: Button, Toolbar, CopyValue (BulkActionBar, RowActions, CountButton deprecated).
- `Forms/` — labelled controls, in `Field/`, `Text/`, `Choice/`, `Select/` and `Dates/`.
- `Data/` — what a person reads: `Records/` (AttentionList, RecordCard, FactList, ProposalPanel), `Figures/` (Figure, FigureRow, Sparkline) and `Table/`.
- `Text/` — how text is set: Eyebrow, Highlight, Kbd, MetaLine, CodeBlock, PullQuote, TickRule. It imports only marks, so a button, a dialog or an empty state can set a key or an eyebrow with it.
- `Marks/` — what every other component draws with: Badge, Chip, Tag, VersionTag, Icon, IconTile; `Status/` (StatusPill, SeverityMark, SealValue). A mark imports no other component, so it sits below them all.
- `Feedback/` — Notice (banner, empty, line), Toast, Delayed, Tooltip; `Waiting/` Loading, Progress, RouteProgress.
- `Overlays/`, `Navigation/` — what opens over the page, and how a person moves through it.
- `Layout/` — `Arrangement/` (Stack, Grid, Toolbar, Actions), `Panes/` (Split), `Page/` (Page, PageHeader, Panel, DetailSection), `Folding/` (Disclosure).
- `Navigation/` holds `Views/` (Tabs, TabNav) and `Sequence/` (Pagination, Steps) beside the rest; `Charts/` holds `Time/` and `Compare/` beside Chart and ChartCard; LevelMeter already shows under `Status/`.
- `Charts/`, `Timeline/`, `Inference/` — what a screen measures, what happened when, and what the system inferred.
- `Shell/` — AppShellBar, AppShellContent, SignIn, SkipLink, ThemeProvider, DensityProvider. A product's frame is `SidebarProvider` with the `Sidebar`, then `SidebarInset` holding `AppShellBar` and `AppShellContent`; the patterns share that frame in `src/screens/shell/ProductShell.tsx`.
- `Patterns/` — whole screens composed only from public components: Security overview, Case triage, Organization home (one story per role), and the older console examples. `src/screens` keeps one folder per kind (`overview/`, `cases/`, `home/`, `pages/`, `records/`, `shell/`). A pattern is an example, never a package export.

A group gets subgroups only where a natural one exists, and a flat group runs to about eight or ten entries before it needs one (Navigation holds ten). Inside a group, entries sort alphabetically by title.

What a component may hold is a second axis, and it is a tag on its story meta, not a place in the sidebar: `layer:primitive`, `layer:form`, `layer:block` or `layer:pattern` (and `layer:foundation`, `layer:screen`). A component never imports one from a higher layer.

- `layer:primitive` — **a leaf: it exposes no slot a caller fills with a component.** It renders the text, figures and marks it was handed and nothing else can go inside it: Button, Badge, StatusPill, Pagination, Breadcrumb, Tooltip, the loaders.
- `layer:form` — a labelled control.
- `layer:block` — **it holds something**: it composes other components, or it exposes a slot for them. Panel, DataTable, Notice, Toast, Dialog, Menu, Tabs, RecordCard, SignIn.
- `layer:pattern` — a whole arrangement: Sidebar, ShortcutHelp, ThemeProvider and the arrangement components.

A deprecated export says so in its doc comment, `@deprecated Removed in <version>: <why>`, with what to use instead, and every story that shows it carries the tag `status:deprecated`.

The test is one question: **can another component go inside it?** `Sparkline` takes numbers and a label — nothing else fits, so it is a primitive. `Figure` looks just as small, but its `children` holds a `FigureNote` or a `Sparkline`, so it is a block. `Pagination` and `SkeletonTable` are bulky and still primitives: you place them into a frame, they frame nothing. Size is not the axis; what can be put inside is.

One sidebar entry is one component, and **one module is one component**. An independent component does not share a file with another one: `pnpm build` emits a module per file, so `Breadcrumb` living in `Tabs.tsx` means a product importing a breadcrumb also ships `Tabs` and `Stepper`. Where several are one family they get a subgroup rather than one merged entry (`Feedback/Waiting/Progress`, `/SkeletonTable`, `/Spinner`; `Layout/Arrangement/Stack`, `/Grid`, `/Numbered`, `/Toolbar`).

A component whose drawing takes more than one module keeps the parts in a folder of its own, and only the component and its slots are exported: `timeline/` holds `EventTimeline` and the scale, marks and navigation it is drawn from (beside the other timelines), and `timeline/summary/` holds `TimelineSummary` and the episodes it is told in.

A sub-component that only exists inside its parent — `TableCell`, `NoticeTitle`, `PanelFooter`, `DialogFooter` — stays in the parent's file and the parent's entry. The test is whether anything else imports it: `FactList` sat in `Modal.tsx` until the Register screen used it inside a drawer, which is the moment it stopped being Modal's.

Every export in `src/index.ts` appears in a story. An export with no story is in the package and invisible to the designer. A story meta's `component` is the component that story renders: three components under one meta make the Docs page and Show code describe the wrong one.

There is one name per thing. `RingDot` was an alias for `<SealMark state="inferred" />`; two names for one mark is the same failure as two props for one line of hint text.

A Dialog is `layer:block` because it contains Buttons and StatusPills; a Button is `layer:primitive` because it contains nothing. When a component grows to hold another one, change its tag.

`.storybook/preview.tsx` sorts the entries of a group alphabetically **by title, not by file name**. Stories inside one file keep the order the file declares. Storybook reads that comparator out of the file and evaluates it on its own, so it has to be plain JavaScript with no type annotations and no references to anything outside it.

Anything with a transition gets a story that runs it: `Feedback/Toast` → Arriving, `Overlays/Dialog` → Transition, `Feedback/Waiting/SkeletonTable` → Resolving, `Feedback/Waiting/Progress` → Counting, `Feedback/Waiting/RouteProgress` → Navigating, `Feedback/Delayed` → Appearing. A play function that asserts on an element mid-animation has to use `waitFor`, because the element starts at `opacity: 0`.

### The one API rule

Ask what can go in. **Only ever text → a `string` prop. Anything that can hold a component → a slot.** No prop is typed `ReactNode`; that type is the sign the decision was never made.

A slot is a named sub-component written as a child, `<Parent><ParentSlot>`: `NoticeIcon`, `PanelFooter`, `ToolbarEnd`, `ChannelValue`, `SessionMark`, `ToastAction`, `ConfirmActions`. React has no `<slot>`, so the frame places its slots with CSS grid areas and the caller may write them in any order. Two frames cannot: `DataTable` (a `<div>` is invalid inside `<table>`) and `ModalFrame` pick their slots out of `children` by type, and each says so in a comment.

Where a component takes exactly one leading node, that node is the first child and there is no slot for it — `Button`, `CommandRow`, `PrivacyBadge`, `Icon`. `TextField` puts the label-side slot in plain `children`, because the field has only one.

Two kinds of `ReactNode` survive on purpose, and only these. An option's `icon` (`ChoiceGroup` options, `StatusPill icon`) is a field on data the caller hands over, not a slot. `Menu`'s `trigger` is a render prop, because the menu has to put its own `aria-expanded` and ref onto a button the caller owns. Anything else typed `ReactNode` is a decision that was skipped.

A variant is one union prop, never a family of booleans or a second prop that can contradict the first: `hintTone`, not `hint` plus `error` plus `sealHint`; `layout`, not `inline` plus `split`.

`tone` names one axis and one only: status on the shared ramp, `neutral | ok | warn | danger`, plus `recorded` and `inferred` on `StatusPill`. What is not a status carries its own name — `surface` on `Panel`, `scope` on `PrivacyBadge`, `state` on `CommandChip`, `level` on a field’s `confidence`, `variant` on `Button`, `IconTile` and `Eyebrow`, `layout` on `FactList` and `Switch`, `labelTrack` on `TextField` and `Select`, `size` on `Button` and `Notice`, `gap` on `Stack`. `neutral` is the word for “nothing special”; `default` and `info` were two more words for it and are gone. The hollow ring is `inferred` wherever it appears, never `ai`, and gold as a value is `seal` — a public prop does not name a colour.

`tier` is the axis a heading carries, `console | brand`, on `PageHeader` (at `level={1}` the page, at `level={2}` a section). `console` is the product screen: 28px and 20px over a 12px lede, and like `brand` it carries no bottom margin — the page or `Stack` around it owns the rhythm. `brand` is the display tier, measured to 16ch and 22ch over a lede at `--di-font-size-550`, and it carries no bottom margin — a brand page's rhythm belongs to the `Stack` around it, not to the header. Two tiers of one header, not two headers: a second component would be a second name for the same job.

`Eyebrow` is one union prop for the same reason. `sealed` is the section label beside the seal with a rule to the edge, and there is one of those per view. `plain` is the label alone, which repeats down a brand page, and it is what `PageHeader` renders from its `eyebrow` string — a page that repeated the sealed one would be claiming a seal per heading. The distance beneath it is `--di-eyebrow-gap`, so a head retunes it without the eyebrow knowing which head it sits in.

A brand page is assembled from those: `PageHeader` at `tier="brand"` (level 1 and 2), `Stack` at `gap={48}`, `{64}` or `{96}`, `FactList layout="grid"`, `PullQuote`, `Grid` for a two-column band, and `TextField`/`Select` at `labelTrack="prose"` where a person fills a form in for themselves. There is no parallel set of brand components, and `src/foundations/guide/Guide.tsx` renders the Foundations pages from exactly these, which is what keeps it true: the brand-page vocabulary used to live only in that file's stylesheet, so a product installing the package could not reach it and approximated it instead.

A line that reports a measured value is a slot, not a string. A count, a timestamp, a version, a delta, a caveat or a basis arrives sealed, in the mono track, or with a state beside it, and a `string` can carry none of that: `PanelMeta`, `StageFooter`, `ProposalNote`, `RecordCount`, `RecordDetail`, `FigureNote`, `RecordBasis`, `SignInVersion`. Prose a person reads — `title`, `label`, `caption`, `legend`, `body` and every `*Label` accessible name — stays a string. The one exception is the heading of a page or a section, because it can hold a `Highlight`: `PageHeaderTitle` and `SectionTitleHeading` are slots, and what sits beside them is `PageHeaderAside` and `PageHeaderMeta`. A `Panel` or `Dialog` title stays a string — the page marks one place, and it is never a panel's title. A field says one thing at a time, so `TextField` and `Select` take one `hint` string and one `hintTone` of `neutral | sealed | error`, and `error` also sets `aria-invalid`.

A control mark centres on the **first line** of its label — never on the whole block, never on the label's top edge. `--di-choice-line` is that line, and `Checkbox`, `Radio` and `Switch` all bind to it. `Switch` defaults to `layout="inline"`, the checkbox's geometry; `layout="row"` is the settings column, and the distance it opens is that column, not slack.

- Every visible string is a prop. Storybook stories are written in English. A product passes its own language in from outside. Components ship with no baked-in language. A word every app needs comes with a preset in English, German and Spanish to pick from (`themeLabels`, and `emptySegmentLabels` for an empty date or time segment read by a screen reader); the default is the English one.
- A slot is filled in the story `render`, with `control: false`.
- `DataTable` does not take a `rows` array. The caller maps its own data into `TableHead`, `TableBody`, `TableRow`, `TableIndex`, and `TableCell`. The table supplies the frame and the caption; a `Toolbar` and `TableFooter` are written as children; the table frames the toolbar. Its scroll container is a named, focusable region, because a scrollable area has to be reachable from the keyboard.
- `Pagination` is controlled. The caller owns `page` and which rows are visible. Previous and next call `onPageChange` with the next page.
- String props stay on `args`, so Controls can change the copy.
- A boolean prop is always `true` or `false` in `args`. An unset boolean shows “Set boolean” instead of a toggle. Use the component’s real default: `dot: true`, `padded: true`, `disabled: false`.
- Helper text is a string, default `""`. An unset node becomes an object control, and Edit then breaks the field.
- A select or radio (`variant`, `size`, `tone`, `type`) has one option chosen in `args`. Use the component’s real default: `variant: "primary"`, `size: "md"`, `tone: "neutral"`, `type: "button"` or `"text"`.
- Event listeners (`onRemove`, `onClick`, and any other `on…` prop) stay callback props. `.storybook/preview.tsx` excludes `/^on[A-Z].*/` from Controls and records the calls as actions. A play function that asserts the call passes `fn()` from `storybook/test`.
- Buttons, fields, and tables stay native elements, including the select, the checkbox, the radio and the segmented control. `Dialog` is a native `<dialog>`, so focus is trapped and the page behind goes inert; `Menu` and `Tabs` implement roving focus directly. Where a control needs more than a native element gives, the headless library is Base UI (`@base-ui/react`) and no other: `TabNav`, `TextLink`, the `Sidebar` family, `ComboBox`, `MultiComboBox` and the popover and sheet of `DateField` and `DateRangePicker` use it. Base UI has no date field, so `DateField`, `TimeField` and the range picker's typed days and times share one segmented input in `forms/dates/segments` (each segment a spinbutton, names and placeholders from Intl), and the month grid is `react-day-picker`, pinned exactly, in `forms/dates/calendar`; its date-fns stays inside that grid, while our own date arithmetic uses `@internationalized/date`. Of Base UI only ScrollArea, Select, Tabs and Slider add a style element; keep them out unless the CSP note in the README changes with them.
- `Switch` is a `role="switch"` button, not a checkbox: it reports the state of the system, not of a form. It is controlled, because a switch commits as it moves.
- Patterns are compositions. They stay inside the Storybook canvas: no fixed min-width wider than the preview, and they work at 390px. Tables scroll inside their own frame.
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

`pnpm lint:tokens` is the check. It reads `src` and fails on seven things, each of which the codebase had already done:

| Rule | What fails |
| --- | --- |
| `space` | A `gap`, `padding` or `margin` that is not a `--di-space-*` token. The ramp is 2, 4, 6, 8, 12, 16, 24, 32, 48, 64, 96, named by value. |
| `radius` | A hand-set `border-radius`. Use `--di-radius-micro` \| `-control` \| `-surface` \| `-container` \| `-pill`. |
| `type` | A raw `font-size` in px. Use a `--di-font-size-*` step. |
| `size` | A raw length in component CSS (`src/components`, `styles/primitives.css`). Use a density token or a fixed measure from `component.css`. Exempt: values of 1px or less (rules, hairlines), borders, outlines and their offsets, strokes, underline offsets, a box-shadow ring of 2px or less, and media or container query conditions. |
| `colour` | A hex literal in a component. It is correct in daylight and wrong on the night sheet, because the token flips and a hex cannot. |
| `layer` | A component binding to a primitive. A primitive has no dark counterpart; bind to a semantic role, or define a local `--di-*` from it where a surface re-points its own roles, as `Toast` and the current `Stage` do. |
| `api` | A prop typed `ReactNode` in `src/components` other than `children`, an option's `icon` or `Menu.trigger`. |

`pnpm build` runs it first, so drift cannot reach the package. `pnpm check` runs the format check, ESLint, typecheck, the tests and the build together.

An exception has to say why, in a comment the lint reads:

```css
/* di-lint-allow-file colour: a specimen shows the literal brand colour,
 * because the colour itself is what it shows. */
```

`di-lint-allow <rule>: <reason>` covers the block it sits above; `di-lint-allow-file <rule>: <reason>` at the top covers the file. The Foundations specimen stylesheets use it. A rule with no stated reason is drift with a comment on it.

## Structure

Every story meta carries one layer tag, `layer:foundation`, `layer:primitive`, `layer:form`, `layer:block`, `layer:pattern` or `layer:screen`, and a module never imports one from a higher layer. `pnpm lint:structure` checks that and the rest of the structure, and `pnpm build` runs it:

- `.dependency-cruiser.cjs`: no import cycles; no component imports a screen, a Foundations page or the Storybook chrome; `src/internal` imports nothing that is drawn; another folder reaches a component or a shared module only through its `index.ts`, while a component's own subfolders reach each other directly; screens import from the package root. Sample data (`*.sample.ts`) is not package code and is exempt.
- `scripts/lint-conventions.mjs`: every component `.design-sync/conventions.md` names is exported, every group and story title it names exists, and it lists every sidebar group.
- `scripts/lint-layers.mjs`: the layer tags and their direction; a story file, its folder and its meta component share one name and the title mirrors the folder; a module is one sidebar entry; every public component is rendered in a story (as JSX or as its meta component) and has a doc comment; every title's group is one `storySort` lists; no two concept folders import each other.

All three fail on any finding; there is no list of tolerated ones. A change that cannot pass them changes the structure, or the rule with a reason, never the check's input.

## Checks

Visible text meets WCAG AA. Status is a word plus a mark, not colour alone. An icon-only button has an accessible name. Focus is visible: cornflower in both themes.

A screen has one `main` and one `h1`. Component stories get that wrapper from `.storybook/preview.tsx` when the story does not render its own heading. `pnpm test` fails on axe violations in both themes and at two widths: the `storybook` project runs every story light, `storybook-dark` runs it again dark, and `storybook-phone` and `storybook-phone-dark` run both again at 390px, and `storybook-compact` and `storybook-compact-phone` run light in compact density at both widths (`initialGlobals` in `vitest.config.ts`); the dark projects clear the root's theme before each story and checks after it that the root is dark. Axe measures aria-hidden text too, but at one point, and it leaves a node "incomplete" when it cannot model what is behind it — an SVG under every chart label, a pseudo-element such as the `Stepper` connector, an overlap — while the story test fails on violations only. `.storybook/tests/contrast` closes that gap: after each story, in both themes, it measures every visible text node at the start, middle and end of each line, reads the paint stack there (layers below composited to the first opaque one, an SVG shape by the stroke and fill that cover the point, semi-transparent layers above counted over text and ground) and fails on the worst point under 4.5:1, or 3:1 for large text. It fails instead of skipping what it cannot measure: gradient or pattern text, a gradient, background image, `<img>`, SVG `<image>` or canvas under or over text, text the hit test does not return at a point (a `clip-path`, which is not modelled), and text that cannot be scrolled into view. Not measured, because not shown: `display: none`, `visibility: hidden`, opacity 0, `.di-sr`, the part of a line its own box or an ancestor clips with `overflow` (a remainder a pixel wide or less is the visually hidden pattern, so hide text with `.di-sr` or that pattern with no padding), anything beyond the document's top or left edge, and a point an opaque layer covers. Inactive content is out, as in WCAG: disabled controls, a control or composite input group marked `aria-disabled` (not a section), `[inert]`, and what an open modal dialog makes inert (a popover shown above it is still measured). `.storybook/tests/contrast/visibleContrast.browser.test.ts` proves each failing case with a fixture. A story whose subject is the desktop arrangement (the sidebar beside the content, a toolbar on one line, an anchored popover) pins `viewport: { value: "desk" }` in its `globals` and has a phone story beside it where the arrangement differs; an assertion that only holds at one width checks `window.innerWidth`.

Code is formatted by Prettier (`pnpm format`; `pnpm format:check` in CI, print width 120 as in the products) and linted by ESLint (`pnpm lint`: typescript-eslint, the React hooks rules and jsx-a11y, zero findings). A rule is never switched off for the repo; a line that needs an exception carries `eslint-disable-next-line <rule> -- <why>`, and only where the rule is wrong for that case. The formatting commit is listed in `.git-blame-ignore-revs`.

Before handing work back, run `pnpm check` — `format:check`, `lint`, typecheck, the story tests and the unit tests beside pure modules (`src/**/*.test.ts`, for arithmetic a story cannot show), and `pnpm build`, which runs `lint:structure`, `lint:tokens` and the API check.

## Release

`version` in `package.json` and the git tag are the same number: `0.1.0` is the tag `v0.1.0`. Pushing that tag publishes `@data-insights-ai/ui` to GitHub Packages and uploads the built Storybook to `https://storybook.data-insights.ai`. A visual change on `main` does not publish. Push a tag only when a release was asked for.
