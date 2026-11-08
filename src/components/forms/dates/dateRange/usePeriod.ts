import { useMemo } from "react";
import { type DateRangeValue, resolveDateRange } from "./dateRange";

/**
 * A list's period for its query: `key` names it for the cache (a preset
 * stays one key while the clock moves), `range` holds its instants, fixed
 * when the period is chosen, so later pages and an export read the same
 * range. A new `now` (a pushed change, a refresh) moves a preset up to now.
 */
export function usePeriod(value: DateRangeValue, timeZone: string, now?: number) {
  const key = JSON.stringify(value);
  const range = useMemo(() => {
    const resolved = resolveDateRange(JSON.parse(key) as DateRangeValue, now ? new Date(now) : new Date(), timeZone);
    return { from: resolved.from, to: resolved.to };
  }, [key, timeZone, now]);
  return { key, range };
}
