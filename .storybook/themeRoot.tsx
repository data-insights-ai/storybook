import type { Decorator } from "@storybook/react-vite";
import { resolveMode } from "./theme";

/**
 * Sets the theme on the document while the story renders. The theme addon's
 * own decorator applies it in a Storybook effect, which runs only after the
 * play function has finished: a story with a play showed in daylight until
 * then, and stayed so when its play failed.
 */
export const withThemeRoot: Decorator = (Story, context) => {
  document.documentElement.setAttribute("data-theme", resolveMode(context.globals.theme));
  return <Story />;
};
