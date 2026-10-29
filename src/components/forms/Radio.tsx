import { cx } from "../../cx";
import { ChoiceText, type ChoiceProps } from "./Choice";

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
