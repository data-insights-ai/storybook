import type { CSSProperties } from "react";
import { cx } from "../../../internal/cx";
import "./LevelMeter.css";

/** Where the warn and danger zones of the scale start, in the scale's own units. */
export type LevelBands = { warn: number; danger: number };

const DEFAULT_BANDS: LevelBands = { warn: 50, danger: 75 };

const share = (value: number, max: number) => Math.min(Math.max(value, 0), max) / max;

const lit = (value: number, max: number, segments: number) => Math.round(share(value, max) * segments);

const meter = (label: string, value: number, max: number, valueText?: string) => ({
  role: "meter",
  "aria-valuetext": valueText,
  "aria-label": label,
  "aria-valuemin": 0,
  "aria-valuemax": max,
  "aria-valuenow": value,
});

/** The tone of the whole fill, when the reading is itself a state rather than a level on bands. */
export type LevelTone = "neutral" | "warn" | "danger";

/**
 * One measured value on a fixed scale: a load, a quota, a share of a
 * whole, how sure a model was. The filled length is the value; the figure
 * is printed beside it by the caller, so the fill is the second channel.
 *
 * Use it for one value that a reader compares against the scale's ends:
 * a host's load in a table row, "7 of 10 seats", one row of a breakdown
 * (`Distribution` draws its rows with it), the confidence under a field.
 * Not for a value over time (`TrendChart`), a wait with a count
 * (`Progress`), or a severity (`SeverityMark`).
 *
 * Anatomy: the track, its fill, and an optional comparison track beneath.
 * `segments` draws the scale as a run of square segments (default 30), so
 * the reading is counted against the scale; `"continuous"` draws one thin
 * bar, for a row of a list or a rule under a field.
 *
 * Tone: with `bands`, a segment takes the tone of the zone it starts in, so
 * a reading that reaches the danger band ends in danger and a low one never
 * leaves the series colour. `tone` instead colours the whole fill, for a
 * reading that is itself a state (findings that block, a confidence to
 * review). The words beside it name the state, so colour is never the only
 * channel.
 *
 * `compare` adds a thin track beneath: the same scale at another point, in
 * the comparison colour (`--di-chart-compare`, cornflower), so the eye
 * reads the difference between two lengths rather than between two
 * numbers. `null` draws the track empty, for a point at which nothing was
 * on record, which is not the same as zero.
 *
 * Accessibility: `role="meter"` with `aria-valuenow`, `-min` and `-max`,
 * named by `label`; an empty comparison track is an image named by
 * `compareLabel`.
 */
export function LevelMeter({
  label,
  value,
  max = 100,
  segments = 30,
  bands = DEFAULT_BANDS,
  tone,
  valueText,
  compare,
  compareLabel = "",
  className,
}: {
  /** The accessible name of the reading. */
  label: string;
  value: number;
  max?: number;
  /** A count of square segments, or `"continuous"` for one thin bar. */
  segments?: number | "continuous";
  /** Where the warn and danger zones start. Ignored when `tone` is set. */
  bands?: LevelBands;
  /** Colours the whole fill: the reading is a state, not a level on bands. */
  tone?: LevelTone;
  /** The reading as people say it, when the number alone is not: "1,842 of 4,182". */
  valueText?: string;
  /** The reading at the comparison point. Omit for no comparison track. */
  compare?: number | null;
  /** The accessible name of the comparison track. Required with `compare`. */
  compareLabel?: string;
  className?: string;
}) {
  const continuous = segments === "continuous";
  const count = continuous ? 1 : segments;
  const zoneOf = (from: number) =>
    tone !== undefined
      ? tone === "neutral"
        ? undefined
        : `is-${tone}`
      : from >= bands.danger
        ? "is-danger"
        : from >= bands.warn
          ? "is-warn"
          : undefined;
  const reading = continuous ? (
    <span
      className={cx("di-level-fill", zoneOf(tone === undefined ? value : 0))}
      style={{ "--di-level-share": `${share(value, max) * 100}%` } as CSSProperties}
    />
  ) : (
    Array.from({ length: count }, (_, i) => (
      <span
        key={i}
        className={cx(
          "di-level-seg",
          i < lit(value, max, count) && "is-on",
          i < lit(value, max, count) && zoneOf((i / count) * max),
        )}
      />
    ))
  );
  const then = compare == null ? 0 : compare;
  const comparison = continuous ? (
    <span className="di-level-fill" style={{ "--di-level-share": `${share(then, max) * 100}%` } as CSSProperties} />
  ) : (
    Array.from({ length: count }, (_, i) => (
      <span key={i} className={cx("di-level-seg", i < lit(then, max, count) && "is-on")} />
    ))
  );

  return (
    <div
      className={cx("di-level", continuous && "is-continuous", className)}
      style={continuous ? undefined : ({ "--di-level-segments": count } as CSSProperties)}
    >
      <div className="di-level-track" {...meter(label, value, max, valueText)}>
        {reading}
      </div>
      {compare === undefined ? null : (
        <div
          className="di-level-track is-compare"
          {...(compare === null ? { role: "img", "aria-label": compareLabel } : meter(compareLabel, compare, max))}
        >
          {comparison}
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
