import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cx } from "../../../internal/cx";
import "./TextLink.css";

type Common = {
  quiet?: boolean;
  /** A link among many, in a dense table or a row of figures: underlined on hover and focus only, so the figures read first. */
  plain?: boolean;
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

/**
 * A link inside a line of text: an `<a>` with `href`, a router link with
 * `render`, otherwise a button that looks like a link. `quiet` drops the
 * colour until hover; `plain` drops the underline too, for a link whose place
 * already says it is one. A link that looks like a button is a `Button` with
 * `href`.
 */
export function TextLink(props: ButtonProps | LinkProps | RenderProps) {
  const { quiet = false, plain = false, className, render, ...rest } = props;
  const classes = cx("di-textlink", quiet && "is-quiet", plain && "is-plain", className);
  const routed = useRender({
    render: render ?? <span />,
    props: mergeProps<"a">({ className: classes }, rest as AnchorHTMLAttributes<HTMLAnchorElement>),
  });
  if (render !== undefined) {
    return routed;
  }
  if (props.href !== undefined) {
    const { children, ...anchor } = rest as AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <a {...anchor} className={classes}>
        {children}
      </a>
    );
  }
  const { type = "button", ...buttonRest } = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return <button {...buttonRest} type={type} className={classes} />;
}
