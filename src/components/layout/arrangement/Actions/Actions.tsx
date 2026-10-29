import type { ReactNode } from "react";
import "./Actions.css";

/** The buttons that close a form or a block, set at its end, after a `FieldStack`. */
export function Actions({ children }: { children: ReactNode }) {
  return <div className="di-inline-actions">{children}</div>;
}
