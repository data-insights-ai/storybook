import { useEffect } from "react";

export function readStoredExpanded(key: string | undefined): boolean | undefined {
  if (!key || typeof window === "undefined") return undefined;
  try {
    const stored = window.localStorage.getItem(key);
    return stored === null ? undefined : stored === "expanded";
  } catch {
    return undefined;
  }
}

export function usePersistExpanded(key: string | undefined, expanded: boolean) {
  useEffect(() => {
    if (!key) return;
    try {
      window.localStorage.setItem(key, expanded ? "expanded" : "collapsed");
    } catch {
      // Private mode or blocked storage: the sidebar still works, it just forgets.
    }
  }, [key, expanded]);
}
