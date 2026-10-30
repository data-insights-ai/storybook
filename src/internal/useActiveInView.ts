import { useLayoutEffect, useRef, type RefObject } from "react";

/**
 * Scrolls a strip sideways so its active item shows, when the active item
 * changes. A strip that only scrolled under the reader's own hand would open
 * a page with the current tab out of sight.
 */
export function useActiveInView(stripRef: RefObject<HTMLElement | null>) {
  const shown = useRef<Element | null>(null);
  useLayoutEffect(() => {
    const frame = stripRef.current;
    const active = frame?.querySelector(".is-active");
    if (!frame || !active || active === shown.current) return;
    shown.current = active;
    const outer = frame.getBoundingClientRect();
    const inner = active.getBoundingClientRect();
    if (inner.left < outer.left) frame.scrollLeft -= outer.left - inner.left;
    else if (inner.right > outer.right) frame.scrollLeft += inner.right - outer.right;
  });
}
