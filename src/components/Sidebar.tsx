import { lazy, Suspense, type ReactNode } from "react";
import { useSidebar } from "./SidebarContext";
import "./Sidebar.css";

/* The drawer only serves narrow screens; its own module keeps the drawer and
 * swipe code out of a desktop page's first load. */
const SidebarDrawer = lazy(() => import("./SidebarDrawer"));

export function Sidebar({ label, closeLabel, children }: { label: string; closeLabel: string; children: ReactNode }) {
  const { expanded, mobile, sidebarId } = useSidebar();

  if (!mobile) {
    return (
      <nav id={sidebarId} className="di-sb" aria-label={label} data-state={expanded ? "expanded" : "collapsed"}>
        {children}
      </nav>
    );
  }

  return (
    <Suspense fallback={null}>
      <SidebarDrawer label={label} closeLabel={closeLabel}>
        {children}
      </SidebarDrawer>
    </Suspense>
  );
}
