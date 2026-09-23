import type { ReactNode } from "react";
import { cx } from "../cx";
import "./DataTable.css";

/**
 * The table is a frame. Header, rows and cells are children, so the
 * caller owns the copy and anything that sits in a cell. There is no
 * `rows` prop: the data belongs to the product, not to the table.
 *
 * The grid drops to the one cold surface in the system, so a dense
 * field of mono values reads as an extract from the record. Ordinals
 * run down the index column on the left.
 */
export function DataTable({
  caption,
  toolbar,
  footer,
  indexed = true,
  className,
  children,
}: {
  /** The accessible name. Always present, visually hidden. */
  caption: string;
  /** A filter row above the grid, inside the same frame. */
  toolbar?: ReactNode;
  /** A slot under the grid: a count, a pagination control. */
  footer?: ReactNode;
  /** The ordinal column. Off for a table that is not a register extract. */
  indexed?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cx("di-table-wrap", className)}>
      {toolbar === undefined ? null : <div className="di-table-toolbar">{toolbar}</div>}
      {/*
        The frame scrolls, not the page. A scrollable region has to be
        reachable from the keyboard, so it takes a tab stop and a name.
      */}
      <div className="di-table-scroll" tabIndex={0} role="region" aria-label={caption}>
        <table className={cx("di-table", indexed && "is-indexed")}>
          <caption className="di-sr">{caption}</caption>
          {children}
        </table>
      </div>
      {footer === undefined ? null : <div className="di-table-foot">{footer}</div>}
    </div>
  );
}

export function TableHead({ children }: { children: ReactNode }) {
  return (
    <thead>
      <tr>{children}</tr>
    </thead>
  );
}

/**
 * `sort` is the column the register is currently ordered by. It shows an
 * arrow and sets `aria-sort`, so the order is announced and not only drawn.
 */
export function TableColumn({
  children,
  align = "start",
  index = false,
  sort = "none",
}: {
  children?: ReactNode;
  align?: "start" | "end";
  /** The empty head cell above the ordinal column. */
  index?: boolean;
  sort?: "none" | "ascending" | "descending";
}) {
  if (index) {
    return <th scope="col" className="di-table-index"><span className="di-sr">{children}</span></th>;
  }
  return (
    <th
      scope="col"
      className={cx(align === "end" && "is-end", sort !== "none" && "is-sorted")}
      aria-sort={sort === "none" ? undefined : sort}
    >
      {children}
      {sort === "none" ? null : (
        <span className="di-table-sort" aria-hidden>
          {sort === "ascending" ? "↑" : "↓"}
        </span>
      )}
    </th>
  );
}

export function TableBody({ children }: { children: ReactNode }) {
  return <tbody>{children}</tbody>;
}

/** `active` marks the row an open drawer or detail pane is showing. */
export function TableRow({
  children,
  active = false,
  tone = "default",
}: {
  children: ReactNode;
  active?: boolean;
  /** `danger` tints the ordinal, for a row that failed. */
  tone?: "default" | "danger";
}) {
  return <tr className={cx(active && "is-active", tone === "danger" && "is-danger")}>{children}</tr>;
}

/** The ordinal cell. Mono, quiet, and the row's handle in conversation. */
export function TableIndex({ children }: { children: ReactNode }) {
  return <td className="di-table-index">{children}</td>;
}

export function TableCell({
  children,
  align = "start",
  mono = false,
}: {
  children: ReactNode;
  align?: "start" | "end";
  /** Identifiers, timestamps and measured values run in the mono track. */
  mono?: boolean;
}) {
  return (
    <td className={cx(align === "end" && "is-end", mono && "di-mono")}>{children}</td>
  );
}

export function CellStack({ primary, secondary }: { primary: ReactNode; secondary?: ReactNode }) {
  return (
    <span className="di-cell">
      <span className="di-cell-primary">{primary}</span>
      {secondary ? <span className="di-cell-secondary">{secondary}</span> : null}
    </span>
  );
}

export function CellIcon({ children }: { children: ReactNode }) {
  return <span className="di-cell-icon">{children}</span>;
}

export function CellLead({ children }: { children: ReactNode }) {
  return <span className="di-cell-lead">{children}</span>;
}
