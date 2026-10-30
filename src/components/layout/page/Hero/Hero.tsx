import { useId, type ReactNode } from "react";
import "./Hero.css";

/**
 * The one luminous zone a page may have: navy in both themes, behind the
 * page's signature visual — a chart the page exists to show. A page
 * without such a visual has no hero; its figures sit on a `FigureRow`
 * strip instead.
 *
 * The hero sets the dark theme on itself, so what it holds reads on navy
 * without knowing it is there. Its slots are placed by grid area and may be
 * written in any order: `HeroAside` beside the title (a link to the full
 * list), `HeroLead` the column for the `HeroFigure`, `HeroVisual` the
 * chart, and `HeroFooter` the `FigureRow variant="footer"` that closes it.
 */
export function Hero({
  label,
  title,
  heading = 2,
  children,
}: {
  /** A mono capital line above the title: what is shown and over which period. */
  label: string;
  /** What the visual says, as a sentence. */
  title: string;
  heading?: 2 | 3;
  /** `HeroVisual`, and optionally `HeroAside`, `HeroLead` and `HeroFooter`. */
  children: ReactNode;
}) {
  const id = useId();
  const Heading = heading === 2 ? "h2" : "h3";
  return (
    <section className="di-hero" data-theme="dark" aria-labelledby={id}>
      <div className="di-hero-grid">
        <div className="di-hero-titles">
          <p className="di-hero-label">{label}</p>
          <Heading id={id} className="di-hero-title">
            {title}
          </Heading>
        </div>
        {children}
      </div>
    </section>
  );
}

/** Beside the title: a link to the full list, one action at most. */
export function HeroAside({ children }: { children: ReactNode }) {
  return <div className="di-hero-aside">{children}</div>;
}

/** The column before the visual: the one `HeroFigure`. */
export function HeroLead({ children }: { children: ReactNode }) {
  return <div className="di-hero-lead">{children}</div>;
}

/** The signature visual: a chart, a timeline. */
export function HeroVisual({ children }: { children: ReactNode }) {
  return <div className="di-hero-visual">{children}</div>;
}

/** The foot under a fine rule: the `FigureRow variant="footer"` that supports the visual. */
export function HeroFooter({ children }: { children: ReactNode }) {
  return <div className="di-hero-footer">{children}</div>;
}
