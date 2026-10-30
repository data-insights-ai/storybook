import { describe, shown } from "./paint";

/**
 * One outline per object (Rule O1): no element outlined on all four sides
 * sits within 8px of another outlined element around it. Selection inside a
 * container is a fill, items in a framed row are either framed cells or
 * unframed inside one frame. Focus rings are temporary and exempt.
 */
const NEAR = 8;

/** Known offenders, each owned by the batch that fixes it; remove an entry with its fix. */
const PENDING = [
  /\.di-matrix-mark\b.* in /,
  /button\.di-btn\.di-btn-secondary in div\.di-bulk/,
  /\.di-kbd-on-control in button\.di-btn/,
  /\.di-search-kbd in div\.di-search/,
  /\.di-choice-segment\.is-chosen in /,
  /\.di-token(\.is-invalid)? in /,
];

function drawn(color: string): boolean {
  return color !== "transparent" && !/rgba\([^)]*,\s*0\)$/.test(color);
}

function outlined(el: Element): boolean {
  if (el.matches(":focus, :focus-visible")) return false;
  const style = getComputedStyle(el);
  const framed = ["top", "right", "bottom", "left"].every(
    (side) =>
      parseFloat(style.getPropertyValue(`border-${side}-width`)) >= 1 &&
      style.getPropertyValue(`border-${side}-style`) !== "none" &&
      drawn(style.getPropertyValue(`border-${side}-color`)),
  );
  return framed || /(^|,\s*)rgba?\([^)]*\) 0px 0px 0px [1-9]/.test(style.boxShadow);
}

export function outlineFindings(root: Element): string[] {
  const findings = new Set<string>();
  for (const el of root.querySelectorAll("*")) {
    if (!outlined(el) || !shown(el)) continue;
    const inner = el.getBoundingClientRect();
    if (inner.width < 8 || inner.height < 8) continue;
    let outer = el.parentElement;
    while (outer && outer !== root && !outlined(outer)) outer = outer.parentElement;
    if (
      !outer ||
      outer === root ||
      el.closest("[popover], dialog, [role=tooltip]") !== outer.closest("[popover], dialog, [role=tooltip]")
    )
      continue;
    const box = outer.getBoundingClientRect();
    const gap = Math.min(
      inner.left - box.left,
      box.right - inner.right,
      inner.top - box.top,
      box.bottom - inner.bottom,
    );
    if (gap < 0 || gap > NEAR) continue;
    const finding = `${describe(el)} in ${describe(outer)}`;
    if (PENDING.some((known) => known.test(finding))) continue;
    findings.add(`${finding} (${Math.round(gap)}px)`);
  }
  return [...findings];
}
