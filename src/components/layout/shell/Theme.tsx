import { createContext, useContext, useLayoutEffect, useSyncExternalStore, type ReactNode } from "react";

/** What a person chose: follow the device, or always one of the two sheets. */
export type ThemeChoice = "auto" | "light" | "dark";
/** The sheet that shows. */
export type ResolvedTheme = "light" | "dark";

export const themeChoices: readonly ThemeChoice[] = ["auto", "light", "dark"];

type ThemeState = { choice: ThemeChoice; resolved: ResolvedTheme };

const ThemeContext = createContext<ThemeState>({ choice: "auto", resolved: "light" });

const darkDevice = "(prefers-color-scheme: dark)";

function subscribe(change: () => void) {
  const query = window.matchMedia(darkDevice);
  query.addEventListener("change", change);
  return () => query.removeEventListener("change", change);
}

function prefersDark() {
  return window.matchMedia(darkDevice).matches;
}

/**
 * Themes the document from a value the app owns (the person's preference,
 * not browser storage). The sheet is set on the root before the first paint,
 * and "auto" follows the device as it changes. Mount it above everything the
 * app draws, the start-up loader included, so nothing paints in the wrong
 * sheet; the root's `data-theme="auto"` in the page keeps the ground right
 * until then.
 */
export function ThemeProvider({ value = "auto", children }: { value?: ThemeChoice; children: ReactNode }) {
  const dark = useSyncExternalStore(subscribe, prefersDark, () => false);
  const resolved: ResolvedTheme = value === "auto" ? (dark ? "dark" : "light") : value;

  useLayoutEffect(() => {
    const root = document.documentElement;
    const before = root.getAttribute("data-theme");
    root.setAttribute("data-theme", resolved);
    return () => {
      if (before === null) root.removeAttribute("data-theme");
      else root.setAttribute("data-theme", before);
    };
  }, [resolved]);

  return <ThemeContext.Provider value={{ choice: value, resolved }}>{children}</ThemeContext.Provider>;
}

/** The theme in force: the person's choice and the sheet it resolves to. */
export function useTheme(): ThemeState {
  return useContext(ThemeContext);
}
