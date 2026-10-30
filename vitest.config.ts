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
 * Every story runs once per theme, and again at phone width (390px) in both, so the axe check (`a11y: { test: "error" }`) sees the dark remap as well, and
 * `.storybook/tests/contrast` measures every visible text where it is painted.
 * `initialGlobals` pins the toolbar global for the whole project; a story's own `globals` still win.
 * https://storybook.js.org/docs/writing-tests/integrations/vitest-addon
 */
function stories(
  name: string,
  theme: "light" | "dark",
  setupFiles: string[] = [],
  viewport?: "phone",
): TestProjectInlineConfiguration {
  return {
    extends: true,
    plugins: [
      storybookTest({
        configDir: path.join(dirname, ".storybook"),
        initialGlobals: viewport ? { theme, viewport: { value: viewport, isRotated: false } } : { theme },
      }),
    ],
    test: { name, setupFiles: ["./.storybook/tests/contrast/vitest.setup.ts", ...setupFiles], browser: chromium() },
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
          // zones.test.ts reads the token sheets as text; unprocessed CSS would arrive empty.
          css: { include: [/tokens\/.+\.css/] },
        },
      },
      {
        test: {
          name: "layout",
          include: ["src/**/*.browser.test.tsx", ".storybook/**/*.browser.test.ts"],
          browser: chromium(),
        },
      },
      stories("storybook", "light"),
      stories("storybook-dark", "dark", ["./.storybook/tests/vitest.dark.setup.ts"]),
      stories("storybook-phone", "light", [], "phone"),
      stories("storybook-phone-dark", "dark", ["./.storybook/tests/vitest.dark.setup.ts"], "phone"),
    ],
  },
});
