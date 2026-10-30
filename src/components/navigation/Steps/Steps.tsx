import { Children, createContext, isValidElement, useContext, type ReactElement, type ReactNode } from "react";
import { Check } from "lucide-react";
import { cx } from "../../../internal/cx";
import { takeSlot } from "../../../internal/slots";
import { surfaceClass } from "../../../internal/surface";
import "./Steps.css";

export type StepState = "done" | "current" | "upcoming";
export type StepsVariant = "progress" | "cards" | "list";

export type StepTone = "warn";

type StepsConfig = {
  variant: StepsVariant;
  heading: 2 | 3 | 4;
  stateLabels?: { done: string; current: string; upcoming: string };
  onStep?: (index: number) => void;
};

const Config = createContext<StepsConfig>({ variant: "list", heading: 3 });
const Position = createContext(0);

/**
 * The steps of one bounded process, in order: where a reader is in a flow,
 * what a set-up guide asks them to do, or how a pipeline runs.
 *
 * **When to use:** a flow of a few steps with one current step
 * (`variant="progress"`, as `CreateFlow` renders it), instructions the
 * reader carries out in order (`"list"`), the stages of a process explained
 * on an overview (`"cards"`).
 *
 * **When not to:** places to go (`Sidebar`, `TabNav`), views of one record
 * (`Tabs`), pages of one list (`Pagination`), items whose order means
 * nothing (a `Stack` or a `FactList`: never a number to fill a rail).
 *
 * **Anatomy:** an ordered list of `Step`s. A step has its ordinal, a
 * `title`, an optional body (its children), and in a card a `StepIcon` and
 * a `StepFooter`.
 *
 * **Variants:**
 * - `progress`: a bullet per step (its number, a check when done, filled when
 *   current) with the title under it (`layout="spread"`) or beside it
 *   (`layout="inline"`, from the left edge, for a wide page). With
 *   `onStep`, a done step is a button that returns to it.
 * - `list`: each step a row with its ordinal beside the body; `tone="tonal"`
 *   gives each its own inset ground (a section of a page), `"ruled"` sets
 *   them as ruled rows inside a surface.
 * - `cards`: each step a surface in a row that wraps; the current one runs
 *   on navy.
 *
 * **States:** each `Step` is `done`, `current` or `upcoming`. In `progress`
 * every step has one; in `list` and `cards` it is optional and only
 * `current` changes the look. A step that lags or waits on something takes
 * `tone="warn"`: an amber edge, never the current step's fill, and its
 * words (a `StatusPill` in the footer) say why.
 *
 * **Content:** a title is a verb and its object in two or three words in
 * `progress` ("Connect source"), one instruction in `list`, a noun in
 * `cards`. On a narrow page `progress` keeps its bullets on one line and
 * sets the current step under them, from the track's start edge, as its
 * position and title ("Step 3 of 4 · Seal", or "3/4 · Seal" without
 * `stepOf`), so the title is never read as the first bullet's.
 *
 * **Accessibility:** an `ol` named by `label`; the current step carries
 * `aria-current="step"`, and in `progress` each state is read as its word
 * from `stateLabels`. The visible ordinal is not read twice: the list
 * already counts.
 */
export function Steps({
  label,
  variant = "progress",
  layout = "spread",
  tone = "tonal",
  heading = 3,
  stateLabels,
  stepOf,
  onStep,
  className,
  children,
}: {
  /** Names the list, e.g. "Source registration". */
  label?: string;
  variant?: StepsVariant;
  /** `progress` only: `spread` spans the width, `inline` runs from the left edge in one line. */
  layout?: "spread" | "inline";
  /** `list` only: `tonal` gives each step an inset ground, `ruled` sets rows with a rule between them. */
  tone?: "tonal" | "ruled";
  /** `cards` only: the level of each card's title. */
  heading?: 2 | 3 | 4;
  /** The word each state is announced as. Needed for `progress`. */
  stateLabels?: { done: string; current: string; upcoming: string };
  /** `progress` only: the current step's position in words under a narrow track, e.g. "Step 3 of 4"; "3/4" when left out. */
  stepOf?: (position: number, total: number) => string;
  /** `progress` only: called with a done step's index when it is pressed. */
  onStep?: (index: number) => void;
  className?: string;
  /** `Step`s, in order. */
  children: ReactNode;
}) {
  let position = 0;
  const steps = Children.map(children, (child) => {
    if (!isValidElement(child)) return child;
    return <Position.Provider value={position++}>{child}</Position.Provider>;
  });
  const all = Children.toArray(children).filter((child): child is ReactElement<{ state?: StepState; title?: string }> =>
    isValidElement<{ state?: StepState; title?: string }>(child),
  );
  const at = variant === "progress" ? all.findIndex((child) => child.props.state === "current") : -1;
  const now = at >= 0 ? all[at].props.title : undefined;
  return (
    <Config.Provider value={{ variant, heading, stateLabels, onStep }}>
      <ol
        className={cx("di-steps", className)}
        data-variant={variant}
        data-layout={variant === "progress" ? layout : undefined}
        data-tone={variant === "list" ? tone : undefined}
        aria-label={label}
      >
        {steps}
        {/* The current title again, under the track on a narrow page; the step itself is what a screen reader hears. */}
        {now ? (
          <li className="di-steps-now" aria-hidden>
            <span className="di-steps-now-position">
              {stepOf ? stepOf(at + 1, all.length) : `${at + 1}/${all.length}`}
            </span>
            <span className="di-steps-now-title">{now}</span>
          </li>
        ) : null}
      </ol>
    </Config.Provider>
  );
}

/**
 * One step of a `Steps`. `index` replaces the counted ordinal where the
 * process numbers its own steps ("Stage 2"); `title` names the step; the
 * children are its body, and in `cards` a `StepIcon` and a `StepFooter`.
 */
export function Step({
  state,
  tone,
  index,
  title,
  children,
}: {
  state?: StepState;
  /** `warn`: the step lags or waits on something; its words go in the body or footer. */
  tone?: StepTone;
  /** The ordinal shown; counted from 1 when left out. */
  index?: string;
  title?: string;
  children?: ReactNode;
}) {
  const { variant, heading, stateLabels, onStep } = useContext(Config);
  const position = useContext(Position);
  const current = state === "current";
  const shown = index ?? (variant === "progress" ? String(position + 1) : String(position + 1).padStart(2, "0"));

  if (variant === "progress") {
    const settled = state ?? "upcoming";
    const inner = (
      <>
        <span className={cx("di-step-bullet", `is-${settled}`)} aria-hidden>
          {settled === "done" ? <Check className="di-step-check" /> : <span className="di-ordinal">{shown}</span>}
        </span>
        <span className={cx("di-step-label", `is-${settled}`)}>{title}</span>
        {stateLabels ? <span className="di-sr">{stateLabels[settled]}</span> : null}
      </>
    );
    return (
      <li className={cx("di-step", tone && `is-${tone}`)} aria-current={current ? "step" : undefined}>
        {onStep && settled === "done" ? (
          <button type="button" className="di-step-button" onClick={() => onStep(position)}>
            {inner}
          </button>
        ) : (
          <span className="di-step-button">{inner}</span>
        )}
      </li>
    );
  }

  const [icon, rest] = takeSlot(children, StepIcon);
  const [footer, body] = takeSlot(rest, StepFooter);
  const hasBody = Children.toArray(body).length > 0;

  if (variant === "cards") {
    const Title = `h${heading}` as const;
    return (
      <li
        className={cx(surfaceClass({ padded: false }), "di-step-card", current && "is-current", tone && `is-${tone}`)}
        aria-current={current ? "step" : undefined}
      >
        <div className="di-step-card-head">
          {icon}
          <span className="di-step-card-index di-ordinal" aria-hidden>
            {shown}
          </span>
        </div>
        {title ? <Title className="di-step-card-title">{title}</Title> : null}
        {hasBody ? <div className="di-step-body">{body}</div> : null}
        {footer}
      </li>
    );
  }

  return (
    <li
      className={cx("di-step-row", current && "is-current", tone && `is-${tone}`)}
      aria-current={current ? "step" : undefined}
    >
      <span className="di-step-row-index di-ordinal" aria-hidden>
        {shown}
      </span>
      <div className="di-step-row-body">
        {title ? <span className="di-step-row-title">{title}</span> : null}
        {body}
      </div>
    </li>
  );
}

/** A card's mark, at the start of its head. */
export function StepIcon({ children }: { children: ReactNode }) {
  return <span className="di-step-icon">{children}</span>;
}

/**
 * A card's closing line: what the step costs or what it waits on. It is a
 * slot, so it holds a `SealValue`, a `StatusPill` or a `Loading` as readily
 * as a word.
 */
export function StepFooter({ children }: { children: ReactNode }) {
  return <div className="di-step-footer">{children}</div>;
}
