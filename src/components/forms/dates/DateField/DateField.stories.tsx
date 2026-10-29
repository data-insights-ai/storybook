import { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { DateField, defaultDateFieldLabels } from "./DateField";
import { Grid } from "../../../layout/arrangement/Grid";
import { Modal, ModalContent, ModalTitle } from "../../../overlays/Modal";
import { Button } from "../../../actions/Button";

const meta = {
  title: "Forms/Dates/DateField",
  component: DateField,
  tags: ["layer:form", "autodocs"],
  args: {
    id: "first-day",
    label: "First day",
    value: "",
    locale: "en-GB",
    weekStartsOn: 1,
    hint: "",
    hintTone: "neutral",
    labelTrack: "record",
    hideLabel: false,
    disabled: false,
    readOnly: false,
    required: false,
    labels: defaultDateFieldLabels,
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
      <div style={{ maxWidth: "320px" }}>
        <DateField
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
} satisfies Meta<typeof DateField>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Empty, the segments show the order the locale writes a day in. */
export const Default: Story = {};

/** The calendar opens on the chosen day; picking another one closes it and returns an ISO day. */
export const PickFromCalendar: Story = {
  args: { value: "2026-10-12" },
  play: async ({ canvasElement, args }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: /Choose a date/ }));
    const page = within(canvasElement.ownerDocument.body);
    await userEvent.click(page.getByRole("button", { name: /20 October 2026/ }));
    await expect(args.onChange).toHaveBeenLastCalledWith("2026-10-20");
    await waitFor(() => expect(page.queryByRole("dialog")).toBeNull());
  },
};

/** Typed segment by segment; the value arrives once the day is whole. */
export const Typed: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getAllByRole("spinbutton")[0]);
    await userEvent.keyboard("03112026");
    await expect(args.onChange).toHaveBeenLastCalledWith("2026-11-03");
  },
};

/** Days outside `min` and `max` cannot be picked. */
export const Bounded: Story = {
  args: { value: "2026-10-29", min: "2026-10-29", hint: "From today on." },
};

export const WithError: Story = {
  args: { value: "2026-10-01", hint: "The last day comes before the first.", hintTone: "error" },
};

/** German writes the day first and starts the week on Monday. */
export const German: Story = {
  args: {
    locale: "de-DE",
    label: "Erster Tag",
    value: "2026-10-29",
    labels: { calendar: "Datum wählen", previous: "Vorheriger Monat", next: "Nächster Monat" },
  },
};

/** US English writes the month first and starts the week on Sunday. */
export const UsEnglish: Story = { args: { locale: "en-US", weekStartsOn: 0, value: "2026-10-29" } };

/** Two of them as a period, the way a form asks for a first and a last day. */
export const Period: Story = {
  render: function Render(args) {
    const [from, setFrom] = useState("2026-10-01");
    const [to, setTo] = useState("2026-10-31");
    return (
      <Grid min="160px">
        <DateField {...args} id="period-from" label="First day" value={from} onChange={setFrom} />
        <DateField {...args} id="period-to" label="Last day" value={to} min={from} onChange={setTo} />
      </Grid>
    );
  },
};

/** Inside a modal the calendar stays within the dialog's inert boundary. */
export const InModal: Story = {
  render: function Render(args) {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("");
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open</Button>
        <Modal open={open} labelledBy="grant-title" onClose={() => setOpen(false)}>
          <ModalContent>
            <ModalTitle id="grant-title">Grant access</ModalTitle>
            <DateField {...args} id="expires" label="Expires" value={value} onChange={setValue} />
          </ModalContent>
        </Modal>
      </>
    );
  },
};

const focused = (element: HTMLElement) => element.ownerDocument.activeElement as HTMLElement;

/** Keyboard only: Tab walks the day, month and year, then the calendar button; arrows step
 * a segment and wrap at its ends, Left and Right move between segments. */
export const KeyboardSegments: Story = {
  args: { value: "2026-10-31" },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const [day, month, year] = canvas.getAllByRole("spinbutton");
    await userEvent.tab();
    await expect(day).toHaveFocus();
    await userEvent.tab();
    await expect(month).toHaveFocus();
    await userEvent.tab();
    await expect(year).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole("button", { name: /Choose a date/ })).toHaveFocus();
    day.focus();
    await userEvent.keyboard("{ArrowUp}");
    await expect(args.onChange).toHaveBeenLastCalledWith("2026-10-01");
    await userEvent.keyboard("{ArrowDown}{ArrowDown}");
    await expect(args.onChange).toHaveBeenLastCalledWith("2026-10-30");
    await userEvent.keyboard("{ArrowRight}");
    await expect(month).toHaveFocus();
    await userEvent.keyboard("{ArrowUp}");
    await expect(args.onChange).toHaveBeenLastCalledWith("2026-11-30");
    await userEvent.keyboard("{ArrowLeft}");
    await expect(day).toHaveFocus();
    await expect(month).toHaveAttribute("aria-valuenow", "11");
    await expect(year).toHaveAttribute("aria-valuenow", "2026");
  },
};

/** German types day, month, year; the segments are named in German. */
export const KeyboardGerman: Story = {
  args: { locale: "de-DE", label: "Erster Tag" },
  play: async ({ canvasElement, args }) => {
    const segments = within(canvasElement).getAllByRole("spinbutton");
    await expect(segments[0]).toHaveAccessibleName(/^Tag/);
    await expect(segments[1]).toHaveAccessibleName(/^Monat/);
    await expect(segments[2]).toHaveAccessibleName(/^Jahr/);
    await userEvent.click(segments[0]);
    await userEvent.keyboard("29102026");
    await expect(args.onChange).toHaveBeenLastCalledWith("2026-10-29");
    await expect(segments[1]).toHaveAttribute("aria-valuetext", expect.stringContaining("Oktober"));
  },
};

/** Spanish types day, month, year too; the segments are named in Spanish. */
export const KeyboardSpanish: Story = {
  args: { locale: "es-ES", label: "Primer día" },
  play: async ({ canvasElement, args }) => {
    const segments = within(canvasElement).getAllByRole("spinbutton");
    await expect(segments[0]).toHaveAccessibleName(/^día/i);
    await expect(segments[1]).toHaveAccessibleName(/^mes/i);
    await expect(segments[2]).toHaveAccessibleName(/^año/i);
    await userEvent.click(segments[0]);
    await userEvent.keyboard("05032027");
    await expect(args.onChange).toHaveBeenLastCalledWith("2027-03-05");
  },
};

/** US English types the month first. */
export const KeyboardUsEnglish: Story = {
  args: { locale: "en-US", weekStartsOn: 0 },
  play: async ({ canvasElement, args }) => {
    const segments = within(canvasElement).getAllByRole("spinbutton");
    await expect(segments[0]).toHaveAccessibleName(/^month/i);
    await userEvent.click(segments[0]);
    await userEvent.keyboard("10292026");
    await expect(args.onChange).toHaveBeenLastCalledWith("2026-10-29");
  },
};

/** Backspace empties a segment digit by digit; the segment then has no value. */
export const KeyboardBackspace: Story = {
  args: { value: "2026-10-29" },
  play: async ({ canvasElement }) => {
    const [day] = within(canvasElement).getAllByRole("spinbutton");
    await userEvent.click(day);
    await userEvent.keyboard("{Backspace}");
    await expect(day).toHaveAttribute("aria-valuenow", "2");
    await userEvent.keyboard("{Backspace}");
    await expect(day).not.toHaveAttribute("aria-valuenow");
  },
};

/** The calendar by keyboard: Enter opens it on the chosen day, arrows move by day and week,
 * Page Up and Down by month, Shift with them by year, Home and End to the month's first and last day,
 * Enter picks and closes back onto the button. */
export const KeyboardCalendar: Story = {
  args: { value: "2026-10-29" },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole("button", { name: /Choose a date/ });
    toggle.focus();
    await userEvent.keyboard("{Enter}");
    await waitFor(() => expect(focused(canvasElement)).toHaveAccessibleName(/29 October 2026/));
    await userEvent.keyboard("{ArrowRight}");
    await expect(focused(canvasElement)).toHaveAccessibleName(/30 October 2026/);
    await userEvent.keyboard("{ArrowDown}");
    await expect(focused(canvasElement)).toHaveAccessibleName(/6 November 2026/);
    await userEvent.keyboard("{PageUp}");
    await expect(focused(canvasElement)).toHaveAccessibleName(/6 October 2026/);
    await userEvent.keyboard("{Home}");
    await expect(focused(canvasElement)).toHaveAccessibleName(/1 October 2026/);
    await userEvent.keyboard("{End}");
    await expect(focused(canvasElement)).toHaveAccessibleName(/31 October 2026/);
    await userEvent.keyboard("{Shift>}{PageDown}{/Shift}");
    await expect(focused(canvasElement)).toHaveAccessibleName(/31 October 2027/);
    await userEvent.keyboard("{Enter}");
    await expect(args.onChange).toHaveBeenLastCalledWith("2027-10-31");
    await waitFor(() => expect(within(canvasElement.ownerDocument.body).queryByRole("dialog")).toBeNull());
    await waitFor(() => expect(toggle).toHaveFocus());
  },
};

/** Escape closes the calendar without a change and returns to the button. */
export const KeyboardEscape: Story = {
  args: { value: "2026-10-29" },
  play: async ({ canvasElement, args }) => {
    const toggle = within(canvasElement).getByRole("button", { name: /Choose a date/ });
    toggle.focus();
    await userEvent.keyboard("{Enter}");
    await waitFor(() => expect(focused(canvasElement)).toHaveAccessibleName(/29 October 2026/));
    await userEvent.keyboard("{ArrowRight}{Escape}");
    await waitFor(() => expect(within(canvasElement.ownerDocument.body).queryByRole("dialog")).toBeNull());
    await waitFor(() => expect(toggle).toHaveFocus());
    await expect(args.onChange).not.toHaveBeenCalled();
  },
};
