import { useCallback, useLayoutEffect, useState, type RefObject } from "react";

type OverlayHost = { theme?: string; container?: HTMLElement };

// Portals must retain a nested theme and stay inside a native modal's inert
// boundary. This bridges presentation only; the headless library still owns the popup.
export function useOverlayHost(rootRef: RefObject<HTMLElement | null>, open: boolean) {
  const [host, setHost] = useState<OverlayHost>({});
  const update = useCallback(() => {
    const element = rootRef.current;
    if (!element) return;
    const theme = element.closest<HTMLElement>("[data-theme]")?.dataset.theme;
    const container = element.closest("dialog") ?? undefined;
    setHost((old) => (old.theme === theme && old.container === container ? old : { theme, container }));
  }, [rootRef]);
  useLayoutEffect(() => {
    if (!open || !rootRef.current) return;
    update();
    const observer = new MutationObserver(update);
    observer.observe(rootRef.current.ownerDocument.documentElement, {
      attributes: true,
      subtree: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, [open, rootRef, update]);
  return { host, update };
}
