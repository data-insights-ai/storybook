import { useCallback, useEffect, useId, useMemo, useState, type ReactNode } from "react";
import { Tooltip } from "@base-ui/react/tooltip";
import { SidebarContext } from "./SidebarContext";
import { readStoredExpanded, usePersistExpanded } from "./sidebarStorage";
import { useNarrowViewport } from "./useNarrowViewport";
import { useToggleShortcut } from "./useToggleShortcut";
import "./Sidebar.css";

export function SidebarProvider({
  defaultExpanded = true,
  expanded: controlledExpanded,
  onExpandedChange,
  storageKey,
  shortcut = "b",
  children,
}: {
  defaultExpanded?: boolean;
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  storageKey?: string;
  shortcut?: string | false;
  children: ReactNode;
}) {
  const [ownExpanded, setOwnExpanded] = useState(() => readStoredExpanded(storageKey) ?? defaultExpanded);
  const expanded = controlledExpanded ?? ownExpanded;
  const mobile = useNarrowViewport();
  const [mobileOpen, setMobileOpen] = useState(false);
  const sidebarId = useId();

  usePersistExpanded(storageKey, expanded);
  useEffect(() => {
    if (!mobile) setMobileOpen(false);
  }, [mobile]);

  const setExpanded = useCallback(
    (next: boolean) => {
      if (controlledExpanded === undefined) setOwnExpanded(next);
      onExpandedChange?.(next);
    },
    [controlledExpanded, onExpandedChange],
  );

  const toggle = useCallback(() => {
    if (mobile) setMobileOpen((open) => !open);
    else setExpanded(!expanded);
  }, [mobile, expanded, setExpanded]);

  useToggleShortcut(shortcut, toggle);

  const state = useMemo(
    () => ({ expanded, setExpanded, mobile, mobileOpen, setMobileOpen, toggle, sidebarId }),
    [expanded, setExpanded, mobile, mobileOpen, toggle, sidebarId],
  );

  return (
    <SidebarContext.Provider value={state}>
      <Tooltip.Provider delay={300}>
        <div className="di-sb-layout" data-state={expanded ? "expanded" : "collapsed"}>
          {children}
        </div>
      </Tooltip.Provider>
    </SidebarContext.Provider>
  );
}
