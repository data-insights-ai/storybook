import type { CSSProperties } from "react";
import { cx } from "../../../internal/cx";
import "./PeriodTimeline.css";

/** A place on the axis: an ISO date, or a number on the axis' own scale (minutes of a day, say). */
export type PeriodPoint = string | number;

/** One stretch of a row: a license's term, a night of quiet hours. */
export type PeriodSpan = {
  start: PeriodPoint;
  /** Without an end the span runs to the axis' end. */
  end?: PeriodPoint;
  /** After `end`, the time it still works: a license's grace period, drawn hatched. */
  graceEnd?: PeriodPoint;
  /** `ok` is in force, `warn` ends soon, `danger` has ended, `neutral` has not started. */
  tone?: "ok" | "warn" | "danger" | "neutral";
};

/** One labelled row of spans. */
export type PeriodRow = {
  id: string;
  label: string;
  spans: PeriodSpan[];
  /** The row in words, for the eye and for a screen reader: "valid until 2 Nov 2026". */
  caption?: string;
};

/**
 * One period of the earlier API.
 *
 * @deprecated Removed in 0.12.0. Use a `PeriodRow` with one `PeriodSpan`.
 */
export type Period = {
  id: string;
  label: string;
  start: string;
  end?: string;
  graceEnd?: string;
  tone?: "ok" | "warn" | "danger" | "neutral";
  caption: string;
};

const value = (point: PeriodPoint) => (typeof point === "number" ? point : new Date(point).getTime());

/** Moves the earlier `periods` and `today` props onto rows and a marker. */
export function fromPeriods(periods: Period[], today: string, todayLabel: string) {
  return {
    rows: periods.map(({ id, label, caption, start, end, graceEnd, tone }): PeriodRow => ({
      id,
      label,
      caption,
      spans: [{ start, end, graceEnd, tone }],
    })),
    marker: { at: today, label: todayLabel },
  };
}

/** The axis' ends: `from` and `to` when set, else the earliest and the latest point on it. */
export function axisRange(rows: PeriodRow[], marker?: { at: PeriodPoint }, from?: PeriodPoint, to?: PeriodPoint) {
  const spans = rows.flatMap((row) => row.spans);
  const starts = spans.map((s) => value(s.start));
  const ends = spans.flatMap((s) => [s.graceEnd ?? s.end].filter((p) => p !== undefined).map(value));
  const now = marker ? [value(marker.at)] : [];
  const start = from === undefined ? Math.min(...starts, ...now) : value(from);
  const end = to === undefined ? Math.max(...ends, ...starts, ...now) : value(to);
  return { start, end: Math.max(end, start) };
}

/**
 * Labelled rows of spans on one axis: licenses and a subscription over
 * months, quiet hours over the days of a week. A marker such as today runs
 * through every row, so what ends soon is seen before it is read.
 *
 * Use it for when things hold. Not for counts over time (`TrendChart`), for
 * events at points in time (`EventTimeline`) or for one level on a scale
 * (`LevelMeter`).
 *
 * Anatomy: per row the label, the track with its spans (a grace period
 * hatched after its span) and an optional caption; under the rows the axis,
 * either its two ends or the given `ticks`, and the marker's label on a line
 * of its own.
 *
 * Points are ISO dates or plain numbers on the axis' own scale. Without
 * `ticks` the ends are dates through `formatDate`, with the year when the
 * axis crosses one.
 *
 * Content: a caption says the period in words, so the bar is the second
 * channel. Rows without captions are one picture: `summary` says it in words.
 *
 * Accessibility: with captions the rows are a group named `label`, each
 * read as label and caption; without them the figure is an image named by
 * `summary`.
 */
export function PeriodTimeline({
  label,
  rows: given,
  from,
  to,
  ticks,
  marker: givenMarker,
  formatDate,
  summary,
  className,
  periods,
  today,
  todayLabel,
}: {
  /** The accessible name of the rows. */
  label: string;
  rows?: PeriodRow[];
  from?: PeriodPoint;
  to?: PeriodPoint;
  /** Labels under the rows at their own points, in place of the two ends. */
  ticks?: { at: PeriodPoint; label: string }[];
  /** A point that matters in every row, such as today. */
  marker?: { at: PeriodPoint; label: string };
  /**
   * Formats an end of a date axis. `year` is set when the axis crosses a year
   * or spans more than about eleven months, where day and month alone would
   * not say which year an end is in.
   */
  formatDate?: (iso: string, options: { year: boolean }) => string;
  /** The rows in words, when no row has a caption. */
  summary?: string;
  className?: string;
  /** @deprecated Removed in 0.12.0. Use `rows`, one span each. */
  periods?: Period[];
  /** @deprecated Removed in 0.12.0. Use `marker={{ at, label }}`. */
  today?: string;
  /** @deprecated Removed in 0.12.0. Use `marker={{ at, label }}`. */
  todayLabel?: string;
}) {
  const legacy = periods ? fromPeriods(periods, today ?? new Date().toISOString(), todayLabel ?? "") : undefined;
  const rows = given ?? legacy?.rows ?? [];
  const marker = givenMarker ?? legacy?.marker;
  const { start, end } = axisRange(rows, marker, from, to);
  const span = Math.max(end - start, 1);
  const at = (point: number) => `${(Math.min(Math.max(point - start, 0), span) / span) * 100}%`;
  const captioned = rows.some((row) => row.caption !== undefined);
  const year = needsYear(start, end);
  const date = (t: number) => formatDate?.(new Date(t).toISOString(), { year }) ?? String(t);
  const scale = ticks ?? [
    { at: start, label: date(start) },
    { at: end, label: date(end) },
  ];
  const named = captioned ? { role: "group", "aria-label": label } : { role: "img", "aria-label": summary ?? label };

  return (
    <div
      className={cx("di-periods", !captioned && "is-bare", className)}
      {...named}
      style={marker ? ({ "--di-period-today": at(value(marker.at)) } as CSSProperties) : undefined}
    >
      <ul className="di-periods-rows" aria-hidden={captioned ? undefined : true}>
        {rows.map((row) => (
          <li key={row.id} className="di-period">
            <span className="di-period-label">{row.label}</span>
            <span className="di-period-track" aria-hidden>
              {row.spans.map((s) => {
                const e = s.end === undefined ? end : value(s.end);
                const style = {
                  "--di-period-start": at(value(s.start)),
                  "--di-period-end": at(e),
                  "--di-period-grace": at(s.graceEnd === undefined ? e : value(s.graceEnd)),
                } as CSSProperties;
                return (
                  <span
                    key={`${s.start}-${s.end}`}
                    className={`di-period-span di-period-${s.tone ?? "neutral"}`}
                    style={style}
                  >
                    <span className="di-period-bar" />
                    {s.graceEnd === undefined ? null : <span className="di-period-grace" />}
                  </span>
                );
              })}
              {marker ? <span className="di-period-now" /> : null}
            </span>
            {captioned ? <span className="di-period-caption">{row.caption}</span> : null}
          </li>
        ))}
      </ul>
      <div className="di-period di-periods-axis" aria-hidden>
        <span />
        <span className={cx("di-periods-scale", marker && "has-marker")}>
          {scale.map((tick, i) => (
            <span
              key={`${tick.at}-${i}`}
              className={cx(i === 0 && "is-start", i === scale.length - 1 && "is-end")}
              style={{ "--di-period-at": at(value(tick.at)) } as CSSProperties}
            >
              {tick.label}
            </span>
          ))}
          {marker ? <span className="di-periods-today">{marker.label}</span> : null}
        </span>
        {captioned ? <span /> : null}
      </div>
    </div>
  );
}

const elevenMonths = 335 * 86_400_000;

/** An axis needs years on its ends when they fall in different years or lie more than about eleven months apart. */
export function needsYear(start: number, end: number): boolean {
  return new Date(start).getUTCFullYear() !== new Date(end).getUTCFullYear() || end - start > elevenMonths;
}
