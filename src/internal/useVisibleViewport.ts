import { useLayoutEffect, type RefObject } from "react";

/**
 * Follows the part of the window the reader sees while `open`, as
 * `--di-visible-top` and `--di-visible-height` on the element. An on-screen
 * keyboard shrinks and pans that part without resizing the window, so a
 * fixed sheet sized to the window would slide away from it.
 */
export function useVisibleViewport(ref: RefObject<HTMLElement | null>, open: boolean) {
  useLayoutEffect(() => {
    const element = ref.current;
    const viewport = window.visualViewport;
    if (!open || !element || !viewport) return;
    const follow = () => {
      element.style.setProperty("--di-visible-top", `${viewport.offsetTop}px`);
      element.style.setProperty("--di-visible-height", `${viewport.height}px`);
    };
    follow();
    viewport.addEventListener("resize", follow);
    viewport.addEventListener("scroll", follow);
    return () => {
      viewport.removeEventListener("resize", follow);
      viewport.removeEventListener("scroll", follow);
      element.style.removeProperty("--di-visible-top");
      element.style.removeProperty("--di-visible-height");
    };
  }, [ref, open]);
}
