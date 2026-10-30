import { cx } from "../../../../internal/cx";
import "./CodeBlock.css";

/**
 * A record as the machine wrote it: a raw JSON row, a log line, a
 * configuration.
 *
 * **When to use:** to show a payload or a log line exactly, for checking or
 * copying, usually under a record's facts or in a dialog. **When not to:**
 * an identifier in a line (`CopyValue`, or the mono track); the facts a
 * person reads (`FactList`); a key (`Kbd`).
 *
 * **Anatomy:** one framed block of mono text.
 *
 * **States:** long content scrolls inside the frame up to
 * `--di-codeblock-max-h`; long lines wrap, so nothing is cut.
 *
 * **Content:** the text as it was received, pretty-printed when it is JSON;
 * `label` names it ("Raw record").
 *
 * **Accessibility:** a named region with a tab stop, so it can be reached
 * and scrolled from the keyboard.
 */
export function CodeBlock({ label, className, children }: { label: string; className?: string; children: string }) {
  return (
    <div className={cx("di-codeblock", className)}>
      <pre className="di-codeblock-scroll" tabIndex={0} role="region" aria-label={label}>
        <code className="di-codeblock-code">{children}</code>
      </pre>
    </div>
  );
}
