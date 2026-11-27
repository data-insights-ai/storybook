import {
  Children,
  createContext,
  isValidElement,
  useContext,
  useId,
  useState,
  type DragEvent,
  type ReactNode,
} from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
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

type GroupState = {
  labelId: string;
  bodyId: string;
  /** Set when the group collapses: the label is then its button. */
  collapsed?: boolean;
  toggle?: () => void;
};

const GroupContext = createContext<GroupState | undefined>(undefined);

const isPart = (child: ReactNode, type: unknown) => isValidElement(child) && child.type === type;

/**
 * A set of sidebar items under one heading. With a `SidebarGroupLabel`
 * inside, the group is announced by that label; a `SidebarGroupAction`
 * sits at the heading's end, for the group's menu.
 *
 * - **Collapsible:** with `onCollapsedChange`, the label is a button that
 *   says by `aria-expanded` whether the group is open and reports a press.
 *   The caller renders what stays shown while it is collapsed: nothing, or
 *   the item that is open, so the current page never vanishes.
 * - **Drop target:** with `dropTypes` and `onDrop`, a drag carrying one of
 *   those data types marks the group with the focus ring while it is over
 *   it, and dropping hands `onDrop` the drag's data. A drag is never the
 *   only way: give the items and the group a menu that does the same.
 */
export function SidebarGroup({
  collapsed = false,
  onCollapsedChange,
  dropTypes,
  onDrop,
  children,
}: {
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  dropTypes?: readonly string[];
  onDrop?: (data: DataTransfer) => void;
  children: ReactNode;
}) {
  const labelId = useId();
  const bodyId = useId();
  const [over, setOver] = useState(false);
  const parts = Children.toArray(children);
  const label = parts.find((c) => isPart(c, SidebarGroupLabel));
  const action = parts.find((c) => isPart(c, SidebarGroupAction));
  const body = parts.filter((c) => c !== label && c !== action);
  const state: GroupState = onCollapsedChange
    ? { labelId, bodyId, collapsed, toggle: () => onCollapsedChange(!collapsed) }
    : { labelId, bodyId };
  const takes = (event: DragEvent) =>
    onDrop !== undefined && (dropTypes ?? []).some((type) => event.dataTransfer.types.includes(type));
  return (
    <GroupContext.Provider value={state}>
      <div
        className="di-sb-group"
        role="group"
        aria-labelledby={label ? labelId : undefined}
        data-drop={over ? "over" : undefined}
        onDragOver={(event) => {
          if (!takes(event)) return;
          event.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(event) => {
          if (!takes(event)) return;
          event.preventDefault();
          setOver(false);
          onDrop?.(event.dataTransfer);
        }}
      >
        {label || action ? (
          <div className="di-sb-group-head">
            {label}
            {action}
          </div>
        ) : null}
        <div className="di-sb-group-body" id={bodyId}>
          {body}
        </div>
      </div>
    </GroupContext.Provider>
  );
}

/**
 * The heading of a `SidebarGroup`, which also names the group for assistive
 * technology. Hidden in the collapsed rail. In a collapsible group it is the
 * button that opens and collapses it. With `dragType` and `dragValue` it is
 * dragged, carrying that value, so a person moves the group by its heading.
 */
export function SidebarGroupLabel({
  children,
  dragType,
  dragValue,
}: {
  children: string;
  dragType?: string;
  dragValue?: string;
}) {
  const group = useContext(GroupContext);
  const drag =
    dragType !== undefined && dragValue !== undefined
      ? {
          draggable: true,
          onDragStart: (event: DragEvent) => event.dataTransfer.setData(dragType, dragValue),
        }
      : {};
  if (group?.toggle)
    return (
      <button
        type="button"
        className="di-sb-group-label di-sb-group-toggle"
        id={group.labelId}
        aria-expanded={!group.collapsed}
        aria-controls={group.bodyId}
        onClick={group.toggle}
        {...drag}
      >
        <span className="di-sb-trailing" aria-hidden>
          {group.collapsed ? <ChevronRight /> : <ChevronDown />}
        </span>
        {children}
      </button>
    );
  return (
    <div className="di-sb-group-label" id={group?.labelId} {...drag}>
      {children}
    </div>
  );
}

/**
 * The group's action at the end of its heading: one ghost `Button` or a
 * `Menu` with the group's options (sort, move, rename). Hidden in the
 * collapsed rail, with the label.
 */
export function SidebarGroupAction({ children }: { children: ReactNode }) {
  return <div className="di-sb-group-action">{children}</div>;
}
