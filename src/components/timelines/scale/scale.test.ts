import { describe, expect, it } from "vitest";
import { BAR_PX, bucketFor, eventsReadable } from "./resolution";
import { placeLabels, spaceOut } from "./labels";
import { ticksFor, zoneOffset } from "./ticks";
import { clampSpan, MIN_SPAN, panBy, scaleOf, widthOf, zoomAround } from "./viewport";

const bounds = { start: 0, end: 100_000 };

describe("viewport", () => {
  it("keeps the instant under the pointer in place while zooming", () => {
    const view = zoomAround({ start: 20_000, end: 60_000 }, 30_000, 0.5, bounds);
    expect(widthOf(view)).toBe(20_000);
    expect((30_000 - view.start) / widthOf(view)).toBeCloseTo(0.25);
  });

  it("stops at the narrowest view", () => {
    const view = zoomAround({ start: 10_000, end: 13_000 }, 11_000, 0.1, bounds);
    expect(widthOf(view)).toBe(MIN_SPAN);
  });

  it("moves a view back inside instead of squeezing it", () => {
    expect(panBy({ start: 80_000, end: 95_000 }, 20_000, bounds)).toEqual({
      start: 85_000,
      end: 100_000,
    });
    expect(clampSpan({ start: -50_000, end: 200_000 }, bounds)).toEqual(bounds);
  });

  it("maps time to pixels and back", () => {
    const scale = scaleOf({ start: 1_000, end: 3_000 }, 200);
    expect(scale.x(2_000)).toBe(100);
    expect(scale.at(50)).toBe(1_500);
  });
});

describe("resolution", () => {
  it("gives each bar about three pixels, on a round step", () => {
    expect(bucketFor(60_000, 600)).toBe(500);
    expect(bucketFor(3 * 3_600_000, 900)).toBe(60_000);
    expect((3 * 3_600_000) / bucketFor(3 * 3_600_000, 900)).toBeLessThanOrEqual(900 / BAR_PX);
  });

  it("draws events one by one only while no bar is crowded", () => {
    const bar = (danger: number) => ({ start: 0, end: 1, neutral: 0, warn: 0, danger });
    expect(eventsReadable([bar(2), bar(4)])).toBe(true);
    expect(eventsReadable([bar(2), bar(9)])).toBe(false);
  });
});

describe("ticksFor", () => {
  const utc = () => 0;

  it("picks a step whose labels do not touch", () => {
    const ticks = ticksFor({ start: 0, end: 60_000 }, 600, utc);
    expect(ticks[1].at - ticks[0].at).toBe(10_000);
    expect(ticks.every((t) => t.kind !== "time")).toBe(true);
  });

  it("marks midnight in the reader's zone as a day", () => {
    const day = Date.UTC(2026, 9, 14);
    const vienna = zoneOffset("Europe/Vienna");
    expect(vienna(day)).toBe(2 * 3_600_000);
    const ticks = ticksFor({ start: day - 12 * 3_600_000, end: day + 12 * 3_600_000 }, 800, vienna);
    expect(ticks.find((t) => t.kind === "day")?.at).toBe(day - 2 * 3_600_000);
  });
});

describe("labels", () => {
  it("keeps a label that would overprint the one before it quiet", () => {
    const marks = [
      { x: 10, width: 60 },
      { x: 40, width: 60 },
      { x: 80, width: 60 },
    ];
    expect(placeLabels(marks, 300)).toEqual(["right", undefined, "right"]);
  });

  it("turns a label at the right edge to the left of its mark", () => {
    expect(placeLabels([{ x: 280, width: 60 }], 300)).toEqual(["left"]);
  });

  it("keeps items at least the distance apart", () => {
    expect(spaceOut([{ x: 0 }, { x: 5 }, { x: 12 }], 10).map((i) => i.x)).toEqual([0, 12]);
  });
});
