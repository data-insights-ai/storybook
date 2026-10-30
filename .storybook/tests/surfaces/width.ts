/**
 * The story never makes the page scroll sideways: its canvas is no wider
 * than the viewport. A row too wide for a phone scrolls inside its own
 * frame (a table's scroll box), never the page.
 */
export function widthFindings(): string[] {
  const page = document.documentElement;
  const over = page.scrollWidth - page.clientWidth;
  return over > 1 ? [`the page is ${over}px wider than the ${page.clientWidth}px viewport`] : [];
}
