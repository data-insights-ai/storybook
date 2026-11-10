# Install the package in a product

A tag `vX.Y.Z` publishes `@data-insights-ai/ui@X.Y.Z` to GitHub Packages. Products pin that number.

1. In the app's `.npmrc`:

   ```
   @data-insights-ai:registry=https://npm.pkg.github.com
   //npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
   ```

   `NODE_AUTH_TOKEN` is a GitHub token with `read:packages`.

2. Add the exact version:

   ```bash
   pnpm add @data-insights-ai/ui@0.34.0
   ```

3. Import the stylesheet once, then components by name:

   ```tsx
   import "@data-insights-ai/ui/styles.css";
   import { Button } from "@data-insights-ai/ui";
   ```

   The stylesheet carries the tokens, the base rules and the woff2 faces. Importing a component pulls in that component and its own stylesheet and leaves the unused components out. The app supplies React 19 or newer (components take `ref` as a prop).

4. Theme the document with `ThemeProvider` from the person's saved choice (`auto`, `light`, `dark`) and write `data-theme="auto"` on `<html>` in the page, so the ground follows the device before the script runs. Offer the choice with `SidebarThemeChoice` in the sidebar's footer; `themeLabels` has its words in English, German and Spanish. The choice is the person's preference on the server, never browser storage.

5. When moving to a later version, read its entry in [`CHANGELOG.md`](../../CHANGELOG.md): it names what changed and what the product has to do, with old → new for every rename. There are no deprecated exports, so a rename is a compile error until it is done.

The components work under a Content-Security-Policy without `'unsafe-inline'` styles: they set colours through element styles, never style elements.
