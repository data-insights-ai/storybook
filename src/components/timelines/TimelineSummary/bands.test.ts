import { describe, expect, it } from "vitest";
import { bandsOf } from "./bands";
import type { TimelineEpisode } from "./episodes";

const MIN = 60_000;
const SERIES = [
  { id: "a", label: "A" },
  { id: "b", label: "B" },
  { id: "c", label: "C" },
];
const episode = (counts: Record<string, number>, stretches: TimelineEpisode["stretches"]): TimelineEpisode => ({
  start: 0,
  end: 4 * MIN,
  kind: "steady",
  counts,
  total: Object.values(counts).reduce((n, c) => n + c, 0),
  stretches,
  lanes: [],
});

describe("bandsOf", () => {
  it("gives each series it holds an equal band, stacked from the base in the declared order", () => {
    const bands = bandsOf(
      episode({ c: 1, a: 2 }, [
        { start: 0, end: MIN, series: "c" },
        { start: MIN, end: 4 * MIN, series: "a" },
      ]),
      SERIES,
    );
    expect(bands.map((b) => [b.color, b.left, b.width, b.bottom, b.height])).toEqual([
      ["var(--di-chart-category-3)", "0%", "25%", "50%", "50%"],
      ["var(--di-chart-category-1)", "25%", "75%", "0%", "50%"],
    ]);
  });

  it("leaves out a stretch of a series the caller did not declare", () => {
    const bands = bandsOf(
      episode({ b: 1, x: 5 }, [
        { start: 0, end: MIN, series: "x" },
        { start: 0, end: MIN, series: "b" },
      ]),
      SERIES,
    );
    expect(bands.map((b) => [b.color, b.bottom, b.height])).toEqual([["var(--di-chart-category-2)", "0%", "100%"]]);
  });
});
