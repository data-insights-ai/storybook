import type { Meta, StoryObj } from "@storybook/react-vite";
import { Laptop, Smartphone } from "lucide-react";
import { expect, within } from "storybook/test";
import { Button } from "./Button";
import { Icon } from "./Icon";
import { IconTile } from "./IconTile";
import { Session, SessionAction, SessionMark, SessionTag } from "./Session";
import { StatusPill } from "./StatusPill";

const meta = {
  title: "Blocks/Session",
  component: Session,
  tags: ["autodocs"],
  args: {
    name: "MacBook Pro · Vienna",
    detail: "Last seen 09:12:04Z · 10.4.2.18",
    children: null,
  },
  argTypes: {
    name: { control: "text" },
    detail: { control: "text" },
    children: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 440 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Session>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The session the operator is reading this on. */
export const Current: Story = {
  render: (args) => (
    <Session {...args}>
      <SessionMark>
        <IconTile tone="inverse">
          <Icon size={16} label="Laptop">
            <Laptop aria-hidden />
          </Icon>
        </IconTile>
      </SessionMark>
      <SessionTag>
        <StatusPill tone="ok">this device</StatusPill>
      </SessionTag>
    </Session>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("this device")).toBeVisible();
  },
};

/** Another session, with the way to end it. */
export const Other: Story = {
  args: { name: "iPhone · Graz", detail: "Last seen 2026-09-21T18:40:11Z · 10.4.9.71" },
  render: (args) => (
    <Session {...args}>
      <SessionMark>
        <IconTile>
          <Icon size={16} label="Phone">
            <Smartphone aria-hidden />
          </Icon>
        </IconTile>
      </SessionMark>
      <SessionAction>
        <Button variant="danger" size="dense">
          End session
        </Button>
      </SessionAction>
    </Session>
  ),
};

/** A list, which is the only way sessions are actually read. */
export const List: Story = {
  parameters: { controls: { disable: true } },
  decorators: [],
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 440 }}>
      <Session name="MacBook Pro · Vienna" detail="Last seen 09:12:04Z · 10.4.2.18">
        <SessionMark>
          <IconTile tone="inverse">
            <Icon size={16} label="Laptop">
              <Laptop aria-hidden />
            </Icon>
          </IconTile>
        </SessionMark>
        <SessionTag>
          <StatusPill tone="ok">this device</StatusPill>
        </SessionTag>
      </Session>
      <Session name="iPhone · Graz" detail="Last seen 2026-09-21T18:40:11Z · 10.4.9.71">
        <SessionMark>
          <IconTile>
            <Icon size={16} label="Phone">
              <Smartphone aria-hidden />
            </Icon>
          </IconTile>
        </SessionMark>
        <SessionAction>
          <Button variant="danger" size="dense">
            End session
          </Button>
        </SessionAction>
      </Session>
    </div>
  ),
};
