import { describe, groundOf, hasEdge, shown } from "./paint";

/**
 * Never a surface on the same surface: a box that draws a border or a
 * shadow on the very colour it stands on reads as a card on a card. A
 * nested surface takes the inset tone, or the outer one drops its fill.
 * Controls (fields, buttons, a selectable card's label) and floating
 * layers are not surfaces.
 */
const NOT_A_SURFACE =
  "input, select, textarea, button, a, label, [role=button], [role=switch], [role=checkbox], [role=radio], [role=slider], dialog, [popover], [role=tooltip], [role=menu], [role=listbox], .di-field-control";

export function nestingFindings(root: Element): string[] {
  const findings: string[] = [];
  for (const el of root.querySelectorAll<HTMLElement>("*")) {
    if (el.matches(NOT_A_SURFACE) || el.closest("button, a, [role=button]")) continue;
    const style = getComputedStyle(el);
    if (style.position === "fixed" || style.position === "absolute") continue;
    const rect = el.getBoundingClientRect();
    if (rect.width < 120 || rect.height < 48 || !hasEdge(style) || !shown(el)) continue;
    const ground = groundOf(el);
    if (!ground || ground.color !== style.backgroundColor) continue;
    findings.push(`${describe(el)} draws an edge on ${describe(ground.element)} in the same colour ${ground.color}`);
  }
  return findings;
}
