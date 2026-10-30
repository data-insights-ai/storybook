import { cx } from "../../../../internal/cx";
import "./Sparkline.css";

/**
 * A row of bars without an axis, read beside a figure: what the number is
 * read against. Use it inside a `Figure` (or beside one in a card). Not for
 * a series a person reads values off (use `TrendChart`, with axes and a
 * tooltip), nor for a share of a whole (`Distribution`).
 *
 * Anatomy: the bars, oldest first; at most one marked bar, the reading the
 * figure reports (now, today), so the eye goes to one place; optional
 * captions for the start, middle and end of the period. `width="fixed"`
 * keeps thin bars for a card's line, `fill` spreads them across the
 * column; `height` is `sm` beside a figure, `md` on its own line.
 *
 * Content and accessibility: the bars are one image whose `label` says the
 * shape in words ("rising sharply in the last two hours"), because bars
 * without an axis are not readable as data. The captions stay text.
 */
export function Sparkline({
  values,
  highlight,
  tone = "series",
  label,
  width = "fixed",
  height = "sm",
  captions,
  className,
}: {
  /** Each bar's height as a percentage of the row's, oldest first. */
  values: number[];
  /** The index of the one marked bar; none when nothing is singled out. */
  highlight?: number;
  /** The marked bar's ink: `danger` only when that reading is past a threshold. */
  tone?: "series" | "danger";
  label: string;
  /** `fixed` keeps thin bars at the end of a card's line; `fill` spreads them across the column. */
  width?: "fixed" | "fill";
  height?: "sm" | "md";
  /** The start, the middle and the end of the period, under the bars. */
  captions?: [string, string, string];
  className?: string;
}) {
  return (
    <div className={cx("di-sparkline", `di-sparkline-${width}`, `di-sparkline-${height}`, className)}>
      <div className="di-sparkline-bars" role="img" aria-label={label}>
        {values.map((percent, i) => (
          <span
            key={i}
            className={cx("di-sparkline-bar", i === highlight && `is-${tone}`)}
            style={{ height: `${Math.max(0, Math.min(100, percent))}%` }}
          />
        ))}
      </div>
      {captions ? (
        <div className="di-sparkline-captions">
          {captions.map((caption, i) => (
            <span key={i}>{caption}</span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
