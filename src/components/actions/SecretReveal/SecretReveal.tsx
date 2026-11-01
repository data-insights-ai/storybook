import { Check, Copy } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { Button } from "../Button";
import "./SecretReveal.css";

/**
 * A secret shown once — an API key, an enrollment token — right after it is
 * made: why to copy it now, the whole value in a box of its own, and the one
 * button that copies it. The value reads left to right and stays selectable;
 * the button says it is copied for a moment.
 *
 * **When to use:** the answer that carries a secret the server will not show
 * again. **When not to:** a value that can be read again later (`CopyValue`).
 *
 * **Content:** `title` says what to do ("Copy the key now"), `body` why
 * ("This is the only time the key is shown…").
 *
 * **Accessibility:** the box is named by `label`; the copied word is read
 * from a polite live region.
 */
export function SecretReveal({
  title,
  body,
  label,
  value,
  copyLabel,
  copiedLabel,
}: {
  title: string;
  body: string;
  /** What the value is, such as "API key". */
  label: string;
  value: string;
  /** The button, such as "Copy key". */
  copyLabel: string;
  /** Said and shown once the value is on the clipboard, such as "Copied". */
  copiedLabel: string;
}) {
  const [copied, setCopied] = useState(false);
  const id = useId();

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(timer);
  }, [copied]);

  return (
    <section className="di-secret" aria-labelledby={id}>
      <h3 id={id} className="di-secret-title">
        {title}
      </h3>
      <p className="di-secret-body">{body}</p>
      <code className="di-secret-value" aria-label={label} dir="ltr">
        {value}
      </code>
      <Button variant="primary" onClick={() => void navigator.clipboard?.writeText(value).then(() => setCopied(true))}>
        {copied ? <Check aria-hidden /> : <Copy aria-hidden />}
        {copied ? copiedLabel : copyLabel}
      </Button>
      <span className="di-sr" aria-live="polite">
        {copied ? copiedLabel : ""}
      </span>
    </section>
  );
}
