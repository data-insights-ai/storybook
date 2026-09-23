import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { TabPanel, Tabs } from "./Tabs";

const meta = {
  title: "Blocks/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  args: {
    label: "Entry views",
    value: "record",
    items: [
      { value: "record", label: "Record" },
      { value: "sources", label: "Sources", badge: "12" },
      { value: "seals", label: "Seals", badge: "04" },
      { value: "log", label: "Log" },
      { value: "export", label: "Export", disabled: true },
    ],
    onChange: fn(),
  },
  argTypes: {
    label: { control: "text" },
    value: { control: "text" },
    items: { control: false },
  },
  render: function Render(args) {
    const [value, setValue] = useState(args.value);
    return (
      <div>
        <Tabs
          {...args}
          value={value}
          onChange={(next) => {
            setValue(next);
            args.onChange(next);
          }}
        />
        <TabPanel value={value}>
          <p className="di-quiet">The {value} view of entry 03.</p>
        </TabPanel>
      </div>
    );
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("tab", { name: /Sources/ }));
    await expect(args.onChange).toHaveBeenCalledWith("sources");
  },
};

/** The strip holds one tab stop; the arrows move within it. */
export const KeyboardMovement: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const first = canvas.getByRole("tab", { name: "Record" });
    first.focus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(canvas.getByRole("tab", { name: /Sources/ })).toHaveFocus();
  },
};

export const WithoutBadges: Story = {
  args: {
    items: [
      { value: "record", label: "Record" },
      { value: "sources", label: "Sources" },
      { value: "log", label: "Log" },
    ],
  },
};

/** A view that is not available on this record, and says so. */
export const WithDisabled: Story = {
  args: { value: "log" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("tab", { name: "Export" })).toBeDisabled();
  },
};

/** Two tabs: the shortest strip worth drawing. */
export const Pair: Story = {
  args: {
    items: [
      { value: "record", label: "Record" },
      { value: "log", label: "Log" },
    ],
  },
};
