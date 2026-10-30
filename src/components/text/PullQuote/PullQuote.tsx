import type { ReactNode } from "react";
import "./PullQuote.css";

/**
 * One sentence, lifted out of a brand page and set at the display tier.
 *
 * **When to use:** once on a brand page, between paragraphs, for the
 * sentence the page is about. **When not to:** a product screen; a quote
 * with a byline (a testimonial, a different claim); a message
 * (`Notice`).
 *
 * **Anatomy:** a hairline down its left edge and the sentence, italic at the
 * top of the type ramp, measured to 16em so the line breaks where the
 * sentence does. No quote glyph, no gold, no card: anything drawn around it
 * would be a second claim. There is no attribution slot.
 *
 * **Content:** one short sentence, four to ten words.
 *
 * **Accessibility:** a native `<blockquote>`; set `lang` on the page so long
 * words hyphenate.
 */
export function PullQuote({ children }: { children: ReactNode }) {
  return <blockquote className="di-pull">{children}</blockquote>;
}
