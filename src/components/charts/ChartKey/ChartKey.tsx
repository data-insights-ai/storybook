import type { ComponentType, CSSProperties } from "react";
import { cx } from "../../../internal/cx";
import "./ChartKey.css";

/**
 * One entry of a key: a filled `box` for a series or a tone, a `dash` for a
 * projected series, a `flag` for a marker under a track, `empty` for a cell
 * nobody reached. `icon` replaces the swatch.
 */
export type ChartKeyEntry = {
  key: string;
  label: string;
  swatch?: "box" | "dash" | "flag" | "empty";
  color?: string;
  icon?: ComponentType<{ className?: string }>;
};

/**
 * The key of a chart, a matrix or a timeline, drawn once for all of them: a
 * block of its own beside the plot, never laid over it, each entry a swatch
 * and its word, and an optional note on the scale on its own line.
 * `inline` draws the entries as a run of text with no note, for a key
 * inside a row or a button, where only phrasing content may stand.
 */
export function ChartKey({
  entries,
  note,
  className,
  hidden,
  inline,
}: {
  entries: ChartKeyEntry[];
  note?: string;
  className?: string;
  /** For a key whose words the chart already gives a screen reader another way. */
  hidden?: boolean;
  inline?: boolean;
}) {
  if (inline) {
    return (
      <span className={cx("di-chart-key", "is-inline", className)} aria-hidden={hidden || undefined}>
        {entries.map((entry) => (
          <span key={entry.key} className="di-chart-key-entry">
            <Swatch swatch={entry.swatch} color={entry.color} icon={entry.icon} />
            <span>{entry.label}</span>
          </span>
        ))}
      </span>
    );
  }
  return (
    <div className={cx("di-chart-key", className)} aria-hidden={hidden || undefined}>
      <ul className="di-chart-key-list">
        {entries.map(({ key, label, swatch, color, icon: Icon }) => (
          <li key={key} className="di-chart-key-entry">
            <Swatch swatch={swatch} color={color} icon={Icon} />
            <span>{label}</span>
          </li>
        ))}
      </ul>
      {note ? <p className="di-chart-key-note">{note}</p> : null}
    </div>
  );
}

function Swatch({ swatch = "box", color, icon: Icon }: Pick<ChartKeyEntry, "swatch" | "color" | "icon">) {
  return Icon ? (
    <Icon className="di-chart-key-icon" />
  ) : (
    <i
      aria-hidden="true"
      className={`di-chart-key-swatch is-${swatch}`}
      style={color ? ({ "--di-chart-key-color": color } as CSSProperties) : undefined}
    />
  );
}
