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
 * content and stands on a surface or in a `Notice variant="line"`.
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

/**
 * Every shown element under `root` with text of its own, and every shown
 * graphic or control, that stands neither on a surface nor in the ground's
 * frame, as `tag.class "label"`. It references nothing outside its body, so
 * a browser test can run it in the page:
 * `page.evaluate(surfaceFindings, { root: "main", surfaces: SURFACES, ground: GROUND })`.
 */
export function surfaceFindings({ root, surfaces, ground }: SurfaceRule): string[] {
  const leaf = "svg, img, canvas, input, select, textarea, button";
  const hidden = ".di-sr, [hidden], [inert], [aria-hidden=true], dialog:not([open])";
  const shown = (el: Element) => {
    if (el.closest(hidden)) return false;
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
    return getComputedStyle(el).position !== "fixed";
  };
  const findings: string[] = [];
  const scope = document.querySelector(root) ?? document.body;
  for (const el of scope.querySelectorAll<HTMLElement | SVGElement>("*")) {
    if (el.closest(surfaces) || (ground && el.closest(ground))) continue;
    if (el instanceof SVGElement && !(el instanceof SVGSVGElement)) continue;
    const text = [...el.childNodes].some((node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim());
    if (!text && !el.matches(leaf)) continue;
    if (!shown(el)) continue;
    const cls = typeof el.className === "string" ? el.className.trim().split(/\s+/)[0] : "";
    const label = el.getAttribute("aria-label") ?? (el.textContent ?? "").trim().replace(/\s+/g, " ").slice(0, 40);
    findings.push(`${el.tagName.toLowerCase()}${cls ? "." + cls : ""} "${label}"`);
  }
  return findings;
}
