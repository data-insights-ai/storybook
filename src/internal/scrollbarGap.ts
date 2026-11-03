/**
 * Records the width of the page's scrollbar as `--di-scrollbar-gap` on the
 * root, just before an overlay locks the page. The lock takes the scrollbar
 * away and pads the page by this gap, so the page behind keeps its width
 * instead of widening into the scrollbar's place.
 */
export function keepScrollbarGap() {
  const root = document.documentElement;
  // Already locked: the scrollbar is gone, and the gap measured before still holds.
  if (getComputedStyle(root).overflowY === "hidden") return;
  root.style.setProperty("--di-scrollbar-gap", `${window.innerWidth - root.clientWidth}px`);
}
