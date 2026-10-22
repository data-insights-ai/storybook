import { useId, useState } from "react";
import { Button } from "./Button";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalFrame, ModalTitle } from "./Modal";
import { Kbd } from "./Seal";
import { shortcutLabel, shortcutTarget } from "./shortcutKeys";
import { useShortcut } from "./useShortcut";
import "./ShortcutHelp.css";

type Row = { key: string; what: string; target?: string };

/**
 * `?` lists the keys the current page answers: the page keys whose
 * control is on screen right now (`/`, `n`, `e`), then `?` and Esc. Mount
 * it once in the app shell; the copy comes translated from the product.
 */
export function ShortcutHelp({
  title,
  closeLabel,
  labels,
}: {
  title: string;
  closeLabel: string;
  /** What each key does, in the reader's language. */
  labels: { search: string; create: string; edit: string; help: string; close: string };
}) {
  const titleId = useId();
  const [rows, setRows] = useState<Row[] | null>(null);
  useShortcut("?", () => {
    const page: Row[] = [];
    for (const [key, what] of [
      ["/", labels.search],
      ["n", labels.create],
      ["e", labels.edit],
    ] as const) {
      const el = shortcutTarget(key);
      if (el) page.push({ key, what, target: shortcutLabel(el) });
    }
    setRows([...page, { key: "?", what: labels.help }, { key: "Esc", what: labels.close }]);
  });
  return (
    <Modal open={rows !== null} onClose={() => setRows(null)} labelledBy={titleId}>
      <ModalFrame>
        <ModalContent>
          <ModalTitle id={titleId}>{title}</ModalTitle>
          <ModalBody>
            <dl className="di-shortcut-help">
              {(rows ?? []).map((r) => (
                <div key={r.key} className="di-shortcut-help-row">
                  <dt>
                    <Kbd>{r.key === "Esc" ? r.key : r.key.toUpperCase()}</Kbd>
                  </dt>
                  <dd>
                    {r.what}
                    {r.target ? <span className="di-shortcut-help-target">{r.target}</span> : null}
                  </dd>
                </div>
              ))}
            </dl>
          </ModalBody>
          <ModalFooter>
            <Button variant="secondary" onClick={() => setRows(null)}>
              {closeLabel}
            </Button>
          </ModalFooter>
        </ModalContent>
      </ModalFrame>
    </Modal>
  );
}
