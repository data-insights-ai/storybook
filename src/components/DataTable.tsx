import type { ReactNode } from "react";
import "./DataTable.css";

/**
 * The table is a frame. Header, rows, and cells are children, so the caller
 * owns the copy and any component that sits in a cell. `caption` is the
 * accessible name. `footer` is a slot under the table.
 */
export function DataTable({
  caption,
  footer,
  children,
}: {
  caption: string;
  footer?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="di-table-wrap">
      <table className="di-table">
        <caption className="di-sr">{caption}</caption>
        {children}
      </table>
      {footer ? <div className="di-table-foot">{footer}</div> : null}
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

export function TableColumn({
  children,
  align = "start",
}: {
  children: ReactNode;
  align?: "start" | "end";
}) {
  return (
    <th scope="col" className={align === "end" ? "is-end" : undefined}>
      {children}
    </th>
  );
}

export function TableBody({ children }: { children: ReactNode }) {
  return <tbody>{children}</tbody>;
}

export function TableRow({ children }: { children: ReactNode }) {
  return <tr>{children}</tr>;
}

export function TableCell({
  children,
  align = "start",
}: {
  children: ReactNode;
  align?: "start" | "end";
}) {
  return <td className={align === "end" ? "is-end" : undefined}>{children}</td>;
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
