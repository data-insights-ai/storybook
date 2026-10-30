import type { ReactNode } from "react";
import { cx } from "../../../internal/cx";
import "./Kbd.css";

/**
 * A key or a key combination the reader presses, such as ⌘K or Strg K.
 *
 * **When to use:** in a sentence that names a shortcut ("Press ⌘K to open
 * the command bar"), and in a list of shortcuts. **When not to:** the key
 * of a button (`Button shortcut`, which renders it), the hint inside a
 * search field (`SearchField shortcut`), an identifier or a code fragment
 * (the mono track, or `CodeBlock`).
 *
 * **Anatomy:** one `<kbd>` per key; a combination is one Kbd per key with
 * the `+` written between them in the sentence.
 *
 * **Variants:** `default` is a small key cap, a hairline on the page tone.
 * `onControl` is the key a control carries after its label: a tone of the
 * control's own ink with no frame, so a button never holds a second
 * outline.
 *
 * **Content:** the key as printed on the keyboard, in the reader's
 * language (Strg on a German keyboard, Ctrl on an English one).
 *
 * **Accessibility:** a native `<kbd>`, read as its text. A key on a control
 * is hidden from screen readers by the control, which says it through
 * `aria-keyshortcuts`. Hidden on touch screens, where there are no keys.
 */
export function Kbd({
  children,
  tone = "default",
  className,
}: {
  children: ReactNode;
  tone?: "default" | "onControl";
  className?: string;
}) {
  return <kbd className={cx("di-kbd", tone === "onControl" && "di-kbd-on-control", className)}>{children}</kbd>;
}
