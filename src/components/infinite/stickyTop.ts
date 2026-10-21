/** Where the sticky app bar ends, read from `--di-sticky-top` so it follows the theme's tokens. */
export function stickyTop(el: Element | null): number {
  if (!el) return 0;
  const value = parseFloat(getComputedStyle(el).getPropertyValue("--di-sticky-top"));
  return Number.isFinite(value) ? value : 0;
}
