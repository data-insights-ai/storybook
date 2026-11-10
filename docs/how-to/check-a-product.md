# Check a product's stylesheets and pages

## Lint the product's CSS

The package ships the token lint the library itself is held to. Run it over the product's own stylesheets (`.css` only) in its lint target:

```bash
pnpm exec di-lint-tokens src
```

It applies the rules `space`, `radius`, `type`, `colour`, `layer` and `focus-ring` from [Checks](../reference/checks.md), and one more, `token`: a product sets no `--di-*` property except the slots `component.css` declares (sizes a page may tune, such as `--di-page-title-size` and `--di-disclosure-gap`, and the per-component slots). A token a product needs belongs in the design system.

An exception says why, in a comment the lint reads:

```css
/* di-lint-allow colour: a specimen shows the literal brand colour,
 * because the colour itself is what it shows. */
```

`di-lint-allow <rule>: <reason>` covers the block it sits above; `di-lint-allow-file <rule>: <reason>` at the top of the file covers the file.

## Check that every page stands on a surface

Content on a page stands on a surface: a `Panel` or another `di-surface` block, a table's surface, a strip `FigureRow`, a `Notice variant="line"`, a dialog or what floats above the page. Only the page's frame stands on the bare ground: its head, breadcrumb, tabs, toolbars, filter bar, steps, brand points, the attention heading, and the `footer` that ends `main` (legal links, attribution). A note anywhere else is a `Notice variant="line"` or sits on a surface.

The rule ships as `@data-insights-ai/ui/checks`, which imports no component or stylesheet, for a product's browser test to run on every route:

```ts
import { surfaceScript } from "@data-insights-ai/ui/checks";

expect(await page.evaluate<string[]>(surfaceScript())).toEqual([]);
```

Each finding is the element's tag, first class and label. `surfaceScript()` is the rule as source for the page to run; `surfaceScript(rule)` takes another root or other lists, from `SURFACES` and `GROUND`.
