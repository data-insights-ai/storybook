import type { ReactNode } from "react";
import { takeSlot } from "../../../internal/slots";
import { Notice, NoticeAction, NoticeBody, NoticeIcon, NoticeTitle } from "../Notice";

/**
 * Zero results, zero configuration or a failure to load, in place of the
 * content.
 *
 * @deprecated Removed in 0.12: use `Notice variant="empty"`. `eyebrow` and
 * `title` become `<NoticeTitle eyebrow>`, `body` and `mono` become
 * `<NoticeBody mono>`, `EmptyStateIcon` is `NoticeIcon` and
 * `EmptyStateAction` is `NoticeAction`; `tone` is the same.
 */
export function EmptyState({
  eyebrow = "",
  title,
  body,
  mono = false,
  tone = "neutral",
  className,
  children,
}: {
  eyebrow?: string;
  title: string;
  body: string;
  mono?: boolean;
  tone?: "neutral" | "danger";
  className?: string;
  children?: ReactNode;
}) {
  const [icon, rest] = takeSlot(children, EmptyStateIcon);
  return (
    <Notice variant="empty" tone={tone} className={className}>
      {icon}
      <NoticeTitle eyebrow={eyebrow}>{title}</NoticeTitle>
      <NoticeBody mono={mono}>{body}</NoticeBody>
      {rest}
    </Notice>
  );
}

/** @deprecated Removed in 0.12: use `NoticeAction` in a `Notice variant="empty"`. */
export function EmptyStateAction({ children }: { children: ReactNode }) {
  return <NoticeAction>{children}</NoticeAction>;
}

/** @deprecated Removed in 0.12: use `NoticeIcon` in a `Notice variant="empty"`. */
export function EmptyStateIcon({ children }: { children: ReactNode }) {
  return <NoticeIcon>{children}</NoticeIcon>;
}
