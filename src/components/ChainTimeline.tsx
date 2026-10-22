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

const laneHeight = 40;

/**
 * A chain of events over several lanes: one row per device or account,
 * each event a numbered marker at its time, consecutive events joined by a
 * stepped line so a hop from one lane to the next is read as a move. The
 * marker's number is the step's ordinal in the chain, the same one the
 * step list under it carries.
 *
 * Markers are buttons: `onSelect` opens the step, `selected` marks the one
 * that is open. The caller orders `events` by time.
 */
export function ChainTimeline({
  label,
  lanes,
  events,
  startLabel,
  endLabel,
  selected,
  onSelect,
  className,
}: {
  /** Accessible name for the whole chart. */
  label: string;
  lanes: ChainTimelineLane[];
  events: ChainTimelineEvent[];
  /** The axis' two ends, e.g. the first and the last time. */
  startLabel: string;
  endLabel: string;
  selected?: string;
  onSelect?: (id: string) => void;
  className?: string;
}) {
  const rows = new Map(lanes.map((lane, i) => [lane.id, i]));
  const y = (e: ChainTimelineEvent) => (rows.get(e.lane) ?? 0) + 0.5;
  const path = events
    .map((e, i) => {
      const x = clamp(e.at);
      if (i === 0) return `M ${x} ${y(e)}`;
      const prev = events[i - 1];
      return prev.lane === e.lane ? `L ${x} ${y(e)}` : `L ${clamp(prev.at)} ${y(e)} L ${x} ${y(e)}`;
    })
    .join(" ");

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
      <div className="di-chain-track" style={{ height: lanes.length * laneHeight }}>
        {lanes.map((lane) => (
          <div key={lane.id} className="di-chain-rule" style={{ height: laneHeight }} />
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
        {events.map((e, i) => (
          <button
            key={e.id}
            type="button"
            className={cx(
              "di-chain-marker",
              e.tone === "danger" && "is-danger",
              e.tone === "muted" && "is-muted",
              e.id === selected && "is-selected",
            )}
            style={{ left: `${clamp(e.at)}%`, top: (rows.get(e.lane) ?? 0) * laneHeight + laneHeight / 2 }}
            aria-label={e.label}
            aria-pressed={onSelect ? e.id === selected : undefined}
            title={e.label}
            onClick={onSelect ? () => onSelect(e.id) : undefined}
          >
            {String(i + 1).padStart(2, "0")}
          </button>
        ))}
      </div>
      <div className="di-chain-axis">
        <span>{startLabel}</span>
        <span>{endLabel}</span>
      </div>
    </div>
  );
}

function clamp(n: number) {
  return Math.min(100, Math.max(0, n));
}
