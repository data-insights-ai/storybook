import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { type CalendarDate, startOfMonth } from "@internationalized/date";
import { DayPicker, getDefaultClassNames, type Matcher } from "react-day-picker";
import { CalendarDay } from "./CalendarDay";
import { calendarText, fromDate, toDate } from "./calendarText";

export type DayRange = { start: CalendarDate; end: CalendarDate };

const unstyled = Object.fromEntries(Object.keys(getDefaultClassNames()).map((key) => [key, ""]));
const NoCaption = () => <></>;
const components = { DayButton: CalendarDay, MonthCaption: NoCaption };

const ordered = (a: CalendarDate, b: CalendarDate): DayRange =>
  a.compare(b) <= 0 ? { start: a, end: b } : { start: b, end: a };

/**
 * One or two month grids under one header: the previous and next buttons
 * and the months shown. Arrows move by day and week, Page Up and Page Down
 * by month (with Shift by year), Home and End to the month's first and last
 * day, Enter picks. A range is picked as two days; between them the band
 * follows the pointer or the focus.
 */
export function MonthCalendar({
  locale,
  weekStartsOn,
  months = 1,
  today,
  min,
  max,
  range = false,
  selected,
  focusDay,
  onSelect,
  labels,
  gridLabel,
  className,
  monthsClassName,
}: {
  locale: string;
  weekStartsOn: number;
  months?: number;
  today: CalendarDate;
  min?: CalendarDate | null;
  max?: CalendarDate | null;
  /** Picks a first and a last day instead of one day. */
  range?: boolean;
  selected: DayRange | null;
  /** Where the keyboard starts; its month is shown first. A newly selected last day takes over. */
  focusDay: CalendarDate;
  onSelect: (range: DayRange) => void;
  labels: { previous: string; next: string };
  /** Read before each month's name. */
  gridLabel?: string;
  className?: string;
  monthsClassName?: string;
}) {
  const text = useMemo(() => calendarText(locale), [locale]);
  const [month, setMonth] = useState(() => startOfMonth(focusDay));
  const [target, setTarget] = useState(focusDay);
  const [followed, setFollowed] = useState(selected?.end.toString());
  const [anchor, setAnchor] = useState<CalendarDate | null>(null);
  const [hover, setHover] = useState<CalendarDate | null>(null);
  const last = month.add({ months: months - 1 });
  const end = selected?.end;
  if (end && end.toString() !== followed) {
    setFollowed(end.toString());
    setTarget(end);
    if (end.compare(month) < 0 || startOfMonth(end).compare(last) > 0) setMonth(startOfMonth(end));
  }

  const shown = anchor ? ordered(anchor, hover ?? anchor) : selected;
  const disabled: Matcher[] = [...(min ? [{ before: toDate(min) }] : []), ...(max ? [{ after: toDate(max) }] : [])];
  const canGoBack = !min || month.compare(startOfMonth(min)) > 0;
  const canGoOn = !max || last.compare(startOfMonth(max)) < 0;
  const pick = (date: Date) => {
    const day = fromDate(date);
    if (!range) onSelect({ start: day, end: day });
    else if (!anchor) {
      setAnchor(day);
      setHover(day);
    } else {
      setAnchor(null);
      setHover(null);
      onSelect(ordered(anchor, day));
    }
  };
  const follow = (date: Date) => {
    if (anchor) setHover(fromDate(date));
  };

  return (
    <div className={className}>
      <header className="di-calendar-head">
        <button
          type="button"
          className="di-calendar-nav"
          aria-label={labels.previous}
          disabled={!canGoBack}
          onClick={() => setMonth(month.subtract({ months: 1 }))}
        >
          <ChevronLeft aria-hidden />
        </button>
        <div className="di-calendar-heading" aria-live="polite">
          {text.heading(toDate(month), toDate(last))}
        </div>
        <button
          type="button"
          className="di-calendar-nav"
          aria-label={labels.next}
          disabled={!canGoOn}
          onClick={() => setMonth(month.add({ months: 1 }))}
        >
          <ChevronRight aria-hidden />
        </button>
      </header>
      <DayPicker
        lang={locale}
        month={toDate(month)}
        onMonthChange={(date) => {
          const next = fromDate(date);
          setMonth(next.compare(month) > 0 ? next.subtract({ months: months - 1 }) : next);
        }}
        numberOfMonths={months}
        weekStartsOn={(((Math.trunc(weekStartsOn) % 7) + 7) % 7) as 0 | 1 | 2 | 3 | 4 | 5 | 6}
        today={toDate(today)}
        startMonth={min ? toDate(min) : undefined}
        endMonth={max ? toDate(max) : undefined}
        disabled={disabled}
        hideNavigation
        onDayClick={pick}
        onDayMouseEnter={follow}
        onDayFocus={(date) => {
          setTarget(fromDate(date));
          follow(date);
        }}
        modifiers={{
          focused: toDate(target),
          selected: shown ? { from: toDate(shown.start), to: toDate(shown.end) } : false,
          start: shown ? toDate(shown.start) : false,
          end: shown ? toDate(shown.end) : false,
        }}
        formatters={{ formatDay: text.dayNumber, formatWeekdayName: text.weekday }}
        labels={{
          labelGrid: (date) => (gridLabel ? `${gridLabel}, ` : "") + text.month(date),
          labelDayButton: (date, modifiers) => text.day(date, modifiers.today),
          labelWeekday: text.weekdayName,
        }}
        classNames={{ ...unstyled, months: monthsClassName ?? "", month_grid: "di-calendar-grid" }}
        components={components}
      />
    </div>
  );
}
