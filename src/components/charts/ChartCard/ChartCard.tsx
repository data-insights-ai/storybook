import { Children, isValidElement, type ReactNode } from "react";
import { Figure } from "../../data/figures/Figure";
import { Grid } from "../../layout/arrangement/Grid";
import { Panel, PanelActions, PanelFigure, PanelVisual } from "../../layout/page/Panel";
import "./ChartCard.css";

/**
 * One figure of a dashboard: what it is, the value now, a line that reads
 * it, and the chart behind it, drawn as a `Panel` with a compact `Figure`.
 *
 * @deprecated Removed in 0.12.0. Use `<Panel title heading wide>` with a
 * `Figure size="compact"` (its label names what is measured) and the chart
 * as content, and the link in `PanelActions`; cards sit in a `Grid`.
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
  /** The chart and one `ChartCardAction`. */
  children?: ReactNode;
}) {
  const action: ReactNode[] = [];
  const body: ReactNode[] = [];
  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.type === ChartCardAction) action.push(child);
    else body.push(child);
  });
  return (
    <Panel title={title} heading={level} wide={wide} className="di-chart-card">
      {action.length ? <PanelActions>{action}</PanelActions> : null}
      {figure ? (
        <PanelFigure>
          <Figure size="compact" label={title} value={figure} tone={tone}>
            {note}
          </Figure>
        </PanelFigure>
      ) : null}
      {figure && body.length ? <PanelVisual>{body}</PanelVisual> : body}
    </Panel>
  );
}

/**
 * The link beside the title: a `TextLink` to the page behind the figure.
 *
 * @deprecated Removed in 0.12.0. Put the `TextLink` in `PanelActions`.
 */
export function ChartCardAction({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

/**
 * Dashboard cards in columns: two on a laptop, one on a phone.
 *
 * @deprecated Removed in 0.12.0. Use `Grid` with a `min`.
 */
export function ChartCardGrid({ children }: { children: ReactNode }) {
  return (
    <Grid min="var(--di-chart-card-min)" gap={16}>
      {children}
    </Grid>
  );
}
