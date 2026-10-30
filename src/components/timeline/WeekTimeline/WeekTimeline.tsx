import { PeriodTimeline } from "../PeriodTimeline";

/**
 * One day of the earlier week view.
 *
 * @deprecated Removed in 0.12.0. Use a `PeriodRow` of `PeriodTimeline`, the spans in minutes.
 */
export type WeekTimelineRow = {
  /** The day, such as "Mon". */
  label: string;
  /** Spans in minutes from 0 (midnight) to 1440, none overlapping. */
  spans: readonly { from: number; to: number }[];
};

const day = 24 * 60;

/**
 * A week at a glance, one row per day.
 *
 * @deprecated Removed in 0.12.0. Use `PeriodTimeline` with `from={0}`,
 * `to={1440}`, one row per day whose spans are `{ start, end, tone: "ok" }`
 * in minutes, the hours as `ticks`, and `summary`.
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
    <PeriodTimeline
      className={className}
      label={summary}
      summary={summary}
      from={0}
      to={day}
      rows={rows.map((row) => ({
        id: row.label,
        label: row.label,
        spans: row.spans.map((s) => ({ start: s.from, end: s.to, tone: "ok" as const })),
      }))}
      ticks={ticks.map((label, i) => ({ at: (i / Math.max(ticks.length - 1, 1)) * day, label }))}
    />
  );
}
