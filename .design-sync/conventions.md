## Building with this library

The system is a **Register**: the surface is a record, not a dashboard. Everything below follows from that.

### Setup — styles first, then two providers

Components read CSS custom properties from `:root`, so they are styled the moment `styles.css` is loaded; nothing has to wrap the tree for them to render. Two providers carry state an app owns. **`ThemeProvider`** themes the document root from the person's choice (`light`, `dark` or `auto`, which follows the device) before the first paint, and `useTheme` reads it back. **`SidebarProvider`** holds whether the `Sidebar` is expanded, for the sidebar family and its trigger. Other contexts (inside `AppShell`, `Page`, `Sidebar`) are internal to their components; a product does not mount them.

The interactive components (menus, dialogs, selects, comboboxes, date pickers, tabs) take their focus handling, keyboard movement and accessible names from Base UI's headless primitives; the date calendars' month grid comes from `react-day-picker`, and the typed date and time segments are spinbuttons of the package's own. That behaviour comes with the component: never rebuild one of them from raw markup to change how it looks.

Light is the bare `:root` default. Dark is a remap under `[data-theme="dark"]`. **Theme the document root** — that is what a product does:

```jsx
document.documentElement.dataset.theme = "dark";   // or remove it for daylight
```

A region can also carry a theme, and the token layers resolve correctly inside it: every semantic role and every component slot is re-declared wherever `data-theme` is set. A region has to paint its own ground, because the surface is a choice the region makes and the ink is not:

```jsx
<div data-theme="dark" style={{ background: "var(--di-bg-page)" }}>…</div>
```

This exists so a page can show both themes at once — `Foundations/Color` puts the night sheet beside daylight with it. For a product, prefer the document root: a half-dark screen is not a register. And it is not the way to put a **dark surface on a light page** — that is what `--di-inverse-*` is for (Toast, Tooltip, Stage, SignIn) and `--di-sidebar-*` for the rail. Those mean "a plane sitting on navy, in either theme"; a themed region means "the register after dark". Different things.

### Compose, never invent

Build from the components in this system. **If something you need is missing, say so — do not approximate it with raw markup.** A missing control is a code change in the library (a new component, with its own story and an export), not something a design invents. A hand-rolled substitute looks right in the design and cannot ship: it has no tokens, no dark theme, no focus handling and no accessible name.

`Patterns/*` are **not** in this bundle. The security overview, case triage, organization home and the older example screens exist in the repo but are not package exports, so they are not available here. Compose screens from `AppShell`, `PageHeader`, `AttentionList`, `Panel`, `DataTable` and the rest.

### How a screen is composed

- **The header only orients.** `PageHeader` holds the page's name, a `StatusPill` beside it and the meta (`PageHeaderMeta`: as of when, from where) — right of the name on a desktop, under it on a phone. No eyebrow, no claim, no rule, no button in a console header.
- **The first block is what needs the person**: `AttentionList` with at most three `AttentionItem`s; item 01 runs full width with the one primary button and the gold edge. When nothing is due, `AttentionClear` says "Everything is running".
- **A navy `Hero` only with a signature visual** — the chart that is the screen's argument — closed by `FigureRow variant="footer"`. Figures without a hero sit on `FigureRow variant="strip"`. Rules separate figures and nothing else.
- **A list beside its record is `ListDetail`**: the list pane a step above the ground, the selected row a step higher with a cornflower edge; on a phone the two are separate views with `ListDetailBack`.
- **Severity is `SeverityMark`**: one scale, a filled mark plus the word.
- Meta lines (`MetaLine`) break between items; `Actions` stack full width on a phone.

A screen's frame is `SidebarProvider` with the `Sidebar`, then `SidebarInset` holding **`AppShellBar`** (the `SidebarTrigger`, a `Breadcrumb`, then `AppShellBarEnd` with app-wide status, which folds into one overflow button on a narrow bar, and `AppShellBarKeep` for the notification bell, which never folds) and **`AppShellContent`**. Below 900px the `Sidebar` is a drawer from the inline start; do not build a second mobile nav.

### Where a component sits

The Storybook sidebar is grouped by the job a component does:

- `Foundations/`: the brand, the tokens and the reasoning behind them. No component lives here.
- `Actions/`: what a person presses: `Button`, `CountButton`, `CopyValue`, `RowActions`, `BulkActionBar`.
- `Forms/`: labelled controls: `TextField`, `TextArea`, `SearchField`, `FileField`, `Select`, `ComboBox`, `Switch`, `Checkbox` and the date fields.
- `Data/`: what a person reads: records (`AttentionList`, `RecordCard`, `LivingCard`, `FactList`, `KeyValues`), figures (`FigureRow`, `HeroFigure`, `Stat`, `StatTile`) and `DataTable`.
- `Text/`: how text is set: `Eyebrow`, `Highlight`, `Kbd`, `MetaLine`, `CodeBlock`, `PullQuote`, `TickRule`.
- `Marks/`: what every other component draws with: `Badge`, `SeverityMark`, `StatusPill`, `Chip`, `Tag`, `VersionTag`, `SealValue`, `Icon`, `IconTile`.
- `Status/`: the state of one thing, inline: `LevelMeter` so far; the status marks join it in the final move.
- `Feedback/`: `Notice`, `Toast`, `EmptyState`, `DangerZone`, `Tooltip`, and the loaders, progress bars and skeletons.
- `Overlays/`: what opens over the page: `Modal`, `ConfirmDialog`, `Sheet`, `Flyout`, `CreateFlow`, `ShortcutHelp`.
- `Navigation/`: how a person moves: `Sidebar`, `Breadcrumb`, `Tabs`, `TabNav`, `Menu`, `CommandBar`, `Pagination`, `Stepper`, `TextLink`.
- `Layout/`: how a page is arranged: `Page`, `PageHeader`, `SectionTitle`, `Panel`, `Hero`, `DetailSection`, `Stage`, `Stack`, `Grid`, `Split`, `ListDetail`, `Toolbar`, `Actions`, `Accordion`, `Disclosure`.
- `Charts/`: `Chart`, `ChartCard`, over time (`TrendChart`, `Sparkline`, `Seismograph`) and compared (`Bars`, `Distribution`, `CoverageMatrix`).
- `Timeline/`, `Inference/`: what happened when (`EventTimeline`, `TimelineSummary`, `ChainTimeline`, `PeriodTimeline`), and what the system inferred.
- `Shell/`: the frame of the app: `AppShellBar`, `AppShellContent`, `SignIn`, `SkipLink`, `ThemeProvider`, `DensityProvider`.
- `Patterns/`: whole screens composed from the above, as examples. Not in this bundle.

### Which component for which job

| Job | Use | Not |
| --- | --- | --- |
| What needs the person now | `AttentionList`, at most three items | a notice per item |
| The figures of a screen | `FigureRow` (`strip`, or `footer` under a `Hero`) | a row of `StatTile`s |
| A list beside one record | `ListDetail` | a table with a drawer |
| A severity | `SeverityMark` | a coloured word |
| What the one emphasised block asks for | `PanelLead`, its lead line above the proof and the actions | the ask buried in a note |
| A run of steps inside a surface | `Numbered variant="row"`: ruled rows, no box each | a box per step |
| A block of a record, or a plain surface | `Panel`, with a `title`, `surface="inset"` for a group inside another surface | |
| One measured value on its own surface | `StatTile`, with a `StatTileDelta` or a `Sparkline` when it has them | |
| A small labelled figure set in a row inside something else | `Figure` in a `FigureRow` | `Stat` and `StatRow`, deprecated, removed in 0.12.0 |
| The detail of one row | `Sheet` with an `eyebrow` naming the kind of record | |
| Work that needs more room than an inline form: a multi-field create or invite | `Sheet` | |
| The first step of a create flow: one of a handful of kinds | `ChoiceGroup appearance="cards"`, with `planned` for the kinds that cannot be chosen yet | disabled cards |
| An irreversible action | `Modal` or `ConfirmDialog` | a modal for anything reversible |
| A panel dropping from a topbar control | `Flyout` | |
| Views of one record | `Tabs` | `TabNav`, whose tabs are places with their own URL |
| A row's actions | `Menu` or `RowActions` | buttons repeated in every row |
| A message that stays on the page | `Notice` | `Toast`, the receipt of an action that already ran |
| Nothing to show yet | `EmptyState` | an empty table |
| A label for a control without one | `Tooltip` | a tooltip holding a fact that is nowhere else |
| A record read beside the decisions about it | `Split` | |
| A record's detail page, edited section by section | `DetailSection` | |
| A term and its value | `FactList`, or `KeyValues` for a short list | |
| A status | `StatusPill` | a coloured word, or colour alone |
| A recorded or inferred value | `SealValue` | a gold word |

### Styling idiom — tokens, not utility classes

There is no utility-class system. Style your own layout glue with `var(--di-*)`; never hand-write a `di-*` class, those belong to the components.

**Every dimension is a token too.** Spacing is `--di-space-2|4|6|8|12|16|24|32|48|64|96`, named by value; radius is `--di-radius-micro|control|inset|surface|container|pill`; type is `--di-font-size-100`…`-1000`. A raw px in `gap`, `padding`, `margin`, `border-radius` or `font-size` does not ship.

**Never write a raw colour.** No `#0A1F44`, no `rgb()`, no named colours — only `var(--di-*)`. This is not housekeeping: navy is both the ink and the action, and **after dark the action fill turns paper-white**. A hardcoded navy is correct in daylight and *invisible on the night sheet*, because navy cannot act against a navy ground. The token flips; a hex literal cannot.

| Need | Tokens |
| --- | --- |
| Surfaces | Depth is a step in tone: `--di-bg-chrome` (the sidebar, a step below), `--di-bg-page` (the ground), `--di-bg-surface` (a panel, a table, a list pane), `--di-bg-subtle` (inset), `--di-bg-strip`, `--di-bg-plane` (what floats, the selected row) |
| Ink | `--di-text`, `--di-text-muted`, `--di-text-subtle`, `--di-text-disabled`, `--di-text-on-strong`, `--di-text-on-seal` (ink on the filled seal) |
| Lines | `--di-rule`, `--di-rule-hairline`, `--di-border`, `--di-border-strong` |
| Space | `--di-space-2 4 6 8 12 16 24 32 48 64 96` — named by value, so `--di-space-12` is 12px |
| Radius | `--di-radius-micro` (4), `--di-radius-control` (6), `--di-radius-inset` (8), `--di-radius-surface` (12), `--di-radius-container` (12), `--di-radius-pill` |
| Type | `--di-font-display`, `--di-font-ui`, `--di-font-code`, `--di-font-size-100` … `-1000`, `--di-weight-regular/medium/semibold/bold` |
| Status | `--di-status-{ok,warn,danger,recorded,neutral}-{bg,fg,border,dot}` |
| The one thing | `--di-one`, `--di-one-edge`, `--di-one-ink` (navy in daylight, gold after dark) |
| Selection | `--di-select`, `--di-bg-selected`, `--di-focus` (cornflower) |
| Severity | `--di-severity-{critical,high,medium,low,info}` |
| Record marks | `--di-mark`, `--di-mark-ring`, `--di-mark-surface`, `--di-mark-ink` (neutral; gold inside `data-brand`); `--di-seal` only in a brand moment |
| Accents | `--di-highlight` (poppy), `--di-highlight-ink`, `--di-highlight-tint`; `--di-signal` (cornflower), `--di-signal-ink`, `--di-signal-tint` — see the rules below before using either |
| Motion | `--di-duration` (120ms), `--di-duration-slow` (200ms), `--di-ease` |
| Control height | `--di-control-h-sm` (28), `--di-control-h-md` (32, the standard), `--di-control-h-lg` (36), `--di-row-h` (40); compact 24 / 28 / 32 / 32 |
| Density | `--di-inset`, `--di-inset-group`, `--di-gap-*`, `--di-icon-*`, `--di-option-h`, `--di-pill-h` — one value per density (`data-density`) |
| On navy | `--di-inverse-bg`, `-raised`, `-border`, `-text`, `-muted`, `-seal` — a surface sitting on navy re-points its roles from these |

Rules that make output look native rather than approximate:

- **Navy is the ink and the action.** No accent acts. One filled navy control per view, so it is never unclear which button commits.
- **Depth is a step in tone, not a line.** A table sits on a surface without a frame of its own.
- **Poppy marks a passage on a brand page; cornflower selects.** Poppy is only ever `Highlight`. Cornflower is selection, focus and a compared series (`--di-chart-compare`). Neither is a status, so neither is a `tone`, and neither fills a button.
- **Gold marks the one thing in a view** — the first attention item, a verdict, the one value of a chart. In daylight it is an edge, a mark, or the small gold pill with navy words that names the one item (`emphasisLabel`) — **never gold text and never a gold wash under prose**; after dark gold text is allowed (`--di-one-ink`). The seal is the same gold and so a **brand moment only** — sign-in, the brand mark, empty and onboarding states, licence and certificate seals; never in an operational view beside the one thing, and `Button variant="seal"` is never an operational action. The record marks (`SealValue`, the inferred ring, a done step) are neutral in an operational view and turn gold only inside `data-brand`. Keep the word beside any mark.
- **Selection and focus are cornflower**, in both themes. Never ring focus in gold. Never remove a focus indicator.
- **Warn is its own amber**, so it never reads as the gold. Severity after dark runs orange for medium for the same reason.
- **Figures and machine values are mono and literal.** Timestamps are 24-hour UTC with the `Z` (`09:12:04Z`, `2026-09-18T09:12:04Z`); ordinals are zero-padded two digits (`01`, `02`). Figures are tabular.
- **Three families.** `--di-font-display` (Space Grotesk) is the page's name, a figure, a section head. `--di-font-ui` (IBM Plex Sans, 14px body) is prose. `--di-font-code` (IBM Plex Mono) is anything a machine wrote, and the capital label above a value.
- **Rules only between figures and table rows.** A surface carries a soft shadow at most; a detached plane — menu, modal, toast — a stronger one (`--di-shadow-plane`). No blur behind text.
- **A number only where the order is information.** The rows of a register carry their ordinal in a 38px index column (`--di-index-col`); the steps of a process are `Numbered` or a `Stepper`; the `AttentionList` ranks; a story numbers its phases. A panel, a sheet, a tile or an empty state carries no number: a sheet opened from a row names its record in the `eyebrow`, and a failure says so in words beside its title.
- Motion runs at one of two durations and no others: `--di-duration` 120ms and `--di-duration-slow` 200ms, ease-out, one change at a time.

### API shape

- **Only ever text → a `string` prop. Anything that can hold a component → a slot.** A slot is a named sub-component written as a child, in any order: `<Panel><PanelFooter>…</PanelFooter></Panel>`, `<Notice><NoticeIcon/>…`, `<Toast><ToastAction>…`.
- **A variant is one union prop**, never a family of booleans: `hint` + `hintTone` (`neutral | sealed | error`), `layout`, `tone`, `size`.
- **`tone` means one thing: status on the shared ramp** — `neutral | ok | warn | danger`, plus `recorded` and `inferred` on `StatusPill`. Anything that is not a status gets its own name: `surface` (`Panel`), `scope` (`PrivacyBadge`), `state` (`CommandChip`), `level` (a field’s `confidence`), `variant` (`Button`, `IconTile`, `Eyebrow`), `tier` (`PageHeader`, `SectionTitle`), `layout` (`FactList`, `Switch`), `labelTrack` (`TextField`, `Select`), `size` (`Button`, `Notice`), `gap` (`Stack`). `neutral` is the word for "nothing special" — never `default`, never `info`.
- **One name per thing.** The hollow ring is `inferred` everywhere: `SealMark`, `StatusPill`, `Button`. Never `ai`. Gold as a value is `seal`, never `gold` — a public prop does not name a colour.
- **Every visible string is a prop.** Nothing has baked-in language.
- **`DataTable` takes no `rows` array.** Map your own data into `TableHead`, `TableBody`, `TableRow`, `TableIndex`, `TableCell`; `TableToolbar` and `TableFooter` are slots. Under 600px of frame the grid scrolls sideways; `narrow="stack"` turns each row into a block instead, for a log or a list of events read row by row.
- **`Pagination` and `Switch` are controlled** — you own `page` / `checked`.
- **`Button` navigates when you give it an `href`** — it renders a real `<a>` carrying the same chrome, so a link that looks like a button is `<Button href="…" variant="secondary">`, never a hand-rolled anchor with button styling and never a `Button` wrapped in an `<a>`. A blocked link (`disabled` or `loading`) drops its `href` and carries `aria-disabled`, because an anchor has no `disabled`. `TextLink` is the underlined in-text control and stays a `<button>` — it is for acting, not for going somewhere.
- **`Icon` takes one Lucide icon as its child**: `<Icon label="Search"><Search aria-hidden /></Icon>`.
- **`Chart` wraps one Recharts chart**; `ChartConfig` names each series and its colour, and `ChartTooltip`/`ChartLegend` read the same config. Chart colours are only `--di-chart-series`, `--di-chart-highlight` (the one value, gold), `--di-chart-compare` (the comparison series, cornflower — also `LevelMeter`'s comparison track), `--di-chart-muted`, `--di-chart-band`. An ordered status scale (low → warn → danger: a stacked severity, a meter's zones, a `Distribution` row's `tone`) is `--di-chart-series`, `--di-chart-warn`, `--di-chart-danger` — not the status dots, which sit too close together to tell apart side by side. Never draw a one-off SVG chart.
- **A page or section heading is a slot, because it can hold a `Highlight`**: `<PageHeader eyebrow="…" lede="…"><PageHeaderTitle>…</PageHeaderTitle><PageHeaderAside>…</PageHeaderAside></PageHeader>`, and `SectionTitleHeading` / `SectionTitleMeta` the same way. A `Panel`, `Modal` or `Sheet` title stays a string — the page marks one place, and it is never a panel's title.
- Nothing a model proposes runs before an operator confirms it, and the confirmation states basis, scope and reversibility first.

### Exploring a variation

To try different colour, override token **values** — never swap a component's styling, and never write a hex into markup. One block at the top of the design and every component follows, in both themes:

```css
:root { --di-one: #B8912F; --di-fill-strong: #0E2A55; }
:root[data-theme="dark"] { --di-fill-strong: #F2F0E6; }
```

Keep the names and keep the roles: `--di-seal` stays the *recorded* mark, `--di-ai-ring` stays *inferred*, a status `-bg` stays a pale wash its `-fg` reads on. Redefining what a token **means** breaks the register even when the colour is pretty. When handing back, say which tokens you changed; engineering sets those values in the token files.

These rules are enforced in the library, not merely requested: an axe violation fails its tests, visible text must meet WCAG AA, and status must be a word plus a mark rather than colour alone. A design that follows them ships as-is.

### The type scale

Every step is a token. A **console** screen lives in the bottom of the ramp and
never goes above `-700`; the top two steps are the display tier the brand pages
use, and nothing else.

| Role | Token | Face | Size | Weight | Where |
| --- | --- | --- | --- | --- | --- |
| Display | `--di-font-size-1000` | Space Grotesk | 56px | 700 | Brand page title |
| Title | `--di-font-size-800` | Space Grotesk | 34px | 700 | Brand page section |
| Page | `--di-font-size-700` | Space Grotesk | 28px | 700 | `PageHeader`: the page's name; `Figure` value |
| Section | `--di-font-size-600` | Space Grotesk | 20px | 700 | `SectionTitle`, the attention heading |
| Brand lede | `--di-font-size-550` | IBM Plex Sans | 18px | 400 | `PageHeader tier="brand"` lede |
| Block | `--di-font-size-500` | IBM Plex Sans | 16px | 600 | A panel's or an attention item's title |
| **Body** | `--di-font-size-400` | IBM Plex Sans | **14px** | 400 | The console body — `base.css` |
| Interface | `--di-font-size-400` | IBM Plex Sans | 14px | 500 | Control labels |
| Hint | `--di-font-size-300` | IBM Plex Sans | 12px | 400 | Field hints, a panel's note |
| Meta | `--di-font-size-300` | IBM Plex Mono | 12px | 400 | `MetaLine`, `PageHeaderMeta` |
| Identifier | `--di-font-size-400` | IBM Plex Mono | 14px | 400 | Identifiers, hashes, timestamps |
| Label | `--di-font-size-200` | IBM Plex Mono | 11px | 500 | The label above a value — uppercase, 0.1em |
| Micro | `--di-font-size-100` | IBM Plex Mono | 10px | 500 | `Kbd`, tile ordinal |

`-550` is the ramp's one interpolated step, and it is the reason the brand tier
reads: 16 to 20 is where prose hierarchy lives, and with nothing between them a
page lede, a section lede and a card heading all landed on 16.

Figures are tabular throughout, so a column of readings does not jitter as it
updates.

### The dimensional ramps

`Foundations/Scale` draws these. It is a rendered page, not markdown, so it
cannot ship as a guideline — this is the copy of it, and the library refuses
any value off these ramps.

**Space** — 2, 4, 6, 8, 12, 16, 24, 32, 48, 64, 96. Fine at the bottom, coarse
at the top, because that is where the density is: a 28px control cannot be padded
on a 4px grid. 4 is a mark to its word; 6 is inside a dense control; 8 is inside
a standard one; 12 is a panel header or a table cell; 16 is panel content; 24 is
between panels; 32 between sections. The last two steps are the brand tier, the
way the top two type steps are: 48 separates the parts of a brand page, 64 and 96
separate the parts from each other, and **a console screen stops at 48**.

**Radius** — the smaller the control, the tighter the corner. A field is 4px and
the surface holding it is 12px, so the field reads as set *into* the sheet rather
than floating on it. Only a pill is fully round, and only because it is a mark.

**Control height** — md (32px) is the standard and covers every form control
unless told otherwise. sm (28) is a toolbar control, a chip. lg (36) is a lone
primary action, the command bar, the tab strip. 40 is a table row.

**Density** — the person chooses comfortable (the default, the values above) or
compact; `DensityProvider` sets `data-density` on the root, and any region may
set it on its own element. Density scales every size and inset, and a `size`
(sm, md, lg) stays a role: never pick a smaller size to make a screen denser.
Compact keeps 40px targets on a touch screen. `Foundations/Density` has the
matrix.

**The index column** — 38px (`--di-index-col`): the ordinal of a row in
`DataTable` and `SkeletonTable`, and the icon column of `Notice` and `Modal`.
Nothing else carries a number of its own.

### What this system refuses

`Foundations/Decisions` is the record, with a reason on every line. The short
version, because a generator that does not know these will reach for them:

- **No undo-first.** Every action is confirmed *before* it runs, stating basis,
  scope and reversibility. What follows is a receipt carrying an audit id
  (`Toast`), never a way back.
- **No glassmorphism or backdrop blur.** A mono value behind frosted glass has
  no measurable contrast.
- **No gradient edges, glow, pulse or sparkle glyphs.** The least verifiable
  output cannot be the most decorated one.
- **No navigation that hides or reorders itself.** The rail is fixed, in the
  order the product declares.
- **An AI control is marked by a hollow ring and a gold hairline**, never by a
  gradient or a sparkle — the unsealed thing is the *less* decorated one.
- **Micro-interaction is a colour change on buttons**, 120ms, ease-out. No lift,
  no scale, no press. Never on a table row: forty thousand rows have to hold
  still.

### The mark

Six fixed assets, each with one context: **Primary** (navy on ivory or paper — the default lockup), **Inverse** (ivory on navy — sidebar, cover, dark fields), **Monochrome** (one colour, when the pair cannot be printed), **Mark only** (the symbol, when the name is already in the sentence) **Mark, inverse** (the same symbol on navy; the gold node is the tittle) and **Mark, mono** (the symbol in one ink, where the mono lockup has no room). A lockup is never rebuilt from the mark and a typeface.

Minimum sizes: **20px** height digital (UI, web, small cards), **10mm** in print (letterheads, cards), **16px / 6mm** for the mark alone (favicons, avatars).

Clear space: X is the height of the mark's cap. Keep at least **1X** of empty space on all four sides.

Six things never to do — the logo is one unit, and each of these breaks the meaning:

- **Don't stretch or skew** — scale it uniformly.
- **Don't recolour** — only navy and gold, or the inverse.
- **Don't put it on gold** — the mark disappears. Inverse is for navy.
- **Don't add a drop shadow** — the mark is flat.
- **Don't use a photograph** — solid navy or ivory only.
- **Don't rotate** — the mark stays horizontal.

Beside another mark: match optical height, not the bounding box. The separator is a vertical rule — never an ampersand, slash, plus or multiplication sign. In a strip of three or more, use the monochrome logo.

### Where the truth is

Read the real files before styling: `styles.css` and its `@import` closure carry every token; each component's `<Name>.d.ts` is its exact API and `<Name>.prompt.md` its usage notes. They beat any summary here.

`guidelines/` carries the brand's own foundation documents — the Register rules, the essence, the voice, the mark, the surfaces and the practice. **Read them before composing a whole screen**: they hold the reasoning behind everything above, which is what keeps output on-brand rather than merely on-token. They are the source; where this header and a guideline disagree, the guideline wins.

### A brand page

The same library, at the display tier. There is **no parallel set of brand
components** — `PageHeader` and `SectionTitle` each carry a `tier`, and `brand`
is the other value.

- **`tier="brand"`** sets the title on the top of the ramp and measures it to
  16ch (`PageHeader`) or 22ch (`SectionTitle`), with the lede at
  `--di-font-size-550` / `-500`. It carries **no bottom margin**: a brand page's
  rhythm belongs to the `Stack` around it.
- **`Stack gap={48}`, `{64}`, `{96}`** is that rhythm. 48 separates the parts of
  a page, 64 and 96 separate the parts from each other. A console screen stops at
  48.
- **`FactList layout="grid"`** for a band of terms; **`PullQuote`** for the page's
  one sentence of rhetoric (no attribution — a pull quote with a byline is a
  testimonial); and **`Grid`** for a two-column band.
- **`labelTrack="prose"`** on `TextField` and `Select`, where a person is filling
  a form in for themselves rather than reading a record.
- **`Eyebrow`** has two variants and they are not interchangeable. `sealed` is the
  section label beside the seal with a rule to the edge, and there is **one per view**.
  `plain` is the label alone and repeats down a page — it is what `PageHeader` and
  `SectionTitle` render from their `eyebrow` string. A page that repeated the
  sealed one would be claiming a seal per heading.

The Foundations pages are rendered from exactly these components and nothing
else, which is what keeps the tier honest.

### A build

```jsx
<Panel title="Source register">
  <PanelMeta><SealValue stateLabel="Sealed">09:12:04Z</SealValue></PanelMeta>
  <DataTable caption="Sources" indexed={true}>
    <TableHead>
      <TableColumn index={true}>Ordinal</TableColumn>
      <TableColumn sort="ascending">Host</TableColumn>
      <TableColumn>Manifest</TableColumn>
      <TableColumn align="end">State</TableColumn>
    </TableHead>
    <TableBody>
      <TableRow>
        <TableIndex>01</TableIndex>
        <TableCell>
          <CellLead>
            <CellIcon><Server aria-hidden /></CellIcon>
            <CellStack primary="registry.example.org" secondary="WS-01 · registry" />
          </CellLead>
        </TableCell>
        <TableCell>
          <SealValue state="sealed" stateLabel="Sealed">a4f9c21e</SealValue>
        </TableCell>
        <TableCell align="end"><StatusPill tone="ok">running</StatusPill></TableCell>
      </TableRow>
    </TableBody>
  </DataTable>
  <PanelFooter>1–5 of 24</PanelFooter>
  <PanelActions><Button variant="primary">Seal entry</Button></PanelActions>
</Panel>
```

A `Panel` is one surface at one inset all round (24px, 16px on a phone): the head, the content and the footer are rows 16px apart, never bands. The title is the display face and the block's one bold line; `PanelLead`, the body and `PanelNote` are regular weight. A state sits beside the title it qualifies (`PanelStatus` holding a `StatusPill`); a count or a time sits at the head's end (`PanelMeta`); `PanelActions` sit at the end of the `PanelFooter` row, or at the head's end when there is no footer.

`TableHead` holds `TableColumn` (props: `index`, `sort`, `align`) — there is no `as="th"`. `TableRow` takes `active` and `tone`; `TableCell` takes `align` and `mono`. A cell's lead is `CellLead` + `CellIcon` + `CellStack`.

**A line that reports a measured value is a slot, not a string.** A count, a timestamp, a version, a delta, a caveat or a basis routinely arrives sealed, in the mono track, or with a state beside it, and a `string` prop can carry none of that. These are the slots: `PanelMeta`, `StageFooter`, `ExplainFooter`, `RecordCount`, `SessionDetail`, `StatTileDelta`, `LivingBasis`, `SignInVersion`. Text a person reads as prose — `title`, `label`, `caption`, `legend`, `body`, and every `*Label` accessible name — stays a string prop.
