import { describe, expect, it } from "vitest";
import { axisRange, fromPeriods, needsYear } from "./PeriodTimeline";

const at = (iso: string) => Date.parse(iso);

describe("needsYear", () => {
  it("leaves the year out within one year and eleven months", () => {
    expect(needsYear(at("2026-01-01"), at("2026-11-30"))).toBe(false);
  });
  it("names it across a year, even for days", () => {
    expect(needsYear(at("2026-12-20"), at("2027-01-10"))).toBe(true);
  });
  it("names it for nearly a year in one year", () => {
    expect(needsYear(at("2026-01-01"), at("2026-12-31"))).toBe(true);
  });
});

describe("axisRange", () => {
  it("takes plain numbers as points on the axis", () => {
    const rows = [
      {
        id: "mon",
        label: "Mon",
        spans: [
          { start: 60, end: 420 },
          { start: 1260, end: 1440 },
        ],
      },
    ];
    expect(axisRange(rows)).toEqual({ start: 60, end: 1440 });
    expect(axisRange(rows, undefined, 0, 1440)).toEqual({ start: 0, end: 1440 });
  });
  it("reads ISO dates and reaches the grace end and the marker", () => {
    const rows = [
      { id: "a", label: "Pro", spans: [{ start: "2026-10-22", end: "2027-05-10", graceEnd: "2027-05-24" }] },
    ];
    expect(axisRange(rows, { at: "2026-10-01" })).toEqual({ start: at("2026-10-01"), end: at("2027-05-24") });
  });
});

describe("fromPeriods", () => {
  it("moves each earlier period onto one row with one span, and today onto the marker", () => {
    const moved = fromPeriods(
      [{ id: "a", label: "Pro", start: "2026-10-22", end: "2027-05-10", tone: "ok", caption: "valid" }],
      "2026-10-22",
      "Today",
    );
    expect(moved.rows).toEqual([
      {
        id: "a",
        label: "Pro",
        caption: "valid",
        spans: [{ start: "2026-10-22", end: "2027-05-10", graceEnd: undefined, tone: "ok" }],
      },
    ]);
    expect(moved.marker).toEqual({ at: "2026-10-22", label: "Today" });
  });
});
