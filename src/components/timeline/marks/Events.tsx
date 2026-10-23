import { memo } from "react";
import type { Scale } from "../scale/viewport";
import type { TimelineEvent, TimelineTone } from "../types";

const TONES: TimelineTone[] = ["neutral", "warn", "danger"];
const DOT = 1.75;

export const reachOf = (event: TimelineEvent, half: number) =>
  Math.max(3, Math.min(1, Math.max(0, event.magnitude)) * half);

const dot = (x: number, y: number) =>
  `M${x - DOT} ${y}a${DOT} ${DOT} 0 1 0 ${2 * DOT} 0a${DOT} ${DOT} 0 1 0 ${-2 * DOT} 0`;

// One event, one line: mirrored like the bars it replaces, as long as its magnitude.
export const Events = memo(function Events({
  events,
  scale,
  plotPx,
  mid,
  half,
}: {
  events: TimelineEvent[];
  scale: Scale;
  plotPx: number;
  mid: number;
  half: number;
}) {
  const stems: Record<TimelineTone, string> = { neutral: "", warn: "", danger: "" };
  const tips: Record<TimelineTone, string> = { neutral: "", warn: "", danger: "" };
  for (const e of events) {
    const x = Math.round(scale.x(e.at) * 2) / 2;
    if (x < -DOT || x > plotPx + DOT) {
      continue;
    }
    const reach = reachOf(e, half);
    stems[e.tone] += `M${x} ${mid - reach}V${mid + reach}`;
    tips[e.tone] += dot(x, mid - reach) + dot(x, mid + reach);
  }
  return (
    <g className="di-timeline-events">
      {TONES.map((tone) => (
        <g key={tone} className={`di-timeline-event is-${tone}`}>
          {stems[tone] ? <path d={stems[tone]} className="di-timeline-stem" /> : null}
          {tips[tone] ? <path d={tips[tone]} className="di-timeline-tip" /> : null}
        </g>
      ))}
    </g>
  );
});

export function nearestEvent(
  events: TimelineEvent[],
  scale: Scale,
  px: number,
  within: number,
): TimelineEvent | undefined {
  let best: TimelineEvent | undefined;
  let distance = within;
  for (const e of events) {
    const d = Math.abs(scale.x(e.at) - px);
    // Of two events on the same pixel, the larger is the one worth reading.
    if (d < distance || (best && d === distance && e.magnitude > best.magnitude)) {
      best = e;
      distance = d;
    }
  }
  return best;
}
