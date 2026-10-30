import { cx } from "../../../internal/cx";
import "./Progress.css";

/**
 * A wait that can be counted: an import, a sync, files on their way. The
 * label says what is running, the count says how far it is, and the bar
 * shows the same share at a glance. Waiting is always counted here; an
 * indeterminate bar tells an operator nothing they can act on, so a wait
 * without a count is `Loading`. A share of a quota ("1 of 10 seats used")
 * is a measurement, not a wait: `LevelMeter`.
 */
export function Progress({
  id,
  label,
  count,
  value,
  max = 100,
  className,
}: {
  id: string;
  /** What is running, e.g. "Importing sources". */
  label: string;
  /** The count in figures, e.g. "1,284 of 4,000". */
  count: string;
  value: number;
  max?: number;
  className?: string;
}) {
  return (
    <div className={cx("di-progress", className)}>
      <div className="di-progress-row">
        <label className="di-progress-label" htmlFor={id}>
          {label}
        </label>
        <span className="di-progress-count">{count}</span>
      </div>
      <progress id={id} className="di-progress-bar" value={value} max={max} />
    </div>
  );
}
