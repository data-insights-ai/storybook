import type { AnchorHTMLAttributes, ButtonHTMLAttributes, Ref } from "react";
import type { useRender } from "@base-ui/react/use-render";
import { cx } from "../../../internal/cx";
import { renderInto } from "../../../internal/renderInto";
import { useShortcutKeys } from "../../../internal/shortcutKeys";
import { Badge } from "../../status/Badge";
import { Kbd } from "../../text/Kbd";
import "../../text/TextLink/TextLink.css";
import "./Button.css";

type Variant = "primary" | "secondary" | "ghost" | "link" | "danger" | "seal" | "inferred";
/** A button's role in the layout, not the density: density scales every size. */
type Size = "sm" | "md" | "lg";

type Common = {
  /**
   * `seal` is a brand moment, not an operational action: sign-in, an empty
   * or onboarding state, issuing a licence or a certificate. Never in an
   * operational view, where gold marks the one thing; there, rotating a key
   * or sealing an entry is `primary` or `secondary`.
   *
   * `ghost` is a quiet button among other controls: no frame and no
   * underline, a ground on hover. `link` is drawn as a `TextLink` (ink,
   * underlined in the selection navy, the size of its line) for an action that
   * reads as a word: beside a field, under a form, in a sentence. A link
   * takes no `size`, `iconOnly` or `badge`, and draws no key cap or spinner.
   *
   * `danger` is destructive. Where it opens the question (a toolbar, a row,
   * a `DangerAction`) it reads as a normal control until hovered; in a
   * `DialogFooter` or `ProposalActions`, where it answers the question, it
   * is the final commit and filled red. Disabled, it looks like any other
   * disabled control.
   */
  variant?: Variant;
  /** `sm` in a row of buttons alone (a table row's actions), `md` the standard and beside any field, `lg` a sign-in or a brand page. */
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
  /**
   * A count drawn after the icon, such as unread notifications: a number
   * (more than 99 draws "99+") or the text to draw. `0` draws nothing. The
   * drawn count is hidden from screen readers; say it in `badgeLabel`.
   */
  badge?: number | string;
  /** The count in words, added to the button's name: "3 unread" makes "Notifications, 3 unread". */
  badgeLabel?: string;
};

/**
 * `href` decides the element, the way it does on `Breadcrumb` and
 * `TextLink`: no `href` is a `<button>` that acts, an `href` is an `<a>`
 * that navigates. A router's link component goes in `render` and renders
 * the `<a>` itself, so the button's look goes onto the router's link. There
 * is no `as` and no `asChild` — a second way to say the same thing, and
 * neither of them can make `href` mandatory on the link.
 */
type ButtonProps = Common &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: never; render?: never; ref?: Ref<HTMLButtonElement> };
type LinkProps = Common & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "type"> & { href: string; render?: never };
type RenderProps = Common &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "type" | "href"> & { href?: never; render: useRender.RenderProp };

const drawn = (badge: number | string | undefined) => {
  if (badge === undefined || badge === 0 || badge === "") return null;
  return typeof badge === "number" && badge > 99 ? "99+" : String(badge);
};

/**
 * Navy acts, paper waits. Solid navy is the only filled control in a
 * view, so there is never a question which button commits. After dark
 * the fill turns paper-white, because navy cannot act against a navy ground.
 *
 * **When to use:** the action the view exists for (`primary`, one per
 * view), the actions beside it (`secondary`), quiet actions among other
 * controls (`ghost`), an action that reads as a word (`link`).
 * **When not to:** going to another page from running text (`TextLink`
 * with `href`); a choice that stays set (`ChoiceGroup`, `Switch`); a row's
 * many actions (`Menu`).
 *
 * The icon is the first child. An icon-only button needs `aria-label`.
 *
 * **Badge:** `badge={3}` with `badgeLabel="3 unread"` on an icon-only ghost
 * button named "Notifications" draws the count after the icon, inside the
 * button, which widens for it, so the count never covers the glyph or
 * a neighbour. Its name is read as "Notifications, 3 unread".
 *
 * **Links:** `href` renders an `<a>`; `render={<Link to="/cases" />}` hands
 * the same look, name and key to a router's link, so it navigates without
 * a page load. A blocked link (`disabled` or `loading`) is an `<a>` with no
 * address in either case.
 *
 * **Accessibility:** a `<button>`, or an `<a>` with `href` or `render`;
 * `loading` sets `aria-busy`; `shortcut` sets `aria-keyshortcuts`. On a
 * touch screen every button, a small one and a link too, has a hit area of
 * at least 40px.
 */
export function Button(props: ButtonProps | LinkProps | RenderProps) {
  const {
    variant = "primary",
    size = "md",
    iconOnly = false,
    loading = false,
    disabled = false,
    shortcut,
    badge,
    badgeLabel,
    className: extra,
    render,
    children,
    "aria-label": label,
    ...rest
  } = props;
  useShortcutKeys(Boolean(shortcut));
  const link = variant === "link";
  const keyed = shortcut ? { "data-di-shortcut": shortcut, "aria-keyshortcuts": shortcut } : {};
  const count = link ? null : drawn(badge);
  const counted = count !== null && badgeLabel ? badgeLabel : undefined;
  const name = label && counted ? `${label}, ${counted}` : label;
  const hint =
    shortcut && !iconOnly && !link ? (
      <span className="di-btn-kbd" aria-hidden="true">
        <Kbd tone="onControl">{shortcut.toUpperCase()}</Kbd>
      </span>
    ) : null;
  const content = (
    <>
      {loading && !link ? <span className="di-btn-spinner" aria-hidden /> : null}
      {children}
      {count !== null ? (
        <span className="di-btn-badge" aria-hidden="true">
          <Badge tone="neutral">{count}</Badge>
        </span>
      ) : null}
      {counted && !label ? <span className="di-sr">, {counted}</span> : null}
      {hint}
    </>
  );

  const className = link
    ? cx("di-textlink", "di-btn-link", extra)
    : cx(
        "di-btn",
        `di-btn-${variant}`,
        `di-btn-${size}`,
        iconOnly && "di-btn-icon",
        count !== null && "di-btn-counted",
        loading && "di-btn-loading",
        extra,
      );
  const own = { ...keyed, "aria-busy": loading || undefined, "aria-label": name, className };
  const blocked = disabled || loading;
  if (render !== undefined && !blocked) return renderInto(render, { ...rest, ...own, children: content });

  if (render !== undefined || props.href !== undefined) {
    const { href, ...anchor } = rest as AnchorHTMLAttributes<HTMLAnchorElement>;
    /*
     * An anchor has no `disabled`, so a blocked link drops its address, and
     * a routed one its router link, which would carry it: it cannot be
     * followed, cannot be tabbed to, and says why. Leaving the href and
     * cancelling the click would still navigate on middle-click, and on the
     * keyboard for anyone who never sees the cursor change. Without its
     * `href` an anchor is no longer a link, so `role="link"` keeps it one
     * and `aria-disabled` is read on a link.
     */
    return (
      <a
        {...anchor}
        {...own}
        href={blocked ? undefined : href}
        role={blocked ? "link" : undefined}
        aria-disabled={blocked || undefined}
      >
        {content}
      </a>
    );
  }

  const { type = "button", ...buttonRest } = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button {...buttonRest} {...own} type={type} disabled={blocked}>
      {content}
    </button>
  );
}
