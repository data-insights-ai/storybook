import { useId, useState, type FormEvent } from "react";
import { Button } from "../../actions/Button";
import { FieldHint } from "../../forms/field/FieldHint";
import { TextField } from "../../forms/text/TextField";
import { Dialog, DialogFooter } from "../Dialog";
import "./ConfirmDialog.css";

/**
 * The question before a destructive action. It states the consequence
 * first — `body`, then each item of `consequences` — and only then asks.
 * Focus opens on Cancel, the safe choice.
 *
 * Why it asks first: revoking or sealing cannot be quietly undone, so the
 * system confirms before an action instead of offering Undo afterwards; the
 * `Toast` that follows is a receipt, not a way back.
 *
 * An irreversible action (deleting or leaving an organization, deleting a
 * workspace) sets `confirmText`, usually the record's name: the confirm
 * button stays disabled until it is typed, and focus opens on that field.
 *
 * `eyebrow` names the record the action acts on ("Workspace · Field
 * Research"); it takes the danger ink only with `tone="danger"`.
 *
 * `tone="danger"` carries the danger in the dialog itself, whatever the
 * page behind the scrim shows: the danger mark leads the title and the
 * confirm button is filled in the danger colour, the one action the
 * question asks for. While `confirmText` is not yet typed the button keeps
 * a danger tint, so it reads as destructive before it can be pressed.
 *
 * Built on `Dialog placement="center"`, a native dialog: focus is trapped,
 * the page behind is inert, Escape closes and focus returns to the button
 * that opened it.
 */
export function ConfirmDialog({
  open,
  title,
  eyebrow = "",
  body,
  consequences = [],
  confirmLabel,
  cancelLabel,
  confirmText = "",
  confirmTextLabel = "",
  tone = "danger",
  busy = false,
  error = "",
  onConfirm,
  onClose,
}: {
  open: boolean;
  title: string;
  /** The record the action acts on, above the title. Empty means none. */
  eyebrow?: string;
  /** What happens, in a sentence. */
  body: string;
  /** What follows from it, one item each. */
  consequences?: string[];
  confirmLabel: string;
  cancelLabel: string;
  /** Text to type before the action is allowed, e.g. the organization's name. Empty means none. */
  confirmText?: string;
  /** The label of that field, e.g. "Type Northwind to confirm". */
  confirmTextLabel?: string;
  /** `danger` cannot be taken back or removes access; `neutral` asks before a weighty but ordinary step. */
  tone?: "danger" | "neutral";
  busy?: boolean;
  /** Why the last attempt failed. */
  error?: string;
  onConfirm: () => void;
  onClose: () => void;
}) {
  const fieldId = useId();
  const [typed, setTyped] = useState("");
  const needsText = confirmText !== "";
  const allowed = !needsText || typed.trim() === confirmText.trim();

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (allowed && !busy) onConfirm();
  };
  const close = () => {
    setTyped("");
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={close}
      title={title}
      eyebrow={eyebrow || undefined}
      tone={tone}
      placement="center"
      size="md"
      onSubmit={submit}
    >
      <p>{body}</p>
      {consequences.length > 0 ? (
        <ul className="di-confirm-consequences">
          {consequences.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}
      {needsText ? (
        <TextField
          id={fieldId}
          label={confirmTextLabel}
          labelTrack="prose"
          value={typed}
          autoComplete="off"
          spellCheck={false}
          onChange={(event) => setTyped(event.target.value)}
        />
      ) : null}
      {error ? (
        <div role="alert">
          <FieldHint id={`${fieldId}-error`} tone="error">
            {error}
          </FieldHint>
        </div>
      ) : null}
      <DialogFooter>
        <Button variant="secondary" onClick={close} data-autofocus={needsText ? undefined : true} disabled={busy}>
          {cancelLabel}
        </Button>
        <Button type="submit" variant={tone === "danger" ? "danger" : "primary"} loading={busy} disabled={!allowed}>
          {confirmLabel}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
