import { isValidElement, useId, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cx } from "../../../../internal/cx";
import { surfaceClass } from "../../../../internal/surface";
import { takeSlot } from "../../../../internal/slots";
import { Disclosure } from "../../../layout/folding/Disclosure";
import { SealMark } from "../../../marks/status/SealValue";
import { Figure } from "../../figures/Figure";
import "./ProposalPanel.css";

/**
 * What a model proposes, on one surface: why it proposes it, how sure it
 * is, what it matched on and, when it asks for a decision, the question
 * and the actions.
 *
 * Without `ProposalActions` it explains: the answer, the confidence
 * `Figure`, the evidence as a `FactList layout="stacked"`, what was not
 * considered and the caveat, read top to bottom. With `ProposalActions`
 * it asks: the `ProposalQuestion`, the facts the decision rests on (the
 * `FactList`s stay in view), the actions, and the explanation folded
 * under `whyLabel` in the same panel.
 */
export function ProposalPanel({
  label,
  heading = 3,
  whyLabel = "",
  className,
  children,
}: {
  /** The panel's name, a mono label: "Why this was proposed", "Proposed action". */
  label: string;
  /** The heading level of the question, to fit the page's outline. */
  heading?: 2 | 3 | 4;
  /** Names the folded explanation when the panel asks: "Why was this proposed?" */
  whyLabel?: string;
  className?: string;
  /**
   * `ProposalQuestion`, `ProposalAnswer`, a confidence `Figure size="compact"`,
   * `FactList layout="stacked"`, `ProposalIgnored`, `ProposalNote` and
   * `ProposalActions`, placed in that order whatever order they are written in.
   */
  children: ReactNode;
}) {
  const labelId = useId();
  const questionId = useId();
  const [question, afterQuestion] = takeSlot(children, ProposalQuestion);
  const [answer, afterAnswer] = takeSlot(afterQuestion, ProposalAnswer);
  const [figure, afterFigure] = takeSlot(afterAnswer, Figure);
  const [ignored, afterIgnored] = takeSlot(afterFigure, ProposalIgnored);
  const [note, afterNote] = takeSlot(afterIgnored, ProposalNote);
  const [actions, facts] = takeSlot(afterNote, ProposalActions);
  const Question = `h${heading}` as "h2" | "h3" | "h4";
  const asked = question.find(isValidElement) as { props: { children: ReactNode } } | undefined;
  const explanation = [...answer, ...figure];
  const asks = actions.length > 0;
  return (
    <section className={cx(surfaceClass(), "di-proposal", className)} aria-labelledby={asked ? questionId : labelId}>
      <div className="di-proposal-head">
        <p className="di-proposal-label" id={labelId}>
          <SealMark state="inferred" size={7} />
          {label}
        </p>
        {asked ? (
          <Question className="di-proposal-question" id={questionId}>
            {asked.props.children}
          </Question>
        ) : null}
      </div>
      {asks ? (
        <>
          {facts}
          {explanation.length || ignored.length || note.length ? (
            <ProposalWhy label={whyLabel}>
              {explanation}
              {ignored}
              {note}
            </ProposalWhy>
          ) : null}
          {actions}
        </>
      ) : (
        <>
          {explanation}
          {facts}
          {ignored}
          {note}
        </>
      )}
    </section>
  );
}

function ProposalWhy({ label, children }: { label: string; children: ReactNode }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  return (
    <Disclosure id={id} open={open} onOpenChange={setOpen} toggle="head" title={label} className="di-proposal-why">
      <div className="di-proposal-why-body">{children}</div>
    </Disclosure>
  );
}

/** The decision asked for, as a question the primary action answers: "Resume feed.example.io?" */
export function ProposalQuestion({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

/** Why, in one plain sentence: "Proposed because 1,284 entries are queued behind one paused host." */
export function ProposalAnswer({ children }: { children: ReactNode }) {
  return <p className="di-proposal-answer">{children}</p>;
}

/**
 * The inputs the model did not use, folded under one line ("Not
 * considered (2)") and listed plainly when opened. Named, never hidden.
 */
export function ProposalIgnored({ summary, items }: { summary: string; items: string[] }) {
  return (
    <details className="di-proposal-ignored">
      <summary>
        <span>{summary}</span>
        <ChevronDown aria-hidden />
      </summary>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </details>
  );
}

/** The caveat, one quiet line: what this proposal does not account for. A slot, so it can hold a `SealValue`. */
export function ProposalNote({ children }: { children: ReactNode }) {
  return <p className="di-proposal-note">{children}</p>;
}

/** The buttons that commit or refuse: the action asked for is the `primary` (or `danger`) one, Cancel beside it. */
export function ProposalActions({ children }: { children: ReactNode }) {
  return <div className="di-proposal-actions">{children}</div>;
}
