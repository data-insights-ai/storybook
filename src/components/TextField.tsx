import type { InputHTMLAttributes, ReactNode } from "react";
import { cx } from "../cx";
import "./TextField.css";

export function TextField({
  id,
  label,
  hint = "",
  className,
  disabled = false,
  readOnly = false,
  required = false,
  children,
  ...props
}: {
  id: string;
  label: string;
  /** Helper text under the field. Empty means no hint. */
  hint?: string;
  /** Slot beside the label, for example a “Forgot password?” link. */
  children?: ReactNode;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "children">) {
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
        className="di-input"
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        {...props}
      />
      {hint ? <div className="di-field-hint">{hint}</div> : null}
    </div>
  );
}
