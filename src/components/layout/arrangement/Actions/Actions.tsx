import type { ReactNode } from "react";
import { Toolbar } from "../../../actions/Toolbar";

/**
 * The buttons that close a form or a block.
 *
 * @deprecated Removed in 0.12: use `<Toolbar align="end">` (or `align="start"`),
 * the same row, stacked at full width on a phone.
 */
export function Actions({ align = "end", children }: { align?: "start" | "end"; children: ReactNode }) {
  return <Toolbar align={align}>{children}</Toolbar>;
}
