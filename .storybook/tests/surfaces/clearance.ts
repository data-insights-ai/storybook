import { describe, groundOf, hasEdge, opaque, shown } from "./paint";

/**
 * Edge clearance: text or a control never sits closer than the surface
 * padding to the inner edge of the surface that holds it. A surface is a
 * box at least 120×48 that paints a ground of its own, a border or a
 * shadow. Rows that run full-bleed by design are listed with their reason.
 *
 * 12px of padding measures 10–11px to a text box, which sits inside its
 * line's half-leading, so text needs 10px. A control's frame already holds
 * its label off its own edge; it needs 8px, the bar and toolbar inset.
 */
const MIN_TEXT = 10;
const MIN_CONTROL = 8;
const FULL_BLEED: [selector: string, reason: string][] = [
  ["table, thead, tbody, tr, td, th", "table rows run to the frame; cells carry their own padding"],
  ["[role=listbox], [role=menu], [role=option], [role=menuitem]", "menu and option rows span their popover"],
  ["img, video, canvas, svg, figure", "media is drawn to the edge"],
  ["input, select, textarea, button, a[href]", "a control is its own frame, not a surface"],
  [".di-command-row", "a row whose whole width is the target spans its list"],
  [".di-command-field", "the palette's input is its head, edge to edge"],
  [".di-token-field", "a token field is one control; its chips sit at the field's own inset"],
  [".di-choice-segments", "a row of segments is one control; wrapped, its segments keep the control's own inset"],
  [".di-chart-tip", "a chart tooltip is a label, padded at the label scale"],
  [".di-icon-catalog", "an icon specimen grid: each cell is sized to its icon and longest name"],
];
export const BLEED = FULL_BLEED.map(([selector]) => selector).join(", ");
/* The entries past the generic ones name controls that are themselves full-bleed rows or fields. */
const BLEED_CONTROLS = FULL_BLEED.slice(4)
  .map(([selector]) => selector)
  .join(", ");

export function isSurface(el: Element): boolean {
  if (el.matches(BLEED) || el === document.body || el === document.documentElement) return false;
  const style = getComputedStyle(el);
  const rect = el.getBoundingClientRect();
  if (rect.width < 120 || rect.height < 48) return false;
  if (hasEdge(style)) return true;
  const ground = groundOf(el);
  return opaque(style.backgroundColor) && (!ground || ground.color !== style.backgroundColor);
}

function surfaceOf(el: Element): Element | null {
  for (let node: Element | null = el; node; node = node.parentElement) {
    if (node.matches(BLEED) && node !== el) return null;
    if (node !== el && isSurface(node)) return node;
  }
  return null;
}

function tooClose(inner: DOMRect, surface: Element, min: number): string | null {
  const box = surface.getBoundingClientRect();
  const style = getComputedStyle(surface);
  const edges = {
    left: inner.left - (box.left + parseFloat(style.borderLeftWidth)),
    right: box.right - parseFloat(style.borderRightWidth) - inner.right,
    top: inner.top - (box.top + parseFloat(style.borderTopWidth)),
    bottom: box.bottom - parseFloat(style.borderBottomWidth) - inner.bottom,
  };
  const close = Object.entries(edges).filter(([, gap]) => gap > -1 && gap < min - 0.5);
  return close.length ? close.map(([side, gap]) => `${side} ${gap.toFixed(0)}px`).join(", ") : null;
}

/** The part of a text box a scroll box between it and its surface leaves visible; null when it is scrolled out of view. */
function visiblePart(rect: DOMRect, host: Element, surface: Element): DOMRect | null {
  for (let node: Element | null = host; node && node !== surface; node = node.parentElement) {
    const style = getComputedStyle(node);
    if (style.overflowX === "visible" && style.overflowY === "visible") continue;
    const clip = node.getBoundingClientRect();
    const top = Math.max(rect.top, clip.top);
    const bottom = Math.min(rect.bottom, clip.bottom);
    const left = Math.max(rect.left, clip.left);
    const right = Math.min(rect.right, clip.right);
    if (bottom - top < 1 || right - left < 1) return null;
    rect = new DOMRect(left, top, right - left, bottom - top);
  }
  return rect;
}

export function clearanceFindings(root: Element): string[] {
  const findings = new Set<string>();
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const host = node.parentElement;
    if (!host || !(node.textContent ?? "").trim() || !shown(host) || host.closest(BLEED)) continue;
    const surface = surfaceOf(host);
    if (!surface) continue;
    const range = document.createRange();
    range.selectNodeContents(node);
    for (const box of range.getClientRects()) {
      const rect = box.width < 1 ? null : visiblePart(box, host, surface);
      if (!rect) continue;
      const close = tooClose(rect, surface, MIN_TEXT);
      if (close)
        findings.add(`"${node.textContent!.trim().slice(0, 30)}" is ${close} from the edge of ${describe(surface)}`);
    }
  }
  for (const control of root.querySelectorAll("input, select, textarea, button, a[href]")) {
    if (!shown(control) || control.matches(BLEED_CONTROLS) || control.parentElement?.closest(BLEED)) continue;
    const surface = surfaceOf(control);
    if (!surface) continue;
    const close = tooClose(control.getBoundingClientRect(), surface, MIN_CONTROL);
    if (close) findings.add(`${describe(control)} is ${close} from the edge of ${describe(surface)}`);
  }
  return [...findings];
}
