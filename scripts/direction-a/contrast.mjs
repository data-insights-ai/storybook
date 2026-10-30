#!/usr/bin/env node
/*
 * Measures WCAG contrast of the Direction A role pairs from the live tokens
 * in a running Storybook, light and dark. Alpha colours are composited over
 * the ground they sit on. Prints JSON; exits 1 when a pair fails.
 *
 * Run: node scripts/direction-a/contrast.mjs <storybook-url> > contrast.json
 */
import { chromium } from "playwright";

const base = process.argv[2] ?? "http://localhost:4500";
const pairs = [
  ["Primary text on ground", "--di-text", "--di-layer-ground", 4.5],
  ["Primary text on surface", "--di-text", "--di-layer-surface", 4.5],
  ["Secondary text on ground", "--di-text-secondary", "--di-layer-ground", 4.5],
  ["Secondary text on surface", "--di-text-secondary", "--di-layer-surface", 4.5],
  ["Secondary text on inset", "--di-text-secondary", "--di-layer-inset", 4.5],
  ["Tertiary (meta) on ground", "--di-text-tertiary", "--di-layer-ground", 4.5],
  ["Tertiary (meta) on surface", "--di-text-tertiary", "--di-layer-surface", 4.5],
  ["Tertiary (meta) on inset", "--di-text-tertiary", "--di-layer-inset", 4.5],
  ["Nav text on chrome", "--di-sidebar-fg", "--di-layer-chrome", 4.5],
  ["Nav muted on chrome", "--di-sidebar-muted", "--di-layer-chrome", 4.5],
  ["Nav text on active item", "--di-sidebar-fg", "--di-sidebar-active", 4.5],
  ["Gold text (one) on surface", "--di-one-ink", "--di-layer-surface", 4.5],
  ["Gold text (one) on ground", "--di-one-ink", "--di-layer-ground", 4.5],
  ["Gold edge on surface (non-text)", "--di-one-edge", "--di-layer-surface", 3],
  ["Action label on action fill", "--di-action-fg", "--di-action-bg", 4.5],
  ["Action fill on ground (non-text)", "--di-action-bg", "--di-layer-ground", 3],
  ["Selection/focus on ground (non-text)", "--di-select", "--di-layer-ground", 3],
  ["Selection/focus on surface (non-text)", "--di-select", "--di-layer-surface", 3],
  ["Selected row text on selection tint", "--di-text", "--di-select-bg", 4.5],
  ["OK text on its tint", "--di-status-ok-fg", "--di-status-ok-bg", 4.5],
  ["Warn (amber) text on its tint", "--di-status-warn-fg", "--di-status-warn-bg", 4.5],
  ["Danger text on its tint", "--di-status-danger-fg", "--di-status-danger-bg", 4.5],
  ["Info text on its tint", "--di-status-recorded-fg", "--di-status-recorded-bg", 4.5],
  ["Critical chip text on tint", "--di-severity-critical-fg", "--di-severity-critical-bg", 4.5],
  ["Severity critical mark on surface", "--di-severity-critical", "--di-layer-surface", 3],
  ["Severity high mark on surface", "--di-severity-high", "--di-layer-surface", 3],
  ["Severity medium mark on surface", "--di-severity-medium", "--di-layer-surface", 3],
  ["Severity low mark on surface", "--di-severity-low", "--di-layer-surface", 3],
  ["Severity info mark on surface", "--di-severity-info", "--di-layer-surface", 3],
  ["Field border on surface (non-text)", "--di-border-input", "--di-layer-surface", 3],
];

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(`${base}/iframe.html?id=direction-a-read-me--proposal&viewMode=story`, { waitUntil: "networkidle" });
const rows = [];
for (const theme of ["light", "dark"]) {
  const out = await page.evaluate(({ pairs, theme }) => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    root.dataset.direction = "a";
    const rgba = (s) => {
      const m = s.match(/[\d.]+/g).map(Number);
      return { r: m[0], g: m[1], b: m[2], a: m.length > 3 ? m[3] : 1 };
    };
    const over = (top, under) => ({
      r: top.r * top.a + under.r * (1 - top.a),
      g: top.g * top.a + under.g * (1 - top.a),
      b: top.b * top.a + under.b * (1 - top.a),
      a: 1,
    });
    const lum = (c) => {
      const f = (v) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
      return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
    };
    const probe = document.createElement("div");
    document.body.append(probe);
    const resolve = (token) => {
      probe.style.color = `var(${token})`;
      return rgba(getComputedStyle(probe).color);
    };
    const hex = (c) => "#" + [c.r, c.g, c.b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");
    const ground = resolve("--di-layer-ground");
    const surface = over(resolve("--di-layer-surface"), ground);
    const result = pairs.map(([label, fg, bg, min]) => {
      const backing = bg === "--di-layer-ground" || bg === "--di-layer-chrome" ? ground : surface;
      const b = over(resolve(bg), backing);
      const f = over(resolve(fg), b);
      const [x, y] = [lum(f), lum(b)];
      const ratio = (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
      return { label, fg: hex(f), bg: hex(b), ratio: Math.round(ratio * 100) / 100, min, pass: ratio >= min };
    });
    probe.remove();
    return result;
  }, { pairs, theme });
  for (const r of out) rows.push({ theme, ...r });
}
await browser.close();
console.log(JSON.stringify(rows, null, 2));
process.exit(rows.every((r) => r.pass) ? 0 : 1);
