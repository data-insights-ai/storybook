import { type RefObject, useLayoutEffect, useState } from "react";

/**
 * Where the list's first row starts in the document, for a virtualizer that
 * follows the window's scroll; content above the list can change its place.
 */
export function useListStart(top: RefObject<Element | null>) {
  const [start, setStart] = useState(0);
  useLayoutEffect(() => {
    const el = top.current;
    if (!el) return;
    const measured = Math.round(el.getBoundingClientRect().top + window.scrollY);
    if (Math.abs(measured - start) > 1) setStart(measured);
  });
  return start;
}
