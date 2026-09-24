import type { CSSProperties } from "react";
import { cx } from "../cx";
import "./SkeletonTable.css";

/**
 * The skeleton is the real grid — its rules and its index column drawn,
 * bars standing in for the values.
 *
 * The bars breathe; the frame does not. What moves is exactly what is
 * not known yet, so the motion says "these values are still coming"
 * rather than "this whole surface is provisional". Still no shimmer
 * sweep: a gradient travelling across a register reads as a scan the
 * system is not running, and it is the one loading animation every other
 * tool in this field already uses.
 *
 * Rows start one stagger apart, so the wait reads top to bottom the way
 * the register itself does.
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
        <div
          key={i}
          className="di-skeleton-row"
          style={{ "--di-skeleton-row": i + 1 } as CSSProperties}
          aria-hidden
        >
          <span className="di-skeleton-index" />
          <span className="di-skeleton-bar" style={{ width: widths[i % widths.length] }} />
          <span className="di-skeleton-bar is-trailing" />
        </div>
      ))}
    </div>
  );
}
