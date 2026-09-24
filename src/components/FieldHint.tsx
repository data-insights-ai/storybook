import { AlertCircle } from "lucide-react";
import { cx } from "../cx";
import { SealMark } from "./Seal";
import "./Field.css";

/**
 * How the one line under a field reads. A field says one thing at a
 * time, so this is a tone on the hint rather than a second prop that
 * could contradict it.
 *
 * `neutral` helps, `sealed` is a resolved value the register vouches
 * for, `error` marks the control invalid and replaces the help.
 */
export type HintTone = "neutral" | "sealed" | "error";

/** The line under a control. Empty text renders nothing. */
export function FieldHint({
  id,
  tone,
  children,
}: {
  id: string;
  tone: HintTone;
  children: string;
}) {
  if (children === "") return null;
  if (tone === "error") {
    return (
      <div className="di-field-hint is-error" id={id}>
        <AlertCircle aria-hidden />
        <span>{children}</span>
      </div>
    );
  }
  if (tone === "sealed") {
    return (
      <div className="di-field-hint is-sealed" id={id}>
        <SealMark state="sealed" />
        <span>{children}</span>
      </div>
    );
  }
  return (
    <div className={cx("di-field-hint")} id={id}>
      {children}
    </div>
  );
}
