import type { ReactNode } from "react";
import { Panel, PanelActions, PanelFigure, PanelFooter, PanelVisual } from "../Panel";

/**
 * The navy zone behind a page's signature visual.
 *
 * @deprecated Removed in 0.12.0. Use `<Panel surface="hero" label title heading>`:
 * `HeroAside` is `PanelActions`, `HeroLead` is `PanelFigure`, `HeroVisual` is
 * `PanelVisual` and `HeroFooter` is `PanelFooter`.
 */
export function Hero({
  label,
  title,
  heading = 2,
  children,
}: {
  label: string;
  title: string;
  heading?: 2 | 3;
  children: ReactNode;
}) {
  return (
    <Panel surface="hero" label={label} title={title} heading={heading}>
      {children}
    </Panel>
  );
}

/** @deprecated Removed in 0.12.0. Use `PanelActions` in a `Panel surface="hero"`. */
export const HeroAside: ({ children }: { children: ReactNode }) => ReactNode = PanelActions;

/** @deprecated Removed in 0.12.0. Use `PanelFigure` in a `Panel surface="hero"`. */
export const HeroLead: ({ children }: { children: ReactNode }) => ReactNode = PanelFigure;

/** @deprecated Removed in 0.12.0. Use `PanelVisual` in a `Panel surface="hero"`. */
export const HeroVisual: ({ children }: { children: ReactNode }) => ReactNode = PanelVisual;

/** @deprecated Removed in 0.12.0. Use `PanelFooter` in a `Panel surface="hero"`. */
export const HeroFooter: ({ children }: { children: ReactNode }) => ReactNode = PanelFooter;
