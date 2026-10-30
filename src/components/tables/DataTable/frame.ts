import { useLayoutEffect, useState } from "react";

export type FrameState = {
  /** The grid is wider than its frame and scrolls sideways. */
  overflowing: boolean;
  /** Columns are hidden past the inline start (scrolled), or past the inline end. */
  moreStart: boolean;
  moreEnd: boolean;
  /** The last column that stays at the inline start, -1 for none. */
  through: number;
  /** Where each pinned column sticks, from the inline start, measured once the grid scrolls. */
  offsets?: number[];
};

const AT_REST: FrameState = { overflowing: false, moreStart: false, moreEnd: false, through: -1 };

const same = (a: FrameState, b: FrameState) =>
  a.overflowing === b.overflowing &&
  a.moreStart === b.moreStart &&
  a.moreEnd === b.moreEnd &&
  a.through === b.through &&
  (a.offsets ?? []).join() === (b.offsets ?? []).join();

/*
 * Whether the grid is wider than its frame, which side hides columns, and
 * where the pinned columns stick. A frame that keeps its head in view clips
 * instead of scrolling; once the columns no longer fit, it hands the sticky
 * head back for a sideways scroll, so no column is cut off.
 *
 * The row's name is read from the head as drawn, so a head a caller's own
 * component renders counts too: the column marked `pinned`, or in a grid
 * that scrolls the first one headed by words (not the ordinal, not a
 * selection box). A stacked table pins only what is marked, since its name
 * heads the card. Every column before the name stays with it. The pinned columns
 * stick one after the other, each at the summed width of those before it, so a
 * selection column and the row's name both stay. `scrollLeft` runs negative in
 * a right-to-left frame, so the side is read from its distance to the start.
 */
export function useFrame(frame: { current: HTMLDivElement | null }, stack: boolean): FrameState {
  const [state, setState] = useState<FrameState>(AT_REST);
  useLayoutEffect(() => {
    const el = frame.current;
    const table = el?.querySelector("table");
    if (!el || !table || typeof ResizeObserver === "undefined") return;
    const measure = () => {
      const max = el.scrollWidth - el.clientWidth;
      const overflowing = table.scrollWidth > el.clientWidth + 1;
      const at = Math.abs(el.scrollLeft);
      const head = Array.from(table.tHead?.rows[0]?.cells ?? []);
      const through = nameColumn(head, stack);
      let offsets: number[] | undefined;
      if (overflowing && through > 0) {
        offsets = [0];
        for (let i = 1; i <= through; i++) {
          offsets.push(offsets[i - 1] + head[i - 1].getBoundingClientRect().width);
        }
      }
      const next = {
        overflowing,
        moreStart: overflowing && at > 1,
        moreEnd: overflowing && at < max - 1,
        through,
        offsets,
      };
      setState((prev) => (same(prev, next) ? prev : next));
    };
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    observer.observe(table);
    el.addEventListener("scroll", measure, { passive: true });
    measure();
    return () => {
      observer.disconnect();
      el.removeEventListener("scroll", measure);
    };
  }, [frame, stack]);
  return state;
}

function nameColumn(head: HTMLTableCellElement[], stack: boolean) {
  const marked = head.findLastIndex((cell) => cell.hasAttribute("data-pinned"));
  if (marked !== -1 || stack) return marked;
  return head.findIndex(
    (cell) =>
      !cell.classList.contains("di-table-index") &&
      (cell.textContent ?? "").trim() !== "" &&
      cell.querySelector("input, select, textarea") === null,
  );
}
