# datAInsights

Storybook for the datAInsights brand. Colour, type, and the mark come from the brand book. The screens are composed examples of a console. They are not a named product.

© 2026 datAInsights GmbH. All rights reserved. See [LICENSE](LICENSE). Reading this repository is allowed. Copying the design, the components, or the brand assets into another product is not. The package is not published to npm.

Rules for changing this repo are in `AGENTS.md`.

```bash
pnpm install
pnpm storybook
```

Opens on port 4500.

```bash
pnpm typecheck
pnpm test
pnpm build-storybook
```

`pnpm test` runs every story in a browser. The static build is written to `dist/storybook`.

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
