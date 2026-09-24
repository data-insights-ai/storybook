import type { ReactNode, SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cx } from "../cx";
import { FieldHint, type HintTone } from "./FieldHint";
import "./Field.css";
import "./Select.css";

/**
 * A native select. The caller maps its own data into `option` children,
 * so the control never owns a list it cannot see.
 *
 * The line under it follows `TextField`: one `hint`, one `hintTone`.
 */
export function Select({
  id,
  label,
  hint = "",
  hintTone = "neutral",
  mono = true,
  className,
  disabled = false,
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
  /** A select usually holds an identifier or a range, so mono is the default. */
  mono?: boolean;
  disabled?: boolean;
  required?: boolean;
  children: ReactNode;
} & Omit<SelectHTMLAttributes<HTMLSelectElement>, "children">) {
  const invalid = hint !== "" && hintTone === "error";

  return (
    <div className={cx("di-field", className)}>
      <label className="di-field-label" htmlFor={id}>
        {label}
      </label>
      <div className="di-select">
        <select
          id={id}
          className={cx("di-control", "di-select-control", mono && "di-control-mono")}
          disabled={disabled}
          required={required}
          aria-invalid={invalid || undefined}
          aria-describedby={hint === "" ? undefined : `${id}-hint`}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="di-select-caret" aria-hidden />
      </div>
      <FieldHint id={`${id}-hint`} tone={hintTone}>
        {hint}
      </FieldHint>
    </div>
  );
}
