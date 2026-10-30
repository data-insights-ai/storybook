import type { ReactNode } from "react";
import { Toolbar, ToolbarEnd, ToolbarSelection, ToolbarStatus } from "../Toolbar";

/**
 * The actions on the selected rows, in the list toolbar's place.
 *
 * @deprecated Removed in 0.12: use `<Toolbar label frame="bar" sticky="top">`
 * with `ToolbarStatus`, `ToolbarSelection` and the actions in `ToolbarEnd`.
 * It is a labelled group now, not an ARIA `toolbar`: every button keeps its
 * own tab stop.
 */
export function BulkActionBar({
  label,
  selectedLabel,
  selectAllLabel = "",
  onSelectAll,
  clearLabel,
  onClear,
  sticky = true,
  children,
}: {
  label: string;
  selectedLabel: string;
  selectAllLabel?: string;
  onSelectAll?: () => void;
  clearLabel: string;
  onClear: () => void;
  sticky?: boolean;
  children: ReactNode;
}) {
  return (
    <Toolbar label={label} frame="bar" sticky={sticky ? "top" : undefined}>
      <ToolbarStatus>{selectedLabel}</ToolbarStatus>
      <ToolbarSelection
        clearLabel={clearLabel}
        onClear={onClear}
        selectAllLabel={selectAllLabel}
        onSelectAll={onSelectAll}
      />
      <ToolbarEnd>{children}</ToolbarEnd>
    </Toolbar>
  );
}
