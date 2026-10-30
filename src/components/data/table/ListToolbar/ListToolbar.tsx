import type { ReactNode } from "react";
import { Toolbar, ToolbarEnd, ToolbarNote } from "../../../actions/Toolbar";

/**
 * The search and filters above a list.
 *
 * @deprecated Removed in 0.12: use `<Toolbar label role="search" sticky="top">`
 * (`sticky` left out where it should not stick), the trailing actions in
 * `ToolbarEnd` and the note in `ToolbarNote`.
 */
export function ListToolbar({
  label,
  sticky = true,
  children,
}: {
  label: string;
  sticky?: boolean;
  children: ReactNode;
}) {
  return (
    <Toolbar label={label} role="search" sticky={sticky ? "top" : undefined}>
      {children}
    </Toolbar>
  );
}

/**
 * The toolbar's trailing actions.
 *
 * @deprecated Removed in 0.12: the same slot is `ToolbarEnd`.
 */
export const ListToolbarEnd = ToolbarEnd;

/**
 * One muted line under a toolbar.
 *
 * @deprecated Removed in 0.12: use `ToolbarNote` inside the `Toolbar`.
 */
export const ListToolbarNote = ToolbarNote;
