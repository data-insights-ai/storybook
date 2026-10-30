import { useState, type ReactElement } from "react";
import { Tooltip as Base } from "@base-ui/react/tooltip";
import { Badge } from "../../status/Badge";
import { alignToFit, type Align, type Side } from "./alignToFit";
import "./Tooltip.css";

/**
 * A short label for a control that has none: an icon button, a collapsed
 * navigation item, a code in a table cell. It names; it never holds a fact
 * that lives nowhere else, so a tooltip carrying the scope of an action is
 * a bug.
 *
 * Wraps its trigger, one element that takes a ref (a `Button`, a link, a
 * focusable term). It opens on hover and on keyboard focus, closes on
 * Escape and when the pointer leaves, and is placed in the top layer beside
 * the trigger, so a scroll frame or a clipped panel does not cut it off.
 *
 * Placement: centred on the trigger, its arrow on the trigger's centre.
 * Where a centred bubble would come closer than 8px to the window's edge,
 * it lines up with the trigger's edge on that side instead, and the arrow
 * stays on the trigger. Where its side has no room, it opens on the
 * opposite side.
 * The trigger keeps its own accessible name; the tooltip repeats it for
 * the eye.
 *
 * `badge` carries a count beside the label, such as the unread count of a
 * collapsed navigation item.
 */
export function Tooltip({
  label,
  side = "top",
  badge = "",
  badgeTone = "neutral",
  children,
}: {
  label: string;
  /** Where it opens from the trigger; it flips when there is no room. */
  side?: Side;
  /** A count beside the label. Empty means none. */
  badge?: string;
  badgeTone?: "neutral" | "alert" | "seal";
  /** The trigger: one element that takes a ref. */
  children: ReactElement;
}) {
  const [trigger, setTrigger] = useState<HTMLElement | null>(null);
  const [align, setAlign] = useState<Align>("center");
  const measure = (popup: HTMLElement | null) => {
    if (popup && trigger) setAlign(alignToFit(trigger, popup, side));
  };
  return (
    <Base.Root onOpenChange={(open) => (open ? undefined : setAlign("center"))}>
      <Base.Trigger ref={setTrigger} delay={300} render={children} />
      <Base.Portal>
        <Base.Positioner
          side={side}
          align={align}
          // The arrow, an 8px square turned 45°, reaches 6px out: 12 keeps its tip clear of the trigger's focus ring.
          sideOffset={12}
          collisionPadding={8}
          arrowPadding={8}
          className="di-tooltip-positioner"
        >
          <Base.Popup ref={measure} className="di-tooltip">
            <Base.Arrow className="di-tooltip-arrow" />
            {label}
            {badge === "" ? null : <Badge tone={badgeTone}>{badge}</Badge>}
          </Base.Popup>
        </Base.Positioner>
      </Base.Portal>
    </Base.Root>
  );
}
