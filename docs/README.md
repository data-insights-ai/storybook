# Documentation

The design system `@data-insights-ai/ui`: the datAInsights brand as tokens, components and example screens, developed in Storybook. The rules for working in this repository are in [`../AGENTS.md`](../AGENTS.md).

## Tutorials (learn by doing)

- [Run Storybook and find a component](tutorials/run-storybook.md)
- [Your first product screen](tutorials/first-product-screen.md): install the package in an app and compose a shell with a page

## How-to guides (one task each)

- [Install the package in a product](how-to/install-the-package.md)
- [Compose a product screen](how-to/compose-a-product-screen.md): the shell, forms, tables, detail pages, keys
- [Check a product's stylesheets and pages](how-to/check-a-product.md): `di-lint-tokens` and the surface rule
- [Add a component](how-to/add-a-component.md)
- [Release the design system](how-to/release.md)

## Reference (facts)

- Storybook: `pnpm storybook` on port 4500, the published build at <https://storybook.data-insights.ai>. Every component has a docs page with its props and stories; `Foundations/` shows the brand. While Storybook runs, agents read the same catalogue at `http://127.0.0.1:4500/mcp`.
- Tokens: `src/styles/tokens/primitive.css` (values), `semantic.css` (roles, with the dark remap), `component.css` (slots a product may tune), `density.css`.
- Public API: `src/index.ts` is what the package exports; `scripts/public-api.json` records it and `pnpm build` fails when it changes.
- [Component groups and folders](reference/components.md)
- [Checks: lint rules, structure rules and test passes](reference/checks.md)
- [Pattern screens](reference/patterns.md)
- [`../CHANGELOG.md`](../CHANGELOG.md): what each release changes and what a product has to do
- [`../.design-sync/conventions.md`](../.design-sync/conventions.md): what the design agent on claude.ai reads instead of this repository; [`../.design-sync/NOTES.md`](../.design-sync/NOTES.md) holds what the sync tool needs

## Explanation (why)

- [The Register](explanation/register.md): the brand as a design, and the rules that follow from it
- [API rules](explanation/api-rules.md): slots, `tone`, `tier`, layers
- [How the package is put together](explanation/architecture.md)
- [How the story tests judge a component](explanation/story-tests.md)
