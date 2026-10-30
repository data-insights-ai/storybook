import { useId, useRef, useState, type ReactNode } from "react";
import { CalendarDays } from "lucide-react";
import { getLocalTimeZone, today } from "@internationalized/date";
import { Popover } from "@base-ui/react/popover";
import { cx } from "../../../../internal/cx";
import type { LabelTrack } from "../../field/Field";
import { FieldHint, type HintTone } from "../../field/FieldHint";
import { useOverlayHost } from "../../../../internal/useOverlayHost";
import { MonthCalendar } from "../calendar";
import { SegmentedInput, emptySegmentLabels } from "../segments";
import { parseTypedDate } from "../dateRange";
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

/**
 * One day, typed or picked. The day, month and year are typed in segments in
 * the order of the `locale`; the button at the end opens a month calendar in
 * the same look as `DateRangePicker`. The value is an ISO day (`2026-10-29`)
 * or empty, as a native date input gives it, so it can replace one. In the
 * calendar arrows move by day, Page Up and Page Down by month, Home and End
 * to the month's first and last day, Enter picks, Esc closes.
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
  emptyLabel = emptySegmentLabels.en,
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
  /** What a screen reader says for an empty segment; `emptySegmentLabels` has it in English, German and Spanish. */
  emptyLabel?: string;
  className?: string;
  /** Slot beside the label. */
  children?: ReactNode;
}) {
  const labels = { ...defaultDateFieldLabels, ...labelOverrides };
  const labelId = `${useId()}-label`;
  const control = useRef<HTMLDivElement>(null);
  const popup = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const { host, update } = useOverlayHost(control, open);
  const invalid = hint !== "" && hintTone === "error";
  const describedBy = hint === "" ? undefined : `${id}-hint`;
  const day = parseTypedDate(value);
  return (
    <Popover.Root
      open={open}
      onOpenChange={(next) => {
        if (next) update();
        setOpen(next);
      }}
    >
      <div className={cx("di-field", "di-date-field", className)}>
        <div className={cx("di-field-row", hideLabel && "di-sr")}>
          <span id={labelId} className={cx("di-field-label", `di-field-label-${labelTrack}`)}>
            {label}
          </span>
          {children}
        </div>
        <div
          ref={control}
          id={id}
          role="group"
          aria-labelledby={labelId}
          aria-describedby={describedBy}
          className="di-control di-date-control"
          aria-disabled={disabled || undefined}
          data-disabled={disabled || undefined}
          data-invalid={invalid || undefined}
        >
          <SegmentedInput
            kind="date"
            className="di-date-input"
            locale={locale}
            value={value}
            onChange={onChange}
            labelledBy={labelId}
            describedBy={describedBy}
            name={name}
            invalid={invalid}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            emptyLabel={emptyLabel}
          />
          <Popover.Trigger
            className="di-date-field-toggle"
            aria-label={labels.calendar}
            disabled={disabled || readOnly}
          >
            <CalendarDays aria-hidden />
          </Popover.Trigger>
        </div>
        <FieldHint id={`${id}-hint`} tone={hintTone}>
          {hint}
        </FieldHint>
      </div>
      <Popover.Portal container={host.container}>
        <Popover.Positioner
          anchor={control}
          data-theme={host.theme}
          side="bottom"
          align="start"
          sideOffset={4}
          style={{ zIndex: 100 }}
        >
          <Popover.Popup
            ref={popup}
            className="di-date-field-popover"
            aria-label={labels.calendar}
            initialFocus={() => popup.current?.querySelector<HTMLElement>('[role="grid"] [tabindex="0"]') ?? true}
          >
            <div className="di-date-field-dialog">
              <MonthCalendar
                className="di-date-field-calendar"
                locale={locale}
                weekStartsOn={weekStartsOn}
                today={today(getLocalTimeZone())}
                min={parseTypedDate(min ?? "")}
                max={parseTypedDate(max ?? "")}
                selected={day ? { start: day, end: day } : null}
                focusDay={day ?? today(getLocalTimeZone())}
                onSelect={({ start }) => {
                  onChange(start.toString());
                  setOpen(false);
                }}
                labels={labels}
              />
            </div>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
