import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ComponentProps,
  type ComponentType,
  type CSSProperties,
  type RefObject,
} from "react";
import {
  Legend,
  ResponsiveContainer,
  Tooltip,
  type LegendPayload,
  type LegendProps,
  type TooltipContentProps,
  type TooltipProps,
} from "recharts";
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";
import { cx } from "../../../internal/cx";
import "./Chart.css";

/**
 * One entry per series key. `color` becomes `--color-<key>` on this chart,
 * so a Recharts mark can use `var(--color-value)`. Pass a semantic chart token
 * (`var(--di-chart-series)` and the rest) so light and dark stay in sync.
 */
export type ChartConfig = Record<
  string,
  {
    label: string;
    color?: string;
    dashed?: boolean;
    icon?: ComponentType<{ className?: string }>;
  }
>;

const ChartContext = createContext<ChartConfig | null>(null);
const TooltipDismissedContext = createContext(false);

function useChart() {
  const config = useContext(ChartContext);
  if (!config) throw new Error("Chart tooltip and legend must sit inside Chart.");
  return config;
}

function seriesKey(dataKey: unknown): string {
  return typeof dataKey === "string" || typeof dataKey === "number" ? String(dataKey) : "";
}

function cssColor(value: string): string | null {
  return /[;{}<>]/.test(value) ? null : value;
}

/**
 * The frame for one Recharts chart. `config` names every series and its
 * colour, which the marks read back as `var(--color-<key>)` and which
 * `ChartTooltip` and `ChartLegend` read for their labels. `label` is the
 * chart's accessible name. Never draw a one-off SVG chart instead.
 */
export function Chart({
  label,
  config,
  className,
  children,
}: {
  /** Accessible name for the chart. */
  label: string;
  /** One entry per series key, read back by the marks as `--color-<key>`. */
  config: ChartConfig;
  className?: string;
  /** One Recharts chart, such as a `ComposedChart`, and its marks. */
  children: ComponentProps<typeof ResponsiveContainer>["children"];
}) {
  const chartId = `di-chart-${useId().replace(/:/g, "")}`;
  const frame = useRef<HTMLDivElement>(null);
  const dismissed = useTipDismissal(frame);
  // The series colours are custom properties on the chart's element, set
  // through its style object rather than a style element, so a page with a
  // strict Content-Security-Policy (no inline style elements) shows them.
  const colors = Object.fromEntries(
    Object.entries(config).flatMap(([key, item]) => {
      if (!item.color || !/^[\w-]+$/.test(key)) return [];
      const color = cssColor(item.color);
      return color ? [[`--color-${key}`, color]] : [];
    }),
  ) as CSSProperties;

  return (
    <ChartContext.Provider value={config}>
      <TooltipDismissedContext.Provider value={dismissed}>
        <div ref={frame} className={cx("di-chart", className)} data-chart={chartId} role="group" aria-label={label} style={colors}>
          <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 320, height: 220 }}>
            {children}
          </ResponsiveContainer>
        </div>
      </TooltipDismissedContext.Provider>
    </ChartContext.Provider>
  );
}

/*
 * A pointer that leaves the chart takes the tooltip with it. A finger never
 * leaves: after a tap the tooltip would stay over the page until the next
 * tap on the chart. So a touch anywhere else puts it away.
 */
function useTipDismissal(frame: RefObject<HTMLDivElement | null>) {
  const [dismissed, setDismissed] = useState(false);
  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      const inside = frame.current?.contains(event.target as Node) ?? false;
      setDismissed(!inside && event.pointerType !== "mouse");
    };
    document.addEventListener("pointerdown", onPointerDown, true);
    return () => document.removeEventListener("pointerdown", onPointerDown, true);
  }, [frame]);
  return dismissed;
}

type TipProps = Partial<TooltipContentProps<ValueType, NameType>>;

/**
 * Recharts' tooltip, drawn with `ChartTooltipContent` and the series names
 * from the chart's `config`. A tap outside the chart dismisses it on a touch
 * screen.
 */
export function ChartTooltip({
  content = <ChartTooltipContent />,
  animationDuration = 160,
  animationEasing = "ease-out",
  active,
  ...props
}: TooltipProps<ValueType, NameType>) {
  const dismissed = useContext(TooltipDismissedContext);
  return (
    <Tooltip
      animationDuration={animationDuration}
      animationEasing={animationEasing}
      content={content}
      active={dismissed ? false : active}
      {...props}
    />
  );
}

/** A line under the series in a tooltip: something the hovered point carries that is not a series. */
export type ChartTooltipDetail = { label: string; value: string };

/**
 * The series at the hovered point, from `config`. `details` adds lines
 * beneath them, read off the hovered datum — a total, a reading from
 * another chart, an event — set apart by a rule so they never pass for a
 * series. Pass it as `<ChartTooltip content={<ChartTooltipContent details={…} />} />`.
 */
export function ChartTooltipContent({
  active,
  payload,
  label,
  details,
  formatValue,
  formatLabel,
}: TipProps & {
  details?: (datum: Record<string, unknown>) => ChartTooltipDetail[];
  /** A series value as people read it: "1,250 credits", "12 GB". */
  formatValue?: (value: number, key: string) => string;
  /** The hovered point's label, such as a formatted date. */
  formatLabel?: (label: unknown) => string;
}) {
  const config = useChart();
  if (!active || !payload?.length) return null;
  const order = Object.keys(config);
  const rows = payload.flatMap((item) => {
    const key = seriesKey(item.dataKey);
    const entry = config[key];
    if (!entry || item.value == null || item.type === "none") return [];
    const value = Array.isArray(item.value)
      ? item.value.join("–")
      : formatValue && typeof item.value === "number"
        ? formatValue(item.value, key)
        : String(item.value);
    return [{ key, label: entry.label, value, color: item.color ?? `var(--color-${key})` }];
  });
  rows.sort((a, b) => order.indexOf(a.key) - order.indexOf(b.key));
  if (!rows.length) return null;
  const datum = payload[0]?.payload;
  const extra = details && datum && typeof datum === "object" ? details(datum as Record<string, unknown>) : [];
  return (
    <div className="di-chart-tip">
      {label != null && label !== "" ? (
        <p className="di-chart-tip-label">{formatLabel ? formatLabel(label) : label}</p>
      ) : null}
      <ul>
        {rows.map((row) => (
          <li key={row.key}>
            <i aria-hidden="true" style={{ background: row.color }} />
            <span>{row.label}</span>
            <b>{row.value}</b>
          </li>
        ))}
      </ul>
      {extra.length ? (
        <ul className="di-chart-tip-details">
          {extra.map((detail, i) => (
            <li key={`${detail.label}-${i}`}>
              <i aria-hidden="true" />
              <span>{detail.label}</span>
              <b>{detail.value}</b>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

/**
 * Recharts' legend, drawn with `ChartLegendContent`. Pass `verticalAlign` and
 * the rest of Recharts' legend props to place it.
 */
export function ChartLegend(props: Omit<LegendProps, "ref">) {
  return <Legend content={<ChartLegendContent />} {...props} />;
}

/**
 * The legend's rows: each series in the chart's `config` order, with its
 * colour swatch (dashed for a dashed series) or its own icon, and its label.
 * Give it to `ChartLegend` as `content` when the legend needs props of its
 * own.
 */
export function ChartLegendContent({ payload }: { payload?: ReadonlyArray<LegendPayload> }) {
  const config = useChart();
  if (!payload?.length) return null;
  const order = Object.keys(config);
  const rows = payload.flatMap((item) => {
    const key = seriesKey(item.dataKey);
    const entry = config[key];
    if (!entry || item.type === "none") return [];
    return [{ key, item, entry }];
  });
  rows.sort((a, b) => order.indexOf(a.key) - order.indexOf(b.key));
  if (!rows.length) return null;
  return (
    <ul className="di-chart-legend">
      {rows.map(({ key, item, entry }) => {
        const Icon = entry.icon;
        return (
          <li key={key}>
            {Icon ? (
              <Icon />
            ) : (
              <i
                aria-hidden="true"
                className={entry.dashed ? "is-dashed" : undefined}
                style={
                  entry.dashed
                    ? { borderTopColor: item.color ?? `var(--color-${key})` }
                    : { background: item.color ?? `var(--color-${key})` }
                }
              />
            )}
            <span>{entry.label}</span>
          </li>
        );
      })}
    </ul>
  );
}
