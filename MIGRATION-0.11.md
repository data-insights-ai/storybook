# Upgrading to 0.11

0.11 merges many components into fewer and keeps no old name behind: no alias, no wrapper, no prop that is accepted and ignored. Bump `@data-insights-ai/ui` to `0.11.3` (0.11.0 was never published) and run the product's typecheck: it finds every removed export and prop. Class names, tokens and changed behaviour it cannot find; they are listed here too. This guide gives the replacement for each change, with a short example.


## Old name → new

| Removed | Use |
| --- | --- |
| `Actions` | `Toolbar align="end"` |
| `BulkActionBar` | `Toolbar frame="bar" sticky="top"` with `ToolbarStatus`, `ToolbarSelection`, `ToolbarEnd` |
| `CountButton` | `Button variant="ghost" iconOnly badge badgeLabel` |
| `RowActions` | `Toolbar variant="row" label` |
| `SegmentedControl`, `ToggleGroup`, `ChoiceCards` | `ChoiceGroup appearance="segments"`, `"toggles"`, `"cards"` |
| `ChoiceCard`, `ToggleOption`, `ChoiceCardsPlanned` (types) | `ChoiceOption`, `ChoicePlanned` |
| `TokenField` | `MultiComboBox freeEntry validate` |
| `ConfidenceField` | `TextField readOnly confidence` |
| `SaveBar` | `Toolbar role="region" frame="bar" sticky="bottom"` |
| `FieldStack` | `Stack variant="form"` |
| `InlineForm` | `Toolbar fillFirst` |
| `KeyValues`, `KeyValue` | `FactList layout="pairs"`, `Fact` |
| `Stat`, `StatRow` | `Figure`, `FigureRow` |
| `StatTile`, `StatTileDelta` | `Panel` with a `Figure`, `FigureNote` |
| `HeroFigure` | `Figure size="hero"` |
| `ExplainPanel`, `ExplainRow`, `ExplainFooter`, `ExplainIgnored` | `ProposalPanel`, `Fact`, `ProposalNote`, `ProposalIgnored` |
| `ConfirmPanel`, `ConfirmActions` | `ProposalPanel`, `ProposalActions` |
| `LivingCard`, `Session`, `Channel` and their parts | `RecordCard` and its slots |
| `AttentionClear` | `Notice variant="line" tone="ok"` |
| `ListToolbar`, `ListToolbarEnd`, `ListToolbarNote` | `Toolbar role="search"`, `ToolbarEnd`, `ToolbarNote` |
| `TableToolbar` | a `Toolbar` in the `DataTable` |
| `TableSpacer`, `heldCount` | nothing; `InfiniteTable` keeps them inside |
| `Chip`, `VersionTag`, `CommandChip` | `Tag mono` |
| `PrivacyBadge` | `StatusPill track="record" icon` |
| `Spinner`, `AppLoader`, `SkeletonPage`, `SkeletonTable`, `SkeletonPageVariant` | `Loading shape`, `LoadingShape` |
| `Sheet`, `SheetFooter` | `Dialog`, `DialogFooter` |
| `Modal`, `ModalFrame`, `ModalContent`, `ModalTitle`, `ModalBody`, `ModalFooter`, `ModalIcon` | `Dialog placement="center"`, `DialogFooter` |
| `Stepper`, `Numbered` | `Steps variant="progress"`, `Steps variant="list"` |
| `Stage`, `StageTrack`, `StageIcon`, `StageFooter` | `Steps variant="cards"`, `Step`, `StepIcon`, `StepFooter` |
| `DangerZone` | `Panel tone="danger"` with `DangerAction` |
| `SectionTitle`, `SectionTitleHeading`, `SectionTitleMeta` | `PageHeader level={2}`, `PageHeaderTitle`, `PageHeaderMeta` |
| `Hero`, `HeroAside`, `HeroLead`, `HeroVisual`, `HeroFooter` | `Panel surface="hero"`, `PanelActions`, `PanelFigure`, `PanelVisual`, `PanelFooter` |
| `ListDetail` and its parts | `Split variant="list"` and its parts |
| `Accordion`, `AccordionItem`, `AccordionDetail`, `AccordionMeta` | `DisclosureGroup`, `Disclosure toggle="head"`, `DisclosureDetail`, `DisclosureMeta` |
| `ChartCard`, `ChartCardAction`, `ChartCardGrid` | `Panel` with `PanelFigure`, `PanelActions`, `PanelVisual`; `Grid min` |
| `Bars` | `Sparkline width="fill" height="md" captions` |
| `WeekTimeline`, `WeekTimelineRow` | `PeriodTimeline` in minutes, `PeriodRow` |
| `Period` (type) | `PeriodRow`, `PeriodSpan` |
| `AppShell`, `AppShellRail`, `AppShellMain`, `AppShellFoot`, `AppShellContext`, `NavGroup`, `NavItem` | `SidebarProvider`, `Sidebar`, `SidebarInset`, `AppShellBar`, `AppShellContent` |

| Removed prop or value | Use |
| --- | --- |
| `Button size="dense"`, `size="comfort"` | `size="sm"`, `size="lg"` |
| `SearchField dense` | `size="sm"` |
| `QuantityField labelHidden` | `hideLabel` |
| `TableRow tone` | a State column |
| `Sparkline bars` | `values`, `highlight`, `tone` |
| `Progress countTrack` | `LevelMeter` for a quota |
| `Notice size` | nothing |
| `CommandRow active` | nothing; the bar highlights its rows |
| `Disclosure meta` | a `DisclosureMeta` child |
| `PageHeaderTitle level` | `PageHeader level` |
| `Panel index`, `indexSize`, `indexTone`, `indexRule`, `surface="grid"` | nothing; `Steps` for a real sequence |
| `EmptyState index`, `Sheet index`, `StatTile index` | nothing; name the record in `eyebrow` |
| `PeriodTimeline periods`, `today`, `todayLabel` | `rows`, `marker` |
| `AppShellBarEnd` without `moreLabel` | `moreLabel` is required |

## Actions

### `Button size="dense"` and `size="comfort"`

The sizes are `sm`, `md` and `lg`. `dense` is `sm`, `comfort` is `lg`. Density (`DensityProvider`) scales every size.

```tsx
<Button size="dense">Clear</Button>      →  <Button size="sm">Clear</Button>
<Button size="comfort">Sign in</Button>  →  <Button size="lg">Sign in</Button>
```



### `CountButton` → `Button badge`

The count is a badge on an icon-only ghost button. `badge` takes the number (Button draws "99+" itself); the words go in `badgeLabel`, the name in `aria-label`. The count now follows the icon instead of covering it, so the button is wider.

```tsx
<CountButton label="Notifications, 3 unread" count={3} countLabel="3"
  expanded={open} controls="inbox" onClick={toggle}><Bell /></CountButton>
→
<Button variant="ghost" iconOnly aria-label="Notifications" badge={3} badgeLabel="3 unread"
  aria-expanded={open} aria-controls="inbox" onClick={toggle}><Bell /></Button>
```



### `BulkActionBar` → `Toolbar frame="bar"`

A labelled group, not an ARIA toolbar: every button keeps its own tab stop.

```tsx
<BulkActionBar label="Selection" selectedLabel="3 selected" clearLabel="Clear" onClear={clear}
  selectAllLabel="Select all 40" onSelectAll={all}>{actions}</BulkActionBar>
→
<Toolbar label="Selection" frame="bar" sticky="top">
  <ToolbarStatus>3 selected</ToolbarStatus>
  <ToolbarSelection clearLabel="Clear" onClear={clear} selectAllLabel="Select all 40" onSelectAll={all} />
  <ToolbarEnd>{actions}</ToolbarEnd>
</Toolbar>
```



### `RowActions` → `Toolbar variant="row"`

Give the row's toolbar a `label` that names the row.

```tsx
<RowActions>{buttons}</RowActions>  →  <Toolbar variant="row" label={`Actions for ${row.name}`}>{buttons}</Toolbar>
```



### `Actions` → `Toolbar align`

The closing buttons of a form or a block. On a phone they now wrap instead of stacking at full width.

```tsx
<Actions>{buttons}</Actions>               →  <Toolbar align="end">{buttons}</Toolbar>
<Actions align="start">{buttons}</Actions>  →  <Toolbar align="start">{buttons}</Toolbar>
```



### Ghost button

A ghost Button has no underline any more. Where a ghost button really is a link, use `variant="link"` or a `TextLink`. No code change otherwise.


## Forms

### `SegmentedControl`, `ToggleGroup`, `ChoiceCards` → `ChoiceGroup appearance`

One component, `ChoiceGroup`, with `appearance`. `ToggleGroup` needs a `name` now; its days are checkboxes in one joined row. The option types are `ChoiceOption` and `ChoicePlanned` (`ChoiceCard`, `ToggleOption` and `ChoiceCardsPlanned` are gone). Classes: `di-segmented`, `di-segment`, `di-toggle*`, `di-choicecard(s)*` → `di-choice-segments`, `di-choice-segment`, `di-choice-cards`, `di-choice-card*`, `di-choice-planned*`; the chosen state is `.is-chosen`.

```tsx
<SegmentedControl name="view" legend="Show" options={o} value={v} onChange={set} />
→ <ChoiceGroup appearance="segments" hideLegend name="view" legend="Show" options={o} value={v} onChange={set} />

<ToggleGroup legend="Quiet on" options={days} value={d} onChange={setD} />
→ <ChoiceGroup appearance="toggles" multiple name="quiet" legend="Quiet on" options={days} value={d} onChange={setD} />

<ChoiceCards name="kind" legend="Source" options={o} value={v} onChange={set} planned={p}>{detail}</ChoiceCards>
→ <ChoiceGroup appearance="cards" name="kind" legend="Source" options={o} value={v} onChange={set} planned={p}>{detail}</ChoiceGroup>
```



### `TokenField` → `MultiComboBox freeEntry`

`isValid` becomes `validate`; `options` and `toggleLabel` are optional, so a field without suggestions passes neither.

```tsx
<TokenField id="to" label="Email addresses" values={v} onChange={set} isValid={isEmail}
  invalidLabel="Not an address" removeLabel={(x) => `Remove ${x}`} />
→
<MultiComboBox freeEntry id="to" label="Email addresses" values={v} onChange={set} validate={isEmail}
  invalidLabel="Not an address" removeLabel={(x) => `Remove ${x}`} />
```



### `ConfidenceField` → `TextField confidence`

The value is the read-only field's `value`; the reading is one `confidence` object (type `FieldConfidenceReading`). Classes `di-confidence*` are gone.

```tsx
<ConfidenceField id="vendor" label="Vendor" confidence={0.82} confidenceLabel="82% sure" level="review"
  whyLabel="Why" onWhy={why}>Contoso</ConfidenceField>
→
<TextField id="vendor" label="Vendor" readOnly value="Contoso"
  confidence={{ value: 0.82, label: "82% sure", level: "review", whyLabel: "Why", onWhy: why }} />
```


### `QuantityField labelHidden` → `hideLabel`

The name every other field uses.

```tsx
<QuantityField labelHidden … />  →  <QuantityField hideLabel … />
```



### `SearchField dense` → `size="sm"`

```tsx
<SearchField dense … />  →  <SearchField size="sm" … />
```



### `SaveBar` → `Toolbar role="region" frame="bar" sticky="bottom"`

Render it only while there are unsaved changes, as before.

```tsx
<SaveBar label="Unsaved changes" message="2 fields changed">{buttons}</SaveBar>
→
<Toolbar label="Unsaved changes" role="region" frame="bar" sticky="bottom">
  <ToolbarStatus>2 fields changed</ToolbarStatus>
  <ToolbarEnd>{buttons}</ToolbarEnd>
</Toolbar>
```



### Required fields and read-only fields

A required field shows `*` after its label (TextField, TextArea, FileField, QuantityField, Select, ComboBox, MultiComboBox, DateField, TimeField). Labels that carried "(required)" or "*" in their text drop it. A read-only field is drawn in its own read-only tone without a frame; a read-only ComboBox has no toggle and a read-only DateField no calendar button. Field frames have the button radius (6px). On a touch screen a field is 40px high with 16px text.


## Data

### `KeyValues`, `KeyValue` → `FactList layout="pairs"`, `Fact`

```tsx
<KeyValues><KeyValue term="Region" value="eu-central" /></KeyValues>
→
<FactList layout="pairs"><Fact label="Region">eu-central</Fact></FactList>
```



### `Stat`, `StatRow` → `Figure`, `FigureRow`

`suffix` becomes `unit`; what qualified the value goes in the children. `FigureRow` needs a `label` that names the row (`variant="strip"` is the default; `footer` closes a hero `Panel`).

```tsx
<StatRow><Stat label="Seats" value="12" suffix="of 20" /></StatRow>
→
<FigureRow label="Licence"><Figure label="Seats" value="12" unit="of 20" /></FigureRow>
```



### `StatTile`, `StatTileDelta` → `Panel` with a `Figure`, `FigureNote`

`compact` becomes `size="compact"`; `ruled` and `index` go.

```tsx
<StatTile label="Open cases" value="14" tone="danger"><StatTileDelta tone="danger">+3 since Monday</StatTileDelta></StatTile>
→
<Panel><Figure label="Open cases" value="14" tone="danger"><FigureNote tone="danger">+3 since Monday</FigureNote></Figure></Panel>
```



### `HeroFigure` → `Figure size="hero"`

Added and merged during 0.11; no release carried it.

```tsx
<HeroFigure label="Exposure" value="62" unit="%" />  →  <Figure size="hero" label="Exposure" value="62" unit="%" />
```


### `AttentionClear` → `Notice variant="line" tone="ok"`

Added and merged during 0.11; no release carried it.

```tsx
<AttentionClear title="Everything is running" note="12 sources · checked 09:12" />
→
<Notice variant="line" tone="ok">
  <NoticeTitle>Everything is running</NoticeTitle>
  <NoticeBody><MetaLine items="12 sources · checked 09:12" /></NoticeBody>
</Notice>
```


### `ExplainPanel`, `ExplainRow`, `ExplainFooter` → `ProposalPanel`

`heading` becomes `label`; the answer is a `ProposalAnswer`; rows are `Fact`s in a `FactList layout="stacked"`; ignored rows move into one `ProposalIgnored`; the footer is `ProposalNote`.

```tsx
<ExplainPanel heading="Why this verdict">
  <ExplainRow label="Source">Defender</ExplainRow>
  <ExplainFooter>Model 2026-10</ExplainFooter>
</ExplainPanel>
→
<ProposalPanel label="Why this verdict">
  <ProposalAnswer>Likely benign</ProposalAnswer>
  <FactList layout="stacked"><Fact label="Source">Defender</Fact></FactList>
  <ProposalNote>Model 2026-10</ProposalNote>
</ProposalPanel>
```


### `ConfirmPanel`, `ConfirmActions` → `ProposalPanel`

`eyebrow` becomes `label`, the question a `ProposalQuestion`, the facts a `FactList`, the actions `ProposalActions`. The "why" link is the panel's own fold (`whyLabel`).

```tsx
<ConfirmPanel eyebrow="Proposed" question="Close as benign?" whyLabel="Why" onWhy={why}>
  {facts}<ConfirmActions>{buttons}</ConfirmActions>
</ConfirmPanel>
→
<ProposalPanel label="Proposed" whyLabel="Why">
  <ProposalQuestion>Close as benign?</ProposalQuestion>
  <FactList layout="stacked">{facts}</FactList>
  <ProposalActions>{buttons}</ProposalActions>
</ProposalPanel>
```


### `LivingCard`, `Session`, `Channel` and their parts → `RecordCard`

One record card with slots. `LivingCard` is a `RecordCard` with an inferred `StatusPill` in `RecordStatus`; `Session` is `layout="row"`; `Channel` is a card with a `RecordValue`. Parts: `LivingBody` → `RecordBody`, `LivingInsight` → `RecordInsight`, `LivingBasis` → `RecordBasis`, `LivingActions`/`SessionAction` → `RecordActions`, `SessionDetail` → `RecordDetail`, `SessionMark` → `RecordMark`, `SessionTag`/`ChannelStatus` → `RecordStatus`, `ChannelValue` → `RecordValue`, `ChannelSpecs` → a `FactList layout="pairs"`.

```tsx
<Session name="MacBook Pro"><SessionDetail>Last seen 09:12</SessionDetail></Session>
→
<RecordCard title="MacBook Pro" layout="row" heading={false}><RecordDetail>Last seen 09:12</RecordDetail></RecordCard>
```


### `ListToolbar`, `ListToolbarEnd`, `ListToolbarNote` → `Toolbar role="search"`

Leave `sticky` out where the toolbar should not stick (`sticky={false}` before).

```tsx
<ListToolbar label="Filter members">{search}<ListToolbarEnd>{button}</ListToolbarEnd></ListToolbar>
→
<Toolbar label="Filter members" role="search" sticky="top">{search}<ToolbarEnd>{button}</ToolbarEnd></Toolbar>
```



### `TableToolbar` → a `Toolbar` in the `DataTable`

The table draws its frame around a `Toolbar` child.

```tsx
<DataTable label="Sources"><TableToolbar>{filters}</TableToolbar>…</DataTable>
→
<DataTable label="Sources"><Toolbar>{filters}</Toolbar>…</DataTable>
```



### `TableRow tone` removed

A row's state is its State column (`StatusPill`, or `SeverityMark` with its word), the same for every state. Drop `tone`.

```tsx
<TableRow tone="danger">…</TableRow>  →  <TableRow>… <TableCell><StatusPill tone="danger">Failed</StatusPill></TableCell></TableRow>
```



### `TableSpacer` and `heldCount` are no longer exported

`InfiniteTable` renders its own spacers; nothing replaces them in a product.


### `Sparkline bars` → `values`

Pass the numbers; the bar heights are computed. `highlight` marks one bar, `tone` the series.

```tsx
<Sparkline label="Last 7 days" bars={[{ percent: 40 }, { percent: 100, tone: "danger" }]} />
→
<Sparkline label="Last 7 days" values={[4, 10]} highlight={1} tone="danger" />
```



### A table in a padded Panel

A `DataTable` in a padded `Panel` or `Dialog` no longer bleeds 12px into the padding: its band and rules start at the content edge. Use `<Panel padded={false}>` where the table is the panel's whole content.



## Marks and text

### `Chip` → `Tag mono`

A set filter is pressed and removable; an offered one is clickable. Classes `di-chip*` are gone.

```tsx
<Chip active onRemove={drop} removeLabel="Remove filter">severity: high</Chip>
→ <Tag mono pressed onRemove={drop} removeLabel="Remove filter">severity: high</Tag>
<Chip onClick={add} removeLabel="">severity: high</Chip>
→ <Tag mono onClick={add}>severity: high</Tag>
```



### `VersionTag` → `Tag mono`

```tsx
<VersionTag>v0.11.0</VersionTag>  →  <Tag mono>v0.11.0</Tag>
```



### `PrivacyBadge` → `StatusPill track="record" icon`

`scope` becomes a tone: `local` → `ok`, `external` → `warn`, `retention` → `neutral`. Class `di-privacy` is gone.

```tsx
<PrivacyBadge scope="local"><Lock />On this server</PrivacyBadge>
→ <StatusPill tone="ok" track="record" icon={<Lock />}>On this server</StatusPill>
```


### `TextLink quiet` is no longer mono

Where `quiet` stood on an identifier, write `mono quiet` to keep the identifier's face. A TextLink takes the size of its line; a disabled one has no underline.

```tsx
<TextLink quiet href={url}>CASE-0042</TextLink>  →  <TextLink mono quiet href={url}>CASE-0042</TextLink>
```



### Severity is `SeverityMark`

A severity is one five-step scale (`info`, `low`, `medium`, `high`, `critical`) drawn as a filled mark and its word. A product pill that maps severity onto `StatusPill` tones becomes `SeverityMark variant="chip"`.

```tsx
<SeverityPill severity={s} />  →  <SeverityMark level={s} label={labels.severity(s)} variant="chip" />
```



### `Badge tone="seal"` is a brand moment

The seal gold belongs to sign-in, the mark, empty and onboarding states and licence seals. In an operational view use `tone="neutral"`.



## Feedback

### `EmptyState` loses `index`, `tone` and its frame

`EmptyState`, `EmptyStateIcon` and `EmptyStateAction` stay: an absence is not a message about the system, so it is not a `Notice`. `eyebrow`, `title`, `body` and `mono` are unchanged. `index` goes. `tone` goes: content that failed to load is a failure, not an absence, so it is a `Notice tone="danger"` banner in its place. The empty state has no frame or tone of its own any more; it stands on the surface its content would sit on, so an `EmptyState` that stood directly on the page goes inside a `Panel`. It is announced as a `status`. Classes `di-empty*` are now `di-empty-state*`.

```tsx
<EmptyState index="00" eyebrow="Sources" title="No sources yet" body="Connect one to start collecting.">
  <EmptyStateAction><Button>Connect</Button></EmptyStateAction>
</EmptyState>
→
<Panel>
  <EmptyState eyebrow="Sources" title="No sources yet" body="Connect one to start collecting.">
    <EmptyStateAction><Button>Connect</Button></EmptyStateAction>
  </EmptyState>
</Panel>

<EmptyState tone="danger" title="The register could not be read." body="Nothing was lost.">
  <EmptyStateAction><Button>Retry</Button></EmptyStateAction>
</EmptyState>
→
<Notice tone="danger">
  <NoticeIcon />
  <NoticeText>
    <NoticeTitle>The register could not be read.</NoticeTitle>
    <NoticeBody>Nothing was lost.</NoticeBody>
  </NoticeText>
  <NoticeAction><Button variant="secondary">Retry</Button></NoticeAction>
</Notice>
```


Every file below uses `EmptyState`; check that each one stands inside a surface.



### `Spinner`, `AppLoader`, `SkeletonPage`, `SkeletonTable` → `Loading shape`

`SkeletonPage variant` becomes `shape`; `SkeletonTable` is `shape="table"` (add `index` when the table has a `TableIndex` column). `Loading` holds itself back for the first 150 ms by default (`delay={0}` shows it at once, as `Spinner` did). The type `SkeletonPageVariant` is `LoadingShape`. Classes `di-skeleton*`, `di-skp*` are gone.

```tsx
<Spinner label="Saving" />                      →  <Loading label="Saving" delay={0} />
<AppLoader label="Starting" />                  →  <Loading shape="app" label="Starting" />
<SkeletonPage variant="detail" label="Loading" /> →  <Loading shape="detail" label="Loading" />
<SkeletonTable rows={8} label="Loading" />      →  <Loading shape="table" index rows={8} label="Loading" />
```



### `Progress countTrack` removed

A count in words ("1 of 10 seats used") is a quota, not a wait: show it with `LevelMeter`. A `LevelMeter` draws only the scale, so the words stay beside it, for example in a `Fact`. A `Progress` count is always in figures.

```tsx
<Progress id="seats" label="Seats" count="1 of 10 seats used" value={1} max={10} countTrack="prose" />
→
<Fact label="Seats">
  1 of 10 seats used
  <LevelMeter label="Seats" value={1} max={10} valueText="1 of 10 seats used" segments="continuous" />
</Fact>
```



### `Notice size` removed

Drop `size`; a notice has one size, and density scales it.


### `Tooltip` wraps its trigger

`Tooltip` takes the trigger as its child and the words as `label`. A tooltip names a control; a fact that is nowhere else is not a tooltip (`TooltipTarget` for a term with its explanation).

```tsx
<Tooltip label="Copy"><Button variant="ghost" iconOnly aria-label="Copy"><Copy /></Button></Tooltip>
```


## Overlays

### `Sheet`, `SheetFooter` → `Dialog`, `DialogFooter`

`Dialog`'s default `placement="side"` is the sheet, docking included; the props are the same. `index` goes: name the record in `eyebrow`. Classes `di-sheet*` are `di-dialog*`.

```tsx
<Sheet open={open} onClose={close} title="Head office" eyebrow="Site" closeLabel="Close">
  {body}<SheetFooter>{buttons}</SheetFooter>
</Sheet>
→
<Dialog open={open} onClose={close} title="Head office" eyebrow="Site" closeLabel="Close">
  {body}<DialogFooter>{buttons}</DialogFooter>
</Dialog>
```



### `Modal` and its parts → `Dialog placement="center"`

The title, eyebrow and lede are props; the body is the children; the actions go in `DialogFooter`. The icon column (`ModalIcon`) goes. For a destructive confirmation use `ConfirmDialog`.

```tsx
<Modal open={open} onClose={close} labelledBy="t">
  <ModalFrame><ModalContent>
    <ModalTitle id="t" eyebrow="Export">Export 40 entries?</ModalTitle>
    <ModalBody>The file is signed.</ModalBody>
    <ModalFooter>{buttons}</ModalFooter>
  </ModalContent></ModalFrame>
</Modal>
→
<Dialog placement="center" open={open} onClose={close} eyebrow="Export" title="Export 40 entries?">
  <p>The file is signed.</p>
  <DialogFooter>{buttons}</DialogFooter>
</Dialog>
```



## Navigation

### `Stepper` → `Steps variant="progress"`

```tsx
<Stepper label="Setup" steps={steps} stateLabels={words} onStep={go} />
→
<Steps variant="progress" label="Setup" stateLabels={words} onStep={go}>
  {steps.map((s) => <Step key={s.label} state={s.state} title={s.label} />)}
</Steps>
```



### `Numbered` → `Steps variant="list"`

One list for the whole run, not one `Numbered` per step. `variant="step"` is `tone="tonal"`, `variant="row"` is `tone="ruled"`. Classes `di-numbered*` are `di-step-row*`.

```tsx
{steps.map((s, i) => <Numbered key={s} index={String(i + 1)} variant="row">{s}</Numbered>)}
→
<Steps variant="list" tone="ruled">
  {steps.map((s, i) => <Step key={s} index={String(i + 1)}>{s}</Step>)}
</Steps>
```



### `Stage`, `StageTrack`, `StageIcon`, `StageFooter` → `Steps variant="cards"`

```tsx
<StageTrack><Stage step="01" title="Connect" body="A source is reached." current /></StageTrack>
→
<Steps variant="cards"><Step index="01" title="Connect" state="current">A source is reached.</Step></Steps>
```


### `CommandChip` → `Tag mono`

`state="active"` is `pressed`, `"suggested"` is `inferred`, `onSelect` is `onClick`.

```tsx
<CommandChip state="active" onSelect={drop}>assets</CommandChip>  →  <Tag mono pressed onClick={drop}>assets</Tag>
```


### `CommandRow active` removed; rows are options

The bar highlights its rows itself (the first, then the arrow keys and the pointer): drop `active`. A row is a `div role="option"`, not a button, so tests query `getByRole("option")`; the field is `getByRole("combobox")`. The bar handles Up, Down, Home, End and Enter in its field, so a product's own handler that moved focus into the rows goes. Use `CommandEmpty` for "no results".



## Layout

### `FieldStack` → `Stack variant="form"`

```tsx
<FieldStack>{fields}</FieldStack>  →  <Stack variant="form">{fields}</Stack>
```



### `InlineForm` → `Toolbar fillFirst`

Classes `di-inline-form*` are gone.

```tsx
<InlineForm>{field}{button}</InlineForm>  →  <Toolbar fillFirst>{field}{button}</Toolbar>
```



### `DangerZone` → `Panel tone="danger"`

```tsx
<DangerZone title="Danger zone" lede="These cannot be undone.">{dangerActions}</DangerZone>
→
<Panel tone="danger" title="Danger zone" heading={2}>
  <PanelLead>These cannot be undone.</PanelLead>
  {dangerActions}
</Panel>
```



### `SectionTitle`, `SectionTitleHeading`, `SectionTitleMeta` → `PageHeader level={2}`

The same `eyebrow`, `lede` and `tier`. The title follows the header's `level`.

```tsx
<SectionTitle eyebrow="Usage"><SectionTitleHeading>Credits</SectionTitleHeading><SectionTitleMeta>{meta}</SectionTitleMeta></SectionTitle>
→
<PageHeader level={2} eyebrow="Usage"><PageHeaderTitle>Credits</PageHeaderTitle><PageHeaderMeta>{meta}</PageHeaderMeta></PageHeader>
```



### `Accordion`, `AccordionItem`, `AccordionDetail`, `AccordionMeta` → `DisclosureGroup`, `Disclosure toggle="head"`

```tsx
<Accordion label="Rules"><AccordionItem title="Network" open={o} onOpenChange={set}>{body}</AccordionItem></Accordion>
→
<DisclosureGroup label="Rules"><Disclosure toggle="head" title="Network" open={o} onOpenChange={set}>{body}</Disclosure></DisclosureGroup>
```


### `Disclosure meta` → a `DisclosureMeta` child

The meta slot takes nodes. `id`, `open`, `onOpenChange` and `toggleLabel` are optional now.

```tsx
<Disclosure title="Fields" meta="12 fields" …>{body}</Disclosure>
→
<Disclosure title="Fields" …><DisclosureMeta>12 fields</DisclosureMeta>{body}</Disclosure>
```



### `Panel index`, `indexSize`, `indexTone`, `indexRule` and `surface="grid"` removed

A panel carries no number of its own: drop the index props, and the props a product added to pass an index through to its panels. A real sequence is `Steps`. `surface` is `sheet`, `inset` or `hero`; `grid` goes. A `PanelFooter` is a row inside the surface, not a band: re-check layouts that compensated for the band.

```tsx
<Panel index="02" title="Seats">…</Panel>  →  <Panel title="Seats">…</Panel>
```



### `Hero`, `HeroAside`, `HeroLead`, `HeroVisual`, `HeroFooter` → `Panel surface="hero"`

Added and merged during 0.11; no release carried it. `HeroAside` is `PanelActions`, `HeroLead` `PanelFigure`, `HeroVisual` `PanelVisual`, `HeroFooter` `PanelFooter`.

```tsx
<Hero label="Exposure" title="Seven days">{…}</Hero>  →  <Panel surface="hero" label="Exposure" title="Seven days" heading={2}>{…}</Panel>
```


### `ListDetail` and its parts → `Split variant="list"`

Added and merged during 0.11; no release carried it. `ListDetailList` is `SplitList`, `ListDetailHead` `SplitListHead`, `ListDetailItems` `SplitListItems`, `ListDetailItem` `SplitListItem`, `ListDetailPane` `SplitMain label`, `ListDetailBack` `SplitBack`.

```tsx
<ListDetail showing={view}>…<ListDetailPane label="Case">{record}</ListDetailPane></ListDetail>
→
<Split variant="list" showing={view}>…<SplitMain label="Case">{record}</SplitMain></Split>
```


### `PageHeaderTitle level` → `PageHeader level`

Added and removed during 0.11. The title follows its header: an h1 in a `PageHeader`, an h2 in a `PageHeader level={2}`.

```tsx
<PageHeader><PageHeaderTitle level={2}>Case 4</PageHeaderTitle></PageHeader>
→
<PageHeader level={2}><PageHeaderTitle>Case 4</PageHeaderTitle></PageHeader>
```


### Page, DetailSection and toolbars

A `Page` outside `AppShellContent` has the shell's padding, so a product's own padding wrapper around it goes. `DetailSection` is inset 24 (16 on a phone) and has no frame inside a `Dialog` or `Panel`. `--di-sticky-top` is `0px` outside the shell; a product with its own sticky bar sets it on its content.


## Charts

### `ChartCard`, `ChartCardAction`, `ChartCardGrid` → `Panel`, `Figure`, `Grid`

A dashboard figure is a `Panel` with a compact `Figure` in `PanelFigure`, the chart in `PanelVisual` and the link in `PanelActions`; the cards sit in a `Grid`.

```tsx
<ChartCardGrid>
  <ChartCard title="Credits" figure="182.5" note="this month"><ChartCardAction>{link}</ChartCardAction>{chart}</ChartCard>
</ChartCardGrid>
→
<Grid min="360px" gap={16}>
  <Panel title="Credits" heading={3}>
    <PanelActions>{link}</PanelActions>
    <PanelFigure><Figure size="compact" label="Credits" value="182.5">this month</Figure></PanelFigure>
    <PanelVisual>{chart}</PanelVisual>
  </Panel>
</Grid>
```



### `Bars` → `Sparkline width="fill"`

```tsx
<Bars values={v} highlight={6} startLabel="Mon" midLabel="Thu" endLabel="Sun" />
→
<Sparkline values={v} highlight={6} label="Mon to Sun" width="fill" height="md" captions={["Mon", "Thu", "Sun"]} />
```


## Timelines

### `WeekTimeline`, `WeekTimelineRow` → `PeriodTimeline` in minutes

```tsx
<WeekTimeline rows={days} summary="Quiet hours" />
→
<PeriodTimeline label="Quiet hours" summary="Quiet hours" from={0} to={1440}
  rows={days.map((d) => ({ id: d.label, label: d.label, spans: d.spans.map((s) => ({ start: s.from, end: s.to, tone: "ok" })) }))}
  ticks={["00", "06", "12", "18", "24"].map((label, i) => ({ at: i * 360, label }))} />
```



### `PeriodTimeline periods`, `today`, `todayLabel` → `rows`, `marker`

One row per period with one span; today is the `marker`. Without `marker` no today line is drawn (the old path defaulted to now). The type `Period` is gone: use `PeriodRow` and `PeriodSpan`.

```tsx
<PeriodTimeline label="Licences" periods={[{ id, label, start, end, tone, caption }]} today={now} todayLabel="Today" />
→
<PeriodTimeline label="Licences" rows={[{ id, label, caption, spans: [{ start, end, tone }] }]} marker={{ at: now, label: "Today" }} />
```



### `TimelineSummary` marks every row

Every episode row shows its `SeverityMark` in an end column; the head shows none, and the blocks have no grey ground. The props stay; a `scaleNote` that speaks of the "pale ground" should say "base line".



## Shell

### `AppShellBarEnd moreLabel` is required

On a narrow bar the end items fold into one overflow button; `moreLabel` is its name.

```tsx
<AppShellBarEnd>{status}</AppShellBarEnd>  →  <AppShellBarEnd moreLabel="More">{status}</AppShellBarEnd>
```



### `AppShell`, `AppShellRail`, `AppShellMain`, `AppShellFoot`, `AppShellContext`, `NavGroup`, `NavItem` removed

The frame is `SidebarProvider` with the `Sidebar`, then `SidebarInset` holding `AppShellBar` and `AppShellContent`. `SidebarBrand` goes first in `SidebarHeader`. `SignIn` follows the theme.


## Storybook groups

The sidebar has fourteen groups, one folder each in `src/components`: Actions, Forms, Tables, Records, Figures, Text, Status, Feedback, Charts, Timelines, Layout, Navigation, Overlays, Shell. Imports from the package do not change. Story titles and ids do, so a link to a story changes where its group did (the id is the title in lower case with `-` for `/`, then `--` and the story):

| Old title | New title |
| --- | --- |
| `Data/Table/*` | `Tables/*` |
| `Data/Records/*`, `Marks/IconTile` | `Records/*` |
| `Data/Figures/*` | `Figures/*` |
| `Marks/Badge`, `Marks/Tag`, `Marks/Status/*` | `Status/*` |
| `Marks/Icon`, `Navigation/TextLink` | `Text/Icon`, `Text/TextLink` |
| `Text/CodeBlock`, `Text/PullQuote`, `Text/TickRule` | `Text/Blocks/*` |
| `Feedback/Waiting/*` | `Feedback/*` |
| `Feedback/Tooltip`, `Feedback/TooltipTarget` | `Overlays/*` |
| `Navigation/Menu` | `Actions/Menu` |
| `Overlays/CreateFlow` | `Forms/CreateFlow` |
| `Navigation/Views/*`, `Navigation/Sequence/*` | `Navigation/*` |
| `Layout/Arrangement/*`, `Layout/Panes/Split`, `Layout/Folding/Disclosure` | `Layout/Arrange/*` |
| `Charts/Time/*`, `Charts/Compare/*` | `Charts/*` |
| `Timeline/*` | `Timelines/*` |


## Product notes

### Mail layouts set IBM Plex Sans

The interface face is IBM Plex Sans; Space Grotesk is for headings and figures only. The mail layouts' `fontUI` stack follows: `'IBM Plex Sans','Helvetica Neue',Helvetica,Arial,sans-serif`.



## Tokens and classes

### Removed tokens

`--di-focus-halo`, `--di-highlight` (the mark has no edge now), `--di-seal-bg`, `--di-status-ok-on-navy`, `--di-signal`, `--di-signal-ink`, `--di-signal-tint`, `--di-danger-700`, `--di-navy-200`, `--di-chart-card-min`, the 0.10 surface and height tokens (`--di-card-*`, `--di-bg-grid`, `--di-grid`, `--di-h-ctl`, `--di-h-dense`, `--di-h-comfort`, `--di-h-row`, `--di-index-col-sm`, `--di-panel-index-bg`) and the 0.10 primitives `--di-ink`, `--di-ivory`, `--di-paper`, `--di-sheet`, `--di-sunken`, `--di-wash`, `--di-navy-50`, `--di-rule-*`, `--di-warn-*`, `--di-night-*`. Bind to a semantic role instead (`--di-bg-*`, `--di-text-*`, `--di-border-*`, `--di-status-*`, `--di-select`, `--di-focus-ring-color`). `--di-sb-brand-h` is `--di-sb-mark-h`. The timeline legend swatches `--di-timeline-swatch` and `--di-tsummary-swatch` are `--di-chart-routine`.


### Class names a product queries

Classes of the removed components are gone with them (`di-stat-*`, `di-stat-tile*`, `di-empty*` (now `di-empty-state*`), `di-skeleton*`, `di-skp*`, `di-list-toolbar`, `di-sheet*`, `di-modal*`, `di-chip*`, `di-privacy`, `di-numbered*`, `di-stage*`, `di-stepper`). The combobox's `di-combobox-label` and `di-combobox-value` went with the shared field frame. The chart, matrix and timeline legends share one key (`di-chart-key*`), so `di-matrix-key`, `di-matrix-legend`, `di-timeline-legend*`, `di-timeline-note`, `di-timeline-swatch` and `di-tsummary-legend*`, `di-tsummary-swatch` are gone. `ConfirmDialog` draws its commit with the shared button, so `di-confirm-commit` and `di-confirm-error` are gone. Tests and product CSS that select these change to roles and accessible names, or to the new class.



## Other changes in look and behaviour

None of these needs a code change to compile. Check the screens that use them.

- **Actions.** A danger button in a dialog footer or `ProposalActions` is the filled final commit; elsewhere it opens a confirmation and stays quiet. A disabled danger button looks disabled in both themes. A blocked danger action's reason sits under its button. `CopyValue`'s button has no hover border and sits on the value's first line. `Kbd` inside a button is a tonal ground without a border.
- **Forms.** No option has a solid cornflower background any more: a chosen segment is a quiet raised thumb, a chosen toggle or calendar day the primary ink (`--di-choice-on-bg`); selection elsewhere keeps the pale tint (`--di-bg-selected`) with the selection edge, and `ComboBox` and `Select` mark their current value in the list. `ChoiceGroup` takes `hint`, `hintTone` and `required`; its legend sits 6px above the options, its cards grid has at most three columns, and its native inputs carry `di-choice-cover` instead of `di-sr`. `MultiComboBox` closes its list on Tab, and Escape on a closed list no longer clears it. Calendar, range and typed-segment selection is cornflower. `Switch` uses the choice classes (`di-choice-label`, `di-choice-desc`); `di-switch-control`, `-text`, `-title`, `-desc` are gone.
- **Data.** `RecordValue` wraps a string value with break points and aligns its icon to the first line. `Distribution` rows are `LevelMeter`s (`di-distribution-track` and `-fill` are gone). `CoverageMatrix` marks have no border and its columns are at most 128px wide. `LevelMeter` takes `segments="continuous"`, `tone` and `valueText`. A `DataTable` toolbar row wraps. A `DataTable` wider than its frame keeps the row's name pinned at the start (the `pinned` column, else the first column headed by words) and shades the side that hides columns. `CodeBlock` takes `variant="record"` (wraps with a hanging indent) or `"log"` (never wraps, scrolls). The `DataTable` and `InfiniteTable` head is set in the interface label (IBM Plex Sans 12px, medium, muted, normal case) at a row's height and with a cell's inset; a stacked row's cell labels match it.
- **Marks and text.** `SeverityMark`'s word is regular weight at every level. `CodeBlock` is `div.di-codeblock > pre.di-codeblock-scroll > code`; `className` stays on the outer `div`. `Eyebrow` and `PullQuote` hyphenate long words, so set `lang` on the page. `Tag` takes nodes as children. `Highlight` marks in the selection tint, the matched words one weight step heavier (`--di-highlight-weight`, medium) in full ink, with no edge; no longer poppy. `--di-highlight` is removed (it was the edge); `--di-highlight-ink` and `--di-highlight-tint` remain. A `Tag` name wider than its place wraps inside its frame; in a compact `TagList` a cut tag carries its whole wording as a tooltip.
- **Feedback.** `Toast` body is in the reading face; on a phone its action drops under the copy. `Tooltip` sits 12px from its trigger and points at it. Notice titles are in the display face.
- **Overlays.** One dialog for side, centre and bottom placements, with one width ramp (`sm` 400, `md` 480, `lg` 760, `xl` 1120px); the head, inset, close button and scrim are shared. `ConfirmDialog` takes an `eyebrow`, `consequences` and a `tone` (`danger` or `neutral`).
- **Navigation.** `Breadcrumb` is set in the reading face, never wraps and shows only the current page at 600px or less; `maxItems` and `collapseLabel` fold the middle. `Pagination` shows at most seven slots and renders nothing for one page. On a phone `Steps` names the position with the title ("3/4 · Seal", or `stepOf`); `Step tone="warn"` marks a lagging stage. A `Menu` item that is chosen has no tint, and group captions are mono capitals. On a phone a spread `Steps variant="progress"` sets out inline. The `CommandBar` input is set in the reading face at the size of a `SearchField`.
- **Layout.** `Disclosure` is an inset group without a border or head rule. `PanelLead` adds 12px below itself when something follows. A toolbar with `align` wraps on a phone instead of stacking at full width.
- **Charts and timelines.** Chart gridlines are solid; `TrendChart`'s right margin follows its last label and a legend adds 48px; `Seismograph` uses round count ticks. `EventTimeline` with a `score` is narrower by a gutter for the scale, and with `markers` its bars start 18px lower; lane cells show intensity by height; `TimelineInstruction` takes an optional `pointer` (`"fine"` or `"coarse"`) so a phone does not list mouse gestures. `ChainTimeline` lanes follow density. `PeriodTimeline`'s today label is in the text ink. `EventTimelineReadout` has no `is-flipped` class.
- **Shell.** `AppShellBar` is one row high and folds its end items into the overflow button; its start items sit in `.di-topbar-start`. `SidebarBrand` goes first in `SidebarHeader`. `SignIn` follows the theme.
- **Interaction colour.** Selection edges, focus rings, the sidebar focus and the link underline are navy-700 `#1D4280` in daylight and `#A9CBF3` after dark instead of cornflower `#2B6CB0`/`#79AEEA`; a ring inside the strong fill or on an inverse plane is `#A9CBF3` on navy and navy-700 on the paper-white fill; `--di-chart-compare` is `--di-navy-400` `#3A64AD` (`--di-navy-300` `#6A8FD0` after dark). The pale `--di-bg-selected` tint and the recorded status are unchanged.
- **Tokens.** The focus ring has its own tokens (`--di-focus-ring-*`); a region re-colours focus with `--di-focus-ring-color`. `--di-field-height` is 40px and input text 16px on a touch screen; `--di-field-radius` is 6px. Read-only fields use `--di-bg-readonly`. `--di-option-hover-bg` equals `--di-row-hover-bg`. Native checkboxes, radios and ranges take `accent-color` from the tokens. The light ground is warm: page `#f4efe3`, sidebar and app bar `#e7dec9`, panels pure white with a warm hairline (`--di-elevation-surface`), table heads and insets `#ece5d6`; `--di-border`, `--di-rule` and `--di-sidebar-edge` are a translucent warm brown instead of a translucent navy. `CodeBlock` sits on the inset tone. `StatusPill tone="recorded"` is navy (text navy 700 on navy 100) instead of cornflower, so it no longer shares the selection tint. After dark the grounds are a calmer navy: page `#0d1a30`, panels `#14243f`, table heads and insets `#1c2e4d` (lighter than the rows now), and the sidebar and app bar in the brand navy `#0a1f44`. Product CSS that set its own cool greys next to these should use the tokens.
