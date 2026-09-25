## Building with this library

The system is a **Register**: the surface is a record, not a dashboard. Everything below follows from that.

### Setup — there is no provider

There is no theme provider and no React context. Components read CSS custom properties from `:root`, so they are styled the moment `styles.css` is loaded. Do not wrap the tree in anything.

Light is the bare `:root` default. Dark is a remap under `:root[data-theme="dark"]`, so it is set **on the document root only**:

```jsx
document.documentElement.dataset.theme = "dark";   // or remove it for daylight
```

It cannot be scoped to a subtree. Component slots such as `--di-button-primary-bg` resolve through semantic tokens at `:root`, so `<div data-theme="dark">` styles nothing. There is no dark island; theme the page or not at all.

### Compose, never invent

Build from the components in this system. **If something you need is missing, say so — do not approximate it with raw markup.** A missing control is a code change in the library (a new component, with its own story and an export), not something a design invents. A hand-rolled substitute looks right in the design and cannot ship: it has no tokens, no dark theme, no focus handling and no accessible name.

`Screens/*` are **not** in this bundle. `RegisterScreen`, `WatchlistScreen` and the rest exist in the repo but are not package exports, so they are not available here. Compose screens from `Console`, `Panel`, `DataTable` and the rest.

### Styling idiom — tokens, not utility classes

There is no utility-class system. Style your own layout glue with `var(--di-*)`; never hand-write a `di-*` class, those belong to the components.

**Every dimension is a token too.** Spacing is `--di-space-2|4|6|8|12|16|24|32|48`, named by value; radius is `--di-radius-micro|control|surface|container|pill`; type is `--di-font-size-100`…`-1000`. `pnpm lint:tokens` fails on a raw px in `gap`, `padding`, `margin`, `border-radius` or `font-size`, and on a component binding to a primitive.

**Never write a raw colour.** No `#0A1F44`, no `rgb()`, no named colours — only `var(--di-*)`. This is not housekeeping: navy is both the ink and the action, and **after dark the action fill turns gold**. A hardcoded navy is correct in daylight and *invisible on the night sheet*, because navy cannot act against a navy ground. The token flips; a hex literal cannot.

| Need | Tokens |
| --- | --- |
| Surfaces | `--di-bg-page` (warm paper, the page), `--di-bg-surface` (a panel/field/card), `--di-bg-grid` (white — tables only), `--di-bg-subtle` |
| Ink | `--di-text`, `--di-text-muted`, `--di-text-subtle`, `--di-text-disabled`, `--di-text-on-strong` |
| Lines | `--di-rule`, `--di-rule-hairline`, `--di-border`, `--di-border-strong` |
| Space | `--di-space-2 4 6 8 12 16 24 32 48` — named by value, so `--di-space-12` is 12px |
| Radius | `--di-radius-micro` (4), `--di-radius-control` (6), `--di-radius-surface` (8), `--di-radius-container` (12), `--di-radius-pill` |
| Type | `--di-font-ui`, `--di-font-code`, `--di-font-size-100` … `-1000`, `--di-weight-regular/medium/semibold/bold` |
| Status | `--di-status-{ok,warn,danger,recorded,neutral}-{bg,fg,border,dot}` |
| Record marks | `--di-seal`, `--di-seal-ink`, `--di-ai-ring`, `--di-ai-ink` |
| Motion | `--di-duration` (120ms), `--di-duration-slow` (200ms), `--di-ease` |
| Control height | `--di-h-dense` (28), `--di-h-ctl` (32, the standard), `--di-h-comfort` (36), `--di-h-row` (40) |
| On navy | `--di-inverse-bg`, `-raised`, `-border`, `-text`, `-muted`, `-seal` — a surface sitting on navy re-points its roles from these |

Rules that make output look native rather than approximate:

- **Navy is the ink and the action.** There is no accent colour. One filled navy control per sheet, so it is never unclear which button commits.
- **Gold means sealed, not important.** A filled dot (`--di-seal`) is a recorded, verifiable value; a hollow ring (`--di-ai-ring`) is a value a model inferred. Never swap them — it inverts the meaning. The mark is never the only channel: keep the word beside it.
- **Gold is a mark, not type.** Gold 500 and Gold 600 do not clear AA as small text on paper. Small gold text uses `--di-seal-ink` (`#7A5C0E`); gold text on navy uses Gold 400. On ivory, a gold-adjacent ink needs `#061631` rather than navy to clear.
- **Focus follows its ground**, and this is a mistake the system already made once: `--di-focus` is navy on paper and Gold 400 after dark, and `--di-sidebar-focus` is gold on the navy rail. Do not ring focus in seal gold on paper — it measures **2.1:1**, under the **3:1** a focus indicator has to clear. Never remove a focus indicator.
- **Anomaly runs on the gold ramp.** Do not introduce a second yellow, or a generic traffic-light green or red — the four status pairs above are the whole set.
- **Figures and machine values are mono and literal.** Timestamps are 24-hour UTC with the `Z` (`09:12:04Z`, `2026-09-18T09:12:04Z`); ordinals are zero-padded two digits (`01`, `02`). Figures are tabular.
- **`--di-font-code` (JetBrains Mono) is for anything a machine wrote**: identifiers, hashes, timestamps, measured values, `§` marks. Prose is `--di-font-ui`. Which track a string sits in says where it came from.
- **Depth is a 1px rule.** Only a detached plane — menu, modal, toast — gets a shadow (`--di-shadow-plane`). No blur behind text.
- **Every panel, table, drawer, notice and empty state carries a 38px index column** (`--di-index-col`) holding an ordinal, a letter or a `§`. A drawer keeps the ordinal of the row it opened from; a failure keeps its ordinal, tinted.
- Motion runs at one of two durations and no others: `--di-duration` 120ms and `--di-duration-slow` 200ms, ease-out, one change at a time.

### API shape

- **Only ever text → a `string` prop. Anything that can hold a component → a slot.** A slot is a named sub-component written as a child, in any order: `<Panel><PanelFooter>…</PanelFooter></Panel>`, `<Notice><NoticeIcon/>…`, `<Toast><ToastAction>…`.
- **A variant is one union prop**, never a family of booleans: `hint` + `hintTone` (`neutral | sealed | error`), `layout`, `tone`, `size`.
- **`tone` means one thing: status on the shared ramp** — `neutral | ok | warn | danger`, plus `recorded` and `inferred` on `StatusPill`. Anything that is not a status gets its own name: `surface` (`Panel`), `scope` (`PrivacyBadge`), `state` (`CommandChip`), `level` (`ConfidenceField`), `variant` (`Button`, `IconTile`). `neutral` is the word for "nothing special" — never `default`, never `info`.
- **One name per thing.** The hollow ring is `inferred` everywhere: `SealMark`, `StatusPill`, `Button`. Never `ai`. Gold as a value is `seal`, never `gold` — a public prop does not name a colour.
- **Every visible string is a prop.** Nothing has baked-in language.
- **`DataTable` takes no `rows` array.** Map your own data into `TableHead`, `TableBody`, `TableRow`, `TableIndex`, `TableCell`; `TableToolbar` and `TableFooter` are slots.
- **`Pagination` and `Switch` are controlled** — you own `page` / `checked`.
- **`Icon` takes one Lucide icon as its child**: `<Icon label="Search"><Search aria-hidden /></Icon>`.
- **`Chart` wraps one Recharts chart**; `ChartConfig` names each series and its colour, and `ChartTooltip`/`ChartLegend` read the same config. Chart colours are only `--di-chart-series`, `--di-chart-accent`, `--di-chart-muted`, `--di-chart-band`.
- Nothing a model proposes runs before an operator confirms it, and the confirmation states basis, scope and reversibility first.

### Exploring a variation

To try different colour, override token **values** — never swap a component's styling, and never write a hex into markup. One block at the top of the design and every component follows, in both themes:

```css
:root { --di-seal: #B8912F; --di-fill-strong: #0E2A55; }
:root[data-theme="dark"] { --di-fill-strong: #D8BE81; }
```

Keep the names and keep the roles: `--di-seal` stays the *recorded* mark, `--di-ai-ring` stays *inferred*, a status `-bg` stays a pale wash its `-fg` reads on. Redefining what a token **means** breaks the register even when the colour is pretty. When handing back, say which tokens you changed — engineering pastes the values into `src/styles/tokens/`.

These rules are enforced in the repository, not merely requested: `pnpm test` fails on axe violations, visible text must meet WCAG AA, and status must be a word plus a mark rather than colour alone. A design that follows them ships as-is.

### The type scale

Every step is a token. The console lives in the bottom four; Display and Title
exist for the brand pages, and a product screen never goes above `-700`.

| Role | Token | Face | Size | Weight | Where |
| --- | --- | --- | --- | --- | --- |
| Display | `--di-font-size-1000` | Space Grotesk | 56px | 700 | Brand page title |
| Title | `--di-font-size-800` | Space Grotesk | 34px | 700 | Brand page section |
| Page | `--di-font-size-700` | Space Grotesk | 28px | 700 | `PageHeader` |
| Section | `--di-font-size-600` | Space Grotesk | 20px | 700 | `SectionTitle`, `Metric` figure |
| Lede | `--di-font-size-500` | Space Grotesk | 16px | 400 | Brand page lede |
| **Body** | `--di-font-size-400` | Space Grotesk | **13px** | 400 | The console body — `base.css` |
| Interface | `--di-font-size-400` | Space Grotesk | 13px | 500 | Control labels |
| Meta | `--di-font-size-300` | Space Grotesk | 12px | 400 | Screen lede, field hints |
| Measurement | `--di-font-size-700` | JetBrains Mono | 28px | 500 | `StatTile` figure |
| Identifier | `--di-font-size-400` | JetBrains Mono | 13px | 400 | Hashes, timestamps |
| Section mark (`§`) | `--di-font-size-200` | JetBrains Mono | 11px | 500 | `--di-tracking-eyebrow`, uppercase, Seal ink |

Figures are tabular throughout, so a column of readings does not jitter as it
updates.

### The dimensional ramps

`Foundations/Scale` draws these. It is a rendered page, not markdown, so it
cannot ship as a guideline — this is the copy of it, and it is checked by
`pnpm lint:tokens`, which fails on any value off these ramps.

**Space** — 2, 4, 6, 8, 12, 16, 24, 32, 48. Fine at the bottom, coarse at the
top, because that is where the density is: a 28px control cannot be padded on a
4px grid. 4 is a mark to its word; 6 is inside a dense control; 8 is inside a
standard one; 12 is a panel header or a table cell; 16 is panel content; 24 is
between panels; 32 between sections.

**Radius** — the smaller the control, the tighter the corner. A field is 4px and
the panel holding it is 8px, so the field reads as set *into* the sheet rather
than floating on it. Only a pill is fully round, and only because it is a mark.

**Control height** — 32px is the standard and covers every form control unless
told otherwise. 28 is a toolbar control, a chip, a menu item. 36 is a lone
primary action, the command bar, the tab strip. 40 is a table row.

**The index column** — 38px (`--di-index-col`), or 26px (`--di-index-col-sm`)
where the block is too short to give up the full width. It is carried by
`Panel`, `DataTable`, `Drawer`, `Notice`, `EmptyState`, `Modal`, `SignIn`,
`StatTile` and `SkeletonTable`. `Card`, `Toast`, `Stage`, `Session` and `Metric`
carry none — they report, they are not entries.

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

Five fixed assets, each with one context: **Primary** (navy on ivory or paper — the default lockup), **Inverse** (ivory on navy — sidebar, cover, dark fields), **Monochrome** (one colour, when the pair cannot be printed), **Mark only** (the symbol, when the name is already in the sentence) and **Mark, inverse** (the same symbol on navy; the gold node is the tittle). A lockup is never rebuilt from the mark and a typeface.

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

### A build

```jsx
<Panel title="Source register" index="01" surface="grid">
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
  <PanelFooter>
    <div style={{ display: "flex", gap: "var(--di-space-3)", alignItems: "center" }}>
      <span style={{ fontFamily: "var(--di-font-mono)", fontSize: "var(--di-font-size-200)", color: "var(--di-text-muted)" }}>
        1–5 of 24
      </span>
      <Button variant="primary">Seal entry</Button>
    </div>
  </PanelFooter>
</Panel>
```

`TableHead` holds `TableColumn` (props: `index`, `sort`, `align`) — there is no `as="th"`. `TableRow` takes `active` and `tone`; `TableCell` takes `align` and `mono`. A cell's lead is `CellLead` + `CellIcon` + `CellStack`.

**A line that reports a measured value is a slot, not a string.** A count, a timestamp, a version, a delta, a caveat or a basis routinely arrives sealed, in the mono track, or with a state beside it, and a `string` prop can carry none of that. These are the slots: `PanelMeta`, `StageFooter`, `ExplainFooter`, `MetricNote`, `RecordCount`, `SessionDetail`, `StatTileDelta`, `LivingBasis`, `SignInVersion`. Text a person reads as prose — `title`, `label`, `caption`, `legend`, `body`, and every `*Label` accessible name — stays a string prop.
