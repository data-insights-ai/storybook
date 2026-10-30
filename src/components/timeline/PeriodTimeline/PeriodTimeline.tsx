import type { CSSProperties } from "react";
import "./PeriodTimeline.css";

export type Period = {
  id: string;
  label: string;
  /** ISO dates. A period without an end runs to the right edge. */
  start: string;
  end?: string;
  /** After `end`, the time it still works: a license's grace period. */
  graceEnd?: string;
  tone?: "ok" | "warn" | "danger" | "neutral";
  /** What the bar means in words, for the eye and for a screen reader: "valid until 2 Nov 2026". */
  caption: string;
};

const day = (iso: string) => new Date(iso).getTime();

/**
 * Periods on one time axis — licenses, a subscription — with today marked,
 * so what ends soon is seen before it is read. Each row states its period in
 * words; the bar is the second channel. The axis runs from the earliest start
 * to the latest end unless `from` and `to` set it.
 */
export function PeriodTimeline({
  label,
  periods,
  today = new Date().toISOString(),
  todayLabel,
  from,
  to,
  formatDate,
}: {
  label: string;
  periods: Period[];
  today?: string;
  todayLabel: string;
  from?: string;
  to?: string;
  /**
   * Formats an end of the axis. `year` is set when the axis crosses a year
   * or spans more than about eleven months, where day and month alone would
   * not say which year an end is in.
   */
  formatDate: (iso: string, options: { year: boolean }) => string;
}) {
  const ends = periods.flatMap((p) => [p.graceEnd ?? p.end ?? today]);
  const start = from ? day(from) : Math.min(day(today), ...periods.map((p) => day(p.start)));
  const end = to ? day(to) : Math.max(day(today), ...ends.map(day));
  const span = Math.max(end - start, 1);
  const at = (t: number) => `${(Math.min(Math.max(t - start, 0), span) / span) * 100}%`;
  const now = day(today);
  const year = needsYear(start, end);
  return (
    <div
      className="di-periods"
      role="group"
      aria-label={label}
      style={{ "--di-period-today": at(now) } as CSSProperties}
    >
      <ul className="di-periods-rows">
        {periods.map((p) => {
          const s = day(p.start);
          const e = p.end ? day(p.end) : end;
          const g = p.graceEnd ? day(p.graceEnd) : e;
          const style = {
            "--di-period-start": at(s),
            "--di-period-end": at(e),
            "--di-period-grace": at(g),
          } as CSSProperties;
          return (
            <li key={p.id} className={`di-period di-period-${p.tone ?? "neutral"}`} style={style}>
              <span className="di-period-label">{p.label}</span>
              <span className="di-period-track" aria-hidden>
                <span className="di-period-bar" />
                {p.graceEnd ? <span className="di-period-grace" /> : null}
                <span className="di-period-now" />
              </span>
              <span className="di-period-caption">{p.caption}</span>
            </li>
          );
        })}
      </ul>
      <div className="di-period di-periods-axis" aria-hidden>
        <span />
        <span className="di-periods-scale">
          <span>{formatDate(new Date(start).toISOString(), { year })}</span>
          <span className="di-periods-today">{todayLabel}</span>
          <span>{formatDate(new Date(end).toISOString(), { year })}</span>
        </span>
        <span />
      </div>
    </div>
  );
}

const elevenMonths = 335 * 86_400_000;

/** An axis needs years on its ends when they fall in different years or lie more than about eleven months apart. */
export function needsYear(start: number, end: number): boolean {
  return new Date(start).getUTCFullYear() !== new Date(end).getUTCFullYear() || end - start > elevenMonths;
}
