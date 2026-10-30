import { PanelLeft } from "lucide-react";
import { Button } from "../../../actions/Button";
import { useSidebar } from "../state/SidebarContext";
import "../Sidebar.css";

/**
 * The button that collapses and expands the sidebar, or opens its drawer on a
 * phone. `label` is its accessible name; it reports the state with
 * `aria-expanded`.
 */
export function SidebarTrigger({ label }: { label: string }) {
  const { expanded, mobile, mobileOpen, toggle, sidebarId } = useSidebar();
  const open = mobile ? mobileOpen : expanded;
  return (
    <Button
      variant="ghost"
      size="sm"
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
