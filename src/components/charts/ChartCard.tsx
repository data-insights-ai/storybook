import { Children, isValidElement, type ReactNode } from "react";
import { cx } from "../../cx";
import "./ChartCard.css";

/**
 * One figure of a dashboard: what it is, the value now, a line that reads
 * it ("lasts about 24 days"), and the chart behind it. A `ChartCardAction`
 * child is the link to the page that changes the figure — every figure on a dashboard leads
 * somewhere. `tone` marks a figure past its threshold; the note says why.
 *
 * Cards sit in a `Grid`; `wide` spans two columns for a chart that needs
 * the width, such as usage per day.
 */
export function ChartCard({
  title,
  figure,
  note,
  tone = "neutral",
  wide = false,
  level = 3,
  children,
}: {
  title: string;
  /** The value now, as people read it: "182.5 credits", "4 of 5". */
  figure?: string;
  note?: string;
  tone?: "neutral" | "warn" | "danger";
  wide?: boolean;
  /** The title's heading level: one below the section the dashboard sits in. */
  level?: 2 | 3 | 4;
  /** The chart — a `TrendChart`, a `PeriodTimeline`, a `Distribution`, a list — and one `ChartCardAction`. */
  children?: ReactNode;
}) {
  const action: ReactNode[] = [];
  const body: ReactNode[] = [];
  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.type === ChartCardAction) action.push(child);
    else body.push(child);
  });
  const Heading = `h${level}` as const;
  return (
    <section className={cx("di-chart-card", `di-chart-card-${tone}`, wide && "is-wide")}>
      <header className="di-chart-card-head">
        <Heading className="di-chart-card-title">{title}</Heading>
        {action}
      </header>
      {figure ? <p className="di-chart-card-figure">{figure}</p> : null}
      {note ? <p className="di-chart-card-note">{note}</p> : null}
      {body.length ? <div className="di-chart-card-body">{body}</div> : null}
    </section>
  );
}

/** The link beside the title: a `TextLink` to the page behind the figure. */
export function ChartCardAction({ children }: { children: ReactNode }) {
  return <span className="di-chart-card-action">{children}</span>;
}

/** Dashboard cards in columns: two on a laptop, one on a phone. */
export function ChartCardGrid({ children }: { children: ReactNode }) {
  return <div className="di-chart-card-grid">{children}</div>;
}
