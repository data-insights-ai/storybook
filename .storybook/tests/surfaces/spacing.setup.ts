import { afterEach, expect } from "vitest";
import { spacingFindings } from "./spacing";

/*
 * Registered before the other checks, so it runs after them, on the page
 * they measured: it adds an off-screen copy of each surface for a moment.
 */
afterEach(async () => {
  // Measured once the faces and the pictures are in: a missing logo or a fallback face sets other boxes.
  await document.fonts.ready;
  await Promise.all([...document.images].map((image) => image.decode().catch(() => undefined)));
  expect(
    spacingFindings(document.body),
    "a surface holds its content at one inset, its parts on the space scale",
  ).toEqual([]);
});
