import { useLayoutEffect, useRef, useState, type RefObject } from "react";

/**
 * Which inline edges of a scroll frame hide content: `start` once it has
 * scrolled, `end` while more lies beyond. A frame shades only those edges,
 * so a cut-off column reads as "more this way", not as a broken layout.
 * Pass the frame's ref when the component already holds one.
 */
export function useScrollEdges<T extends HTMLElement>(given?: RefObject<T | null>) {
  const own = useRef<T>(null);
  const ref = given ?? own;
  const [edges, setEdges] = useState({ start: false, end: false });
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const measure = () => {
      const scrolled = Math.abs(el.scrollLeft);
      const start = scrolled > 1;
      const end = scrolled + el.clientWidth < el.scrollWidth - 1;
      setEdges((was) => (was.start === start && was.end === end ? was : { start, end }));
    };
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    for (const child of el.children) observer.observe(child);
    el.addEventListener("scroll", measure, { passive: true });
    measure();
    return () => {
      observer.disconnect();
      el.removeEventListener("scroll", measure);
    };
  }, [ref]);
  return [ref, edges] as const;
}
