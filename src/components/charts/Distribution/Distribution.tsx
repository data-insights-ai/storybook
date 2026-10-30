import { cx } from "../../../internal/cx";
import { LevelMeter } from "../../status/LevelMeter";
import "./Distribution.css";

/**
 * A ranked breakdown: each row states its own value, and its `LevelMeter`
 * bar is the second channel rather than the only one. Each bar is a meter
 * on 0 to 100 %, so a screen reader hears the share as well as the count.
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
          <LevelMeter
            className="di-distribution-meter"
            label={row.label}
            value={row.percent}
            valueText={`${row.value}, ${row.percent}%`}
            segments="continuous"
            tone={row.tone ?? "neutral"}
          />
        </div>
      ))}
      <div className="di-distribution-total">
        <span className="di-distribution-total-label">{totalLabel}</span>
        <span className="di-distribution-total-value">{totalValue}</span>
      </div>
    </div>
  );
}
