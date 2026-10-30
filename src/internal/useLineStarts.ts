import { useLayoutEffect, type RefObject } from "react";

/**
 * Marks every child of the box that begins a visual line with
 * `data-line-start`, so the separator drawn before it can be left out: a
 * wrapped line of facts never starts with "·". Measured again whenever the
 * box changes size or a font finishes loading.
 */
export function useLineStarts(ref: RefObject<HTMLElement | null>, content: unknown) {
  useLayoutEffect(() => {
    const box = ref.current;
    if (!box) return;
    const mark = () => {
      let above = -Infinity;
      for (const child of Array.from(box.children)) {
        const { top, bottom, width } = child.getBoundingClientRect();
        if (width === 0) continue;
        child.toggleAttribute("data-line-start", top >= above - 2);
        above = bottom;
      }
    };
    mark();
    const observer = new ResizeObserver(mark);
    observer.observe(box);
    const fonts = box.ownerDocument.fonts;
    fonts?.addEventListener("loadingdone", mark);
    return () => {
      observer.disconnect();
      fonts?.removeEventListener("loadingdone", mark);
    };
  }, [ref, content]);
}
