import type { ReactNode } from "react";
import { Search, ShieldCheck } from "lucide-react";
import { cx } from "../cx";
import { Kbd, SealMark } from "./Seal";
import "./CommandBar.css";

/**
 * One field for navigating, searching and asking. The scrim is solid
 * navy — a blurred register is an unreadable one, and a mono value
 * behind frosted glass has no measurable contrast.
 *
 * Where the bar sits over a page, the caller renders it in a dialog. On
 * its own it is the panel only.
 */
export function CommandBar({
  id = "command",
  label,
  placeholder,
  value,
  onValueChange,
  hints,
  privacyNote,
  children,
}: {
  id?: string;
  /** Names the field. The magnifier alone does not. */
  label: string;
  placeholder: string;
  value: string;
  onValueChange: (value: string) => void;
  /** The key legend along the footer, e.g. ["/ commands", "↑↓ select"]. */
  hints: string[];
  /** Where the query is processed. Stated, not implied. */
  privacyNote: string;
  children: ReactNode;
}) {
  return (
    <div className="di-command">
      <div className="di-command-input">
        <Search className="di-command-icon" aria-hidden />
        <label className="di-sr" htmlFor={id}>
          {label}
        </label>
        <input
          id={id}
          className="di-command-field"
          type="text"
          autoComplete="off"
          placeholder={placeholder}
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
        />
        <Kbd>esc</Kbd>
      </div>
      <div className="di-command-list">{children}</div>
      <div className="di-command-foot">
        {hints.map((hint) => (
          <span key={hint}>{hint}</span>
        ))}
        <span className="di-command-privacy">
          <ShieldCheck aria-hidden />
          {privacyNote}
        </span>
      </div>
    </div>
  );
}

/**
 * A scope the bar is searching within, or one it offers to add. A
 * suggested scope came from a model, so it carries the ring.
 */
export function CommandChip({
  tone = "default",
  onSelect,
  children,
}: {
  tone?: "active" | "default" | "suggested";
  onSelect?: () => void;
  children: ReactNode;
}) {
  const body = (
    <>
      {tone === "suggested" ? <SealMark state="inferred" size={6} /> : null}
      {children}
    </>
  );
  if (!onSelect) {
    return <span className={cx("di-command-chip", `is-${tone}`)}>{body}</span>;
  }
  return (
    <button type="button" className={cx("di-command-chip", `is-${tone}`)} onClick={onSelect}>
      {body}
    </button>
  );
}

export function CommandGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="di-command-group">
      <p className="di-command-group-label">{label}</p>
      {children}
    </div>
  );
}

/**
 * A row the bar offers. `inferred` swaps the icon for the hollow ring:
 * a model proposed this, and it has not been sealed.
 */
export function CommandRow({
  label,
  meta,
  active = false,
  inferred = false,
  onSelect,
  children,
}: {
  /** What the row offers, in one line. */
  label: string;
  /** The trailing note: a shortcut, a count, a source. */
  meta: string;
  active?: boolean;
  inferred?: boolean;
  onSelect: () => void;
  /** The leading icon, as `Button` takes it. Ignored when `inferred`. */
  children?: ReactNode;
}) {
  return (
    <button
      type="button"
      className={cx("di-command-row", active && "is-active")}
      onClick={onSelect}
    >
      <span className="di-command-row-icon">{inferred ? <SealMark state="inferred" size={7} /> : children}</span>
      <span className="di-command-row-label">{label}</span>
      <span className="di-command-row-meta">{meta}</span>
    </button>
  );
}
