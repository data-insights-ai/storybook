import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Stack } from "../../layout/arrange/Stack";
import { Page } from "../../layout/page/Page";
import { PageHeader, PageHeaderTitle } from "../../layout/page/PageHeader";
import { Panel } from "../../layout/page/Panel";
import { MetaLine } from "../MetaLine";
import { Highlight } from "./Highlight";

const meta = {
  title: "Text/Highlight",
  component: Highlight,
  tags: ["layer:primitive", "autodocs"],
  args: { variant: "passage", children: "without a new source" },
  argTypes: {
    variant: { control: "radio", options: ["passage", "figure"] },
    children: { control: "text" },
  },
} satisfies Meta<typeof Highlight>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A search matched a term: each result marks where, in its name and in the
 * line under it, so the eye finds why the row is here. The mark is the
 * selection tint under full ink, one weight step above the words around
 * it; no edge, because a frame around words reads as a control.
 */
export const SearchMatch: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Panel title="Results for “vienna”" heading={2}>
      <Stack gap={16}>
        <Stack gap={8}>
          <span>
            ws-<Highlight variant="figure">vienna</Highlight>-014.corp.example
          </span>
          <MetaLine items={["Workstation", "last seen 09:12"]} />
        </Stack>
        <Stack gap={8}>
          <span>
            Branch office <Highlight>Vienna</Highlight> uplink
          </span>
          <MetaLine items={["Network segment", "14 hosts"]} />
        </Stack>
      </Stack>
    </Panel>
  ),
  play: async ({ canvasElement }) => {
    const marks = canvasElement.querySelectorAll<HTMLElement>("mark");
    await expect(marks).toHaveLength(2);
    const panel = canvasElement.querySelector<HTMLElement>(".di-surface")!;
    for (const mark of marks) {
      const style = getComputedStyle(mark);
      await expect(style.boxShadow).toBe("none");
      await expect(style.outlineStyle).toBe("none");
      await expect(style.borderStyle).toBe("none");
      await expect(Number(style.fontWeight)).toBeGreaterThan(Number(getComputedStyle(mark.parentElement!).fontWeight));
      await expect(style.backgroundColor).not.toBe(getComputedStyle(panel).backgroundColor);
    }
  },
};

/**
 * A passage: the words a brand page's title is about. The tint follows each
 * line when the title wraps and stops short of the line above.
 */
export const Passage: Story = {
  render: (args) => (
    <Page width="full">
      <PageHeader tier="brand">
        <PageHeaderTitle>
          Coverage rose <Highlight {...args} />
        </PageHeaderTitle>
      </PageHeader>
    </Page>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const mark = canvas.getByText("without a new source");
    await expect(mark.tagName).toBe("MARK");
    await expect(canvasElement.querySelectorAll("mark")).toHaveLength(1);
  },
};

/** The figure a sentence turns on, in a panel's summary, with tabular figures. */
export const Figure: Story = {
  args: { variant: "figure", children: "94%" },
  render: (args) => (
    <Panel title="Coverage this week" heading={2}>
      <p style={{ margin: 0, maxWidth: "var(--di-measure-prose)" }}>
        Coverage rose to <Highlight {...args} /> this week, the highest since the workspace was set up.
      </p>
    </Panel>
  ),
};

/** German runs longer: the tint still sits under each line of the wrapped passage. */
export const German: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Page width="full">
      <div lang="de">
        <PageHeader tier="brand">
          <PageHeaderTitle>
            Die Abdeckung stieg <Highlight>ohne eine einzige neue Datenquelle</Highlight>
          </PageHeaderTitle>
        </PageHeader>
      </div>
    </Page>
  ),
};
