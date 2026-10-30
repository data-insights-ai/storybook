import {
  Children,
  createContext,
  Fragment,
  isValidElement,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ChevronRight } from "lucide-react";
import { cx } from "../../../internal/cx";
import { Kbd } from "../../text/Kbd";
import { Loading } from "../../feedback/waiting/Loading";
import { Events, nearestEvent, reachOf } from "./marks/Events";
import { cellsOf, countIn, LANE_H, Lanes } from "./marks/Lanes";
import { Markers } from "./marks/Markers";
import { SCORE_H, ScoreTrack, valueAt } from "./marks/ScoreTrack";
import { AXIS_H, TimeAxis } from "./marks/TimeAxis";
import { totalOf, Waveform } from "./marks/Waveform";
import { Controls } from "./navigation/Controls";
import { Overview } from "./navigation/Overview";
import { useGestures } from "./navigation/useGestures";
import type { TimelineNavigation } from "./navigation/useTimelineView";
import { clockFormats, ticksFor } from "../scale";
import { scaleOf, zoomAround } from "../scale";
import type {
  TimelineBar,
  TimelineEvent,
  TimelineInstruction,
  TimelineLane,
  TimelineMarker,
  TimelineScore,
  TimelineTarget,
  TimelineTone,
} from "../types";
import { useWidth } from "../../../internal/useWidth";
import "./EventTimeline.css";

const WAVE_H = 136;
const GAP = 8;
const PICK_PX = 10;
const FLIP_PX = 260;
const TONES: TimelineTone[] = ["danger", "warn", "neutral"];
const NO_BARS: TimelineBar[] = [];
const NO_LANES: TimelineLane[] = [];
const NO_MARKERS: TimelineMarker[] = [];

const ReadoutPlace = createContext<{ x: number; flipped: boolean } | null>(null);

/**
 * Many events on one clock, from weeks down to the millisecond: bars that
 * fold the events into buckets, mirrored and ringed by tone with the
 * severest at the core, and the events themselves once they are far enough
 * apart. Lanes split them by kind underneath, folded until the reader opens
 * them, since the bars already tell the shape; markers carry what happened
 * to the record, and an optional score runs above on the same clock.
 *
 * The caller owns the data and the view: `useTimelineView` holds the view,
 * says which bucket width to load, and reports where the reader settled.
 * Pass `events` instead of only `bars` once `timelineEventsReadable` says
 * they can be told apart.
 *
 * Children are two optional slots, picked by type because the readout has
 * to sit inside the plot it follows: `EventTimelineMeta` beside the title,
 * and `EventTimelineReadout` for what is under the pointer.
 *
 * Drawn here rather than with `Chart`: Recharts zooms by index, not by
 * time, and cannot pan, pinch or redraw at the rate a gesture asks for.
 */
export function EventTimeline({
  navigation,
  title,
  label,
  instructions,
  loadingLabel,
  zoomInLabel,
  zoomOutLabel,
  backLabel,
  wholeLabel,
  toneLabels,
  scaleNote,
  locale,
  timeZone,
  loading,
  bars = NO_BARS,
  overviewBars = NO_BARS,
  events,
  lanes = NO_LANES,
  lanesLabel = "",
  markers = NO_MARKERS,
  score,
  activeEventId,
  onHoverChange,
  onEventPick,
  children,
}: {
  navigation: TimelineNavigation;
  title: string;
  /** The accessible name of the plot. */
  label: string;
  /** How to move the view: shown under it as key caps, and read with the plot. */
  instructions: TimelineInstruction[];
  loadingLabel: string;
  zoomInLabel: string;
  zoomOutLabel: string;
  backLabel: string;
  wholeLabel: string;
  toneLabels: Record<TimelineTone, string>;
  /** What a bar's or a line's height means at the current zoom. */
  scaleNote: string;
  locale: string;
  timeZone: string;
  loading: boolean;
  bars?: TimelineBar[];
  overviewBars?: TimelineBar[];
  events?: TimelineEvent[];
  lanes?: TimelineLane[];
  /** What the lanes are, on the toggle that opens them, such as "Attack phases". */
  lanesLabel?: string;
  markers?: TimelineMarker[];
  score?: TimelineScore;
  activeEventId?: string;
  onHoverChange?: (target: TimelineTarget | null) => void;
  onEventPick?: (event: TimelineEvent) => void;
  /** `EventTimelineMeta` and `EventTimelineReadout`, both optional. */
  children?: ReactNode;
}) {
  const id = useId();
  const [lanesOpen, setLanesOpen] = useState(false);
  const [frame, plotPx] = useWidth<HTMLDivElement>();
  const { view, bounds, change, measure } = navigation;
  useEffect(() => measure(plotPx), [plotPx, measure]);

  const scale = useMemo(() => scaleOf(view, plotPx), [view, plotPx]);
  const clock = useMemo(() => clockFormats(locale, timeZone), [locale, timeZone]);
  const number = useMemo(() => new Intl.NumberFormat(locale), [locale]);
  const ticks = useMemo(() => ticksFor(view, plotPx, clock.offsetOf), [view, plotPx, clock]);
  const peak = useMemo(() => Math.max(0, ...bars.map(totalOf)), [bars]);
  const cells = useMemo(() => new Map(lanes.map((lane) => [lane.id, cellsOf(lane, events)])), [lanes, events]);
  const counts = new Map(
    lanes.map((lane) => {
      const count = countIn(cells.get(lane.id) ?? [], view);
      return [lane.id, count ? number.format(count) : ""];
    }),
  );

  const pick = (px: number) => {
    const at = scale.at(px);
    if (events) {
      const hit = nearestEvent(events, scale, px, PICK_PX);
      if (hit) {
        onEventPick?.(hit);
      }
    } else if (bars.some((b) => b.start <= at && at < b.end)) {
      change(zoomAround(view, at, 0.25, bounds), true);
    }
  };
  const { ref: stageRef, ...gestures } = useGestures<HTMLDivElement>({
    view,
    bounds,
    plotPx,
    onView: change,
    onPick: pick,
  });

  // Set as a property: React 18.3 does not pass `inert` through as a boolean attribute.
  const canvas = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (canvas.current) canvas.current.inert = loading;
  });

  const hoverPx = gestures.hover !== null && gestures.hover >= 0 && gestures.hover <= plotPx ? gestures.hover : null;
  const target = useMemo((): TimelineTarget | null => {
    if (hoverPx === null || gestures.brush || loading) {
      return null;
    }
    const at = scale.at(hoverPx);
    const scored = { at, score: score ? valueAt(score.points, at) : undefined };
    if (events) {
      const event = nearestEvent(events, scale, hoverPx, PICK_PX);
      return event ? { ...scored, kind: "event", event } : { ...scored, kind: "gap" };
    }
    const bar = bars.find((b) => b.start <= at && at < b.end);
    return bar ? { ...scored, kind: "bar", bar } : { ...scored, kind: "gap" };
  }, [hoverPx, gestures.brush, loading, scale, score, events, bars]);

  // Reported when what is under the pointer changes, not on every render that rebuilds it.
  const hoverKey = !target
    ? ""
    : target.kind === "event"
      ? `e:${target.event.id}`
      : target.kind === "bar"
        ? `b:${target.bar.start}:${totalOf(target.bar)}`
        : `g:${Math.round(target.at)}`;
  const report = useRef(onHoverChange);
  const latest = useRef(target);
  useLayoutEffect(() => {
    report.current = onHoverChange;
    latest.current = target;
  });
  useEffect(() => report.current?.(latest.current), [hoverKey]);

  const slots = Children.toArray(children).filter(isValidElement);
  const meta = slots.find((c) => c.type === EventTimelineMeta);
  const readout = slots.find((c) => c.type === EventTimelineReadout);

  const waveTop = score ? SCORE_H + GAP : 0;
  const mid = waveTop + WAVE_H / 2;
  const half = WAVE_H / 2 - 4;
  const axisTop = waveTop + WAVE_H + GAP + 4;
  const highlighted = events?.filter(
    (e) => e.id === activeEventId || (target?.kind === "event" && target.event.id === e.id),
  );

  return (
    <section className="di-timeline" aria-labelledby={`${id}-title`}>
      <div className="di-timeline-head">
        <span id={`${id}-title`} className="di-timeline-title">
          {title}
        </span>
        {meta}
        <Controls
          navigation={navigation}
          labels={{
            zoomIn: zoomInLabel,
            zoomOut: zoomOutLabel,
            back: backLabel,
            whole: wholeLabel,
          }}
        />
      </div>

      <div className="di-timeline-frame" ref={frame}>
        {plotPx > 0 ? (
          <>
            <Overview bars={overviewBars} bounds={bounds} view={view} plotPx={plotPx} onView={change} />
            <div
              ref={stageRef}
              className="di-timeline-stage"
              role="group"
              // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- the plot pans and zooms from the keyboard, as its hint says
              tabIndex={0}
              aria-label={label}
              aria-describedby={`${id}-hint`}
              {...gestures.handlers}
            >
              {/* Under the loading veil the plot is stale and inactive, so it is inert. */}
              <div ref={canvas} className="di-timeline-canvas">
                <svg width={plotPx} height={axisTop + AXIS_H} className="di-timeline-svg" aria-hidden>
                  <TimeAxis ticks={ticks} label={clock.tick} scale={scale} plotPx={plotPx} top={axisTop} />
                  {score ? (
                    <ScoreTrack
                      score={score}
                      markers={markers}
                      scale={scale}
                      plotPx={plotPx}
                      format={(v) => number.format(v)}
                    />
                  ) : null}
                  <line x1={0} x2={plotPx} y1={mid} y2={mid} className="di-timeline-axisline" />
                  {events ? (
                    <Events events={events} scale={scale} plotPx={plotPx} mid={mid} half={half} />
                  ) : (
                    <g transform={`translate(0 ${waveTop})`}>
                      <Waveform bars={bars} scale={scale} plotPx={plotPx} mid={WAVE_H / 2} half={half} peak={peak} />
                    </g>
                  )}
                  {highlighted?.map((e) => {
                    const x = scale.x(e.at);
                    const reach = reachOf(e, half);
                    return (
                      <line
                        key={e.id}
                        x1={x}
                        x2={x}
                        y1={mid - reach}
                        y2={mid + reach}
                        className={`di-timeline-active is-${e.tone}`}
                      />
                    );
                  })}
                  <g transform={`translate(0 ${waveTop})`}>
                    <Markers markers={markers} scale={scale} plotPx={plotPx} height={axisTop - waveTop} />
                  </g>
                  {gestures.brush ? (
                    <rect
                      x={Math.min(gestures.brush.from, gestures.brush.to)}
                      width={Math.abs(gestures.brush.to - gestures.brush.from)}
                      height={axisTop}
                      className="di-timeline-selecting"
                    />
                  ) : null}
                  {hoverPx !== null && !gestures.brush ? (
                    <line x1={hoverPx} x2={hoverPx} y1={0} y2={axisTop} className="di-timeline-cursor" />
                  ) : null}
                </svg>
              </div>
              {target && hoverPx !== null ? (
                <ReadoutPlace.Provider value={{ x: hoverPx, flipped: hoverPx > plotPx - FLIP_PX }}>
                  {readout}
                </ReadoutPlace.Provider>
              ) : null}
              {loading ? (
                <div className="di-timeline-loading">
                  <Loading label={loadingLabel} />
                </div>
              ) : null}
            </div>
          </>
        ) : null}
        {lanes.length > 0 ? (
          <div className="di-timeline-lanes-block">
            <button
              type="button"
              className="di-timeline-lanes-toggle"
              aria-expanded={lanesOpen}
              onClick={() => setLanesOpen((open) => !open)}
            >
              <ChevronRight className="di-timeline-lanes-chevron" aria-hidden />
              {lanesLabel}
            </button>
            {/* Kept drawn while folded, so closing can run the same motion as opening. */}
            <div className={cx("di-timeline-lanes-fold", lanesOpen && "is-open")}>
              <div className="di-timeline-lanes-inner">
                {plotPx > 0 ? (
                  <svg width={plotPx} height={lanes.length * LANE_H} className="di-timeline-svg" aria-hidden>
                    <Lanes lanes={lanes} cells={cells} counts={counts} scale={scale} plotPx={plotPx} top={0} />
                    {hoverPx !== null && !gestures.brush ? (
                      <line
                        x1={hoverPx}
                        x2={hoverPx}
                        y1={0}
                        y2={lanes.length * LANE_H}
                        className="di-timeline-cursor"
                      />
                    ) : null}
                  </svg>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div className="di-timeline-legend">
        {TONES.map((tone) => (
          <span key={tone} className="di-timeline-legend-item">
            <span className={`di-timeline-swatch is-${tone}`} aria-hidden />
            {toneLabels[tone]}
          </span>
        ))}
        <span className="di-timeline-note">{scaleNote}</span>
      </div>
      <ul id={`${id}-hint`} className="di-timeline-help">
        {instructions.map(({ keys, label: action }) => (
          <li key={action}>
            <span className="di-timeline-keys">
              {keys.map((key, i) => (
                <Fragment key={key}>
                  {i > 0 ? (
                    <span className="di-timeline-or" aria-hidden>
                      /
                    </span>
                  ) : null}
                  <Kbd>{key}</Kbd>
                </Fragment>
              ))}
            </span>
            {action}
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Beside the title: the span in view and what it holds. Announced as it changes. */
export function EventTimelineMeta({ children }: { children: ReactNode }) {
  return (
    <div className="di-timeline-meta" aria-live="polite">
      {children}
    </div>
  );
}

/** What is under the pointer. Placed beside it, and turned to the left near the right edge. */
export function EventTimelineReadout({ children }: { children: ReactNode }) {
  const place = useContext(ReadoutPlace);
  if (!place || !children) {
    return null;
  }
  return (
    <div
      className={place.flipped ? "di-timeline-readout is-flipped" : "di-timeline-readout"}
      style={{ left: place.x }}
      aria-hidden
    >
      {children}
    </div>
  );
}
