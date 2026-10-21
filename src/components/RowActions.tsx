import type { ReactNode } from "react";
import "./RowActions.css";

/**
 * A row's quick actions, in its last cell: shown while the row is hovered
 * or holds focus, and always where there is no hover (touch). Put the
 * frequent, safe actions here as dense icon buttons with names, and every
 * action of the row — including these — in a `Menu` beside them. A
 * destructive action never sits here bare; it lives in the record's
 * `DangerZone` or behind the menu and a `ConfirmDialog`.
 */
export function RowActions({ children }: { children: ReactNode }) {
  return <div className="di-row-actions">{children}</div>;
}
