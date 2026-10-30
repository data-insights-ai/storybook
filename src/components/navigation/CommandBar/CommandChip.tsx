import type { ReactNode } from "react";
import { Tag } from "../../marks/Tag";

/**
 * A scope the bar is searching within, or one it offers to add.
 *
 * @deprecated Removed in 0.12: use `Tag mono`. Active is `Tag mono pressed`,
 * available `Tag mono onClick`, suggested `Tag mono inferred onClick`.
 */
export function CommandChip({
  state = "available",
  onSelect,
  children,
}: {
  state?: "active" | "available" | "suggested";
  onSelect?: () => void;
  children: ReactNode;
}) {
  return (
    <Tag mono pressed={state === "active"} inferred={state === "suggested"} onClick={onSelect}>
      {children}
    </Tag>
  );
}
