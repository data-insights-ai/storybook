import { cx } from "../cx";
import { TickRule } from "./Seal";
import "./StatTile.css";

/**
 * One measured value, with its index. The figure runs in the mono track
 * with tabular figures, so a column of tiles does not jitter as the
 * numbers update.
 *
 * The delta names its own direction in words as well as colour: a
 * screen reader hears "down 12 percent", not a green or a red.
 */
export function StatTile({
  index,
  label,
  value,
  delta = "",
  deltaTone = "ok",
  tone = "default",
  compact = false,
  ruled = false,
  className,
}: {
  index: string;
  label: string;
  value: string;
  /** The change since the last reading. Empty means none. */
  delta?: string;
  deltaTone?: "ok" | "warn" | "danger";
  /** `danger` is a value that crossed a threshold, not a styling choice. */
  tone?: "default" | "danger";
  compact?: boolean;
  /** Closes the tile on the tick scale. For a tile that reports a measurement. */
  ruled?: boolean;
  className?: string;
}) {
  return (
    <div className={cx("di-stat-tile", tone === "danger" && "is-danger", className)}>
      <div className="di-stat-tile-index">
        <span className="di-stat-tile-ordinal">{index}</span>
      </div>
      <div className="di-stat-tile-body">
        <p className="di-stat-tile-label">{label}</p>
        <p className={cx("di-stat-tile-value", compact && "is-compact")}>{value}</p>
        {delta === "" ? null : (
          <p className={cx("di-stat-tile-delta", `is-${deltaTone}`)}>{delta}</p>
        )}
        {ruled ? <TickRule /> : null}
      </div>
    </div>
  );
}
