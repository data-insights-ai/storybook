/**
 * WCAG 1.4.11 for the marks a chart cannot be read without: each must reach
 * 3:1 against what it sits on, measured where it is painted (the surface, a
 * lane's track, the overview's ground). Text is `visibleContrast`'s job;
 * gridlines, rules, tints behind a threshold and veils are support and not
 * listed. A mark is listed with the neighbour it has to stand apart from;
 * without one it is measured against the ground it sits on.
 */
import { hex, opacity, over, parse, ratio, type Rgba } from "./visibleContrast";

export type MarkFinding = { mark: string; colour: string; against: string; ratio: number };

type Mark = { selector: string; against?: (mark: Element) => Element | null | undefined; shadow?: boolean };

const overviewGround = (mark: Element) =>
  mark.closest(".di-timeline-overview")?.querySelector(".di-timeline-overview-ground");

const MARKS: Mark[] = [
  { selector: ".di-timeline-wave .di-timeline-fill", against: overviewGround },
  {
    selector: ".di-timeline-lanes .di-timeline-fill",
    against: (mark) => mark.parentElement?.querySelector(".di-timeline-lane-track"),
  },
  { selector: ".di-timeline-stem" },
  { selector: ".di-timeline-tip" },
  { selector: ".di-timeline-threshold" },
  { selector: ".di-timeline-score-line" },
  { selector: ".di-timeline-handle", against: overviewGround },
  { selector: ".di-chart-key-swatch.is-box" },
  { selector: ".di-tsummary-stretch" },
  { selector: ".di-tsummary-block-fill", shadow: true },
  { selector: ".di-period-bar", against: (mark) => mark.closest(".di-period-track") },
  { selector: ".di-chain-links path" },
];

const clear: Rgba = { r: 0, g: 0, b: 0, a: 0 };

/** What the element paints: an SVG shape's fill (its stroke for a line or an unfilled shape), a box's background or its first inset shadow. */
function paintOf(element: Element, shadow = false): Rgba | null {
  const style = getComputedStyle(element);
  let colour: Rgba | null;
  if (element instanceof SVGGeometryElement) {
    const stroked = style.fill === "none" || element instanceof SVGLineElement;
    colour = parse(stroked ? style.stroke : style.fill);
    if (colour) colour = { ...colour, a: colour.a * parseFloat(stroked ? style.strokeOpacity : style.fillOpacity) };
  } else if (shadow) {
    colour = parse(/(rgba?\([^)]*\)|#[0-9a-f]+)/i.exec(style.boxShadow)?.[1] ?? "");
  } else {
    colour = parse(style.backgroundColor);
  }
  return colour && colour.a > 0 ? { ...colour, a: colour.a * opacity(element) } : null;
}

/** The ancestors' backgrounds composited down to the first opaque one. */
function groundUnder(element: Element): Rgba {
  const layers: Rgba[] = [];
  for (let node = element.parentElement; node; node = node.parentElement) {
    const paint = node instanceof SVGElement ? null : parse(getComputedStyle(node).backgroundColor);
    if (!paint || paint.a === 0) continue;
    layers.push(paint);
    if (paint.a >= 1) break;
  }
  return layers.reverse().reduce((ground, layer) => over(layer, ground), { r: 255, g: 255, b: 255, a: 1 });
}

/** Drawn and not folded away: a fold closes by clipping its content to nothing. */
function drawn(element: Element) {
  if (!element.checkVisibility({ visibilityProperty: true, opacityProperty: true })) return false;
  const box = element.getBoundingClientRect();
  if (box.width === 0 && box.height === 0) return false;
  for (let node = element.parentElement; node; node = node.parentElement) {
    const style = getComputedStyle(node);
    if (style.overflow === "visible") continue;
    const edge = node.getBoundingClientRect();
    if (edge.width < 1 || edge.height < 1) return false;
  }
  return true;
}

export function markContrast(root: Element): MarkFinding[] {
  const findings = new Map<string, MarkFinding>();
  for (const { selector, against, shadow } of MARKS) {
    for (const element of root.querySelectorAll(selector)) {
      if (!drawn(element)) continue;
      const ground = groundUnder(element);
      const neighbour = against?.(element);
      const back = neighbour ? over(paintOf(neighbour) ?? clear, ground) : ground;
      const paint = paintOf(element, shadow);
      if (!paint) continue;
      const shown = over(paint, back);
      const value = Math.floor(ratio(shown, back) * 100) / 100;
      if (value >= 3) continue;
      const finding = { mark: selector, colour: hex(shown), against: hex(back), ratio: value };
      findings.set(`${selector} ${finding.colour} ${finding.against}`, finding);
    }
  }
  return [...findings.values()];
}
