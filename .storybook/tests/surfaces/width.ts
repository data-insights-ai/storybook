import { describe } from "./paint";

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

/**
 * A grid that runs past its frame's edge and scrolls there keeps the row's
 * name in view (a sticky cell other than the ordinal in every row) and
 * shades the side that hides columns. A grid cut at the frame with neither
 * reads as a table that ends there, its rows nameless once scrolled.
 */
export function scrollerFindings(root: Element): string[] {
  const findings: string[] = [];
  for (const frame of root.querySelectorAll<HTMLElement>(".di-table-scroll")) {
    const table = frame.querySelector("table");
    if (!table || getComputedStyle(table).display !== "table" || frame.getClientRects().length === 0) continue;
    if (table.scrollWidth <= frame.clientWidth + 1) continue;
    const wrap = frame.closest(".di-table-wrap");
    const rows = Array.from(table.tBodies[0]?.rows ?? []).filter((row) => row.cells.length > 1);
    const nameless = rows.filter(
      (row) =>
        !Array.from(row.cells).some(
          (cell) => !cell.classList.contains("di-table-index") && getComputedStyle(cell).position === "sticky",
        ),
    );
    if (nameless.length > 0)
      findings.push(`${describe(frame)} scrolls sideways and ${nameless.length} row(s) have no pinned name`);
    if (!wrap?.matches(".is-more-start, .is-more-end"))
      findings.push(`${describe(frame)} scrolls sideways with no shade on the side that hides columns`);
  }
  return findings;
}
