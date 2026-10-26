import { createContext, useContext } from "react";

export type SidebarState = {
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
  mobile: boolean;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  toggle: () => void;
  sidebarId: string;
};

export const SidebarContext = createContext<SidebarState | null>(null);

export function useSidebar(): SidebarState {
  const state = useContext(SidebarContext);
  if (!state) throw new Error("useSidebar must be used inside SidebarProvider");
  return state;
}

export function useSidebarRail(): boolean {
  const { expanded, mobile } = useSidebar();
  return !expanded && !mobile;
}
