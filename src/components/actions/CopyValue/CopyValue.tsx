import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { addressBreaks } from "../../../internal/addressBreaks";
import { cx } from "../../../internal/cx";
import "./CopyValue.css";

/**
 * An identifier someone will paste elsewhere — an id, a key, a URL — with
 * the button that copies it. The value stays selectable text; the button
 * only saves the selection. `copiedLabel` is announced, and the icon turns
 * to a check for a moment.
 *
 * **When to use:** a value a person copies: an organization id, a webhook
 * URL, a key fingerprint. **When not to:** a value nobody pastes (plain
 * text or `Fact mono`); a secret shown once (a field with its own reveal).
 *
 * **Content:** the whole value, never cut. A long one wraps only at its
 * boundaries (after "//", before "/", ".", "-", "?", "&", "="), so no word
 * of a URL is split; a run with no boundary, such as a hash, wraps where it
 * must.
 *
 * **Accessibility:** the button is named by `copyLabel`; the copied word is
 * read from a polite live region. On a touch screen its hit area is 40px.
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
      <span className={cx("di-copy-value", mono && "di-mono")}>{addressBreaks(value)}</span>
      <button type="button" className="di-copy-button" aria-label={copyLabel} title={copyLabel} onClick={copy}>
        {copied ? <Check aria-hidden /> : <Copy aria-hidden />}
      </button>
      <span className="di-sr" aria-live="polite">
        {copied ? copiedLabel : ""}
      </span>
    </span>
  );
}
