import type { ReactNode } from "react";
import "./Prose.css";

/**
 * Running text set for reading: an article, a briefing, a long help page.
 *
 * **When to use:** text a person reads from top to bottom, several
 * paragraphs with headings and lists. **When not to:** a short note under a
 * control (body text as it is); one sentence lifted out (`PullQuote`).
 *
 * **Anatomy:** 16px body at the body leading, measured to about 68
 * characters; an `h2` or `h3` in the display face with space above it and
 * no rule; lists with an indent; a `blockquote`, a passage quoted from a
 * source, set in by a hairline; `code` in the code face. `ProseLede` is
 * the opening paragraph at 18px.
 *
 * **Content:** paragraphs, headings, lists and inline code as children;
 * citations as `CiteMark`. Set `lang` on it when its language is not the
 * page's.
 */
export function Prose({ lang, children }: { lang?: string; children: ReactNode }) {
  return (
    <div className="di-prose" lang={lang}>
      {children}
    </div>
  );
}

/** The opening of a `Prose`: the summary a reader takes in first, at 18px. */
export function ProseLede({ children }: { children: ReactNode }) {
  return <div className="di-prose-lede">{children}</div>;
}
