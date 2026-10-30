/**
 * The items in a line of facts (MetaLine, a Tag's name and scope) that begin
 * a visual line and still draw their separator before them: a line must
 * never start with "·" or "→". Judged from the geometry, not from the
 * component's own marking.
 */
export function separatorsAtLineStart(root: Element): string[] {
  const found: string[] = [];
  for (const box of root.querySelectorAll(".di-meta-line-items, .di-tag, .di-tag-press")) {
    let above = -Infinity;
    for (const child of Array.from(box.children)) {
      const { top, bottom, width } = child.getBoundingClientRect();
      if (width === 0) continue;
      const content = getComputedStyle(child, "::before").content;
      if (top >= above - 2 && content !== "none" && content !== "normal") found.push(child.textContent ?? "");
      above = bottom;
    }
  }
  return found;
}
