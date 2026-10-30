#!/usr/bin/env node
/*
 * Captures the Direction A comparison screens from a running Storybook, in
 * one browser: each screen as Today and Direction A (the portal home in its
 * five states), the variant stories the summary compares, light and dark
 * (the gold-in-daylight variants light only), at 1440 and 390, plus the
 * open case on a phone.
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
  ["direction-a-screens-portal-home--all-running-owner", "portal-home-a-running"],
  ["direction-a-screens-portal-home--decision-due-owner", "portal-home-a-due"],
  ["direction-a-screens-portal-home--administrator", "portal-home-a-admin"],
  ["direction-a-screens-portal-home--billing-administrator", "portal-home-a-billing"],
  ["direction-a-screens-portal-home--member", "portal-home-a-member"],
  ["direction-a-variants--header-hc", "variant-header-c"],
  ["direction-a-variants--header-ha", "variant-header-a"],
  ["direction-a-variants--header-hb", "variant-header-b"],
  ["direction-a-variants--body-plex-case", "variant-body-plex-case"],
  ["direction-a-variants--body-grotesk-case", "variant-body-grotesk-case"],
  ["direction-a-variants--body-plex-portal", "variant-body-plex-portal"],
  ["direction-a-variants--body-grotesk-portal", "variant-body-grotesk-portal"],
  ["direction-a-variants--figures-hero-footer", "variant-figures-hero"],
  ["direction-a-variants--figures-strip", "variant-figures-strip"],
  ["direction-a-variants--gold-g-1-overview", "variant-gold-1-overview", ["light"]],
  ["direction-a-variants--gold-g-2-overview", "variant-gold-2-overview", ["light"]],
  ["direction-a-variants--gold-g-3-overview", "variant-gold-3-overview", ["light"]],
  ["direction-a-variants--gold-g-1-case", "variant-gold-1-case", ["light"]],
  ["direction-a-variants--gold-g-2-case", "variant-gold-2-case", ["light"]],
  ["direction-a-variants--gold-g-3-case", "variant-gold-3-case", ["light"]],
];
const jobs = [];
for (const [id, name, themes = ["light", "dark"]] of screens) for (const theme of themes) for (const width of [1440, 390]) jobs.push({ id, name, theme, width });
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
