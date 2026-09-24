import type { ReactNode } from "react";
import { X } from "lucide-react";
import { cx } from "../cx";
import { SealMark } from "./Seal";
import "./Toast.css";

/**
 * A receipt, not an escape hatch. The action already ran and was already
 * confirmed; this reports what happened and carries the audit id that
 * authorised it. There is no undo here — a reversal is its own action,
 * with its own confirmation.
 */
export function Toast({
  title,
  body,
  auditId = "",
  onDismiss,
  dismissLabel,
  className,
  children,
}: {
  title: string;
  body: string;
  /** The id of the confirmation that authorised the action. Empty means none. */
  auditId?: string;
  onDismiss: () => void;
  dismissLabel: string;
  /** Takes `is-leaving` while the caller plays the exit before unmounting. */
  className?: string;
  /** Holds one `ToastAction`, for example “View record”. */
  children?: ReactNode;
}) {
  return (
    <div className={cx("di-toast", className)} role="status">
      <SealMark state="sealed" className="di-toast-seal" />
      <div className="di-toast-copy">
        <p className="di-toast-title">{title}</p>
        <p className="di-toast-body">{body}</p>
        {auditId === "" ? null : <p className="di-toast-audit">{auditId}</p>}
      </div>
      {children}
      <button type="button" className="di-toast-close" aria-label={dismissLabel} onClick={onDismiss}>
        <X aria-hidden />
      </button>
    </div>
  );
}

/** The trailing control on a receipt. Never an undo — a reversal is its own action. */
export function ToastAction({ children }: { children: ReactNode }) {
  return <div className="di-toast-action">{children}</div>;
}
