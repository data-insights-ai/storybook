import type { ReactElement } from "react";
import { Tooltip } from "@base-ui/react/tooltip";
import { Badge } from "../../data/marks/Badge";
import type { BadgeTone } from "./SidebarMenuButton";
import "../../feedback/Tooltip.css";

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
    <Tooltip.Root>
      <Tooltip.Trigger render={children} />
      <Tooltip.Portal>
        <Tooltip.Positioner side="right" sideOffset={12} className="di-sb-tooltip">
          <Tooltip.Popup className="di-tooltip">
            {label}
            {badge ? <Badge tone={badgeTone}>{badge}</Badge> : null}
          </Tooltip.Popup>
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}
