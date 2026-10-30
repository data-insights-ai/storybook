import { describe, opaque } from "../surfaces/paint";
import type { Box, Ring } from "./ring";

export const INTERACTIVE =
  "a[href], button, input:not([type=hidden]), select, textarea, summary, [tabindex]:not([tabindex='-1']), [role=button], [role=link], [role=tab], [role=option], [role=menuitem], [role=menuitemradio], [role=menuitemcheckbox], [role=radio], [role=checkbox], [role=switch], [role=slider], [role=gridcell], [role=treeitem], label:has(input)";

const STEP = 6;

/** Points on the middle line of the ring's band, every few pixels round all four sides. */
function bandPoints(outer: Box, inner: Box): Array<[number, number, string]> {
  const points: Array<[number, number, string]> = [];
  const midX = [(outer.left + inner.left) / 2, (outer.right + inner.right) / 2];
  const midY = [(outer.top + inner.top) / 2, (outer.bottom + inner.bottom) / 2];
  for (let x = midX[0]; x <= midX[1]; x += STEP) {
    points.push([x, midY[0], "top"], [x, midY[1], "bottom"]);
  }
  for (let y = midY[0]; y <= midY[1]; y += STEP) {
    points.push([midX[0], y, "left"], [midX[1], y, "right"]);
  }
  return points;
}

/** The sticky or fixed box a box moves with, if any. */
function layerOf(el: Element): Element | null {
  for (let up: Element | null = el; up && up !== document.body; up = up.parentElement) {
    const position = getComputedStyle(up).position;
    if (position === "sticky" || position === "fixed" || up.matches(":modal, :popover-open")) return up;
  }
  return null;
}

/** A box laid over the page (a skip link, a popup): what lies under it is not its neighbour. */
function floatingRoot(el: Element): Element | null {
  for (let up: Element | null = el; up && up !== document.body; up = up.parentElement) {
    const style = getComputedStyle(up);
    if (up.matches(":modal, :popover-open")) return up;
    if ((style.position === "absolute" || style.position === "fixed") && style.zIndex !== "auto") return up;
  }
  return null;
}

function hasFill(el: Element) {
  const style = getComputedStyle(el);
  return (
    opaque(style.backgroundColor) ||
    ["Top", "Right", "Bottom", "Left"].some(
      (side) =>
        parseFloat(style.getPropertyValue(`border-${side.toLowerCase()}-width`)) > 0 &&
        style.getPropertyValue(`border-${side.toLowerCase()}-style`) !== "none" &&
        opaque(style.getPropertyValue(`border-${side.toLowerCase()}-color`)),
    )
  );
}

const inView = (x: number, y: number) => x >= 0 && y >= 0 && x < innerWidth && y < innerHeight;

const VOID = "input, select, textarea, img, video, canvas, iframe, hr, br";

/**
 * A stand-in for the ring that hit tests: an empty box laid over the band,
 * placed in the ring host (beside it, for an input) so it sits in the same
 * stacking context and under the same clips as the outline.
 */
function standIn(ring: Ring): HTMLElement {
  const probe = document.createElement("div");
  probe.style.cssText =
    "position:absolute;left:0;top:0;margin:0;padding:0;border:0;pointer-events:auto;visibility:visible";
  if (ring.host.matches(VOID)) ring.host.after(probe);
  else ring.host.append(probe);
  const at = probe.getBoundingClientRect();
  probe.style.left = `${ring.outer.left - at.left}px`;
  probe.style.top = `${ring.outer.top - at.top}px`;
  probe.style.width = `${ring.outer.right - ring.outer.left}px`;
  probe.style.height = `${ring.outer.bottom - ring.outer.top}px`;
  return probe;
}

/**
 * What the ring runs into: another control or a neighbouring item's fill
 * (b), and a sticky bar, a footer or a scrim painted over it (e). The
 * paint stack at each point of the band, read with a stand-in for the ring
 * in it, says what lies there and whether it is drawn above the ring. What
 * lies under the opaque surface the ring is drawn on is hidden by it.
 */
export function collisions(ring: Ring, focused: Element) {
  const label = focused.closest("label");
  const related = (el: Element) =>
    el.contains(ring.host) ||
    ring.host.contains(el) ||
    el.contains(focused) ||
    focused.contains(el) ||
    (label?.contains(el) ?? false);
  const overlaps = new Map<Element, string>();
  const covers = new Map<Element, string>();
  const floating = floatingRoot(ring.host);
  const hostLayer = layerOf(ring.host);
  const probe = standIn(ring);
  try {
    for (const [x, y, side] of bandPoints(ring.outer, ring.inner)) {
      if (!inView(x, y)) continue;
      const stack = document.elementsFromPoint(x, y);
      const own = stack.indexOf(probe);
      if (own === -1) continue;
      const floor = stack.findIndex(
        (el, index) => index > own && el.contains(ring.host) && opaque(getComputedStyle(el).backgroundColor),
      );
      stack.forEach((el, index) => {
        if (el === probe || (floor !== -1 && index > floor)) return;
        if (related(el) || el === document.documentElement || el === document.body) return;
        const layer = layerOf(el);
        if (index < own && layer && layer !== hostLayer && !layer.contains(ring.host) && hasFill(el)) {
          const how = getComputedStyle(layer).position;
          if (!covers.has(el)) covers.set(el, `${side} under ${how} ${describe(el)}`);
          return;
        }
        if (floating && !floating.contains(el)) return;
        if (el.matches(INTERACTIVE) || hasFill(el)) {
          const control = el.closest(INTERACTIVE);
          const item = control && !related(control) ? control : el;
          if (!overlaps.has(item)) overlaps.set(item, `${side} over ${describe(item)}`);
        }
      });
    }
  } finally {
    probe.remove();
  }
  return { overlaps: [...overlaps.values()], covers: [...covers.values()] };
}
