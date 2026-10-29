import { useEffect, useRef, useState } from "react";
import { CalendarDays, ChevronDown } from "lucide-react";
import {
  type CalendarDate,
  type Time,
  fromAbsolute,
  getLocalTimeZone,
  parseTime,
  toCalendarDate,
  toCalendarDateTime,
  toTime,
  toZoned,
  today,
} from "@internationalized/date";
import { Dialog } from "@base-ui/react/dialog";
import { Popover } from "@base-ui/react/popover";
import { cx } from "../../../../internal/cx";
import { useOverlayHost } from "../../../../internal/useOverlayHost";
import { Button } from "../../../actions/Button";
import { Checkbox } from "../../choice/Checkbox";
import { MonthCalendar } from "../calendar";
import { SegmentedInput } from "../segments";
import { openEndedRange, typedDraft } from "./dateRangeDraft";
import { PresetList } from "./PresetList";
import { TypedDay } from "./TypedDay";
import {
  type DateRangePreset,
  type DateRangeValue,
  dateRangePresets,
  isDateRangeSet,
  resolveDateRange,
} from "../dateRange";
import "../Calendar.css";
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
  /** What a screen reader says for an empty segment; `emptySegmentLabels` has it in English, German and Spanish. */
  empty?: string;
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
  empty: "Empty",
} satisfies DateRangeLabels;

type Draft = { start: CalendarDate; end: CalendarDate } | null;
type Times = { on: boolean; from: Time | null; to: Time | null };

const twoDigits = (n: number) => String(n).padStart(2, "0");
const timeText = (time: Time | null) => (time ? `${twoDigits(time.hour)}:${twoDigits(time.minute)}` : "");
const timeOf = (text: string) => (text ? parseTime(text) : null);

function RangeTime({
  id,
  label,
  value,
  onChange,
  locale,
  emptyLabel,
}: {
  id: string;
  label: string;
  value: Time | null;
  onChange: (value: Time | null) => void;
  locale: string;
  emptyLabel: string;
}) {
  return (
    <div className="di-date-range-time">
      <span id={`${id}-label`} className="di-field-label di-field-label-record">
        {label}
      </span>
      <SegmentedInput
        kind="time"
        group
        id={id}
        className="di-control di-date-input di-date-range-time-input"
        locale={locale}
        value={timeText(value)}
        onChange={(text) => onChange(timeOf(text))}
        labelledBy={`${id}-label`}
        emptyLabel={emptyLabel}
      />
    </div>
  );
}

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

// Base UI's focus guards hand focus back to the sheet a moment after Tab
// leaves it; wrapping Tab here keeps focus inside at every step.
function wrapTab(event: React.KeyboardEvent<HTMLElement>) {
  if (event.key !== "Tab") return;
  const tabbable = [
    ...event.currentTarget.querySelectorAll<HTMLElement>("button, input, select, textarea, a[href], [tabindex]"),
  ].filter((element) => element.tabIndex >= 0 && !element.matches(":disabled") && element.getClientRects().length > 0);
  const edge = event.shiftKey ? tabbable[0] : tabbable.at(-1);
  if (!edge || event.target !== edge) return;
  event.preventDefault();
  (event.shiftKey ? tabbable.at(-1) : tabbable[0])?.focus();
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
 * passes from its settings; the popover names the zone. In the calendar
 * arrows move by day, Page Up and Page Down by month, Home and End to the
 * month's first and last day, Enter picks, and Esc closes and returns to the
 * control. Below 640px it opens
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
  const dialog = useRef<HTMLDivElement>(null);
  const focusCalendar = () => dialog.current?.querySelector<HTMLElement>('[role="grid"] [tabindex="0"]')?.focus();
  const [open, setOpen] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);
  const [typed, setTyped] = useState({ from: "", to: "" });
  const [times, setTimes] = useState<Times>({
    on: false,
    from: null,
    to: null,
  });
  const sheet = useRef<HTMLDivElement>(null);
  const leave = useBackCloses(open && narrow, () => setOpen(false));
  const drag = useDragToClose(sheet, () => setOpen(false));
  const { host: overlay, update } = useOverlayHost(root, open);

  const openChange = (next: boolean) => {
    if (next) {
      update();
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
    <div ref={dialog} className="di-date-range-dialog">
      {narrow ? (
        <div className="di-date-range-grip" {...drag}>
          <span className="di-date-range-handle" aria-hidden />
          <span className="di-date-range-sheet-title">{labels.dialog}</span>
        </div>
      ) : null}
      <PresetList
        label={labels.presets}
        options={[...options, "custom" as const].map((key) => ({ key, label: labels[key] }))}
        selected={current}
        onChoose={(key) => {
          if (key === "any") choose({});
          else if (key === "custom") focusCalendar();
          else choose({ preset: key });
        }}
      />
      <div className="di-date-range-custom">
        <div className="di-date-range-dates">
          <TypedDay
            id={`${id}-from-date`}
            label={labels.fromDate}
            locale={locale}
            emptyLabel={labels.empty}
            value={typed.from}
            onChange={(from) => setTyped({ ...typed, from })}
          />
          {openEnd ? null : (
            <TypedDay
              id={`${id}-to-date`}
              label={labels.toDate}
              locale={locale}
              emptyLabel={labels.empty}
              value={typed.to}
              error={typedRange.state === "reversed" ? labels.reversed : ""}
              onChange={(to) => setTyped({ ...typed, to })}
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
        <MonthCalendar
          className="di-date-range-calendar"
          monthsClassName="di-date-range-months"
          range
          months={narrow ? 1 : 2}
          locale={locale}
          weekStartsOn={weekStartsOn}
          today={today(timeZone)}
          selected={draft}
          focusDay={draft?.end ?? today(timeZone)}
          gridLabel={labels.custom}
          labels={labels}
          onSelect={(range) => {
            setTyped({ from: range.start.toString(), to: range.end.toString() });
            setOpenEnd(false);
          }}
        />
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
                <RangeTime
                  id={`${id}-from-time`}
                  label={labels.fromTime}
                  locale={locale}
                  emptyLabel={labels.empty}
                  value={times.from}
                  onChange={(from) => setTimes({ ...times, from })}
                />
                {openEnd ? null : (
                  <RangeTime
                    id={`${id}-to-time`}
                    label={labels.toTime}
                    locale={locale}
                    emptyLabel={labels.empty}
                    value={times.to}
                    onChange={(to) => setTimes({ ...times, to })}
                  />
                )}
              </div>
            )}
          </div>
        )}
        {narrow ? null : foot}
      </div>
      {narrow ? foot : null}
    </div>
  );

  const trigger = {
    ref: root,
    id,
    disabled,
    "aria-label": `${label}: ${text}`,
    className: cx("di-control", "di-date-range", isDateRangeSet(value) && "is-set", className),
    children: (
      <>
        <CalendarDays className="di-date-range-icon" aria-hidden />
        <span className="di-date-range-text">{text}</span>
        <ChevronDown className="di-date-range-caret" aria-hidden />
      </>
    ),
  };

  if (narrow) {
    return (
      <Dialog.Root open={open} onOpenChange={openChange}>
        <Dialog.Trigger {...trigger} />
        <Dialog.Portal container={overlay.container}>
          <Dialog.Backdrop className="di-date-range-scrim" data-theme={overlay.theme} />
          <Dialog.Popup
            ref={sheet}
            onKeyDown={wrapTab}
            className="di-date-range-sheet"
            data-theme={overlay.theme}
            aria-label={labels.dialog}
          >
            {content}
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    );
  }
  return (
    <Popover.Root open={open} onOpenChange={openChange}>
      <Popover.Trigger {...trigger} />
      <Popover.Portal container={overlay.container}>
        <Popover.Positioner
          data-theme={overlay.theme}
          side="bottom"
          align="start"
          sideOffset={4}
          style={{ zIndex: 100 }}
        >
          <Popover.Popup className="di-date-range-popover" aria-label={labels.dialog}>
            {content}
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
