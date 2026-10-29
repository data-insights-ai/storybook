import { cx } from "../../../../cx";
import "./CodeBlock.css";

/**
 * A record as the machine wrote it: a raw JSON row, a log line, a
 * configuration. Mono, wrapped so nothing is cut, scrolled inside its own
 * frame when long; the frame is a named region so it can be reached from
 * the keyboard.
 */
export function CodeBlock({ label, className, children }: { label: string; className?: string; children: string }) {
  return (
    <pre className={cx("di-codeblock", className)} tabIndex={0} role="region" aria-label={label}>
      {children}
    </pre>
  );
}
