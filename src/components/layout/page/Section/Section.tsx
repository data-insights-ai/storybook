import { useId, type ReactNode } from "react";
import "./Section.css";

type Level = 2 | 3 | 4 | 5 | 6;

/**
 * A titled part of a surface: its heading, then what it holds, with no
 * frame of its own.
 *
 * **When to use:** the parts of a panel, a sheet or a reading page that each
 * need a name in the outline: a record's evidence, the next steps of a
 * briefing, a group of results. **When not to:** a block on the page's
 * ground (`Panel`); a section of a screen, over panels
 * (`PageHeader level={2}`); a part a reader folds away (`Disclosure`); a
 * part edited in place (`DetailSection`).
 *
 * **Anatomy:** the title in the display face at the block size, then the
 * children, 12px under it and 12px apart. Sections in a `Stack` stand apart
 * by its gap, never by a rule.
 *
 * **Accessibility:** a `section` named by its heading, at `heading`, the
 * level the page's outline asks for under what holds it. With `id` the
 * heading carries it and takes focus from a script (`tabIndex={-1}`), so a
 * link to the part or the end of a flow can move the reader there.
 */
export function Section({
  title,
  heading = 3,
  id,
  lang,
  children,
}: {
  title: string;
  /** The heading's level in the page's outline. */
  heading?: Level;
  /** The heading's id, for a link to it or for moving focus there. */
  id?: string;
  /** The section's language, when it is not the page's. */
  lang?: string;
  children: ReactNode;
}) {
  const own = useId();
  const titleId = id ?? own;
  const Heading = `h${heading}` as const;
  return (
    <section className="di-section" aria-labelledby={titleId} lang={lang}>
      <Heading id={titleId} className="di-section-title" tabIndex={id === undefined ? undefined : -1}>
        {title}
      </Heading>
      {children}
    </section>
  );
}
