import type { InputHTMLAttributes, ReactNode } from "react";
import { Check } from "lucide-react";
import { cx } from "../cx";
import "./Choice.css";

type ChoiceProps = {
  id: string;
  /** The choice, in one line of prose. */
  label: string;
  /** A second line under the label. Empty means none. */
  description?: string;
  disabled?: boolean;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

/**
 * A native checkbox under a drawn square. The input keeps the keyboard
 * and the accessibility tree; the square is only paint.
 *
 * The square centres on the first line of the label, so a single-line
 * choice reads as centred and a described one still hangs off line one.
 */
export function Checkbox({
  id,
  label,
  description = "",
  className,
  disabled = false,
  ...props
}: ChoiceProps) {
  return (
    <div className={cx("di-choice", disabled && "is-disabled", className)}>
      <span className="di-choice-control">
        <span className="di-choice-mark">
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
      </span>
      <ChoiceText id={id} label={label} description={description} />
    </div>
  );
}

/** A native radio. Group them with a shared `name` inside a `ChoiceGroup`. */
export function Radio({
  id,
  label,
  description = "",
  className,
  disabled = false,
  ...props
}: ChoiceProps) {
  return (
    <div className={cx("di-choice", disabled && "is-disabled", className)}>
      <span className="di-choice-control">
        <span className="di-choice-mark">
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
      </span>
      <ChoiceText id={id} label={label} description={description} />
    </div>
  );
}

function ChoiceText({
  id,
  label,
  description,
}: {
  id: string;
  label: string;
  description: string;
}) {
  return (
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
