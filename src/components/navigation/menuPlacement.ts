/** Where a menu's plane opens relative to its trigger. */
export type MenuDirection = "down" | "up" | "right" | "right-up";

type Span = { left: number; right: number };

const gap = 4;
const margin = 8;

/**
 * The viewport position of a plane of this size beside the trigger: below it,
 * or beside it in a collapsed sidebar's rail; upwards when there is no room
 * beneath. Kept inside `bounds` across, the viewport or the frame it opens
 * from.
 */
export function placeMenu(
  at: DOMRect,
  size: { width: number; height: number },
  viewport: { width: number; height: number },
  options: { align: "start" | "end"; beside: boolean; bounds: Span },
): { top: number; left: number; direction: MenuDirection } {
  const screen = { left: margin, right: viewport.width - margin };
  const across = (left: number) => clampX(clampX(left, size.width, options.bounds), size.width, screen);
  if (options.beside) {
    const up = at.top + size.height > viewport.height - margin && at.bottom - size.height >= margin;
    const top = up ? at.bottom - size.height : Math.max(margin, Math.min(at.top, viewport.height - margin - size.height));
    return { top, left: across(at.right + gap), direction: up ? "right-up" : "right" };
  }
  const up = at.bottom + gap + size.height > viewport.height && at.top - gap - size.height > 0;
  const top = up ? at.top - gap - size.height : at.bottom + gap;
  return { top, left: across(options.align === "start" ? at.left : at.right - size.width), direction: up ? "up" : "down" };
}

function clampX(left: number, width: number, bounds: Span) {
  return Math.max(bounds.left, Math.min(left, bounds.right - width));
}

/**
 * The span across that a plane opening from `trigger` keeps to: its nearest
 * ancestor that clips overflow (a sidebar, a rail, a table's frame), so a menu
 * there is no wider than it was when the frame held it, or, without a trigger
 * to keep to, the viewport.
 */
export function menuBounds(trigger: Element | null, viewportWidth: number): Span {
  for (let node = trigger?.parentElement; node && node !== document.body; node = node.parentElement) {
    if (getComputedStyle(node).overflowX !== "visible") {
      const frame = node.getBoundingClientRect();
      return { left: Math.max(margin, frame.left + gap), right: Math.min(viewportWidth - margin, frame.right - gap) };
    }
  }
  return { left: margin, right: viewportWidth - margin };
}

/**
 * The viewport origin of the box a fixed plane inside `anchor` is placed in:
 * the viewport, or an ancestor that transforms, filters or contains its
 * layout (a container query's container does).
 */
export function fixedOrigin(anchor: HTMLElement): { x: number; y: number } {
  const probe = document.createElement("div");
  probe.style.position = "fixed";
  probe.style.inset = "0 auto auto 0";
  probe.style.width = "0";
  probe.style.height = "0";
  anchor.append(probe);
  const at = probe.getBoundingClientRect();
  probe.remove();
  return { x: at.left, y: at.top };
}
