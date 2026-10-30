import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cx } from "../../../internal/cx";
import "./TextLink.css";

type Common = {
  /** Muted until hover, for a secondary link beside a field or under a form ("Forgot password?"). Still underlined. */
  quiet?: boolean;
  /** Set in the code face, for an identifier a machine wrote that opens its record ("REG-0148"). */
  mono?: boolean;
  /** A link among many, in a dense table or a row of figures: underlined on hover and focus only, so the figures read first. */
  plain?: boolean;
  /**
   * A trailing mark for an action link at a block's edge (a panel's meta,
   * the end of a list): `arrow` goes on to another page of the app,
   * `external` leaves it. Never in running text.
   */
  trail?: "arrow" | "external";
};

/**
 * `href` decides the element, the way it does on `Button` and `Breadcrumb`:
 * no `href` is a `<button>` that acts, an `href` is an `<a>` that navigates,
 * so a link to another record opens in a new tab and copies like one. A
 * router's link component goes in `render`; it renders the `<a>` itself.
 */
type ButtonProps = Common & ButtonHTMLAttributes<HTMLButtonElement> & { href?: never; render?: never };
type LinkProps = Common & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "type"> & { href: string; render?: never };
type RenderProps = Common &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "type" | "href"> & { href?: never; render: useRender.RenderProp };

const trails = { arrow: "→", external: "↗" };

/**
 * A link in a line of text or at the edge of a block: ink, underlined in
 * cornflower, because underline means clickable.
 *
 * - **Use it** to open a record, another page or an external document, or
 *   for a small action that reads as a word in a sentence.
 * - **Not** for the action a form or a dialog exists for (`Button`), for a
 *   link that should look like a button (`Button` with `href`), for the
 *   app's sections (`Sidebar`) or a record's sections (`TabNav`).
 *
 * Variants: `quiet` mutes the colour (a secondary link beside a field);
 * `mono` sets a machine-written id in the code face; `plain` hides the
 * underline until hover, only where the place already says it is a link (a
 * dense table); `trail` adds → or ↗ to an action link at a block's edge.
 * They combine: an id in a table is `mono quiet`.
 *
 * The element follows `href`: an `<a>` with `href`, a router link with
 * `render`, otherwise a `<button>` that acts. A disabled link is a button
 * with `disabled`.
 *
 * Accessibility: a link is announced as a link and a button as a button;
 * the trailing mark is hidden from screen readers, so an external link says
 * where it goes in its words or its `aria-label`.
 */
export function TextLink(props: ButtonProps | LinkProps | RenderProps) {
  const { quiet = false, mono = false, plain = false, trail, className, render, ...rest } = props;
  const classes = cx("di-textlink", quiet && "is-quiet", mono && "is-mono", plain && "is-plain", className);
  const children = withTrail(rest.children, trail);
  const routed = useRender({
    render: render ?? <span />,
    props: mergeProps<"a">({ className: classes }, { ...(rest as AnchorHTMLAttributes<HTMLAnchorElement>), children }),
  });
  if (render !== undefined) {
    return routed;
  }
  if (props.href !== undefined) {
    const anchor = rest as AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <a {...anchor} className={classes}>
        {children}
      </a>
    );
  }
  const { type = "button", ...buttonRest } = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button {...buttonRest} type={type} className={classes}>
      {children}
    </button>
  );
}

function withTrail(children: ReactNode, trail: Common["trail"]) {
  if (trail === undefined) return children;
  return (
    <>
      {children}
      <span className="di-textlink-trail" aria-hidden>
        {trails[trail]}
      </span>
    </>
  );
}
