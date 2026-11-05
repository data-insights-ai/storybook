#!/usr/bin/env node
/*
 * `pnpm test`: the whole matrix, in one Vitest run. A machine short of memory
 * sets TEST_PAGES in its gitignored .env.local: each project is then a run of
 * its own, because a run keeps every project's browser open until it ends. A
 * failing project does not stop the ones after it.
 */
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";

if (existsSync(".env.local")) process.loadEnvFile(".env.local");

const projects = ["unit", "layout", "storybook", "storybook-dark", "storybook-phone", "storybook-compact"];

const vitest = (names) => {
  const args = ["exec", "vitest", "run", ...names.map((name) => `--project=${name}`), ...process.argv.slice(2)];
  return spawnSync("pnpm", args, { stdio: "inherit" }).status ?? 1;
};

if (!(Number(process.env.TEST_PAGES) > 0)) {
  process.exit(vitest(projects));
}

const failed = projects.filter((name) => vitest([name]) !== 0);
if (failed.length > 0) {
  console.error(`\nFailed: ${failed.join(", ")}`);
  process.exit(1);
}
