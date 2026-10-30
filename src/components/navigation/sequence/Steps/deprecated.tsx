import { createContext, useContext, type ReactNode } from "react";
import { Step, StepFooter, StepIcon, Steps } from "./Steps";

/**
 * @deprecated Use `<Steps variant="progress" label stateLabels onStep layout>` with one
 * `<Step state title>` per step. Removed in 0.12.
 */
export function Stepper({
  label,
  steps,
  stateLabels,
  onStep,
  layout = "spread",
  className,
}: {
  label: string;
  steps: { label: string; state: "done" | "current" | "upcoming" }[];
  stateLabels: { done: string; current: string; upcoming: string };
  onStep?: (index: number) => void;
  layout?: "spread" | "inline";
  className?: string;
}) {
  return (
    <Steps
      variant="progress"
      label={label}
      layout={layout}
      stateLabels={stateLabels}
      onStep={onStep}
      className={className}
    >
      {steps.map((step) => (
        <Step key={step.label} state={step.state} title={step.label} />
      ))}
    </Steps>
  );
}

/**
 * @deprecated Use `<Steps variant="list" tone="tonal">` (`variant="step"`) or
 * `tone="ruled"` (`variant="row"`) with one `<Step index>` per item. Removed in 0.12.
 */
export function Numbered({
  index,
  variant = "step",
  children,
}: {
  index: string;
  variant?: "step" | "row";
  children: ReactNode;
}) {
  return (
    <Steps variant="list" tone={variant === "row" ? "ruled" : "tonal"}>
      <Step index={index}>{children}</Step>
    </Steps>
  );
}

const InTrack = createContext(false);

/** @deprecated Use `<Steps variant="cards">`. Removed in 0.12. */
export function StageTrack({ children }: { children: ReactNode }) {
  return (
    <InTrack.Provider value={true}>
      <Steps variant="cards">{children}</Steps>
    </InTrack.Provider>
  );
}

/** @deprecated Use `<Step index title state="current">` inside `<Steps variant="cards">`. Removed in 0.12. */
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
  children?: ReactNode;
}) {
  const inTrack = useContext(InTrack);
  const card = (
    <Step index={step} title={title} state={current ? "current" : undefined}>
      {body}
      {children}
    </Step>
  );
  return inTrack ? card : <Steps variant="cards">{card}</Steps>;
}

/** @deprecated Use `StepIcon`. Removed in 0.12. */
export const StageIcon = StepIcon;

/** @deprecated Use `StepFooter`. Removed in 0.12. */
export const StageFooter = StepFooter;
