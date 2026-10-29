import { CalendarDate } from "@internationalized/date";

/** A calendar day as the local midnight the grid counts in. */
export const toDate = (day: CalendarDate) => new Date(day.year, day.month - 1, day.day);

export const fromDate = (date: Date) => new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate());

const capitalize = (text: string, locale: string) => text.charAt(0).toLocaleUpperCase(locale) + text.slice(1);

/** The words of a month grid in `locale`, from Intl: no locale tables of our own. */
export function calendarText(locale: string) {
  const gregorian = { calendar: "gregory", numberingSystem: "latn" } as const;
  const monthYear = new Intl.DateTimeFormat(locale, { ...gregorian, month: "long", year: "numeric" });
  const fullDay = new Intl.DateTimeFormat(locale, {
    ...gregorian,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const dayNumber = new Intl.DateTimeFormat(locale, { ...gregorian, day: "numeric" });
  const narrowWeekday = new Intl.DateTimeFormat(locale, { ...gregorian, weekday: "narrow" });
  const longWeekday = new Intl.DateTimeFormat(locale, { ...gregorian, weekday: "long" });
  const today = capitalize(new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(0, "day"), locale);
  return {
    heading: (first: Date, last: Date) =>
      first.getTime() === last.getTime() ? monthYear.format(first) : monthYear.formatRange(first, last),
    month: (date: Date) => monthYear.format(date),
    day: (date: Date, isToday: boolean) => (isToday ? `${today}, ` : "") + fullDay.format(date),
    dayNumber: (date: Date) =>
      dayNumber.formatToParts(date).find((part) => part.type === "day")?.value ?? String(date.getDate()),
    weekday: (date: Date) => narrowWeekday.format(date),
    weekdayName: (date: Date) => longWeekday.format(date),
  };
}
