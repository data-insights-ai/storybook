# Run Storybook and find a component

In twenty minutes you run the workbench, find a component with its docs page, and run the checks a change has to pass. You need Node 22.12 or newer and pnpm 12 (`packageManager` in `package.json` names the exact version; `corepack enable` installs it).

## 1. Install and start

```bash
git clone https://github.com/data-insights-ai/storybook.git di
cd di
pnpm install
pnpm storybook
```

Storybook opens on <http://localhost:4500>. The sidebar groups components by the question a developer asks: `Actions/` lets someone do something, `Forms/` lets someone enter or choose, `Tables/` shows many rows, and so on. `Foundations/Start here` has one tile per group with a live example.

## 2. Read a component

Open `Actions/Button`. The **Docs** entry shows the component's description, every prop with its type and default, and all its stories. The stories under it each show one state; **Controls** at the bottom changes the string props, because every visible word is a prop.

Open `Shell/AppShellBar` next, then `Patterns/Security overview`: a whole screen built only from the public components. The patterns are the examples to copy from when you compose a product screen.

## 3. Change a story and see it

Open `src/components/actions/Button/Button.stories.tsx` and change the `Secondary` story's `children` from `"Filter"` to another word. Storybook reloads; the story shows the new text, and the Docs page shows it too, because the docs page renders the same stories. Revert the change.

## 4. Run the checks

```bash
pnpm lint
pnpm typecheck
pnpm exec vitest run --project=unit
```

These are the fast checks: ESLint at zero findings, the TypeScript compiler, and the unit tests beside pure modules. The full gate before a change is handed back is `pnpm check`, which also runs every story in a browser in four passes (light, dark, 390px wide, compact density) and builds the package; it needs Chromium (`pnpm exec playwright install chromium`) and a few minutes. [Checks](../reference/checks.md) lists what each pass measures.

## Where to go next

- To put the package into an app: [Your first product screen](first-product-screen.md).
- To add a component here: [Add a component](../how-to/add-a-component.md), after reading [The Register](../explanation/register.md) and [API rules](../explanation/api-rules.md).
