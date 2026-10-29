import { Children, isValidElement, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cx } from "../../../../internal/cx";
import "./Disclosure.css";

/**
 * A group that folds away. The head holds a `DisclosureLead` (a heading,
 * or the checkbox that chooses the whole group), a short count, and the
 * toggle; every other child is the body. The toggle is its own button, so
 * a control in the lead stays a control and is not swallowed by a summary
 * element.
 */
export function Disclosure({
  id,
  meta = "",
  open,
  onOpenChange,
  toggleLabel,
  children,
  className,
}: {
  id: string;
  /** A count or state beside the lead, such as "3 of 8". */
  meta?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Names the toggle for a screen reader, such as "Show access events". */
  toggleLabel: string;
  children: ReactNode;
  className?: string;
}) {
  const lead: ReactNode[] = [];
  const body: ReactNode[] = [];
  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.type === DisclosureLead) lead.push(child);
    else body.push(child);
  });
  const bodyId = `${id}-body`;
  return (
    <section className={cx("di-disclosure", open && "is-open", className)}>
      <div className="di-disclosure-head">
        {lead}
        {meta === "" ? null : <span className="di-disclosure-meta">{meta}</span>}
        <button
          type="button"
          className="di-disclosure-toggle"
          aria-expanded={open}
          aria-controls={bodyId}
          aria-label={toggleLabel}
          onClick={() => onOpenChange(!open)}
        >
          <ChevronDown aria-hidden />
        </button>
      </div>
      <div id={bodyId} className="di-disclosure-body" hidden={!open}>
        {body}
      </div>
    </section>
  );
}

/** What heads the group: a title, or the box that chooses all of it. */
export function DisclosureLead({ children }: { children: ReactNode }) {
  return <div className="di-disclosure-lead">{children}</div>;
}
