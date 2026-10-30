import type { StoryContext } from "@storybook/react-vite";
import { expect, test } from "vitest";
import { withThemeRoot } from "./themeRoot";

test("the theme is on the document before the story renders, not after its play", () => {
  for (const theme of ["dark", "light"] as const) {
    document.documentElement.removeAttribute("data-theme");
    let seen: string | null = null;
    const Story = () => {
      seen = document.documentElement.getAttribute("data-theme");
      return null;
    };
    const element = withThemeRoot(Story as never, { globals: { theme } } as unknown as StoryContext) as {
      type: () => null;
    };
    element.type();
    expect(seen).toBe(theme);
  }
});
