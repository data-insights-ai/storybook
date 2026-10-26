import { cx } from "../../cx";
import "./Stepper.css";

/**
 * A bounded process, and only that. A stepper never stands in for the
 * rail or the breadcrumb. It spans the width of what it heads, the steps
 * spread evenly, each a numbered bullet with its name beneath. The state
 * is a word for a screen reader, not only a filled bullet. With `onStep`
 * a completed step is a button that returns to it.
 */
export function Stepper({
  label,
  steps,
  stateLabels,
  onStep,
  className,
}: {
  label: string;
  steps: { label: string; state: "done" | "current" | "upcoming" }[];
  /** The word each state is announced as. */
  stateLabels: { done: string; current: string; upcoming: string };
  /** Called with a completed step's index when it is pressed. */
  onStep?: (index: number) => void;
  className?: string;
}) {
  return (
    <ol className={cx("di-stepper", className)} aria-label={label}>
      {steps.map((step, i) => {
        const inner = (
          <>
            <span className={cx("di-step-bullet", `is-${step.state}`)} aria-hidden>
              {i + 1}
            </span>
            <span className={cx("di-step-label", `is-${step.state}`)}>{step.label}</span>
            <span className="di-sr">{stateLabels[step.state]}</span>
          </>
        );
        return (
          <li key={step.label} className="di-step" aria-current={step.state === "current" ? "step" : undefined}>
            {onStep && step.state === "done" ? (
              <button type="button" className="di-step-button" onClick={() => onStep(i)}>
                {inner}
              </button>
            ) : (
              <span className="di-step-button">{inner}</span>
            )}
          </li>
        );
      })}
    </ol>
  );
}
