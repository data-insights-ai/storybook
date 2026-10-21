import type { VirtualItem } from "@tanstack/react-virtual";

/*
 * Measured row heights per list, so a list shown again (back from a detail
 * page) has its real height at once and the restored scroll position fits.
 */
const cache = new Map<string, VirtualItem[]>();
const limit = 20;

export function remembered(key: string): VirtualItem[] | undefined {
  return cache.get(key);
}

export function remember(key: string, items: VirtualItem[]) {
  cache.delete(key);
  cache.set(key, items);
  if (cache.size > limit) cache.delete(cache.keys().next().value as string);
}
