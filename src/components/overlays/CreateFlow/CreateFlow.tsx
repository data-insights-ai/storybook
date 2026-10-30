import { useEffect, useId, useRef, type FormEvent, type ReactNode } from "react";
import { Button } from "../../actions/Button";
import { Stepper } from "../../navigation/sequence/Stepper";
import { focusFirstField } from "../../../internal/shortcutKeys";
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
 * The stepper spans the flow, a completed step is pressed to return to it
 * (`onBack` once per step), and the actions sit in a footer that stays in
 * view: Back and Cancel at the left, the one action that moves on at the
 * right.
 *
 * It sits in a `Sheet` (`width="form"`) or on a page (`width="page"`).
 * On a page the steps run in one line from the left edge, and the step is
 * a panel, like a section of a record: its title and
 * lede, its body, the actions as its footer. A single field, a switch and
 * prose keep the form measure there; cards, a grid, a split or a table take
 * the panel's width, so a type's cards use a large screen.
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
  lede = "",
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
  /** One line under the current step's title: what this step decides. */
  lede?: string;
  /** `form` keeps the flow at the form measure; `page` sets the step on a panel that fills the page. */
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

  const goTo = (index: number) => {
    for (let i = step; i > index; i--) onBack();
  };

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
        onStep={goTo}
        layout={width === "page" ? "inline" : "spread"}
        steps={steps.map((title, i) => ({
          label: title,
          state: i < step ? "done" : i === step ? "current" : "upcoming",
        }))}
      />
      <div className="di-create-flow-panel">
        <div className="di-create-flow-step">
          <div className="di-create-flow-head">
            <h2 className="di-create-flow-title" id={headingId} ref={heading} tabIndex={-1}>
              {steps[step]}
            </h2>
            {lede ? <p className="di-create-flow-lede">{lede}</p> : null}
          </div>
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
          {step > 0 ? (
            <Button variant="secondary" onClick={onBack} disabled={busy}>
              {backLabel}
            </Button>
          ) : null}
          {cancelLabel !== "" && onCancel ? (
            <Button variant="ghost" onClick={onCancel} disabled={busy}>
              {cancelLabel}
            </Button>
          ) : null}
          <span className="di-create-flow-spacer" />
          <Button type="submit" loading={busy} disabled={!canAdvance}>
            {last ? submitLabel : nextLabel}
          </Button>
        </div>
      </div>
    </form>
  );
}
