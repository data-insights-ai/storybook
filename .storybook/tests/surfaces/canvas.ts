import { describe, shown } from "./paint";

/**
 * A story shows a component where it lives. Content (a fact list, a figure,
 * a chart, a quote, a button, a field) stands inside the surface it sits on
 * in a product: a Panel, a Dialog, a table, a record card. Only the surfaces
 * themselves stand on the bare canvas: the page and its header, a panel, a
 * table's own surface, a notice, a toast, the shell parts and whatever
 * floats above the page.
 */
export const SURFACES = [
  ".di-surface",
  ".di-page",
  ".di-content",
  ".di-topbar",
  ".di-sb",
  ".di-sb-frame",
  ".di-table-wrap",
  ".di-notice-line",
  ".di-toast",
  ".di-toast-region",
  ".di-flyout",
  ".di-login",
  ".di-loading-app",
  ".di-skip",
  ".di-command",
  "dialog",
  "[role=dialog]",
  "[role=alertdialog]",
  "[popover]",
  "[role=tooltip]",
  ".di-tooltip",
  "[role=menu]",
  "[role=listbox]",
].join(", ");

const LEAF = "svg, img, canvas, input, select, textarea, button";

export function canvasFindings(root: Element): string[] {
  const findings: string[] = [];
  for (const el of root.querySelectorAll<HTMLElement | SVGElement>("*")) {
    if (el.closest(SURFACES)) continue;
    if (el instanceof SVGElement && !(el instanceof SVGSVGElement)) continue;
    const text = [...el.childNodes].some((node) => node.nodeType === Node.TEXT_NODE && node.textContent!.trim());
    if (!text && !el.matches(LEAF)) continue;
    if (!shown(el) || getComputedStyle(el).position === "fixed") continue;
    findings.push(`${describe(el)} "${(el.textContent ?? "").trim().slice(0, 40)}" stands on the bare canvas`);
    if (findings.length >= 5) break;
  }
  return findings;
}
