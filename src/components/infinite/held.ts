/**
 * Entries that arrived above the one the reader's view is anchored to are
 * held back, so the rows on screen do not move.
 */
export function heldCount(keys: string[], anchor: string | undefined): number {
  if (anchor === undefined) return 0;
  const at = keys.indexOf(anchor);
  return at < 0 ? 0 : at;
}
