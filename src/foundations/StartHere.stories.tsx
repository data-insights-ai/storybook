import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { CodeBlock, Grid, Panel, PanelFooter, PanelLead, PanelNote, Stack, TextLink } from "../index";
import { Doc } from "./guide/Doc";
import { groups } from "./start/groups";
import "./start/Start.css";

const install = `pnpm add @data-insights-ai/ui
import { Button, Panel } from "@data-insights-ai/ui";`;

/* The story files that exist, as the ids Storybook gives them: the folder path, lower case, joined by "-". */
const storyFolders = Object.keys(import.meta.glob("../components/**/*.stories.tsx")).map((file) =>
  file.replace("../components/", "").split("/").slice(0, -1).join("-").toLowerCase(),
);

function StartPage() {
  return (
    <Doc title="Start here" lede="The components of the datAInsights products, grouped by the job they do.">
      <Panel title="Install" heading={2}>
        <CodeBlock label="Install and import">{install}</CodeBlock>
        <PanelNote>Import @data-insights-ai/ui/styles.css once, at the root of the app.</PanelNote>
      </Panel>
      <Grid min="300px" gap={16}>
        {groups.map(({ group, question, path, example }) => (
          <Panel key={group} title={group} heading={2} className="di-start-group">
            <PanelLead>{question}</PanelLead>
            <Stack gap={8}>{example}</Stack>
            <PanelFooter>
              <TextLink href={`./?path=/${path}`} target="_top">
                Open {group}
              </TextLink>
            </PanelFooter>
          </Panel>
        ))}
      </Grid>
    </Doc>
  );
}

const meta = {
  title: "Foundations/Start here",
  tags: ["layer:foundation"],
  parameters: { layout: "fullscreen" },
} satisfies Meta;
export default meta;

/** Fourteen group tiles, each opening a component that exists in its own group; the code sample stays in its frame. */
export const StartHere: StoryObj = {
  name: "Start here",
  render: () => <StartPage />,
  play: async ({ canvasElement }) => {
    const tiles = Array.from(canvasElement.querySelectorAll<HTMLElement>(".di-start-group"));
    await expect(tiles).toHaveLength(14);
    for (const tile of tiles) {
      const group = tile.querySelector("h2")!.textContent!.toLowerCase();
      const id = new URL([...tile.querySelectorAll("a")].at(-1)!.href).searchParams
        .get("path")!
        .split("/")[2]
        .split("--")[0];
      await expect(id.startsWith(`${group}-`)).toBe(true);
      await expect(storyFolders).toContain(id);
    }
    for (const code of canvasElement.querySelectorAll<HTMLElement>(".di-codeblock-scroll")) {
      await expect(code.scrollWidth).toBeLessThanOrEqual(code.clientWidth + 1);
    }
  },
};
