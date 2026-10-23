import { parseDate, Time } from "@internationalized/date";
import { describe, expect, it } from "vitest";
import { openEndedRange, parseTypedDate, typedDraft } from "./dateRangeDraft";

describe("typed dates", () => {
  it("reads a whole day and nothing else, without throwing", () => {
    expect(parseTypedDate("2026-10-03")?.toString()).toBe("2026-10-03");
    for (const text of ["", "2026", "2026-10", "2026-1-3", "2026-02-30", "2026-13-01", "03.10.2026", "garbage"]) {
      expect(parseTypedDate(text)).toBeNull();
    }
  });

  it("is incomplete until both ends are days, and reversed when the end comes first", () => {
    expect(typedDraft({ from: "2026-10-03", to: "", openEnd: false }).state).toBe("incomplete");
    expect(typedDraft({ from: "2026-10", to: "2026-10-05", openEnd: false }).state).toBe("incomplete");
    expect(typedDraft({ from: "2026-10-05", to: "2026-10-03", openEnd: false }).state).toBe("reversed");
    const one = typedDraft({ from: "2026-10-03", to: "2026-10-03", openEnd: false });
    expect(one.state === "ready" && one.start.toString() === one.end.toString()).toBe(true);
  });

  it("needs only the first day when the range is open-ended", () => {
    const draft = typedDraft({ from: "2026-10-03", to: "not read", openEnd: true });
    expect(draft.state).toBe("ready");
  });

  it("applies an open end from the first day, at its time when one is set", () => {
    expect(openEndedRange(parseDate("2026-10-03"), null, "UTC")).toEqual({ from: "2026-10-03T00:00:00.000Z" });
    expect(openEndedRange(parseDate("2026-10-03"), new Time(9, 30), "Europe/Vienna")).toEqual({
      from: "2026-10-03T07:30:00.000Z",
    });
  });
});
