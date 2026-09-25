import { Children, isValidElement, type ReactNode } from "react";
import { cx } from "../cx";
import { SealMark } from "./Seal";
import "./Inference.css";

/**
 * Why. Parameters, not prose: an inference discloses the inputs it used
 * and, just as importantly, the ones it ignored.
 */
export function ExplainPanel({
  heading,
  className,
  children,
}: {
  heading: string;
  className?: string;
  /** `ExplainRow`s, and one `ExplainFooter`. */
  children: ReactNode;
}) {
  const rows: ReactNode[] = [];
  const foot: ReactNode[] = [];
  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.type === ExplainFooter) foot.push(child);
    else rows.push(child);
  });
  return (
    <div className={cx("di-explain", className)}>
      <div className="di-explain-head">
        <SealMark state="inferred" size={7} />
        <span className="di-explain-title">{heading}</span>
      </div>
      <dl className="di-explain-rows">{rows}</dl>
      {foot}
    </div>
  );
}

/**
 * The caveat under the rows: what this inference does not account for.
 * A slot, not a string — the caveat routinely names a source or a cut-off
 * timestamp, which belongs in the mono track.
 */
export function ExplainFooter({ children }: { children: ReactNode }) {
  return <p className="di-explain-foot">{children}</p>;
}

export function ExplainRow({
  label,
  ignored = false,
  children,
}: {
  label: string;
  /** An input the model did not use. It is named, not hidden. */
  ignored?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={cx("di-explain-row", ignored && "is-ignored")}>
      <dt className="di-explain-label">{label}</dt>
      <dd className="di-explain-value">{children}</dd>
    </div>
  );
}
