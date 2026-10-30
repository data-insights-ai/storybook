#!/usr/bin/env node
/*
 * Captures the Direction A comparison screens from a running Storybook, in
 * one browser: each screen as Today and Direction A, light and dark, at 1440
 * and 390, plus the open case on a phone.
 *
 * Run: node scripts/direction-a/shots.mjs <storybook-url> <out-dir>
 */
import { mkdirSync } from "node:fs";
import { chromium } from "playwright";

const [base = "http://localhost:4500", out = "dist/direction-a/shots"] = process.argv.slice(2);
mkdirSync(out, { recursive: true });

const screens = [
  ["direction-a-screens-soc-overview--today", "soc-overview-today"],
  ["direction-a-screens-soc-overview--direction-a", "soc-overview-a"],
  ["direction-a-screens-soc-cases--today", "soc-cases-today"],
  ["direction-a-screens-soc-cases--direction-a", "soc-cases-a"],
  ["direction-a-screens-portal-home--today", "portal-home-today"],
  ["direction-a-screens-portal-home--direction-a", "portal-home-a"],
];
const jobs = [];
for (const [id, name] of screens) for (const theme of ["light", "dark"]) for (const width of [1440, 390]) jobs.push({ id, name, theme, width });
for (const theme of ["light", "dark"]) jobs.push({ id: "direction-a-screens-soc-cases--direction-a-phone-detail", name: "soc-case-open-a", theme, width: 390 });

const browser = await chromium.launch();
for (const { id, name, theme, width } of jobs) {
  const phone = width < 600;
  const page = await browser.newPage({ viewport: { width, height: phone ? 844 : 900 }, deviceScaleFactor: phone ? 2 : 1 });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(`${base}/iframe.html?id=${id}&viewMode=story&globals=theme:${theme}`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(600);
  const file = `${out}/${name}-${theme}-${width}.png`;
  await page.screenshot({ path: file, fullPage: true });
  console.log(file, errors.length ? `ERR ${errors.join(" | ")}` : "");
  await page.close();
}
await browser.close();
