import { createContext, useContext, useId, type ComponentProps, type ComponentType } from "react";
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
import { cx } from "../cx";
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
  const rules = Object.entries(config)
    .flatMap(([key, item]) => {
      if (!item.color || !/^[\w-]+$/.test(key)) return [];
      const color = cssColor(item.color);
      return color ? [`--color-${key}: ${color};`] : [];
    })
    .join("");

  return (
    <ChartContext.Provider value={config}>
      <div className={cx("di-chart", className)} data-chart={chartId} role="group" aria-label={label}>
        {rules ? <style>{`[data-chart="${chartId}"] { ${rules} }`}</style> : null}
        <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 320, height: 220 }}>
          {children}
        </ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

type TipProps = Partial<TooltipContentProps<ValueType, NameType>>;

export function ChartTooltip({
  content = <ChartTooltipContent />,
  animationDuration = 160,
  animationEasing = "ease-out",
  ...props
}: TooltipProps<ValueType, NameType>) {
  return (
    <Tooltip
      animationDuration={animationDuration}
      animationEasing={animationEasing}
      content={content}
      {...props}
    />
  );
}

export function ChartTooltipContent({ active, payload, label }: TipProps) {
  const config = useChart();
  if (!active || !payload?.length) return null;
  const order = Object.keys(config);
  const rows = payload.flatMap((item) => {
    const key = seriesKey(item.dataKey);
    const entry = config[key];
    if (!entry || item.value == null || item.type === "none") return [];
    const value = Array.isArray(item.value) ? item.value.join("–") : String(item.value);
    return [{ key, label: entry.label, value, color: item.color ?? `var(--color-${key})` }];
  });
  rows.sort((a, b) => order.indexOf(a.key) - order.indexOf(b.key));
  if (!rows.length) return null;
  return (
    <div className="di-chart-tip">
      {label != null && label !== "" ? <p className="di-chart-tip-label">{label}</p> : null}
      <ul>
        {rows.map((row) => (
          <li key={row.key}>
            <i aria-hidden="true" style={{ background: row.color }} />
            <span>{row.label}</span>
            <b>{row.value}</b>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ChartLegend(props: Omit<LegendProps, "ref">) {
  return <Legend content={<ChartLegendContent />} {...props} />;
}

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
