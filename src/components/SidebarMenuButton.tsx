
import { lazy, Suspense, type HTMLAttributes, type ReactNode } from "react";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { ChevronsUpDown } from "lucide-react";
import { cx } from "../cx";
import { Badge } from "./Badge";
import { useSidebar, useSidebarRail } from "./SidebarContext";
import "./SidebarMenu.css";

/* Only the collapsed rail shows tooltips; loading them with the rail keeps
 * the tooltip and positioning code out of an expanded sidebar's first load. */
const SidebarRailTooltip = lazy(() => import("./SidebarRailTooltip"));

export type BadgeTone = "neutral" | "alert" | "seal";

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
   * The item opens a menu (a context switcher, say); a chevron after the label
   * says so. Hidden in the collapsed rail. Any other item closes the sheet the
   * sidebar is on a phone.
   */
  menu?: boolean;
};

export function SidebarMenuButton({
  label,
  children,
  active = false,
  badge,
  badgeTone = "neutral",
  href,
  render,
  menu = false,
  className,
  ...rest
}: SidebarMenuButtonProps) {
  const rail = useSidebarRail();
  const { mobile, setMobileOpen } = useSidebar();

  const element = useRender({
    render,
    defaultTagName: href !== undefined ? "a" : "button",
    props: mergeProps(
      {
        className: cx("di-sb-button", className),
        // On a phone the sidebar is a sheet over the page; choosing an item is done with it.
        // An item that opens a menu has not been chosen yet.
        ...(mobile && !menu ? { onClick: () => setMobileOpen(false) } : {}),
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
            {menu ? (
              <span className="di-sb-trailing" aria-hidden>
                <ChevronsUpDown />
              </span>
            ) : null}
          </>
        ),
      },
      rest,
    ),
  });

  if (!rail) {
    return element;
  }
  return (
    <Suspense fallback={element}>
      <SidebarRailTooltip label={label} badge={badge} badgeTone={badgeTone}>
        {element}
      </SidebarRailTooltip>
    </Suspense>
  );
}
