import { createContext, useContext, type ReactNode } from "react";
import { AlertTriangle, CheckCircle2, Info, OctagonAlert } from "lucide-react";
import { cx } from "../../../internal/cx";
import { surfaceClass } from "../../../internal/surface";
import { Eyebrow } from "../../text/Eyebrow";
import "./Notice.css";

export type NoticeTone = "neutral" | "ok" | "warn" | "danger";

/** `banner` a message across the sheet; `line` one ruled line when nothing needs the reader. */
export type NoticeVariant = "banner" | "line";

const NoticeContext = createContext<{ tone: NoticeTone; variant: NoticeVariant }>({
  tone: "neutral",
  variant: "banner",
});

const roles = { banner: "note", line: "note" } as const;

/**
 * A message about the system that is part of the page, not an
 * interruption. Children, in order: an optional `NoticeIcon`, `NoticeTitle`,
 * an optional `NoticeBody` and an optional `NoticeAction`; in a `banner`
 * the title and body sit in one `NoticeText`.
 *
 * `danger` takes `role="alert"`, so it is announced when it appears.
 * Content that is absent is not a message about the system: that is an
 * `EmptyState`.
 */
export function Notice({
  tone = "neutral",
  variant = "banner",
  className,
  children,
}: {
  tone?: NoticeTone;
  variant?: NoticeVariant;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <NoticeContext.Provider value={{ tone, variant }}>
      <div
        className={cx(
          variant === "banner" && surfaceClass({ padded: false }),
          "di-notice",
          `di-notice-${variant}`,
          `di-notice-${tone}`,
          className,
        )}
        role={tone === "danger" ? "alert" : roles[variant]}
      >
        {children}
      </div>
    </NoticeContext.Provider>
  );
}

const toneIcons = { neutral: Info, ok: CheckCircle2, warn: AlertTriangle, danger: OctagonAlert };

/**
 * The notice's icon, coloured by its tone. Without children it draws the
 * tone's own icon, so one state reads the same in every product. Decoration:
 * the title carries the meaning.
 */
export function NoticeIcon({ children }: { children?: ReactNode }) {
  const { tone } = useContext(NoticeContext);
  const Glyph = toneIcons[tone];
  return (
    <span className="di-notice-icon" aria-hidden>
      {children ?? <Glyph />}
    </span>
  );
}

/**
 * A banner's text column: a block with `NoticeTitle` and `NoticeBody`, then
 * an optional `NoticeAction`, so the action stays inside the padding.
 */
export function NoticeText({ children }: { children: ReactNode }) {
  return <div className="di-notice-copy">{children}</div>;
}

/**
 * The notice's first line: what happened, or what is absent, in one
 * sentence. `eyebrow` names the kind of state above it ("No results"); leave
 * it out where the page already names the place.
 */
export function NoticeTitle({ eyebrow = "", children }: { eyebrow?: string; children: ReactNode }) {
  const { tone } = useContext(NoticeContext);
  const title = <p className="di-notice-title">{children}</p>;
  if (eyebrow === "") return title;
  return (
    <div className="di-notice-heading">
      <Eyebrow variant="plain" tone={tone === "danger" ? "danger" : "quiet"}>
        {eyebrow}
      </Eyebrow>
      {title}
    </div>
  );
}

/**
 * The message under the `NoticeTitle`. `mono` sets it in the mono track,
 * for an identifier, a path or a query. In a `line` notice it holds a
 * `MetaLine` of what the calm rests on.
 */
export function NoticeBody({ mono = false, children }: { mono?: boolean; children: ReactNode }) {
  return <div className={cx("di-notice-body", mono && "di-mono")}>{children}</div>;
}

/** The way out: at most two controls in a banner, on one line. */
export function NoticeAction({ children }: { children: ReactNode }) {
  return <div className="di-notice-action">{children}</div>;
}
