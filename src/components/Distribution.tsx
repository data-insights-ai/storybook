import { cx } from "../cx";
import "./Distribution.css";

/**
 * A ranked breakdown: each row states its own value, and the bar is the
 * second channel rather than the only one.
 */
export function Distribution({
  rows,
  totalLabel,
  totalValue,
  className,
}: {
  rows: { label: string; value: string; percent: number }[];
  totalLabel: string;
  totalValue: string;
  className?: string;
}) {
  return (
    <div className={cx("di-distribution", className)}>
      {rows.map((row) => (
        <div key={row.label} className="di-distribution-row">
          <div className="di-distribution-head">
            <span className="di-distribution-label">{row.label}</span>
            <span className="di-distribution-value">{row.value}</span>
          </div>
          <div className="di-distribution-track">
            <div className="di-distribution-fill" style={{ width: `${row.percent}%` }} />
          </div>
        </div>
      ))}
      <div className="di-distribution-total">
        <span className="di-distribution-total-label">{totalLabel}</span>
        <span className="di-distribution-total-value">{totalValue}</span>
      </div>
    </div>
  );
}
