# The Register

The brand as a design, and the rules that follow from it. The Foundations pages in Storybook (`Foundations/Color`, `Type`, `Space and shape`, `Our look`, `Logo`) show these rules; they do not explain them. Values live in `src/styles/tokens/primitive.css` (the ramps) and `semantic.css` (the roles and the dark remap); this page names roles, not numbers, so the token files stay the one place a value lives. `.design-sync/conventions.md` carries the same rules for the design agent on claude.ai; when one changes, both change.

The system is the **Register**: the surface is a record, not a dashboard. A register is read, trusted and acted on; it does not perform. Everything below follows from that.

## Ground and depth

Paper is the ground, and depth is a step in tone, not a line. Daylight runs on a paper ramp: chrome (bands and the app bar, one step below the ground), ground (`--di-bg-page`), surface (a panel, a table, a list pane), inset (a group inside a surface), strip (a figure row without a hero) and plane (a menu, a lifted row). The sidebar is ivory, one step above the ground so it never outweighs the content. The ground is one token, so a warmer ground is one line in `primitive.css`.

After dark the theme is designed, not inverted: the night ramp runs the same steps on navy (chrome, ground, surface, inset, plane, and a glow for the hero zone), never near-black; the sidebar drops a step below the page. `src/styles/tokens/zones.test.ts` keeps every neighbouring pair of steps at least 3 apart in L\*, so the depth reads in both themes.

Light is the bare `:root` default; dark is a remap of the same roles under `[data-theme="dark"]`. A region may carry its own `data-theme` and the token layers resolve inside it, because every role and slot is re-declared wherever the attribute is set; the region has to paint its own ground. That exists so a page can show both themes at once (`Foundations/Color`). It is not the way to put a dark surface on a light page: that is `--di-inverse-*` (Toast, Tooltip, SignIn), "a plane sitting on navy in either theme", and `--di-sidebar-*` for the rail.

Never a surface on the same surface: a box that draws a border or shadow on its own ground colour is a card on a card. A nested group takes the inset tone or drops its frame. A table sits on a surface without a frame of its own. Rules run only between figures in a `FigureRow` and between the rows of a table; a header has no rule under it. A surface may carry a soft shadow (`--di-elevation-surface`); a detached plane (menu, modal, toast) a stronger one. No blur behind text: a value behind frosted glass has no measurable contrast.

Text and controls keep at least 12px from the inner edge of the surface that holds them; table rows, menu rows and media run full-bleed by design. A surface holds its content at the same inset above as below, and its head, body and foot sit a step of the space scale apart. One bold voice per block: only the title is bold.

## Navy, gold and the one thing

Navy is the ink **and** the action. No accent acts: the one filled control is navy, so it is never unclear which button commits. After dark the fill turns paper-white, because navy cannot act against a navy ground.

Gold marks **the one thing** that matters in a view: the first `AttentionItem`, a verdict, the one value of a chart (`--di-one`, `--di-one-edge`, `--di-one-ink`). In daylight gold is never text and never a wash under prose; the one object may carry a small gold pill with navy words that names it. After dark gold text is allowed, because it reads on navy.

The seal (`--di-seal`: `Button variant="seal"`, `Badge tone="seal"`) is the same gold and therefore a brand moment only: sign-in, the brand mark, empty and onboarding states, licence and certificate seals. It never appears in an operational view beside the one thing; an operational "seal" or "rotate key" is `primary` or `secondary`. Components draw the record marks (the sealed dot, the inferred ring, a done step) in the `--di-mark*` roles: neutral ink by default, gold inside a brand context (`data-brand` on a region, which `SignIn` and the Foundations pages set; `data-brand="false"` opts out). A portal (`Tooltip`, `Menu`, `Flyout`, the date popovers) renders outside the region and keeps the neutral mark. A component never binds `--di-seal` or `--di-ai-*` directly, except the brand-moment controls themselves.

An AI control is marked by a hollow ring and a gold hairline, never by a gradient or a sparkle: the unsealed thing is the *less* decorated one. Marks of provenance: a filled dot is recorded and verifiable, a hollow ring is inferred; the word beside the mark says which.

Poppy is a brand colour only and never a status: a failure is the severity scale's critical, and says so in words. Neither poppy nor a selection colour fills a button.

## Selection and focus

Selection and focus are the navy family (`--di-select`, `--di-focus`, `--di-sidebar-focus`), never gold and never the bright cornflower. Selection is the pale tint (`--di-bg-selected`) with a navy edge: a selected row or option has the edge on its leading side, a chosen card or set filter tag sits inside a 2px edge, and the days between a range's ends take the tint. No option gets a solid background in the selection colour: a chosen segment is a quiet raised thumb, toggles and chosen calendar days take the primary ink. The sidebar's current page is a selection too, so the one gold object of the view stays alone.

`Highlight` marks a search match: the pale tint and one weight step heavier, no edge, because a frame around words reads as a control.

Focus is one ring model: `--di-focus-ring-width` solid `--di-focus-ring-color`, on `:focus-visible` only. A free-standing control takes it outside at `--di-focus-ring-offset`; an item that touches its neighbours or sits in a clipping frame (menu and option rows, sidebar items, table rows, tabs, segments) takes it inside; a framed item in a group takes it on its edge, so focus and selection are one indicator, never two rings. Inside a strong fill or on an inverse plane the ring takes the family step that keeps 3:1 there (`--di-focus-ring-on-strong`, `--di-inverse-focus`). Every scroll frame keeps `--di-focus-ring-reach` as padding, so a ring is never cut.

## Status, severity and charts

Severity is one scale for every product and every chart, drawn as `SeverityMark`: a filled mark plus the word, never colour alone and never the text's own colour. After dark medium runs orange so it never reads as gold. Status (`tone`: `neutral | ok | warn | danger`) is its own set of word-on-wash pairs, each above 5:1; warn is its own amber, not gold.

Charts are drawn in the chart roles: `--di-chart-series`, `--di-chart-highlight` (the one value, gold), `--di-chart-compare` (the series the recorded one is measured against, a lighter navy, at least 2:1 from the series and 3:1 on the surface), `--di-chart-muted`, `--di-chart-band`. An ordered status scale (a stacked severity, a meter's zones) is `--di-chart-series`, `--di-chart-warn`, `--di-chart-danger`, not the status dots, which sit too close together to tell apart side by side. Kinds without an order are `--di-chart-category-1` to `-6` in the order the caller declares them, none red, orange or gold, so no kind reads as a severity or as the one thing. A mark that carries meaning keeps its full colour and shows less by height, never by fading to a pastel.

Charts do not move. Data arrives pushed, so a draw-in would replay on every update, and a dashed forecast drawn beside its solid series reads as two things happening at once. Every series sets `isAnimationActive={false}`; the plot fades in once on mount; updates appear at once; bars do not grow. `Chart` wraps one Recharts chart and no one-off SVG chart is drawn; the one drawn chart is `EventTimeline`, because Recharts zooms by index rather than time and cannot pan or pinch at the rate a gesture asks for. `TimelineSummary` tells the same bars as a few episodes on one strip.

## Type

Three families, one name each: `--di-font-display` (Space Grotesk, bold) names and counts: the page's name at 28 to 34px with the head's width, a figure, a section head. `--di-font-ui` (IBM Plex Sans) is what a person reads; the body is 14px. `--di-font-code` (IBM Plex Mono) is what a machine wrote (identifiers, hashes, timestamps) and the label above a value (`--di-mono-label-*`, capitals at 0.1em). A field's label stays prose in sentence case. Headings balance, body text is `pretty`; a heading hyphenates a word of twelve letters or more in the language `lang` names, so a German compound breaks at a hyphen. All three families are OFL-1.1, from `@fontsource`.

Type runs `--di-font-size-100`…`-1000`. The top two steps are the display tier the brand pages use; a product screen never goes above `-800`, and reaches it only with the page name on a wide head. `-550` is 18px and the ladder's one interpolated step: 16 to 20 is where prose hierarchy lives on a brand page, and with nothing between them a lede, a section lede and a card heading all landed on 16. A second interpolation would mean the ladder was wrong, not short. A size that scales follows the width of its block (`cqi`), never the window's, so a block in half a page is set for half a page. Every size a page may tune is a slot in `component.css` (`--di-page-title-size`, `--di-disclosure-*`, `--di-brand-*`).

Underline means a link. Only a link (`TextLink`, `Button variant="link"`) or a disclosure is underlined; a ghost button is a button without a frame; no decorative underline, no dotted definition underline. A link is the text colour with a navy underline, the same in prose and at a block's edge, where an action link may add a trailing → (↗ for an external page). A name that opens a record is a link, or the whole row is the target with a hover tint.

## Space, shape, density

Space is named by value: `--di-space-2 4 6 8 12 16 24 32 48 64 96`. Fine at the bottom, coarse at the top, because that is where the density is: a 28px control cannot be padded on a 4px grid. 48 and above are the brand tier; a console screen stops at 48. Radii are moderate: 4px for anything that takes a value, 6px buttons, 8px an inset, 12px a surface, so a field reads as set into the sheet; only a pill is fully round.

Density and size are two axes. A component's `size` (sm, md, lg) is its role: md is the standard control, sm a chip or a row of buttons alone, lg a lone primary action or the tab strip. The density (`data-density="comfortable|compact"`, set from the person's profile through `DensityProvider`) scales every size and inset through `density.css`; the body stays 14px in both, and on a touch screen compact keeps 40px targets. Never a density prop on a component, and never a smaller size to make a screen denser.

A number appears only where the order is information: the rows of a register (the 38px index column, `--di-index-col`), the steps of a process, the rank in an `AttentionList`. A panel, a sheet, a tile or an empty state carries no number and has no prop for one.

## Motion

Motion runs at one of two durations and no others: `--di-duration` 120ms and `--di-duration-slow` 200ms, ease-out, one change at a time. A button changes colour; nothing lifts, scales or presses, and never on a table row, because forty thousand rows have to hold still. A modal fades and settles one step, a drawer arrives from its own edge, a menu drops 4px, a toast rises 10px. A waiting indicator is the exception and loops until the wait ends (`Loading`, `RouteProgress`); a skeleton appears only after 150ms (`Delayed`), with its space held from the first frame. `prefers-reduced-motion` drops all of it in `base.css`.

## What the system refuses

- **No undo-first.** Nothing a model proposes runs before an operator confirms it, and the confirmation states basis, scope and reversibility first (`ConfirmDialog`, `ProposalPanel`). What follows is a receipt carrying an audit id (`Toast`), never a way back.
- **No glassmorphism, no gradient edges, glow, pulse or sparkle glyphs.** The least verifiable output cannot be the most decorated one.
- **No navigation that hides or reorders itself.** The rail is fixed, in the order the product declares.
- **A destructive action has one look per step.** The button that asks (`Button variant="danger"` in a toolbar, a row, a `DangerAction`) stays quiet until hovered; the one that answers, in a `ConfirmDialog` footer or a `ProposalPanel`, is filled red. Blocked, either takes the disabled look and `DangerAction` says why.
- **A toast runs on navy, not on paper**: it is the system reporting back.

## Sign-in

The sign-in page follows the theme: the paper ground with one surface card and the navy button in daylight; the navy ground with a navy surface card and the paper-white button after dark; IBM Plex Sans at 400. The identity provider's hosted login copies exactly that (ground, primary, font), so the two read as one place. No rules in or under the card; text on it has a solid background, because contrast has to be measurable.

A region a story pins to one theme (a swatch in Foundations, the hero zone) is a designed object of that theme, not a gap in coverage. Do not add a dark variant of it for the sake of the test.
