import { Fragment, type CSSProperties } from "react";
import { cx } from "../../../../internal/cx";
import { useScrollEdges } from "../../../../internal/useScrollEdges";
import "./CodeBlock.css";

/**
 * A record as the machine wrote it: a raw JSON row, a log, a configuration.
 *
 * **When to use:** to show a payload or a log exactly, for checking or
 * copying, usually under a record's facts or in a dialog. **When not to:**
 * an identifier in a line (`CopyValue`, or the mono track); the facts a
 * person reads (`FactList`); a key (`Kbd`).
 *
 * **Anatomy:** one framed block of mono text.
 *
 * **Variants:** `variant="record"` (the default) is read whole, so its long
 * lines wrap: a wrapped line hangs two characters in from its own indent and
 * breaks at a space or after a backslash, a slash, a comma, a colon or an
 * equals sign, never inside a word unless the word alone is wider than the block.
 * `variant="log"` is scanned down its line starts, so its lines never wrap
 * (a continuation would read as a new entry): the block scrolls sideways and
 * the edge that hides text fades.
 *
 * **States:** long content scrolls inside the frame up to
 * `--di-codeblock-max-h`.
 *
 * **Content:** the text as it was received, pretty-printed when it is JSON;
 * `label` names it ("Raw record").
 *
 * **Accessibility:** a named region with a tab stop, so it can be reached
 * and scrolled from the keyboard.
 */
export function CodeBlock({
  label,
  variant = "record",
  className,
  children,
}: {
  label: string;
  /** `record` wraps with a hanging indent; `log` keeps each line on one row and scrolls sideways. */
  variant?: "record" | "log";
  className?: string;
  children: string;
}) {
  const [scroll, edges] = useScrollEdges<HTMLPreElement>();
  const log = variant === "log";
  return (
    <div className={cx("di-codeblock", log && "is-log", className)}>
      <pre
        ref={scroll}
        className={cx("di-codeblock-scroll", edges.start && "is-more-start", edges.end && "is-more-end")}
        tabIndex={0}
        role="region"
        aria-label={label}
      >
        <code className="di-codeblock-code">{log ? children : children.split("\n").map(line)}</code>
      </pre>
    </div>
  );
}

const breakAfter = /([\\/,:;=&?]+)/;

function line(text: string, index: number) {
  const indent = text.length - text.trimStart().length;
  return (
    <span key={index} className="di-codeblock-line" style={{ "--di-codeblock-indent": indent } as CSSProperties}>
      {text.split(breakAfter).map((part, i) => (
        <Fragment key={i}>
          {part}
          {i % 2 === 1 ? <wbr /> : null}
        </Fragment>
      ))}
    </span>
  );
}
