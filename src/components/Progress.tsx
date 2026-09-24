import { cx } from "../cx";
import "./Progress.css";

/**
 * Waiting is always counted. An indeterminate bar with no end tells an
 * operator nothing they can act on, so this one states where it is.
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
  label: string;
  /** The count in words, e.g. "1,284 of 4,000". */
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
