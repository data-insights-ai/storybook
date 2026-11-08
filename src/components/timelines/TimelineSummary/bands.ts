import { seriesColor, seriesOrder } from "../series";
import type { TimelineSeries } from "../types";
import type { TimelineEpisode } from "./episodes";

/** Where a stretch is drawn inside its block, each side as a share of the block. */
export type Band = { key: string; color: string; left: string; width: string; bottom: string; height: string };

/**
 * An episode's stretches placed in its block: each declared series it holds
 * takes an equal band, stacked from the base in the declared order, and a
 * stretch runs across its share of the episode's time in its series' band.
 * A stretch of a series the caller did not declare is left out.
 */
export function bandsOf(episode: TimelineEpisode, series: TimelineSeries[]): Band[] {
  const order = seriesOrder(series);
  const held = series.flatMap((s, index) => (episode.counts[s.id] ? [index] : []));
  const duration = Math.max(1, episode.end - episode.start);
  const pct = (n: number) => `${n * 100}%`;
  return episode.stretches.flatMap((s) => {
    const index = order.get(s.series);
    const band = index === undefined ? -1 : held.indexOf(index);
    return index === undefined || band < 0
      ? []
      : [
          {
            key: `${s.series}-${s.start}`,
            color: seriesColor(index),
            left: pct((s.start - episode.start) / duration),
            width: pct((s.end - s.start) / duration),
            bottom: pct(band / held.length),
            height: pct(1 / held.length),
          },
        ];
  });
}
