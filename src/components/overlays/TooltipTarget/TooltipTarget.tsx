import { useId } from "react";
import { cx } from "../../../internal/cx";
import { Tooltip } from "../Tooltip";
import "./TooltipTarget.css";

/**
 * A term that names itself on hover and on keyboard focus: a code, an id,
 * an abbreviation. The term inherits the type it sits in, so an id in a
 * mono cell stays mono.
 *
 * Drawn by `Tooltip`, so the label opens in the top layer, a table's scroll
 * frame does not clip it, and Escape closes it. A screen reader hears the
 * label as the term's description. It is never the only place the fact
 * lives: the screen spells the term out somewhere a reader reaches without
 * hovering.
 */
export function TooltipTarget({
  text,
  label,
  className,
}: {
  /** The term as written. */
  text: string;
  /** What the term means. */
  label: string;
  className?: string;
}) {
  const id = useId();
  return (
    <>
      <Tooltip label={label}>
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- focus opens the label, as hover does (WCAG 1.4.13) */}
        <span className={cx("di-tooltip-target", className)} tabIndex={0} aria-describedby={id}>
          {text}
        </span>
      </Tooltip>
      <span id={id} hidden>
        {label}
      </span>
    </>
  );
}
