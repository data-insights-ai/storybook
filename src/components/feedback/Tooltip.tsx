import type { ReactNode } from "react";
import "./Tooltip.css";

/**
 * A short label for a control that has none. It is never the only place
 * a fact lives: a tooltip that holds the scope of an action is a bug.
 */
export function Tooltip({ children }: { children: ReactNode }) {
  return <span className="di-tooltip" role="tooltip">{children}</span>;
}
