import type { ReactNode } from "react";
import { Drawer } from "@base-ui/react/drawer";
import { X } from "lucide-react";
import { useSidebar } from "../state/SidebarContext";
import "../Sidebar.css";

export default function SidebarDrawer({
  label,
  closeLabel,
  children,
}: {
  label: string;
  closeLabel: string;
  children: ReactNode;
}) {
  const { mobileOpen, setMobileOpen, sidebarId } = useSidebar();
  const rtl = getComputedStyle(document.documentElement).direction === "rtl";
  return (
    <Drawer.Root
      open={mobileOpen}
      onOpenChange={(open, details) => {
        // Base UI hears every Escape on the document; one that a layer above
        // already used (a Menu or Dialog opened from the drawer prevents its
        // default) closed that layer, so the drawer stays.
        if (details.reason === "escape-key" && details.event.defaultPrevented) {
          details.cancel();
          return;
        }
        setMobileOpen(open);
      }}
      swipeDirection={rtl ? "right" : "left"}
    >
      <Drawer.Portal>
        <Drawer.Backdrop className="di-sb-backdrop" />
        <Drawer.Viewport className="di-sb-viewport">
          <Drawer.Popup id={sidebarId} className="di-sb di-sb-drawer" aria-label={label} data-state="expanded">
            <Drawer.Close className="di-sb-close" aria-label={closeLabel}>
              <X aria-hidden />
            </Drawer.Close>
            <nav className="di-sb-drawer-nav" aria-label={label}>
              {children}
            </nav>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
