import { afterEach, describe, expect, it, vi } from "vitest";
import { declaredBars, drawnSeries, seriesColor, seriesOrder, SERIES_STEPS } from "./series";

const series = (n: number) => Array.from({ length: n }, (_, i) => ({ id: `s${i}`, label: `S${i}` }));

describe("series", () => {
  afterEach(() => vi.restoreAllMocks());

  it("gives series i the categorical step i + 1", () => {
    expect(seriesColor(0)).toBe("var(--di-chart-category-1)");
    expect(seriesColor(SERIES_STEPS - 1)).toBe("var(--di-chart-category-6)");
  });

  it("draws every series up to the palette's size without a word", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(drawnSeries(series(SERIES_STEPS), "Timeline")).toHaveLength(SERIES_STEPS);
    expect(warn).not.toHaveBeenCalled();
  });

  it("leaves out a seventh series and says so", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const drawn = drawnSeries(series(SERIES_STEPS + 1), "Timeline");
    expect(drawn.map((s) => s.id)).toEqual(series(SERIES_STEPS).map((s) => s.id));
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("7 series declared, 6 have a colour"));
  });

  it("counts only the declared series in a bar", () => {
    const order = seriesOrder(series(2));
    expect(declaredBars([{ start: 0, end: 1, counts: { s0: 2, s1: 1, other: 9 } }], order)).toEqual([
      { start: 0, end: 1, counts: { s0: 2, s1: 1 } },
    ]);
  });
});
