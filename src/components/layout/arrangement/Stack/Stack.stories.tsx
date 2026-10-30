import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Fact, FactList } from "../../../data/records/FactList";
import { Notice, NoticeBody, NoticeText, NoticeTitle } from "../../../feedback/Notice";
import { Panel } from "../../page/Panel";
import { SectionTitle, SectionTitleHeading } from "../../page/SectionTitle";
import { Stack } from "./Stack";

const meta = {
  title: "Layout/Arrangement/Stack",
  component: Stack,
  tags: ["layer:pattern", "autodocs"],
  args: { gap: 24, children: null },
  argTypes: {
    gap: { control: "select", options: [8, 12, 16, 24, 32, 48, 64, 96] },
    children: { control: false },
  },
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

/** One section of a screen: its title, then its panels at 24, so the page sees it as one block. */
export const Default: Story = {
  render: (args) => (
    <Stack {...args}>
      <SectionTitle lede="Where events come from, and whether they still arrive.">
        <SectionTitleHeading>Collection</SectionTitleHeading>
      </SectionTitle>
      <Panel title="Graz office">
        <FactList layout="columns">
          <Fact label="Last event">2 min ago</Fact>
          <Fact label="Events today">48,120</Fact>
        </FactList>
      </Panel>
      <Panel title="Linz branch">
        <FactList layout="columns">
          <Fact label="Last event">3 h ago</Fact>
          <Fact label="Events today">1,204</Fact>
        </FactList>
      </Panel>
    </Stack>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { name: "Collection" })).toBeVisible();
  },
};

/**
 * Inside a panel the blocks are 16 apart: a notice, then the facts it is
 * about. `gap` is named by the value it sets, so a wrong number shows up in
 * the diff rather than behind a word like "loose".
 */
export const InAPanel: Story = {
  name: "In a panel",
  args: { gap: 16 },
  render: (args) => (
    <Panel title="Linz branch">
      <Stack {...args}>
        <Notice tone="warn">
          <NoticeText>
            <NoticeTitle>No events for 3 hours</NoticeTitle>
            <NoticeBody>The collector is running, but its source stopped sending.</NoticeBody>
          </NoticeText>
        </Notice>
        <FactList layout="columns">
          <Fact label="Collector">2.14.0</Fact>
          <Fact label="Last event">09:12</Fact>
        </FactList>
      </Stack>
    </Panel>
  ),
};

/**
 * 64 and 96 are the brand tier. Below 48 the distance separates blocks;
 * above it the distance separates the parts of an argument, which is what
 * a brand page is made of.
 */
export const Brand: Story = {
  args: { gap: 64 },
  render: (args) => (
    <Stack {...args}>
      <SectionTitle tier="brand" eyebrow="One" lede="Every claim on a screen is tied to the source it came from.">
        <SectionTitleHeading>Each entry has a source.</SectionTitleHeading>
      </SectionTitle>
      <SectionTitle tier="brand" eyebrow="Two" lede="A source carries the time it was recorded, so a finding can be replayed.">
        <SectionTitleHeading>Each source has a timestamp.</SectionTitleHeading>
      </SectionTitle>
    </Stack>
  ),
};
