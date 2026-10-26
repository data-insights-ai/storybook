import { useId, useState, type FormEvent } from "react";
import { TriangleAlert } from "lucide-react";
import { Button } from "../actions/Button";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalFrame, ModalIcon, ModalTitle } from "./Modal";
import "./ConfirmDialog.css";

/**
 * The question before a destructive action. It states the consequence
 * first — `body`, then each item of `consequences` — and only then asks.
 * Focus opens on Cancel, the safe choice.
 *
 * An irreversible action (deleting or leaving an organization, deleting a
 * workspace) sets `confirmText`, usually the record's name: the confirm
 * button stays disabled until it is typed, and focus opens on that field.
 *
 * Built on `Modal`, a native dialog: focus is trapped, the page behind is
 * inert, Escape closes and focus returns to the button that opened it.
 */
export function ConfirmDialog({
  open,
  title,
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
  const titleId = useId();
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
    <Modal open={open} onClose={close} labelledBy={titleId}>
      <form onSubmit={submit} className="di-confirm-dialog">
        <ModalFrame>
          <ModalIcon>
            <TriangleAlert aria-hidden />
          </ModalIcon>
          <ModalContent>
            <ModalTitle id={titleId}>{title}</ModalTitle>
            <ModalBody>
              <p>{body}</p>
              {consequences.length > 0 ? (
                <ul className="di-confirm-consequences">
                  {consequences.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </ModalBody>
            {needsText ? (
              <div className="di-field di-confirm-field">
                <label className="di-field-label di-field-label-prose" htmlFor={fieldId}>
                  {confirmTextLabel}
                </label>
                <input
                  id={fieldId}
                  className="di-control"
                  value={typed}
                  autoComplete="off"
                  spellCheck={false}
                  autoFocus
                  onChange={(event) => setTyped(event.target.value)}
                />
              </div>
            ) : null}
            {error ? (
              <p className="di-confirm-error" role="alert">
                {error}
              </p>
            ) : null}
            <ModalFooter>
              <Button variant="secondary" onClick={close} autoFocus={!needsText} disabled={busy}>
                {cancelLabel}
              </Button>
              <Button type="submit" variant={tone === "danger" ? "danger" : "primary"} loading={busy} disabled={!allowed}>
                {confirmLabel}
              </Button>
            </ModalFooter>
          </ModalContent>
        </ModalFrame>
      </form>
    </Modal>
  );
}
