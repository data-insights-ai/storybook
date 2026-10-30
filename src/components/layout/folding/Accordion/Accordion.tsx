import type { ReactNode } from "react";
import { Disclosure, DisclosureDetail, DisclosureGroup, DisclosureMeta } from "../Disclosure";

/**
 * A list of groups read by their heads.
 *
 * @deprecated Removed in 0.12. Use `DisclosureGroup` with a `Disclosure toggle="head"` per group: the same
 * head-as-button, one chevron, one fold.
 */
export function Accordion({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <DisclosureGroup label={label} className={className}>
      {children}
    </DisclosureGroup>
  );
}

/**
 * One group of an `Accordion`.
 *
 * @deprecated Removed in 0.12. Use `<Disclosure toggle="head" title open onOpenChange headingLevel>`.
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
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  children?: ReactNode;
}) {
  return (
    <Disclosure toggle="head" title={title} open={open} onOpenChange={onOpenChange} headingLevel={headingLevel}>
      {children}
    </Disclosure>
  );
}

/** @deprecated Removed in 0.12. Use `DisclosureDetail`. */
export const AccordionDetail = DisclosureDetail;

/** @deprecated Removed in 0.12. Use `DisclosureMeta`. */
export const AccordionMeta = DisclosureMeta;
