import type { Box, Ring } from "./ring";

/** A box that is the containing block of fixed descendants as well. */
function holdsFixed(style: CSSStyleDeclaration) {
  return (
    style.transform !== "none" ||
    style.filter !== "none" ||
    style.perspective !== "none" ||
    style.backdropFilter !== "none" ||
    /paint|layout|strict|content/.test(style.contain) ||
    /size/.test(style.containerType) ||
    /transform|filter/.test(style.willChange)
  );
}

const topLayer = (el: Element) => el.matches(":modal, :popover-open");

/** The next box up that can clip this one: the parent for a box in flow, the containing block for a placed one. */
function containingBlock(el: Element): Element | null {
  const position = getComputedStyle(el).position;
  if (position !== "absolute" && position !== "fixed") return el.parentElement;
  for (let up = el.parentElement; up; up = up.parentElement) {
    const style = getComputedStyle(up);
    if (holdsFixed(style)) return up;
    if (position === "absolute" && style.position !== "static") return up;
  }
  return position === "fixed" ? null : document.documentElement;
}

function clipBox(el: Element): { box: Box; x: boolean; y: boolean } | null {
  const style = getComputedStyle(el);
  const paint = /paint|strict|content/.test(style.contain);
  const x = paint || style.overflowX !== "visible";
  const y = paint || style.overflowY !== "visible";
  if (!x && !y) return null;
  const rect = el.getBoundingClientRect();
  return {
    box: {
      left: rect.left + parseFloat(style.borderLeftWidth),
      top: rect.top + parseFloat(style.borderTopWidth),
      right: rect.right - parseFloat(style.borderRightWidth),
      bottom: rect.bottom - parseFloat(style.borderBottomWidth),
    },
    x,
    y,
  };
}

const SLACK = 0.5;

/** Every box that cuts part of the ring away, with the side and how much. */
export function clippedBy(ring: Ring): Array<{ by: Element; side: string; px: number }> {
  const cuts: Array<{ by: Element; side: string; px: number }> = [];
  const { outer } = ring;
  const add = (by: Element, side: string, px: number) => {
    if (px > SLACK) cuts.push({ by, side, px: Math.round(px * 10) / 10 });
  };
  const check = (block: Element) => {
    const clip = clipBox(block);
    if (clip?.x) {
      add(block, "left", clip.box.left - outer.left);
      add(block, "right", outer.right - clip.box.right);
    }
    if (clip?.y) {
      add(block, "top", clip.box.top - outer.top);
      add(block, "bottom", outer.bottom - clip.box.bottom);
    }
  };
  if (ring.pseudo) check(ring.host);
  for (let el: Element | null = ring.host; el && !topLayer(el);) {
    const block = containingBlock(el);
    if (!block || block === document.documentElement || block === document.body) break;
    check(block);
    el = block;
  }
  return cuts;
}
