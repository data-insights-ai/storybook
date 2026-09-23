import type { InputHTMLAttributes, ReactNode } from "react";
import { AlertCircle } from "lucide-react";
import { cx } from "../cx";
import { SealMark } from "./Seal";
import "./Field.css";
import "./TextField.css";

/**
 * Label above, control, then one line beneath it. An error replaces the
 * hint rather than stacking under it, so the field never argues with
 * itself. A sealed hint is a resolved value the register can vouch for.
 */
export function TextField({
  id,
  label,
  hint = "",
  error = "",
  sealHint = "",
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
  /** Helper text under the field. Empty means no hint. */
  hint?: string;
  /** Replaces the hint and marks the control invalid. Empty means valid. */
  error?: string;
  /** A resolved value under the field, carrying the seal. Empty means none. */
  sealHint?: string;
  /** Identifiers, hashes and timestamps are typed in the mono track. */
  mono?: boolean;
  /** Slot beside the label, for example a “Forgot password?” link. */
  children?: ReactNode;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "children">) {
  const invalid = error !== "";
  const describedBy = invalid ? `${id}-error` : hint !== "" ? `${id}-hint` : undefined;

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
        aria-describedby={describedBy}
        {...props}
      />
      {invalid ? (
        <div className="di-field-error" id={`${id}-error`}>
          <AlertCircle aria-hidden />
          <span>{error}</span>
        </div>
      ) : sealHint !== "" ? (
        <div className="di-field-seal">
          <SealMark state="sealed" />
          <span>{sealHint}</span>
        </div>
      ) : hint !== "" ? (
        <div className="di-field-hint" id={`${id}-hint`}>
          {hint}
        </div>
      ) : null}
    </div>
  );
}
