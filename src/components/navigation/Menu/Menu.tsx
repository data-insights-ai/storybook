import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { Check } from "lucide-react";
import { cx } from "../../../internal/cx";
import { SealMark } from "../../marks/SealValue";
import { fixedOrigin, menuBounds, placeMenu, type MenuDirection } from "./menuPlacement";
import "./Menu.css";

/**
 * A row's actions, kept out of the row until asked for. Arrow keys move
 * between the items, Home and End jump the ends, a letter jumps to the
 * next item that starts with it, Escape closes and returns focus to the
 * trigger — the roving focus a `role="menu"` owes
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
  align = "end",
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
    onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
    ref: (node: HTMLButtonElement | null) => void;
  }) => ReactNode;
  /** Names the menu, e.g. "Actions for entry 04". */
  label: string;
  /** Align the detached plane to the trigger’s start or end edge. */
  align?: "start" | "end";
  children: ReactNode;
}) {
  const id = useId();
  const list = useRef<HTMLDivElement>(null);
  const anchor = useRef<HTMLDivElement>(null);
  const entry = useRef<"first" | "last">("first");
  const changeOpen = useRef(onOpenChange);
  changeOpen.current = onOpenChange;
  const [triggerNode, setTriggerNode] = useState<HTMLButtonElement | null>(null);
  const [direction, setDirection] = useState<MenuDirection>("down");

  // The plane opens in the top layer (a manual popover), placed beside its
  // trigger, so no ancestor that clips, transforms or stacks it (a table's
  // frame, a collapsed sidebar) cuts it off, while it stays in the trigger's
  // subtree for focus, outside clicks and the theme. Without popovers it is
  // fixed in the box its ancestors give it. In a collapsed sidebar's rail it
  // opens to the right, near the viewport's bottom upwards. It follows the
  // trigger while the page scrolls rather than closing, because opening it
  // can scroll the trigger into view.
  useLayoutEffect(() => {
    const plane = list.current;
    if (!open || !triggerNode || !plane || !anchor.current) return;
    const container = anchor.current;
    const topLayer = typeof plane.showPopover === "function";
    if (topLayer && !plane.matches(":popover-open")) plane.showPopover();
    const beside = triggerNode.closest('.di-sb[data-state="collapsed"]') !== null;
    const measure = () => {
      const viewport = { width: document.documentElement.clientWidth, height: window.innerHeight };
      const bounds = menuBounds(beside ? null : triggerNode, viewport.width);
      plane.style.setProperty("--di-menu-room", `${bounds.right - bounds.left}px`);
      plane.style.setProperty("--di-menu-anchor-width", `${container.offsetWidth}px`);
      const place = placeMenu(
        triggerNode.getBoundingClientRect(),
        { width: plane.offsetWidth, height: plane.offsetHeight },
        viewport,
        { align, beside, bounds },
      );
      const origin = topLayer ? { x: 0, y: 0 } : fixedOrigin(container);
      plane.style.top = `${place.top - origin.y}px`;
      plane.style.left = `${place.left - origin.x}px`;
      setDirection(place.direction);
    };
    measure();
    window.addEventListener("scroll", measure, { capture: true, passive: true });
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", measure, { capture: true });
      window.removeEventListener("resize", measure);
    };
  }, [open, triggerNode, align]);

  const items = useCallback(
    () => Array.from(list.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"], [role="menuitemradio"]') ?? []).filter((item) => !item.disabled),
    [],
  );

  useEffect(() => {
    if (!open) return;
    const all = items();
    (all.length === 0 ? list.current : entry.current === "last" ? all[all.length - 1] : all[0])?.focus();
    entry.current = "first";
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Node && !anchor.current?.contains(event.target)) changeOpen.current(false);
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open, items]);

  // Choosing an item closes the menu, and the focused item unmounts with it. Focus that falls to
  // the body goes back to the trigger; focus that already moved on (Tab, a click on another
  // control) stays where it went.
  const wasOpen = useRef(false);
  useEffect(() => {
    if (open) {
      wasOpen.current = true;
      return;
    }
    if (!wasOpen.current) return;
    wasOpen.current = false;
    if (document.activeElement === null || document.activeElement === document.body) triggerNode?.focus();
  }, [open, triggerNode]);

  const close = useCallback(() => {
    onOpenChange(false);
    triggerNode?.focus();
  }, [onOpenChange, triggerNode]);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const all = items();
    const at = all.indexOf(document.activeElement as HTMLButtonElement);
    if (event.key === "Escape") {
      event.preventDefault();
      close();
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      all[(at + 1) % all.length]?.focus();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      all[at < 0 ? all.length - 1 : (at - 1 + all.length) % all.length]?.focus();
    } else if (event.key === "Home") {
      event.preventDefault();
      all[0]?.focus();
    } else if (event.key === "End") {
      event.preventDefault();
      all[all.length - 1]?.focus();
    } else if (event.key.length === 1 && event.key !== " " && !event.ctrlKey && !event.metaKey && !event.altKey) {
      const letter = event.key.toLocaleLowerCase();
      const next = [...all.slice(at + 1), ...all.slice(0, at + 1)].find((item) =>
        (item.textContent ?? "").trim().toLocaleLowerCase().startsWith(letter),
      );
      if (next) {
        event.preventDefault();
        next.focus();
      }
    }
  }

  return (
    <div ref={anchor} className="di-menu-anchor" onBlur={(event) => {
      if (open && !event.currentTarget.contains(event.relatedTarget)) onOpenChange(false);
    }}>
      {trigger({
        "aria-expanded": open,
        "aria-haspopup": "menu",
        "aria-controls": id,
        onClick: () => { entry.current = "first"; onOpenChange(!open); },
        onKeyDown: (event) => {
          if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
          event.preventDefault();
          entry.current = event.key === "ArrowUp" ? "last" : "first";
          if (open) {
            const all = items();
            (entry.current === "last" ? all[all.length - 1] : all[0])?.focus();
          } else onOpenChange(true);
        },
        ref: setTriggerNode,
      })}
      {open ? (
        <div
          id={id}
          ref={list}
          popover="manual"
          role="menu"
          tabIndex={-1}
          aria-label={label}
          className={cx("di-menu", `is-${direction}`)}
          onKeyDown={onKeyDown}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) onOpenChange(false);
          }}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}

export function MenuItem({
  onSelect,
  tone = "neutral",
  inferred = false,
  checked,
  disabled = false,
  children,
}: {
  onSelect: () => void;
  tone?: "neutral" | "danger";
  /** A model proposed this one, so it carries the hollow ring. */
  inferred?: boolean;
  /** Defined for one choice in a labelled mutually exclusive group. Omit for an action. */
  checked?: boolean;
  disabled?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      role={checked === undefined ? "menuitem" : "menuitemradio"}
      aria-checked={checked}
      disabled={disabled}
      tabIndex={-1}
      className={cx("di-menu-item", tone === "danger" && "is-danger")}
      onClick={onSelect}
    >
      {checked === undefined ? null : (
        <span className="di-menu-choice-mark" aria-hidden>{checked ? <Check /> : null}</span>
      )}
      {inferred ? <SealMark state="inferred" size={6} /> : null}
      {children}
    </button>
  );
}

/** A labelled set of related actions or mutually exclusive choices. */
export function MenuGroup({ label, children }: { label: string; children: ReactNode }) {
  const id = useId();
  return (
    <div role="group" aria-labelledby={id}>
      <p id={id} className="di-menu-group-label">{label}</p>
      {children}
    </div>
  );
}

export function MenuDivider() {
  return <div className="di-menu-divider" role="separator" />;
}
