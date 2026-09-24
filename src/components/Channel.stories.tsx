import type { Meta, StoryObj } from "@storybook/react-vite";
import { Mail } from "lucide-react";
import { expect, within } from "storybook/test";
import { Channel, ChannelSpecs, ChannelStatus, ChannelValue } from "./Channel";
import { StatusPill } from "./StatusPill";
import { KeyValue, KeyValues } from "./KeyValues";

const meta = {
  title: "Blocks/Channel",
  component: Channel,
  tags: ["autodocs"],
  args: {
    title: "registry.example.org",
    children: null,
  },
  argTypes: {
    title: { control: "text" },
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

/**
 * `title` is text, so it is a prop. The state, the value and the terms
 * each hold components, so they are slots.
 */
export const Running: Story = {
  render: (args) => (
    <Channel {...args}>
      <ChannelStatus>
        <StatusPill tone="ok">running</StatusPill>
      </ChannelStatus>
      <ChannelValue>1,842</ChannelValue>
    </Channel>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("running")).toBeVisible();
  },
};

export const Paused: Story = {
  args: { title: "feed.example.io" },
  render: (args) => (
    <Channel {...args}>
      <ChannelStatus>
        <StatusPill tone="warn">paused</StatusPill>
      </ChannelStatus>
      <ChannelValue>744</ChannelValue>
    </Channel>
  ),
};

export const Failed: Story = {
  args: { title: "archive.example.com" },
  render: (args) => (
    <Channel {...args}>
      <ChannelStatus>
        <StatusPill tone="danger">failed</StatusPill>
      </ChannelStatus>
      <ChannelValue>—</ChannelValue>
    </Channel>
  ),
};

/** The value takes an icon as readily as a figure. That is why it is a slot. */
export const WithIcon: Story = {
  args: { title: "Email notifications" },
  render: (args) => (
    <Channel {...args}>
      <ChannelStatus>
        <StatusPill tone="ok">enabled</StatusPill>
      </ChannelStatus>
      <ChannelValue>
        <Mail aria-hidden />
        n****@data-insights.ai
      </ChannelValue>
    </Channel>
  ),
};

/** With the terms behind the figure. */
export const WithSpecs: Story = {
  render: (args) => (
    <Channel {...args}>
      <ChannelStatus>
        <StatusPill tone="ok">running</StatusPill>
      </ChannelStatus>
      <ChannelValue>1,842</ChannelValue>
      <ChannelSpecs>
        <KeyValues>
          <KeyValue term="Kind" value="Registry" />
          <KeyValue term="Manifest" value="a4f9c21e" />
          <KeyValue term="Last seen" value="09:12:04Z" />
        </KeyValues>
      </ChannelSpecs>
    </Channel>
  ),
};
