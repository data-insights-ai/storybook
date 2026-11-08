import { describe, expect, it } from "vitest";
import { periodOf, periodSearch } from "./dateRange";

const lastWeek = { preset: "7d" } as const;

describe("a list's period with a default", () => {
  it("reads nothing set as the default and range=all as any time chosen", () => {
    expect(periodOf({}, lastWeek)).toEqual(lastWeek);
    expect(periodOf(new URLSearchParams(""), lastWeek)).toEqual(lastWeek);
    expect(periodOf({ range: "all" }, lastWeek)).toEqual({});
    expect(periodOf({ range: "30d" }, lastWeek)).toEqual({ preset: "30d" });
  });

  it("keeps any time chosen in the URL only when the default is a period", () => {
    expect(periodSearch({}, lastWeek)).toEqual({ range: "all", from: undefined, to: undefined });
    expect(periodSearch({})).toEqual({ range: undefined, from: undefined, to: undefined });
    expect(periodOf(periodSearch({}, lastWeek) as Record<string, unknown>, lastWeek)).toEqual({});
  });
});
