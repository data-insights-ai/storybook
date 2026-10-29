import { useId, useRef } from "react";
import { Tooltip } from "../Tooltip";
import "./TooltipTarget.css";

/**
 * A term that names itself on hover and on keyboard focus: a code, an id,
 * an abbreviation. The term inherits the type it sits in, so an id in a
 * mono cell stays mono.
 *
 * The label opens in the top layer, so a table's scroll frame does not
 * clip it, and Escape closes it. It is never the only place the fact
 * lives: the screen spells the term out somewhere a reader reaches
 * without hovering.
 */
export function TooltipTarget({
  text,
  label,
  className,
}: {
  /** The term as written. */
  text: string;
  /** What the term means. */
  label: string;
  className?: string;
}) {
  const id = useId();
  const target = useRef<HTMLSpanElement>(null);
  const tip = useRef<HTMLSpanElement>(null);

  const hide = () => {
    if (tip.current?.matches(":popover-open")) tip.current.hidePopover();
    window.removeEventListener("scroll", hide, true);
  };

  const show = () => {
    const anchor = target.current;
    const popup = tip.current;
    if (!anchor || !popup || popup.matches(":popover-open")) return;
    popup.showPopover();
    // The popup's own padding is the gap, so the pointer can cross onto it.
    const a = anchor.getBoundingClientRect();
    const p = popup.getBoundingClientRect();
    popup.style.top = `${a.top >= p.height ? a.top - p.height : a.bottom}px`;
    popup.style.left = `${Math.max(0, Math.min(a.left, window.innerWidth - p.width))}px`;
    // Placed once, in viewport coordinates: a scroll would leave it behind.
    window.addEventListener("scroll", hide, true);
  };

  return (
    <span
      ref={target}
      className={["di-tooltip-target", className].filter(Boolean).join(" ")}
      tabIndex={0}
      aria-describedby={id}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      onKeyDown={(event) => {
        if (event.key === "Escape") hide();
      }}
    >
      {text}
      <span ref={tip} id={id} className="di-tooltip-target-popup" popover="manual">
        <Tooltip>{label}</Tooltip>
      </span>
    </span>
  );
}
