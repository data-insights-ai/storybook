import { createContext, useContext, useLayoutEffect, type ReactNode } from "react";

/** How much air the components carry. `comfortable` is the default. */
export type Density = "comfortable" | "compact";

export const densityChoices: readonly Density[] = ["comfortable", "compact"];

type DensityState = { density: Density; setDensity: (next: Density) => void };

const DensityContext = createContext<DensityState>({ density: "comfortable", setDensity: () => {} });

/**
 * Sets the density of every component from a value the app owns: the
 * person's preference, kept in their profile like the theme. It writes
 * `data-density` on the root before the first paint; `onChange` is where
 * the app saves a new choice, so a control anywhere below can change it
 * through `useDensity`.
 *
 * Density is not size: a `Button size="lg"` stays the larger button in
 * either density. A region that must differ from the person's choice (a
 * dense log inside a comfortable page) sets `data-density` on its own
 * element; on a touch screen compact never shrinks a hit area below 40px.
 */
export function DensityProvider({
  value = "comfortable",
  onChange,
  children,
}: {
  value?: Density;
  /** Called with the person's new choice; the app persists it and passes it back as `value`. */
  onChange?: (next: Density) => void;
  children: ReactNode;
}) {
  useLayoutEffect(() => {
    const root = document.documentElement;
    const before = root.getAttribute("data-density");
    root.setAttribute("data-density", value);
    return () => {
      if (before === null) root.removeAttribute("data-density");
      else root.setAttribute("data-density", before);
    };
  }, [value]);

  return (
    <DensityContext.Provider value={{ density: value, setDensity: (next) => onChange?.(next) }}>
      {children}
    </DensityContext.Provider>
  );
}

/** The density in force, and the setter that hands a new choice to the app to persist. */
export function useDensity(): DensityState {
  return useContext(DensityContext);
}
