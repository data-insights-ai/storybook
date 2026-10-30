import type { ReactNode } from "react";
import { Toolbar } from "../Toolbar";

/**
 * A one-line form: add an entry, apply a value.
 *
 * @deprecated Use `<Toolbar fillFirst>`, which lays out the same row. Removed in 0.12.
 */
export function InlineForm({ children }: { children: ReactNode }) {
  return <Toolbar fillFirst>{children}</Toolbar>;
}
