import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import { cx } from "../cx";
import "./Button.css";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "seal" | "inferred";
type Size = "dense" | "md" | "comfort";

type Common = {
  variant?: Variant;
  size?: Size;
  /** A square control: a filter, a pagination arrow, a kebab. */
  iconOnly?: boolean;
  /** Swaps the icon for a spinner and blocks the press. */
  loading?: boolean;
  disabled?: boolean;
};

/**
 * `href` decides the element, the way it does on `Breadcrumb`: no `href`
 * is a `<button>` that acts, an `href` is an `<a>` that navigates. There
 * is no `as` and no `asChild` — a second way to say the same thing, and
 * neither of them can make `href` mandatory on the link.
 */
type ButtonProps = Common & ButtonHTMLAttributes<HTMLButtonElement> & { href?: never };
type LinkProps = Common & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "type"> & { href: string };

/**
 * Navy acts, paper waits. Solid navy is the only filled control on the
 * sheet, so there is never a question which button commits. After dark
 * the fill turns gold, because navy cannot act against a navy ground.
 *
 * The icon is the first child. An icon-only button needs `aria-label`.
 */
export function Button(props: ButtonProps | LinkProps) {
  const { variant = "primary", size = "md", iconOnly = false, loading = false, disabled = false } = props;

  const className = cx(
    "di-btn",
    `di-btn-${variant}`,
    `di-btn-${size}`,
    iconOnly && "di-btn-icon",
    loading && "di-btn-loading",
    props.className,
  );

  if (props.href !== undefined) {
    const { href, variant: _v, size: _s, iconOnly: _i, loading: _l, disabled: _d, className: _c, children, ...rest } = props;
    /*
     * An anchor has no `disabled`, so a blocked link drops its `href`:
     * it cannot be followed, cannot be tabbed to, and says why. Leaving
     * the href and cancelling the click would still navigate on
     * middle-click, and on the keyboard for anyone who never sees the
     * cursor change.
     */
    const blocked = disabled || loading;
    return (
      <a
        {...rest}
        href={blocked ? undefined : href}
        aria-disabled={blocked || undefined}
        aria-busy={loading || undefined}
        className={className}
      >
        {loading ? <span className="di-btn-spinner" aria-hidden /> : null}
        {children}
      </a>
    );
  }

  const { type = "button", variant: _v, size: _s, iconOnly: _i, loading: _l, disabled: _d, className: _c, href: _h, children, ...rest } = props;
  return (
    <button
      {...rest}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={className}
    >
      {loading ? <span className="di-btn-spinner" aria-hidden /> : null}
      {children}
    </button>
  );
}
