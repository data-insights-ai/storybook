import type { ReactNode } from "react";
import { cx } from "../cx";
import "./Stage.css";

export function StageTrack({ children }: { children: ReactNode }) {
  return <div className="di-stage-track">{children}</div>;
}

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
  foot: string;
  current?: boolean;
  children?: ReactNode;
}) {
  return (
    <article className={cx("di-stage", current && "is-current")}>
      <header>
        <span className="di-stage-icon">{children}</span>
        <span>{step}</span>
      </header>
      <h3>{title}</h3>
      <p>{body}</p>
      <footer>{foot}</footer>
    </article>
  );
}
