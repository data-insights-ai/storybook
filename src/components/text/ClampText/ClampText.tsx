import { useId, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { cx } from "../../../internal/cx";
import { Button } from "../../actions/Button";
import "./ClampText.css";

/**
 * A passage held to a few lines until the reader asks for the rest: a
 * model's reasoning in a queue row, a long description in a list.
 *
 * **When to use:** prose of any length in a row or a card whose height
 * should not depend on it, where the reader decides whether to read on.
 * **When not to:** text the reader must see whole to act (put it in full);
 * a heading or a name (`Highlight` or a title's own truncation); a list of
 * items (show the first and a count).
 *
 * **Anatomy:** the text, cut at `lines` lines with an ellipsis, and under
 * it one link-styled button, "Show more" (`moreLabel`), that opens it in
 * place and then reads "Show less" (`lessLabel`). The button is there only
 * when the text runs past the lines, measured again when the width changes.
 *
 * **Accessibility:** the button names its state with `aria-expanded` and
 * controls the text by id; the cut text is still read whole by a screen
 * reader, since the clamp only hides it visually.
 */
export function ClampText({
  lines = 3,
  moreLabel,
  lessLabel,
  className,
  children,
}: {
  /** The lines shown while closed, 2 to 6. */
  lines?: 2 | 3 | 4 | 5 | 6;
  moreLabel: string;
  lessLabel: string;
  className?: string;
  /** The passage: text, or paragraphs and lists. */
  children: ReactNode;
}) {
  const id = useId();
  const text = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [overflows, setOverflows] = useState(false);
  useLayoutEffect(() => {
    const element = text.current;
    if (!element || open) return;
    const measure = () => setOverflows(element.scrollHeight > element.clientHeight + 1);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    // A web font that arrives later reflows the text without resizing the clamped box.
    let live = true;
    void document.fonts?.ready.then(() => live && measure());
    return () => {
      live = false;
      observer.disconnect();
    };
  }, [open, children]);
  return (
    <div className={cx("di-clamp", className)}>
      <div
        ref={text}
        id={id}
        className={cx("di-clamp-text", !open && "is-clamped")}
        style={{ "--di-clamp-lines": lines } as CSSProperties}
      >
        {children}
      </div>
      {overflows || open ? (
        <Button variant="link" size="sm" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>
          {open ? lessLabel : moreLabel}
        </Button>
      ) : null}
    </div>
  );
}
