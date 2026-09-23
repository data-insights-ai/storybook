import type { Meta, StoryObj } from "@storybook/react-vite";
import { Boxes } from "lucide-react";
import { expect, within } from "storybook/test";
import { Button } from "./Button";
import { Icon } from "./Icon";
import { IconTile } from "./IconTile";
import { RecordCard, RecordLine } from "./RecordCard";
import { StatusPill } from "./StatusPill";

const meta = {
  title: "Blocks/RecordCard",
  component: RecordCard,
  tags: ["autodocs"],
  args: {
    title: "Registry sources",
    count: "1,842 entries",
    mark: null,
    status: null,
    children: null,
  },
  argTypes: {
    title: { control: "text" },
    count: { control: "text" },
    mark: { control: false },
    status: { control: false },
    footer: { control: false },
    children: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 320 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RecordCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const mark = (
  <IconTile tone="inverse">
    <Icon size={16} label="Sources">
      <Boxes aria-hidden />
    </Icon>
  </IconTile>
);

export const Default: Story = {
  render: (args) => (
    <RecordCard {...args} mark={mark} status={<StatusPill tone="ok">running</StatusPill>}>
      <RecordLine primary="registry.example.org" detail="09:12:04Z" />
      <RecordLine primary="mirror.example.net" detail="09:11:52Z" />
      <RecordLine primary="index.example.dev" detail="09:09:38Z" />
    </RecordCard>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { name: "Registry sources" })).toBeVisible();
  },
};

/** With a way into the full register. */
export const WithFooter: Story = {
  render: (args) => (
    <RecordCard
      {...args}
      mark={mark}
      status={<StatusPill tone="warn">1 paused</StatusPill>}
      footer={
        <Button variant="ghost" size="dense">
          Open the register
        </Button>
      }
    >
      <RecordLine primary="registry.example.org" detail="09:12:04Z" />
      <RecordLine primary="feed.example.io" detail="paused 08:47Z" />
      <RecordLine primary="index.example.dev" detail="09:09:38Z" />
    </RecordCard>
  ),
};

/** One line. The card holds its shape for a short record. */
export const SingleLine: Story = {
  args: { title: "Archive sources", count: "487 entries" },
  render: (args) => (
    <RecordCard {...args} mark={mark} status={<StatusPill tone="danger">failed</StatusPill>}>
      <RecordLine primary="archive.example.com" detail="failed 08:44Z" />
    </RecordCard>
  ),
};
