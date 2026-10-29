import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { CartesianGrid, Line, LineChart, ReferenceDot, ReferenceLine, XAxis, YAxis } from "recharts";
import { cx } from "../../../internal/cx";
import { Chart, ChartTooltip, ChartTooltipContent, type ChartConfig } from "../Chart";
import {
  bucketMiddle,
  peaks,
  pulses,
  stepSelection,
  tickStride,
  type PulsePoint,
  type SeismographPoint,
} from "./seismographPulses";
import "./Seismograph.css";

export type { SeismographPoint } from "./seismographPulses";

/**
 * Counts per period read as a seismograph: each period one pulse up for what
 * lies above the line (`above`) and one down for what lies below it
 * (`below`), on one count scale, so a loud period stands out at a glance.
 * The highest periods are labelled with their count; `unknown` shows in the
 * tooltip only.
 *
 * With `onSelect` a period can be picked: by a click on the chart, or with
 * the scrubber under it, a slider that arrows, Page Up/Down, Home and End
 * move and a screen reader reads as the period and its counts. The product
 * owns the words (`label`, the series labels, `formatX`, `formatValue`); the
 * chart owns marks, colours and scale. `scale="log"` is symmetric
 * (log-like away from zero, linear through it), so a period of zero still
 * sits on the line.
 */
export function Seismograph({
  label,
  points,
  aboveLabel,
  belowLabel,
  unknownLabel,
  emptyLabel,
  selectionLabel,
  note,
  selectedAt = "",
  onSelect,
  formatX = String,
  formatValue = String,
  scale = "linear",
  height = "lg",
}: {
  /** Names the chart for a screen reader. */
  label: string;
  points: SeismographPoint[];
  aboveLabel: string;
  belowLabel: string;
  unknownLabel: string;
  /** Shown instead of the chart when there are no periods. */
  emptyLabel: string;
  /** Names the scrubber that picks a period. */
  selectionLabel: string;
  /** One line under the chart on how to read it. */
  note?: string;
  /** The `at` of the selected period; empty for none. */
  selectedAt?: string;
  onSelect?: (at: string) => void;
  /** A period's start as the axis and tooltip show it. */
  formatX?: (at: string) => string;
  formatValue?: (value: number) => string;
  scale?: "linear" | "sqrt" | "log";
  height?: "md" | "lg";
}) {
  const frame = useRef<HTMLDivElement>(null);
  const width = useWidth(frame);
  const reduced = useReducedMotion();
  if (!points.length) return <p className="di-seismograph-empty">{emptyLabel}</p>;

  const config: ChartConfig = {
    above: { label: aboveLabel, color: "var(--di-chart-series)" },
    below: { label: belowLabel, color: "var(--di-chart-compare)" },
    unknown: { label: unknownLabel, color: "var(--di-chart-muted-strong)" },
  };
  const traced = pulses(points);
  const maxAbove = Math.max(1, ...points.map((p) => p.above));
  const maxBelow = Math.max(1, ...points.map((p) => p.below));
  const stride = tickStride(points.length, width);
  const labelled = peaks(points, width < 600 ? 1 : 3);
  const selected = points.findIndex((p) => p.at === selectedAt);
  const describe = (p: SeismographPoint) =>
    `${formatX(p.at)}: ${aboveLabel} ${formatValue(p.above)}, ${belowLabel} ${formatValue(p.below)}, ${unknownLabel} ${formatValue(p.unknown ?? 0)}`;

  return (
    <div ref={frame} className={cx("di-seismograph", `di-seismograph-${height}`)}>
      <Chart label={label} config={config} className="di-seismograph-plot">
        <LineChart
          data={traced}
          margin={{ top: 40, right: 24, bottom: 24, left: 0 }}
          onClick={(state) => {
            const at = traced.find((p) => p.x === Number(state.activeLabel));
            if (at && onSelect) onSelect(points[at.index].at);
          }}
        >
          <CartesianGrid vertical={false} stroke="var(--di-rule)" strokeDasharray="2 3" />
          <XAxis dataKey="x" type="number" domain={["dataMin", "dataMax"]} hide />
          <YAxis
            width={48}
            scale={scale === "log" ? "symlog" : scale}
            domain={[-maxBelow * 1.25, maxAbove * 1.45]}
            tickFormatter={(v: number) => formatValue(Math.abs(v))}
            allowDecimals={false}
            tickLine={false}
            axisLine={false}
          />
          <ReferenceLine y={0} stroke="var(--di-chart-baseline)" />
          <ChartTooltip
            animationDuration={reduced ? 0 : undefined}
            content={({ active, payload }) => {
              const pulse = payload?.[0]?.payload as PulsePoint | undefined;
              if (!pulse) return null;
              const p = points[pulse.index];
              return (
                <ChartTooltipContent
                  active={active}
                  label={p.at}
                  formatLabel={(at) => formatX(String(at))}
                  formatValue={formatValue}
                  payload={[
                    { graphicalItemId: "above", dataKey: "above", value: p.above, color: "var(--color-above)" },
                    { graphicalItemId: "below", dataKey: "below", value: p.below, color: "var(--color-below)" },
                    {
                      graphicalItemId: "unknown",
                      dataKey: "unknown",
                      value: p.unknown ?? 0,
                      color: "var(--color-unknown)",
                    },
                  ]}
                />
              );
            }}
          />
          <Line
            type="monotone"
            dataKey="above"
            stroke="var(--color-above)"
            strokeWidth={1.8}
            dot={false}
            activeDot={false}
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="below"
            stroke="var(--color-below)"
            strokeWidth={1.4}
            dot={false}
            activeDot={false}
            isAnimationActive={false}
          />
          {points.map((p, index) =>
            index % stride === 0 ? (
              <ReferenceDot
                key={p.at}
                x={Date.parse(p.at)}
                y={0}
                r={2}
                fill="var(--di-text-muted)"
                stroke="none"
                label={{ value: formatX(p.at), position: "bottom", dy: 6, className: "di-seismograph-tick" }}
              />
            ) : null,
          )}
          {labelled.map((index) => (
            <ReferenceDot
              key={`peak-${points[index].at}`}
              x={bucketMiddle(points, index)}
              y={points[index].above}
              r={2}
              fill="var(--color-above)"
              stroke="none"
              label={{
                value: formatValue(points[index].above),
                position: "top",
                dy: -6,
                className: "di-seismograph-peak",
              }}
            />
          ))}
          {selected >= 0 ? (
            <ReferenceLine
              x={bucketMiddle(points, selected)}
              stroke="var(--di-chart-highlight)"
              strokeDasharray="3 3"
            />
          ) : null}
        </LineChart>
      </Chart>
      {onSelect ? (
        <Scrubber
          label={selectionLabel}
          count={points.length}
          selected={selected}
          valueText={selected >= 0 ? describe(points[selected]) : selectionLabel}
          onSelect={(index) => onSelect(points[index].at)}
        />
      ) : null}
      {note ? <p className="di-seismograph-note">{note}</p> : null}
    </div>
  );
}

function Scrubber({
  label,
  count,
  selected,
  valueText,
  onSelect,
}: {
  label: string;
  count: number;
  selected: number;
  valueText: string;
  onSelect: (index: number) => void;
}) {
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const next = stepSelection(selected, count, event.key);
    if (next === null) return;
    event.preventDefault();
    onSelect(next);
  };
  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    const index = Math.floor(((event.clientX - box.left) / box.width) * count);
    onSelect(Math.min(count - 1, Math.max(0, index)));
  };
  return (
    <div
      className="di-seismograph-scrubber"
      role="slider"
      tabIndex={0}
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={count - 1}
      aria-valuenow={Math.max(0, selected)}
      aria-valuetext={valueText}
      onKeyDown={onKeyDown}
      onPointerDown={onPointerDown}
    >
      {selected >= 0 ? (
        <span className="di-seismograph-thumb" style={{ left: `${((selected + 0.5) / count) * 100}%` }} aria-hidden />
      ) : null}
    </div>
  );
}

function useWidth(frame: React.RefObject<HTMLDivElement | null>) {
  const [width, setWidth] = useState(1000);
  useEffect(() => {
    const element = frame.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(element);
    return () => observer.disconnect();
  }, [frame]);
  return width;
}

function useReducedMotion() {
  const query = "(prefers-reduced-motion: reduce)";
  const [reduced, setReduced] = useState(() => typeof window !== "undefined" && window.matchMedia(query).matches);
  useEffect(() => {
    const list = window.matchMedia(query);
    const update = () => setReduced(list.matches);
    list.addEventListener("change", update);
    return () => list.removeEventListener("change", update);
  }, []);
  return reduced;
}
