import { useEffect, useRef, type InputHTMLAttributes, type ReactNode } from "react";
import { Check, Minus } from "lucide-react";
import { cx } from "../../cx";
import "./Choice.css";

type ChoiceProps = {
  id: string;
  /** The choice, in one line of prose. */
  label: string;
  /** A second line under the label. Empty means none. */
  description?: string;
  disabled?: boolean;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

type CheckboxProps = ChoiceProps & {
  /** Some, not all, of what the box stands for is chosen: a group of boxes under it. */
  indeterminate?: boolean;
  /**
   * The label is read, not shown: a box that selects a table row, where the
   * row's name stands beside it already.
   */
  hideLabel?: boolean;
};

/**
 * A native checkbox under a drawn square. The input keeps the keyboard
 * and the accessibility tree; the square is only paint.
 *
 * The square centres on the first line of the label, so a single-line
 * choice reads as centred and a described one still hangs off line one.
 *
 * Indeterminate is a property of the input, not an attribute, so it is set
 * after render; the dash shows it and a screen reader hears "mixed".
 */
export function Checkbox({
  id,
  label,
  description = "",
  className,
  disabled = false,
  indeterminate = false,
  hideLabel = false,
  ...props
}: CheckboxProps) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);
  return (
    <div className={cx("di-choice", disabled && "is-disabled", hideLabel && "is-bare", className)}>
      <span className="di-choice-control">
        <span className="di-choice-mark">
          <input
            ref={ref}
            id={id}
            type="checkbox"
            className="di-choice-input"
            disabled={disabled}
            aria-describedby={description === "" ? undefined : `${id}-desc`}
            {...props}
          />
          <span className="di-choice-box" aria-hidden>
            <Check className="di-choice-check" />
            <Minus className="di-choice-dash" />
          </span>
        </span>
      </span>
      <ChoiceText id={id} label={label} description={description} hidden={hideLabel} />
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
  hidden = false,
}: {
  id: string;
  label: string;
  description: string;
  hidden?: boolean;
}) {
  return (
    <span className={cx("di-choice-text", hidden && "di-sr")}>
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
