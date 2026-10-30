import { lazy, Suspense, type ReactNode } from "react";
import { takeSlot } from "../../../internal/slots";
import { SidebarFooter } from "./menu/SidebarSections";
import { useSidebar } from "./state/SidebarContext";
import "./Sidebar.css";

/* The drawer only serves narrow screens; its own module keeps the drawer and
 * swipe code out of a desktop page's first load. */
const SidebarDrawer = lazy(() => import("./frame/SidebarDrawer"));

/**
 * The app's collapsible navigation, inside a `SidebarProvider`. Wide, it is a
 * `nav` named by `label` that collapses to a rail of icons; on a phone it is a
 * drawer that opens from `SidebarTrigger` and is closed with `closeLabel`'s
 * button or Escape. Its parts are `SidebarHeader`, `SidebarContent` and
 * `SidebarFooter`.
 */
export function Sidebar({ label, closeLabel, children }: { label: string; closeLabel: string; children: ReactNode }) {
  const { expanded, mobile, sidebarId } = useSidebar();
  /* The footer is pinned to the end, wherever it was written. */
  const [footer, rest] = takeSlot(children, SidebarFooter);
  children = (
    <>
      {rest}
      {footer}
    </>
  );

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
