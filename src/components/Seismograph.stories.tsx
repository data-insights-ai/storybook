import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { Seismograph } from "./Seismograph";
import type { SeismographPoint } from "./seismographPulses";

const points: SeismographPoint[] = [
  { at: "2026-10-01", above: 14, below: 7, unknown: 1 },
  { at: "2026-10-02", above: 86, below: 10 },
  { at: "2026-10-03", above: 28, below: 0 },
  { at: "2026-10-04", above: 0, below: 0 },
  { at: "2026-10-05", above: 120, below: 8, unknown: 3 },
  { at: "2026-10-06", above: 4, below: 0 },
];

const day = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });

const meta = {
  title: "Blocks/Seismograph",
  component: Seismograph,
  args: {
    label: "Records per day, by measured severity",
    aboveLabel: "Priority records",
    belowLabel: "Other records",
    unknownLabel: "Without a classification",
    note: "Each pulse is one day. Both traces share one count scale.",
    emptyLabel: "No records in this period.",
    selectionLabel: "Inspect a day",
    points,
    selectedAt: "",
    onSelect: fn(),
    formatX: (at: string) => day.format(new Date(at)),
  },
  argTypes: { points: { control: false }, formatX: { control: false }, formatValue: { control: false } },
  render: function Render(args) {
    const [selectedAt, setSelectedAt] = useState(args.selectedAt);
    return (
      <Seismograph
        {...args}
        selectedAt={selectedAt}
        onSelect={
          args.onSelect
            ? (at) => {
                setSelectedAt(at);
                args.onSelect?.(at);
              }
            : undefined
        }
      />
    );
  },
} satisfies Meta<typeof Seismograph>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** The scrubber under the chart is a slider: arrows, Page Up/Down, Home and End pick a day, read out with its counts. */
export const KeyboardSelection: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const scrubber = canvas.getByRole("slider", { name: "Inspect a day" });
    await expect(scrubber).toHaveAttribute("aria-valuetext", "Inspect a day");
    scrubber.focus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(args.onSelect).toHaveBeenLastCalledWith("2026-10-01");
    await userEvent.keyboard("{End}");
    await expect(args.onSelect).toHaveBeenLastCalledWith("2026-10-06");
    await userEvent.keyboard("{ArrowLeft}");
    await expect(args.onSelect).toHaveBeenLastCalledWith("2026-10-05");
    await waitFor(() =>
      expect(scrubber).toHaveAttribute(
        "aria-valuetext",
        "5 Oct: Priority records 120, Other records 8, Without a classification 3",
      ),
    );
    await expect(scrubber).toHaveAttribute("aria-valuenow", "4");
  },
};

export const Selected: Story = { args: { selectedAt: "2026-10-02" } };

/** Without `onSelect` the chart only reads: no scrubber. */
export const ReadOnly: Story = {
  args: { onSelect: undefined },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryByRole("slider")).toBeNull();
  },
};

export const SquareRootScale: Story = { args: { scale: "sqrt" } };

/** Symmetric log: a loud day does not flatten the quiet ones, and zero stays on the line. */
export const LogarithmicScale: Story = {
  args: {
    scale: "log",
    points: points.map((p, i) => (i === 4 ? { ...p, above: 12_000 } : p)),
  },
};

export const Medium: Story = { args: { height: "md" } };

export const Night: Story = { globals: { theme: "dark" } };

export const Phone: Story = { globals: { viewport: { value: "phone", isRotated: false } } };

export const SingleDay: Story = { args: { points: [points[0]] } };

export const Empty: Story = {
  args: { points: [] },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText("No records in this period.")).toBeVisible();
  },
};
