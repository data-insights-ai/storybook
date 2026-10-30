import type { ReactNode } from "react";
import { Toolbar, ToolbarEnd, ToolbarStatus } from "../../../actions/Toolbar";

/**
 * Save and cancel in reach while a long form has unsaved changes.
 *
 * @deprecated Removed in 0.12: use `<Toolbar label role="region" frame="bar"
 * sticky="bottom">` with the message in `ToolbarStatus` and the buttons in
 * `ToolbarEnd`, rendered only while there are changes.
 */
export function SaveBar({
  label,
  message,
  children,
  className,
}: {
  label: string;
  message: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Toolbar label={label} role="region" frame="bar" sticky="bottom" className={className}>
      <ToolbarStatus>{message}</ToolbarStatus>
      <ToolbarEnd>{children}</ToolbarEnd>
    </Toolbar>
  );
}
