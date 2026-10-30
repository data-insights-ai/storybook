import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";

/*
 * Depth is a step in tone, so each step has to be visible: neighbouring
 * zones differ by at least 3 in CIE L*.
 */
const MIN_STEP = 3;

const read = (name: string) => readFileSync(new URL(`./${name}`, import.meta.url), "utf8");

function declarations(block: string) {
  return new Map([...block.matchAll(/(--di-[a-z0-9-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]));
}

function block(css: string, selector: string) {
  const start = css.indexOf(`${selector} {`);
  return css.slice(start, css.indexOf("\n  }", start));
}

const primitives = declarations(read("primitive.css"));
const semantic = read("semantic.css");
const themes = {
  light: declarations(block(semantic, '[data-theme="light"]')),
  dark: declarations(block(semantic, '[data-theme="dark"]')),
};

function resolve(theme: Map<string, string>, token: string): string {
  const value = theme.get(token) ?? primitives.get(token);
  if (!value) throw new Error(`${token} is not defined`);
  const reference = value.match(/^var\((--di-[a-z0-9-]+)\)$/);
  return reference ? resolve(theme, reference[1]) : value;
}

function lightness(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const linear = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  const y = 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
  const f = y > 216 / 24389 ? Math.cbrt(y) : ((24389 / 27) * y + 16) / 116;
  return 116 * f - 16;
}

const ladders = {
  light: ["--di-bg-chrome", "--di-bg-page", "--di-bg-surface"],
  dark: ["--di-bg-chrome", "--di-bg-page", "--di-bg-surface", "--di-bg-hero"],
} as const;

describe.each(Object.entries(ladders))("%s zones", (name, ladder) => {
  const theme = themes[name as keyof typeof themes];
  test.each(ladder.slice(1).map((upper, i) => [ladder[i], upper]))("%s to %s", (lower, upper) => {
    const step = Math.abs(lightness(resolve(theme, upper)) - lightness(resolve(theme, lower)));
    expect(step).toBeGreaterThanOrEqual(MIN_STEP);
  });
});
