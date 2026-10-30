import type { ReactNode } from "react";
import { Stack } from "../Stack";

/**
 * A form read down one column.
 *
 * @deprecated Removed in 0.12. Use `<Stack variant="form">`, which lays out the same column.
 */
export function FieldStack({ children }: { children: ReactNode }) {
  return <Stack variant="form">{children}</Stack>;
}
