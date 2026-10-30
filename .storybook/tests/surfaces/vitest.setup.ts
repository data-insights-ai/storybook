import { afterEach, expect } from "vitest";
import { clearanceFindings, tableEdgeFindings } from "./clearance";
import { nestingFindings } from "./nesting";
import { outlineFindings } from "./outline";
import { trailFindings, underlineFindings } from "./underline";
import { widthFindings } from "./width";

afterEach(() => {
  expect(underlineFindings(document.body), "underline means clickable").toEqual([]);
  expect(trailFindings(document.body), "a trailing arrow only at a block's edge").toEqual([]);
  expect(nestingFindings(document.body), "a surface on the same surface").toEqual([]);
  expect(outlineFindings(document.body), "one outline per object").toEqual([]);
  expect(clearanceFindings(document.body), "text or a control closer than 12px to its surface's edge").toEqual([]);
  expect(tableEdgeFindings(document.body), "a table on a surface: inside its content edge or full bleed").toEqual([]);
  expect(widthFindings(), "a story canvas wider than the viewport").toEqual([]);
});
