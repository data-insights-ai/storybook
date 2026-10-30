import type { CSSProperties } from "react";
import { cx } from "../../../internal/cx";
import "./LoadingTable.css";

const widths = [132, 98, 154, 112, 140, 88, 120];

/** The `DataTable` frame with its head and rules drawn, bars for the values. */
export function LoadingTable({ rows, index }: { rows: number; index: boolean }) {
  return (
    <div className={cx("di-loading-table", index && "is-indexed")} aria-hidden>
      <div className="di-loading-table-row is-head">
        {index ? <span className="di-loading-table-index" /> : null}
        <span className="di-loading-bar is-label" style={{ width: 96 }} />
      </div>
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="di-loading-table-row" style={{ "--di-skeleton-row": i + 1 } as CSSProperties}>
          {index ? <span className="di-loading-table-index" /> : null}
          <span className="di-loading-bar" style={{ width: widths[i % widths.length] }} />
          <span className="di-loading-bar is-trailing" />
        </div>
      ))}
    </div>
  );
}
