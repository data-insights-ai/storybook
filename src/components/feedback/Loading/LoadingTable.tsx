import type { CSSProperties, ReactNode } from "react";
import { cx } from "../../../internal/cx";
import "../../tables/DataTable/DataTable.css";
import "./LoadingTable.css";

const widths = [132, 98, 154, 112, 140, 88, 120];

/**
 * The `DataTable` frame with its toolbar, head and rules drawn, bars for the
 * values. Given a `status`, the rows are the status region and wait for the
 * delay, while the frame and the toolbar stand from the first frame.
 */
export function LoadingTable({
  rows,
  index,
  status,
  className,
  children,
}: {
  rows: number;
  index: boolean;
  status?: { label: string; shown: boolean };
  className?: string;
  /** The table's `Toolbar`. */
  children?: ReactNode;
}) {
  return (
    <div className={cx("di-loading-table", index && "is-indexed", className)}>
      {children ? <div className="di-table-toolbar">{children}</div> : null}
      <div
        className={cx("di-loading-table-body", status && "di-delayed")}
        data-shown={status?.shown}
        role={status ? "status" : undefined}
        aria-live={status ? "polite" : undefined}
        aria-label={status?.label}
      >
        {status ? <span className="di-sr">{status.label}</span> : null}
        <div className="di-loading-table-row is-head" aria-hidden>
          {index ? <span className="di-loading-table-index" /> : null}
          <span className="di-loading-bar is-label" style={{ width: 96 }} />
        </div>
        {Array.from({ length: rows }, (_, i) => (
          <div
            key={i}
            className="di-loading-table-row"
            style={{ "--di-skeleton-row": i + 1 } as CSSProperties}
            aria-hidden
          >
            {index ? <span className="di-loading-table-index" /> : null}
            <span className="di-loading-bar" style={{ width: widths[i % widths.length] }} />
            <span className="di-loading-bar is-trailing" />
          </div>
        ))}
      </div>
    </div>
  );
}
