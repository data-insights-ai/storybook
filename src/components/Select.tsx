import type { ReactNode, SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cx } from "../cx";
import "./Field.css";
import "./Select.css";

/**
 * A native select. The caller maps its own data into `option` children,
 * so the control never owns a list it cannot see.
 */
export function Select({
  id,
  label,
  hint = "",
  error = "",
  mono = true,
  className,
  disabled = false,
  required = false,
  children,
  ...props
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  /** A select usually holds an identifier or a range, so mono is the default. */
  mono?: boolean;
  disabled?: boolean;
  required?: boolean;
  children: ReactNode;
} & Omit<SelectHTMLAttributes<HTMLSelectElement>, "children">) {
  const invalid = error !== "";
  const describedBy = invalid ? `${id}-error` : hint !== "" ? `${id}-hint` : undefined;

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
          aria-describedby={describedBy}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="di-select-caret" aria-hidden />
      </div>
      {invalid ? (
        <div className="di-field-error" id={`${id}-error`}>
          <span>{error}</span>
        </div>
      ) : hint !== "" ? (
        <div className="di-field-hint" id={`${id}-hint`}>
          {hint}
        </div>
      ) : null}
    </div>
  );
}
