import { Children, useLayoutEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { cx } from "../../../internal/cx";
import { useLineStarts } from "../../../internal/useLineStarts";
import { SealMark } from "../SealValue";
import "./Tag.css";

/**
 * A name in a small frame: a role someone holds, a group, a version, a
 * filter on a list. `detail` qualifies it, muted after the name (the scope
 * of a grant). `mono` sets it in the mono track for what a machine named:
 * a version, a hash, a `key: value` filter.
 *
 * A tag can act. With `onClick` it is a button (a filter on offer, or one
 * to toggle with `pressed`); with `onRemove` it carries its own remove
 * button, named by `removeLabel`, because "Remove" alone does not say which
 * one. `pressed` draws the selection fill. `inferred` marks a tag a model
 * proposed with the hollow ring.
 *
 * For a machine state use `StatusPill`; for a count on a control, `Badge`.
 */
export function Tag({
  children,
  detail = "",
  title,
  mono = false,
  pressed,
  onClick,
  onRemove,
  removeLabel = "",
  inferred = false,
  className,
}: {
  children: ReactNode;
  detail?: string;
  /** The full wording when the tag shows a short name, as a tooltip. */
  title?: string;
  /** The mono track: a version, a hash, a `key: value` filter. */
  mono?: boolean;
  /** Set: the tag narrows the view. With `onClick` it is announced as a pressed button. */
  pressed?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
  /** Names what the remove button drops, e.g. "Remove the severity filter". Required with `onRemove`. */
  removeLabel?: string;
  /** A model proposed it: the hollow ring leads. */
  inferred?: boolean;
  className?: string;
}) {
  const box = useRef<HTMLElement | null>(null);
  const holdBox = (element: HTMLElement | null) => {
    box.current = element;
  };
  useLineStarts(box, detail);
  const classes = cx(
    "di-tag",
    mono && "is-mono",
    pressed && "is-pressed",
    inferred && "is-inferred",
    (onClick || onRemove) && "is-control",
    className,
  );
  const name = (
    <>
      {inferred ? <SealMark state="inferred" /> : null}
      <span className="di-tag-name">{children}</span>
      {detail === "" ? null : <span className="di-tag-detail">{detail}</span>}
    </>
  );
  const remove = onRemove ? (
    <button type="button" className="di-tag-remove" aria-label={removeLabel} onClick={onRemove}>
      <X aria-hidden />
    </button>
  ) : null;

  if (onClick && !onRemove) {
    return (
      <button ref={holdBox} type="button" className={classes} title={title} aria-pressed={pressed} onClick={onClick}>
        {name}
      </button>
    );
  }
  return (
    <span ref={onClick ? undefined : holdBox} className={classes} title={title}>
      {onClick ? (
        <button ref={holdBox} type="button" className="di-tag-press" aria-pressed={pressed} onClick={onClick}>
          {name}
        </button>
      ) : (
        name
      )}
      {remove}
    </span>
  );
}

/**
 * Tags side by side. In a table cell give `max`: the first tags stay on one
 * line and the rest become one "+N more" tag (`moreLabel`), which calls
 * `onMore` — open the record's side panel there. Without `max` the tags
 * wrap like words. A scope that would show only its first letters in a
 * compact list is left out rather than cut to "·…".
 */
export function TagList({
  children,
  max,
  moreLabel,
  onMore,
}: {
  children: ReactNode;
  max?: number;
  /** "+3 more", for the tags not shown. */
  moreLabel?: (hidden: number) => string;
  onMore?: () => void;
}) {
  const list = useRef<HTMLSpanElement>(null);
  const compact = max !== undefined;
  useLayoutEffect(() => {
    const element = list.current;
    if (!compact || !element) return;
    const fit = () => {
      for (const detail of element.querySelectorAll<HTMLElement>(".di-tag-detail")) {
        detail.removeAttribute("data-cut");
        const room = parseFloat(getComputedStyle(detail).fontSize) * 4;
        if (detail.scrollWidth > detail.clientWidth && detail.clientWidth < room) detail.setAttribute("data-cut", "");
      }
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(element);
    return () => observer.disconnect();
  }, [compact, children]);
  const tags = Children.toArray(children);
  const shown = max === undefined ? tags : tags.slice(0, max);
  const hidden = tags.length - shown.length;
  const more = moreLabel ? moreLabel(hidden) : `+${hidden}`;
  return (
    <span ref={list} className={cx("di-tag-list", compact && "is-compact")}>
      {shown}
      {hidden > 0 ? (
        onMore ? (
          <button type="button" className="di-tag di-tag-more is-control" onClick={onMore}>
            {more}
          </button>
        ) : (
          <span className="di-tag di-tag-more">{more}</span>
        )
      ) : null}
    </span>
  );
}
