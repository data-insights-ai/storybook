import type { StoryContext } from "@storybook/react-vite";
import { expect, test } from "vitest";
import { withThemeRoot } from "./themeRoot";

const render = (id: string, theme: string) => {
  let seen: string | null = null;
  const Story = () => {
    seen = document.documentElement.getAttribute("data-theme");
    return null;
  };
  const element = withThemeRoot(Story as never, { id, globals: { theme } } as unknown as StoryContext) as {
    type: () => null;
  };
  element.type();
  return seen;
};

test("the theme is on the document before the story renders, not after its play", () => {
  document.documentElement.removeAttribute("data-theme");
  expect(render("a", "dark")).toBe("dark");
  expect(render("b", "light")).toBe("light");
  expect(render("b", "dark")).toBe("dark");
});

test("a re-render keeps the theme a story's ThemeProvider chose", () => {
  expect(render("c", "light")).toBe("light");
  document.documentElement.setAttribute("data-theme", "dark");
  expect(render("c", "light")).toBe("dark");
});
