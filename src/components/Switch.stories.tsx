import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { Switch } from "./Switch";

const meta = {
  title: "Forms/Switch",
  component: Switch,
  tags: ["autodocs"],
  args: {
    id: "demo-data",
    on: false,
    title: "Demo data",
    description: "",
    disabled: false,
    onToggle: fn(),
  },
  argTypes: {
    id: { control: "text" },
    on: { control: "boolean" },
    title: { control: "text" },
    description: { control: "text" },
    disabled: { control: "boolean" },
  },
  render: function Render(args) {
    const [on, setOn] = useState(args.on);
    return (
      <div style={{ maxWidth: 380 }}>
        <Switch
          {...args}
          on={on}
          onToggle={(next) => {
            setOn(next);
            args.onToggle(next);
          }}
        />
      </div>
    );
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Off: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const control = canvas.getByRole("switch", { name: "Demo data" });
    await expect(control).toHaveAttribute("aria-checked", "false");
    await userEvent.click(control);
    await expect(args.onToggle).toHaveBeenCalledWith(true);
  },
};

export const On: Story = {
  args: { on: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("switch", { name: "Demo data" })).toHaveAttribute("aria-checked", "true");
  },
};

export const WithDescription: Story = {
  args: {
    on: true,
    description: "Records on this page are samples. Nothing here is sealed.",
  },
};

export const Disabled: Story = {
  args: { disabled: true, description: "Fixed by the workspace policy." },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("switch", { name: "Demo data" })).toBeDisabled();
  },
};

export const DisabledOn: Story = {
  args: { disabled: true, on: true, description: "Fixed by the workspace policy." },
};
