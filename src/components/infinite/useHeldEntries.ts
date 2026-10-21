import { type RefObject, useCallback, useEffect, useState } from "react";
import { heldCount } from "./held";
import { stickyTop } from "./stickyTop";

/**
 * While the reader is further down a newest-first list, entries that arrive
 * above stay held, so nothing on screen moves; back at the top, or by
 * pressing the notice, they are shown.
 */
export function useHeldEntries(keys: string[], enabled: boolean, top: RefObject<Element | null>, start: number) {
  const [anchor, setAnchor] = useState<string>();
  const [atTop, setAtTop] = useState(true);
  const first = keys[0];

  useEffect(() => {
    if (!enabled) return;
    const check = () => {
      const el = top.current;
      const edge = stickyTop(el);
      setAtTop((el?.getBoundingClientRect().top ?? edge) >= edge);
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, [enabled, top]);

  useEffect(() => {
    if (atTop) setAnchor(undefined);
    else setAnchor((a) => a ?? first);
  }, [atTop, first]);

  const show = useCallback(() => {
    setAnchor(undefined);
    window.scrollTo({ top: Math.max(0, start - stickyTop(top.current) - 24), behavior: "smooth" });
  }, [start, top]);

  return { count: enabled ? heldCount(keys, anchor) : 0, show };
}
