import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, type TestProjectInlineConfiguration } from "vitest/config";
import { playwright } from "@vitest/browser-playwright";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";

const dirname = path.dirname(fileURLToPath(import.meta.url));

// A fresh object per project: Vitest names the instances after the project that owns them.
const chromium = () => ({
  enabled: true,
  headless: true,
  provider: playwright({}),
  instances: [{ browser: "chromium" as const }],
});

/**
 * Every story runs once per theme, so the axe check (`a11y: { test: "error" }`) sees the dark remap as well, and
 * `.storybook/contrast` measures the text axe leaves incomplete.
 * `initialGlobals` pins the toolbar global for the whole project; a story's own `globals` still win.
 * https://storybook.js.org/docs/writing-tests/integrations/vitest-addon
 */
function stories(name: string, theme: "light" | "dark", setupFiles: string[] = []): TestProjectInlineConfiguration {
  return {
    extends: true,
    plugins: [
      storybookTest({
        configDir: path.join(dirname, ".storybook"),
        initialGlobals: { theme },
      }),
    ],
    test: { name, setupFiles: ["./.storybook/contrast/vitest.setup.ts", ...setupFiles], browser: chromium() },
  };
}

/**
 * Stories run as tests in Chromium; plain logic (`*.test.ts`) runs in Node. This is the shape Storybook 10 expects
 * so the testing panel in the sidebar can start Vitest itself.
 */
export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: "unit",
          include: ["src/**/*.test.ts"],
          environment: "node",
        },
      },
      {
        test: {
          name: "layout",
          include: ["src/**/*.browser.test.tsx"],
          browser: chromium(),
        },
      },
      stories("storybook", "light"),
      stories("storybook-dark", "dark", ["./.storybook/vitest.dark.setup.ts"]),
    ],
  },
});
