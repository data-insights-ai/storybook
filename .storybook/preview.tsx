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
  colorSecondary: "#7a5c0e",
  appBg: "#f4f1e8",
  appContentBg: "#fcfbf7",
  appBorderColor: "#dcd5c3",
  textColor: "#0a1f44",
  textMutedColor: "#4a5570",
  fontBase: '"Space Grotesk", "Helvetica Neue", sans-serif',
  fontCode: '"JetBrains Mono", ui-monospace, monospace',
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
      /*
       * The sections run in a fixed order, and Foundations keeps its curated
       * one because those pages are meant to be read top to bottom. The rest
       * sort alphabetically by title rather than by file name: Choice.stories
       * is titled Checkbox and Heading.stories is PageHeader, so file order
       * puts both in the wrong place.
       *
       * Storybook reads this function out of the file and evaluates it on its
       * own, so it has to be plain JavaScript and carry its own lists —
       * a type annotation or an outer reference breaks the indexer.
       */
      storySort: (a, b) => {
        const sections = [
          "Introduction",
          "Foundations",
          "Primitives",
          "Forms",
          "Blocks",
          "Patterns",
          "Screens",
        ];
        // Read top to bottom: what the system is, then what it is made of,
        // then how it is applied, and last the reasoning behind all of it.
        // "Decisions" argues about other products rather than specifying
        // this one, so it no longer sits third, ahead of colour and type.
        const foundations = [
          "Essence",
          "Register",
          "Voice",
          "Color",
          "Type",
          "Scale",
          "Logo",
          "Mark",
          "Practice",
          "Surfaces",
          "Decisions",
        ];
        // Listed items sort in list order; anything unlisted falls to the end.
        const rank = (list, value) => {
          const index = list.indexOf(value);
          return index === -1 ? list.length : index;
        };

        // Equal titles compare as 0, so the stories inside one component keep
        // the order their file declares.
        if (a.title === b.title) return 0;

        const [aSection, aName = ""] = a.title.split("/");
        const [bSection, bName = ""] = b.title.split("/");

        const section = rank(sections, aSection) - rank(sections, bSection);
        if (section !== 0) return section;
        if (aSection !== bSection) return aSection.localeCompare(bSection, "en");

        if (aSection === "Foundations") {
          const curated = rank(foundations, aName) - rank(foundations, bName);
          if (curated !== 0) return curated;
        }

        return a.title.localeCompare(b.title, "en", { numeric: true, sensitivity: "base" });
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
