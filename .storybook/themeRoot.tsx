import type { Decorator } from "@storybook/react-vite";
import { resolveMode } from "./theme";

let applied = "";

/**
 * Sets the toolbar's theme on the document while the story renders, once per
 * story and theme. A Storybook effect would run only after the play
 * function, so a story showed in daylight until its play ended. Once set, a
 * re-render leaves the root alone, so a story's own `ThemeProvider` keeps
 * the theme it chose.
 */
export const withThemeRoot: Decorator = (Story, context) => {
  const theme = resolveMode(context.globals.theme);
  const key = `${context.id} ${theme}`;
  if (key !== applied || !document.documentElement.hasAttribute("data-theme")) {
    applied = key;
    document.documentElement.setAttribute("data-theme", theme);
  }
  return <Story />;
};
