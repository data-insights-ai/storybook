import { Children, createContext, isValidElement, useContext, useId, type ReactNode } from "react";
import "./Sidebar.css";

export function SidebarHeader({ children }: { children: ReactNode }) {
  return <div className="di-sb-header">{children}</div>;
}

export function SidebarContent({ children }: { children: ReactNode }) {
  return <div className="di-sb-content">{children}</div>;
}

export function SidebarFooter({ children }: { children: ReactNode }) {
  return <div className="di-sb-footer">{children}</div>;
}

const GroupLabelId = createContext<string | undefined>(undefined);

export function SidebarGroup({ children }: { children: ReactNode }) {
  const labelId = useId();
  const labelled = Children.toArray(children).some((child) => isValidElement(child) && child.type === SidebarGroupLabel);
  return (
    <GroupLabelId.Provider value={labelId}>
      <div className="di-sb-group" role="group" aria-labelledby={labelled ? labelId : undefined}>
        {children}
      </div>
    </GroupLabelId.Provider>
  );
}

export function SidebarGroupLabel({ children }: { children: string }) {
  return (
    <div className="di-sb-group-label" id={useContext(GroupLabelId)}>
      {children}
    </div>
  );
}
