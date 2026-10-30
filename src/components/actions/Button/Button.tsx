import type { AnchorHTMLAttributes, ButtonHTMLAttributes, Ref } from "react";
import { cx } from "../../../internal/cx";
import { useShortcutKeys } from "../../../internal/shortcutKeys";
import "./Button.css";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "seal" | "inferred";
type Size = "dense" | "md" | "comfort";

type Common = {
  /**
   * `seal` is a brand moment, not an operational action: sign-in, an empty
   * or onboarding state, issuing a licence or a certificate. Never in an
   * operational view, where gold marks the one thing; there, rotating a key
   * or sealing an entry is `primary` or `secondary`.
   */
  variant?: Variant;
  size?: Size;
  /** A square control: a filter, a pagination arrow, a kebab. */
  iconOnly?: boolean;
  /** Swaps the icon for a spinner and blocks the press. */
  loading?: boolean;
  disabled?: boolean;
  /**
   * The page key that presses it: `n` for the primary create action, `e`
   * for Edit. The key shows beside the label and in the shortcut help.
   */
  shortcut?: string;
};

/**
 * `href` decides the element, the way it does on `Breadcrumb`: no `href`
 * is a `<button>` that acts, an `href` is an `<a>` that navigates. There
 * is no `as` and no `asChild` — a second way to say the same thing, and
 * neither of them can make `href` mandatory on the link.
 */
type ButtonProps = Common & ButtonHTMLAttributes<HTMLButtonElement> & { href?: never; ref?: Ref<HTMLButtonElement> };
type LinkProps = Common & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "type"> & { href: string };

/**
 * Navy acts, paper waits. Solid navy is the only filled control in a
 * view, so there is never a question which button commits. After dark
 * the fill turns paper-white, because navy cannot act against a navy ground.
 *
 * The icon is the first child. An icon-only button needs `aria-label`.
 */
export function Button(props: ButtonProps | LinkProps) {
  const { variant = "primary", size = "md", iconOnly = false, loading = false, disabled = false, shortcut } = props;
  useShortcutKeys(Boolean(shortcut));
  const keyed = shortcut ? { "data-di-shortcut": shortcut, "aria-keyshortcuts": shortcut } : {};
  const hint =
    shortcut && !iconOnly ? (
      <kbd className="di-btn-kbd" aria-hidden="true">
        {shortcut.toUpperCase()}
      </kbd>
    ) : null;

  const className = cx(
    "di-btn",
    `di-btn-${variant}`,
    `di-btn-${size}`,
    iconOnly && "di-btn-icon",
    loading && "di-btn-loading",
    props.className,
  );

  if (props.href !== undefined) {
    const {
      href,
      variant: _v,
      size: _s,
      iconOnly: _i,
      loading: _l,
      disabled: _d,
      className: _c,
      shortcut: _k,
      children,
      ...rest
    } = props;
    /*
     * An anchor has no `disabled`, so a blocked link drops its `href`:
     * it cannot be followed, cannot be tabbed to, and says why. Leaving
     * the href and cancelling the click would still navigate on
     * middle-click, and on the keyboard for anyone who never sees the
     * cursor change. Without its `href` an anchor is no longer a link, so
     * `role="link"` keeps it one and `aria-disabled` is read on a link.
     */
    const blocked = disabled || loading;
    return (
      <a
        {...rest}
        {...keyed}
        href={blocked ? undefined : href}
        role={blocked ? "link" : undefined}
        aria-disabled={blocked || undefined}
        aria-busy={loading || undefined}
        className={className}
      >
        {loading ? <span className="di-btn-spinner" aria-hidden /> : null}
        {children}
        {hint}
      </a>
    );
  }

  const {
    type = "button",
    variant: _v,
    size: _s,
    iconOnly: _i,
    loading: _l,
    disabled: _d,
    className: _c,
    href: _h,
    shortcut: _k,
    children,
    ...rest
  } = props;
  return (
    <button
      {...rest}
      {...keyed}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={className}
    >
      {loading ? <span className="di-btn-spinner" aria-hidden /> : null}
      {children}
      {hint}
    </button>
  );
}
