import { useEffect, useRef, useState } from "react";

/** Loads the next page while the end of what is loaded is within this distance below the viewport. */
const ahead = "0px 0px 800px 0px";

type Paging = { hasMore: boolean; loadingMore: boolean; loaded: number; load: () => void };

/** Returns the ref for the element that marks the end of the loaded rows. */
export function useLoadNearEnd({ hasMore, loadingMore, loaded, load }: Paging) {
  const [target, setTarget] = useState<Element | null>(null);
  const [near, setNear] = useState(false);
  const latest = useRef(load);
  latest.current = load;

  useEffect(() => {
    if (!target) return;
    const observer = new IntersectionObserver(([entry]) => setNear(entry.isIntersecting), { rootMargin: ahead });
    observer.observe(target);
    return () => observer.disconnect();
  }, [target]);

  // A short page can leave the end in reach; observers report changes only,
  // so each finished page checks again.
  useEffect(() => {
    if (near && hasMore && !loadingMore) latest.current();
  }, [near, hasMore, loadingMore, loaded]);

  return setTarget;
}
