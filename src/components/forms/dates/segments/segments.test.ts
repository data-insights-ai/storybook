import { describe, expect, it } from "vitest";
import { segmentLayout } from "./segmentLayout";
import { eraseDigit, limitsOf, step, textOf, typeDigit, valuesOf, withShown, without } from "./segmentModel";

const order = (locale: string, kind: "date" | "time") =>
  segmentLayout(locale, kind)
    .parts.map((part) => (part.type === "literal" ? part.text : part.type))
    .join("");

describe("segmentLayout", () => {
  it("orders the segments as the locale writes them", () => {
    expect(order("en-GB", "date")).toBe("day/month/year");
    expect(order("en-US", "date")).toBe("month/day/year");
    expect(order("de-DE", "date")).toBe("day.month.year");
    expect(order("es-ES", "date")).toBe("day/month/year");
    expect(order("en-GB", "time")).toBe("hour:minute");
    expect(order("en-US", "time")).toMatch(/^hour:minute\s+dayPeriod$/);
  });

  it("derives placeholders from the localized field names", () => {
    const placeholder = (locale: string) => {
      const { placeholders } = segmentLayout(locale, "date");
      return [placeholders.day, placeholders.month, placeholders.year];
    };
    expect(placeholder("en-GB")).toEqual(["dd", "mm", "yyyy"]);
    expect(placeholder("de-DE")).toEqual(["TT", "MM", "JJJJ"]);
    expect(placeholder("es-ES")).toEqual(["dd", "mm", "aaaa"]);
    expect(segmentLayout("de-DE", "time").placeholders.hour).toBe("––");
  });

  it("names the segments in the locale's language", () => {
    expect(segmentLayout("de-DE", "date").names).toMatchObject({ day: "Tag", month: "Monat", year: "Jahr" });
    expect(segmentLayout("es-ES", "date").names).toMatchObject({ day: "día", month: "mes", year: "año" });
    expect(segmentLayout("de-DE", "time").monthName(10)).toBe("Oktober");
    expect(segmentLayout("en-US", "time").hour12).toBe(true);
    expect(segmentLayout("de-DE", "time").hour12).toBe(false);
  });
});

describe("segment values", () => {
  it("reads and writes ISO days and times, and nothing else", () => {
    expect(valuesOf("date", "2026-10-29")).toEqual({ year: 2026, month: 10, day: 29 });
    expect(valuesOf("date", "2026-02-30")).toEqual({});
    expect(valuesOf("time", "18:30")).toEqual({ hour: 18, minute: 30, dayPeriod: 1 });
    expect(textOf("date", { year: 2026, month: 3, day: 5 })).toBe("2026-03-05");
    expect(textOf("date", { year: 2026, month: 3 })).toBe("");
    expect(textOf("time", { hour: 9, minute: 5, dayPeriod: 0 })).toBe("09:05");
  });

  it("keeps the day inside a shorter month", () => {
    expect(withShown("month", 2, { year: 2026, month: 1, day: 31 }, false)).toEqual({ year: 2026, month: 2, day: 28 });
    expect(limitsOf("day", { year: 2024, month: 2 }, false)).toEqual({ min: 1, max: 29 });
  });

  it("moves the hour between the halves of the day with AM and PM", () => {
    expect(withShown("dayPeriod", 1, { hour: 6, minute: 30, dayPeriod: 0 }, true)).toEqual({
      hour: 18,
      minute: 30,
      dayPeriod: 1,
    });
    expect(withShown("hour", 12, { dayPeriod: 0 }, true)).toEqual({ hour: 0, dayPeriod: 0 });
    expect(without("dayPeriod", { hour: 18, minute: 30, dayPeriod: 1 })).toEqual({ hour: 18, minute: 30 });
    expect(textOf("time", { hour: 18, minute: 30 })).toBe("");
  });
});

describe("typing and stepping", () => {
  it("waits for a second digit while one could follow", () => {
    expect(typeDigit("", "0", { min: 1, max: 31 })).toEqual({ buffer: "0", advance: false });
    expect(typeDigit("0", "3", { min: 1, max: 31 })).toEqual({ shown: 3, buffer: "", advance: true });
    expect(typeDigit("", "4", { min: 1, max: 31 })).toEqual({ shown: 4, buffer: "", advance: true });
    expect(typeDigit("3", "5", { min: 1, max: 31 })).toEqual({ shown: 5, buffer: "", advance: true });
    expect(typeDigit("", "0", { min: 0, max: 23 })).toEqual({ shown: 0, buffer: "0", advance: false });
    expect(typeDigit("202", "6", { min: 1, max: 9999 })).toEqual({ shown: 2026, buffer: "", advance: true });
  });

  it("takes digits off with Backspace until the segment is empty", () => {
    expect(eraseDigit("29")).toEqual({ shown: 2, buffer: "2" });
    expect(eraseDigit("2")).toEqual({ buffer: "" });
    expect(eraseDigit("05")).toEqual({ buffer: "" });
  });

  it("wraps at the ends and starts an empty segment where it is told", () => {
    expect(step(31, 1, { min: 1, max: 31 }, 1)).toBe(1);
    expect(step(0, -1, { min: 0, max: 23 }, 0)).toBe(23);
    expect(step(undefined, 1, { min: 1, max: 12 }, 10)).toBe(10);
  });
});
