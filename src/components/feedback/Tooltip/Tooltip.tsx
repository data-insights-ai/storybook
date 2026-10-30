import type { ReactElement } from "react";
import { Tooltip as Base } from "@base-ui/react/tooltip";
import { Badge } from "../../marks/Badge";
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
 * It keeps 8px from the viewport's edge, shifting along its side rather
 * than onto the trigger's neighbours.
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
  side?: "top" | "right" | "bottom" | "left";
  /** A count beside the label. Empty means none. */
  badge?: string;
  badgeTone?: "neutral" | "alert" | "seal";
  /** The trigger: one element that takes a ref. */
  children: ReactElement;
}) {
  return (
    <Base.Root>
      <Base.Trigger delay={300} render={children} />
      <Base.Portal>
        <Base.Positioner side={side} sideOffset={8} collisionPadding={8} className="di-tooltip-positioner">
          <Base.Popup className="di-tooltip">
            {label}
            {badge === "" ? null : <Badge tone={badgeTone}>{badge}</Badge>}
          </Base.Popup>
        </Base.Positioner>
      </Base.Portal>
    </Base.Root>
  );
}
