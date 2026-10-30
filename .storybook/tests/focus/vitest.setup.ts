import { afterEach, expect, inject } from "vitest";
import { walkFocus } from "./walk";

/*
 * Registered first, so it runs last: the walk moves focus, opens and closes
 * popups and steps through radio groups, after the other checks measured
 * the story as it was left.
 */
afterEach(async ({ task }) => {
  const findings = await walkFocus();
  if (inject("focusReport")) {
    const { testPath } = expect.getState();
    const where = {
      story: task.name,
      file: testPath,
      theme: document.documentElement.dataset.theme ?? "light",
      density: document.documentElement.dataset.density ?? "comfortable",
      width: innerWidth,
    };
    console.error(`FOCUSRING ${JSON.stringify({ ...where, findings })}`);
    return;
  }
  expect(
    findings.map((f) => `${f.check}: ${f.control}: ${f.detail}`),
    "a focus ring is shown whole, beside no other control, at 3:1, once, and on top",
  ).toEqual([]);
});

declare module "vitest" {
  export interface ProvidedContext {
    focusReport: boolean;
  }
}
