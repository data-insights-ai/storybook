import { useLayoutEffect, useRef, useState } from "react";
import { cx } from "../cx";
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

const laneHeight = 40;
const markerWidth = 24;

/**
 * A chain of events over several lanes: one row per device or account,
 * each event a numbered marker at its time, consecutive events joined by a
 * stepped line so a hop from one lane to the next is read as a move. The
 * marker's number is the step's ordinal in the chain, the same one the
 * step list under it carries. Markers that would collide on one lane are
 * drawn as one, named by their range ("03–04").
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
  /** Relative marks along the axis. */
  ticks?: ChainTimelineTick[];
  selected?: string;
  hovered?: string;
  onSelect?: (id: string) => void;
  /** The marker under the pointer, or undefined when it leaves. */
  onHover?: (id: string | undefined) => void;
  className?: string;
}) {
  const rows = new Map(lanes.map((lane, i) => [lane.id, i]));
  const y = (e: ChainTimelineEvent) => (rows.get(e.lane) ?? 0) + 0.5;
  const track = useRef<HTMLDivElement>(null);
  const width = useTrackWidth(track);
  const path = events
    .map((e, i) => {
      const x = clamp(e.at);
      if (i === 0) return `M ${x} ${y(e)}`;
      const prev = events[i - 1];
      return prev.lane === e.lane ? `L ${x} ${y(e)}` : `L ${clamp(prev.at)} ${y(e)} L ${x} ${y(e)}`;
    })
    .join(" ");
  const markers = cluster(events, width);

  return (
    <div className={cx("di-chain", className)} role="group" aria-label={label}>
      <div className="di-chain-lanes">
        {lanes.map((lane) => (
          <div key={lane.id} className="di-chain-lane" style={{ height: laneHeight }}>
            <span className="di-chain-lane-label">{lane.label}</span>
            {lane.detail ? <span className="di-chain-lane-detail">{lane.detail}</span> : null}
          </div>
        ))}
      </div>
      <div className="di-chain-track" ref={track} style={{ height: lanes.length * laneHeight }}>
        {lanes.map((lane) => (
          <div key={lane.id} className="di-chain-rule" style={{ height: laneHeight }} />
        ))}
        {ticks.map((tick) => (
          <div key={tick.at} className="di-chain-tick" style={{ left: `${clamp(tick.at)}%` }} aria-hidden />
        ))}
        <svg
          className="di-chain-links"
          viewBox={`0 0 100 ${lanes.length}`}
          preserveAspectRatio="none"
          aria-hidden
          focusable="false"
        >
          {events.length > 1 ? <path d={path} /> : null}
        </svg>
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
              style={{ left: `${m.at}%`, top: (rows.get(m.events[0].lane) ?? 0) * laneHeight + laneHeight / 2 }}
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
      <div className="di-chain-axis">
        <span className="di-chain-axis-end">{startLabel}</span>
        <span className="di-chain-axis-ticks">
          {ticks.map((tick) => (
            <span key={tick.at} className="di-chain-axis-tick" style={{ left: `${clamp(tick.at)}%` }}>
              {tick.label}
            </span>
          ))}
        </span>
        <span className="di-chain-axis-end">{endLabel}</span>
      </div>
    </div>
  );
}

type Marker = { at: number; ordinal: string; events: ChainTimelineEvent[] };

/* Events on one lane whose markers would overlap become one marker named by their range. */
function cluster(events: ChainTimelineEvent[], width: number): Marker[] {
  const out: Marker[] = [];
  const minGap = width > 0 ? (markerWidth / width) * 100 : 0;
  events.forEach((e, i) => {
    const at = clamp(e.at);
    const last = out[out.length - 1];
    const ordinal = String(i + 1).padStart(2, "0");
    if (last && last.events[0].lane === e.lane && at - last.at < minGap) {
      last.events.push(e);
      last.ordinal = `${String(events.indexOf(last.events[0]) + 1).padStart(2, "0")}–${ordinal}`;
      return;
    }
    out.push({ at, ordinal, events: [e] });
  });
  return out;
}

function useTrackWidth(track: { current: HTMLDivElement | null }) {
  const [width, setWidth] = useState(0);
  useLayoutEffect(() => {
    const el = track.current;
    if (!el) return;
    const measure = () => setWidth(el.clientWidth);
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [track]);
  return width;
}

function clamp(n: number) {
  return Math.min(100, Math.max(0, n));
}
