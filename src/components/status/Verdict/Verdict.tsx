import type { ReactNode } from "react";
import { surfaceClass } from "../../../internal/surface";
import "./Verdict.css";

/**
 * What is going on and what to do, before anything else on a record's
 * page: its state, one sentence in the display face, and the summary.
 *
 * **When to use:** once, at the top of a page that answers "does this need
 * me": an advisory, a briefing, a finding. **When not to:** a status beside
 * a title (`StatusPill`); a message about the page (`Notice`).
 *
 * **Anatomy:** a surface with the gold edge when it is the one thing that
 * matters (`emphasis`); `VerdictStatus` (a `StatusPill`), `VerdictLine`
 * (the sentence, measured to 40ch), then `VerdictBody`.
 *
 * **Content:** the sentence is built from facts, not written: what is known
 * ("Exploited since 20 Oct 2026.") and the one action ("Update to 4.2.1.").
 */
export function Verdict({
  emphasis = false,
  label,
  children,
}: {
  emphasis?: boolean;
  /** Names the verdict for assistive technology, which then lists it as a region. */
  label?: string;
  children: ReactNode;
}) {
  return (
    <section className={surfaceClass({ edge: emphasis ? "one" : "none" }) + " di-verdict"} aria-label={label}>
      {children}
    </section>
  );
}

/** The state, as a `StatusPill`. */
export function VerdictStatus({ children }: { children: ReactNode }) {
  return <div className="di-verdict-status">{children}</div>;
}

/** The one sentence: what is known and what to do. It may hold `code`. */
export function VerdictLine({ children }: { children: ReactNode }) {
  return <p className="di-verdict-line">{children}</p>;
}

/** The summary under the sentence. */
export function VerdictBody({ children }: { children: ReactNode }) {
  return <div className="di-verdict-body">{children}</div>;
}
