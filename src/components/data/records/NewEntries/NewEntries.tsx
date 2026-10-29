import { ArrowUp } from "lucide-react";
import { Button } from "../../../actions/Button";
import "./NewEntries.css";

/**
 * A live register keeps the reader's place: entries that arrive above
 * while they read further down are held back, and this says how many.
 * Pressing it shows them and returns to the top. It floats under the
 * topbar, so the page does not move when it appears.
 */
export function NewEntries({ label, onShow }: { label: string; onShow: () => void }) {
  return (
    <div className="di-new-entries" role="status">
      <Button size="dense" onClick={onShow}>
        <ArrowUp aria-hidden />
        {label}
      </Button>
    </div>
  );
}
