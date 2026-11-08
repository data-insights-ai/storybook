/**
 * The surfaces content stands on: a panel and every plane that takes the
 * surface classes, a table's own surface, a strip figure row, a notice line,
 * a toast, the shell parts and whatever floats above the page.
 */
export const SURFACES = [
  ".di-surface",
  ".di-figure-row-strip",
  ".di-table-wrap",
  ".di-notice-line",
  ".di-toast",
  ".di-toast-region",
  ".di-flyout",
  ".di-login",
  ".di-loading-app",
  ".di-skip",
  ".di-command",
  ".di-topbar",
  ".di-sb",
  ".di-sb-frame",
  "dialog",
  "[role=dialog]",
  "[role=alertdialog]",
  "[popover]",
  "[role=tooltip]",
  ".di-tooltip",
  "[role=menu]",
  "[role=listbox]",
].join(", ");

/**
 * The page's own frame, the one thing besides a surface that stands on the
 * bare page ground: its head, breadcrumb, tabs, toolbars, filter bar, steps,
 * brand points, the attention heading, and the page's footer, the `footer`
 * that ends `main` (legal links, attribution). A footer anywhere else is
 * content and stands on a surface or in a `Notice variant="line"`. A toolbar
 * is frame wherever it stands, at a tab's top, under a form or in the unsaved
 * band: what it reads is its controls' labels and its `ToolbarNote`.
 */
export const GROUND = [
  ".di-page-head",
  ".di-breadcrumb",
  ".di-tabs",
  ".di-toolbar",
  ".di-filter-bar",
  ".di-steps",
  ".di-points-frame",
  ".di-attention-heading",
  "main > footer:last-child",
].join(", ");

/** Where to look and what counts: `root` and both lists are selectors. */
export type SurfaceRule = { root: string; surfaces: string; ground?: string };

/** The page rule: content in `main` on a surface, the page's frame on the ground. */
const PAGE_RULE: SurfaceRule = { root: "main", surfaces: SURFACES, ground: GROUND };

/**
 * Whether the reader sees any of `el`: not hidden, not folded away in a
 * closed `details` or `dialog`, at least 2px each way, not transparent, and
 * not wholly outside a box that clips it. It references nothing outside its
 * body, so `surfaceScript` can carry it into a page as source.
 */
export function shown(el: Element): boolean {
  if (!(el instanceof HTMLElement || el instanceof SVGElement)) return false;
  if (el.closest(".di-sr, [hidden], [inert], [aria-hidden=true], dialog:not([open])")) return false;
  const details = el.closest("details:not([open])");
  if (details && !el.closest("summary")) return false;
  const box = el.getBoundingClientRect();
  if (box.width < 2 || box.height < 2) return false;
  for (let node: Element | null = el; node; node = node.parentElement) {
    const style = getComputedStyle(node);
    if (style.display === "none" || style.visibility === "hidden" || Number(style.opacity) === 0) return false;
    if (node === el || (style.overflowX === "visible" && style.overflowY === "visible")) continue;
    const clip = node.getBoundingClientRect();
    if (box.bottom <= clip.top || box.top >= clip.bottom || box.right <= clip.left || box.left >= clip.right)
      return false;
  }
  return true;
}

function findings({ root, surfaces, ground }: SurfaceRule, seen: (el: Element) => boolean): string[] {
  const leaf = "svg, img, canvas, input, select, textarea, button";
  const found: string[] = [];
  const scope = document.querySelector(root) ?? document.body;
  for (const el of scope.querySelectorAll<HTMLElement | SVGElement>("*")) {
    if (el.closest(surfaces) || (ground && el.closest(ground))) continue;
    if (el instanceof SVGElement && !(el instanceof SVGSVGElement)) continue;
    const text = [...el.childNodes].some((node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim());
    if (!text && !el.matches(leaf)) continue;
    if (!seen(el) || getComputedStyle(el).position === "fixed") continue;
    const cls = typeof el.className === "string" ? el.className.trim().split(/\s+/)[0] : "";
    const label = el.getAttribute("aria-label") ?? (el.textContent ?? "").trim().replace(/\s+/g, " ").slice(0, 40);
    found.push(`${el.tagName.toLowerCase()}${cls ? "." + cls : ""} "${label}"`);
  }
  return found;
}

/**
 * Every shown element under the rule's root with text of its own, and every
 * shown graphic or control, that stands neither on a surface nor in the
 * ground's frame, as `tag.class "label"`. For code that runs in the page.
 */
export function surfaceFindings(rule: SurfaceRule = PAGE_RULE): string[] {
  return findings(rule, shown);
}

/**
 * The same check as a script for a browser test to run in its page, which
 * returns the findings: `expect(await page.evaluate(surfaceScript())).toEqual([])`.
 */
export function surfaceScript(rule: SurfaceRule = PAGE_RULE): string {
  return `(${findings.toString()})(${JSON.stringify(rule)}, ${shown.toString()})`;
}
