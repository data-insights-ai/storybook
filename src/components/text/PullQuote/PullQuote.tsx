import type { ReactNode } from "react";
import "./PullQuote.css";

/**
 * One sentence, lifted out of the page and set at the display tier.
 *
 * It is the brand pages' one piece of rhetoric, so it is deliberately
 * spare: a hairline down its left edge, italic at the top of the type
 * ramp, measured to 16em so the line breaks where the sentence does.
 * No quote glyph, no gold, no card — the sentence is the emphasis, and
 * anything drawn around it would be a second claim.
 *
 * A leaf: there is no attribution slot, because a brand page states its
 * own claims and a pull quote with a byline is a testimonial.
 */
export function PullQuote({ children }: { children: ReactNode }) {
  return <blockquote className="di-pull">{children}</blockquote>;
}
