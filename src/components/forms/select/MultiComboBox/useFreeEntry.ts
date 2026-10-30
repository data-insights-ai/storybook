import type { ClipboardEvent, KeyboardEvent } from "react";

const separators = /[\s,;]+/;
const separatorKeys = new Set([",", ";", " "]);

/**
 * Typed text becoming entries: a separator (space, comma, semicolon) or
 * Enter turns the draft into an entry, a pasted list becomes one entry per
 * item, and Backspace in the empty input takes the last entry back into the
 * draft to correct it. `committed` reports whether a key was taken, so a
 * list around the input can leave Enter alone.
 */
export function useFreeEntry({
  values,
  onChange,
  draft,
  setDraft,
}: {
  values: readonly string[];
  onChange: (values: string[]) => void;
  draft: string;
  setDraft: (draft: string) => void;
}) {
  const add = (text: string) => {
    const next = text
      .split(separators)
      .map((v) => v.trim())
      .filter((v) => v !== "" && !values.includes(v));
    if (next.length > 0) onChange([...values, ...new Set(next)]);
  };
  const commit = () => {
    add(draft);
    setDraft("");
  };
  const keyDown = (event: KeyboardEvent<HTMLInputElement>, { listChoosing }: { listChoosing: boolean }) => {
    const ends = separatorKeys.has(event.key) || (event.key === "Enter" && !listChoosing);
    if (ends) {
      if (draft.trim() === "") {
        if (event.key !== "Enter") event.preventDefault();
        return false;
      }
      event.preventDefault();
      commit();
      return true;
    }
    if (event.key === "Backspace" && draft === "" && values.length > 0) {
      event.preventDefault();
      setDraft(values[values.length - 1]);
      onChange(values.slice(0, -1));
      return true;
    }
    return false;
  };
  const paste = (event: ClipboardEvent<HTMLInputElement>) => {
    const text = event.clipboardData.getData("text");
    if (!separators.test(text)) return;
    event.preventDefault();
    add(draft + text);
    setDraft("");
  };
  return { commit, keyDown, paste };
}
