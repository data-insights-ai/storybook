/** Where the focus ring of the focused control is painted, and the box it covers. */

export type Box = { left: number; top: number; right: number; bottom: number };

export type Ring = {
  /** The element that paints the outline; for a pseudo-element, its host. */
  host: Element;
  pseudo: "::before" | "::after" | null;
  color: string;
  /** The painted box the outline follows. */
  box: Box;
  /** The ring's outer and inner edges. */
  outer: Box;
  inner: Box;
};

const PSEUDOS = [null, "::before", "::after"] as const;

/** Painted at all: a decorative part hidden from assistive technology still shows its ring; a visually hidden input does not. */
function painted(el: Element): boolean {
  const rect = el.getBoundingClientRect();
  if (rect.width < 2 || rect.height < 2) return false;
  for (let node: Element | null = el; node; node = node.parentElement) {
    const style = getComputedStyle(node);
    if (style.display === "none" || style.visibility === "hidden" || Number(style.opacity) === 0) return false;
    if (style.clipPath === "inset(50%)" || style.clip === "rect(0px, 0px, 0px, 0px)") return false;
  }
  return true;
}

export const inflate = (box: Box, by: number): Box => ({
  left: box.left - by,
  top: box.top - by,
  right: box.right + by,
  bottom: box.bottom + by,
});

export const boxOf = (el: Element): Box => {
  const { left, top, right, bottom } = el.getBoundingClientRect();
  return { left, top, right, bottom };
};

/** A length of `translate`, in pixels of the box it moves. */
const shift = (value: string | undefined, size: number) =>
  !value ? 0 : value.endsWith("%") ? (parseFloat(value) / 100) * size : parseFloat(value) || 0;

/**
 * A pseudo-element has no client rect; an absolutely placed one is read
 * from its used offsets and size, moved by its `translate`.
 */
function pseudoBox(host: Element, style: CSSStyleDeclaration): Box {
  const outer = boxOf(host);
  if (style.position !== "absolute") return outer;
  const hostStyle = getComputedStyle(host);
  const width = parseFloat(style.width);
  const height = parseFloat(style.height);
  const [dx, dy] = style.translate === "none" ? [] : style.translate.split(" ");
  const left = outer.left + parseFloat(hostStyle.borderLeftWidth) + parseFloat(style.left) + shift(dx, width);
  const top = outer.top + parseFloat(hostStyle.borderTopWidth) + parseFloat(style.top) + shift(dy, height);
  return { left, top, right: left + width, bottom: top + height };
}

function outlineOf(host: Element, pseudo: Ring["pseudo"]): Ring | null {
  const style = getComputedStyle(host, pseudo);
  if (style.outlineStyle === "none" || style.display === "none") return null;
  const width = parseFloat(style.outlineWidth);
  if (!(width > 0) || /rgba\(.*,\s*0\)$/.test(style.outlineColor) || style.outlineColor === "transparent") return null;
  const offset = parseFloat(style.outlineOffset) || 0;
  const box = pseudo ? pseudoBox(host, style) : boxOf(host);
  return {
    host,
    pseudo,
    color: style.outlineColor,
    box,
    outer: inflate(box, offset + width),
    inner: inflate(box, offset),
  };
}

/**
 * The control's ring can sit on the control, on a part of it (a box beside a
 * native input, a ::before hit area), on the wrapper that frames it, or on
 * the option a combobox points at.
 */
export function ringsOf(focused: Element): Ring[] {
  const places = new Set<Element>();
  for (let el: Element | null = focused; el && el !== document.body; el = el.parentElement) places.add(el);
  const parent = focused.parentElement ?? focused;
  for (const el of [...parent.querySelectorAll("*")].slice(0, 400)) places.add(el);
  const pointed = focused.getAttribute("aria-activedescendant");
  if (pointed) {
    const option = document.getElementById(pointed);
    if (option) places.add(option);
  }
  const rings: Ring[] = [];
  for (const el of places) {
    if (!painted(el)) continue;
    for (const pseudo of PSEUDOS) {
      const ring = outlineOf(el, pseudo);
      if (ring) rings.push(ring);
    }
  }
  return rings;
}
