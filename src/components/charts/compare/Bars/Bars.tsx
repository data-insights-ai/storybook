import "./Bars.css";

/**
 * A row of small bars, each `values` entry a percentage of the column's
 * height, with the `highlight` one marked (today, say) and three labels
 * beneath: where the row starts, its middle and its end. The bars are hidden
 * from assistive technology, so the figure they show belongs in the text
 * beside them. For a chart with axes and a tooltip, use `Chart`.
 */
export function Bars({
  values,
  highlight,
  startLabel,
  midLabel,
  endLabel,
}: {
  values: number[];
  highlight: number;
  startLabel: string;
  midLabel: string;
  endLabel: string;
}) {
  return (
    <div className="di-bars-block">
      <div className="di-bars" aria-hidden>
        {values.map((height, index) => (
          <span key={index} className={index === highlight ? "is-today" : undefined} style={{ height: `${height}%` }} />
        ))}
      </div>
      <div className="di-bar-caption">
        <span>{startLabel}</span>
        <span>{midLabel}</span>
        <span>{endLabel}</span>
      </div>
    </div>
  );
}
