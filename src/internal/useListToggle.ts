import { useRef, type MouseEvent, type RefObject } from "react";

// A plain button opens and closes a combo box's list. Base UI's trigger renders
// as the combobox itself until its input has registered, and opens a frame
// after a mouse press; this one opens in the press and keeps focus in the input.
export function useListToggle(input: RefObject<HTMLInputElement | null>, toggle: () => void) {
  const pressed = useRef(false);
  return {
    type: "button" as const,
    tabIndex: -1,
    onMouseDown(event: MouseEvent) {
      if (event.button !== 0) return;
      event.preventDefault();
      pressed.current = true;
      input.current?.focus();
      toggle();
    },
    onClick() {
      if (pressed.current) {
        pressed.current = false;
        return;
      }
      input.current?.focus();
      toggle();
    },
  };
}
