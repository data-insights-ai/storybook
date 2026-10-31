import type { Preview } from "@storybook/react-vite";
import { DocsContainer, type DocsContainerProps } from "@storybook/addon-docs/blocks";
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { GLOBALS_UPDATED } from "storybook/internal/core-events";
import { brandTheme, resolveMode, type Mode } from "./theme";
import { withThemeRoot } from "./themeRoot";
import "../src/styles/styles.css";
import "./preview.css";

const preview: Preview = {
  globalTypes: {
    theme: {
      description: "Daylight or after dark",
      toolbar: {
        title: "Theme",
        icon: "mirror",
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
        dynamicTitle: true,
      },
    },
    density: {
      description: "How much air the components carry",
      toolbar: {
        title: "Density",
        icon: "component",
        items: [
          { value: "comfortable", title: "Comfortable" },
          { value: "compact", title: "Compact" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: resolveMode(undefined), density: "comfortable" },
  parameters: {
    layout: "padded",
    backgrounds: { disable: true },
    docs: {
      container: ThemedDocs,
      codePanel: true,
    },
    options: {
      /*
       * The sections run in a fixed order, and Foundations keeps its curated
       * one because those pages are meant to be read top to bottom. The rest
       * sort alphabetically by title, which mirrors the folder a component
       * lives in.
       *
       * Storybook reads this function out of the file and evaluates it on its
       * own, so it has to be plain JavaScript and carry its own lists —
       * a type annotation or an outer reference breaks the indexer.
       */
      storySort: (a, b) => {
        const sections = [
          "Foundations",
          "Actions",
          "Forms",
          "Tables",
          "Records",
          "Figures",
          "Text",
          "Status",
          "Feedback",
          "Charts",
          "Timelines",
          "Layout",
          "Navigation",
          "Overlays",
          "Shell",
          "Patterns",
        ];
        // Read top to bottom: where to start, the tokens, the look they make, the logo.
        const foundations = ["Start here", "Color", "Type", "Space and shape", "Our look", "Logo"];
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
        fullhd: {
          name: "Full HD (1920)",
          styles: { width: "1920px", height: "1080px" },
        },
        qhd: {
          name: "QHD (2560)",
          styles: { width: "2560px", height: "1440px" },
        },
        ultrawide: {
          name: "Ultrawide (3440)",
          styles: { width: "3440px", height: "1440px" },
        },
        phone: {
          name: "Phone (390)",
          styles: { width: "390px", height: "844px" },
        },
      },
    },
  },
  decorators: [
    withThemeRoot,
    (Story, context) => {
      document.documentElement.setAttribute("data-density", context.globals.density ?? "comfortable");
      return <Story />;
    },
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
function StoryCanvas({ title, name, children }: { title: string; name: string; children: ReactNode }) {
  const body = useRef<HTMLDivElement>(null);
  const [labelled, setLabelled] = useState(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- after every render, since the story may add or drop its own h1; an unchanged value does not render again
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

type GlobalsSource = { store?: { userGlobals?: { get?: () => Record<string, unknown> } } };

/** A docs page has no story decorator, so it sets the theme on the document itself and follows the toolbar. */
function ThemedDocs(props: DocsContainerProps) {
  const { context } = props;
  const [mode, setMode] = useState<Mode>(() =>
    resolveMode((context as unknown as GlobalsSource).store?.userGlobals?.get?.().theme),
  );
  useEffect(() => {
    const follow = ({ globals }: { globals: Record<string, unknown> }) => setMode(resolveMode(globals.theme));
    context.channel.on(GLOBALS_UPDATED, follow);
    return () => context.channel.off(GLOBALS_UPDATED, follow);
  }, [context]);
  useLayoutEffect(() => {
    document.documentElement.setAttribute("data-theme", mode);
  }, [mode]);
  return <DocsContainer {...props} theme={brandTheme(mode)} />;
}
