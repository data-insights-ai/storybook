import { Fragment, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { cx } from "../../../internal/cx";
import { clockFormats, ticksFor } from "../scale";
import type { TimelineSpan } from "../types";
import "./ChainTimeline.css";

export type ChainTimelineLane = {
  id: string;
  /** The lane's name: a device, an account. */
  label: string;
  /** A second line in the mono track: an address, a criticality. */
  detail?: string;
};

export type ChainTimelineEvent = {
  id: string;
  lane: string;
  /** Where on the axis, 0 to 100. */
  at: number;
  /** What happened there, for the marker's name and its tooltip. */
  label: string;
  /** `danger` marks a step that was withdrawn or failed; `muted` one that is only context. */
  tone?: "neutral" | "danger" | "muted";
};

export type ChainTimelineTick = {
  /** Where on the axis, 0 to 100. */
  at: number;
  /** "+3 min": the tick's distance from the start. */
  label: string;
};

/** The clock behind the axis: its ticks come from the shared timeline scale, in the reader's language and zone. */
export type ChainTimelineClock = {
  /** The instants at 0 and 100 on the axis, in epoch milliseconds. */
  span: TimelineSpan;
  locale: string;
  timeZone: string;
};

/* Below this width the lane names would be cut in a column of their own; each goes above its rule instead. */
const STACK_BELOW = 480;
/* Markers closer than their own width and this share of it merge into one, named by their range. */
const MARKER_ROOM = 1.25;
/* The smallest gap between two labels on the axis. */
const AXIS_GAP = 8;

/**
 * A chain of events over several lanes: one row per device or account,
 * each event a numbered marker at its time, consecutive events joined by a
 * stepped line so a hop from one lane to the next is read as a move. The
 * marker's number is the step's ordinal in the chain, the same one the
 * step list under it carries. Markers that would touch on one lane are
 * drawn as one, named by their range ("03–04").
 *
 * Narrower than 480px, each lane's name stands above its rule at the full
 * width instead of in a column of its own, so a long German device name is
 * never cut. The axis is one line: its two ends and, between them, the
 * ticks that fit — from `clock` through the shared timeline scale, or the
 * caller's relative `ticks`.
 *
 * Markers are buttons: `onSelect` opens the step, `selected` marks the one
 * that is open, `hovered` and `onHover` tie a marker to its row in the
 * list beside it. The caller orders `events` by time.
 */
export function ChainTimeline({
  label,
  lanes,
  events,
  startLabel,
  endLabel,
  ticks = [],
  clock,
  selected,
  hovered,
  onSelect,
  onHover,
  className,
}: {
  /** Accessible name for the whole chart. */
  label: string;
  lanes: ChainTimelineLane[];
  events: ChainTimelineEvent[];
  /** The axis' two ends, e.g. the first and the last time. */
  startLabel: string;
  endLabel: string;
  /** Relative marks along the axis; `clock` replaces them with clock times. */
  ticks?: ChainTimelineTick[];
  /** The clock behind the axis: its ticks are clock times from the shared timeline scale. */
  clock?: ChainTimelineClock;
  selected?: string;
  hovered?: string;
  onSelect?: (id: string) => void;
  /** The marker under the pointer, or undefined when it leaves. */
  onHover?: (id: string | undefined) => void;
  className?: string;
}) {
  const rows = new Map(lanes.map((lane, i) => [lane.id, i]));
  const rowOf = (e: ChainTimelineEvent) => rows.get(e.lane) ?? 0;
  const frame = useRef<HTMLDivElement>(null);
  const frameWidth = useFrameWidth(frame);
  const stacked = frameWidth > 0 && frameWidth < STACK_BELOW;
  const plot = useRef<HTMLDivElement>(null);
  const { width, marker } = usePlot(plot);
  const markers = cluster(events, width, marker);
  const axisTicks = useMemo(() => {
    if (!clock || width <= 0) return ticks;
    const { span, locale, timeZone } = clock;
    const formats = clockFormats(locale, timeZone);
    const length = Math.max(1, span.end - span.start);
    return ticksFor(span, width, formats.offsetOf)
      .map((tick) => ({ at: ((tick.at - span.start) / length) * 100, label: formats.tick(tick) }))
      .filter((tick) => tick.at > 0 && tick.at < 100);
  }, [clock, ticks, width]);
  const axis = useRef<HTMLDivElement>(null);
  const hidden = useCrowdedTicks(axis, axisTicks, width);

  return (
    <div
      ref={frame}
      className={cx("di-chain", stacked && "is-stacked", className)}
      role="group"
      aria-label={label}
      style={{ "--di-chain-lanes": lanes.length } as CSSProperties}
    >
      {stacked ? null : (
        <div className="di-chain-lanes">
          {lanes.map((lane) => (
            <div key={lane.id} className="di-chain-lane">
              <LaneName lane={lane} />
            </div>
          ))}
        </div>
      )}
      <div className="di-chain-track">
        {lanes.map((lane) => (
          <div key={lane.id} className="di-chain-rule">
            {stacked ? (
              <div className="di-chain-lane-head">
                <LaneName lane={lane} />
              </div>
            ) : null}
          </div>
        ))}
        <div className="di-chain-plot" ref={plot}>
          {axisTicks.map((tick) => (
            <div key={tick.at} className="di-chain-tick" style={{ left: `${clamp(tick.at)}%` }} aria-hidden />
          ))}
          <div className="di-chain-links" aria-hidden>
            {events.map((e, i) => {
              const prev = events[i - 1];
              if (!prev) return null;
              const from = clamp(prev.at);
              const to = clamp(e.at);
              const [top, bottom] = [rowOf(prev), rowOf(e)].sort((a, b) => a - b);
              return (
                <Fragment key={e.id}>
                  {top !== bottom ? (
                    <span
                      className="di-chain-link is-hop"
                      style={
                        { left: `${from}%`, "--di-chain-row": top, "--di-chain-span": bottom - top } as CSSProperties
                      }
                    />
                  ) : null}
                  <span
                    className="di-chain-link"
                    style={{ left: `${from}%`, width: `${to - from}%`, "--di-chain-row": rowOf(e) } as CSSProperties}
                  />
                </Fragment>
              );
            })}
          </div>
          {markers.map((m) => {
            const ids = m.events.map((e) => e.id);
            const active = ids.some((id) => id === selected);
            const lit = ids.some((id) => id === hovered);
            return (
              <button
                key={m.events[0].id}
                type="button"
                className={cx(
                  "di-chain-marker",
                  m.events.some((e) => e.tone === "danger") && "is-danger",
                  m.events.every((e) => e.tone === "muted") && "is-muted",
                  active && "is-selected",
                  lit && "is-hovered",
                )}
                style={
                  {
                    "--di-chain-at": `${m.at}%`,
                    "--di-chain-chars": m.ordinal.length,
                    "--di-chain-row": rowOf(m.events[0]),
                  } as CSSProperties
                }
                aria-label={m.events.map((e) => e.label).join("; ")}
                aria-pressed={onSelect ? active : undefined}
                title={m.events.map((e) => e.label).join("\n")}
                onClick={onSelect ? () => onSelect(m.events[0].id) : undefined}
                onMouseEnter={onHover ? () => onHover(m.events[0].id) : undefined}
                onMouseLeave={onHover ? () => onHover(undefined) : undefined}
                onFocus={onHover ? () => onHover(m.events[0].id) : undefined}
                onBlur={onHover ? () => onHover(undefined) : undefined}
              >
                {m.ordinal}
              </button>
            );
          })}
        </div>
      </div>
      <div className="di-chain-axis" ref={axis}>
        <span className="di-chain-axis-end">{startLabel}</span>
        <span className="di-chain-axis-ticks">
          {axisTicks.map((tick, i) => (
            <span
              key={tick.at}
              className={cx("di-chain-axis-tick", hidden.has(i) && "is-hidden")}
              style={{ left: `${clamp(tick.at)}%` }}
            >
              {tick.label}
            </span>
          ))}
        </span>
        <span className="di-chain-axis-end">{endLabel}</span>
      </div>
    </div>
  );
}

function LaneName({ lane }: { lane: ChainTimelineLane }) {
  return (
    <>
      <span className="di-chain-lane-label">{lane.label}</span>
      {lane.detail ? <span className="di-chain-lane-detail">{lane.detail}</span> : null}
    </>
  );
}

/*
 * The ends and the ticks share one line. Measured as drawn, left to right:
 * a tick gives way where it would touch an end or the tick kept before it.
 */
function useCrowdedTicks(axis: { current: HTMLDivElement | null }, ticks: ChainTimelineTick[], width: number) {
  const [hidden, setHidden] = useState<Set<number>>(new Set());
  useLayoutEffect(() => {
    const el = axis.current;
    if (!el) return;
    const measure = () => {
      const [start, end] = [...el.querySelectorAll(":scope > .di-chain-axis-end")].map((e) =>
        e.getBoundingClientRect(),
      );
      const labels = [...el.querySelectorAll(".di-chain-axis-tick")].map((e) => e.getBoundingClientRect());
      const next = new Set<number>();
      let edge = (start?.right ?? -Infinity) + AXIS_GAP;
      labels.forEach((box, i) => {
        if (box.left < edge || box.right + AXIS_GAP > (end?.left ?? Infinity)) next.add(i);
        else edge = box.right + AXIS_GAP;
      });
      setHidden((was) => (was.size === next.size && [...next].every((i) => was.has(i)) ? was : next));
    };
    measure();
  }, [axis, ticks, width]);
  return hidden;
}

type Marker = { at: number; ordinal: string; events: ChainTimelineEvent[] };

/* Events on one lane whose markers would touch become one marker named by their range, at the middle of it. */
function cluster(events: ChainTimelineEvent[], width: number, markerWidth: number): Marker[] {
  const out: (Marker & { first: number })[] = [];
  const minGap = width > 0 ? ((markerWidth * MARKER_ROOM) / width) * 100 : 0;
  events.forEach((e, i) => {
    const at = clamp(e.at);
    const last = out[out.length - 1];
    const ordinal = String(i + 1).padStart(2, "0");
    if (last && last.events[0].lane === e.lane && at - clamp(last.events.at(-1)!.at) < minGap) {
      last.events.push(e);
      last.ordinal = `${String(last.first + 1).padStart(2, "0")}–${ordinal}`;
      last.at = (clamp(last.events[0].at) + at) / 2;
      return;
    }
    out.push({ at, ordinal, events: [e], first: i });
  });
  return out;
}

/* Measured before the first paint, so a phone never draws the lane column first. */
function useFrameWidth(frame: { current: HTMLDivElement | null }) {
  const [width, setWidth] = useState(0);
  useLayoutEffect(() => {
    const el = frame.current;
    if (!el) return;
    const measure = () => setWidth(el.clientWidth);
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [frame]);
  return width;
}

/* The plot's width and a marker's drawn width, which follows the density. */
function usePlot(plot: { current: HTMLDivElement | null }) {
  const [size, setSize] = useState({ width: 0, marker: 0 });
  useLayoutEffect(() => {
    const el = plot.current;
    if (!el) return;
    const measure = () =>
      setSize({
        width: el.clientWidth,
        marker: parseFloat(getComputedStyle(el).getPropertyValue("--di-chain-count")) || 0,
      });
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [plot]);
  return size;
}

function clamp(n: number) {
  return Math.min(100, Math.max(0, n));
}
