import { Children, isValidElement, type ReactNode } from "react";
import { cx } from "../cx";
import "./Stage.css";

export function StageTrack({ children }: { children: ReactNode }) {
  return <div className="di-stage-track">{children}</div>;
}

/**
 * One step of a bounded process. `step`, `title` and `body` are read as
 * prose, so they stay text props.
 *
 * The closing line is a slot, not a string. It reports what the step cost —
 * a duration, a count, a source — which is a measured value, so it holds a
 * `SealValue`, a `StatusPill` or a `Spinner` as readily as a word.
 *
 * Like `ModalFrame`, the two slots are picked out of `children` by type:
 * they sit at opposite ends of a flex column, so the caller may write them
 * in either order.
 */
export function Stage({
  step,
  title,
  body,
  current = false,
  children,
}: {
  step: string;
  title: string;
  body: string;
  current?: boolean;
  /** One `StageIcon`, one `StageFooter`, in either order. */
  children?: ReactNode;
}) {
  const icon: ReactNode[] = [];
  const foot: ReactNode[] = [];
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    if (child.type === StageIcon) icon.push(child);
    else if (child.type === StageFooter) foot.push(child);
  });

  return (
    <article className={cx("di-stage", current && "is-current")}>
      <header className="di-stage-head">
        {icon}
        <span className="di-stage-step">{step}</span>
      </header>
      <h3>{title}</h3>
      <p>{body}</p>
      {foot}
    </article>
  );
}

/** The mark on the step line. */
export function StageIcon({ children }: { children: ReactNode }) {
  return <span className="di-stage-icon">{children}</span>;
}

/** The closing line: what the step cost, or what it is waiting on. */
export function StageFooter({ children }: { children: ReactNode }) {
  return <footer className="di-stage-footer">{children}</footer>;
}
