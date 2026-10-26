import { PanelLeft } from "lucide-react";
import { Button } from "../../actions/Button";
import { useSidebar } from "./SidebarContext";
import "./Sidebar.css";

export function SidebarTrigger({ label }: { label: string }) {
  const { expanded, mobile, mobileOpen, toggle, sidebarId } = useSidebar();
  const open = mobile ? mobileOpen : expanded;
  return (
    <Button
      variant="ghost"
      size="dense"
      iconOnly
      className="di-sb-trigger"
      aria-label={label}
      aria-expanded={open}
      aria-controls={open || !mobile ? sidebarId : undefined}
      onClick={toggle}
    >
      <PanelLeft aria-hidden />
    </Button>
  );
}
