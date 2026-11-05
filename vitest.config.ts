import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, type TestProjectInlineConfiguration } from "vitest/config";
import type { BrowserCommand } from "vitest/node";
import { playwright } from "@vitest/browser-playwright";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";

const dirname = path.dirname(fileURLToPath(import.meta.url));

/* The real pointer off the page: a story never starts under the hover an earlier one left (vitest.pointer.setup.ts). */
const parkPointer: BrowserCommand<[]> = async ({ page }) => {
  await page.mouse.move(-1, -1);
};

/*
 * Vitest gives every browser project its own Chromium with a page per core, all at once. A machine short of memory sets
 * TEST_PAGES in its gitignored .env.local: one project runs at a time, on that many pages.
 */
const localEnv = path.join(dirname, ".env.local");
if (existsSync(localEnv)) process.loadEnvFile(localEnv);
const pages = Number(process.env.TEST_PAGES);
const paced = (order: number) => (pages > 0 ? { maxWorkers: pages, sequence: { groupOrder: order } } : {});

// A fresh object per project: Vitest names the instances after the project that owns them.
const chromium = () => ({
  enabled: true,
  headless: true,
  provider: playwright({}),
  instances: [{ browser: "chromium" as const }],
});

type Check = "focus" | "contrast" | "surfaces";

const checkFiles: Record<Check, string[]> = {
  focus: ["./.storybook/tests/focus/vitest.setup.ts"],
  contrast: ["./.storybook/tests/contrast/vitest.setup.ts"],
  surfaces: ["./.storybook/tests/surfaces/spacing.setup.ts", "./.storybook/tests/surfaces/vitest.setup.ts"],
};

/**
 * A test matrix: each check runs in the passes where it can find something. Colour (contrast, axe) runs light and dark;
 * layout (surfaces) runs desk, phone and compact; the focus walk runs desk and phone, where layouts collide differently.
 * A pass in dark clears the root theme before each story and checks it is dark after (vitest.dark.setup.ts).
 * `initialGlobals` pins the toolbar globals for the whole project; a story's own `globals` still win.
 * https://storybook.js.org/docs/writing-tests/integrations/vitest-addon
 */
function stories(
  name: string,
  order: number,
  pass: {
    theme: "light" | "dark";
    viewport?: "phone";
    density?: "comfortable" | "compact";
    checks: Check[];
    axe: boolean;
  },
): TestProjectInlineConfiguration {
  return {
    extends: true,
    plugins: [
      storybookTest({
        configDir: path.join(dirname, ".storybook"),
        initialGlobals: {
          theme: pass.theme,
          density: pass.density ?? "comfortable",
          ...(pass.viewport ? { viewport: { value: pass.viewport, isRotated: false } } : {}),
          ...(pass.axe ? {} : { a11y: { manual: true } }),
        },
      }),
    ],
    test: {
      name,
      ...paced(order),
      // FOCUS_REPORT=1 prints the focus-ring findings per story instead of failing on them.
      provide: { focusReport: process.env.FOCUS_REPORT === "1" },
      setupFiles: [
        ...(pass.checks.includes("focus") ? checkFiles.focus : []),
        "./.storybook/tests/vitest.pointer.setup.ts",
        ...pass.checks.filter((check) => check !== "focus").flatMap((check) => checkFiles[check]),
        ...(pass.theme === "dark" ? ["./.storybook/tests/vitest.dark.setup.ts"] : []),
      ],
      browser: { ...chromium(), commands: { parkPointer } },
    },
  };
}

/**
 * Stories run as tests in Chromium; plain logic (`*.test.ts`) runs in Node. This is the shape Storybook 10 expects
 * so the testing panel in the sidebar can start Vitest itself.
 */
export default defineConfig({
  // The lazy chunks (the phone drawer, the rail tooltip) are transformed up front: on a busy run their first
  // transform mid-story outlasted the play's wait.
  server: {
    warmup: {
      clientFiles: [
        "./src/components/navigation/Sidebar/frame/SidebarDrawer.tsx",
        "./src/components/navigation/Sidebar/menu/SidebarRailTooltip.tsx",
      ],
    },
  },
  test: {
    projects: [
      {
        test: {
          name: "unit",
          ...paced(0),
          include: ["src/**/*.test.ts"],
          environment: "node",
          // zones.test.ts reads the token sheets as text; unprocessed CSS would arrive empty.
          css: { include: [/tokens\/.+\.css/] },
        },
      },
      {
        test: {
          name: "layout",
          ...paced(1),
          include: ["src/**/*.browser.test.tsx", ".storybook/**/*.browser.test.ts"],
          browser: chromium(),
        },
      },
      stories("storybook", 2, { theme: "light", checks: ["focus", "contrast", "surfaces"], axe: true }),
      stories("storybook-dark", 3, { theme: "dark", checks: ["contrast"], axe: true }),
      stories("storybook-phone", 4, {
        theme: "light",
        viewport: "phone",
        checks: ["focus", "contrast", "surfaces"],
        axe: true,
      }),
      stories("storybook-compact", 5, { theme: "light", density: "compact", checks: ["surfaces"], axe: false }),
    ],
  },
});
