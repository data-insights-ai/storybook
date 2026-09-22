import type { ReactNode } from "react";
import { X } from "lucide-react";
import "./Chip.css";

export function Chip({
  children,
  onRemove,
  removeLabel,
}: {
  children: ReactNode;
  onRemove?: () => void;
  removeLabel: string;
}) {
  return (
    <span className="di-chip">
      <span>{children}</span>
      {onRemove ? (
        <button type="button" className="di-chip-remove" aria-label={removeLabel} onClick={onRemove}>
          <X aria-hidden />
        </button>
      ) : null}
    </span>
  );
}
