# Changelog

Each release, newest first: what changed and what a product has to do to take it. Releases before 0.24.0 are described by their tags' commits.

## 0.45.0

- `SidebarGroup` collapses: with `collapsed` and `onCollapsedChange` its `SidebarGroupLabel` is a button with `aria-expanded` that opens and collapses it; the caller renders what stays shown while it is collapsed. In the collapsed rail the label stays the group's name only, never a button the keyboard stops on.
- New `SidebarGroupAction`: the group's action, a `Button` or a `Menu`, at the end of its heading; hidden in the collapsed rail.
- `SidebarGroup` takes a drop: `dropTypes` names the drag data types it accepts, in any case, `onDrop` gets the drag's data, and the focus ring marks the group while a drag is over it, also while it passes over the group's items. `SidebarGroupLabel`'s `dragType` and `dragValue` make the heading draggable. New story: `Navigation/Sidebar` → Arranged Groups.
- `RecordCard`: on a narrow record the labelled actions in `RecordActions`, under the name, wrap onto as many lines as they need; before, they stayed on one line and a second or third button ran past the record's edge at 390px. New story: `Records/RecordCard` → Actions On A Phone.
- `InfiniteTable` and `CursorTable` with `maxRows`: the next page is asked for once the reader scrolls within a frame's height (`maxRows` rows) of the last row. Before, the frame watched the space after the rendered rows, which is always just past them, and asked for every page at once.
- `Button`: the name holds the drawn count, so a count capped at "99+" is named "Notifications, 99+ unread", not "Notifications, 128 unread", which axe's `label-content-name-mismatch` (WCAG 2.5.3) rejects. `badgeLabel` (the count in words) → `badgeUnit` (the word after the drawn count). `FilterBar`: `countLabel` (a function of the count) → `countUnit`. The story tests now run axe's `label-content-name-mismatch`.
- `ChainTimeline`: a marker's name starts with the ordinal it draws, "01 08:12 Sign-in from a public address", or "01–02 …" for a merged marker; before, the name left out the drawn number.
- Upgrade: a group without the new `SidebarGroup` props renders as before. Pass the word, not the phrase, for a button's count:

  ```tsx
  // before
  <Button iconOnly aria-label="Notifications" badge={unread} badgeLabel={`${unread} unread`}>
  <FilterBar countLabel={(n) => `${n} set`} … />
  // after
  <Button iconOnly aria-label="Notifications" badge={unread} badgeUnit="unread">
  <FilterBar countUnit="set" … />
  ```

  A record that put its labelled actions in a `Toolbar` inside `RecordActions` to make them wrap can drop the `Toolbar`. A framed `InfiniteTable` or `CursorTable` left without `maxRows` to keep it from loading every page can take `maxRows` again.

## 0.44.4

- `Sidebar` on a phone: an Escape that a `Menu`, `Dialog` or `Flyout` opened from the drawer used to close itself leaves the drawer open; the next Escape closes the drawer. Before, one Escape closed both and the focus went to the trigger.
- `Flyout`: the Escape that closes it is prevented and taken before other listeners on the document or the window, so it closes only the flyout, also over a docked `Dialog`. A `Menu`, list or dialog open in or over the panel keeps its own Escape: the first Escape closes it, the next the flyout. New story: `Navigation/Sidebar` → Drawer Layers.
- Upgrade: nothing to change. An app that stopped Escape around such a layer to keep the drawer open can remove that.

## 0.44.3

- `TimeField`, `DateField` and the typed days and times of `DateRangePicker`: each segment (hour, minute, AM/PM, day, month, year) is a target of at least 24×24px in either density, compact included, and passes axe's `target-size` (WCAG 2.2 SC 2.5.8). Before, a two-digit segment or AM/PM was about 21×21px, and the separator beside it left too little space for the spacing exception. The text stays centred in its segment. New token `--di-target-min` (24px), the smallest hit area anywhere. New stories: `Forms/Dates/TimeField` and `Forms/Dates/DateField` → Segment targets.
- Upgrade: nothing to change. Each segment of two digits or AM/PM takes about 3px more width, so a field sized to its content (as the range picker's times are) grows by that much.

## 0.44.2

- `ComboBox` and `MultiComboBox`: while the list is open the page around it stays in the accessibility tree. Before, Base UI hid everything beside the input, the list and each live region with `aria-hidden`, as for a modal, so a screen reader lost the field's toggle, its entries, the controls beside a live region (such as a `CopyValue`'s button) and the rest of the page, and axe reported `aria-hidden-focus` for each focusable control there. A combobox's list is a popup, not a modal; what a modal `Dialog` makes inert stays inert. New stories: `Forms/Select/ComboBox` and `Forms/Select/MultiComboBox` → Open list keeps page.
- Upgrade: nothing to change. A test that expected the page around an open list to be hidden expects it readable.

## 0.44.1

- `DataTable layout="measured"` and `InfiniteTable`: a column locks to a whole pixel, rounded up; before, it locked to the fraction its head settled on, and where a platform draws text a fraction wider, the value that set the column (the widest status pill or name) showed an ellipsis though it fits. A grid that fits its frame takes the added pixels from its filling column, or else its widest, so it still fits; a grid that scrolls sideways grows by them.
- Upgrade: nothing to change.

## 0.44.0

- `ToolbarAction`: takes `shortcut` and `title` as `Button` does, and `href` or `render` to be a link, so a list's create action that opens a page folds to its icon on a phone like any other toolbar action. New story: `Actions/Toolbar` → Create action.
- `ChoiceGroup appearance="cards"`: an option's description shows whole; before, a card cut it after two lines.
- `FactList layout="columns"`: fewer facts than fit in a row share its width (`auto-fit`); before, empty columns kept their room and a long value wrapped in a 200px column beside them.
- Upgrade: nothing to change. A list toolbar whose actions are `Button`s with a label can write them as `ToolbarAction`, so the search keeps its room on a phone:

  ```tsx
  <ToolbarEnd>
    <ToolbarAction variant="primary" icon={<Plus aria-hidden />} label="New key" render={<Link to="/keys/new" />} shortcut="n" />
  </ToolbarEnd>
  ```

## 0.43.0

- `TableColumn`: `rowHeader` marks the column whose value names each row; its body cells render as `<th scope="row">` (role `rowheader` when the rows are stacked), so a screen reader says the row's name with every other cell. They look like the cells beside them. Works in `DataTable`, `InfiniteTable` and `CursorTable`.
- Upgrade: nothing to change. A table whose first column names its rows can add `rowHeader` to that `TableColumn`.

## 0.42.0

- `RecordBadge` (new): a slot of `RecordCard` for a short label for the reader beside the name, on its line: a `Badge` such as "new" or "beta". The name and the badge share a line (`di-record-title-line`, `di-record-badge`); a name that fills it sends the badge under it, on a narrow record too. The record's state stays `RecordStatus` at the end.
- Upgrade: nothing to change. A record that placed a label beside its name by restyling the head's classes can drop that for `RecordBadge`.

## 0.41.1

- `RecordCard`: a `Menu` at a record's end (its "⋯" trigger) stays beside the name on a narrow record, as an `iconOnly` button does; before, its anchor counted as a labelled action and went under the name.
- Upgrade: nothing to change.

## 0.41.0

- `RecordCard` takes `href`, or a router's link in `render`, for a record that opens its own page: the title becomes the link and the whole record its target, tinted on hover and ringed on focus (`is-linked`, `di-record-link`). A linked row without `RecordActions` ends in a chevron (`di-record-go`), for a touch screen that has no hover to show it; controls in `RecordActions`, `RecordInsight` and `RecordFooter` keep their own press above the link.
- `RecordCard` on a narrow record: a control that is only an icon (an `iconOnly` button, the chevron) stays at the end beside the name, and only the state goes under the name; before, below 400px it went under the name on a line of its own. A labelled action goes under the name as before. A row that ends in a state alone keeps it on the line down to 288px, as a card does; before, every row moved its end under the name below 400px.
- `Steps variant="cards"`: when one card fills the line, each card is as tall as what it says instead of the stage height.
- Upgrade: nothing to change. A list whose rows each carried an "Open" button can drop it for `href` or `render` on the row.

## 0.40.0

- `EventTimeline`: given `lanes`, the lanes are the plot: one row per lane, with hover, brush, zoom and picking acting on the lanes themselves, instead of one row of everything with the lanes folded beneath it. A lane's name stands above its track; with `onLanePick` it is a button that narrows to the lane, pressed (`aria-pressed`) while `activeLane` names it. `lanesLabel` and the fold are gone.
- `EventTimeline`: `helpLabel` (required) names the button that shows the keys and gestures; they stay folded until asked for, open from the line under the plot (`di-timeline-foot`) and remain the plot's description for a screen reader. The zoom controls keep their place.
- `EventTimeline`: the class names follow: `di-timeline-foot`, `di-timeline-lane-name` and `di-timeline-lane-names` are new; `di-timeline-lane-label`, `di-timeline-lanes-block`, `di-timeline-lanes-chevron`, `di-timeline-lanes-fold`, `di-timeline-lanes-inner` and `di-timeline-lanes-toggle` are gone.
- `EventTimeline`: the hover callback is reported in a transition, so moving over a gap no longer chains urgent renders; the readout keeps its own width at the stage's edge and sets it only when it changed, so placing it no longer squeezes and moves it without end.
- `MultiComboBox`: `hideLabel` reads the label without showing it, so the field sits in a filter bar as `FilterSelect` does. Focus alone no longer opens the list, as in `ComboBox`: Tab only focuses the field; ArrowDown, typing or the toggle open it. A dialog that focuses it first shows its other fields rather than the list over them.
- `TableColumn`: `width` takes a length in rem (`"9rem"`), which fixes the column, so a table whose rows change (one list, then another) keeps its columns in place.
- `ChartKey`: an entry's swatch takes only its swatch fields (`swatch`, `color`, `icon`), not the whole entry with its key.
- `DataTable`: a stacked row's selection box sits at the card's edge, not on its text edge.
- Upgrade: an `EventTimeline` passes `helpLabel` and drops `lanesLabel`; to let a reader narrow to a lane, pass `onLanePick` and the `activeLane` it sets. Styles or tests that name the removed `di-timeline-lane*` classes move to the new ones. A test that expected a `MultiComboBox` list to open on focus presses ArrowDown or clicks the toggle.

## 0.39.0

- `Section` (new): a titled part of a panel, a sheet or a reading page, with no frame of its own; `heading` sets its level, `id` lets a link or a script move focus to its heading.
- `EntryList` (new): a short list read row by row on ruled lines, each `Entry` with an `EntryEnd` at the line's end (`mono` for a machine value) and an `EntryDetail` under it.
- `DiffMark` (new): what a change removed and added, struck through on the danger wash or set on the ok wash and named aloud by `label`; `sign` for a list item, `layout="block"` for a passage replaced whole.
- `LinkRow` (new): a few links side by side that wrap as words do; `label` makes it a navigation landmark, `size="sm"` sets it in the hint size.
- `AppShellFooter` (new): what closes every page inside `AppShellContent`, its `note` and a `LinkRow`.
- `PlanCard` takes `lead` (who the plan is for, under its name) and `emphasis` (the gold edge of the plan a page points to); its price and period read with a space between them ("€9 a month").
- A key hint (`Kbd`) in the `AppShellBar` is left out on a phone.
- A `blockquote` in `Prose`, a passage quoted from a source, is set in by a hairline.
- Upgrade: nothing to change.

## 0.38.0

- `SplitLead` (new): what the main column of a `rail` split opens with. Beside the rail it heads the main column, the rail standing beside both from the top; on a phone it comes first, above an `asideFirst` rail.
- Upgrade: nothing to change.

## 0.37.0

- `AttentionItem` takes `dir` for its title: `auto` for a title someone else wrote.
- Upgrade: nothing to change.

## 0.36.0

- `Verdict` (new): a record page's state, its one sentence and its summary, before anything else on the page: `VerdictStatus`, `VerdictLine`, `VerdictBody`; `emphasis` gives it the gold edge, `label` names it as a region.
- Two measure slots, `--di-measure-reading` (68ch: `Prose`, a `Verdict`'s summary) and `--di-measure-verdict` (40ch: a `Verdict`'s sentence).
- `Prose` (new): running text for reading: 16px body to about 68 characters, section heads in the display face set apart by space; `ProseLede` opens it at 18px.
- `CiteMark` (new): a numbered citation mark that links to its source.
- `SourceList` (new): the numbered sources the marks lead to, one `SourceEntry` each.
- `AttentionItem` takes `lang` for a title in another language than the page.
- Upgrade: nothing to change.

## 0.35.0

- `MetaLineItem` (new): an item of a `MetaLine` that holds a component, such as a `TooltipTarget` for a name whose id a reader may need. A `MetaLine` takes either `items` or `MetaLineItem` children, never both.
- `RecordLine` takes its detail as children, which may hold a component: `detail` → `children`.

  ```tsx
  <RecordLine primary="registry.example.org" detail="09:12:04Z" />
  // becomes
  <RecordLine primary="registry.example.org">09:12:04Z</RecordLine>
  ```

- `MetaLine` spaces its items by the gap and clips nothing, so a focused item's ring shows whole at a line's ends in every browser.
- A `CopyValue` of several lines wraps only at its spaces, so an id such as `CVE-2026-1234` is never split at its hyphen; a run of 24 or more characters still breaks where it must.
- Upgrade: replace `detail=` on each `RecordLine` with its children.

## 0.34.0

- `MultiComboBox` searches on a server: with `onQueryChange` the caller finds the options for what was typed and passes them already matched, `loading` (with `loadingLabel`) says a search runs, and a chosen entry keeps its label across searches. Each search highlights its first match; Enter picks it, and Enter while `loading` picks nothing, so it never takes a row left from the last search. Enter on typed text never submits the form around the field.
- `MultiComboBoxOption` takes `detail` (lines under the label, such as a title and a product) and `marks` (`MultiComboBoxMark`: status pills with `label` and `tone`); both types are exported.
- Upgrade: nothing to change.

## 0.33.0

- A `list` or `detail` `Page` keeps its side column only where the page itself is 1920px or wider (was 1280px). The column is held empty while nothing is in it, so on a narrower page it took 344px from a wide register for nothing, and a table got narrower as the window grew past the old threshold. Below 1920px of page a side `Dialog` covers the content as a sheet, as it already did on narrower pages, and a `PageAside` follows the sections.
- Upgrade: nothing to change. A product page whose side dialog should stay beside the content on a desktop checks it at a page of 1920px or more (2560px windows with an app sidebar).

## 0.32.0

- `RecordCard` takes `lang` for its title and `Tag` takes `lang` for its name and title: data in another language than the page, such as an English CVE title on a German page, says its language, so a screen reader reads it in that language. A tag with `onRemove` says it on the name alone, so its remove label keeps the page's language.
- Upgrade: nothing to change; pass `lang` where a record's title or a tag is source data.

## 0.31.1

The first release of these changes; the v0.31.0 tag stopped at CI and was never published.


- `ClampText` (new): a passage held to 2–6 lines (`lines`) with a "Show more" link-styled button (`moreLabel`, `lessLabel`) that opens it in place; the button is there only when the text runs past the lines, measured again on resize and once the fonts have loaded.
- A `RecordCard` card whose head ends in `RecordActions` stacks its mark, name and actions in one column below 400px of card, so buttons no longer squeeze the title to a sliver on a phone. Rows keep their layout.
- Upgrade: nothing to change.

## 0.30.0

- `Step` takes `state="failed"`: where a process stopped, a cross on the critical status ground instead of the current fill, its name in the status ink, read as `stateLabels.failed` (new, optional; `StepStateLabels` is exported). The line under a narrow `progress` track names the current step, else the failed one, else the last once every step is done.
- Upgrade: nothing to change; pass `failed` in `stateLabels` where a step can fail.

## 0.29.0

- `Split` (`rail`, the default) puts the aside beside the main column by the split's own width, not the window's: once the main column keeps 40rem beside the 320px rail (about 984px of split). An app sidebar beside the split now counts, so a strip of tabs or a timeline in the main column is no longer squeezed between the two. Narrower, the aside follows the main column, or comes first with `asideFirst`. The rail split now stands in a frame (`.di-split-frame`, the container it is measured by), as the `list` split already did; `className` goes on that frame.
- A stacked `DataTable` card wraps the name and the scope of each tag in a compact `TagList` (`max`) inside the tag instead of cutting them; in a grid row they keep one line as before.
- Upgrade: a product that styled a rail split through `className` or a selector on `.di-split` checks that it still applies to the frame or to the split inside it.

## 0.28.1

- A `layout="measured"` table (`DataTable`, `InfiniteTable`, `CursorTable`) measures its columns again once it turns out to scroll sideways. A pill or tag beside a pinned filling name is no longer cut when the page opens at a width where the grid scrolls.
- `Sidebar` group labels wrap onto a second line instead of being cut at the sidebar's edge.
- Upgrade: nothing to change.

## 0.28.0

- `EventTimeline` and `TimelineSummary` draw categorical series, not severity tones. The caller declares `series: TimelineSeries[]` (`{ id, label }`, at most six); stacking and the key follow that order, and series i is drawn in `--di-chart-category-(i + 1)` (new tokens, light and dark, none red, orange or gold). `TimelineBar` counts per series id (`counts`), `TimelineEvent` and `TimelineCell` name their `series`, and every event's line has one length. `TimelineEpisode` carries `counts` and stretches per series; a summary row names its series in an inline `ChartKey` instead of a severity mark. What is not declared is not drawn, picked or counted, and a bar target is the caller's own bar; a bucket with nothing drawn is a `gap`. `ChartKey` takes `inline`.
- Upgrade: replace `toneLabels` with `series`; build bars as `{ start, end, counts }`, events and cells with `series` instead of `tone` (drop `magnitude`); drop `tone` and `toneLabel` from `TimelineSummaryEpisode`; read episode counts from `counts`; `TimelineTone` and the `--di-tsummary-severity` slot are gone.

## 0.27.0

- `@data-insights-ai/ui/checks`: the on-a-surface rule for a product's pages, as a script a browser test runs in its page (`page.evaluate(surfaceScript())`), with `SURFACES` and `GROUND`. Content stands on a surface (a strip `FigureRow` is one); only the page's frame stands on the bare ground, and the page's footer is the `footer` that ends `main`. A footer anywhere else, and a footer `FigureRow` on the ground, are findings. The entry imports no component or stylesheet. See the README, "Check a product's pages".
- Upgrade: replace the product's own copy of the rule with `surfaceScript()`; move a note that stands in a `footer` inside the page into a `Notice variant="line"` or the page's footer.

## 0.26.0

- `LoadError` counts down a wait of a minute or less and names the time a longer one ends (an hourly or daily allowance), in `locale`. Upgrade: `LoadErrorLabels.retryAfter` takes the seconds only; add `retryAt(time)`, and pass `locale`.

## 0.25.0

The list and feedback pieces the products each drew themselves, combined from all of them:

- `CursorTable`: an `InfiniteTable` fed by a server cursor list, with a skeleton while the first page loads, `CursorTableFailed` for a list that could not be read, `CursorTableEmpty` on a surface for a list that never held a row, and the table with its head kept and a `TableEmpty` child while a filter matches nothing; group rows and counted entries as `InfiniteTable` has them.
- `FilterSelect`, `FilterTags` and `RangeFilter` for a `FilterBar`: each reads its label in the bar and shows it in the sheet, whose copy takes its own id.
- `periodOf`, `periodSearch` and `anyTime`: a list's period in the URL with a default period, "any time" kept as `range=all`; `usePeriod` fixes a period's instants when it is chosen, so later pages read the same range, and moves a preset on a new `now`.
- `toast()`, `dismissToast()` and `Toasts`: receipts from anywhere, with one action or a download; a receipt stays while the reader points at or focuses it.
- `LoadError` (a failure in plain words, try again that waits out a rate limit and says how long, a reference to copy), `RouteBoundary` (a new `resetKey` tries the page again) with `PageFailure`, and `StaleNotice` (a list behind the server, announced once, focus to its heading after reading again).
- `ResourcePath` (where a record lives, each part linked while it exists, the app's router link through `renderLink`) and `TechnicalDetails` (raw identifiers to copy, empty ones left out).
- Upgrade: replace the product's own copies of these; nothing existing changed.

## 0.24.0

- `di-lint-tokens <dir>…` is a bin of the package: the token lint for a product's stylesheets. It also fails on any `--di-*` property a product sets other than the slots in `component.css` (rule `token`). `type` and `radius` now catch rem and em as well as px. See the README, "Check a product's stylesheets".
- `--di-disclosure-gap`, the step from a `Disclosure`'s head to its body, is a slot in `component.css`, so a page may tune it.
- `data-brand` on a region also draws `--di-chart-series` in the seal's ink and `--di-chart-highlight` in the text's ink, so the one value still differs from every series: a product's signature chart on its brand surface takes the gold from the system instead of re-pointing the tokens.
- Upgrade: replace a re-pointed `--di-chart-series` with `data-brand` on the chart's region, and bind `--di-font-code` where a stylesheet named `--di-font-mono` (the `layer` rule now checks products).
