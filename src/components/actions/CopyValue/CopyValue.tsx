import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { cx } from "../../../internal/cx";
import "./CopyValue.css";

/**
 * An identifier someone will paste elsewhere — an id, a key, a URL — with
 * the button that copies it. The value stays selectable text; the button
 * only saves the selection. `copiedLabel` is announced and shown briefly.
 */
export function CopyValue({
  value,
  copyLabel,
  copiedLabel,
  mono = true,
  className,
}: {
  value: string;
  /** The button's accessible name, e.g. "Copy organization ID". */
  copyLabel: string;
  /** Said once the value is on the clipboard, e.g. "Copied". */
  copiedLabel: string;
  /** Identifiers run in the mono track. */
  mono?: boolean;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(timer);
  }, [copied]);

  const copy = () => {
    void navigator.clipboard?.writeText(value).then(() => setCopied(true));
  };

  return (
    <span className={cx("di-copy", className)}>
      <span className={cx("di-copy-value", mono && "di-mono")}>{value}</span>
      <button type="button" className="di-copy-button" aria-label={copyLabel} title={copyLabel} onClick={copy}>
        {copied ? <Check aria-hidden /> : <Copy aria-hidden />}
      </button>
      <span className="di-sr" aria-live="polite">
        {copied ? copiedLabel : ""}
      </span>
    </span>
  );
}
