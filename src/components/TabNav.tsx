import { useRef, type AnchorHTMLAttributes, type ReactNode } from "react";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cx } from "../cx";
import { useActiveInView } from "./useActiveInView";
import "./Tabs.css";

/**
 * Tabs that are places: each tab is a link with its own URL, so a tab can
 * be bookmarked, shared and reached with Back. The current one carries
 * `aria-current="page"`. Use `Tabs` instead when the panels are views of
 * one record that do not deserve an address.
 */
export function TabNav({ label, className, children }: { label: string; className?: string; children: ReactNode }) {
  const strip = useRef<HTMLElement>(null);
  useActiveInView(strip);
  return (
    <nav ref={strip} aria-label={label} className={cx("di-tabs", className)}>
      {children}
    </nav>
  );
}

export type TabNavLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children"> & {
  active?: boolean;
  badge?: string;
  /** Render a router link instead of a plain `<a>`, e.g. `render={<Link to="/a" />}`. */
  render?: useRender.RenderProp;
  children: ReactNode;
};

export function TabNavLink({ active = false, badge, render, className, children, ...rest }: TabNavLinkProps) {
  return useRender({
    render,
    defaultTagName: "a",
    props: mergeProps(
      {
        className: cx("di-tab", active && "is-active", className),
        "aria-current": active ? "page" : undefined,
        children: (
          <>
            {children}
            {badge === undefined ? null : <span className="di-tab-badge">{badge}</span>}
          </>
        ),
      },
      rest,
    ),
  });
}
