import type { ReactNode } from "react";
import "./Actions.css";

/**
 * The buttons that close a form or a block, set at its end, after a
 * `FieldStack`. `align="start"` sets them where the reading starts, for
 * the actions a block leads with, such as a verdict's. On a phone they
 * stack at full width.
 */
export function Actions({ align = "end", children }: { align?: "start" | "end"; children: ReactNode }) {
  return <div className={align === "start" ? "di-inline-actions is-start" : "di-inline-actions"}>{children}</div>;
}
