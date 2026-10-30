import { createContext, useContext } from "react";

/** Moves the highlight to the option with this id, as the pointer does. */
export const CommandListContext = createContext<(id: string) => void>(() => undefined);

export function useCommandHighlight() {
  return useContext(CommandListContext);
}
