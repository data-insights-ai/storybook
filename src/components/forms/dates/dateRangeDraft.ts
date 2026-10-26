import { type CalendarDate, type Time, parseDate, toCalendarDateTime, toZoned } from "@internationalized/date";
import type { DateRangeValue } from "./dateRange";

/** A typed calendar day (`YYYY-MM-DD`), or null while it is empty, partial or not a day. */
export function parseTypedDate(text: string): CalendarDate | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) return null;
  try {
    return parseDate(text);
  } catch {
    return null;
  }
}

export type TypedRange = {
  from: string;
  to: string;
  /** The range runs on until now: `to` is not read. */
  openEnd: boolean;
};

export type TypedDraft =
  { state: "incomplete" } | { state: "reversed" } | { state: "ready"; start: CalendarDate; end: CalendarDate };

/**
 * The days the typed fields name. A range whose last day comes before its
 * first is `reversed`, never swapped: the reader typed one of them wrong.
 */
export function typedDraft({ from, to, openEnd }: TypedRange): TypedDraft {
  const start = parseTypedDate(from);
  const end = openEnd ? start : parseTypedDate(to);
  if (!start || !end) return { state: "incomplete" };
  if (end.compare(start) < 0) return { state: "reversed" };
  return { state: "ready", start, end };
}

/**
 * The period an open-ended draft applies: from its first day (at the start
 * time when times are on) with no end, so entries still arrive in it.
 */
export function openEndedRange(start: CalendarDate, fromTime: Time | null, timeZone: string): DateRangeValue {
  const at = fromTime ? toCalendarDateTime(start, fromTime) : toCalendarDateTime(start);
  return { from: toZoned(at, timeZone).toDate().toISOString() };
}
