export type FieldKind = "date" | "time";

export type SegmentType = "year" | "month" | "day" | "hour" | "minute" | "dayPeriod";

export type LayoutPart = { type: SegmentType } | { type: "literal"; text: string };

/** The segments of a day or a time in the order and with the separators the locale writes them. */
export type SegmentLayout = {
  parts: LayoutPart[];
  hour12: boolean;
  names: Record<SegmentType, string>;
  placeholders: Record<SegmentType, string>;
  dayPeriods: [string, string];
  monthName: (month: number) => string;
  hourText: (hour: number) => string;
};

const segmentTypes: readonly string[] = ["year", "month", "day", "hour", "minute", "dayPeriod"];
const englishNames = { year: "year", month: "month", day: "day", hour: "hour", minute: "minute", dayPeriod: "AM/PM" };
const digits = { year: 4, month: 2, day: 2 } as const;
const gregorian = { calendar: "gregory", numberingSystem: "latn" } as const;

function partsOf(locale: string, kind: FieldKind): { parts: LayoutPart[]; hour12: boolean } {
  const format = new Intl.DateTimeFormat(
    locale,
    kind === "date"
      ? { ...gregorian, year: "numeric", month: "2-digit", day: "2-digit" }
      : { ...gregorian, hour: "2-digit", minute: "2-digit" },
  );
  const parts: LayoutPart[] = [];
  for (const part of format.formatToParts(new Date(2000, 10, 22, 18, 30))) {
    if (segmentTypes.includes(part.type)) parts.push({ type: part.type as SegmentType });
    else if (part.type === "literal") {
      const last = parts.at(-1);
      if (last?.type === "literal") last.text += part.value;
      else parts.push({ type: "literal", text: part.value });
    }
  }
  const cycle = format.resolvedOptions().hourCycle;
  return { parts, hour12: kind === "time" && (cycle === "h11" || cycle === "h12") };
}

function namesOf(locale: string): Record<SegmentType, string> {
  try {
    const names = new Intl.DisplayNames(locale, { type: "dateTimeField" });
    const of = (type: SegmentType) => names.of(type) ?? englishNames[type];
    return {
      year: of("year"),
      month: of("month"),
      day: of("day"),
      hour: of("hour"),
      minute: of("minute"),
      dayPeriod: of("dayPeriod"),
    };
  } catch {
    return englishNames;
  }
}

function dayPeriodsOf(locale: string): [string, string] {
  const format = new Intl.DateTimeFormat(locale, { ...gregorian, hour: "numeric", hourCycle: "h12" });
  const period = (hour: number) =>
    format.formatToParts(new Date(2000, 0, 1, hour)).find((part) => part.type === "dayPeriod")?.value ??
    (hour < 12 ? "AM" : "PM");
  return [period(6), period(18)];
}

/**
 * The layout, field names and placeholders of a typed day or time in
 * `locale`, all from Intl: a placeholder repeats the first letter of the
 * localized field name per digit ("TT.MM.JJJJ" in German, "dd/mm/aaaa" in
 * Spanish); hours and minutes show dashes.
 */
export function segmentLayout(locale: string, kind: FieldKind): SegmentLayout {
  const { parts, hour12 } = partsOf(locale, kind);
  const names = namesOf(locale);
  const dayPeriods = dayPeriodsOf(locale);
  const letter = (type: keyof typeof digits) => (Array.from(names[type])[0] ?? type[0]).repeat(digits[type]);
  const month = new Intl.DateTimeFormat(locale, { ...gregorian, month: "long" });
  const hour = new Intl.DateTimeFormat(locale, { ...gregorian, hour: "numeric", hourCycle: hour12 ? "h12" : "h23" });
  return {
    parts,
    hour12,
    names,
    placeholders: {
      year: letter("year"),
      month: letter("month"),
      day: letter("day"),
      hour: "––",
      minute: "––",
      dayPeriod: dayPeriods[0],
    },
    dayPeriods,
    monthName: (value) => month.format(new Date(2000, value - 1, 1)),
    hourText: (value) => hour.format(new Date(2000, 0, 1, value)),
  };
}
