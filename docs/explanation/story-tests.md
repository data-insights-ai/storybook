# How the story tests judge a component

`pnpm test` runs every story in a browser and fails it on what a reviewer would otherwise have to see. The commands and the pass table are in [Checks](../reference/checks.md); this page says what each check measures and why it measures that way.

## Why a matrix

Colour changes with the theme, layout changes with the width and the density, and nothing else does. So contrast and axe run light and dark; the surface checks run desk, phone and compact; the focus walk runs desk and phone, where layouts collide differently. Dark at 390px and compact at 390px would find nothing new, so they have no pass. The dark pass clears the root's theme before each story and checks after it that the root is dark, so a story cannot pass dark by never having been dark.

A screen has one `main` and one `h1`. `.storybook/preview.tsx` gives a component story that wrapper when it does not render its own heading, so axe sees a page, not a fragment.

## Accessibility: axe, and what it cannot decide

Axe runs on every story in the light, dark and phone passes and the test fails on violations. Axe measures aria-hidden text too, but at one point only, and it leaves a node "incomplete" when it cannot model what is behind it: an SVG under every chart label, a pseudo-element such as the connector of `Steps variant="progress"`, an overlap. The story test fails on violations only, so those gaps would stay open; the contrast harness closes them.

## Contrast, measured rather than modelled

`.storybook/tests/contrast` runs after each story in both themes. It takes every visible text node, measures it at the start, middle and end of each line, reads the paint stack at that point (the layers below composited to the first opaque one, an SVG shape by the stroke and fill that cover the point, semi-transparent layers above counted over text and ground) and fails on the worst point under 4.5:1, or 3:1 for large text.

It fails instead of skipping what it cannot measure: gradient or pattern text; a gradient, background image, `<img>`, SVG `<image>` or canvas under or over text; text the hit test does not return at a point (a `clip-path` is not modelled); text that cannot be scrolled into view. That is deliberate: an unmeasurable value is not a pass.

Not measured, because not shown: `display: none`, `visibility: hidden`, opacity 0, `.di-sr`, the part of a line its own box or an ancestor clips with `overflow` (a remainder a pixel wide or less is the visually hidden pattern), anything beyond the document's top or left edge, and a point an opaque layer covers. Inactive content is out, as in WCAG: disabled controls, a control or composite input group marked `aria-disabled`, `[inert]`, and what an open modal makes inert (a popover above it is still measured). `.storybook/tests/contrast/visibleContrast.browser.test.ts` proves each failing case with a fixture.

Beside the text, the harness measures the chart marks listed in `markContrast.ts` (bars, lane cells, thresholds and handles of the timelines, a period bar on its track) against what they sit on and fails under 3:1 (WCAG 1.4.11). Gridlines, rules and the tints behind a threshold are support and are not listed. A mark that carries meaning keeps its full colour and shows less by height, never by fading to a pastel.

## Surfaces: the register rules a machine can see

`.storybook/tests/surfaces` holds one file per rule from [The Register](register.md):

- `nesting.ts`: never a surface on the same surface. A nested group takes the inset tone or drops its frame.
- `clearance.ts`: text and controls keep at least 12px from the inner edge of the surface that holds them; table rows, menu rows and media run full-bleed, and its allow-list says why for each.
- `spacing.ts`: a surface holds its content at the same inset above as below (within 2px), and its head, body and foot sit a step of the space scale apart. It is measured on a copy at the surface's content height, so a panel stretched by its row is judged by its padding.
- `toolbar.ts`: every control in a toolbar or filter bar is one height.
- `underline.ts`: no underlined text outside `a[href]`, `button`, `summary` or a link or button role, because underline means a link.

`src/checks/surfaces.ts` is the allowlist of what may stand on the bare canvas; the same rule ships to products as `@data-insights-ai/ui/checks`.

## Focus: walked with the real keyboard

`.storybook/tests/focus` runs last after each story. It Tabs through the story with the real keyboard (from the open modal when there is one) and steps with the arrows through each menu, listbox, tab row, radio group and grid it lands in. For every ring it fails: a ring clipped by an overflow ancestor; a band that runs over another control or a neighbouring item's fill; a ring under 3:1 against what it replaces (the ground outside, the fill inside); a selection edge parallel to the ring 1–4px away, because focus and selection are one indicator, never two rings; a ring under a sticky or fixed layer. `FOCUS_REPORT=1 pnpm test` prints the findings per story instead of failing.

## Layout and motion

The `layout` project runs browser tests that are not stories: `Page.browser.test.tsx` checks the page widths at 1920, 2560, 3440 and 390px, so large screens stay part of the layout; `charts/motion.browser.test.tsx` renders every chart story and fails on any animation other than the one fade-in on mount, or on a mark that changes shape after mount, because charts do not move.

A story whose subject is the desktop arrangement (the sidebar beside the content, a toolbar on one line, an anchored popover) pins `viewport: { value: "desk" }` in its `globals` and has a phone story beside it where the arrangement differs; an assertion that only holds at one width checks `window.innerWidth`. A play function that asserts on an element mid-animation uses `waitFor`, because the element starts at `opacity: 0`.

## Unit tests

`src/**/*.test.ts` run in Node for arithmetic a story cannot show (date ranges, scales). `src/styles/tokens/zones.test.ts` reads the token sheets as text and keeps every neighbouring pair of tone steps at least 3 apart in L\*, in both themes, so depth stays a step in tone.
