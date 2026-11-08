/** What the surface checks share: which box paints a surface. What is shown is `shown` in `src/checks/surfaces.ts`. */

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
