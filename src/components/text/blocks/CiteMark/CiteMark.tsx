import "./CiteMark.css";

/**
 * A citation in running text: a small raised number that leads to its
 * entry in a `SourceList`.
 *
 * **When to use:** in `Prose`, after the claim a source backs. **When not
 * to:** a link a reader follows to read on (`TextLink`).
 *
 * **Anatomy:** the number in the code face, raised and muted; nothing in
 * the sentence is underlined. Hover and focus underline the number.
 *
 * **Accessibility:** `label` names the source ("Source 2: CISA"), because
 * a bare number says nothing read aloud.
 */
export function CiteMark({ n, href, label }: { n: number; href: string; label: string }) {
  return (
    <a className="di-cite-mark" href={href} aria-label={label}>
      {n}
    </a>
  );
}
