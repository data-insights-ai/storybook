import type { CSSProperties } from "react";
import { cx } from "../../cx";
import "./LevelMeter.css";

/** Where the warn and danger zones of the scale start, in the scale's own units. */
export type LevelBands = { warn: number; danger: number };

const DEFAULT_BANDS: LevelBands = { warn: 50, danger: 75 };

const lit = (value: number, max: number, segments: number) =>
  Math.round((Math.min(Math.max(value, 0), max) / max) * segments);

/**
 * A level on a fixed scale, drawn as a run of segments. A segment takes the
 * tone of the zone it starts in, so a reading that reaches the danger band
 * ends in danger and a low one never leaves the series colour.
 *
 * `compare` adds a thin track beneath: the same scale at another point, in
 * the comparison colour (`--di-chart-compare`, cornflower), so the eye reads the difference between two lengths
 * rather than between two numbers. `null` draws the track empty, for a
 * point at which nothing was on record — that is not the same as zero.
 *
 * The colour is never the only channel. A meter states its value through
 * `aria-valuenow`, and the caller prints the figure beside it.
 */
export function LevelMeter({
  label,
  value,
  max = 100,
  segments = 30,
  bands = DEFAULT_BANDS,
  compare,
  compareLabel = "",
  className,
}: {
  /** The accessible name of the reading. */
  label: string;
  value: number;
  max?: number;
  segments?: number;
  bands?: LevelBands;
  /** The reading at the comparison point. Omit for no comparison track. */
  compare?: number | null;
  /** The accessible name of the comparison track. Required with `compare`. */
  compareLabel?: string;
  className?: string;
}) {
  const style = { "--di-level-segments": segments } as CSSProperties;
  const now = lit(value, max, segments);
  const zone = (i: number) => {
    const from = (i / segments) * max;
    return from >= bands.danger ? "is-danger" : from >= bands.warn ? "is-warn" : undefined;
  };
  const then = compare == null ? 0 : lit(compare, max, segments);

  return (
    <div className={cx("di-level", className)} style={style}>
      <div
        className="di-level-track"
        role="meter"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
      >
        {Array.from({ length: segments }, (_, i) => (
          <span key={i} className={cx("di-level-seg", i < now && "is-on", i < now && zone(i))} />
        ))}
      </div>
      {compare === undefined ? null : (
        <div
          className="di-level-track is-compare"
          {...(compare === null
            ? { role: "img", "aria-label": compareLabel }
            : {
                role: "meter",
                "aria-label": compareLabel,
                "aria-valuemin": 0,
                "aria-valuemax": max,
                "aria-valuenow": compare,
              })}
        >
          {Array.from({ length: segments }, (_, i) => (
            <span key={i} className={cx("di-level-seg", i < then && "is-on")} />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * The scale above a column of meters. The figures are drawn for the eye;
 * a screen reader hears `label` and reads each meter's own range.
 */
export function LevelMeterScale({
  label,
  ticks = [0, 25, 50, 75, 100],
  max = 100,
}: {
  label: string;
  ticks?: number[];
  max?: number;
}) {
  return (
    <span className="di-level-scale">
      <span className="di-sr">{label}</span>
      <span className="di-level-ticks" aria-hidden>
        {ticks.map((tick) => (
          <span
            key={tick}
            className={cx(tick <= 0 && "is-start", tick >= max && "is-end")}
            style={{ "--di-level-at": `${(tick / max) * 100}%` } as CSSProperties}
          >
            {tick}
          </span>
        ))}
      </span>
    </span>
  );
}

/** What the two tracks mean. One per column of meters, above it. */
export function LevelMeterLegend({
  valueLabel,
  compareLabel = "",
}: {
  valueLabel: string;
  /** Omit when the meters carry no comparison track. */
  compareLabel?: string;
}) {
  return (
    <span className="di-level-legend">
      <span className="di-level-key">
        <span className="di-level-swatches" aria-hidden>
          <span />
          <span className="is-warn" />
          <span className="is-danger" />
        </span>
        {valueLabel}
      </span>
      {compareLabel === "" ? null : (
        <span className="di-level-key">
          <span className="di-level-swatch-compare" aria-hidden />
          {compareLabel}
        </span>
      )}
    </span>
  );
}
