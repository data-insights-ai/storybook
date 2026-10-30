import { afterEach, expect } from "vitest";
import { markContrast } from "./markContrast";
import { visibleContrast } from "./visibleContrast";

afterEach(async () => {
  // A colour still easing in (a theme just applied, a hover leaving) is measured where it lands.
  const easing = document.getAnimations().filter((animation) => animation instanceof CSSTransition);
  await Promise.all(easing.map((animation) => animation.finished.catch(() => undefined)));
  const findings = await visibleContrast(document.body);
  const lines = findings.map(
    (f) =>
      `${f.element} "${f.text}": ${f.foreground} on ${f.background} is ${f.ratio}:1, needs ${f.expected}:1 (${f.reason})`,
  );
  expect(lines, "visible text below WCAG 1.4.3, or text that cannot be measured").toEqual([]);
  const marks = markContrast(document.body).map(
    (f) => `${f.mark}: ${f.colour} on ${f.against} is ${f.ratio}:1, needs 3:1`,
  );
  expect(marks, "a chart mark below WCAG 1.4.11 against what it sits on").toEqual([]);
});
