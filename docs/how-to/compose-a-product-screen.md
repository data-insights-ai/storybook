# Compose a product screen

For someone building a screen in a product from the package. The screens under `src/screens` (Storybook `Patterns/`) follow these rules; copy from them, not from memory. Why the rules are as they are is in [The Register](../explanation/register.md).

Build from the components that exist. When something is missing, it is a change to the library ([Add a component](add-a-component.md)), never one-off markup in a screen: hand-rolled markup binds to no token, skips the dark remap, has no focus handling and no accessible name, and is invisible to the story tests.

## The shell

Components carry no outer margin; spacing belongs to the container.

- The frame is `SidebarProvider` with the `Sidebar`, then `SidebarInset` holding `AppShellBar` and `AppShellContent`. A shell has one `main`: `AppShellContent`. Give `SidebarProvider` a `skipLabel` and the first Tab stop is a skip link to the page.
- `AppShellBar` is one row at every width: the `SidebarTrigger`, the page's name (a `Breadcrumb`, which shows only the current page on a phone), then `AppShellBarEnd` with app-wide controls and status, which folds into one overflow button (`moreLabel`) when it does not fit beside the name. What must stay visible goes in `AppShellBarKeep` after the overflow: the notification bell, whose count is its point, and at most one more control. Status words ("Demo data off", "Admin sealed") and a refresh fold. Below 900px the `Sidebar` is a drawer from the inline start that the trigger opens; do not build a second mobile navigation.
- Persistent context controls (an organization or workspace switcher) go in the `SidebarHeader` as a `SidebarMenuButton` that opens a `Menu`, before the navigation in visual and keyboard order. The application owns selection state and authorization.
- `AppShellContent` is a vertical flow: its direct children (`PageHeader`, a `Notice`, a `DataTable`, a `Panel`, a form) are spaced 24px apart. Do not add margins to separate them. A `Page` rendered outside the shell (an error route) keeps the same frame itself.
- A page change keeps the shell: `RouteProgress` in `AppShellBar`, a `Loading` of the target's shape in the content. `Loading shape="app"` is only for the start. Mount `ShortcutHelp` once in the shell.
- Large screens are part of the layout: `AppShellContent` follows the window; `Page width="list"` and `"detail"` keep a side column on the right from a page width of 1920px (a record's `PageAside` and every `md` side `Dialog` the page opens, docked; otherwise empty) and the content takes the rest, so a table never runs across the whole window; `"full"` is an overview on the whole frame; `"form"` keeps its measure; a dashboard is a `Grid`, which adds columns as the page widens; a `Chart` grows taller.

## The page

A screen is composed in a fixed order:

1. `PageHeader` only orients: the page's name (`PageHeaderTitle`, the `h1`), a status pill beside it and a `PageHeaderMeta` (as of when, from where). No kicker, no claim, no rule, no button in the header. A page without tabs keeps its one primary action in `PageHeaderAside`, with its `n` key.
2. The first block is what needs the person: an `AttentionList` of at most three items, item 01 full width with the one button and the gold edge. When nothing is due, `Notice variant="line" tone="ok"` ("Everything is running") stands in its place.
3. A navy hero (`Panel surface="hero"`) only with a signature visual (a chart that is the screen's argument), closed by `FigureRow variant="footer"`. Figures without a hero sit on `FigureRow variant="strip"`.
4. A list beside its record is `Split variant="list"`; on a phone the two are separate views with `SplitBack`.

Inside a block, group with `Stack` (`gap={8|12|16|24|32}`); a section of related blocks is one `Stack`, so the page sees it as a single child. Content stands on a surface (a `Panel`, a table, a `Notice`); only the page's frame stands on the bare ground ([Check a product](check-a-product.md) has the test).

Meta lines (`MetaLine`) break between items, never inside one, and no line starts with a separator. A date or time in running text is a `<time>`. A `FigureRow` is one row, two even rows or one column, never 2 + 1. A `Toolbar align="end"` of buttons stacks full width on a phone.

## Forms

- A form is a `Stack variant="form"` of fields (16px apart), followed by `Toolbar align="end"` for its buttons. A one-line form (pick a value and apply it) is a `Toolbar`: the fields, then the button; a one-line add form where the first field takes the free width is `Toolbar fillFirst`.
- Every control in a toolbar or filter bar is one height: beside a field or a search, buttons are `md` (a field has no smaller size); a filter `Tag` that acts takes the field's height too. `sm` is a row of buttons alone, such as a table row's actions.
- Every field draws its label with `FieldLabel` and its one line with `FieldHint`; a control the product draws itself takes the same two, so `required`, read-only and an error read alike. A field says one thing at a time: one `hint` and one `hintTone` of `neutral | sealed | error`.
- Fields stretch to their container. Constrain a form's width with a `Panel` or a `Grid` column, not by sizing the controls.
- Unsaved changes on a long form are `Toolbar role="region" frame="bar" sticky="bottom"`, rendered only while something is unsaved: the message at its start, Discard (ghost) and Save (primary) at its end. The page keeps the band's height free at its end, so the last block and a focused field always clear it.
- A list read by date keeps its period in one `DateRangePicker` in its list toolbar, after the filters. The product passes `locale`, `weekStartsOn` and `timeZone` from its settings, keeps the period in the URL (`serializeDateRange`, `parseDateRange`) and sends the server the instants `resolveDateRange` gives; a preset that runs up to now has no end (`allowOpenEnd`), so new entries still arrive in it.
- Every `Dialog`, `CreateFlow` step and section form starts in its first field.

## Tables and lists

- `DataTable` takes no `rows` array: the caller maps its data into `TableHead`, `TableBody`, `TableRow`, `TableIndex` and `TableCell`. It has no frame of its own: it sits on a surface, usually a `Panel`, and takes that panel's ground (`padded={false}` lets it run to the edges).
- A table that has never held a row is not rendered empty: show an `EmptyState` in its panel instead. A filter or search that matches nothing keeps the table and its head: a `TableEmpty` in the body (in an `InfiniteTable`, a child beside its `TableHead`), its message a `status`, its one way out at the end of the line. A list that failed to load shows a `Notice tone="danger"` in its place.
- An `InfiniteTable` that scrolls with the page stays outside a `Panel`, whose clipping would break the sticky head; one that is a block among others takes `maxRows`, scrolls in its own frame and sits in a `Panel` like any table. Rows in the order of a value read in spans (last seen, criticality) are grouped by it: a `TableGroupRow` heads each run and `InfiniteTable`'s `groupOf` places them; a list ordered by name is not grouped.
- Under a table, `Pagination` ends the footer row: the count at the start, the pages at the end. `Pagination` is controlled; the caller owns `page`.
- Severity is `SeverityMark`: a filled mark plus the word, never colour alone.

## Detail pages and tabs

- A record's detail page with heavy sub-lists or more than about three sections is split into tabs (`TabNav`), each tab its own URL. The record's settings tab holds its sections and, last, its danger zone (`Panel tone="danger"` with `DangerAction` rows).
- A tabbed page's header never holds a tab's action. Every tab panel starts with the same list toolbar (`Toolbar role="search"`): the search on the left, the tab's one primary action in `ToolbarEnd` with its `n` key, an optional `ToolbarNote` under it; no heading of its own.
- When a page has more than one tab strip, give each `Tabs` and its `TabPanel` the same unique `idPrefix`.
- `Dialog` is a native modal dialog (placement side, center or bottom), except an `md` side dialog inside a `list` or `detail` `Page` wide enough for its side column: it docks there and the page beside it stays usable. Focus moves in, Escape closes it and focus returns to the opener.
- `MenuItem` is an action by default. Pass `checked` for a radio choice and put related choices in a labelled `MenuGroup`; the application owns the checked state.

## Keys

One scheme on every page, nothing to bind: a `SearchField` answers `/`, a `Button` with `shortcut="n"` is the primary create action, a `DetailSection` Edit answers `e`, Esc closes, `?` opens `ShortcutHelp`, `b` toggles the sidebar. In a `DataTable` Up and Down move between rows, Home and End to the first and the last, Enter opens the row. Keys never fire while the reader types.

## Links

Wherever a component draws a link it takes `href` for a plain `<a>` and `render` for a router's link element (`render={<Link to="/cases" />}`): `Button`, `TextLink`, `Breadcrumb` items, `FlyoutItem`, `SidebarMenuButton`, `TabNavLink`. A link with only `href` makes a single-page app reload.

## Language and preferences

Every visible string is a prop; the product passes its own language in. Words every app needs come with presets in English, German and Spanish (`themeLabels`, `emptySegmentLabels`). Data in another language than the page (an English CVE title on a German page) passes `lang` on `RecordCard` and `Tag`. The person's theme goes through `ThemeProvider`, the density through `DensityProvider`; both are the person's preference on the server, never browser storage.
