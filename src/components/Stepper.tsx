import { cx } from "../cx";
import "./Stepper.css";

/**
 * A bounded process, and only that. A stepper never stands in for the
 * rail or the breadcrumb. The state is a word for a screen reader, not
 * only a filled bullet.
 */
export function Stepper({
  label,
  steps,
  stateLabels,
  className,
}: {
  label: string;
  steps: { label: string; state: "done" | "current" | "upcoming" }[];
  /** The word each state is announced as. */
  stateLabels: { done: string; current: string; upcoming: string };
  className?: string;
}) {
  return (
    <ol className={cx("di-stepper", className)} aria-label={label}>
      {steps.map((step, i) => (
        <li key={step.label} className="di-step" aria-current={step.state === "current" ? "step" : undefined}>
          {i > 0 ? <span className="di-step-connector" aria-hidden /> : null}
          <span className={cx("di-step-bullet", `is-${step.state}`)} aria-hidden>
            {i + 1}
          </span>
          <span className={cx("di-step-label", `is-${step.state}`)}>{step.label}</span>
          <span className="di-sr">{stateLabels[step.state]}</span>
        </li>
      ))}
    </ol>
  );
}
