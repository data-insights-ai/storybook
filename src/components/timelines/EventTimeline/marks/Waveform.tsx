import { memo } from "react";
import type { Scale } from "../../scale";
import { seriesColor } from "../../series";
import type { TimelineBar, TimelineSeries } from "../../types";

const round = (n: number) => Math.round(n * 2) / 2;

// The square root of the count, so one stray event still shows next to a burst of five hundred.
const amplitude = (count: number, peak: number, half: number) =>
  count <= 0 ? 0 : Math.max(0.75, Math.sqrt(count / Math.max(peak, 4)) * half);

// Each bar is mirrored around the axis, and its series are rings in the declared order,
// the first at the core.
function wavePaths(
  bars: TimelineBar[],
  series: TimelineSeries[],
  scale: Scale,
  plotPx: number,
  mid: number,
  half: number,
  peak: number,
) {
  const d = series.map(() => "");
  for (const bar of bars) {
    const x0 = scale.x(bar.start);
    const x1 = scale.x(bar.end);
    if (x1 < 0 || x0 > plotPx) {
      continue;
    }
    const gap = x1 - x0 >= 3 ? 1 : 0;
    const x = round(x0);
    const w = Math.max(1, round(x1 - x0 - gap));
    let inner = 0;
    let reached = 0;
    for (const [i, { id }] of series.entries()) {
      const count = bar.counts[id] ?? 0;
      if (count <= 0) {
        continue;
      }
      reached += count;
      const outer = amplitude(reached, peak, half);
      const h = round(outer - inner);
      if (h > 0) {
        d[i] += `M${x} ${round(mid - outer)}h${w}v${h}h${-w}z`;
        d[i] += `M${x} ${round(mid + inner)}h${w}v${h}h${-w}z`;
      }
      inner = outer;
    }
  }
  return d;
}

export const Waveform = memo(function Waveform({
  bars,
  series,
  scale,
  plotPx,
  mid,
  half,
  peak,
}: {
  bars: TimelineBar[];
  series: TimelineSeries[];
  scale: Scale;
  plotPx: number;
  mid: number;
  half: number;
  peak: number;
}) {
  const d = wavePaths(bars, series, scale, plotPx, mid, half, peak);
  return (
    <g className="di-timeline-wave">
      {series.map(({ id }, i) =>
        d[i] ? <path key={id} d={d[i]} className="di-timeline-fill" style={{ fill: seriesColor(i) }} /> : null,
      )}
    </g>
  );
});
