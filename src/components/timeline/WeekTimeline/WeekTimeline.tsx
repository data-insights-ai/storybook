import { cx } from "../../../internal/cx";
import "./WeekTimeline.css";

export type WeekTimelineRow = {
  /** The day, such as "Mon". */
  label: string;
  /** Spans in minutes from 0 (midnight) to 1440, none overlapping. */
  spans: readonly { from: number; to: number }[];
};

const day = 24 * 60;

/**
 * A week at a glance: one row per day, marked where something holds, such
 * as quiet hours. It only shows; `summary` says the same in words for a
 * screen reader.
 */
export function WeekTimeline({
  rows,
  summary,
  ticks = ["00", "06", "12", "18", "24"],
  className,
}: {
  rows: readonly WeekTimelineRow[];
  summary: string;
  /** Labels spread evenly under the rows. */
  ticks?: readonly string[];
  className?: string;
}) {
  return (
    <figure className={cx("di-week", className)} role="img" aria-label={summary}>
      {rows.map((r) => (
        <div className="di-week-row" key={r.label} aria-hidden>
          <span className="di-week-label">{r.label}</span>
          <span className="di-week-track">
            {r.spans.map((s) => (
              <span
                key={`${s.from}-${s.to}`}
                className="di-week-span"
                style={{ left: `${(s.from / day) * 100}%`, width: `${((s.to - s.from) / day) * 100}%` }}
              />
            ))}
          </span>
        </div>
      ))}
      <div className="di-week-row" aria-hidden>
        <span className="di-week-label" />
        <span className="di-week-ticks">
          {ticks.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </span>
      </div>
    </figure>
  );
}
