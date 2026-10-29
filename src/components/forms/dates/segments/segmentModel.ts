import type { FieldKind, SegmentType } from "./segmentLayout";

/** What each segment holds; `hour` counts 0–23 and `dayPeriod` is 0 (AM) or 1 (PM). */
export type SegmentValues = Partial<Record<SegmentType, number>>;

export type Limits = { min: number; max: number };

const pad = (value: number, length: number) => String(value).padStart(length, "0");

function daysIn(month: number | undefined, year: number | undefined): number {
  if (month === undefined) return 31;
  return new Date(Date.UTC(year ?? 2000, month, 0)).getUTCDate();
}

/** The values an ISO day (`YYYY-MM-DD`) or time (`HH:MM`) holds; empty for anything else. */
export function valuesOf(kind: FieldKind, text: string): SegmentValues {
  if (kind === "date") {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text);
    if (!match) return {};
    const [year, month, day] = match.slice(1).map(Number);
    if (month < 1 || month > 12 || day < 1 || day > daysIn(month, year)) return {};
    return { year, month, day };
  }
  const match = /^(\d{2}):(\d{2})/.exec(text);
  if (!match) return {};
  const [hour, minute] = match.slice(1).map(Number);
  if (hour > 23 || minute > 59) return {};
  return { hour, minute, dayPeriod: hour < 12 ? 0 : 1 };
}

/** The ISO day or time once every segment holds a value, otherwise empty. */
export function textOf(kind: FieldKind, values: SegmentValues): string {
  if (kind === "date") {
    const { year, month, day } = values;
    return year === undefined || month === undefined || day === undefined
      ? ""
      : `${pad(year, 4)}-${pad(month, 2)}-${pad(day, 2)}`;
  }
  const { hour, minute, dayPeriod } = values;
  return hour === undefined || minute === undefined || dayPeriod === undefined
    ? ""
    : `${pad(hour, 2)}:${pad(minute, 2)}`;
}

/** The range a segment's displayed number runs through; a 12-hour clock shows 1–12. */
export function limitsOf(type: SegmentType, values: SegmentValues, hour12: boolean): Limits {
  switch (type) {
    case "year":
      return { min: 1, max: 9999 };
    case "month":
      return { min: 1, max: 12 };
    case "day":
      return { min: 1, max: daysIn(values.month, values.year) };
    case "hour":
      return hour12 ? { min: 1, max: 12 } : { min: 0, max: 23 };
    case "minute":
      return { min: 0, max: 59 };
    case "dayPeriod":
      return { min: 0, max: 1 };
  }
}

/** The number a segment shows: the hour on a 12-hour clock is 12, 1 … 11. */
export function shownOf(type: SegmentType, values: SegmentValues, hour12: boolean): number | undefined {
  const value = values[type];
  if (value === undefined || type !== "hour" || !hour12) return value;
  return value % 12 === 0 ? 12 : value % 12;
}

/** The digits a segment shows, with leading zeros. */
export function digitsOf(type: SegmentType, shown: number): string {
  return type === "year" ? String(shown) : pad(shown, 2);
}

function withDayInMonth(values: SegmentValues): SegmentValues {
  const max = daysIn(values.month, values.year);
  return values.day !== undefined && values.day > max ? { ...values, day: max } : values;
}

/** Sets a segment from the number it shows; the hour of a 12-hour clock keeps its half of the day. */
export function withShown(type: SegmentType, shown: number, values: SegmentValues, hour12: boolean): SegmentValues {
  if (type === "hour") {
    const pm = (values.dayPeriod ?? 0) === 1;
    const hour = hour12 ? (shown % 12) + (pm ? 12 : 0) : shown;
    return { ...values, hour, dayPeriod: hour < 12 ? 0 : 1 };
  }
  if (type === "dayPeriod") {
    const hour = values.hour === undefined ? undefined : (values.hour % 12) + shown * 12;
    return { ...values, dayPeriod: shown, ...(hour === undefined ? {} : { hour }) };
  }
  return withDayInMonth({ ...values, [type]: shown });
}

/** Clears a segment; a time without its half of the day is incomplete. */
export function without(type: SegmentType, values: SegmentValues): SegmentValues {
  const next = { ...values };
  delete next[type];
  return next;
}

/** A digit typed into a segment after the digits already typed into it, as a native field takes it. */
export function typeDigit(
  buffer: string,
  digit: string,
  { min, max }: Limits,
): { shown?: number; buffer: string; advance: boolean } {
  let typed = buffer + digit;
  let shown = Number(typed);
  if (shown > max) {
    typed = digit;
    shown = Number(digit);
  }
  const set = shown !== 0 || min === 0;
  const done = Number(`${typed}0`) > max || typed.length >= String(max).length;
  return { shown: set ? shown : undefined, buffer: done ? "" : typed, advance: done && set };
}

/** Backspace takes the last digit off; what is left of a segment of zeros is empty. */
export function eraseDigit(text: string): { shown?: number; buffer: string } {
  const rest = text.slice(0, -1);
  const shown = Number(rest);
  return rest === "" || shown === 0 ? { buffer: "" } : { shown, buffer: rest };
}

/** One step up or down, wrapping at the ends; an empty segment starts at `start`. */
export function step(shown: number | undefined, by: number, { min, max }: Limits, start: number): number {
  if (shown === undefined) return Math.min(Math.max(start, min), max);
  const span = max - min + 1;
  return ((((shown - min + by) % span) + span) % span) + min;
}

/** Where an empty segment starts when stepped: today for a day, midnight for a time. */
export function startOf(type: SegmentType, today: Date, hour12: boolean): number {
  switch (type) {
    case "year":
      return today.getFullYear();
    case "month":
      return today.getMonth() + 1;
    case "day":
      return today.getDate();
    case "hour":
      return hour12 ? 12 : 0;
    default:
      return 0;
  }
}
