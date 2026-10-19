import type { ReactNode } from "react";
import { cx } from "../cx";
import { TickRule } from "./Seal";
import "./StatTile.css";

/**
 * One measured value, with its index when it has one. The figure runs in the mono track
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
  tone = "neutral",
  compact = false,
  ruled = false,
  className,
  children,
}: {
  /**
   * The ordinal or letter in the index column. Omit for a tile that is not one of a sequence:
   * a row of different measures has no order to number.
   */
  index?: string;
  label: string;
  value: string;
  /** `danger` is a value that crossed a threshold, not a styling choice. */
  tone?: "neutral" | "danger";
  compact?: boolean;
  /** Closes the tile on the tick scale. For a tile that reports a measurement. */
  ruled?: boolean;
  className?: string;
  /** What the figure is read against: a `StatTileDelta`, a `Sparkline`. */
  children?: ReactNode;
}) {
  return (
    <div className={cx("di-stat-tile", tone === "danger" && "is-danger", className)}>
      {index === undefined ? null : (
        <div className="di-stat-tile-index">
          <span className="di-stat-tile-ordinal">{index}</span>
        </div>
      )}
      <div className="di-stat-tile-body">
        <p className="di-stat-tile-label">{label}</p>
        <p className={cx("di-stat-tile-value", compact && "is-compact")}>{value}</p>
        {children}
        {ruled ? <TickRule /> : null}
      </div>
    </div>
  );
}

/**
 * The change since the last reading, under the figure. A slot rather
 * than a `delta` string beside a `deltaTone`, so the same place can hold
 * a `Sparkline` — what a figure is read against is not always a word.
 *
 * The direction is named in the text as well as the colour: a screen
 * reader hears "down 12 percent", never a green or a red.
 */
export function StatTileDelta({
  tone = "ok",
  children,
}: {
  tone?: "ok" | "warn" | "danger";
  children: ReactNode;
}) {
  return <p className={cx("di-stat-tile-delta", `is-${tone}`)}>{children}</p>;
}
