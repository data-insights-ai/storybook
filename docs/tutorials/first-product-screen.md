# Your first product screen

You install `@data-insights-ai/ui` in a React app and compose one screen the way every datAInsights product does: a sidebar, the app bar, and a page with a header and a panel. At the end the screen follows the person's theme and passes the token lint.

You need a React 19 app built with Vite or a comparable bundler, and a GitHub token with `read:packages` (the package is on GitHub Packages, not npmjs).

## 1. Install

In the app's `.npmrc`:

```
@data-insights-ai:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

```bash
export NODE_AUTH_TOKEN=<your token>
pnpm add @data-insights-ai/ui@0.34.0
```

Pin the exact version; [`CHANGELOG.md`](../../CHANGELOG.md) says what a later one changes.

## 2. Load the styles once

In the app's entry module, before anything renders:

```tsx
import "@data-insights-ai/ui/styles.css";
```

The stylesheet carries the tokens, the base rules and the fonts. Components are styled from it the moment it loads; nothing has to wrap the tree for them to render.

In `index.html`, give the root the theme attribute so the ground is right before any script runs:

```html
<html lang="en" data-theme="auto">
```

## 3. Theme from the person's choice

`ThemeProvider` sets `data-theme` on the root from a value the app owns (`auto`, `light` or `dark`; `auto` follows the device). Mount it above everything the app draws:

```tsx
import { ThemeProvider } from "@data-insights-ai/ui";

export function App() {
  const theme = "auto"; // later: the person's saved preference
  return (
    <ThemeProvider value={theme}>
      <Screen />
    </ThemeProvider>
  );
}
```

## 4. Compose the shell

The frame is `SidebarProvider` with the `Sidebar`, then `SidebarInset` holding `AppShellBar` and `AppShellContent`. Every visible word is a prop, so the app passes its own strings.

```tsx
import { Gauge, FileText } from "lucide-react";
import {
  AppShellBar,
  AppShellContent,
  Breadcrumb,
  Page,
  PageHeader,
  PageHeaderTitle,
  Panel,
  Sidebar,
  SidebarBrand,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@data-insights-ai/ui";

export function Screen() {
  return (
    <SidebarProvider skipLabel="Skip to content">
      <Sidebar label="Sections" closeLabel="Close navigation">
        <SidebarHeader>
          <SidebarBrand />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Workspace</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton label="Overview" href="/" active>
                  <Gauge />
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton label="Cases" href="/cases">
                  <FileText />
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <AppShellBar>
          <SidebarTrigger label="Toggle navigation" />
          <Breadcrumb label="You are here" items={[{ label: "Overview" }]} />
        </AppShellBar>
        <AppShellContent>
          <Page width="full">
            <PageHeader lede="What needs attention today.">
              <PageHeaderTitle>Overview</PageHeaderTitle>
            </PageHeader>
            <Panel title="Everything is running">Nothing needs you right now.</Panel>
          </Page>
        </AppShellContent>
      </SidebarInset>
    </SidebarProvider>
  );
}
```

Run the app. Narrow the window below 900px: the sidebar becomes a drawer the trigger opens. Switch the device to dark mode: the whole screen follows, because `auto` resolves on the device.

In a single-page app, give `SidebarMenuButton` and `Breadcrumb` items a `render` with the router's link element instead of `href`, so a click does not reload the page: `render={<Link to="/cases" />}`.

## 5. Lint the app's stylesheets

The package ships the token lint the library is held to. Run it over the app's own CSS:

```bash
pnpm exec di-lint-tokens src
```

With no stylesheet of your own yet it reports nothing. When you add one, it fails on a hex colour, a spacing value off the `--di-space-*` ramp, a raw font size or a hand-set radius, which is how an app stays inside the system. [Check a product](../how-to/check-a-product.md) explains the rules and the exceptions.

## Where to go next

[Compose a product screen](../how-to/compose-a-product-screen.md) has the rules for forms, tables, detail pages and keyboard shortcuts; the pattern screens in Storybook (`Patterns/`) show them applied.
