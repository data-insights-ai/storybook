import { Children, isValidElement, useEffect, useRef, type ReactNode } from "react";
import { cx } from "../cx";
import "./Flyout.css";

/**
 * A panel that drops from a control in the topbar, such as the latest
 * notifications under their bell. The trigger sits in `FlyoutTrigger`, the
 * panel's actions in `FlyoutFooter`; every other child is the body.
 *
 * Not modal: the page stays usable. Escape and a press outside close it,
 * and Escape returns focus to the trigger.
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

/** The panel's actions, under the body: a link to the full page, a bulk action. */
export function FlyoutFooter({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx("di-flyout-footer", className)}>{children}</div>;
}
