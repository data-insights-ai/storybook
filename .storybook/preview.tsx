import type { Preview } from "@storybook/react-vite";
import { withThemeByDataAttribute } from "@storybook/addon-themes";
import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { create } from "storybook/theming";
import "../src/styles.css";
import "./preview.css";

const docsTheme = create({
  base: "light",
  brandTitle: "datAInsights",
  brandUrl: "https://www.data-insights.ai",
  brandImage: "./mark.svg",
  colorPrimary: "#0a1f44",
  colorSecondary: "#7c5f17",
  appBg: "#f7f4ec",
  appContentBg: "#fbf8f1",
  appBorderColor: "#e0dbd1",
  textColor: "#0e1528",
  textMutedColor: "#5a5348",
  fontBase: '"IBM Plex Sans", "Helvetica Neue", sans-serif',
  fontCode: '"IBM Plex Mono", ui-monospace, monospace',
});

const preview: Preview = {
  parameters: {
    layout: "padded",
    backgrounds: { disable: true },
    docs: {
      theme: docsTheme,
      codePanel: true,
    },
    options: {
      storySort: {
        order: [
          "Introduction",
          "Foundations",
          ["Essence", "Voice", "Color", "Type", "Logo", "Mark", "Practice", "Surfaces"],
          "Components",
          "Patterns",
          "Screens",
        ],
      },
    },
    a11y: { test: "error" },
    controls: { exclude: /^on[A-Z].*/ },
    actions: { argTypesRegex: "^on[A-Z].*" },
    viewport: {
      options: {
        desk: {
          name: "Console (1280)",
          styles: { width: "1280px", height: "900px" },
        },
        wide: {
          name: "Wide (1440)",
          styles: { width: "1440px", height: "960px" },
        },
      },
    },
  },
  decorators: [
    withThemeByDataAttribute({
      themes: { light: "light", dark: "dark" },
      defaultTheme: "light",
      attributeName: "data-theme",
    }),
    (Story, context) =>
      context.parameters.layout === "fullscreen" ? (
        <Story />
      ) : (
        <StoryCanvas title={context.title} name={context.name}>
          <Story />
        </StoryCanvas>
      ),
  ],
};

export default preview;

/** One main, and an h1 when the story does not already render one. */
function StoryCanvas({
  title,
  name,
  children,
}: {
  title: string;
  name: string;
  children: ReactNode;
}) {
  const body = useRef<HTMLDivElement>(null);
  const [labelled, setLabelled] = useState(false);
  useLayoutEffect(() => {
    setLabelled(Boolean(body.current?.querySelector("h1")));
  });
  return (
    <main>
      {labelled ? null : (
        <h1 className="di-sr">
          {title}: {name}
        </h1>
      )}
      <div ref={body}>{children}</div>
    </main>
  );
}
