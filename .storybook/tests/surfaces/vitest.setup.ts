import { afterEach, expect } from "vitest";
import { canvasFindings } from "./canvas";
import { clearanceFindings, tableEdgeFindings } from "./clearance";
import { nestingFindings } from "./nesting";
import { outlineFindings } from "./outline";
import { trailFindings, underlineFindings } from "./underline";
import { scrollerFindings, widthFindings } from "./width";

// The Foundations pages are documents, not components on a surface.
const documents = /\/src\/foundations\//;

afterEach(() => {
  if (!documents.test(expect.getState().testPath ?? ""))
    expect(canvasFindings(document.body), "content stands on the surface it lives on, not on the bare canvas").toEqual(
      [],
    );
  expect(underlineFindings(document.body), "underline means clickable").toEqual([]);
  expect(trailFindings(document.body), "a trailing arrow only at a block's edge").toEqual([]);
  expect(nestingFindings(document.body), "a surface on the same surface").toEqual([]);
  expect(outlineFindings(document.body), "one outline per object").toEqual([]);
  expect(clearanceFindings(document.body), "text or a control closer than 12px to its surface's edge").toEqual([]);
  expect(tableEdgeFindings(document.body), "a table on a surface: inside its content edge or full bleed").toEqual([]);
  expect(widthFindings(), "a story canvas wider than the viewport").toEqual([]);
  expect(scrollerFindings(document.body), "a grid cut at its frame: the name pinned, the hidden side shaded").toEqual(
    [],
  );
});
