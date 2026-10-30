import { afterEach, expect } from "vitest";
import { clearanceFindings } from "./clearance";
import { nestingFindings } from "./nesting";
import { outlineFindings } from "./outline";
import { underlineFindings } from "./underline";

afterEach(() => {
  expect(underlineFindings(document.body), "underline means clickable").toEqual([]);
  expect(nestingFindings(document.body), "a surface on the same surface").toEqual([]);
  expect(outlineFindings(document.body), "one outline per object").toEqual([]);
  expect(clearanceFindings(document.body), "text or a control closer than 12px to its surface's edge").toEqual([]);
});
