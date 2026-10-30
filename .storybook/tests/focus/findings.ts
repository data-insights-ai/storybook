import { describe } from "../surfaces/paint";
import { clippedBy } from "./clip";
import { doubleRing, weakContrast } from "./indicator";
import { collisions, INTERACTIVE } from "./neighbours";
import { ringsOf } from "./ring";

export type RingFinding = { control: string; check: string; detail: string };

/** Everything wrong with the ring the focused control shows now. */
export function ringFindings(focused: Element): RingFinding[] {
  const control = `${describe(focused)}${focused.textContent?.trim() ? ` "${focused.textContent.trim().slice(0, 24)}"` : ""}`;
  const rings = ringsOf(focused);
  if (rings.length === 0 && (!focused.matches(INTERACTIVE) || focused.matches("[tabindex='-1']"))) return [];
  if (rings.length === 0) return [{ control, check: "no ring", detail: "focused by Tab, nothing draws a ring" }];
  const found: RingFinding[] = [];
  for (const ring of rings) {
    const on = ring.host === focused && !ring.pseudo ? "" : ` (ring on ${describe(ring.host)}${ring.pseudo ?? ""})`;
    for (const cut of clippedBy(ring))
      found.push({
        control,
        check: "a clipped",
        detail: `${cut.px}px cut at the ${cut.side} by ${describe(cut.by)}${on}`,
      });
    const { overlaps, covers } = collisions(ring, focused);
    for (const overlap of overlaps) found.push({ control, check: "b overlaps", detail: overlap + on });
    for (const detail of weakContrast(ring)) found.push({ control, check: "c contrast", detail: detail + on });
    for (const detail of doubleRing(ring)) found.push({ control, check: "d double", detail: detail + on });
    for (const cover of covers) found.push({ control, check: "e hidden", detail: cover + on });
  }
  return found;
}
