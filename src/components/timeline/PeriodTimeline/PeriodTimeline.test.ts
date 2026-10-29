import { describe, expect, it } from "vitest";
import { needsYear } from "./PeriodTimeline";

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
