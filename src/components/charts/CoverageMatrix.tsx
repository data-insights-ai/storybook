import { useId } from "react";
import { cx } from "../../cx";
import { TooltipTarget } from "../feedback/TooltipTarget";
import "./CoverageMatrix.css";

/** The ordered status scale a marked cell takes: the chart's series, warn and danger. */
export type CoverageMatrixTone = "neutral" | "warn" | "danger";

/** One item that was seen in a column: one filled cell and one code beneath the cells. */
export type CoverageMatrixMark = {
  /** The item's code, as written. Set in the mono track. */
  code: string;
  /** What the code means. Opens on hover and focus; `""` for a code with no name on record. */
  label: string;
  tone: CoverageMatrixTone;
};

/** One column of the matrix: a fixed set of items, some of which were seen. */
export type CoverageMatrixColumn = {
  /** The column's code, as written. Set in the mono track beside its size. */
  code: string;
  /** The column's name, as prose. */
  label: string;
  /** How many items the column holds; one cell each. */
  size: number;
  /** The items that were seen, in the order their cells fill. */
  marks: CoverageMatrixMark[];
};

/**
 * A reference set laid out as columns of cells — one cell per item, the
 * columns in their own order — with the items that were seen filled in.
 * The empty cells are the point: they show how much of the set a record
 * reached, and where it did not.
 *
 * A column that holds a mark is framed and its name set heavier, so the
 * reached columns read before the cells are counted. A marked cell takes
 * its tone from the ordered status scale (series → warn → danger), and the
 * colour is never the only channel: every mark is also written out as its
 * code beneath the cells, and `CoverageMatrixLegend` names the tones. Each
 * column ends where its own codes do, and a name holds two lines, so the
 * cells of every column start on one line.
 *
 * The cells only fill from the top, so position within a column carries no
 * meaning. They are drawn for the eye and hidden from a screen reader,
 * which reads each column's name, size and codes instead. Wider than its
 * container, the matrix scrolls in its own named, focusable frame.
 */
export function CoverageMatrix({
  label,
  columns,
  className,
}: {
  /** The accessible name of the scroll frame. */
  label: string;
  columns: CoverageMatrixColumn[];
  className?: string;
}) {
  const id = useId();
  return (
    <div
      className={cx("di-matrix", className)}
      role="region"
      aria-label={label}
      tabIndex={0}
    >
      <div className="di-matrix-columns">
        {columns.map((column, i) => {
          const headId = `${id}-${i}`;
          const cells = Math.max(column.size, column.marks.length);
          return (
            <div
              key={column.code}
              role="group"
              aria-labelledby={headId}
              className={cx("di-matrix-column", column.marks.length > 0 && "is-reached")}
            >
              <span id={headId} className="di-matrix-label">
                {column.label}
              </span>
              <span className="di-matrix-code">
                {column.code} · {column.size}
              </span>
              <span className="di-matrix-body">
                <span className="di-matrix-cells" aria-hidden>
                  {Array.from({ length: cells }, (_, j) => (
                    <span key={j} className={cx("di-matrix-cell", column.marks[j] && `is-${column.marks[j].tone}`)} />
                  ))}
                </span>
                {column.marks.length === 0 ? null : (
                  <ul className="di-matrix-marks">
                    {column.marks.map((mark) => (
                      <li key={mark.code} className={cx("di-matrix-mark", `is-${mark.tone}`)}>
                        <span className="di-matrix-swatch" aria-hidden />
                        {mark.label === "" ? mark.code : <TooltipTarget text={mark.code} label={mark.label} />}
                      </li>
                    ))}
                  </ul>
                )}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * What each tone of a marked cell means, and what an empty cell is. One per
 * matrix, beneath it. Pass only the tones the caller's scale uses.
 */
export function CoverageMatrixLegend({
  tones,
  emptyLabel,
}: {
  tones: { tone: CoverageMatrixTone; label: string }[];
  /** The word for a cell nobody reached. */
  emptyLabel: string;
}) {
  return (
    <ul className="di-matrix-legend">
      {tones.map((item) => (
        <li key={item.tone} className={cx("di-matrix-key", `is-${item.tone}`)}>
          <span className="di-matrix-swatch" aria-hidden />
          {item.label}
        </li>
      ))}
      <li className="di-matrix-key is-empty">
        <span className="di-matrix-swatch" aria-hidden />
        {emptyLabel}
      </li>
    </ul>
  );
}
