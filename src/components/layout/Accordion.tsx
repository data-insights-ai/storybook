import { Children, isValidElement, useId, type ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { cx } from "../../cx";
import "./Accordion.css";

/**
 * A list of groups read by their heads, each opened on demand: what a
 * group is, when, and how much, on one row, the detail under it. The whole
 * head is the toggle, so the target is the row a reader is looking at, not
 * a chevron at its edge. Open groups are the caller's state; a group folds
 * open and shut on its own, so no caller animates it.
 *
 * Unlike `Disclosure`, the head holds nothing that acts; a group that has
 * to be chosen as a whole stays a `Disclosure`.
 */
export function Accordion({
  label,
  children,
  className,
}: {
  /** The accessible name of the list, such as "Signals by attack phase". */
  label: string;
  /** `AccordionItem`s. */
  children: ReactNode;
  className?: string;
}) {
  return (
    <ul className={cx("di-accordion", className)} aria-label={label}>
      {children}
    </ul>
  );
}

/**
 * One group. `AccordionDetail` and `AccordionMeta` are picked out of the
 * children for the head; every other child is the body.
 */
export function AccordionItem({
  title,
  open,
  onOpenChange,
  headingLevel = 2,
  children,
}: {
  title: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The level the heads take in the page's outline. */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  /** `AccordionDetail`, `AccordionMeta`, then the body. */
  children?: ReactNode;
}) {
  const id = useId();
  const head: ReactNode[] = [];
  const meta: ReactNode[] = [];
  const body: ReactNode[] = [];
  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.type === AccordionDetail) head.push(child);
    else if (isValidElement(child) && child.type === AccordionMeta) meta.push(child);
    else body.push(child);
  });
  const Heading = `h${headingLevel}` as const;
  return (
    <li className={cx("di-accordion-item", open && "is-open")}>
      <Heading className="di-accordion-heading">
        <button
          type="button"
          className="di-accordion-toggle"
          aria-expanded={open}
          aria-controls={`${id}-body`}
          onClick={() => onOpenChange(!open)}
        >
          <ChevronRight className="di-accordion-chevron" aria-hidden />
          <span id={`${id}-title`} className="di-accordion-title">
            {title}
          </span>
          {head}
          {meta}
        </button>
      </Heading>
      {/* Kept mounted while closed, so the fold runs both ways; CSS takes it out of reach once folded. */}
      <div
        id={`${id}-body`}
        className="di-accordion-fold"
        role="region"
        aria-labelledby={`${id}-title`}
      >
        <div className="di-accordion-clip">
          <div className="di-accordion-body">{body}</div>
        </div>
      </div>
    </li>
  );
}

/** Under the title, in the mono track: a code, a time range. */
export function AccordionDetail({ children }: { children: ReactNode }) {
  return <span className="di-accordion-detail">{children}</span>;
}

/** At the end of the head: how much the group holds and its worst state, such as a pill and a count. */
export function AccordionMeta({ children }: { children: ReactNode }) {
  return <span className="di-accordion-meta">{children}</span>;
}
