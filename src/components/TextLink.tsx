import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import { cx } from "../cx";
import "./TextLink.css";

type Common = { quiet?: boolean };

/**
 * `href` decides the element, the way it does on `Button` and `Breadcrumb`:
 * no `href` is a `<button>` that acts, an `href` is an `<a>` that navigates,
 * so a link to another record opens in a new tab and copies like one.
 */
type ButtonProps = Common & ButtonHTMLAttributes<HTMLButtonElement> & { href?: never };
type LinkProps = Common & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "type"> & { href: string };

export function TextLink(props: ButtonProps | LinkProps) {
  if (props.href !== undefined) {
    const { quiet = false, className, ...rest } = props;
    return <a {...rest} className={cx("di-textlink", quiet && "is-quiet", className)} />;
  }

  const { quiet = false, className, type = "button", href: _h, ...rest } = props;
  return <button {...rest} type={type} className={cx("di-textlink", quiet && "is-quiet", className)} />;
}
