import { cx } from "../cx";
import "./Distribution.css";

/**
 * A ranked breakdown: each row states its own value, and the bar is the
 * second channel rather than the only one.
 *
 * A row's `tone` puts its bar on the status ramp, for a breakdown whose rows
 * are themselves states: open work by priority, findings by severity. The
 * label still names the state, so the colour is never the only channel.
 */
export function Distribution({
  rows,
  totalLabel,
  totalValue,
  className,
}: {
  rows: {
    label: string;
    value: string;
    percent: number;
    tone?: "neutral" | "warn" | "danger";
  }[];
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
            <div
              className={cx("di-distribution-fill", `is-${row.tone ?? "neutral"}`)}
              style={{ width: `${row.percent}%` }}
            />
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
