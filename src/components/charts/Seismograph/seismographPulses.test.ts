import { describe, expect, it } from "vitest";
import { bucketEnd, peaks, pulses, stepSelection, tickStride, type SeismographPoint } from "./seismographPulses";

const day = (d: number, above: number, below = 0): SeismographPoint => ({
  at: `2026-10-0${d}T00:00:00Z`,
  above,
  below,
});

describe("seismograph", () => {
  it("ends a period at its until, the next start, or as long as the one before", () => {
    const points = [day(1, 1), day(2, 2), { ...day(4, 3), until: "2026-10-04T06:00:00Z" }, day(6, 1)];
    expect(bucketEnd(points, 0)).toBe(Date.parse("2026-10-02T00:00:00Z"));
    expect(bucketEnd(points, 2)).toBe(Date.parse("2026-10-04T06:00:00Z"));
    expect(bucketEnd(points, 3) - Date.parse(points[3].at)).toBe(Date.parse(points[3].at) - Date.parse(points[2].at));
    expect(bucketEnd([day(1, 1)], 0) - Date.parse(day(1, 1).at)).toBe(86_400_000);
  });

  it("draws one pulse per period, up for above and down for below, peaking in its middle", () => {
    const traced = pulses([day(1, 10, 4)]);
    expect(traced).toHaveLength(5);
    expect(Math.max(...traced.map((p) => p.above))).toBe(10);
    expect(Math.min(...traced.map((p) => p.below))).toBe(-4);
    expect(traced[0].above).toBe(0);
    expect(traced[2].x).toBe(Date.parse(day(1, 0).at) + 43_200_000);
  });

  it("labels the highest periods, spaced apart, never an empty one", () => {
    const points = [day(1, 5), day(2, 90), day(3, 80), day(4, 0), day(5, 120), day(6, 1), day(7, 2), day(8, 3)];
    expect(peaks(points, 3)).toEqual([4, 1, 7]);
    expect(peaks(points, 1)).toEqual([4]);
    expect(peaks([day(1, 0)], 3)).toEqual([]);
  });

  it("labels the time axis about every 150 px", () => {
    expect(tickStride(30, 1500)).toBe(3);
    expect(tickStride(5, 1500)).toBe(1);
    expect(tickStride(30, 200)).toBe(15);
  });

  it("moves the selection with arrows, pages, Home and End, within the periods", () => {
    expect(stepSelection(-1, 5, "ArrowRight")).toBe(0);
    expect(stepSelection(-1, 5, "ArrowLeft")).toBe(4);
    expect(stepSelection(4, 5, "ArrowRight")).toBe(4);
    expect(stepSelection(0, 5, "ArrowLeft")).toBe(0);
    expect(stepSelection(2, 30, "PageUp")).toBe(5);
    expect(stepSelection(2, 30, "PageDown")).toBe(0);
    expect(stepSelection(2, 5, "Home")).toBe(0);
    expect(stepSelection(2, 5, "End")).toBe(4);
    expect(stepSelection(2, 5, "Enter")).toBeNull();
    expect(stepSelection(-1, 0, "ArrowRight")).toBeNull();
  });
});
