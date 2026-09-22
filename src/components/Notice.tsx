import type { ReactNode } from "react";
import { cx } from "../cx";
import "./Notice.css";

/** Frame only. Icon, text, and action are children, in that order. */
export function Notice({
  tone = "info",
  children,
}: {
  tone?: "info" | "ok" | "warn";
  children?: ReactNode;
}) {
  return (
    <div className={cx("di-notice", `di-notice-${tone}`)} role="note">
      {children}
    </div>
  );
}

export function NoticeIcon({ children }: { children: ReactNode }) {
  return <span className="di-notice-icon">{children}</span>;
}

export function NoticeText({ children }: { children: ReactNode }) {
  return <div className="di-notice-copy">{children}</div>;
}

export function NoticeTitle({ children }: { children: ReactNode }) {
  return <p className="di-notice-title">{children}</p>;
}

export function NoticeBody({ children }: { children: ReactNode }) {
  return <div className="di-notice-body">{children}</div>;
}

export function NoticeAction({ children }: { children: ReactNode }) {
  return <div className="di-notice-action">{children}</div>;
}
