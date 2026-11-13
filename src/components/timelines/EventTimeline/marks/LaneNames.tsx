import type { PointerEvent } from "react";
import { cx } from "../../../../internal/cx";
import type { TimelineLane } from "../../types";
import { LANE_H } from "./Lanes";

// A gesture on the plot starts on pointer down; a name that acts keeps it for itself.
const keep = (event: PointerEvent) => event.stopPropagation();

/**
 * Each lane's name and count on the line above its track. With `onPick` a name
 * is a button that narrows to the lane, pressed while it does.
 */
export function LaneNames({
  lanes,
  counts,
  top,
  active,
  onPick,
}: {
  lanes: TimelineLane[];
  counts: Map<string, string>;
  top: number;
  active?: string;
  onPick?: (laneId: string) => void;
}) {
  return (
    <div className="di-timeline-lane-names" style={{ top }}>
      {lanes.map((lane, i) => {
        const count = counts.get(lane.id);
        const body = (
          <>
            {lane.label}
            {count ? <span className="di-timeline-lane-count">{count}</span> : null}
          </>
        );
        const className = cx("di-timeline-lane-name", !count && "is-quiet");
        return onPick ? (
          <button
            key={lane.id}
            type="button"
            className={className}
            style={{ top: i * LANE_H }}
            aria-pressed={active === lane.id}
            onPointerDown={keep}
            onClick={() => onPick(lane.id)}
          >
            {body}
          </button>
        ) : (
          <span key={lane.id} className={className} style={{ top: i * LANE_H }}>
            {body}
          </span>
        );
      })}
    </div>
  );
}
