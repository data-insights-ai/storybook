import { describe, shown } from "./paint";

/**
 * A toolbar or a filter bar is one height: a search, a select and the
 * buttons beside them share the field's height, so the row reads as one
 * line of controls. A row of small buttons alone (a table row's actions)
 * is one height too.
 */
const BAR = ".di-toolbar, .di-filter-bar";
const CONTROL = ".di-search, input.di-control, select.di-control, .di-btn:not(.di-btn-link)";
const ELSEWHERE = ".di-toolbar-note, dialog, [popover], .di-menu";

// A button a field draws inside itself (a file picker's Choose) is part of that field, not one of the row's controls.
const inField = (el: HTMLElement) => el.matches(".di-btn") && el.closest(".di-field") !== null;

export function toolbarFindings(root: Element): string[] {
  const findings: string[] = [];
  for (const bar of root.querySelectorAll<HTMLElement>(BAR)) {
    const controls = [...bar.querySelectorAll<HTMLElement>(CONTROL)].filter(
      (el) => el.closest(BAR) === bar && !el.closest(ELSEWHERE) && !inField(el) && shown(el),
    );
    const heights = new Map<number, HTMLElement>();
    for (const el of controls) {
      const height = Math.round(el.getBoundingClientRect().height);
      if (!heights.has(height)) heights.set(height, el);
    }
    if (heights.size > 1)
      findings.push(
        `${describe(bar)} mixes control heights: ${[...heights].map(([h, el]) => `${describe(el)} ${h}px`).join(", ")}`,
      );
  }
  return findings;
}
