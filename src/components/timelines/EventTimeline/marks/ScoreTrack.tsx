import { memo } from "react";
import { placeLabels, textWidth, TICK_FONT } from "../../scale";
import type { Scale } from "../../scale";
import type { TimelineMarker, TimelineScore } from "../../types";

export const SCORE_H = 80;
// The label has a strip of its own above the plot, so a score at the top never runs through it.
const TOP = 18;
const PAD = 4;
const GUTTER_GAP = 6;
const LABEL_GAP = 12;

/** The values on the score's scale, beside the plot and never over it. */
export const scaleValues = (score: TimelineScore) =>
  [score.warn, score.danger, score.max].filter((v): v is number => v !== undefined);

/** The column right of the plot that holds the scale values. */
export const gutterOf = (labels: string[]) =>
  GUTTER_GAP + Math.max(0, ...labels.map((l) => textWidth(l, TICK_FONT))) + GUTTER_GAP;

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
    <rect x={0} y={y(to)} width={plotPx} height={y(from) - y(to)} className={`di-timeline-band is-${tone}`} />
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
  const nameWidth = textWidth(score.label, TICK_FONT) + LABEL_GAP;
  const [compareSide] = compare
    ? placeLabels([{ x: compareX, width: textWidth(compare.label, TICK_FONT) + LABEL_GAP }], plotPx, [[0, nameWidth]])
    : [];
  const threshold = (value: number | undefined, tone: string) =>
    value === undefined ? null : (
      <line x1={0} x2={plotPx} y1={y(value)} y2={y(value)} className={`di-timeline-threshold is-${tone}`} />
    );
  return (
    <g className="di-timeline-score">
      {score.warn !== undefined ? band(score.warn, score.danger ?? score.max, "warn") : null}
      {score.danger !== undefined ? band(score.danger, score.max, "danger") : null}
      {threshold(score.warn, "warn")}
      {threshold(score.danger, "danger")}
      {compare ? (
        <g className="di-timeline-compare">
          {compareX >= 0 && compareX <= plotPx ? (
            <>
              <line x1={compareX} x2={compareX} y1={0} y2={SCORE_H} className="di-timeline-compare-rule" />
              {compareSide ? (
                <text
                  x={compareSide === "right" ? compareX + 4 : compareX - 4}
                  y={TOP / 2}
                  textAnchor={compareSide === "right" ? "start" : "end"}
                  className="di-timeline-mark-label"
                >
                  {compare.label}
                </text>
              ) : null}
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
          <circle key={`${m.at}-${m.label}`} cx={x} cy={y(value)} r={3.5} className="di-timeline-score-dot" />
        );
      })}
      <text x={0} y={TOP / 2} className="di-timeline-mark-label">
        {score.label}
      </text>
      {scaleValues(score).map((v) => (
        <text key={v} x={plotPx + GUTTER_GAP} y={y(v)} className="di-timeline-score-tick">
          {format(v)}
        </text>
      ))}
      <line x1={0} x2={plotPx} y1={SCORE_H + 0.5} y2={SCORE_H + 0.5} className="di-timeline-baseline" />
    </g>
  );
});
