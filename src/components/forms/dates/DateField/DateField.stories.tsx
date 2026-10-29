import { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { DateField, defaultDateFieldLabels } from "./DateField";
import { Grid } from "../../../layout/Grid";
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
