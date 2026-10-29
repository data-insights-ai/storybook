import { describe, expect, it } from "vitest";
import { isDateRangeSet, parseDateRange, resolveDateRange, serializeDateRange, weekStartName } from "./dateRange";

describe("resolveDateRange", () => {
  const now = new Date("2026-10-22T10:15:00Z");

  it("counts days from midnight in the zone, not in UTC", () => {
    expect(resolveDateRange({ preset: "7d" }, now, "Europe/Vienna")).toEqual({ from: "2026-10-15T22:00:00.000Z" });
    expect(resolveDateRange({ preset: "7d" }, now, "UTC")).toEqual({ from: "2026-10-16T00:00:00.000Z" });
    expect(resolveDateRange({ preset: "30d" }, now, "America/New_York")).toEqual({ from: "2026-09-23T04:00:00.000Z" });
  });

  it("is the day before in the zone when UTC has already moved on", () => {
    const late = new Date("2026-10-22T02:00:00Z");
    expect(resolveDateRange({ preset: "thisMonth" }, late, "America/Los_Angeles")).toEqual({
      from: "2026-10-01T07:00:00.000Z",
    });
  });

  it("keeps a rolling 24 hours, open at the end", () => {
    expect(resolveDateRange({ preset: "24h" }, now, "Europe/Vienna")).toEqual({ from: "2026-10-21T10:15:00.000Z" });
  });

  it("ends last month where this month starts, across a change of daylight saving time", () => {
    const november = new Date("2026-11-03T12:00:00Z");
    expect(resolveDateRange({ preset: "lastMonth" }, november, "Europe/Vienna")).toEqual({
      from: "2026-09-30T22:00:00.000Z",
      to: "2026-10-31T23:00:00.000Z",
    });
  });

  it("starts last month in the previous year in January", () => {
    expect(resolveDateRange({ preset: "lastMonth" }, new Date("2027-01-10T12:00:00Z"), "UTC")).toEqual({
      from: "2026-12-01T00:00:00.000Z",
      to: "2027-01-01T00:00:00.000Z",
    });
  });

  it("counts a week back over the spring change of daylight saving time by calendar days", () => {
    expect(resolveDateRange({ preset: "7d" }, new Date("2026-03-31T12:00:00Z"), "Europe/Vienna")).toEqual({
      from: "2026-03-24T23:00:00.000Z",
    });
  });

  it("passes a fixed range through as instants", () => {
    expect(resolveDateRange({ from: "2026-10-01T00:00:00+02:00", to: "2026-10-08T00:00:00+02:00" }, now, "UTC")).toEqual(
      { from: "2026-09-30T22:00:00.000Z", to: "2026-10-07T22:00:00.000Z" },
    );
  });
});

describe("URL state", () => {
  it("writes a preset as range and clears from and to", () => {
    expect(serializeDateRange({ preset: "30d" })).toEqual({ range: "30d", from: undefined, to: undefined });
  });

  it("writes a fixed range as from and to and clears range", () => {
    expect(serializeDateRange({ from: "2026-10-01T00:00:00Z" })).toEqual({
      range: undefined,
      from: "2026-10-01T00:00:00.000Z",
      to: undefined,
    });
  });

  it("reads back what it wrote, from an object or URLSearchParams", () => {
    expect(parseDateRange({ range: "thisMonth" })).toEqual({ preset: "thisMonth" });
    expect(parseDateRange(new URLSearchParams("from=2026-10-01T00:00:00Z&to=2026-10-02T00:00:00Z"))).toEqual({
      from: "2026-10-01T00:00:00.000Z",
      to: "2026-10-02T00:00:00.000Z",
    });
  });

  it("reads a hand-edited URL as any time rather than failing", () => {
    expect(parseDateRange({ range: "forever" })).toEqual({});
    expect(parseDateRange({ from: "yesterday" })).toEqual({});
    expect(parseDateRange({ from: "2026-10-02T00:00:00Z", to: "2026-10-01T00:00:00Z" })).toEqual({});
  });

  it("tells whether a period narrows anything", () => {
    expect(isDateRangeSet({})).toBe(false);
    expect(isDateRangeSet({ preset: "24h" })).toBe(true);
    expect(isDateRangeSet({ to: "2026-10-01T00:00:00Z" })).toBe(true);
  });
});

describe("weekStartName", () => {
  it("names the first day of the week from the settings' number", () => {
    expect(weekStartName(0)).toBe("sun");
    expect(weekStartName(1)).toBe("mon");
    expect(weekStartName(6)).toBe("sat");
    expect(weekStartName(7)).toBe("sun");
  });
});
