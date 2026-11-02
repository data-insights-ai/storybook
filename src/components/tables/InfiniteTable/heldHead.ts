import { useEffect, useLayoutEffect, useRef, type RefObject } from "react";

/*
 * A grid that scrolls sideways is its own scroll container, so a sticky head
 * would stick to that frame and never to the page. There the head, and the
 * row of the group the view is in, are moved down by hand to the line under
 * the app bar and a sticky toolbar while the register passes under them; the
 * next group's row pushes the held one out. Under 768px, and while the rows
 * are stacked as cards, the head scrolls with the page as before.
 */
export function useHeldHead(host: RefObject<HTMLElement | null>, enabled: boolean) {
  const hold = useRef(() => {});
  // Rows come and go with every render, and the grid may start or stop overflowing.
  useLayoutEffect(() => hold.current());
  useEffect(() => {
    const el = host.current;
    if (!enabled || !el) return;
    const wide = matchMedia("(min-width: 768px)");
    const update = () => place(el, wide.matches);
    hold.current = update;
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      hold.current = () => {};
      place(el, false);
    };
  }, [host, enabled]);
}

const shifts = new WeakMap<HTMLElement, number>();
const tuck = 2;

function shift(el: HTMLElement, by: number) {
  if ((shifts.get(el) ?? 0) === by) return;
  shifts.set(el, by);
  // An offset, not a transform: Chromium paints a moved table part's collapsed rule where it was, leaving a seam.
  el.style.top = by > 0 ? `${by}px` : "";
  el.classList.toggle("is-held", by > 0);
}

/* Where the element sits in the page's flow, before it was moved. */
function naturalTop(el: HTMLElement) {
  return el.getBoundingClientRect().top - (shifts.get(el) ?? 0);
}

function place(host: HTMLElement, wide: boolean) {
  const table = host.querySelector<HTMLTableElement>(".di-table-wrap.is-overflowing .di-table");
  const head = host.querySelector<HTMLElement>(".di-table thead");
  const groups = Array.from(host.querySelectorAll<HTMLElement>(".di-table tbody tr.di-table-group"));
  const held = wide && table !== null && head !== null && getComputedStyle(table).display === "table";
  if (!held) {
    for (const el of head ? [head, ...groups] : groups) shift(el, 0);
    return;
  }
  const bottom = table.tBodies[0].getBoundingClientRect().bottom;
  // The register's scroll margin is the line under the app bar and toolbar, resolved to pixels (InfiniteTable.css).
  const line = parseFloat(getComputedStyle(host).scrollMarginTop) || 0;
  const top = naturalTop(head);
  const by = clamp(line - top, 0, bottom - head.offsetHeight - top);
  shift(head, by);

  // The group row tucks under the head's edge, where the rule they share would otherwise leave a seam.
  const under = top + by + head.offsetHeight - tuck;
  const tops = groups.map(naturalTop);
  const open = tops.findLastIndex((t) => t <= under);
  groups.forEach((row, i) => {
    if (i !== open) return shift(row, 0);
    const next = tops.find((t) => t > tops[i]) ?? bottom;
    shift(row, clamp(under - tops[i], 0, next - row.offsetHeight - tops[i]));
  });
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(value, max));
}
