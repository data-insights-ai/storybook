import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { SegmentedControl } from "./SegmentedControl";

const meta = {
  title: "Forms/SegmentedControl",
  component: SegmentedControl,
  tags: ["autodocs"],
  args: {
    name: "density",
    legend: "Row density",
    value: "dense",
    disabled: false,
    options: [
      { value: "dense", label: "dense" },
      { value: "standard", label: "standard" },
      { value: "comfort", label: "comfort" },
    ],
    onChange: fn(),
  },
  argTypes: {
    name: { control: "text" },
    legend: { control: "text" },
    value: { control: "text" },
    disabled: { control: "boolean" },
    options: { control: false },
  },
  render: function Render(args) {
    const [value, setValue] = useState(args.value);
    return (
      <SegmentedControl
        {...args}
        value={value}
        onChange={(next) => {
          setValue(next);
          args.onChange(next);
        }}
      />
    );
  },
} satisfies Meta<typeof SegmentedControl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByLabelText("comfort"));
    await expect(args.onChange).toHaveBeenCalledWith("comfort");
  },
};

/** Two segments: the shortest a segmented control should get. */
export const Pair: Story = {
  args: {
    name: "unit",
    legend: "Unit",
    value: "abs",
    options: [
      { value: "abs", label: "count" },
      { value: "pct", label: "percent" },
    ],
  },
};

/** Four is the longest. Anything past that is a select. */
export const Four: Story = {
  args: {
    name: "window",
    legend: "Window",
    value: "24h",
    options: [
      { value: "1h", label: "1h" },
      { value: "24h", label: "24h" },
      { value: "7d", label: "7d" },
      { value: "30d", label: "30d" },
    ],
  },
};

export const Disabled: Story = {
  args: { disabled: true },
};
