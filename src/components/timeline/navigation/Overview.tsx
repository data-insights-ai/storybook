import { useMemo, useRef, type PointerEvent } from "react";

import { totalOf, Waveform } from "../marks/Waveform";
import { clampSpan, MIN_SPAN, panBy, scaleOf, type Span } from "../scale/viewport";
import type { TimelineBar } from "../types";
import type { ViewChange } from "./useGestures";

export const OVERVIEW_H = 36;
const EDGE = 8;
const MIN_BRUSH = 6;

type Drag = { mode: "move" | "start" | "end" | "new"; x: number; view: Span; moved: boolean };

// The whole record, always: where the view sits in it, and a handle to move it by.
export function Overview({
  bars,
  bounds,
  view,
  plotPx,
  onView,
}: {
  bars: TimelineBar[];
  bounds: Span;
  view: Span;
  plotPx: number;
  onView: ViewChange;
}) {
  const scale = useMemo(() => scaleOf(bounds, plotPx), [bounds, plotPx]);
  const drag = useRef<Drag | null>(null);
  const peak = useMemo(() => Math.max(0, ...bars.map(totalOf)), [bars]);

  // A view of a few seconds in a record of days would be a hairline; the brush stays wide enough to grab.
  const centre = (scale.x(view.start) + scale.x(view.end)) / 2;
  const width = Math.max(MIN_BRUSH, scale.x(view.end) - scale.x(view.start));
  const left = Math.min(Math.max(0, centre - width / 2), plotPx - width);
  const right = left + width;

  const xOf = (event: PointerEvent<SVGSVGElement>) =>
    event.clientX - event.currentTarget.getBoundingClientRect().left;

  const onPointerDown = (event: PointerEvent<SVGSVGElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }
    event.currentTarget.setPointerCapture(event.pointerId);
    const x = xOf(event);
    const mode =
      Math.abs(x - left) <= EDGE && x < centre
        ? "start"
        : Math.abs(x - right) <= EDGE
          ? "end"
          : x > left && x < right
            ? "move"
            : "new";
    drag.current = { mode, x, view, moved: false };
  };

  const onPointerMove = (event: PointerEvent<SVGSVGElement>) => {
    const d = drag.current;
    if (!d) {
      return;
    }
    const x = Math.min(plotPx, Math.max(0, xOf(event)));
    if (!d.moved && Math.abs(x - d.x) < 3) {
      return;
    }
    const record = !d.moved;
    d.moved = true;
    const ms = scale.at(x) - scale.at(d.x);
    if (d.mode === "move") {
      onView(panBy(d.view, ms, bounds), record);
    } else if (d.mode === "start") {
      onView(
        clampSpan(
          { start: Math.min(d.view.start + ms, d.view.end - MIN_SPAN), end: d.view.end },
          bounds,
        ),
        record,
      );
    } else if (d.mode === "end") {
      onView(
        clampSpan(
          { start: d.view.start, end: Math.max(d.view.end + ms, d.view.start + MIN_SPAN) },
          bounds,
        ),
        record,
      );
    } else {
      const [lo, hi] = [Math.min(d.x, x), Math.max(d.x, x)];
      onView(clampSpan({ start: scale.at(lo), end: scale.at(hi) }, bounds), record);
    }
  };

  const onPointerUp = (event: PointerEvent<SVGSVGElement>) => {
    const d = drag.current;
    drag.current = null;
    if (d && !d.moved && d.mode === "new") {
      onView(panBy(view, scale.at(xOf(event)) - (view.start + view.end) / 2, bounds), true);
    }
  };

  const mid = OVERVIEW_H / 2;
  return (
    <svg
      className="di-timeline-overview"
      width={plotPx}
      height={OVERVIEW_H}
      aria-hidden
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={() => (drag.current = null)}
    >
      <rect width={plotPx} height={OVERVIEW_H} className="di-timeline-overview-ground" />
      <line x1={0} x2={plotPx} y1={mid} y2={mid} className="di-timeline-axisline" />
      <Waveform bars={bars} scale={scale} plotPx={plotPx} mid={mid} half={mid - 3} peak={peak} />
      <rect width={left} height={OVERVIEW_H} className="di-timeline-overview-shade" />
      <rect
        x={right}
        width={Math.max(0, plotPx - right)}
        height={OVERVIEW_H}
        className="di-timeline-overview-shade"
      />
      <rect
        x={left + 0.5}
        y={0.5}
        width={width - 1}
        height={OVERVIEW_H - 1}
        className="di-timeline-brush"
      />
      <rect x={left - 2} y={mid - 7} width={4} height={14} rx={2} className="di-timeline-handle" />
      <rect x={right - 2} y={mid - 7} width={4} height={14} rx={2} className="di-timeline-handle" />
    </svg>
  );
}
