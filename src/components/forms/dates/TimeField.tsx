import type { ReactNode } from "react";
import { Clock } from "lucide-react";
import { type Time, parseTime } from "@internationalized/date";
import { I18nProvider } from "react-aria-components/I18nProvider";
import { TimeField as AriaTimeField, DateInput, DateSegment, Label } from "react-aria-components/TimeField";
import { cx } from "../../../cx";
import type { LabelTrack } from "../Field";
import { FieldHint, type HintTone } from "../FieldHint";
import "../Field.css";
import "./Calendar.css";
import "./DateField.css";

function timeOf(value: string): Time | null {
  if (!value) return null;
  try {
    return parseTime(value);
  } catch {
    return null;
  }
}

const twoDigits = (n: number) => String(n).padStart(2, "0");

/**
 * A time of day in hours and minutes, typed in segments: 24 or 12 hours as
 * the `locale` writes them, arrows step a segment. The value is `HH:MM` in
 * 24 hours, or empty, as a native time input gives it, so it can replace one.
 */
export function TimeField({
  id,
  label,
  value,
  onChange,
  locale = "en-GB",
  name,
  hint = "",
  hintTone = "neutral",
  labelTrack = "record",
  hideLabel = false,
  disabled = false,
  readOnly = false,
  required = false,
  className,
  children,
}: {
  id: string;
  label: string;
  /** `HH:MM` in 24 hours, or empty. */
  value: string;
  onChange: (value: string) => void;
  /** BCP 47 language tag; it decides between 24 and 12 hours. */
  locale?: string;
  /** Submits the time with a native form. */
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
  className?: string;
  /** Slot beside the label. */
  children?: ReactNode;
}) {
  const invalid = hint !== "" && hintTone === "error";
  return (
    <I18nProvider locale={locale}>
      <AriaTimeField
        id={id}
        className={cx("di-field", "di-time-field", className)}
        value={timeOf(value)}
        onChange={(time) => onChange(time ? `${twoDigits(time.hour)}:${twoDigits(time.minute)}` : "")}
        name={name}
        isDisabled={disabled}
        isReadOnly={readOnly}
        isRequired={required}
        isInvalid={invalid}
        shouldForceLeadingZeros
        aria-describedby={hint === "" ? undefined : `${id}-hint`}
      >
        <div className={cx("di-field-row", hideLabel && "di-sr")}>
          <Label className={cx("di-field-label", `di-field-label-${labelTrack}`)}>{label}</Label>
          {children}
        </div>
        <div className="di-control di-date-control">
          <DateInput className="di-date-input">
            {(segment) => <DateSegment segment={segment} className="di-date-segment" />}
          </DateInput>
          <Clock className="di-time-field-icon" aria-hidden />
        </div>
        <FieldHint id={`${id}-hint`} tone={hintTone}>
          {hint}
        </FieldHint>
      </AriaTimeField>
    </I18nProvider>
  );
}
