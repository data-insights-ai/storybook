import type { ReactNode } from "react";
import { cx } from "../cx";
import "./Panel.css";

/**
 * The register panel: an index column, then the content. This is the one
 * recurring shape in the system — a card, a tile, a table frame and a
 * drawer are all this panel with a different fill.
 *
 * The index column is the fingerprint. It costs 38px and it is what
 * makes the surface read as a record rather than a dashboard.
 */
export function Panel({
  index,
  indexSize = "md",
  indexTone = "neutral",
  indexRule = true,
  tone = "sheet",
  title,
  meta,
  padded = true,
  className,
  children,
}: {
  /** The ordinal, letter or § mark in the index column. Omit for a panel with no index. */
  index?: string;
  indexSize?: "md" | "sm";
  indexTone?: "neutral" | "danger";
  /** The hairline running down from the mark. Off for a short tile. */
  indexRule?: boolean;
  /** `grid` drops to the one cold surface, for a dense field of mono values. */
  tone?: "sheet" | "grid";
  title?: string;
  /** Trailing header text: a count, a timestamp, a version. */
  meta?: string;
  /** Off when the child draws to the panel's edge, such as a table. */
  padded?: boolean;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div className={cx("di-panel", `di-panel-${tone}`, indexTone === "danger" && "is-danger", className)}>
      {index === undefined ? null : (
        <div className={cx("di-panel-index", indexSize === "sm" && "di-panel-index-sm")}>
          <span className="di-panel-index-label">{index}</span>
          {indexRule ? <span className="di-panel-index-rule" aria-hidden /> : null}
        </div>
      )}
      <div className="di-panel-body">
        {title === undefined && meta === undefined ? null : (
          <div className="di-panel-header">
            {title === undefined ? null : <span className="di-panel-title">{title}</span>}
            {meta === undefined ? null : <span className="di-panel-meta">{meta}</span>}
          </div>
        )}
        <div className={cx("di-panel-content", !padded && "di-panel-content-flush")}>{children}</div>
      </div>
    </div>
  );
}

/** The ruled strip under a panel's content: controls, a count, a source. */
export function PanelFooter({ children }: { children: ReactNode }) {
  return <div className="di-panel-footer">{children}</div>;
}

/**
 * A quiet line under a panel's content: the caveat, the unit, the thing
 * the numbers above do not say. It is never where a fact lives.
 */
export function PanelNote({ children }: { children: ReactNode }) {
  return <p className="di-panel-note">{children}</p>;
}
