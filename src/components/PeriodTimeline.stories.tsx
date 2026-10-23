import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { PeriodTimeline } from "./PeriodTimeline";

const short = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });

const meta = {
  title: "Blocks/PeriodTimeline",
  component: PeriodTimeline,
  tags: ["autodocs"],
  args: {
    label: "Licenses over time",
    todayLabel: "Today",
    formatDate: short,
    today: "2026-10-22",
    periods: [
      { id: "a", label: "Professional", start: "2026-10-22", end: "2027-05-10", graceEnd: "2027-05-24", tone: "ok", caption: "valid until 10 May 2027" },
      { id: "b", label: "Team Add-on", start: "2026-12-01", end: "2027-06-01", tone: "neutral", caption: "starts 1 Dec 2026" },
    ],
  },
} satisfies Meta<typeof PeriodTimeline>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The today label stays within the axis wherever today falls on it; on a
 * narrow card the axis is the card's full width, so a label past its ends is
 * cut off.
 */
async function todayInside(canvasElement: HTMLElement) {
  within(canvasElement).getByRole("group", { name: "Licenses over time" });
  const axis = canvasElement.querySelector(".di-periods-scale")!.getBoundingClientRect();
  const today = within(canvasElement).getByText("Today").getBoundingClientRect();
  await expect(today.left).toBeGreaterThanOrEqual(axis.left - 0.5);
  await expect(today.right).toBeLessThanOrEqual(axis.right + 0.5);
}

/** Today is the axis' first day: a license that starts today. */
export const TodayAtTheStart: Story = {
  play: async ({ canvasElement }) => todayInside(canvasElement),
};

/** Today is the axis' last day: everything has run out. */
export const TodayAtTheEnd: Story = {
  args: {
    today: "2027-07-01",
    periods: [
      { id: "a", label: "Professional", start: "2026-10-22", end: "2027-05-10", graceEnd: "2027-05-24", tone: "danger", caption: "expired 24 May 2027" },
    ],
  },
  play: async ({ canvasElement }) => todayInside(canvasElement),
};
