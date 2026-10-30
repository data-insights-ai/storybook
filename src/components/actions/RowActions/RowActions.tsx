import type { ReactNode } from "react";
import { Toolbar } from "../Toolbar";

/**
 * A row's quick actions, in its last cell.
 *
 * @deprecated Removed in 0.12: use `<Toolbar variant="row" label>`, the same
 * row, named for assistive technology.
 */
export function RowActions({ children }: { children: ReactNode }) {
  return <Toolbar variant="row">{children}</Toolbar>;
}
