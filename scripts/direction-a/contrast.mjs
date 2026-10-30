#!/usr/bin/env node
/*
 * Measures WCAG contrast of the Direction A role pairs from the live tokens
 * in a running Storybook, light and dark. Alpha colours are composited over
 * the ground they sit on. Pairs marked "hero" are resolved inside the navy
 * hero zone, which keeps its dark values in both themes; pairs marked
 * "light" or "dark" are measured in that theme only. The zone steps
 * (chrome, ground, list pane, selected row) are measured as the difference
 * in CIE L*, which should be at least 3 to read on an office monitor.
 * Prints JSON; exits 1 when a pair or a step fails.
 *
 * Run: node scripts/direction-a/contrast.mjs <storybook-url> > contrast.json
 */
import { chromium } from "playwright";

const base = process.argv[2] ?? "http://localhost:4500";
const steps = [
  ["Sidebar chrome / page ground", "--di-layer-chrome", "--di-layer-ground"],
  ["Page ground / list pane", "--di-layer-ground", "--di-layer-pane"],
  ["List pane / selected row", "--di-layer-pane", "--di-select-bg"],
];
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
  ["One-thing text (navy by day, gold after dark) on surface", "--di-one-ink", "--di-layer-surface", 4.5],
  ["One-thing text (navy by day, gold after dark) on ground", "--di-one-ink", "--di-layer-ground", 4.5],
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
  ["Severity medium mark on ground", "--di-severity-medium", "--di-layer-ground", 3],
  ["Figure label on tonal strip", "--di-text-secondary", "--di-layer-strip", 4.5],
  ["Figure note on tonal strip", "--di-text-tertiary", "--di-layer-strip", 4.5],
  ["Warn figure value on tonal strip", "--di-status-warn-fg", "--di-layer-strip", 4.5],
  ["Hero footer label on hero", "--di-text-secondary", "--di-layer-hero-solid", 4.5, "hero"],
  ["Hero footer note on hero", "--di-text-tertiary", "--di-layer-hero-solid", 4.5, "hero"],
  ["Hero footer value on hero", "--di-text", "--di-layer-hero-solid", 4.5, "hero"],
  ["Warn figure value on hero", "--di-status-warn-fg", "--di-layer-hero-solid", 4.5, "hero"],
  ["Severity medium mark on hero", "--di-severity-medium", "--di-layer-hero-solid", 3, "hero"],
  ["Primary text on list pane", "--di-text", "--di-layer-pane", 4.5],
  ["Tertiary (meta) on list pane", "--di-text-tertiary", "--di-layer-pane", 4.5],
  ["Selected row text on selection over pane", "--di-text", "--di-select-bg", 4.5, "pane"],
  ["Selected row edge on selection over pane (non-text)", "--di-select", "--di-select-bg", 3, "pane"],
  ["“Start here” label on its pill", "--di-one-label-fg", "--di-one-label-bg", 4.5],
  ["Gold rank bar on surface (non-text)", "--di-one-rank-bar", "--di-layer-surface", 3, "light"],
  ["Gold edge on ground (non-text)", "--di-one-edge", "--di-layer-ground", 3, "light"],
];

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(`${base}/iframe.html?id=direction-a-variants--gold-g-2-overview&viewMode=story`, { waitUntil: "networkidle" });
const rows = [];
for (const theme of ["light", "dark"]) {
  const out = await page.evaluate(({ pairs, steps, theme }) => {
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
    const heroZone = document.createElement("div");
    heroZone.dataset.theme = "dark";
    const heroProbe = document.createElement("div");
    heroZone.append(heroProbe);
    document.body.append(probe, heroZone);
    const resolve = (token, zone) => {
      const el = zone === "hero" ? heroProbe : probe;
      el.style.color = `var(${token})`;
      return rgba(getComputedStyle(el).color);
    };
    const hex = (c) => "#" + [c.r, c.g, c.b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");
    const lstar = (c) => {
      const y = lum(c);
      return y > 0.008856 ? 116 * Math.cbrt(y) - 16 : 903.3 * y;
    };
    const result = pairs.filter(([, , , , zone]) => zone !== (theme === "light" ? "dark" : "light")).map(([label, fg, bg, min, zone]) => {
      const ground = resolve("--di-layer-ground", zone);
      const surface = over(resolve("--di-layer-surface", zone), ground);
      const pane = over(resolve("--di-layer-pane", zone), ground);
      const backing = zone === "pane" ? pane : ["--di-layer-ground", "--di-layer-chrome", "--di-layer-strip"].includes(bg) ? ground : surface;
      const b = over(resolve(bg, zone), backing);
      const f = over(resolve(fg, zone), b);
      const [x, y] = [lum(f), lum(b)];
      const ratio = (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
      return { label, fg: hex(f), bg: hex(b), ratio: Math.round(ratio * 100) / 100, min, pass: ratio >= min };
    });
    const ground = resolve("--di-layer-ground");
    for (const [label, lower, upper] of steps) {
      const below = over(resolve(lower), ground);
      const above = over(resolve(upper), below);
      const delta = Math.abs(lstar(above) - lstar(below));
      result.push({ label: `Zone step · ${label} (ΔL*)`, fg: hex(above), bg: hex(below), ratio: Math.round(delta * 100) / 100, min: 3, pass: delta >= 3 });
    }
    probe.remove();
    heroZone.remove();
    return result;
  }, { pairs, steps, theme });
  for (const r of out) rows.push({ theme, ...r });
}
await browser.close();
console.log(JSON.stringify(rows, null, 2));
process.exit(rows.every((r) => r.pass) ? 0 : 1);
