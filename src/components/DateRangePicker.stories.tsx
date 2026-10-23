import { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fireEvent, fn, userEvent, waitFor, within } from "storybook/test";
import { DateRangePicker, defaultDateRangeLabels } from "./DateRangePicker";
import { type DateRangeValue, parseDateRange, resolveDateRange, serializeDateRange } from "./dateRange";
import { ListToolbar } from "./ListToolbar";
import { SearchField } from "./SearchField";
import { Select } from "./Select";

const meta = {
  title: "Forms/DateRangePicker",
  component: DateRangePicker,
  args: {
    id: "period",
    label: "Period",
    value: {},
    locale: "en-GB",
    weekStartsOn: 1,
    timeZone: "Europe/Vienna",
    allowAny: true,
    allowTimes: true,
    disabled: false,
    labels: defaultDateRangeLabels,
    onChange: fn(),
  },
  render: function Render(args) {
    const [value, setValue] = useState<DateRangeValue>(args.value);
    useEffect(() => setValue(args.value), [args.value]);
    return (
      <DateRangePicker
        {...args}
        value={value}
        onChange={(next) => {
          args.onChange(next);
          setValue(next);
        }}
      />
    );
  },
} satisfies Meta<typeof DateRangePicker>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Empty is any time; the control says so inside itself. */
export const Default: Story = {};

/** A preset moves with the clock: "Last 7 days" is today and the six days before it. */
export const Preset: Story = { args: { value: { preset: "7d" } } };

/** A fixed range shows its days in the reader's language; the end is exclusive, so the last day shown is 7 October. */
export const CustomRange: Story = {
  args: { value: { from: "2026-09-30T22:00:00.000Z", to: "2026-10-07T22:00:00.000Z" } },
};

export const IndependentStart: Story = {
  args: { timeZone: "UTC", value: { from: "2026-10-01T00:00:00.000Z", to: "2026-10-16T00:00:00.000Z" } },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: /Period:/ }));
    const dialog = within(canvasElement.ownerDocument.body);
    fireEvent.change(dialog.getByLabelText("From date"), { target: { value: "2026-10-03" } });
    await userEvent.click(dialog.getByRole("button", { name: "Apply" }));
    await expect(args.onChange).toHaveBeenLastCalledWith({
      from: "2026-10-03T00:00:00.000Z",
      to: "2026-10-16T00:00:00.000Z",
    });
  },
};

export const OpenEnded: Story = {
  args: { allowOpenEnd: true, timeZone: "UTC", value: { from: "2026-10-01T00:00:00.000Z" } },
  play: async ({ canvasElement, args }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: /Period:/ }));
    const dialog = within(canvasElement.ownerDocument.body);
    await expect(dialog.getByLabelText("Until now")).toBeChecked();
    fireEvent.change(dialog.getByLabelText("From date"), { target: { value: "2026-10-03" } });
    await userEvent.click(dialog.getByRole("button", { name: "Apply" }));
    await expect(args.onChange).toHaveBeenLastCalledWith({ from: "2026-10-03T00:00:00.000Z" });
  },
};

/** German, the week starting on Monday, the zone from the product's settings. */
export const German: Story = {
  args: {
    locale: "de-DE",
    weekStartsOn: 1,
    timeZone: "Europe/Berlin",
    value: { from: "2026-10-01T06:30:00.000Z", to: "2026-10-03T16:00:00.000Z" },
    labels: {
      ...defaultDateRangeLabels,
      any: "Beliebiger Zeitraum",
      "24h": "Letzte 24 Stunden",
      "7d": "Letzte 7 Tage",
      "30d": "Letzte 30 Tage",
      thisMonth: "Dieser Monat",
      lastMonth: "Letzter Monat",
      custom: "Eigener Zeitraum",
      presets: "Zeiträume",
      dialog: "Zeitraum wählen",
      previous: "Vorheriger Monat",
      next: "Nächster Monat",
      setTimes: "Uhrzeiten festlegen",
      fromTime: "Von",
      toTime: "Bis",
      apply: "Übernehmen",
      cancel: "Abbrechen",
      timeZone: "Zeitzone",
    },
  },
};

/** In a list's toolbar the control is one field high, beside the search and the filters. */
export const InToolbar: Story = {
  render: function Render(args) {
    const [value, setValue] = useState<DateRangeValue>({ preset: "30d" });
    return (
      <ListToolbar label="Filter the entries">
        <SearchField id="entries-search" label="Search entries" dense />
        <Select id="entries-status" label="Status" hideLabel mono={false} defaultValue="">
          <option value="">Status: all</option>
          <option value="ok">Delivered</option>
          <option value="failed">Failed</option>
        </Select>
        <DateRangePicker {...args} value={value} onChange={setValue} />
      </ListToolbar>
    );
  },
};

/** What a product writes into the URL and reads back, and the instants it sends to the server. */
export const UrlState: Story = {
  render: function Render(args) {
    const [value, setValue] = useState<DateRangeValue>(parseDateRange(new URLSearchParams("range=7d")));
    const search = serializeDateRange(value);
    const resolved = resolveDateRange(value, new Date(), args.timeZone ?? "UTC");
    return (
      <div style={{ display: "grid", gap: "var(--di-space-12)", justifyItems: "start" }}>
        <DateRangePicker {...args} value={value} onChange={setValue} />
        <code data-testid="search">{JSON.stringify(search)}</code>
        <code data-testid="resolved">{JSON.stringify(resolved)}</code>
      </div>
    );
  },
};

/** Keys only: Enter opens, arrows walk the presets and the days, Enter picks, Esc closes back onto the control. */
export const Keyboard: Story = {
  args: { timeZone: "UTC" },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    const trigger = canvas.getByRole("button", { name: "Period: Any time" });

    trigger.focus();
    await userEvent.keyboard("{Enter}");
    const presets = await page.findByRole("listbox", { name: "Periods" });
    await waitFor(() => expect(presets).toBeVisible());
    page.getByRole("option", { name: "Any time" }).focus();
    await userEvent.keyboard("{ArrowDown}{ArrowDown}{Enter}");
    await expect(args.onChange).toHaveBeenLastCalledWith({ preset: "7d" });
    await waitFor(() => expect(page.queryByRole("listbox", { name: "Periods" })).toBeNull());
    await waitFor(() => expect(canvas.getByRole("button", { name: "Period: Last 7 days" })).toHaveFocus());

    await userEvent.keyboard("{Enter}");
    const custom = await page.findByRole("option", { name: "Custom range" });
    custom.focus();
    await userEvent.keyboard("{Enter}");
    const grid = page.getAllByRole("grid")[0];
    await waitFor(() => expect(grid.contains(canvasElement.ownerDocument.activeElement)).toBe(true));
    await userEvent.keyboard("{Enter}{ArrowRight}{ArrowRight}{ArrowRight}{Enter}");
    await userEvent.click(page.getByRole("button", { name: "Apply" }));
    const applied = args.onChange.mock.lastCall?.[0] as DateRangeValue;
    const midnight = new Date();
    midnight.setUTCHours(0, 0, 0, 0);
    await expect(applied.from).toBe(midnight.toISOString());
    await expect(Date.parse(applied.to!) - Date.parse(applied.from!)).toBeGreaterThanOrEqual(4 * 86_400_000);
    await expect(Date.parse(applied.to!) % 86_400_000).toBe(0);
    await waitFor(() => expect(canvas.getByRole("button", { name: /^Period: / })).toHaveFocus());

    await userEvent.keyboard("{Enter}");
    await page.findByRole("listbox", { name: "Periods" });
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(page.queryByRole("listbox", { name: "Periods" })).toBeNull());
    await waitFor(() => expect(canvas.getByRole("button", { name: /^Period: / })).toHaveFocus());
  },
};

export const PartialDateKeepsOtherEndpoint: Story = {
  args: {
    allowOpenEnd: true,
    timeZone: "UTC",
    value: { from: "2026-10-01T00:00:00.000Z", to: "2026-10-16T00:00:00.000Z" },
  },
  play: async ({ canvasElement, args }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: /Period:/ }));
    const dialog = within(canvasElement.ownerDocument.body);
    fireEvent.change(dialog.getByLabelText("From date"), { target: { value: "" } });
    await expect(dialog.getByLabelText("Through date")).toHaveValue("2026-10-15");
    await expect(dialog.getByRole("button", { name: "Apply" })).toBeDisabled();
    fireEvent.input(dialog.getByLabelText("From date"), { target: { value: "2026-10-03" } });
    await userEvent.click(dialog.getByRole("button", { name: "Apply" }));
    await expect(args.onChange).toHaveBeenLastCalledWith({
      from: "2026-10-03T00:00:00.000Z",
      to: "2026-10-16T00:00:00.000Z",
    });
  },
};

/** A last day before the first is named under it and cannot be applied; nothing is swapped. */
export const ReversedDates: Story = {
  args: { timeZone: "UTC", value: { from: "2026-10-01T00:00:00.000Z", to: "2026-10-16T00:00:00.000Z" } },
  play: async ({ canvasElement, args }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: /Period:/ }));
    const dialog = within(canvasElement.ownerDocument.body);
    fireEvent.change(dialog.getByLabelText("Through date"), { target: { value: "2026-09-20" } });
    await waitFor(() => expect(dialog.getByText("The last day comes before the first.")).toBeVisible());
    await expect(dialog.getByLabelText("Through date")).toHaveAttribute("aria-invalid", "true");
    await expect(dialog.getByRole("button", { name: "Apply" })).toBeDisabled();
    fireEvent.change(dialog.getByLabelText("Through date"), { target: { value: "2026-10-04" } });
    await userEvent.click(dialog.getByRole("button", { name: "Apply" }));
    await expect(args.onChange).toHaveBeenLastCalledWith({
      from: "2026-10-01T00:00:00.000Z",
      to: "2026-10-05T00:00:00.000Z",
    });
  },
};

/** An open end with times applies from the first day's time; the end time is not asked for. */
export const OpenEndedWithTime: Story = {
  args: { allowOpenEnd: true, timeZone: "UTC", value: { from: "2026-10-01T09:30:00.000Z" } },
  play: async ({ canvasElement, args }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: /Period:/ }));
    const dialog = within(canvasElement.ownerDocument.body);
    await expect(dialog.getByLabelText("Until now")).toBeChecked();
    await expect(dialog.getByLabelText("Set times")).toBeChecked();
    await expect(dialog.queryByLabelText("Through date")).toBeNull();
    await expect(dialog.queryByText("Until")).toBeNull();
    await userEvent.click(dialog.getByRole("button", { name: "Apply" }));
    await expect(args.onChange).toHaveBeenLastCalledWith({ from: "2026-10-01T09:30:00.000Z" });
  },
};

/** Without `allowOpenEnd` there is no "Until now", and a range needs both days as before. */
export const NoOpenEnd: Story = {
  args: { timeZone: "UTC", value: { from: "2026-10-01T00:00:00.000Z" } },
  play: async ({ canvasElement, args }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: /Period:/ }));
    const dialog = within(canvasElement.ownerDocument.body);
    await expect(dialog.queryByLabelText("Until now")).toBeNull();
    await expect(dialog.getByRole("button", { name: "Apply" })).toBeDisabled();
    fireEvent.change(dialog.getByLabelText("From date"), { target: { value: "2026-10-03" } });
    await expect(dialog.getByRole("button", { name: "Apply" })).toBeDisabled();
    fireEvent.change(dialog.getByLabelText("Through date"), { target: { value: "2026-10-03" } });
    await userEvent.click(dialog.getByRole("button", { name: "Apply" }));
    await expect(args.onChange).toHaveBeenLastCalledWith({
      from: "2026-10-03T00:00:00.000Z",
      to: "2026-10-04T00:00:00.000Z",
    });
  },
};
