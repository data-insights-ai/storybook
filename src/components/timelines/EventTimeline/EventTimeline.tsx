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
import { Loading } from "../../feedback/Loading";
import { ChartKey } from "../../charts/ChartKey";
import { Events, nearestEvent, reachOf } from "./marks/Events";
import { cellsOf, countIn, LANE_H, Lanes } from "./marks/Lanes";
import { MARK_BAND, markerRows, Markers } from "./marks/Markers";
import { gutterOf, SCORE_H, scaleValues, ScoreTrack, valueAt } from "./marks/ScoreTrack";
import { AXIS_H, AxisLine, TimeAxis } from "./marks/TimeAxis";
import { Waveform } from "./marks/Waveform";
import { Controls } from "./navigation/Controls";
import { Overview } from "./navigation/Overview";
import { useGestures } from "./navigation/useGestures";
import type { TimelineNavigation } from "./navigation/useTimelineView";
import { activityOf, brokenScaleOf, clockFormats, gapsBetween, ticksAcross } from "../scale";
import { zoomAround, type Span } from "../scale";
import { barAt, declaredBars, drawnSeries, seriesColor, seriesOrder, totalOf } from "../series";
import type {
  TimelineBar,
  TimelineEvent,
  TimelineInstruction,
  TimelineLane,
  TimelineMarker,
  TimelineScore,
  TimelineSeries,
  TimelineTarget,
} from "../types";
import { useWidth } from "../../../internal/useWidth";
import "./EventTimeline.css";

const WAVE_H = 136;
const GAP = 8;
const PICK_PX = 10;
const READOUT_GAP = 12;
const NO_BARS: TimelineBar[] = [];
const NO_LANES: TimelineLane[] = [];
const NO_MARKERS: TimelineMarker[] = [];
const NO_GAPS: Span[] = [];

const ReadoutPlace = createContext<{ x: number; plot: number } | null>(null);

/**
 * Many events on one clock, from weeks down to the millisecond: bars that
 * fold the events into buckets, mirrored and ringed by series in the order
 * `series` declares them, the first at the core, and the events themselves,
 * one line each, once they are far enough apart. A series is a kind, not a
 * rank: its colour is a categorical step and implies no severity. Lanes split them by kind underneath, folded until the reader opens
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
 * A long stretch with nothing in it does not fill the plot: `axis="broken"`
 * (the default) draws it a few pixels wide, the axis and the midline cut by
 * two slashes and the stretch shaded, in the view and in the overview alike.
 * The stretches either side keep one rate, so their bars stay comparable;
 * `continuous` keeps every hour as wide as every other.
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
  series: declared,
  scaleNote,
  locale,
  timeZone,
  loading,
  bars: givenBars = NO_BARS,
  overviewBars: givenOverview = NO_BARS,
  events: given,
  lanes = NO_LANES,
  lanesLabel = "",
  markers = NO_MARKERS,
  score,
  axis = "broken",
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
  /** The kinds of event the bars and lines tell apart, in the order they are stacked and listed in the key. */
  series: TimelineSeries[];
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
  /** `broken` folds long empty stretches into a break; `continuous` draws time at one rate throughout. */
  axis?: "broken" | "continuous";
  activeEventId?: string;
  onHoverChange?: (target: TimelineTarget | null) => void;
  onEventPick?: (event: TimelineEvent) => void;
  /** `EventTimelineMeta` and `EventTimelineReadout`, both optional. */
  children?: ReactNode;
}) {
  const id = useId();
  const series = useMemo(() => drawnSeries(declared, "EventTimeline"), [declared]);
  const order = useMemo(() => seriesOrder(series), [series]);
  // What is not drawn is not picked, hovered or counted either.
  const events = useMemo(() => given?.filter((e) => order.has(e.series)), [given, order]);
  const bars = useMemo(() => declaredBars(givenBars, order), [givenBars, order]);
  const overviewBars = useMemo(() => declaredBars(givenOverview, order), [givenOverview, order]);
  const [lanesOpen, setLanesOpen] = useState(false);
  const [frame, framePx] = useWidth<HTMLDivElement>();
  const { view, bounds, change, measure } = navigation;
  const number = useMemo(() => new Intl.NumberFormat(locale), [locale]);
  // The score's scale values get a column of their own at the end, so they never sit on the plot.
  const gutter = score ? gutterOf(scaleValues(score).map((v) => number.format(v))) : 0;
  const plotPx = Math.max(0, framePx - gutter);
  useEffect(() => measure(plotPx), [plotPx, measure]);

  const gaps = useMemo(
    () =>
      axis === "broken"
        ? gapsBetween(
            activityOf(
              bars,
              overviewBars,
              [...(events ?? []), ...markers].map((m) => m.at),
            ),
          )
        : NO_GAPS,
    [axis, bars, overviewBars, events, markers],
  );
  const scale = useMemo(() => brokenScaleOf(view, plotPx, gaps), [view, plotPx, gaps]);
  const whole = useMemo(() => brokenScaleOf(bounds, plotPx, gaps), [bounds, plotPx, gaps]);
  const markRows = useMemo(() => markerRows(markers, whole, plotPx), [markers, whole, plotPx]);
  const clock = useMemo(() => clockFormats(locale, timeZone), [locale, timeZone]);
  const ticks = useMemo(
    () => ticksAcross(view, plotPx, scale.breaks, clock.offsetOf),
    [view, plotPx, scale.breaks, clock],
  );
  const peak = useMemo(() => Math.max(0, ...bars.map(totalOf)), [bars]);

  const cells = useMemo(
    () => new Map(lanes.map((lane) => [lane.id, cellsOf(lane, events, order)])),
    [lanes, events, order],
  );
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
    } else if (barAt(givenBars, at, order)) {
      change(zoomAround(view, at, 0.25, bounds), true);
    }
  };
  const { ref: stageRef, ...gestures } = useGestures<HTMLDivElement>({
    view,
    bounds,
    plotPx,
    scaleOf: (span) => brokenScaleOf(span, plotPx, gaps),
    onView: change,
    onPick: pick,
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
    const bar = barAt(givenBars, at, order);
    return bar ? { ...scored, kind: "bar", bar } : { ...scored, kind: "gap" };
  }, [hoverPx, gestures.brush, loading, scale, score, events, givenBars, order]);

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

  const markTop = score ? SCORE_H + GAP : 0;
  const waveTop = markTop + markRows * MARK_BAND;
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
            <Overview
              bars={overviewBars}
              series={series}
              scale={whole}
              bounds={bounds}
              view={view}
              plotPx={plotPx}
              onView={change}
            />
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
              <div inert={loading} className="di-timeline-canvas">
                <svg width={framePx} height={axisTop + AXIS_H} className="di-timeline-svg" aria-hidden>
                  {scale.breaks.map((b) => (
                    <rect
                      key={b.start}
                      x={b.from}
                      width={b.to - b.from}
                      height={axisTop}
                      className="di-timeline-break-band"
                    />
                  ))}
                  <TimeAxis
                    ticks={ticks}
                    label={clock.tick}
                    scale={scale}
                    plotPx={plotPx}
                    top={axisTop}
                    breaks={scale.breaks}
                  />
                  {score ? (
                    <ScoreTrack
                      score={score}
                      markers={markers}
                      scale={scale}
                      plotPx={plotPx}
                      format={(v) => number.format(v)}
                    />
                  ) : null}
                  <AxisLine y={mid} plotPx={plotPx} breaks={scale.breaks} className="di-timeline-axisline" />
                  {events ? (
                    <Events events={events} series={series} scale={scale} plotPx={plotPx} mid={mid} half={half} />
                  ) : (
                    <g transform={`translate(0 ${waveTop})`}>
                      <Waveform
                        bars={bars}
                        series={series}
                        scale={scale}
                        plotPx={plotPx}
                        mid={WAVE_H / 2}
                        half={half}
                        peak={peak}
                      />
                    </g>
                  )}
                  {highlighted?.map((e) => {
                    const x = scale.x(e.at);
                    const reach = reachOf(half);
                    return (
                      <line
                        key={e.id}
                        x1={x}
                        x2={x}
                        y1={mid - reach}
                        y2={mid + reach}
                        className="di-timeline-active"
                        style={{ stroke: seriesColor(order.get(e.series)!) }}
                      />
                    );
                  })}
                  <g transform={`translate(0 ${markTop})`}>
                    <Markers
                      markers={markers}
                      scale={scale}
                      plotPx={plotPx}
                      height={axisTop - markTop}
                      rows={markRows}
                    />
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
                <ReadoutPlace.Provider value={{ x: hoverPx, plot: plotPx }}>{readout}</ReadoutPlace.Provider>
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
                    <Lanes
                      lanes={lanes}
                      cells={cells}
                      order={order}
                      counts={counts}
                      scale={scale}
                      plotPx={plotPx}
                      top={0}
                    />
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

      <ChartKey
        entries={series.map(({ id, label: name }, i) => ({ key: id, label: name, color: seriesColor(i) }))}
        note={scaleNote}
      />
      <ul id={`${id}-hint`} className="di-timeline-help">
        {instructions.map(({ keys, label: action, pointer }) => (
          <li key={`${action}-${pointer ?? "any"}`} className={pointer ? `is-${pointer}` : undefined}>
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

/**
 * What is under the pointer. Placed beside it, turned to the left where the
 * right has no room, and held inside the plot where neither side has, as
 * on a phone.
 */
export function EventTimelineReadout({ children }: { children: ReactNode }) {
  const place = useContext(ReadoutPlace);
  const box = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  useLayoutEffect(() => {
    if (box.current) setWidth(box.current.offsetWidth);
  }, [children, place?.plot]);
  if (!place || !children) {
    return null;
  }
  return (
    <div
      className="di-timeline-readout"
      ref={box}
      style={{ left: readoutLeft(place.x, width, place.plot) }}
      aria-hidden
    >
      {children}
    </div>
  );
}

/** The readout's left edge: right of the pointer, else left of it, else as far in as the plot allows. */
export function readoutLeft(x: number, width: number, plot: number): number {
  if (x + READOUT_GAP + width <= plot) return x + READOUT_GAP;
  if (x - READOUT_GAP - width >= 0) return x - READOUT_GAP - width;
  return Math.max(0, Math.min(x - width / 2, plot - width));
}
