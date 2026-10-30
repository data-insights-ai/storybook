import { Children, isValidElement, useEffect, useId, useRef, type FormEvent, type ReactNode } from "react";
import { Pencil } from "lucide-react";
import { Button } from "../../../actions/Button";
import { focusFirstField, useShortcutKeys } from "../../../../internal/shortcutKeys";
import "./DetailSection.css";

/**
 * One section of a record's detail page. It reads by default: the facts,
 * a list, a status. Changing it is a step the reader takes on purpose —
 * `Edit` in the section's header switches this section, and only this one,
 * into its `DetailSectionForm` with Save and Cancel. A page never carries a
 * form that is always open next to the facts it would change.
 *
 * Focus follows the switch: into the form's first field on Edit, back to
 * the Edit button on Save or Cancel, so a keyboard user does not lose
 * their place. A change too large for a section opens a `Sheet` from
 * `DetailSectionActions` instead.
 */
export function DetailSection({
  title,
  lede,
  editLabel = "",
  editing = false,
  onEdit,
  children,
}: {
  title: string;
  lede?: string;
  /** The Edit button's text. Empty, or no `onEdit`, means the section only reads. */
  editLabel?: string;
  /** Whether the section shows its `DetailSectionForm` instead of its read view. */
  editing?: boolean;
  onEdit?: () => void;
  /** The read view, optionally `DetailSectionActions` and one `DetailSectionForm`. */
  children: ReactNode;
}) {
  const titleId = useId();
  const editButton = useRef<HTMLButtonElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const wasEditing = useRef(editing);

  const actions: ReactNode[] = [];
  const form: ReactNode[] = [];
  const view: ReactNode[] = [];
  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.type === DetailSectionActions) actions.push(child);
    else if (isValidElement(child) && child.type === DetailSectionForm) form.push(child);
    else view.push(child);
  });

  useEffect(() => {
    if (editing && !wasEditing.current) {
      if (!focusFirstField(body.current)) body.current?.querySelector<HTMLElement>("button")?.focus();
    }
    if (!editing && wasEditing.current) {
      editButton.current?.focus();
    }
    wasEditing.current = editing;
  }, [editing]);

  const canEdit = editLabel !== "" && onEdit !== undefined && form.length > 0;
  // `e` presses the first section's Edit on the page; the key is not drawn
  // on every section, the shortcut help names it.
  useShortcutKeys(canEdit);
  return (
    <section className="di-detail-section" aria-labelledby={titleId}>
      <header className="di-detail-section-head">
        <div className="di-detail-section-heading">
          <h2 className="di-detail-section-title" id={titleId}>
            {title}
          </h2>
          {lede ? <p className="di-detail-section-lede">{lede}</p> : null}
        </div>
        {editing ? null : (
          <div className="di-detail-section-actions">
            {actions}
            {canEdit ? (
              <Button
                ref={editButton}
                variant="secondary"
                size="dense"
                onClick={onEdit}
                data-di-shortcut="e"
                aria-keyshortcuts="e"
              >
                <Pencil aria-hidden />
                {editLabel}
              </Button>
            ) : null}
          </div>
        )}
      </header>
      <div className="di-detail-section-body" ref={body}>
        {editing ? form : view}
      </div>
    </section>
  );
}

/** Beside the section's title: further actions on it, e.g. "Add domain" or a `Menu`. */
export function DetailSectionActions({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

/**
 * The section's edit view: its fields, then Cancel and Save. Enter saves;
 * Escape cancels. `error` is the reason the last save failed.
 */
export function DetailSectionForm({
  saveLabel,
  cancelLabel,
  onSubmit,
  onCancel,
  saving = false,
  error = "",
  children,
}: {
  saveLabel: string;
  cancelLabel: string;
  onSubmit: () => void;
  onCancel: () => void;
  saving?: boolean;
  error?: string;
  /** The fields, as for a `FieldStack`. */
  children: ReactNode;
}) {
  const submit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit();
  };
  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- Esc from any field in the form cancels the edit
    <form
      className="di-detail-section-form"
      onSubmit={submit}
      onKeyDown={(event) => {
        if (event.key === "Escape" && !saving) {
          event.stopPropagation();
          onCancel();
        }
      }}
    >
      <div className="di-field-stack">{children}</div>
      {error ? (
        <p className="di-detail-section-error" role="alert">
          {error}
        </p>
      ) : null}
      <div className="di-detail-section-form-actions">
        <Button variant="secondary" onClick={onCancel} disabled={saving}>
          {cancelLabel}
        </Button>
        <Button type="submit" loading={saving}>
          {saveLabel}
        </Button>
      </div>
    </form>
  );
}
