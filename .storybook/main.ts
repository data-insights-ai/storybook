import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(ts|tsx)"],
  addons: [
    "@storybook/addon-vitest",
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
    "@storybook/addon-themes",
    "@storybook/addon-mcp",
  ],
  staticDirs: [
    "./public",
    // The manager is a separate page; it gets the same font files the library bundles, served from node_modules.
    { from: "../node_modules/@fontsource/ibm-plex-sans/files", to: "/fonts/ibm-plex-sans" },
    { from: "../node_modules/@fontsource/ibm-plex-mono/files", to: "/fonts/ibm-plex-mono" },
    { from: "../node_modules/@fontsource/space-grotesk/files", to: "/fonts/space-grotesk" },
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  features: {
    sidebarOnboardingChecklist: false,
    menuOnboardingChecklist: false,
    componentsManifest: true,
  },
  core: {
    disableTelemetry: true,
    disableWhatsNewNotifications: true,
  },
};

export default config;
