import { BLEED, isSurface } from "./clearance";
import { describe, groundOf, hasEdge, opaque } from "./paint";

/**
 * Measured spacing: a surface holds its content at the same inset above as
 * below (within 2px), and the gaps between its parts — head, body, foot —
 * are steps of the space scale. Text is measured by its line box (its
 * line-height, centred on the glyphs), a control, a medium, a drawn box or
 * a nested surface by its border box. Each surface is measured at its own content height,
 * so a panel stretched to its row's height is judged by its padding, not by
 * the row.
 */
const SCALE = [4, 6, 8, 12, 16, 24, 32, 48, 64, 96];
const TOLERANCE = 2;
const ALLOWED: [selector: string, reason: string][] = [
  [
    ".di-logo-cell, .di-swatch-col, .di-accent-use",
    "a Foundations specimen: the drawing is sized to show the asset, not to hold text at an inset",
  ],
  [".di-chart-card", "ChartCard becomes a Panel with a Grid (the accepted Charts consolidation); measured there"],
  [
    ".di-shell, .di-login",
    "a page frame: its bar or canvas runs to the edge, and the page ends where its content ends",
  ],
  [".sb-window", "the Storybook window around the older patterns: its title bar is its top edge"],
  [".di-command", "the palette's input is its head, edge to edge, as the clearance check allows"],
];
const ALLOW = ALLOWED.map(([selector]) => selector).join(", ");

type Extent = { top: number; bottom: number; bleeds?: Extent };

/* Content that runs to a surface's edge by design: a table's rows, a picture. */
const EDGE_TO_EDGE = "table, img, video, canvas, figure, .di-table-wrap";

function lineBox(rect: DOMRect, host: Element): Extent {
  /* The outermost box that holds just this one line: an inline mark sits on its block's line, not on its own. */
  let line: DOMRect | null = null;
  for (let el: Element | null = host; el; el = el.parentElement) {
    const box = el.getBoundingClientRect();
    const leading = parseFloat(getComputedStyle(el).lineHeight) || box.height;
    const middle = (rect.top + rect.bottom) / 2;
    if (box.height > leading * 1.5 + 1 || box.top > middle || box.bottom < middle) break;
    line = box;
  }
  if (line && line.height >= rect.height - 4) return { top: line.top, bottom: line.bottom };
  const leading = parseFloat(getComputedStyle(host).lineHeight);
  if (!leading) return { top: rect.top, bottom: rect.bottom };
  const middle = (rect.top + rect.bottom) / 2;
  return { top: middle - leading / 2, bottom: middle + leading / 2 };
}

/*
 * The content's top and bottom. The walk stops at a full-bleed element
 * (a table, a control, a medium) or a nested surface and takes its box.
 */
/*
 * A rail down one side of a surface — a status column, an icon column —
 * runs its full height by design. It is not content above or below.
 */
function railOf(surface: Element): (rect: DOMRect) => boolean {
  const box = surface.getBoundingClientRect();
  return (rect) => rect.top - box.top <= 2 && box.bottom - rect.bottom <= 2 && rect.width < box.width / 4;
}

function extentsIn(
  part: Element,
  surfaceOf: (el: Element) => boolean,
  whole?: Element,
  surface: Element | undefined = whole,
): Extent | null {
  const rail = surface ? railOf(surface) : () => false;
  let top = Infinity;
  let bottom = -Infinity;
  let bleeds: Extent | undefined;
  const take = (box: Extent) => {
    top = Math.min(top, box.top);
    bottom = Math.max(bottom, box.bottom);
  };
  const visit = (node: Node, isPart: boolean) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const host = node.parentElement;
      if (!host || !(node.textContent ?? "").trim() || !seen(host)) return;
      const range = document.createRange();
      range.selectNodeContents(node);
      for (const rect of range.getClientRects()) if (rect.width >= 1) take(lineBox(rect, host));
      return;
    }
    if (!(node instanceof Element) || hiddenItself(node)) return;
    const root = node === whole;
    if (
      !root &&
      ((!isPart && node.matches(BLEED)) || node.matches(".di-chart") || surfaceOf(node) || paintsBox(node))
    ) {
      const rect = node.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1 || rail(rect)) return;
      take({ top: rect.top, bottom: rect.bottom });
      if (node.matches(EDGE_TO_EDGE))
        bleeds = {
          top: Math.min(bleeds?.top ?? Infinity, rect.top),
          bottom: Math.max(bleeds?.bottom ?? -Infinity, rect.bottom),
        };
      return;
    }
    for (const child of node.childNodes) visit(child, false);
  };
  visit(part, true);
  return top === Infinity ? null : { top, bottom, bleeds };
}

/*
 * A surface as the clearance check reads it, less a box whose only edge is
 * a rule on some of its sides: that is a divided row of the surface around
 * it, not a surface of its own.
 */
function enclosed(el: Element): boolean {
  if (!isSurface(el)) return false;
  const style = getComputedStyle(el);
  const sides = ["top", "right", "bottom", "left"].filter(
    (side) =>
      parseFloat(style.getPropertyValue(`border-${side}-width`)) > 0 &&
      style.getPropertyValue(`border-${side}-style`) !== "none",
  ).length;
  const shadow = style.boxShadow !== "none" && style.boxShadow.split(/,(?![^(]*\))/).some((s) => !s.includes("inset"));
  const ground = opaque(style.backgroundColor) && groundOf(el)?.color !== style.backgroundColor;
  return ground || shadow || sides === 4 || sides === 0;
}

/* What the eye sees, aria-hidden or not: a decorative rule is still on the page. */
function seen(el: Element): boolean {
  if (el.closest(".di-sr, [hidden]")) return false;
  if (el.parentElement?.closest("details:not([open])") && !el.closest("summary")) return false;
  const rect = el.getBoundingClientRect();
  if (rect.width < 1 || rect.height < 1) return false;
  for (let node: Element | null = el; node; node = node.parentElement) {
    const style = getComputedStyle(node);
    if (style.display === "none" || style.visibility === "hidden" || Number(style.opacity) === 0) return false;
  }
  return true;
}

/* Hidden by its own style; a box of no size is walked through, since what it holds can overflow it. */
function hiddenItself(el: Element): boolean {
  if (el.matches(".di-sr, [hidden]")) return true;
  if (el.parentElement?.matches("details:not([open])") && !el.matches("summary")) return true;
  const style = getComputedStyle(el);
  return style.display === "none" || style.visibility === "hidden" || Number(style.opacity) === 0;
}

/* A box drawn on the surface — a pill, an icon tile, a rule, a track, a tick scale — counts by its edges. */
function paintsBox(el: Element): boolean {
  const style = getComputedStyle(el);
  if (style.backgroundImage !== "none" || hasEdge(style)) return true;
  const ruled = ["top", "right", "bottom", "left"].some(
    (side) =>
      parseFloat(style.getPropertyValue(`border-${side}-width`)) > 0 &&
      style.getPropertyValue(`border-${side}-style`) !== "none" &&
      !/^(transparent|rgba\(.*,\s*0\))$/.test(style.getPropertyValue(`border-${side}-color`)),
  );
  if (ruled) return true;
  return opaque(style.backgroundColor) && groundOf(el)?.color !== style.backgroundColor;
}

/* The surface's parts: its children, read through any wrapper that holds just one. */
function partsOf(surface: Element): Element[] {
  let parts = [...surface.children].filter(seen);
  while (parts.length === 1 && !enclosed(parts[0]) && !parts[0].matches(BLEED))
    parts = [...parts[0].children].filter(seen);
  return parts;
}

const onScale = (gap: number) => gap <= TOLERANCE || SCALE.some((step) => Math.abs(gap - step) <= TOLERANCE);

/* Ends an animation at its last frame; a loop (a spinner) has none and keeps turning. */
function settle(animation: Animation) {
  if (animation.effect?.getComputedTiming().endTime !== Infinity) animation.finish();
}

/*
 * Measures a copy of the surface laid out at its own content height, beside
 * it and off screen, so the page itself never moves and nothing it holds
 * hears a resize.
 */
function atContentHeight<T>(el: HTMLElement, measure: (copy: HTMLElement) => T): T {
  const still = document.createElement("style");
  still.textContent = "[data-spacing-copy], [data-spacing-copy] * { transition: none !important; }";
  const copy = el.cloneNode(true) as HTMLElement;
  copy.setAttribute("data-spacing-copy", "");
  copy.removeAttribute("id");
  copy.style.cssText += `;position:absolute!important;inset:0 auto auto -100000px!important;width:${el.getBoundingClientRect().width}px!important;box-sizing:border-box!important;height:auto!important;min-height:0!important;max-height:none!important;margin:0!important;translate:none!important;transform:none!important`;
  const running = new Set(document.getAnimations());
  document.head.append(still);
  el.after(copy);
  for (const animation of copy.getAnimations({ subtree: true })) settle(animation);
  try {
    return measure(copy);
  } finally {
    copy.remove();
    still.remove();
    // A sibling for a moment can flip a :has() or :last-child rule on the page; what that started ends at once.
    void getComputedStyle(el).width;
    for (const animation of document.getAnimations()) if (!running.has(animation)) settle(animation);
  }
}

type Measured = {
  above: number;
  below: number;
  edgeToEdge: boolean;
  gaps: { from: Element; to: Element; gap: number }[];
};

/** One surface measured at its content height: the inset above and below its content, and the gaps between its parts. */
export function measureSpacing(surface: HTMLElement, surfaceOf: (el: Element) => boolean = enclosed): Measured | null {
  return atContentHeight(surface, (copy) => {
    const box = copy.getBoundingClientRect();
    const style = getComputedStyle(copy);
    const content = extentsIn(copy, surfaceOf, copy);
    if (!content) return null;
    const parts = partsOf(copy)
      .map((part) => ({ part, extent: extentsIn(part, surfaceOf, undefined, copy) }))
      .filter((p): p is { part: Element; extent: Extent } => p.extent !== null)
      .sort((a, b) => a.extent.top - b.extent.top);
    const innerTop = box.top + parseFloat(style.borderTopWidth);
    const innerBottom = box.bottom - parseFloat(style.borderBottomWidth);
    const bleeds = content.bleeds;
    /* A part beside another (a visual next to the text) is not a step down the surface: gaps run from the lowest bottom so far. */
    let reached = -Infinity;
    const gaps = parts.flatMap((p, at) => {
      const gap = { from: parts[at - 1]?.part, to: p.part, gap: p.extent.top - reached };
      reached = Math.max(reached, p.extent.bottom);
      return at === 0 ? [] : [gap as { from: Element; to: Element; gap: number }];
    });
    return {
      above: content.top - innerTop,
      below: innerBottom - content.bottom,
      edgeToEdge: !!bleeds && (bleeds.top - innerTop <= 1 || innerBottom - bleeds.bottom <= 1),
      gaps,
    };
  });
}

export function spacingFindings(root: Element): string[] {
  const findings: string[] = [];
  const known = new Map<Element, boolean>();
  const surfaceOf = (el: Element) => {
    if (!known.has(el)) known.set(el, enclosed(el));
    return known.get(el)!;
  };
  for (const surface of root.querySelectorAll<HTMLElement>("*")) {
    if (!surfaceOf(surface) || !seen(surface) || surface.closest(ALLOW) || surface.parentElement?.closest(BLEED))
      continue;
    const measured = measureSpacing(surface, surfaceOf);
    if (!measured) continue;
    const { above, below, edgeToEdge, gaps } = measured;
    if (!edgeToEdge && above >= 0 && below >= 0 && Math.abs(above - below) > TOLERANCE)
      findings.push(`${describe(surface)}: ${above.toFixed(0)}px above its content, ${below.toFixed(0)}px below`);
    for (const { from, to, gap } of gaps)
      if (gap >= -1 && !onScale(gap))
        findings.push(
          `${describe(surface)}: ${gap.toFixed(0)}px between ${describe(from)} and ${describe(to)}, off the space scale`,
        );
  }
  return findings;
}
