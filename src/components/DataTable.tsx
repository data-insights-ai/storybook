import { Children, isValidElement, type ReactNode } from "react";
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
  indexed = true,
  className,
  children,
}: {
  /** The accessible name. Always present, visually hidden. */
  caption: string;
  /** The ordinal column. Off for a table that is not a register extract. */
  indexed?: boolean;
  className?: string;
  /** `TableToolbar`, the grid's `TableHead` and `TableBody`, and `TableFooter`. */
  children: ReactNode;
}) {
  /*
   * The one slot that cannot be placed by CSS: a `<div>` is not allowed
   * inside a `<table>`, so the frame has to pull the toolbar and the
   * footer out of the children and render them around the grid itself.
   */
  const toolbar: ReactNode[] = [];
  const grid: ReactNode[] = [];
  const foot: ReactNode[] = [];
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return void grid.push(child);
    if (child.type === TableToolbar) return void toolbar.push(child);
    if (child.type === TableFooter) return void foot.push(child);
    grid.push(child);
  });

  return (
    <div className={cx("di-table-wrap", className)}>
      {toolbar}
      {/*
        The frame scrolls, not the page. A scrollable region has to be
        reachable from the keyboard, so it takes a tab stop and a name.
      */}
      <div className="di-table-scroll" tabIndex={0} role="region" aria-label={caption}>
        <table className={cx("di-table", indexed && "is-indexed")}>
          <caption className="di-sr">{caption}</caption>
          {grid}
        </table>
      </div>
      {foot}
    </div>
  );
}

/** A filter row above the grid, inside the same frame. */
export function TableToolbar({ children }: { children: ReactNode }) {
  return <div className="di-table-toolbar">{children}</div>;
}

/** Under the grid: a count, a pagination control. */
export function TableFooter({ children }: { children: ReactNode }) {
  return <div className="di-table-foot">{children}</div>;
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
/**
 * A head cell. `sort` states the order the rows are in; `onSort` makes the
 * header the control that changes it. The table never sorts: the caller
 * owns the order, because it also owns which rows are loaded.
 */
export function TableColumn({
  children,
  align = "start",
  index = false,
  sort = "none",
  onSort,
  width = "auto",
}: {
  children?: ReactNode;
  align?: "start" | "end";
  /** `fill` hands this column whatever width the others leave — for a bar or a meter. */
  width?: "auto" | "fill";
  /** The empty head cell above the ordinal column. */
  index?: boolean;
  sort?: "none" | "ascending" | "descending";
  /** Called when the header is pressed. Present, the column offers itself as sortable. */
  onSort?: () => void;
}) {
  if (index) {
    return <th scope="col" className="di-table-index"><span className="di-sr">{children}</span></th>;
  }
  // A sortable column that is not the sorted one still says so, quietly: a
  // header that only reveals it is a control once pressed is a guess.
  const mark = sort === "ascending" ? "↑" : sort === "descending" ? "↓" : onSort ? "↕" : null;
  const arrow = mark ? (
    <span className={cx("di-table-sort", sort === "none" && "is-idle")} aria-hidden>
      {mark}
    </span>
  ) : null;
  return (
    <th
      scope="col"
      className={cx(align === "end" && "is-end", sort !== "none" && "is-sorted", width === "fill" && "is-fill")}
      aria-sort={sort === "none" ? undefined : sort}
    >
      {onSort ? (
        <button type="button" className="di-table-sort-btn" onClick={onSort}>
          {children}
          {arrow}
        </button>
      ) : (
        <>
          {children}
          {arrow}
        </>
      )}
    </th>
  );
}

export function TableBody({ children }: { children: ReactNode }) {
  return <tbody>{children}</tbody>;
}

/**
 * `active` marks the row an open drawer or detail pane is showing.
 *
 * `onSelect` makes the whole row the pointer target for that pane. A row is
 * not a control a keyboard can reach, so the row still carries one — a
 * `TextLink` on its identifier — that selects it too; the row only widens
 * where a pointer can press. A click on any control inside the row is left
 * to that control.
 */
export function TableRow({
  children,
  active = false,
  tone = "neutral",
  onSelect,
}: {
  children: ReactNode;
  active?: boolean;
  /** `danger` tints the ordinal, for a row that failed. */
  tone?: "neutral" | "danger";
  onSelect?: () => void;
}) {
  return (
    <tr
      className={cx(active && "is-active", tone === "danger" && "is-danger", onSelect && "is-selectable")}
      onClick={
        onSelect
          ? (event) => {
              if ((event.target as Element).closest("a, button, input, select, textarea, label")) return;
              onSelect();
            }
          : undefined
      }
    >
      {children}
    </tr>
  );
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

/** Two lines in one cell: the value, and what qualifies it. Both text. */
export function CellStack({ primary, secondary = "" }: { primary: string; secondary?: string }) {
  return (
    <span className="di-cell">
      <span className="di-cell-primary">{primary}</span>
      {secondary === "" ? null : <span className="di-cell-secondary">{secondary}</span>}
    </span>
  );
}

export function CellIcon({ children }: { children: ReactNode }) {
  return <span className="di-cell-icon">{children}</span>;
}

export function CellLead({ children }: { children: ReactNode }) {
  return <span className="di-cell-lead">{children}</span>;
}
