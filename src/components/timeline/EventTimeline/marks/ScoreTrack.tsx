import { memo } from "react";
import type { Scale } from "../../scale";
import type { TimelineMarker, TimelineScore } from "../../types";

export const SCORE_H = 80;
// The label has a strip of its own above the plot, so a score at the top never runs through it.
const TOP = 18;
const PAD = 4;

/** The value on record at an instant: the last point at or before it. */
export function valueAt(points: TimelineScore["points"], at: number): number | undefined {
  let found: number | undefined;
  for (const p of points) {
    if (p.at > at) {
      break;
    }
    found = p.value;
  }
  return found;
}

// A step line, because a score holds until the next one is recorded; a slope between two
// points would claim values nobody measured.
export const ScoreTrack = memo(function ScoreTrack({
  score,
  markers,
  scale,
  plotPx,
  format,
}: {
  score: TimelineScore;
  markers: TimelineMarker[];
  scale: Scale;
  plotPx: number;
  format: (value: number) => string;
}) {
  const y = (value: number) => TOP + (1 - value / score.max) * (SCORE_H - TOP - PAD);
  const band = (from: number, to: number, tone: string) => (
    <rect
      x={0}
      y={y(to)}
      width={plotPx}
      height={y(from) - y(to)}
      className={`di-timeline-band is-${tone}`}
    />
  );

  let d = "";
  let last: number | undefined;
  for (const p of score.points) {
    const x = Math.min(plotPx, Math.max(0, scale.x(p.at)));
    if (last === undefined) {
      d += `M${x} ${y(p.value)}`;
    } else {
      d += `H${x}V${y(p.value)}`;
    }
    last = p.value;
    if (scale.x(p.at) > plotPx) {
      break;
    }
  }

  const compare = score.compare;
  const compareX = compare ? scale.x(compare.at) : 0;
  return (
    <g className="di-timeline-score">
      {score.warn !== undefined ? band(score.warn, score.danger ?? score.max, "warn") : null}
      {score.danger !== undefined ? band(score.danger, score.max, "danger") : null}
      {compare ? (
        <g className="di-timeline-compare">
          {compareX >= 0 && compareX <= plotPx ? (
            <>
              <line
                x1={compareX}
                x2={compareX}
                y1={0}
                y2={SCORE_H}
                className="di-timeline-compare-rule"
              />
              <text x={compareX + 4} y={10} className="di-timeline-mark-label">
                {compare.label}
              </text>
            </>
          ) : null}
          <line
            x1={Math.max(0, compareX)}
            x2={plotPx}
            y1={y(compare.value)}
            y2={y(compare.value)}
            className="di-timeline-compare-line"
          />
        </g>
      ) : null}
      {d ? <path d={d} className="di-timeline-score-line" /> : null}
      {markers.map((m) => {
        const value = valueAt(score.points, m.at);
        const x = scale.x(m.at);
        return value === undefined || x < 0 || x > plotPx ? null : (
          <circle
            key={`${m.at}-${m.label}`}
            cx={x}
            cy={y(value)}
            r={3.5}
            className="di-timeline-score-dot"
          />
        );
      })}
      <text x={4} y={10} className="di-timeline-mark-label is-strong">
        {score.label}
      </text>
      {[score.warn, score.danger, score.max]
        .filter((v): v is number => v !== undefined)
        .map((v) => (
          <text key={v} x={plotPx - 4} y={y(v)} className="di-timeline-score-tick">
            {format(v)}
          </text>
        ))}
      <line
        x1={0}
        x2={plotPx}
        y1={SCORE_H + 0.5}
        y2={SCORE_H + 0.5}
        className="di-timeline-baseline"
      />
    </g>
  );
});
