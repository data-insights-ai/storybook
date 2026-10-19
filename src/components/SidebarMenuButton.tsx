
import type { HTMLAttributes, ReactNode } from "react";
import { Tooltip } from "@base-ui/react/tooltip";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cx } from "../cx";
import { Badge } from "./Badge";
import { useSidebarRail } from "./SidebarContext";
import "./Tooltip.css";
import "./SidebarMenu.css";

type BadgeTone = "neutral" | "alert" | "seal";

export type SidebarMenuButtonProps = Omit<HTMLAttributes<HTMLElement>, "children"> & {
  label: string;
  /** The leading icon: one lucide icon, as on `Button`. */
  children?: ReactNode;
  active?: boolean;
  badge?: string;
  badgeTone?: BadgeTone;
  href?: string;
  /** A router link element, e.g. `<Link to="/findings" />`; it receives the item's props and content. */
  render?: useRender.RenderProp;
  /**
   * An icon after the label that says what the item does, e.g. a chevron on
   * an item that opens a menu. Hidden in the collapsed rail.
   */
  trailing?: ReactNode;
};

export function SidebarMenuButton({
  label,
  children,
  active = false,
  badge,
  badgeTone = "neutral",
  href,
  render,
  trailing,
  className,
  ...rest
}: SidebarMenuButtonProps) {
  const rail = useSidebarRail();

  const element = useRender({
    render,
    defaultTagName: href !== undefined ? "a" : "button",
    props: mergeProps(
      {
        className: cx("di-sb-button", className),
        ...(href !== undefined ? { href } : {}),
        ...(href === undefined && render === undefined ? { type: "button" } : {}),
        "aria-current": active ? "page" : undefined,
        children: (
          <>
            {children ? <span className="di-sb-icon">{children}</span> : null}
            <span className="di-sb-label">{label}</span>
            {badge ? (
              <span className="di-sb-badge">
                <Badge tone={badgeTone}>{badge}</Badge>
              </span>
            ) : null}
            {trailing ? <span className="di-sb-trailing" aria-hidden>{trailing}</span> : null}
          </>
        ),
      },
      rest,
    ),
  });

  return (
    <Tooltip.Root disabled={!rail}>
      <Tooltip.Trigger render={element} />
      <Tooltip.Portal>
        <Tooltip.Positioner side="right" sideOffset={12} className="di-sb-tooltip">
          <Tooltip.Popup className="di-tooltip">
            {label}
            {badge ? <Badge tone={badgeTone}>{badge}</Badge> : null}
          </Tooltip.Popup>
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}
