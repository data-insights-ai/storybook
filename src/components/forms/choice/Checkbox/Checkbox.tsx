import { useEffect, useRef } from "react";
import { Check, Minus } from "lucide-react";
import { cx } from "../../../../internal/cx";
import { ChoiceText, type ChoiceProps } from "../Choice";

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
