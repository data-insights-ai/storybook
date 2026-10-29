import type { InputHTMLAttributes, ReactNode } from "react";
import { cx } from "../../../../internal/cx";
import { FieldHint, type HintTone } from "../../field/FieldHint";
import type { LabelTrack } from "../../field/Field";
import "../../field/Field/Field.css";

/**
 * Label above, control, then one line beneath it. There is only ever one
 * such line, so the field cannot argue with itself: `hint` is the text
 * and `hintTone` is what it means — help, a sealed value, or an error
 * that also marks the control invalid.
 */
export function TextField({
  id,
  label,
  hint = "",
  hintTone = "neutral",
  labelTrack = "record",
  hideLabel = false,
  mono = false,
  className,
  disabled = false,
  readOnly = false,
  required = false,
  children,
  ...props
}: {
  id: string;
  label: string;
  /** The line under the field. Empty means none. */
  hint?: string;
  /** What that line is. `error` also marks the control invalid. */
  hintTone?: HintTone;
  /**
   * Which track the label runs in. `record` is the interface label
   * style (`--di-label-*`); `prose` is the body step in ink, for a form a person
   * fills in for themselves.
   */
  labelTrack?: LabelTrack;
  /**
   * Keeps the label for assistive technology only, for a field whose
   * place already names it, such as a date in a list toolbar.
   */
  hideLabel?: boolean;
  /** Identifiers, hashes and timestamps are typed in the mono track. */
  mono?: boolean;
  /** Slot beside the label, for example a “Forgot password?” link. */
  children?: ReactNode;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "children">) {
  const invalid = hint !== "" && hintTone === "error";

  return (
    <div className={cx("di-field", className)}>
      <div className={cx("di-field-row", hideLabel && "di-sr")}>
        <label className={cx("di-field-label", `di-field-label-${labelTrack}`)} htmlFor={id}>
          {label}
        </label>
        {children}
      </div>
      <input
        id={id}
        className={cx("di-control", mono && "di-control-mono")}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        aria-invalid={invalid || undefined}
        aria-describedby={hint === "" ? undefined : `${id}-hint`}
        {...props}
      />
      <FieldHint id={`${id}-hint`} tone={hintTone}>
        {hint}
      </FieldHint>
    </div>
  );
}
