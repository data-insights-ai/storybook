import { useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { useDialogFocus } from "./useDialogFocus";
import "./Modal.css";
import "./Drawer.css";

/**
 * The detail pane for one row. It keeps the index column, so the row and
 * its detail are recognisably the same object. It never stacks: a second
 * drawer replaces the first.
 *
 * A dialog: focus moves into it when it opens and returns to whatever
 * opened it when it closes, and Escape closes it. Modal by default — Tab
 * stays inside and a screen reader leaves the page behind alone. With
 * `modal={false}` the register behind stays reachable from the keyboard,
 * for a pane read beside the rows it came from.
 */
export function Drawer({
  index,
  eyebrow,
  title,
  titleId,
  onClose,
  closeLabel,
  modal = true,
  children,
}: {
  /** The ordinal of the row this drawer belongs to. */
  index: string;
  eyebrow: string;
  title: string;
  /** Names the pane for a screen reader. */
  titleId: string;
  onClose: () => void;
  closeLabel: string;
  modal?: boolean;
  /** The detail, and one `DrawerFooter` if the pane carries controls. */
  children: ReactNode;
}) {
  const panel = useRef<HTMLDivElement>(null);
  useDialogFocus(panel, onClose, modal);
  return (
    <div
      ref={panel}
      className="di-drawer"
      role="dialog"
      aria-modal={modal || undefined}
      aria-labelledby={titleId}
      tabIndex={-1}
    >
      <div className="di-drawer-index">
        <span className="di-drawer-index-label">{index}</span>
        <span className="di-drawer-index-rule" aria-hidden />
      </div>
      <div className="di-drawer-body">
        <div className="di-drawer-header">
          <div className="di-drawer-heading">
            <p className="di-drawer-eyebrow">{eyebrow}</p>
            <h2 className="di-drawer-title" id={titleId}>
              {title}
            </h2>
          </div>
          <button type="button" className="di-drawer-close" aria-label={closeLabel} onClick={onClose}>
            <X aria-hidden />
          </button>
        </div>
        <div className="di-drawer-content">{children}</div>
      </div>
    </div>
  );
}

/** The controls at the foot of the pane. */
export function DrawerFooter({ children }: { children: ReactNode }) {
  return <div className="di-drawer-footer">{children}</div>;
}
