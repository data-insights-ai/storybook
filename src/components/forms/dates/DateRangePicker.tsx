import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import {
  type CalendarDate,
  type DateValue,
  type Time,
  fromAbsolute,
  getLocalTimeZone,
  toCalendarDate,
  toCalendarDateTime,
  toTime,
  toZoned,
  today,
} from "@internationalized/date";
import { Button as AriaButton } from "react-aria-components/Button";
import { CalendarCell, CalendarGrid, Heading, RangeCalendar } from "react-aria-components/RangeCalendar";
import { Dialog, DialogTrigger } from "react-aria-components/Dialog";
import { I18nProvider } from "react-aria-components/I18nProvider";
import { ListBox, ListBoxItem } from "react-aria-components/ListBox";
import { Modal, ModalOverlay } from "react-aria-components/Modal";
import { Popover } from "react-aria-components/Popover";
import { DateInput, DateSegment, Label, TimeField } from "react-aria-components/TimeField";
import { cx } from "../../../cx";
import { Button } from "../../actions/Button";
import { Checkbox } from "../Choice";
import { TextField } from "../TextField";
import { openEndedRange, typedDraft } from "./dateRangeDraft";
import {
  type DateRangePreset,
  type DateRangeValue,
  dateRangePresets,
  isDateRangeSet,
  resolveDateRange,
  weekStartName,
} from "./dateRange";
import "./Calendar.css";
import "./DateRangePicker.css";

/** Every word the picker shows; a product passes its own language. */
export type DateRangeLabels = Record<DateRangePreset, string> & {
  any: string;
  custom: string;
  presets: string;
  dialog: string;
  previous: string;
  next: string;
  setTimes: string;
  fromTime: string;
  toTime: string;
  apply: string;
  cancel: string;
  timeZone: string;
  /** The typed first and last day of a custom range. */
  fromDate?: string;
  toDate?: string;
  /** With `allowOpenEnd`: a custom range without a last day, up to now. */
  openEnd?: string;
  /** Under the last day when it comes before the first. */
  reversed?: string;
};

export const defaultDateRangeLabels = {
  any: "Any time",
  "24h": "Last 24 hours",
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  thisMonth: "This month",
  lastMonth: "Last month",
  custom: "Custom range",
  presets: "Periods",
  dialog: "Choose a period",
  previous: "Previous month",
  next: "Next month",
  setTimes: "Set times",
  fromTime: "From",
  toTime: "Until",
  apply: "Apply",
  cancel: "Cancel",
  timeZone: "Time zone",
  fromDate: "From date",
  toDate: "Through date",
  openEnd: "Until now",
  reversed: "The last day comes before the first.",
} satisfies DateRangeLabels;

type Draft = { start: CalendarDate; end: CalendarDate } | null;
type Times = { on: boolean; from: Time | null; to: Time | null };

const midnight = (zoned: { hour: number; minute: number; second: number; millisecond: number }) =>
  zoned.hour === 0 && zoned.minute === 0 && zoned.second === 0 && zoned.millisecond === 0;

// A fixed range as the calendar shows it: an end at midnight is exclusive,
// so the last day shown is the day before it. With openEnd a custom range
// with a first day and no last one shows as that day, open.
function draftOf(value: DateRangeValue, timeZone: string, openEnd = false): { draft: Draft; times: Times } {
  const none = { draft: null, times: { on: false, from: null, to: null } };
  if (openEnd && !value.preset && value.from && !value.to) {
    const from = fromAbsolute(Date.parse(value.from), timeZone);
    const day = toCalendarDate(from);
    return {
      draft: { start: day, end: day },
      times: midnight(from) ? none.times : { on: true, from: toTime(from), to: null },
    };
  }
  if (value.preset || !value.from || !value.to) return none;
  const from = fromAbsolute(Date.parse(value.from), timeZone);
  const to = fromAbsolute(Date.parse(value.to), timeZone);
  if (midnight(from) && midnight(to)) {
    return {
      draft: {
        start: toCalendarDate(from),
        end: toCalendarDate(to).subtract({ days: 1 }),
      },
      times: none.times,
    };
  }
  return {
    draft: { start: toCalendarDate(from), end: toCalendarDate(to) },
    times: { on: true, from: toTime(from), to: toTime(to) },
  };
}

function rangeOf(draft: NonNullable<Draft>, times: Times, timeZone: string): DateRangeValue | null {
  const from = times.on && times.from ? toCalendarDateTime(draft.start, times.from) : toCalendarDateTime(draft.start);
  const to =
    times.on && times.to ? toCalendarDateTime(draft.end, times.to) : toCalendarDateTime(draft.end.add({ days: 1 }));
  const fromAt = toZoned(from, timeZone).toDate();
  const toAt = toZoned(to, timeZone).toDate();
  return fromAt < toAt ? { from: fromAt.toISOString(), to: toAt.toISOString() } : null;
}

function describe(value: DateRangeValue, labels: DateRangeLabels, locale: string, timeZone: string): string {
  if (value.preset) return labels[value.preset];
  if (!isDateRangeSet(value)) return labels.any;
  const { from, to } = resolveDateRange(value, new Date(), timeZone);
  const { times } = draftOf(value, timeZone);
  const format = new Intl.DateTimeFormat(locale, {
    timeZone,
    dateStyle: "medium",
    ...(times.on ? { timeStyle: "short" } : {}),
  });
  if (from && to) {
    const end = times.on ? new Date(to) : new Date(Date.parse(to) - 1);
    return format.formatRange(new Date(from), end);
  }
  return from ? `${format.format(new Date(from))} –` : `– ${format.format(new Date(to!))}`;
}

// Below 640px the picker opens as a bottom sheet instead of a popover.
function useNarrow(): boolean {
  const query = "(max-width: 639.98px)";
  const [narrow, setNarrow] = useState(() => typeof window !== "undefined" && window.matchMedia(query).matches);
  useEffect(() => {
    const list = window.matchMedia(query);
    const update = () => setNarrow(list.matches);
    list.addEventListener("change", update);
    return () => list.removeEventListener("change", update);
  }, []);
  return narrow;
}

// The sheet closes when the reader goes back, as an app's sheet does: its
// opening adds a history entry, and closing it otherwise takes that entry
// away again. A choice waits until the entry is gone (`leave`), so the
// product's own navigation to the new period is not undone by it.
function useBackCloses(open: boolean, close: () => void): (then: () => void) => void {
  const closeRef = useRef(close);
  closeRef.current = close;
  const entry = useRef<{ id: number; then?: () => void } | null>(null);
  useEffect(() => {
    if (!open) return;
    const id = Math.random();
    window.history.pushState({ ...window.history.state, diDateRangeSheet: id }, "");
    entry.current = { id };
    const onPop = () => {
      const left = entry.current;
      entry.current = null;
      window.removeEventListener("popstate", onPop);
      if (left?.then) left.then();
      else closeRef.current();
    };
    window.addEventListener("popstate", onPop);
    return () => {
      window.removeEventListener("popstate", onPop);
      if (!entry.current) return;
      entry.current = null;
      if (window.history.state?.diDateRangeSheet === id) window.history.back();
    };
  }, [open]);
  return (then) => {
    const current = entry.current;
    if (current && window.history.state?.diDateRangeSheet === current.id) {
      current.then = then;
      window.history.back();
    } else then();
  };
}

// Dragging the sheet's handle down by more than a quarter of its height, or
// 96px, closes it; a shorter drag springs back.
function useDragToClose(sheet: React.RefObject<HTMLElement | null>, close: () => void) {
  const start = useRef<number | null>(null);
  const move = (y: number) => {
    if (start.current === null || !sheet.current) return;
    sheet.current.style.translate = `0 ${Math.max(0, y - start.current)}px`;
  };
  return {
    onPointerDown: (event: React.PointerEvent<HTMLElement>) => {
      start.current = event.clientY;
      event.currentTarget.setPointerCapture(event.pointerId);
      sheet.current?.setAttribute("data-dragging", "");
    },
    onPointerMove: (event: React.PointerEvent<HTMLElement>) => move(event.clientY),
    onPointerUp: (event: React.PointerEvent<HTMLElement>) => {
      const element = sheet.current;
      const distance = start.current === null ? 0 : event.clientY - start.current;
      start.current = null;
      if (!element) return;
      element.removeAttribute("data-dragging");
      element.style.translate = "";
      if (distance > Math.min(96, element.offsetHeight / 4)) close();
    },
    onPointerCancel: () => {
      start.current = null;
      sheet.current?.removeAttribute("data-dragging");
      if (sheet.current) sheet.current.style.translate = "";
    },
  };
}

/**
 * The period a date-based list shows, as one toolbar control the height of
 * a field, its choice written inside ("Last 7 days"). Presets apply at once;
 * a custom range is picked on a two-month calendar (one month on a narrow
 * screen), optionally with times, and applied. Days, months and the week's
 * first day follow the `locale`, `weekStartsOn` and `timeZone` the product
 * passes from its settings; the popover names the zone. React Aria owns the
 * popover, the calendar grid and the time fields, so arrows move by day,
 * Page Up and Page Down by month, Home and End to the week's edges, Enter
 * picks, and Esc closes and returns to the control. Below 640px it opens
 * as a bottom sheet instead: full width with a drag handle, the periods as
 * a list, then the calendar and the typed days, Cancel and Apply pinned to
 * its foot; focus stays inside, and Esc, the back button, a tap beside it or
 * dragging the handle down close it.
 */
export function DateRangePicker({
  id,
  label,
  value,
  onChange,
  locale = "en-GB",
  weekStartsOn = 1,
  timeZone = getLocalTimeZone(),
  allowAny = true,
  allowTimes = true,
  allowOpenEnd = false,
  disabled = false,
  labels: labelOverrides = {},
  className,
}: {
  id: string;
  /** What the period is of, read with the choice: "Period: Last 7 days". */
  label: string;
  value: DateRangeValue;
  onChange: (value: DateRangeValue) => void;
  /** BCP 47 language tag for month and weekday names and the range shown. */
  locale?: string;
  /** First day of the week, 0 Sunday … 6 Saturday. */
  weekStartsOn?: number;
  /** IANA zone days and months are counted in; shown in the popover. */
  timeZone?: string;
  /** Offers "Any time", which clears the period. */
  allowAny?: boolean;
  /** Offers times on a custom range. */
  allowTimes?: boolean;
  /** Offers "Until now": a custom range from a first day with no last one. */
  allowOpenEnd?: boolean;
  disabled?: boolean;
  labels?: Partial<DateRangeLabels>;
  className?: string;
}) {
  const labels = { ...defaultDateRangeLabels, ...labelOverrides };
  const narrow = useNarrow();
  const root = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLElement>(null);
  const focusCalendar = () => dialog.current?.querySelector<HTMLElement>('[role="grid"] [tabindex="0"]')?.focus();
  const [open, setOpen] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);
  const [typed, setTyped] = useState({ from: "", to: "" });
  const [times, setTimes] = useState<Times>({
    on: false,
    from: null,
    to: null,
  });
  const [overlay, setOverlay] = useState<{
    theme?: string;
    container?: HTMLElement;
  }>({});
  const sheet = useRef<HTMLDivElement>(null);
  const leave = useBackCloses(open && narrow, () => setOpen(false));
  const drag = useDragToClose(sheet, () => setOpen(false));

  // The popover is portalled: it keeps a nested theme and stays inside a
  // native modal's inert boundary, as ComboBox does.
  useLayoutEffect(() => {
    if (!open || !root.current) return;
    const element = root.current;
    setOverlay({
      theme: element.closest<HTMLElement>("[data-theme]")?.dataset.theme,
      container: element.closest("dialog") ?? undefined,
    });
  }, [open]);

  const openChange = (next: boolean) => {
    if (next) {
      const open = allowOpenEnd && !value.preset && !!value.from && !value.to;
      const start = draftOf(value, timeZone, open);
      setOpenEnd(open);
      setTyped({
        from: start.draft?.start.toString() ?? "",
        to: open ? "" : (start.draft?.end.toString() ?? ""),
      });
      setTimes(start.times);
    }
    setOpen(next);
  };
  const choose = (next: DateRangeValue) =>
    leave(() => {
      onChange(next);
      setOpen(false);
    });
  const typedRange = typedDraft({ ...typed, openEnd });
  const draft: Draft = typedRange.state === "ready" ? { start: typedRange.start, end: typedRange.end } : null;
  const applied = !draft
    ? null
    : openEnd
      ? openEndedRange(draft.start, times.on ? times.from : null, timeZone)
      : rangeOf(draft, times, timeZone);
  const current = value.preset ?? (isDateRangeSet(value) ? "custom" : "any");
  const text = describe(value, labels, locale, timeZone);
  const options = [...(allowAny ? (["any"] as const) : []), ...dateRangePresets];

  const foot = (
    <footer className="di-date-range-foot">
      <span className="di-date-range-zone">
        {labels.timeZone} <code>{timeZone}</code>
      </span>
      <span className="di-date-range-actions">
        <Button variant="ghost" size={narrow ? "md" : "dense"} onClick={() => setOpen(false)}>
          {labels.cancel}
        </Button>
        <Button size={narrow ? "md" : "dense"} disabled={!applied} onClick={() => applied && choose(applied)}>
          {labels.apply}
        </Button>
      </span>
    </footer>
  );
  const content = (
    <Dialog ref={dialog} className="di-date-range-dialog" aria-label={labels.dialog}>
      {narrow ? (
        <div className="di-date-range-grip" {...drag}>
          <span className="di-date-range-handle" aria-hidden />
          <span className="di-date-range-sheet-title">{labels.dialog}</span>
        </div>
      ) : null}
      <ListBox
        className="di-date-range-presets"
        aria-label={labels.presets}
        selectionMode="single"
        disallowEmptySelection
        selectedKeys={[current]}
        onSelectionChange={(keys) => {
          const key = [...keys][0];
          if (key === "any") choose({});
          else if (key === "custom") focusCalendar();
          else if (typeof key === "string") choose({ preset: key as DateRangePreset });
        }}
      >
        {options.map((key) => (
          <ListBoxItem key={key} id={key} className="di-date-range-preset">
            {labels[key]}
          </ListBoxItem>
        ))}
        <ListBoxItem id="custom" className="di-date-range-preset">
          {labels.custom}
        </ListBoxItem>
      </ListBox>
      <div className="di-date-range-custom">
        <div className="di-date-range-dates">
          <TextField
            id={`${id}-from-date`}
            type="date"
            label={labels.fromDate}
            value={typed.from}
            onChange={(event) => setTyped({ ...typed, from: event.target.value })}
          />
          {openEnd ? null : (
            <TextField
              id={`${id}-to-date`}
              type="date"
              label={labels.toDate}
              value={typed.to}
              hint={typedRange.state === "reversed" ? labels.reversed : ""}
              hintTone="error"
              onChange={(event) => setTyped({ ...typed, to: event.target.value })}
            />
          )}
        </div>
        {allowOpenEnd ? (
          <Checkbox
            id={`${id}-open-end`}
            label={labels.openEnd}
            checked={openEnd}
            onChange={(event) => {
              setOpenEnd(event.target.checked);
              if (!event.target.checked && !typed.to) setTyped({ ...typed, to: typed.from });
            }}
          />
        ) : null}
        <RangeCalendar
          className="di-date-range-calendar"
          aria-label={labels.custom}
          visibleDuration={{ months: narrow ? 1 : 2 }}
          pageBehavior="single"
          firstDayOfWeek={weekStartName(weekStartsOn)}
          value={draft}
          defaultFocusedValue={draft?.end ?? today(timeZone)}
          onChange={(range: { start: DateValue; end: DateValue } | null) => {
            setTyped({
              from: range ? toCalendarDate(range.start).toString() : "",
              to: range ? toCalendarDate(range.end).toString() : "",
            });
            setOpenEnd(false);
          }}
        >
          <header className="di-calendar-head">
            <AriaButton slot="previous" className="di-calendar-nav" aria-label={labels.previous}>
              <ChevronLeft aria-hidden />
            </AriaButton>
            <Heading className="di-calendar-heading" />
            <AriaButton slot="next" className="di-calendar-nav" aria-label={labels.next}>
              <ChevronRight aria-hidden />
            </AriaButton>
          </header>
          <div className="di-date-range-months">
            {Array.from({ length: narrow ? 1 : 2 }, (_, month) => (
              <CalendarGrid key={month} offset={{ months: month }} className="di-calendar-grid">
                {(date) => <CalendarCell date={date} className="di-calendar-cell" />}
              </CalendarGrid>
            ))}
          </div>
        </RangeCalendar>
        {allowTimes && (
          <div className="di-date-range-times">
            <Checkbox
              id={`${id}-times`}
              label={labels.setTimes}
              checked={times.on}
              onChange={(event) => setTimes({ ...times, on: event.target.checked })}
            />
            {times.on && (
              <div className="di-date-range-time-fields">
                <TimeField
                  className="di-date-range-time"
                  value={times.from}
                  onChange={(from) => setTimes({ ...times, from })}
                >
                  <Label className="di-field-label di-field-label-record">{labels.fromTime}</Label>
                  <DateInput className="di-control di-date-input di-date-range-time-input">
                    {(segment) => <DateSegment segment={segment} className="di-date-segment" />}
                  </DateInput>
                </TimeField>
                {openEnd ? null : (
                  <TimeField
                    className="di-date-range-time"
                    value={times.to}
                    onChange={(to) => setTimes({ ...times, to })}
                  >
                    <Label className="di-field-label di-field-label-record">{labels.toTime}</Label>
                    <DateInput className="di-control di-date-input di-date-range-time-input">
                      {(segment) => <DateSegment segment={segment} className="di-date-segment" />}
                    </DateInput>
                  </TimeField>
                )}
              </div>
            )}
          </div>
        )}
        {narrow ? null : foot}
      </div>
      {narrow ? foot : null}
    </Dialog>
  );

  return (
    <I18nProvider locale={locale}>
      <DialogTrigger isOpen={open} onOpenChange={openChange}>
        <AriaButton
          ref={root}
          id={id}
          isDisabled={disabled}
          aria-label={`${label}: ${text}`}
          className={cx("di-control", "di-date-range", isDateRangeSet(value) && "is-set", className)}
        >
          <CalendarDays className="di-date-range-icon" aria-hidden />
          <span className="di-date-range-text">{text}</span>
          <ChevronDown className="di-date-range-caret" aria-hidden />
        </AriaButton>
        {narrow ? (
          <ModalOverlay
            className="di-date-range-scrim"
            data-theme={overlay.theme}
            UNSTABLE_portalContainer={overlay.container}
            isDismissable
          >
            <Modal ref={sheet} className="di-date-range-sheet">
              {content}
            </Modal>
          </ModalOverlay>
        ) : (
          <Popover
            className="di-date-range-popover"
            data-theme={overlay.theme}
            UNSTABLE_portalContainer={overlay.container}
            placement="bottom start"
            offset={4}
          >
            {content}
          </Popover>
        )}
      </DialogTrigger>
    </I18nProvider>
  );
}
