import { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { TimeField } from "./TimeField";
import { Grid } from "../../../layout/arrangement/Grid";

const meta = {
  title: "Forms/Dates/TimeField",
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

/** Keyboard only: Tab walks the hours and minutes, arrows wrap at the ends, digits type a time. */
export const KeyboardSegments: Story = {
  args: { value: "00:59" },
  play: async ({ canvasElement, args }) => {
    const [hour, minute] = within(canvasElement).getAllByRole("spinbutton");
    await userEvent.tab();
    await expect(hour).toHaveFocus();
    await userEvent.tab();
    await expect(minute).toHaveFocus();
    await userEvent.keyboard("{ArrowUp}");
    await expect(args.onChange).toHaveBeenLastCalledWith("00:00");
    await userEvent.keyboard("{ArrowLeft}");
    await expect(hour).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}");
    await expect(args.onChange).toHaveBeenLastCalledWith("23:00");
    await userEvent.keyboard("0930");
    await expect(args.onChange).toHaveBeenLastCalledWith("09:30");
  },
};

/** In 12 hours a third segment holds AM or PM; typing P moves the time past noon. */
export const KeyboardTwelveHours: Story = {
  args: { locale: "en-US", value: "06:30" },
  play: async ({ canvasElement, args }) => {
    const segments = within(canvasElement).getAllByRole("spinbutton");
    await expect(segments).toHaveLength(3);
    await expect(segments[0]).toHaveAttribute("aria-valuetext", expect.stringMatching(/6/));
    await userEvent.click(segments[2]);
    await userEvent.keyboard("p");
    await expect(args.onChange).toHaveBeenLastCalledWith("18:30");
    await userEvent.keyboard("{ArrowUp}");
    await expect(args.onChange).toHaveBeenLastCalledWith("06:30");
  },
};

/** German counts in 24 hours and names the segments in German. */
export const KeyboardGerman: Story = {
  args: { locale: "de-DE", label: "Senden um", value: "" },
  play: async ({ canvasElement, args }) => {
    const segments = within(canvasElement).getAllByRole("spinbutton");
    await expect(segments).toHaveLength(2);
    await expect(segments[0]).toHaveAccessibleName(/^Stunde/);
    await expect(segments[1]).toHaveAccessibleName(/^Minute/);
    await userEvent.click(segments[0]);
    await userEvent.keyboard("1745");
    await expect(args.onChange).toHaveBeenLastCalledWith("17:45");
  },
};
