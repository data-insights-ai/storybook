import type { ReactNode } from "react";
import { cx } from "../cx";
import "./Stage.css";

export function StageTrack({ children }: { children: ReactNode }) {
  return <div className="di-stage-track">{children}</div>;
}

/**
 * One step of a bounded process. Every word on it is text, so those are
 * props; the mark on the step line is a slot, because it holds an icon.
 */
export function Stage({
  step,
  title,
  body,
  foot,
  current = false,
  children,
}: {
  step: string;
  title: string;
  body: string;
  /** The closing line: a duration, a source, a count. */
  foot: string;
  current?: boolean;
  /** Holds one `StageIcon`. */
  children?: ReactNode;
}) {
  return (
    <article className={cx("di-stage", current && "is-current")}>
      <header className="di-stage-head">
        {children}
        <span className="di-stage-step">{step}</span>
      </header>
      <h3>{title}</h3>
      <p>{body}</p>
      <footer>{foot}</footer>
    </article>
  );
}

/** The mark on the step line. */
export function StageIcon({ children }: { children: ReactNode }) {
  return <span className="di-stage-icon">{children}</span>;
}
