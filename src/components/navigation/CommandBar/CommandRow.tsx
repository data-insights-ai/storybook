import { useId, type ReactNode } from "react";
import { cx } from "../../../internal/cx";
import { SealMark } from "../../marks/status/SealValue";
import { useCommandHighlight } from "./commandList";

/**
 * A labelled set of `CommandRow`s inside a `CommandBar`, announced as a
 * group named by `label`, which is shown above the rows.
 */
export function CommandGroup({ label, children }: { label: string; children: ReactNode }) {
  const id = useId();
  return (
    <div className="di-command-group" role="group" aria-labelledby={id}>
      <p id={id} className="di-command-group-label" role="presentation">
        {label}
      </p>
      {children}
    </div>
  );
}

/**
 * One option the bar offers: an option of its listbox, drawn as the shared
 * popup row (`.di-option`). The arrow keys in the field and the pointer move
 * the highlight; Enter or a click calls `onSelect`. `inferred` swaps the icon
 * for the hollow ring: a model proposed this, and it has not been sealed. An
 * inferred row is an answer, a sentence: its note goes under it, so it stays
 * with the words it qualifies when they wrap.
 */
export function CommandRow({
  label,
  meta,
  inferred = false,
  onSelect,
  children,
}: {
  /** What the row offers. A long answer wraps rather than being cut. */
  label: string;
  /** The trailing note: a shortcut, a count, a source. */
  meta: string;
  inferred?: boolean;
  onSelect: () => void;
  /** The leading icon, as `Button` takes it. Ignored when `inferred`. */
  children?: ReactNode;
}) {
  const id = useId();
  const highlight = useCommandHighlight();
  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events -- keys reach the option through the field (aria-activedescendant), as the combobox pattern asks
    <div
      id={id}
      role="option"
      aria-selected={false}
      tabIndex={-1}
      className={cx("di-option", "di-command-row")}
      onMouseMove={() => highlight(id)}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onSelect}
    >
      <span className="di-command-row-icon" aria-hidden>
        {inferred ? <SealMark state="inferred" size={7} /> : children}
      </span>
      {inferred ? (
        <span className="di-command-answer">
          <span className="di-option-label">{label}</span>
          <span className="di-option-meta">{meta}</span>
        </span>
      ) : (
        <>
          <span className="di-option-label">{label}</span>
          <span className="di-option-meta">{meta}</span>
        </>
      )}
    </div>
  );
}

/**
 * What the bar says when a query matched nothing, in place of the rows. It
 * is announced as a status, so a screen reader hears that the list is empty.
 */
export function CommandEmpty({ children }: { children: string }) {
  return <p className="di-command-empty">{children}</p>;
}
