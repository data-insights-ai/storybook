import type { ReactNode } from "react";
import { Popover } from "@base-ui/react/popover";
import { Ellipsis } from "lucide-react";
import type { OverlayHost } from "../../../internal/useOverlayHost";
import { Button } from "../../actions/Button";

export default function AppShellBarMore({
  moreLabel,
  open,
  onOpenChange,
  host,
  children,
}: {
  moreLabel: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  host: OverlayHost;
  children: ReactNode;
}) {
  return (
    <Popover.Root open={open} onOpenChange={onOpenChange}>
      <Popover.Trigger
        render={
          <Button variant="ghost" size="sm" iconOnly aria-label={moreLabel}>
            <Ellipsis aria-hidden />
          </Button>
        }
      />
      <Popover.Portal container={host.container}>
        <Popover.Positioner
          data-theme={host.theme}
          side="bottom"
          align="end"
          sideOffset={4}
          className="di-topbar-more-positioner"
        >
          <Popover.Popup className="di-topbar-more" aria-label={moreLabel}>
            {children}
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
