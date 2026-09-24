import { cx } from "../cx";
import "./Switch.css";

/**
 * Controlled. A switch commits the moment it moves, so the caller owns
 * `on` and decides whether the change needs a confirmation first.
 *
 * It is a button with `role="switch"`, not a checkbox: the state it
 * reports is the state of the system, not of a form.
 *
 * `layout` decides where the control sits, and it is always a decision.
 * `inline` is the default and matches `Checkbox` and `Radio`: the control
 * leads, the title follows one gap later. `row` pushes the control to the
 * trailing edge so a column of switches lines up down a settings sheet —
 * the distance there is the column, not slack.
 */
export function Switch({
  id,
  on,
  onToggle,
  title,
  description = "",
  layout = "inline",
  disabled = false,
  className,
}: {
  id: string;
  on: boolean;
  onToggle: (on: boolean) => void;
  title: string;
  /** A second line under the title. Empty means none. */
  description?: string;
  /** `row` puts the control at the trailing edge, for a settings column. */
  layout?: "inline" | "row";
  disabled?: boolean;
  className?: string;
}) {
  const control = (
    <span className="di-switch-control">
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
    </span>
  );

  const text = (
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
  );

  return (
    <div className={cx("di-switch-row", `is-${layout}`, disabled && "is-disabled", className)}>
      {layout === "inline" ? control : text}
      {layout === "inline" ? text : control}
    </div>
  );
}
