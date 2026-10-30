import { Children, createContext, isValidElement, useContext, useId, type ReactNode } from "react";
import "../Sidebar.css";

/**
 * The sidebar's head, at its top: the brand, or the workspace a person is in.
 */
export function SidebarHeader({ children }: { children: ReactNode }) {
  return <div className="di-sb-header">{children}</div>;
}

/**
 * The sidebar's scrolling middle, which holds its `SidebarGroup`s and
 * `SidebarMenu`s.
 */
export function SidebarContent({ children }: { children: ReactNode }) {
  return <div className="di-sb-content">{children}</div>;
}

/**
 * The sidebar's foot, pinned to its end, for what is not a destination:
 * the account, the theme choice.
 */
export function SidebarFooter({ children }: { children: ReactNode }) {
  return <div className="di-sb-footer">{children}</div>;
}

const GroupLabelId = createContext<string | undefined>(undefined);

/**
 * A set of sidebar items under one heading. With a `SidebarGroupLabel` inside,
 * the group is announced by that label.
 */
export function SidebarGroup({ children }: { children: ReactNode }) {
  const labelId = useId();
  const labelled = Children.toArray(children).some(
    (child) => isValidElement(child) && child.type === SidebarGroupLabel,
  );
  return (
    <GroupLabelId.Provider value={labelId}>
      <div className="di-sb-group" role="group" aria-labelledby={labelled ? labelId : undefined}>
        {children}
      </div>
    </GroupLabelId.Provider>
  );
}

/**
 * The heading of a `SidebarGroup`, which also names the group for assistive
 * technology. Hidden in the collapsed rail.
 */
export function SidebarGroupLabel({ children }: { children: string }) {
  return (
    <div className="di-sb-group-label" id={useContext(GroupLabelId)}>
      {children}
    </div>
  );
}
