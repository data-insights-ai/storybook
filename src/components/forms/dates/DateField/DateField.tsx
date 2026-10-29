import { useRef, useState, type ReactNode } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { type CalendarDate, parseDate } from "@internationalized/date";
import {
  Button as AriaButton,
  Calendar,
  CalendarCell,
  CalendarGrid,
  DateInput,
  DatePicker,
  DateSegment,
  Group,
  Label,
  Popover,
} from "react-aria-components/DatePicker";
import { Dialog } from "react-aria-components/Dialog";
import { Heading } from "react-aria-components/Heading";
import { I18nProvider } from "react-aria-components/I18nProvider";
import { cx } from "../../../../internal/cx";
import type { LabelTrack } from "../../field/Field";
import { FieldHint, type HintTone } from "../../field/FieldHint";
import { useOverlayHost } from "../../../../internal/useOverlayHost";
import { weekStartName } from "../dateRange";
import "../../field/Field/Field.css";
import "../Calendar.css";
import "./DateField.css";

/** Every word the field shows besides its label; a product passes its own language. */
export type DateFieldLabels = {
  calendar: string;
  previous: string;
  next: string;
};

export const defaultDateFieldLabels = {
  calendar: "Choose a date",
  previous: "Previous month",
  next: "Next month",
} satisfies DateFieldLabels;

function calendarDate(value: string | undefined): CalendarDate | null {
  if (!value) return null;
  try {
    return parseDate(value);
  } catch {
    return null;
  }
}

/**
 * One day, typed or picked. The day, month and year are typed in segments in
 * the order of the `locale`; the button at the end opens a month calendar in
 * the same look as `DateRangePicker`. The value is an ISO day (`2026-10-29`)
 * or empty, as a native date input gives it, so it can replace one. React
 * Aria owns the segments, the popover and the calendar grid: arrows move by
 * day, Page Up and Page Down by month, Enter picks, Esc closes.
 */
export function DateField({
  id,
  label,
  value,
  onChange,
  locale = "en-GB",
  weekStartsOn = 1,
  min,
  max,
  name,
  hint = "",
  hintTone = "neutral",
  labelTrack = "record",
  hideLabel = false,
  disabled = false,
  readOnly = false,
  required = false,
  labels: labelOverrides = {},
  className,
  children,
}: {
  id: string;
  label: string;
  /** An ISO day, `YYYY-MM-DD`, or empty. */
  value: string;
  onChange: (value: string) => void;
  /** BCP 47 language tag for the order of the segments and the month names. */
  locale?: string;
  /** First day of the week, 0 Sunday … 6 Saturday. */
  weekStartsOn?: number;
  /** The first day that can be chosen, `YYYY-MM-DD`. */
  min?: string;
  /** The last day that can be chosen, `YYYY-MM-DD`. */
  max?: string;
  /** Submits the ISO day with a native form. */
  name?: string;
  /** The line under the field. Empty means none. */
  hint?: string;
  /** What that line is. `error` also marks the control invalid. */
  hintTone?: HintTone;
  labelTrack?: LabelTrack;
  /** Keeps the label for assistive technology only. */
  hideLabel?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  labels?: Partial<DateFieldLabels>;
  className?: string;
  /** Slot beside the label. */
  children?: ReactNode;
}) {
  const labels = { ...defaultDateFieldLabels, ...labelOverrides };
  const root = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const { host, update } = useOverlayHost(root, open);
  const invalid = hint !== "" && hintTone === "error";
  return (
    <I18nProvider locale={locale}>
      <DatePicker
        ref={root}
        id={id}
        className={cx("di-field", "di-date-field", className)}
        value={calendarDate(value)}
        onChange={(day) => onChange(day ? day.toString() : "")}
        minValue={calendarDate(min)}
        maxValue={calendarDate(max)}
        firstDayOfWeek={weekStartName(weekStartsOn)}
        name={name}
        isDisabled={disabled}
        isReadOnly={readOnly}
        isRequired={required}
        isInvalid={invalid}
        shouldForceLeadingZeros
        aria-describedby={hint === "" ? undefined : `${id}-hint`}
        onOpenChange={(next) => {
          if (next) update();
          setOpen(next);
        }}
      >
        <div className={cx("di-field-row", hideLabel && "di-sr")}>
          <Label className={cx("di-field-label", `di-field-label-${labelTrack}`)}>{label}</Label>
          {children}
        </div>
        <Group className="di-control di-date-control">
          <DateInput className="di-date-input">
            {(segment) => <DateSegment segment={segment} className="di-date-segment" />}
          </DateInput>
          <AriaButton className="di-date-field-toggle" aria-label={labels.calendar}>
            <CalendarDays aria-hidden />
          </AriaButton>
        </Group>
        <FieldHint id={`${id}-hint`} tone={hintTone}>
          {hint}
        </FieldHint>
        <Popover
          className="di-date-field-popover"
          data-theme={host.theme}
          UNSTABLE_portalContainer={host.container}
          placement="bottom start"
          offset={4}
        >
          <Dialog className="di-date-field-dialog" aria-label={labels.calendar}>
            <Calendar className="di-date-field-calendar">
              <header className="di-calendar-head">
                <AriaButton slot="previous" className="di-calendar-nav" aria-label={labels.previous}>
                  <ChevronLeft aria-hidden />
                </AriaButton>
                <Heading className="di-calendar-heading" />
                <AriaButton slot="next" className="di-calendar-nav" aria-label={labels.next}>
                  <ChevronRight aria-hidden />
                </AriaButton>
              </header>
              <CalendarGrid className="di-calendar-grid">
                {(date) => <CalendarCell date={date} className="di-calendar-cell" />}
              </CalendarGrid>
            </Calendar>
          </Dialog>
        </Popover>
      </DatePicker>
    </I18nProvider>
  );
}
