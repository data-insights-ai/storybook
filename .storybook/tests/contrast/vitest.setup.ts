import { afterEach, expect } from "vitest";
import { visibleContrast } from "./visibleContrast";

afterEach(async () => {
  const findings = await visibleContrast(document.body);
  const lines = findings.map(
    (f) =>
      `${f.element} "${f.text}": ${f.foreground} on ${f.background} is ${f.ratio}:1, needs ${f.expected}:1 (${f.reason})`,
  );
  expect(lines, "visible text below WCAG 1.4.3, or text that cannot be measured").toEqual([]);
});
