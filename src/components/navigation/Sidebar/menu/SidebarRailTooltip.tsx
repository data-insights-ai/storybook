import type { ReactElement } from "react";
import { Tooltip } from "../../../overlays/Tooltip";
import type { BadgeTone } from "./badgeTone";

/* Loaded only when the rail collapses, so an expanded sidebar ships no tooltip code. */
export default function SidebarRailTooltip({
  label,
  badge,
  badgeTone,
  children,
}: {
  label: string;
  badge?: string;
  badgeTone: BadgeTone;
  children: ReactElement;
}) {
  return (
    <Tooltip label={label} side="right" badge={badge ?? ""} badgeTone={badgeTone}>
      {children}
    </Tooltip>
  );
}
