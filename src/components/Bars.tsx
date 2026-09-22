import "./Bars.css";

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
