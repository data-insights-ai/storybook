import type { Meta, StoryObj } from "@storybook/react-vite";
import { Laptop, Smartphone } from "lucide-react";
import { expect, within } from "storybook/test";
import { Button } from "./Button";
import { Icon } from "./Icon";
import { IconTile } from "./IconTile";
import { Session } from "./Session";
import { StatusPill } from "./StatusPill";

const meta = {
  title: "Blocks/Session",
  component: Session,
  tags: ["autodocs"],
  args: {
    name: "MacBook Pro · Vienna",
    detail: "Last seen 09:12:04Z · 10.4.2.18",
    mark: null,
    action: null,
  },
  argTypes: {
    name: { control: false },
    detail: { control: "text" },
    mark: { control: false },
    action: { control: false },
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
    <Session
      {...args}
      mark={
        <IconTile tone="inverse">
          <Icon size={16} label="Laptop">
            <Laptop aria-hidden />
          </Icon>
        </IconTile>
      }
      name={
        <>
          MacBook Pro · Vienna <StatusPill tone="ok">this device</StatusPill>
        </>
      }
    />
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
    <Session
      {...args}
      mark={
        <IconTile>
          <Icon size={16} label="Phone">
            <Smartphone aria-hidden />
          </Icon>
        </IconTile>
      }
      action={
        <Button variant="danger" size="dense">
          End session
        </Button>
      }
    />
  ),
};

/** A list, which is the only way sessions are actually read. */
export const List: Story = {
  parameters: { controls: { disable: true } },
  decorators: [],
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 440 }}>
      <Session
        mark={
          <IconTile tone="inverse">
            <Icon size={16} label="Laptop">
              <Laptop aria-hidden />
            </Icon>
          </IconTile>
        }
        name={
          <>
            MacBook Pro · Vienna <StatusPill tone="ok">this device</StatusPill>
          </>
        }
        detail="Last seen 09:12:04Z · 10.4.2.18"
      />
      <Session
        mark={
          <IconTile>
            <Icon size={16} label="Phone">
              <Smartphone aria-hidden />
            </Icon>
          </IconTile>
        }
        name="iPhone · Graz"
        detail="Last seen 2026-09-21T18:40:11Z · 10.4.9.71"
        action={
          <Button variant="danger" size="dense">
            End session
          </Button>
        }
      />
    </div>
  ),
};
