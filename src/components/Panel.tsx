import { Children, isValidElement, type ReactNode } from "react";
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
  surface = "sheet",
  title,
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
  /**
   * Which surface the panel sits on. `grid` drops to the one cold surface,
   * for a dense field of mono values.
   */
  surface?: "sheet" | "grid";
  title?: string;
  /** Off when the child draws to the panel's edge, such as a table. */
  padded?: boolean;
  className?: string;
  /** The panel's content, and at most one `PanelMeta`. */
  children?: ReactNode;
}) {
  /*
   * `PanelMeta` is picked out of `children` by type, the way `ModalFrame`
   * does it: the header sits above the content area, so the slot cannot be
   * placed by writing it in source order.
   */
  const meta: ReactNode[] = [];
  const body: ReactNode[] = [];
  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.type === PanelMeta) meta.push(child);
    else body.push(child);
  });

  return (
    <div className={cx("di-panel", `di-panel-${surface}`, indexTone === "danger" && "is-danger", className)}>
      {index === undefined ? null : (
        <div className={cx("di-panel-index", indexSize === "sm" && "di-panel-index-sm")}>
          <span className="di-panel-index-label">{index}</span>
          {indexRule ? <span className="di-panel-index-rule" aria-hidden /> : null}
        </div>
      )}
      <div className="di-panel-body">
        {title === undefined && meta.length === 0 ? null : (
          <div className="di-panel-header">
            {title === undefined ? null : <span className="di-panel-title">{title}</span>}
            {meta}
          </div>
        )}
        <div className={cx("di-panel-content", !padded && "di-panel-content-flush")}>{body}</div>
      </div>
    </div>
  );
}

/**
 * The trailing line in a panel's header: a count, a timestamp, a version,
 * a state. A slot rather than a string, because each of those is a value
 * the library already has a component for — `SealValue`, `StatusPill`,
 * `VersionTag` — and a bare string cannot carry the mono track or the mark.
 */
export function PanelMeta({ children }: { children: ReactNode }) {
  return <span className="di-panel-meta">{children}</span>;
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
