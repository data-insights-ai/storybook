import type { InputHTMLAttributes, ReactNode } from "react";
import { cx } from "../cx";
import { FieldHint, type HintTone } from "./FieldHint";
import "./Field.css";
import "./TextField.css";

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
      <div className="di-field-row">
        <label className="di-field-label" htmlFor={id}>
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
