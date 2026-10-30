export type Side = "top" | "right" | "bottom" | "left";
export type Align = "start" | "center" | "end";

const EDGE = 8;

/**
 * Centred, unless a centred bubble would come closer than 8px to the
 * window's edge: then it lines up with the trigger's edge on that side, so
 * it stays beside its trigger instead of being pushed against the window.
 */
export function alignToFit(trigger: HTMLElement, popup: HTMLElement, side: Side): Align {
  const box = trigger.getBoundingClientRect();
  const view = trigger.ownerDocument.documentElement;
  const across = side === "top" || side === "bottom";
  const centre = across ? box.left + box.width / 2 : box.top + box.height / 2;
  const half = (across ? popup.offsetWidth : popup.offsetHeight) / 2;
  const room = across ? view.clientWidth : view.clientHeight;
  const before = centre - half < EDGE;
  const after = centre + half > room - EDGE;
  if (before === after) return "center";
  const rtl = across && getComputedStyle(trigger).direction === "rtl";
  return before !== rtl ? "start" : "end";
}
