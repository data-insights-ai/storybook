# Component groups and folders

Every component lives in `src/components/<group>/`, one folder per Storybook group, in a folder of its own named after it. The story `title` is `<Group>/<Component>` or `<Group>/<Subgroup>/<Component>` and mirrors the folder. `.storybook/preview.tsx` sorts the groups in this order and the entries of a group alphabetically by title. The sidebar in Storybook and `Foundations/Start here` show the same grouping live; the props of each component are on its docs page.

| Group | Question | Folder | Components |
| --- | --- | --- | --- |
| `Foundations/` | the brand | `src/foundations` | Start here, Color, Type, Space and shape, Our look, Logo. Doc pages; no package component |
| `Actions/` | let someone do something | `actions/` | Button, Toolbar, FilterBar, Menu, CopyValue |
| `Forms/` | let someone enter or choose | `forms/` | `field/` Field, FieldLabel, FieldHint, FieldConfidence; `text/` TextField, TextArea, SearchField, QuantityField, FileField; `choice/` Choice, Checkbox, Radio, ChoiceGroup, Switch; `select/` Select, ComboBox, MultiComboBox; `dates/` dateRange, segments, calendar, DateField, TimeField, DateRangePicker; CreateFlow |
| `Tables/` | many rows to scan, sort and filter | `tables/` | DataTable, InfiniteTable, NewEntries |
| `Records/` | one record or a short list of them | `records/` | RecordCard, FactList, ProposalPanel, AttentionList, IconTile, PlanGrid |
| `Figures/` | a number | `figures/` | Figure, FigureRow, Sparkline |
| `Text/` | how text is set | `text/` | Eyebrow, MetaLine, TextLink, Kbd, Highlight, ClampText, Icon; `blocks/` CodeBlock, PointList, PullQuote, TickRule, Prose, CiteMark, SourceList |
| `Status/` | the state of a thing, inline | `status/` | StatusPill, SeverityMark, SealValue, Badge, Tag, LevelMeter, Verdict |
| `Feedback/` | what happened or is happening | `feedback/` | Notice, EmptyState, Toast, Loading, Progress, RouteProgress, Delayed |
| `Charts/` | data plotted on a scale | `charts/` | Chart, TrendChart, Seismograph, Distribution, CoverageMatrix |
| `Timelines/` | events and periods over time | `timelines/` | ChainTimeline, EventTimeline, PeriodTimeline, TimelineSummary; `scale/`, `series/`, `types/` shared |
| `Layout/` | arranging a page | `layout/` | `page/` Page, PageHeader, Panel, DetailSection, pageSide; `arrange/` Stack, Grid, Split, Disclosure |
| `Navigation/` | moving between places | `navigation/` | Sidebar (its parts in `menu/`, `frame/`, `state/`), Breadcrumb, Tabs, TabNav, tabStrip, Pagination, Steps, CommandBar |
| `Overlays/` | above the page | `overlays/` | Dialog, ConfirmDialog, ShortcutHelp, Flyout, Tooltip, TooltipTarget; `useModalDialog/` |
| `Shell/` | the product's frame | `shell/` | AppShellBar, AppShellContent, SignIn, SkipLink, ThemeProvider, DensityProvider |
| `Patterns/` | whole screens | `src/screens` | Examples only, not exports: [Pattern screens](patterns.md) |

A module several components share (the field frame, the choice frame, the date-range arithmetic) gets a folder and an `index.ts` the same way; a helper that draws nothing sits in `src/internal`. Sample data only a story or a pattern reads sits beside it as `*.sample.ts` and is left out of the package.

## Layer tags

Each story meta carries one layer tag, and a module never imports one from a higher layer:

| Tag | Meaning | Examples |
| --- | --- | --- |
| `layer:primitive` | a leaf: no slot a caller fills with a component | Button, Badge, StatusPill, Pagination, Breadcrumb, Tooltip, the loaders |
| `layer:form` | a labelled control | TextField, Select, Checkbox |
| `layer:block` | it holds something: composes components or exposes a slot for them | Panel, DataTable, Notice, Toast, Dialog, Menu, Tabs, RecordCard, SignIn |
| `layer:pattern` | a whole arrangement | Sidebar, ShortcutHelp, ThemeProvider, Stack, Grid, Split |
| `layer:foundation` | a Foundations page | |
| `layer:screen` | a pattern screen | |

## What the package exports

`src/index.ts` is the list; `scripts/public-api.json` records it and the package's class names. Entry points: `@data-insights-ai/ui` (components, hooks, presets), `@data-insights-ai/ui/styles.css`, `@data-insights-ai/ui/checks` (the surface rule, no component or stylesheet) and the binary `di-lint-tokens`. `src/styles/tokens/component.css` ships in the package as the list of slots a product may set.
