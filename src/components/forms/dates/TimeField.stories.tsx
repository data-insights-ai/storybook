import { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { TimeField } from "./TimeField";
import { Grid } from "../../layout/Layout";

const meta = {
  title: "Forms/TimeField",
  component: TimeField,
  tags: ["layer:form", "autodocs"],
  args: {
    id: "send-at",
    label: "Send at",
    value: "08:00",
    locale: "en-GB",
    hint: "",
    hintTone: "neutral",
    labelTrack: "record",
    hideLabel: false,
    disabled: false,
    readOnly: false,
    required: false,
    onChange: fn(),
  },
  argTypes: {
    hintTone: { control: "radio", options: ["neutral", "sealed", "error"] },
    labelTrack: { control: "radio", options: ["record", "prose"] },
    children: { control: false },
  },
  render: function Render(args) {
    const [value, setValue] = useState(args.value);
    useEffect(() => setValue(args.value), [args.value]);
    return (
      <div style={{ maxWidth: "240px" }}>
        <TimeField
          {...args}
          value={value}
          onChange={(next) => {
            args.onChange(next);
            setValue(next);
          }}
        />
      </div>
    );
  },
} satisfies Meta<typeof TimeField>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Hours and minutes, typed or stepped with the arrows; the value is `HH:MM`. */
export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getAllByRole("spinbutton")[0]);
    await userEvent.keyboard("{ArrowUp}");
    await expect(args.onChange).toHaveBeenLastCalledWith("09:00");
  },
};

export const Empty: Story = { args: { value: "" } };

/** US English counts in 12 hours; the value stays in 24. */
export const TwelveHours: Story = { args: { locale: "en-US", value: "18:30" } };

export const WithHint: Story = { args: { hint: "In Europe/Vienna." } };

export const Disabled: Story = { args: { disabled: true } };

/** A window from one time to another, the way quiet hours are set. */
export const Window: Story = {
  render: function Render(args) {
    const [start, setStart] = useState("22:00");
    const [end, setEnd] = useState("07:00");
    return (
      <Grid min="160px">
        <TimeField {...args} id="quiet-from" label="From" value={start} onChange={setStart} />
        <TimeField
          {...args}
          id="quiet-until"
          label="Until"
          value={end}
          hint={end <= start ? "Runs past midnight." : ""}
          onChange={setEnd}
        />
      </Grid>
    );
  },
};
