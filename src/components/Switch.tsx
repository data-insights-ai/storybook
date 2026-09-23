import { cx } from "../cx";
import "./Switch.css";

/**
 * Controlled. A switch commits the moment it moves, so the caller owns
 * `on` and decides whether the change needs a confirmation first.
 *
 * It is a button with `role="switch"`, not a checkbox: the state it
 * reports is the state of the system, not of a form.
 */
export function Switch({
  id,
  on,
  onToggle,
  title,
  description = "",
  disabled = false,
  className,
}: {
  id: string;
  on: boolean;
  onToggle: (on: boolean) => void;
  title: string;
  /** A second line under the title. Empty means none. */
  description?: string;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <div className={cx("di-switch-row", disabled && "is-disabled", className)}>
      <span className="di-switch-text">
        <label className="di-switch-title" htmlFor={id}>
          {title}
        </label>
        {description === "" ? null : (
          <span className="di-switch-desc" id={`${id}-desc`}>
            {description}
          </span>
        )}
      </span>
      <button
        type="button"
        id={id}
        role="switch"
        aria-checked={on}
        aria-describedby={description === "" ? undefined : `${id}-desc`}
        disabled={disabled}
        className={cx("di-switch", on && "is-on")}
        onClick={() => onToggle(!on)}
      >
        <span className="di-switch-thumb" aria-hidden />
      </button>
    </div>
  );
}
