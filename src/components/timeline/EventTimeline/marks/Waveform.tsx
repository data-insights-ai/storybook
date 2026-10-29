import { memo } from "react";
import type { Scale } from "../../scale";
import type { TimelineBar, TimelineTone } from "../../types";

const TONES: TimelineTone[] = ["neutral", "warn", "danger"];

const round = (n: number) => Math.round(n * 2) / 2;

export const totalOf = (bar: TimelineBar) => bar.neutral + bar.warn + bar.danger;

// The square root of the count, so one stray event still shows next to a burst of five hundred.
const amplitude = (count: number, peak: number, half: number) =>
  count <= 0 ? 0 : Math.max(0.75, Math.sqrt(count / Math.max(peak, 4)) * half);

// Severest at the core: each bar is mirrored around the axis, and its tones are rings
// from danger in the middle out to neutral at the rim.
function wavePaths(
  bars: TimelineBar[],
  scale: Scale,
  plotPx: number,
  mid: number,
  half: number,
  peak: number,
) {
  const d: Record<TimelineTone, string> = { neutral: "", warn: "", danger: "" };
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
    for (const tone of ["danger", "warn", "neutral"] as const) {
      if (bar[tone] === 0) {
        continue;
      }
      reached += bar[tone];
      const outer = amplitude(reached, peak, half);
      const h = round(outer - inner);
      if (h > 0) {
        d[tone] += `M${x} ${round(mid - outer)}h${w}v${h}h${-w}z`;
        d[tone] += `M${x} ${round(mid + inner)}h${w}v${h}h${-w}z`;
      }
      inner = outer;
    }
  }
  return d;
}

export const Waveform = memo(function Waveform({
  bars,
  scale,
  plotPx,
  mid,
  half,
  peak,
}: {
  bars: TimelineBar[];
  scale: Scale;
  plotPx: number;
  mid: number;
  half: number;
  peak: number;
}) {
  const d = wavePaths(bars, scale, plotPx, mid, half, peak);
  return (
    <g className="di-timeline-wave">
      {TONES.map((tone) =>
        d[tone] ? <path key={tone} d={d[tone]} className={`di-timeline-fill is-${tone}`} /> : null,
      )}
    </g>
  );
});
