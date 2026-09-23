import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Channel } from "./Channel";
import { KeyValue, KeyValues } from "./Metric";
import { StatusPill } from "./StatusPill";

const meta = {
  title: "Blocks/Channel",
  component: Channel,
  tags: ["autodocs"],
  args: {
    title: "registry.example.org",
    status: null,
    value: "1,842",
    children: null,
  },
  argTypes: {
    title: { control: "text" },
    status: { control: false },
    value: { control: false },
    children: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 300 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Channel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Running: Story = {
  render: (args) => <Channel {...args} status={<StatusPill tone="ok">running</StatusPill>} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("running")).toBeVisible();
  },
};

export const Paused: Story = {
  args: { title: "feed.example.io", value: "744" },
  render: (args) => <Channel {...args} status={<StatusPill tone="warn">paused</StatusPill>} />,
};

export const Failed: Story = {
  args: { title: "archive.example.com", value: "—" },
  render: (args) => <Channel {...args} status={<StatusPill tone="danger">failed</StatusPill>} />,
};

/** With the terms behind the figure. */
export const WithSpecs: Story = {
  render: (args) => (
    <Channel {...args} status={<StatusPill tone="ok">running</StatusPill>}>
      <KeyValues>
        <KeyValue term="Kind" value="Registry" />
        <KeyValue term="Manifest" value="a4f9c21e" />
        <KeyValue term="Last seen" value="09:12:04Z" />
      </KeyValues>
    </Channel>
  ),
};
