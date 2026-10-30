import { useRef, type AnchorHTMLAttributes, type ReactNode } from "react";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cx } from "../../../internal/cx";
import { useActiveInView } from "../../../internal/useActiveInView";
import { useScrollEdges } from "../../../internal/useScrollEdges";
import { TabCount } from "../tabStrip";

/**
 * Tabs that are places: the sections of one record or settings page, each
 * with its own URL, so a tab can be bookmarked, shared and reached with
 * Back.
 *
 * - **Use it** for a record's detail page split into sections (overview,
 *   members, settings), each its own route.
 * - **Not** for views that need no address (`Tabs`), or for the app's
 *   sections (`Sidebar`).
 *
 * Anatomy: a `nav` strip of `TabNavLink`s, each a label and an optional
 * count. It looks like `Tabs` (one shared strip): the current link carries
 * the ink mark on the baseline, and a strip wider than its frame scrolls
 * with the current link in view.
 *
 * Accessibility: a `nav` named by `label`; each link is a tab stop, and
 * the current one has `aria-current="page"`. On a touch screen each link is
 * 40px tall.
 */
export function TabNav({ label, className, children }: { label: string; className?: string; children: ReactNode }) {
  const strip = useRef<HTMLElement>(null);
  useActiveInView(strip);
  const [, edges] = useScrollEdges(strip);
  return (
    <nav
      ref={strip}
      aria-label={label}
      className={cx("di-tabs", edges.start && "is-more-start", edges.end && "is-more-end", className)}
    >
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

/**
 * One tab of a `TabNav`: a link, or a router link through `render`. `active`
 * marks the current page with `aria-current="page"`; `badge` is a count after
 * the label.
 */
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
            {badge === undefined ? null : <TabCount>{badge}</TabCount>}
          </>
        ),
      },
      rest,
    ),
  });
}
