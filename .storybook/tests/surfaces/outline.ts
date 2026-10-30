import { describe } from "./paint";

/**
 * One outline per object: an element framed on all four sides (a border, or
 * an inset spread ring, as a selection ring is drawn) never sits within 8px
 * inside another framed element. An outer ring is a surface's elevation in
 * dark, its depth rather than a line, as the shadow is in daylight.
 * Selection inside a container is a fill; a key or an entry inside a field
 * is a tone. Focus rings are exempt: they are outlines and they pass. A
 * table cell bounds what it holds: a pill in a cell is measured against the
 * cell, which has no frame, not against the table around it.
 */
const NEAR = 8;

const clear = (color: string) => color === "transparent" || /rgba\(.*,\s*0\)$/.test(color);

function framed(el: Element): boolean {
  const style = getComputedStyle(el);
  if (style.display === "none" || style.visibility === "hidden") return false;
  const sides = (["Top", "Right", "Bottom", "Left"] as const).filter(
    (side) =>
      parseFloat(style.getPropertyValue(`border-${side.toLowerCase()}-width`)) >= 1 &&
      style.getPropertyValue(`border-${side.toLowerCase()}-style`) !== "none" &&
      !clear(style.getPropertyValue(`border-${side.toLowerCase()}-color`)),
  );
  return sides.length === 4 || /0px 0px 0px [1-9][^,]*inset/.test(style.boxShadow);
}

export function outlineFindings(root: Element): string[] {
  const findings: string[] = [];
  for (const el of root.querySelectorAll<HTMLElement>("*")) {
    if (el.matches(":focus-visible") || !framed(el)) continue;
    const box = el.getBoundingClientRect();
    if (box.width < 8 || box.height < 8) continue;
    let outer = el.parentElement;
    while (outer && outer !== root && !outer.matches("td, th") && !framed(outer)) outer = outer.parentElement;
    if (!outer || outer === root || outer.matches("td, th")) continue;
    const frame = outer.getBoundingClientRect();
    const gap = Math.min(
      box.left - frame.left,
      frame.right - box.right,
      box.top - frame.top,
      frame.bottom - box.bottom,
    );
    if (gap >= 0 && gap <= NEAR)
      findings.push(`${describe(el)} is framed ${Math.round(gap)}px inside ${describe(outer)}`);
  }
  return findings;
}
