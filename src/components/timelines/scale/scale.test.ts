import { describe, expect, it } from "vitest";
import { BAR_PX, bucketFor, eventsReadable } from "./resolution";
import { placeLabels, spaceOut } from "./labels";
import { ticksAcross, ticksFor, zoneOffset } from "./ticks";
import { activityOf, BREAK_PX, brokenScaleOf, drawnWidth, gapsBetween } from "./breaks";
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
    const bar = (count: number) => ({ start: 0, end: 1, counts: { a: count - 1, b: 1 } });
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

describe("broken axis", () => {
  const HOUR = 3_600_000;
  const DAY = 24 * HOUR;
  const bar = (start: number, end: number, count = 1) => ({ start, end, counts: { a: count } });

  it("finds the quiet stretches between activity, not before the first or after the last", () => {
    expect(
      gapsBetween([
        { start: 10, end: 20 },
        { start: 15, end: 30 },
        { start: 50, end: 50 },
        { start: 90, end: 95 },
      ]),
    ).toEqual([
      { start: 30, end: 50 },
      { start: 50, end: 90 },
    ]);
  });

  it("takes the view's bars where they reach and the overview's beyond them", () => {
    const active = activityOf([bar(100, 110), bar(110, 120, 0)], [bar(0, 200), bar(200, 400, 0)], [500]);
    expect(active).toEqual([
      expect.objectContaining({ start: 100, end: 110 }),
      { start: 0, end: 100 },
      { start: 110, end: 200 },
      { start: 500, end: 500 },
    ]);
  });

  it("draws a stretch as it is up to a quarter of the plot and as a break from three tenths, with no jump between", () => {
    expect(drawnWidth(100, 1000)).toBe(100);
    expect(drawnWidth(250, 1000)).toBe(250);
    expect(drawnWidth(300, 1000)).toBe(BREAK_PX);
    expect(drawnWidth(900, 1000)).toBe(BREAK_PX);
    const steps = Array.from({ length: 101 }, (_, i) => drawnWidth(240 + i * 0.7, 1000));
    expect(Math.max(...steps.slice(1).map((d, i) => Math.abs(d - steps[i])))).toBeLessThan(4);
  });

  it("folds a long quiet stretch into a break and keeps one rate either side", () => {
    const view = { start: 0, end: 4 * DAY };
    const quiet = { start: 6 * HOUR, end: 3 * DAY + 18 * HOUR };
    const scale = brokenScaleOf(view, 1000, [quiet]);
    expect(scale.breaks).toHaveLength(1);
    const [b] = scale.breaks;
    expect(b.to - b.from).toBe(BREAK_PX);
    expect(scale.x(quiet.start)).toBeCloseTo(b.from);
    expect(scale.x(quiet.end)).toBeCloseTo(b.to);
    expect(scale.x(view.end)).toBeCloseTo(1000);
    expect(scale.x(HOUR) - scale.x(0)).toBeCloseTo(scale.x(view.end) - scale.x(view.end - HOUR));
    for (const ms of [HOUR, quiet.start + DAY, view.end - HOUR]) expect(scale.at(scale.x(ms))).toBeCloseTo(ms, 3);
  });

  it("leaves a short quiet stretch, and a view that is nearly all quiet, at one rate", () => {
    expect(brokenScaleOf({ start: 0, end: 100 }, 1000, [{ start: 40, end: 50 }]).breaks).toEqual([]);
    expect(brokenScaleOf({ start: 0, end: 100 }, 1000, [{ start: -10, end: 99 }]).breaks).toEqual([]);
  });

  it("puts ticks on each side of a break and none inside it", () => {
    const view = { start: 0, end: 4 * DAY };
    const quiet = { start: 6 * HOUR, end: 3 * DAY + 18 * HOUR };
    const scale = brokenScaleOf(view, 1000, [quiet]);
    const ticks = ticksAcross(view, 1000, scale.breaks, () => 0);
    expect(ticks.some((t) => t.at < quiet.start)).toBe(true);
    expect(ticks.some((t) => t.at > quiet.end)).toBe(true);
    expect(ticks.filter((t) => t.at > quiet.start && t.at < quiet.end)).toEqual([]);
    expect(ticks.length).toBeGreaterThan(ticksFor(view, 1000, () => 0).length / 2);
  });
});
