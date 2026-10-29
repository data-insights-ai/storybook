import { type CalendarDate, fromAbsolute, startOfMonth, toCalendarDate, toZoned } from "@internationalized/date";

/** The periods a list offers in one click, newest first. */
export const dateRangePresets = ["24h", "7d", "30d", "thisMonth", "lastMonth"] as const;

export type DateRangePreset = (typeof dateRangePresets)[number];

/**
 * A period as a list keeps it: a preset that moves with the clock, or a
 * fixed range of instants (ISO 8601, `to` exclusive). Empty is any time.
 */
export type DateRangeValue = { preset?: DateRangePreset; from?: string; to?: string };

/** The instants a period stands for now; a missing end is open. */
export type ResolvedDateRange = { from?: string; to?: string };

function isPreset(value: unknown): value is DateRangePreset {
  return typeof value === "string" && (dateRangePresets as readonly string[]).includes(value);
}

function instant(value: unknown): string | undefined {
  if (typeof value !== "string" || value === "") return undefined;
  const ms = Date.parse(value);
  return Number.isNaN(ms) ? undefined : new Date(ms).toISOString();
}

function startOfDay(day: CalendarDate, timeZone: string): string {
  return toZoned(day, timeZone).toDate().toISOString();
}

/**
 * The instants a period covers at `now`, with days and months counted in
 * `timeZone`: "Last 7 days" starts at midnight six days before today, so it
 * holds today and the six days before it. Presets that run up to now have no
 * end, so entries that arrive later still belong to them; "Last month" ends
 * where this month starts.
 */
export function resolveDateRange(value: DateRangeValue, now: Date, timeZone: string): ResolvedDateRange {
  if (!value.preset) {
    return { from: instant(value.from), to: instant(value.to) };
  }
  const today = toCalendarDate(fromAbsolute(now.getTime(), timeZone));
  switch (value.preset) {
    case "24h":
      return { from: new Date(now.getTime() - 86_400_000).toISOString() };
    case "7d":
      return { from: startOfDay(today.subtract({ days: 6 }), timeZone) };
    case "30d":
      return { from: startOfDay(today.subtract({ days: 29 }), timeZone) };
    case "thisMonth":
      return { from: startOfDay(startOfMonth(today), timeZone) };
    case "lastMonth":
      return {
        from: startOfDay(startOfMonth(today).subtract({ months: 1 }), timeZone),
        to: startOfDay(startOfMonth(today), timeZone),
      };
  }
}

/** URL search parameters of a period: `range=7d`, or `from` and `to`. */
export type DateRangeSearch = { range?: DateRangePreset; from?: string; to?: string };

/**
 * The search parameters for a period. Every key is present, undefined when
 * unused, so merging it into a URL's search drops what the old period set.
 */
export function serializeDateRange(value: DateRangeValue): DateRangeSearch {
  if (value.preset) return { range: value.preset, from: undefined, to: undefined };
  return { range: undefined, from: instant(value.from), to: instant(value.to) };
}

/**
 * Reads a period back from search parameters (an object or
 * `URLSearchParams`). Unknown presets, unreadable instants and a range that
 * ends before it starts read as any time, so a hand-edited URL never fails.
 */
export function parseDateRange(search: Record<string, unknown> | URLSearchParams): DateRangeValue {
  const get = (key: string): unknown => (search instanceof URLSearchParams ? search.get(key) : search[key]);
  const range = get("range");
  if (isPreset(range)) return { preset: range };
  const from = instant(get("from"));
  const to = instant(get("to"));
  if (from && to && Date.parse(from) >= Date.parse(to)) return {};
  return { ...(from ? { from } : {}), ...(to ? { to } : {}) };
}

/** Whether the period narrows anything. */
export function isDateRangeSet(value: DateRangeValue): boolean {
  return Boolean(value.preset || instant(value.from) || instant(value.to));
}

/** `weekStartsOn` as a number (0 Sunday … 6 Saturday) to the calendar's name. */
export function weekStartName(weekStartsOn: number): "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat" {
  const names = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;
  return names[((Math.trunc(weekStartsOn) % 7) + 7) % 7];
}
