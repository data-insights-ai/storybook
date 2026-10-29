import { useId, useState } from "react";
import { Button } from "../../actions/Button";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalFrame, ModalTitle } from "../Modal";
import { Kbd } from "../../data/text/Kbd";
import { shortcutLabel, shortcutTarget } from "../../../internal/shortcutKeys";
import { useShortcut } from "../../../internal/useShortcut";
import "./ShortcutHelp.css";

type Row = { keys: string[]; what: string };

const rowControls = ".di-table-scroll tbody tr :is(a[href], button:not(:disabled))";

/** A key the product answers everywhere, such as ⌘K; several spellings are alternatives. */
export type AppShortcut = { keys: string[]; what: string };

/**
 * `?` lists the keys the current page answers: the page keys whose
 * control is on screen right now (`/`, `n`, `e`), then `?` and Esc. Mount
 * it once in the app shell; the copy comes translated from the product.
 * `appKeys` come first: the product's own keys, such as ⌘K or j/k on a list.
 */
export function ShortcutHelp({
  title,
  closeLabel,
  labels,
  appKeys = [],
}: {
  title: string;
  closeLabel: string;
  /** What each key does, in the reader's language. */
  labels: {
    search: string;
    create: string;
    edit: string;
    help: string;
    close: string;
    /** Up and Down between the rows of a table on the page. */
    rows?: string;
    /** Enter on a row. */
    open?: string;
  };
  appKeys?: AppShortcut[];
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
      if (el) page.push({ keys: [key], what: shortcutLabel(el) || what });
    }
    if (labels.rows && document.querySelector(rowControls)) {
      page.push({ keys: ["↑", "↓"], what: labels.rows });
      if (labels.open) page.push({ keys: ["Enter"], what: labels.open });
    }
    setRows([...appKeys, ...page, { keys: ["?"], what: labels.help }, { keys: ["Esc"], what: labels.close }]);
  });
  return (
    <Modal open={rows !== null} onClose={() => setRows(null)} labelledBy={titleId}>
      <ModalFrame>
        <ModalContent>
          <ModalTitle id={titleId}>{title}</ModalTitle>
          <ModalBody>
            <dl className="di-shortcut-help">
              {(rows ?? []).map((r) => (
                <div key={r.keys.join(" ")} className="di-shortcut-help-row">
                  <dt>
                    {r.keys.map((key) => (
                      <Kbd key={key}>{key.length === 1 ? key.toUpperCase() : key}</Kbd>
                    ))}
                  </dt>
                  <dd>{r.what}</dd>
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
