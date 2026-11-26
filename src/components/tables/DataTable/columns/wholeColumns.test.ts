import { describe, expect, it } from "vitest";
import { wholeColumns } from "./wholeColumns";

const sum = (widths: number[]) => widths.reduce((a, b) => a + b, 0);

describe("wholeColumns", () => {
  it("rounds every column up, so the value that set a column's width fits it", () => {
    const widths = wholeColumns([165.219, 303.766, 92.594, 109.375, 170.859], 1, false);
    expect(widths.filter((_, i) => i !== 1)).toEqual([166, 93, 110, 171]);
  });

  it("takes the pixels the rounding adds from the filling column, so a grid that fits still fits", () => {
    const measured = [165.219, 303.766, 92.594, 109.375, 170.859];
    const widths = wholeColumns(measured, 1, false);
    expect(widths[1]).toBe(301);
    expect(sum(widths)).toBeLessThanOrEqual(sum(measured));
  });

  it("takes them from the widest column when no column fills", () => {
    const measured = [80.4, 240.7, 60.2];
    const widths = wholeColumns(measured, -1, false);
    expect(widths).toEqual([81, 239, 61]);
    expect(sum(widths)).toBeLessThanOrEqual(sum(measured));
  });

  it("lets a grid that scrolls sideways grow by them", () => {
    expect(wholeColumns([80.4, 240.7, 60.2], 1, true)).toEqual([81, 241, 61]);
  });

  it("keeps whole widths as they are", () => {
    expect(wholeColumns([80, 120], -1, false)).toEqual([80, 120]);
  });
});
