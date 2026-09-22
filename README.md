# datAInsights

Storybook for the datAInsights brand. Colour, type, and the mark come from the brand book. The screens are composed examples of a console. They are not a named product.

© 2026 datAInsights GmbH. All rights reserved. See [LICENSE](LICENSE). Reading this repository is allowed. Copying the design, the components, or the brand assets into another product is not. The package is not published to npm.

Rules for changing this repo are in `AGENTS.md`.

```bash
pnpm install
pnpm storybook
```

Opens on port 4500. While it is running, agents can read the component catalogue at `http://127.0.0.1:4500/mcp`.

```bash
pnpm typecheck
pnpm test
pnpm build
pnpm build-storybook
```

`pnpm test` runs every story in a browser. `pnpm build` writes the installable package to `dist/lib`. The static Storybook build is written to `dist/storybook`.

## Use a released version

A tag `v0.1.0` publishes `@data-insights-ai/ui@0.1.0` to GitHub Packages and uploads that Storybook to `https://storybook.data-insights.ai`. The tag and `version` in `package.json` are the same number. Projects pin that number.

In the app’s `.npmrc`:

```
@data-insights-ai:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

`NODE_AUTH_TOKEN` is a GitHub token with `read:packages`.

```bash
pnpm add @data-insights-ai/ui@0.1.1
```

```tsx
import "@data-insights-ai/ui/styles.css";
import { Button } from "@data-insights-ai/ui";
```

Import the stylesheet once. It carries the tokens, the base rules, and the woff2 faces. Importing a component pulls in that component and its own stylesheet, and leaves the unused components out. The app supplies React 18.3 or newer. Strings are props. `data-theme="dark"` on a parent switches the semantic tokens.

## How it is put together

One package. Storybook 10, React 19, Vite.

Tokens are three layers in `src/styles/tokens`:

- **Primitive** — brand-book values. Components do not name these.
- **Semantic** — page, surface, text, fill, focus, sidebar, status. Light is the console as drawn. Dark remaps the same roles from the toolbar.
- **Component** — slots for one control, such as `--di-button-primary-bg`.

Gold is one moment per view: the tittle in the mark, or the page eyebrow. Paused reuses that gold. Running is `#186D41` and failed is `#AB2E37`, the hues from the console screenshots, each above 5:1 on its wash.

Sansation is display and figures. IBM Plex Sans is the interface. IBM Plex Mono is identifiers, timestamps, and eyebrows.

Buttons, fields, and tables are native elements. A headless library is worth adding when a control needs roving focus or a popup, not before.

Component stories take string args, so Controls can change the copy. Icons, actions, table cells, and other elements are children, filled in `render`, not edited as controls. Stories are in English. The Get started checklist in the sidebar is turned off.

## Screens

| Story | What it shows |
| --- | --- |
| Screens / Login | Sign-in. A card on a navy field. |
| Screens / Watchlist | Identities under watch. |
| Screens / Coverage | A list of connected sources. |
| Screens / Architecture | A five-stage pipeline. |
| Screens / Settings | Session, channels, availability. |

Sample copy is English. A product supplies its own strings.
