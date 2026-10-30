/** What the surface checks share: what is shown, and which box paints a surface. */

export function shown(el: Element): boolean {
  if (!(el instanceof HTMLElement || el instanceof SVGElement)) return false;
  if (el.closest(".di-sr, [hidden], [inert], [aria-hidden='true']")) return false;
  const details = el.closest("details:not([open])");
  if (details && !el.closest("summary")) return false;
  const rect = el.getBoundingClientRect();
  if (rect.width < 2 || rect.height < 2) return false;
  for (let node: Element | null = el; node; node = node.parentElement) {
    const style = getComputedStyle(node);
    if (style.display === "none" || style.visibility === "hidden" || Number(style.opacity) === 0) return false;
  }
  return true;
}

export function opaque(color: string): boolean {
  const alpha = color.match(/rgba?\([^)]*?,\s*([\d.]+)\)$/);
  return color !== "transparent" && (!alpha || Number(alpha[1]) > 0.5) && !/rgba\(0, 0, 0, 0\)/.test(color);
}

export function hasEdge(style: CSSStyleDeclaration): boolean {
  const border = ["Top", "Right", "Bottom", "Left"].some(
    (side) =>
      parseFloat(style.getPropertyValue(`border-${side.toLowerCase()}-width`)) > 0 &&
      style.getPropertyValue(`border-${side.toLowerCase()}-style`) !== "none" &&
      opaque(style.getPropertyValue(`border-${side.toLowerCase()}-color`)),
  );
  const shadow = style.boxShadow !== "none" && style.boxShadow.split(/,(?![^(]*\))/).some((s) => !s.includes("inset"));
  return border || shadow;
}

/** The nearest ancestor that paints an opaque background, and that background. */
export function groundOf(el: Element): { element: Element; color: string } | null {
  for (let node = el.parentElement; node; node = node.parentElement) {
    const color = getComputedStyle(node).backgroundColor;
    if (opaque(color)) return { element: node, color };
  }
  return null;
}

export function describe(el: Element): string {
  const cls = typeof el.className === "string" ? el.className.trim().split(/\s+/).slice(0, 2).join(".") : "";
  return `${el.tagName.toLowerCase()}${cls ? "." + cls : ""}`;
}
