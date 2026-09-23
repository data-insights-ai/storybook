import { cx } from "../cx";
import "./Waiting.css";

/**
 * The skeleton is the real grid — its rules and its index column drawn,
 * bars standing in for the values. No shimmer sweep: a surface that
 * moves while it has nothing to say is noise.
 */
export function SkeletonTable({
  rows = 5,
  label,
  className,
}: {
  rows?: number;
  /** What a screen reader hears while the grid is empty. */
  label: string;
  className?: string;
}) {
  const widths = [132, 98, 154, 112, 140, 88, 120];
  return (
    <div className={cx("di-skeleton", className)} role="status" aria-live="polite">
      <span className="di-sr">{label}</span>
      <div className="di-skeleton-row is-header" aria-hidden>
        <span className="di-skeleton-index" />
        <span className="di-skeleton-bar is-header" style={{ width: 96 }} />
      </div>
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="di-skeleton-row" aria-hidden>
          <span className="di-skeleton-index" />
          <span className="di-skeleton-bar" style={{ width: widths[i % widths.length] }} />
          <span className="di-skeleton-bar is-trailing" />
        </div>
      ))}
    </div>
  );
}

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

/**
 * For a wait too short to count. It carries a word, because a ring
 * turning on its own does not say what is being waited for.
 */
export function Spinner({ label, className }: { label: string; className?: string }) {
  return (
    <div className={cx("di-spinner-row", className)} role="status">
      <span className="di-spinner" aria-hidden />
      <span className="di-spinner-label">{label}</span>
    </div>
  );
}
