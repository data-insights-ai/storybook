import { createContext } from "react";

/** Set by `FigureRow`: inside its list a figure is one term group, not a list of its own. */
export const InFigureList = createContext(false);
