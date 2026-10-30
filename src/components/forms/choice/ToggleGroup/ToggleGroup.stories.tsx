import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";
import { Grid } from "../../../layout/arrangement/Grid";
import { TimeField } from "../../dates/TimeField";
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
  args: { legend: "Quiet on", options: days, value: [], onChange: () => {} },
} satisfies Meta<typeof ToggleGroup>;

export default meta;

function Days({ disabled = false }: { disabled?: boolean }) {
  const [value, setValue] = useState(["sat", "sun"]);
  return <ToggleGroup legend="Quiet on" options={days} value={value} onChange={setValue} disabled={disabled} />;
}

export const Weekdays: StoryObj<typeof meta> = {
  render: () => <Days />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("group", { name: "Quiet on" })).toBeVisible();
    const monday = canvas.getByRole("button", { name: "Monday" });
    await expect(monday).toHaveAttribute("aria-pressed", "false");
    await userEvent.click(monday);
    await expect(monday).toHaveAttribute("aria-pressed", "true");
    await userEvent.click(canvas.getByRole("button", { name: "Sunday" }));
    await expect(canvas.getByRole("button", { name: "Sunday" })).toHaveAttribute("aria-pressed", "false");
  },
};

/** Pressed days stay readable as pressed while the group is locked. */
export const Disabled: StoryObj<typeof meta> = {
  render: () => <Days disabled />,
};

/**
 * The legend is a field label, so the days line up with the time fields
 * beside them: one quiet window of a notification rule.
 */
export const BesideFields: StoryObj<typeof meta> = {
  name: "Beside fields",
  render: function Render() {
    const [value, setValue] = useState(["mon", "tue", "wed", "thu", "fri"]);
    const [from, setFrom] = useState("22:00");
    const [to, setTo] = useState("06:30");
    return (
      <Grid min="200px" gap={16}>
        <ToggleGroup legend="Quiet on" options={days} value={value} onChange={setValue} />
        <TimeField id="quiet-from" label="From" value={from} onChange={setFrom} />
        <TimeField id="quiet-to" label="To" value={to} onChange={setTo} />
      </Grid>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const legend = canvas.getByText("Quiet on");
    const from = canvas.getByText("From");
    if (Math.abs(legend.getBoundingClientRect().left - from.getBoundingClientRect().left) > 1) {
      await expect(Math.round(legend.getBoundingClientRect().top)).toBe(Math.round(from.getBoundingClientRect().top));
    }
  },
};
