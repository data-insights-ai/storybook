import { Children, createContext, isValidElement, useContext, useEffect, useRef, type ReactNode } from "react";
import { cx } from "../../../internal/cx";
import "./Flyout.css";

/**
 * A panel that drops from a control in the topbar: the latest
 * notifications under their bell, the recent items under a history button.
 * Use a `Dialog` for work the page has to wait for, a `Menu` for actions on
 * a row, and a `Tooltip` to name a control.
 *
 * Anatomy: the title (the panel's name, in the display face), the body —
 * usually `FlyoutItems` — and an optional `FlyoutFooter` with the link to
 * the full page. All of it sits at one inset, with no band and no rule.
 *
 * Not modal: the page stays usable. The panel is a labelled `dialog`
 * region that takes focus when it opens; Escape and a press outside close
 * it, and Escape returns focus to the trigger.
 */
export function Flyout({
  id,
  title,
  open,
  onOpenChange,
  children,
}: {
  /** The panel's id, for the trigger's `aria-controls`. */
  id: string;
  /** The panel's heading and accessible name. */
  title: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** `FlyoutTrigger`, the body (usually `FlyoutItems`), and optionally one `FlyoutFooter`. */
  children: ReactNode;
}) {
  const anchor = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLElement>(null);
  const trigger: ReactNode[] = [];
  const footer: ReactNode[] = [];
  const body: ReactNode[] = [];
  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.type === FlyoutTrigger) trigger.push(child);
    else if (isValidElement(child) && child.type === FlyoutFooter) footer.push(child);
    else body.push(child);
  });

  useEffect(() => {
    if (!open) return;
    panel.current?.focus();
    const press = (event: PointerEvent) => {
      if (!anchor.current?.contains(event.target as Node)) onOpenChange(false);
    };
    const key = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      onOpenChange(false);
      anchor.current?.querySelector<HTMLElement>(".di-flyout-trigger button, .di-flyout-trigger a")?.focus();
    };
    document.addEventListener("pointerdown", press);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("pointerdown", press);
      document.removeEventListener("keydown", key);
    };
  }, [open, onOpenChange]);

  const titleId = `${id}-title`;
  return (
    <div ref={anchor} className="di-flyout-anchor">
      {trigger}
      {open ? (
        <section ref={panel} id={id} className="di-flyout" role="dialog" aria-labelledby={titleId} tabIndex={-1}>
          <h2 className="di-flyout-title" id={titleId}>
            {title}
          </h2>
          <div className="di-flyout-body">{body}</div>
          {footer}
        </section>
      ) : null}
    </div>
  );
}

/** The control that opens the panel; it keeps its own `onClick`. */
export function FlyoutTrigger({ children }: { children: ReactNode }) {
  return <div className="di-flyout-trigger">{children}</div>;
}

/** The panel's last row: a link to the full page, then one quiet action such as "Mark all read". */
export function FlyoutFooter({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx("di-flyout-footer", className)}>{children}</div>;
}

const Unread = createContext("");

/**
 * The entries of the panel, newest first, as `FlyoutItem`s. `unreadLabel`
 * is the word a screen reader hears for an unread entry's dot.
 */
export function FlyoutItems({
  label,
  unreadLabel,
  children,
}: {
  /** The list's accessible name, such as "Latest notifications". */
  label: string;
  /** Read after an unread entry's title, such as "unread". */
  unreadLabel: string;
  children: ReactNode;
}) {
  return (
    <Unread.Provider value={unreadLabel}>
      <ul className="di-flyout-items" aria-label={label}>
        {children}
      </ul>
    </Unread.Provider>
  );
}

/**
 * One entry: what happened, and when. An unread entry carries a dot in the
 * left column and a semibold title; a read one is regular. The time sits
 * in its own column at the right, so the times line up. With `href` the
 * entry is a link to its record, with `onSelect` a button.
 */
export function FlyoutItem({
  title,
  time,
  unread = false,
  href,
  onSelect,
}: {
  title: string;
  /** When it happened, as the reader reads it: "09:12", "Yesterday". */
  time: string;
  unread?: boolean;
  href?: string;
  onSelect?: () => void;
}) {
  const unreadLabel = useContext(Unread);
  const content = (
    <>
      <span className="di-flyout-item-mark" aria-hidden>
        {unread ? <span className="di-flyout-item-dot" /> : null}
      </span>
      <span className="di-flyout-item-title">
        {title}
        {unread && unreadLabel ? <span className="di-sr">, {unreadLabel}</span> : null}
      </span>
      <span className="di-flyout-item-time">{time}</span>
    </>
  );
  const className = cx("di-flyout-item", "di-row", unread && "is-unread");
  return (
    <li>
      {href !== undefined ? (
        <a className={className} href={href}>
          {content}
        </a>
      ) : (
        <button type="button" className={className} onClick={onSelect}>
          {content}
        </button>
      )}
    </li>
  );
}
