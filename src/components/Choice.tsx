import type { InputHTMLAttributes, ReactNode } from "react";
import { Check } from "lucide-react";
import { cx } from "../cx";
import "./Choice.css";

/**
 * A native checkbox under a drawn square. The input keeps the keyboard
 * and the accessibility tree; the square is only paint.
 */
export function Checkbox({
  id,
  label,
  description = "",
  className,
  disabled = false,
  ...props
}: {
  id: string;
  label: ReactNode;
  /** A second line under the label. Empty means none. */
  description?: string;
  disabled?: boolean;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "type">) {
  return (
    <div className={cx("di-choice", disabled && "is-disabled", className)}>
      <span className="di-choice-control">
        <input
          id={id}
          type="checkbox"
          className="di-choice-input"
          disabled={disabled}
          aria-describedby={description === "" ? undefined : `${id}-desc`}
          {...props}
        />
        <span className="di-choice-box" aria-hidden>
          <Check />
        </span>
      </span>
      <span className="di-choice-text">
        <label className="di-choice-label" htmlFor={id}>
          {label}
        </label>
        {description === "" ? null : (
          <span className="di-choice-desc" id={`${id}-desc`}>
            {description}
          </span>
        )}
      </span>
    </div>
  );
}

/** A native radio. Group them with a shared `name` inside a fieldset. */
export function Radio({
  id,
  label,
  description = "",
  className,
  disabled = false,
  ...props
}: {
  id: string;
  label: ReactNode;
  description?: string;
  disabled?: boolean;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "type">) {
  return (
    <div className={cx("di-choice", disabled && "is-disabled", className)}>
      <span className="di-choice-control">
        <input
          id={id}
          type="radio"
          className="di-choice-input"
          disabled={disabled}
          aria-describedby={description === "" ? undefined : `${id}-desc`}
          {...props}
        />
        <span className="di-choice-dot" aria-hidden />
      </span>
      <span className="di-choice-text">
        <label className="di-choice-label" htmlFor={id}>
          {label}
        </label>
        {description === "" ? null : (
          <span className="di-choice-desc" id={`${id}-desc`}>
            {description}
          </span>
        )}
      </span>
    </div>
  );
}

/** A fieldset with a visible legend. A radio group needs both. */
export function ChoiceGroup({
  legend,
  className,
  children,
}: {
  legend: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <fieldset className={cx("di-choice-group", className)}>
      <legend className="di-choice-legend">{legend}</legend>
      {children}
    </fieldset>
  );
}
