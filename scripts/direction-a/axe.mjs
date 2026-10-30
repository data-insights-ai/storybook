#!/usr/bin/env node
/*
 * Runs axe-core on every story tagged "direction:a" in a running Storybook,
 * light and dark, at 1440 and 390, in one browser. The "region" rule is
 * off, as Storybook's own check has it, because a story is a fragment.
 * Prints JSON (one entry per story, theme and width with its violations);
 * exits 1 when any violation is found.
 *
 * Run: node scripts/direction-a/axe.mjs <storybook-url> [story-id filter] > axe.json
 */
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { chromium } from "playwright";

const [base = "http://localhost:4500", only = ""] = process.argv.slice(2);
const require = createRequire(createRequire(import.meta.url).resolve("@storybook/addon-a11y/package.json"));
const axeSource = readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");

const index = await (await fetch(`${base}/index.json`)).json();
const stories = Object.values(index.entries).filter((e) => e.type === "story" && (e.tags ?? []).includes("direction:a") && e.id.includes(only));

const browser = await chromium.launch();
const results = [];
for (const width of [1440, 390]) {
  const page = await browser.newPage({ viewport: { width, height: width < 600 ? 844 : 900 } });
  for (const story of stories) {
    for (const theme of ["light", "dark"]) {
      await page.goto(`${base}/iframe.html?id=${story.id}&viewMode=story&globals=theme:${theme}`, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(300);
      await page.addScriptTag({ content: axeSource });
      const violations = await page.evaluate(async () => {
        const r = await window.axe.run(document, { rules: { region: { enabled: false } }, iframes: false });
        return r.violations.map((v) => ({ id: v.id, impact: v.impact, help: v.help, targets: v.nodes.map((n) => n.target.join(" ")).slice(0, 5) }));
      });
      results.push({ id: story.id, theme, width, violations });
      console.error(`${story.id} ${theme} ${width}: ${violations.length}`);
    }
  }
  await page.close();
}
await browser.close();
console.log(JSON.stringify(results, null, 2));
process.exit(results.some((r) => r.violations.length) ? 1 : 0);
