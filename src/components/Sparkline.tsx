import { cx } from "../cx";
import "./Sparkline.css";

/**
 * A bare column chart for a card. `label` describes the shape in words,
 * because a row of bars with no axis is not readable as data.
 */
export function Sparkline({
  bars,
  label,
  className,
}: {
  bars: { percent: number; tone?: "muted" | "series" | "danger" }[];
  label: string;
  className?: string;
}) {
  return (
    <div className={cx("di-sparkline", className)} role="img" aria-label={label}>
      {bars.map((bar, i) => (
        <div
          key={i}
          className={cx("di-sparkline-bar", `is-${bar.tone ?? "muted"}`)}
          style={{ height: `${bar.percent}%` }}
        />
      ))}
    </div>
  );
}
