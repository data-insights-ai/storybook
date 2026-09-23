import type { ReactNode } from "react";
import { X } from "lucide-react";
import "./Modal.css";
import "./Drawer.css";

/**
 * The detail pane for one row. It keeps the index column, so the row and
 * its detail are recognisably the same object. It never stacks: a second
 * drawer replaces the first.
 *
 * Not a dialog — the register behind it stays readable and usable, which
 * is the point of opening a drawer instead of a modal.
 */
export function Drawer({
  index,
  eyebrow,
  title,
  titleId,
  onClose,
  closeLabel,
  footer,
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
  footer?: ReactNode;
  children: ReactNode;
}) {
  return (
    <aside className="di-drawer" aria-labelledby={titleId}>
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
        {footer === undefined ? null : <div className="di-drawer-footer">{footer}</div>}
      </div>
    </aside>
  );
}
