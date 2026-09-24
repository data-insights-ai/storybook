import { useCallback, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { cx } from "../cx";
import { SealMark } from "./Seal";
import "./Menu.css";

/**
 * A row's actions, kept out of the row until asked for. Arrow keys move
 * between the items, Home and End jump the ends, Escape closes and
 * returns focus to the trigger — the roving focus a `role="menu"` owes
 * its user.
 *
 * Controlled by the caller, because what the menu does usually needs a
 * confirmation the menu itself cannot own.
 */
export function Menu({
  open,
  onOpenChange,
  trigger,
  label,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The control that opens the menu. It gets the trigger wiring. */
  trigger: (props: {
    "aria-expanded": boolean;
    "aria-haspopup": "menu";
    "aria-controls": string;
    onClick: () => void;
    ref: (node: HTMLButtonElement | null) => void;
  }) => ReactNode;
  /** Names the menu, e.g. "Actions for entry 04". */
  label: string;
  children: ReactNode;
}) {
  const id = useId();
  const list = useRef<HTMLDivElement>(null);
  const [triggerNode, setTriggerNode] = useState<HTMLButtonElement | null>(null);

  const items = useCallback(
    () => Array.from(list.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []),
    [],
  );

  const close = useCallback(() => {
    onOpenChange(false);
    triggerNode?.focus();
  }, [onOpenChange, triggerNode]);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const all = items();
    const at = all.indexOf(document.activeElement as HTMLElement);
    if (event.key === "Escape") {
      event.preventDefault();
      close();
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      all[(at + 1) % all.length]?.focus();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      all[(at - 1 + all.length) % all.length]?.focus();
    } else if (event.key === "Home") {
      event.preventDefault();
      all[0]?.focus();
    } else if (event.key === "End") {
      event.preventDefault();
      all[all.length - 1]?.focus();
    }
  }

  return (
    <div className="di-menu-anchor">
      {trigger({
        "aria-expanded": open,
        "aria-haspopup": "menu",
        "aria-controls": id,
        onClick: () => onOpenChange(!open),
        ref: setTriggerNode,
      })}
      {open ? (
        <div
          id={id}
          ref={list}
          role="menu"
          aria-label={label}
          className="di-menu"
          onKeyDown={onKeyDown}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}

export function MenuItem({
  onSelect,
  tone = "default",
  inferred = false,
  children,
}: {
  onSelect: () => void;
  tone?: "default" | "danger";
  /** A model proposed this one, so it carries the hollow ring. */
  inferred?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      className={cx("di-menu-item", tone === "danger" && "is-danger")}
      onClick={onSelect}
    >
      {inferred ? <SealMark state="inferred" size={6} /> : null}
      {children}
    </button>
  );
}

export function MenuDivider() {
  return <div className="di-menu-divider" role="separator" />;
}
