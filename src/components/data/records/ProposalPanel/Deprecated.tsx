import type { ReactNode } from "react";
import { takeSlot } from "../../../../internal/slots";
import { TextLink } from "../../../navigation/TextLink";
import { Fact, FactList } from "../FactList";
import { Figure } from "../../figures/Figure";
import {
  ProposalActions,
  ProposalAnswer,
  ProposalIgnored,
  ProposalNote,
  ProposalPanel,
  ProposalQuestion,
} from "./ProposalPanel";

/** @deprecated Use `ProposalPanel` with `ProposalAnswer`, a `Figure`, `FactList layout="stacked"`, `ProposalIgnored` and `ProposalNote`. Removed in 0.12. */
export function ExplainPanel({
  label,
  answer,
  confidenceLabel = "",
  confidence = "",
  confidenceWord = "",
  className,
  children,
}: {
  label: string;
  answer: string;
  confidenceLabel?: string;
  confidence?: string;
  confidenceWord?: string;
  className?: string;
  children?: ReactNode;
}) {
  const [ignored, rest] = takeSlot(children, ProposalIgnored);
  const [note, rows] = takeSlot(rest, ProposalNote);
  return (
    <ProposalPanel label={label} className={className}>
      <ProposalAnswer>{answer}</ProposalAnswer>
      {confidenceLabel && confidence ? (
        <Figure size="compact" label={confidenceLabel} value={confidence}>
          {confidenceWord || undefined}
        </Figure>
      ) : null}
      {rows.length ? <FactList layout="stacked">{rows}</FactList> : null}
      {ignored}
      {note}
    </ProposalPanel>
  );
}

/** @deprecated Use `Fact` inside `FactList layout="stacked"`. Removed in 0.12. */
export const ExplainRow = Fact;

/** @deprecated Use `ProposalIgnored`. Removed in 0.12. */
export const ExplainIgnored = ProposalIgnored;

/** @deprecated Use `ProposalNote`. Removed in 0.12. */
export const ExplainFooter = ProposalNote;

/** @deprecated Use `ProposalActions`. Removed in 0.12. */
export const ConfirmActions = ProposalActions;

/**
 * @deprecated Use `ProposalPanel` with `ProposalQuestion`, a `FactList`, `ProposalActions` and the explanation
 * folded under `whyLabel`. Removed in 0.12.
 */
export function ConfirmPanel({
  label,
  question,
  whyLabel,
  onWhy,
  heading = 3,
  className,
  children,
}: {
  label: string;
  question: string;
  whyLabel: string;
  onWhy: () => void;
  heading?: 2 | 3 | 4;
  className?: string;
  children: ReactNode;
}) {
  const [actions, rows] = takeSlot(children, ProposalActions);
  return (
    <ProposalPanel label={label} heading={heading} className={className}>
      <ProposalQuestion>{question}</ProposalQuestion>
      <FactList layout="stacked">{rows}</FactList>
      <ProposalActions>
        <TextLink className="di-proposal-why-link" onClick={onWhy}>
          {whyLabel}
        </TextLink>
        {actions.map((a) => (a as { props: { children: ReactNode } }).props.children)}
      </ProposalActions>
    </ProposalPanel>
  );
}
