import { useCallback, useId, useLayoutEffect, useRef, type KeyboardEvent, type ReactNode } from "react";
import { Search, ShieldCheck } from "lucide-react";
import { takeSlot } from "../../../internal/slots";
import { Kbd } from "../../text/Kbd";
import { CommandListContext } from "./commandList";
import { CommandEmpty } from "./CommandRow";
import "./CommandBar.css";

export { CommandEmpty, CommandGroup, CommandRow } from "./CommandRow";

/** One entry of the key legend: the key as it is printed on the cap, and what it does. */
export type CommandHint = { keys: string; label: string };

function keyAndWord(hint: string | CommandHint): CommandHint {
  if (typeof hint !== "string") return hint;
  const space = hint.indexOf(" ");
  return space < 0 ? { keys: hint, label: "" } : { keys: hint.slice(0, space), label: hint.slice(space + 1) };
}

/**
 * One field for going somewhere, finding a record and asking a question.
 *
 * - **Use it** as the app's ⌘K palette, rendered by the caller in a dialog
 *   over the page; on its own it is the panel only.
 * - **Not** for filtering a list in place (`SearchField` in the list's
 *   `Toolbar`), for choosing a value in a form (`ComboBox`), or for a row's
 *   actions (`Menu`).
 *
 * Anatomy: three zones a step apart in tone. The field (magnifier, query,
 * the `esc` key) on the ground's tone; the results as `CommandGroup`s of
 * `CommandRow`s, or one `CommandEmpty` when nothing matched, on the
 * plane's surface; then the foot, a quiet strip a step lower, with the key
 * legend (each key a `Kbd` and its word) and, at its end, where the query
 * is processed.
 *
 * Accessibility: the field is a combobox that owns a listbox. Focus stays in
 * the field; Up and Down move the highlighted row (and wrap), Home and End
 * jump to the first and last, Enter chooses the highlighted row. The rows are
 * options, announced through `aria-activedescendant`; typing highlights the
 * first row again. The key legend is hidden on a touch screen, which has no
 * keys to press.
 */
export function CommandBar({
  id = "command",
  label,
  placeholder,
  value,
  onValueChange,
  hints,
  privacyNote,
  children,
}: {
  id?: string;
  /** Names the field and its list. The magnifier alone does not. */
  label: string;
  placeholder: string;
  value: string;
  onValueChange: (value: string) => void;
  /**
   * The key legend along the foot. A string is the key, a space, then its
   * word ("↑↓ move", "esc schließen"); an object names both where the key
   * itself holds a space.
   */
  hints: Array<string | CommandHint>;
  /** Where the query is processed. Stated, not implied. */
  privacyNote: string;
  /** `CommandGroup`s of `CommandRow`s, or one `CommandEmpty`. */
  children: ReactNode;
}) {
  const listId = useId();
  const list = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLInputElement>(null);
  const active = useRef("");
  const query = useRef(value);
  const [empty, rows] = takeSlot(children, CommandEmpty);

  const options = useCallback(
    () => Array.from(list.current?.querySelectorAll<HTMLElement>('[role="option"]') ?? []),
    [],
  );

  // The highlight lives in the DOM, the way aria-activedescendant does: the
  // rows are the caller's, so only the rendered list knows which exist.
  const highlight = useCallback(
    (id: string) => {
      const all = options();
      const next = all.find((option) => option.id === id) ?? all[0];
      active.current = next?.id ?? "";
      for (const option of all) {
        option.setAttribute("aria-selected", String(option === next));
        option.toggleAttribute("data-highlighted", option === next);
      }
      const input = field.current;
      if (!input) return;
      input.setAttribute("aria-expanded", String(next !== undefined));
      if (next) input.setAttribute("aria-activedescendant", next.id);
      else input.removeAttribute("aria-activedescendant");
    },
    [options],
  );

  // After every render: a new query starts at the first row again, and rows
  // that came or went keep a highlight that exists.
  useLayoutEffect(() => {
    const fresh = query.current !== value;
    query.current = value;
    highlight(fresh ? "" : active.current);
  });

  function move(event: KeyboardEvent<HTMLInputElement>) {
    const all = options();
    if (all.length === 0) return;
    const at = all.findIndex((option) => option.id === active.current);
    let next: HTMLElement | undefined;
    if (event.key === "ArrowDown") next = all[(at + 1) % all.length];
    else if (event.key === "ArrowUp") next = all[at <= 0 ? all.length - 1 : at - 1];
    else if (event.key === "Home") next = all[0];
    else if (event.key === "End") next = all[all.length - 1];
    else if (event.key === "Enter" && at >= 0) {
      event.preventDefault();
      all[at].click();
      return;
    } else return;
    event.preventDefault();
    highlight(next.id);
    next.scrollIntoView({ block: "nearest" });
  }

  return (
    <div className="di-command">
      <div className="di-command-input">
        <Search className="di-command-icon" aria-hidden />
        <label className="di-sr" htmlFor={id}>
          {label}
        </label>
        <input
          id={id}
          className="di-command-field"
          type="text"
          ref={field}
          role="combobox"
          aria-expanded={false}
          aria-controls={listId}
          aria-autocomplete="list"
          autoComplete="off"
          placeholder={placeholder}
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
          onKeyDown={move}
        />
        <Kbd>esc</Kbd>
      </div>
      <CommandListContext.Provider value={highlight}>
        <div ref={list} id={listId} className="di-command-list" role="listbox" aria-label={label}>
          {rows}
        </div>
      </CommandListContext.Provider>
      <div className="di-command-status" role="status">
        {empty}
      </div>
      <div className="di-command-foot">
        <span className="di-command-hints">
          {hints.map(keyAndWord).map(({ keys, label: word }) => (
            <span key={keys + word} className="di-command-hint">
              <Kbd>{keys}</Kbd>
              {word}
            </span>
          ))}
        </span>
        <span className="di-command-privacy">
          <ShieldCheck aria-hidden />
          {privacyNote}
        </span>
      </div>
    </div>
  );
}
