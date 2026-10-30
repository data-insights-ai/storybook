import { hex, over, parse, ratio, type Rgba } from "../contrast/visibleContrast";
import { describe } from "../surfaces/paint";
import { boxOf, type Box, type Ring } from "./ring";

const WHITE: Rgba = { r: 255, g: 255, b: 255, a: 1 };

/** The colour a box shows: its own background over whatever its ancestors paint. */
function paintOf(el: Element | null): Rgba {
  const layers: Rgba[] = [];
  for (let up = el; up; up = up.parentElement) {
    const colour = parse(getComputedStyle(up).backgroundColor);
    if (colour && colour.a > 0) {
      layers.push(colour);
      if (colour.a >= 1) break;
    }
  }
  return layers.reduceRight((below, top) => over(top, below), WHITE);
}

const round = (value: number) => Math.round(value * 100) / 100;

/**
 * (c) The ring against what it replaces, at least 3:1: the ground outside
 * the control where the ring sits outside it, the control's own fill where
 * the ring is drawn inside it.
 */
export function weakContrast(ring: Ring): string[] {
  const colour = parse(ring.color);
  if (!colour) return [`ring colour ${ring.color} cannot be read`];
  const found: string[] = [];
  const check = (where: string, ground: Rgba) => {
    const value = ratio(over(colour, ground), ground);
    if (value < 3) found.push(`ring ${hex(colour)} is ${round(value)}:1 against the ${where} ${hex(ground)}`);
  };
  const outside = ring.outer.left < ring.box.left - 0.5;
  const inside = ring.inner.left > ring.box.left + 0.5;
  if (outside) check("ground outside it", paintOf(ring.pseudo ? ring.host : ring.host.parentElement));
  if (inside || !outside) check("fill inside it", paintOf(ring.host));
  return found;
}

const SELECTION_TOKENS = ["--di-select", "--di-focus", "--di-choice-selected-edge", "--di-sidebar-focus"];

function selectionColours(host: Element): Rgba[] {
  const probe = document.createElement("span");
  (host.parentElement ?? document.body).append(probe);
  const colours = SELECTION_TOKENS.map((token) => {
    probe.style.color = `var(${token}, transparent)`;
    return parse(getComputedStyle(probe).color);
  }).filter((c): c is Rgba => !!c && c.a > 0);
  probe.remove();
  return colours;
}

const near = (a: Rgba, b: Rgba) => b.a >= 0.5 && Math.abs(a.r - b.r) + Math.abs(a.g - b.g) + Math.abs(a.b - b.b) < 24;

/** A frame drawn in the selection colour on all four sides: a border or an inset spread. */
function selectionFrame(el: Element, colours: Rgba[]): { box: Box; width: number } | null {
  const style = getComputedStyle(el);
  const sides = ["top", "right", "bottom", "left"];
  const widths = sides.map((side) => parseFloat(style.getPropertyValue(`border-${side}-width`)));
  const tinted = sides.every((side, i) => {
    const colour = parse(style.getPropertyValue(`border-${side}-color`));
    return (
      widths[i] >= 1 &&
      style.getPropertyValue(`border-${side}-style`) !== "none" &&
      colour &&
      colours.some((c) => near(c, colour))
    );
  });
  if (tinted) return { box: boxOf(el), width: Math.min(...widths) };
  const spread = style.boxShadow.match(/(rgba?\([^)]*\)) 0px 0px 0px ([\d.]+)px inset/);
  if (spread) {
    const colour = parse(spread[1]);
    if (colour && colours.some((c) => near(c, colour))) return { box: boxOf(el), width: parseFloat(spread[2]) };
  }
  return null;
}

const SIDES = ["left", "top", "right", "bottom"] as const;

/** How far a box edge lies outward, so the four sides compare alike. */
const outward = (box: Box, side: (typeof SIDES)[number]) =>
  side === "left" || side === "top" ? -box[side] : box[side];

/**
 * (d) One indicator: a selection frame that runs parallel to the focus ring
 * with a visible gap of up to 4px reads as a second ring. A ring drawn over
 * the frame, or touching it, is one indicator.
 */
export function doubleRing(ring: Ring): string[] {
  const colours = selectionColours(ring.host);
  const candidates = new Set<Element>([ring.host, ...ring.host.querySelectorAll(":scope > *, :scope > * > *")]);
  for (let up = ring.host.parentElement, i = 0; up && i < 3; up = up.parentElement, i++) candidates.add(up);
  const found: string[] = [];
  for (const el of candidates) {
    const frame = selectionFrame(el, colours);
    if (!frame) continue;
    const gaps = SIDES.map((side) => {
      const [ringIn, ringOut] = [outward(ring.inner, side), outward(ring.outer, side)];
      const frameOut = outward(frame.box, side);
      const frameIn = frameOut - frame.width;
      return Math.max(frameIn - ringOut, ringIn - frameOut, 0);
    });
    if (gaps.every((gap) => gap > 0.5 && gap <= 4))
      found.push(
        `a selection frame on ${describe(el)} runs ${Math.round(Math.max(...gaps))}px from the ring: two rings`,
      );
  }
  return found;
}
