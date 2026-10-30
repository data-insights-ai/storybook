import { useId, type ReactNode } from "react";
import { Clock } from "lucide-react";
import { cx } from "../../../../internal/cx";
import type { LabelTrack } from "../../field/Field";
import { FieldLabel } from "../../field/FieldLabel";
import { FieldHint, type HintTone } from "../../field/FieldHint";
import { SegmentedInput, emptySegmentLabels } from "../segments";
import "../../field/Field/Field.css";
import "../Calendar.css";
import "../DateField/DateField.css";

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
  emptyLabel = emptySegmentLabels.en,
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
  /** What a screen reader says for an empty segment; `emptySegmentLabels` has it in English, German and Spanish. */
  emptyLabel?: string;
  className?: string;
  /** Slot beside the label. */
  children?: ReactNode;
}) {
  const labelId = `${useId()}-label`;
  const invalid = hint !== "" && hintTone === "error";
  const describedBy = hint === "" ? undefined : `${id}-hint`;
  return (
    <div className={cx("di-field", "di-time-field", className)}>
      <FieldLabel id={labelId} label={label} labelTrack={labelTrack} hideLabel={hideLabel} required={required}>
        {children}
      </FieldLabel>
      <div
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
          kind="time"
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
        <Clock className="di-time-field-icon" aria-hidden />
      </div>
      <FieldHint id={`${id}-hint`} tone={hintTone}>
        {hint}
      </FieldHint>
    </div>
  );
}
