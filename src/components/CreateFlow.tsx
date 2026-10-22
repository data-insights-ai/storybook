import { useEffect, useId, useRef, type FormEvent, type ReactNode } from "react";
import { Button } from "./Button";
import { Stepper } from "./Stepper";
import { focusFirstField } from "./shortcutKeys";
import "./CreateFlow.css";

/**
 * Creating something that needs a choice before its details: choose the
 * type (`ChoiceCards`), fill in the details, review, create. One step is
 * on screen at a time, under a `Stepper` that says where the reader is.
 * Enter moves on; Back keeps what was entered. Each step starts in its
 * first field, or on its heading when it has none.
 *
 * The flow is a form. The caller owns the step and the values and checks
 * them; `canAdvance` false keeps Next disabled until the step is complete.
 * It sits on a page (`Page width="form"`) or in a `Sheet`.
 */
export function CreateFlow({
  label,
  steps,
  step,
  stateLabels,
  backLabel,
  nextLabel,
  submitLabel,
  cancelLabel = "",
  canAdvance = true,
  busy = false,
  error = "",
  width = "form",
  onBack,
  onNext,
  onSubmit,
  onCancel,
  children,
}: {
  /** Names the stepper, e.g. "Steps". */
  label: string;
  /** Each step's title, in order. The current one heads its body. */
  steps: string[];
  /** The current step, from 0. */
  step: number;
  stateLabels: { done: string; current: string; upcoming: string };
  backLabel: string;
  nextLabel: string;
  /** The last step's button, e.g. "Create connection". */
  submitLabel: string;
  /** Leaves the flow. Empty, or no `onCancel`, means no cancel button. */
  cancelLabel?: string;
  canAdvance?: boolean;
  busy?: boolean;
  error?: string;
  /** `form` keeps the flow at the form measure; `page` lets it fill the page it sits on. */
  width?: "form" | "page";
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
  onCancel?: () => void;
  /** The current step's fields or review. */
  children: ReactNode;
}) {
  const headingId = useId();
  const heading = useRef<HTMLHeadingElement>(null);
  const first = useRef(true);
  const last = step === steps.length - 1;

  const fields = useRef<HTMLDivElement>(null);
  // Each step starts in its first field; a step without one (a review)
  // puts focus on its heading, so a screen reader hears where it landed.
  useEffect(() => {
    const opening = first.current;
    first.current = false;
    if (!focusFirstField(fields.current) && !opening) heading.current?.focus();
  }, [step]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (busy || !canAdvance) return;
    if (last) onSubmit();
    else onNext();
  };

  return (
    <form className="di-create-flow" data-width={width} onSubmit={submit} aria-labelledby={headingId}>
      <Stepper
        label={label}
        stateLabels={stateLabels}
        steps={steps.map((title, i) => ({
          label: title,
          state: i < step ? "done" : i === step ? "current" : "upcoming",
        }))}
      />
      <div className="di-create-flow-step">
        <h2 className="di-create-flow-title" id={headingId} ref={heading} tabIndex={-1}>
          {steps[step]}
        </h2>
        <div className="di-field-stack" ref={fields}>
          {children}
        </div>
      </div>
      {error ? (
        <p className="di-create-flow-error" role="alert">
          {error}
        </p>
      ) : null}
      <div className="di-create-flow-actions">
        {cancelLabel !== "" && onCancel ? (
          <Button variant="ghost" onClick={onCancel} disabled={busy}>
            {cancelLabel}
          </Button>
        ) : null}
        <span className="di-create-flow-spacer" />
        {step > 0 ? (
          <Button variant="secondary" onClick={onBack} disabled={busy}>
            {backLabel}
          </Button>
        ) : null}
        <Button type="submit" loading={busy} disabled={!canAdvance}>
          {last ? submitLabel : nextLabel}
        </Button>
      </div>
    </form>
  );
}
