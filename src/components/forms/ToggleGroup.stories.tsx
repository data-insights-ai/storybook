import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";
import { ToggleGroup } from "./ToggleGroup";

const days = [
  { value: "mon", label: "Mo", name: "Monday" },
  { value: "tue", label: "Tu", name: "Tuesday" },
  { value: "wed", label: "We", name: "Wednesday" },
  { value: "thu", label: "Th", name: "Thursday" },
  { value: "fri", label: "Fr", name: "Friday" },
  { value: "sat", label: "Sa", name: "Saturday" },
  { value: "sun", label: "Su", name: "Sunday" },
];

const meta = {
  title: "Forms/Choice/ToggleGroup",
  component: ToggleGroup,
  tags: ["layer:form", "autodocs"],
  args: { legend: "Days", options: days, value: [], onChange: () => {} },
} satisfies Meta<typeof ToggleGroup>;

export default meta;

function Days() {
  const [value, setValue] = useState(["sat", "sun"]);
  return <ToggleGroup legend="Days" options={days} value={value} onChange={setValue} />;
}

export const Weekdays: StoryObj<typeof meta> = {
  render: () => <Days />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const monday = canvas.getByRole("button", { name: "Monday" });
    await expect(monday).toHaveAttribute("aria-pressed", "false");
    await userEvent.click(monday);
    await expect(monday).toHaveAttribute("aria-pressed", "true");
    await userEvent.click(canvas.getByRole("button", { name: "Sunday" }));
    await expect(canvas.getByRole("button", { name: "Sunday" })).toHaveAttribute("aria-pressed", "false");
  },
};
