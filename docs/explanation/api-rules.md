# API rules

Why the components' props look the way they do. [Add a component](../how-to/add-a-component.md) applies these; `lint:tokens`' `api` rule and `lint:structure` enforce the parts a machine can.

## The one rule: ask what can go in

**Only ever text → a `string` prop. Anything that can hold a component → a slot.** No prop is typed `ReactNode`; that type is the sign the decision was never made.

A slot is a named sub-component written as a child, `<Parent><ParentSlot>`: `NoticeIcon`, `PanelFooter`, `ToolbarEnd`, `RecordValue`, `ToastAction`, `ProposalActions`. React has no `<slot>`, so the frame places its slots with CSS grid areas and the caller may write them in any order. One frame cannot: `DataTable` (a `<div>` is invalid inside `<table>`) picks its slots out of `children` by type, and says so in a comment.

Where a component takes exactly one leading node, that node is the first child and there is no slot for it: `Button`, `CommandRow`, `Icon`. `TextField` puts the label-side slot in plain `children`, because the field has only one.

Two kinds of `ReactNode` survive on purpose, and only these. An option's `icon` (`ChoiceGroup` options, `StatusPill icon`) is a field on data the caller hands over, not a slot. `Menu`'s `trigger` is a render prop, because the menu has to put its own `aria-expanded` and ref onto a button the caller owns.

A line that reports a measured value is a slot, not a string. A count, a timestamp, a version, a delta, a caveat or a basis arrives sealed, in the mono track, or with a state beside it, and a `string` can carry none of that: `PanelMeta`, `StepFooter`, `ProposalNote`, `RecordCount`, `RecordDetail`, `FigureNote`, `RecordBasis`, `SignInVersion`. Prose a person reads (`title`, `label`, `caption`, `legend`, `body`, every `*Label` accessible name) stays a string. The one exception is the heading of a page or a section, because it can hold a `Highlight`: `PageHeaderTitle` is a slot. A `Panel` or `Dialog` title stays a string; the page marks one place, never a panel's title.

## One name per thing

A variant is one union prop, never a family of booleans or a second prop that can contradict the first: `hintTone`, not `hint` plus `error` plus `sealHint`; `layout`, not `inline` plus `split`. There is one name per thing: an alias for a mark is the same failure as two props for one line of hint text. There are no deprecated exports: a rename takes the old name out in the same version, and `CHANGELOG.md` carries old → new.

`tone` names one axis and one only: status on the shared ramp, `neutral | ok | warn | danger`, plus `recorded` and `inferred` on `StatusPill`. What is not a status carries its own name: `surface` on `Panel`, `level` on a field's `confidence`, `variant` on `Button`, `layout` on `FactList`, `size`, `gap`. `neutral` is the word for "nothing special"; `default` and `info` were two more words for it and are gone. The hollow ring is `inferred` wherever it appears, never `ai`, and gold as a value is `seal`: a public prop does not name a colour.

`tier` is the axis a block carries between a product screen and a brand page, `console | brand`: on `PageHeader`, `Disclosure` and `FactList`. A component a brand page reads at a console size gets this prop, never a brand copy and never a site's restyling of its classes. Two tiers of one header, not two headers. A brand page is assembled from those plus `Stack` at `gap={48|64|96}`, `PointList`, `PullQuote`, `Grid`; the Foundations pages are rendered from exactly these, which is what keeps it true. `Eyebrow` is one union prop for the same reason: `sealed` is the section label beside the seal, one per view; `plain` is the label alone that repeats down a brand page.

## Strings, language and state

Every visible string is a prop. Components ship with no baked-in language; a product passes its own. A word every app needs comes with a preset in English, German and Spanish (`themeLabels`, `emptySegmentLabels`); the default is the English one.

Controlled where the system is the source of truth: `Pagination` (the caller owns `page`), `Switch` (a `role="switch"` button that reports the state of the system and commits as it moves), `ThemeProvider` and `DensityProvider` (the person's preference on the server, never browser storage).

Wherever a component draws a link, it takes `href` for a plain `<a>` and `render` for a router's link element (typed `useRender.RenderProp`), which renders the `<a>` with the component's look, name and props. A blocked `Button` link renders no router link, because the router's element would carry the address. `CiteMark` takes no `render`: its `href` is always a fragment on the same page, which the browser follows itself.

## Native first, then Base UI

Buttons, fields and tables are native elements, including the select, the checkbox, the radio and the segmented control. `Dialog` is a native `<dialog>`, so focus is trapped and the page behind goes inert; `Menu` and `Tabs` implement roving focus directly. Where a control needs more than a native element gives, the headless library is Base UI (`@base-ui/react`) and no other: `TabNav`, `TextLink`, the `Sidebar` family, `ComboBox`, `MultiComboBox`, the popover and sheet of `DateField` and `DateRangePicker`. Base UI has no date field, so the typed day and time segments are the package's own (`forms/dates/segments`, each segment a spinbutton with names from Intl), and the month grid is `react-day-picker`, pinned exactly; its date-fns stays inside that grid while our own date arithmetic uses `@internationalized/date`. Of Base UI only ScrollArea, Select, Tabs and Slider add a style element, which is what keeps the package CSP-clean; they stay out.

A control mark centres on the first line of its label, never on the whole block: `--di-choice-line` is that line, and `Checkbox`, `Radio` and `Switch` bind to it.

## Layers

What a component may hold is a second axis, a tag on its story meta rather than a place in the sidebar: `layer:primitive`, `layer:form`, `layer:block`, `layer:pattern`. The test is one question: **can another component go inside it?** `Sparkline` takes numbers and a label, so it is a primitive. `Figure` looks as small, but its `children` holds a `FigureNote` or a `Sparkline`, so it is a block. `Pagination` and `Loading` are bulky and still primitives: you place them into a frame, they frame nothing. Size is not the axis; what can be put inside is. When a component grows to hold another one, change its tag. A component never imports one from a higher layer, and no two component folders import each other.

## Compose, never invent

Build a screen from the components that exist. When something is missing, add it to the library rather than writing one-off markup in a screen: one-off markup binds to no token, skips the dark remap, carries no focus treatment and no accessible name, and is invisible to the story tests. This holds outside the repo too: the design system synced to claude.ai/design carries only what `src/index.ts` exports, so a control that never became a component cannot be designed with; it gets approximated, and the approximation cannot ship.
