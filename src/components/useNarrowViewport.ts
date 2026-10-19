import { useSyncExternalStore } from "react";

const query = "(max-width: 900px)";

function narrow() {
  return window.matchMedia(query).matches;
}

function subscribe(changed: () => void) {
  const media = window.matchMedia(query);
  media.addEventListener("change", changed);
  return () => media.removeEventListener("change", changed);
}

export function useNarrowViewport(): boolean {
  return useSyncExternalStore(subscribe, narrow, () => false);
}
