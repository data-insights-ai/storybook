import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Panel } from "../../layout/page/Panel";
import { PeriodTimeline, type PeriodRow } from "./PeriodTimeline";

const short = (iso: string, { year }: { year: boolean }) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: year ? "numeric" : undefined,
    timeZone: "UTC",
  });

const licenses: PeriodRow[] = [
  {
    id: "a",
    label: "Professional",
    spans: [{ start: "2026-10-22", end: "2027-05-10", graceEnd: "2027-05-24", tone: "ok" }],
    caption: "valid until 10 May 2027",
  },
  {
    id: "b",
    label: "Team Add-on",
    spans: [{ start: "2026-12-01", end: "2027-06-01", tone: "neutral" }],
    caption: "starts 1 Dec 2026",
  },
];

const meta = {
  title: "Timelines/PeriodTimeline",
  component: PeriodTimeline,
  tags: ["layer:block", "autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "**Purpose:** when things hold, as labelled rows of spans on one axis: licenses and a subscription over months, quiet hours over the days of a week.",
          "**When to use, and when not:** use it for terms and windows. Counts over time are a `TrendChart`; events at points in time an `EventTimeline`; one level on a scale a `LevelMeter`.",
          "**Anatomy:** per row the label, the track with its spans (a grace period hatched after its span) and an optional caption; under the rows the axis (its two ends, or `ticks`) and the marker's label on a line of its own.",
          "**Variants:** points are ISO dates or numbers on the axis' own scale (minutes of a day). `marker` draws a point such as today through every row. Rows with captions stack under their label on a narrow card; rows without stay beside it.",
          "**Content:** the caption says the period in words (“valid until 10 May 2027”), so the bar is the second channel. Without captions, `summary` says the whole picture in one sentence.",
          "**Accessibility:** with captions the rows are a group named `label`, each read as label and caption; without them the figure is an image named by `summary`.",
        ].join("\n\n"),
      },
    },
  },
  args: {
    label: "Licenses over time",
    formatDate: short,
    marker: { at: "2026-10-22", label: "Today" },
    rows: licenses,
  },
  decorators: [
    (Story, { parameters }) => (
      <Panel title={(parameters.panel as string | undefined) ?? "Licenses and subscription"}>
        <Story />
      </Panel>
    ),
  ],
} satisfies Meta<typeof PeriodTimeline>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The marker's label stays within the axis wherever it falls on it; on a
 * narrow card the axis is the card's full width, so a label past its ends is
 * cut off.
 */
async function markerInside(canvasElement: HTMLElement, name: string, marker: string) {
  within(canvasElement).getByRole("group", { name });
  const axis = canvasElement.querySelector(".di-periods-scale")!.getBoundingClientRect();
  const label = within(canvasElement).getByText(marker).getBoundingClientRect();
  await expect(label.left).toBeGreaterThanOrEqual(axis.left - 0.5);
  await expect(label.right).toBeLessThanOrEqual(axis.right + 0.5);
  for (const tick of canvasElement.querySelectorAll(".di-periods-scale > span")) {
    const box = tick.getBoundingClientRect();
    await expect(box.left).toBeGreaterThanOrEqual(axis.left - 0.5);
    await expect(box.right).toBeLessThanOrEqual(axis.right + 0.5);
  }
}

/** Today is the axis' first day: a license that starts today. */
export const TodayAtTheStart: Story = {
  play: async ({ canvasElement }) => markerInside(canvasElement, "Licenses over time", "Today"),
};

/** Today is the axis' last day: everything has run out. */
export const TodayAtTheEnd: Story = {
  args: {
    marker: { at: "2027-07-01", label: "Today" },
    rows: [
      {
        id: "a",
        label: "Professional",
        spans: [{ start: "2026-10-22", end: "2027-05-10", graceEnd: "2027-05-24", tone: "danger" }],
        caption: "expired 24 May 2027",
      },
    ],
  },
  play: async ({ canvasElement }) => markerInside(canvasElement, "Licenses over time", "Today"),
};

/** Within one year the ends name day and month only. */
export const WithinAYear: Story = {
  args: {
    marker: { at: "2026-03-01", label: "Today" },
    rows: [
      {
        id: "a",
        label: "Professional",
        spans: [{ start: "2026-02-01", end: "2026-06-30", tone: "ok" }],
        caption: "valid until 30 Jun 2026",
      },
    ],
  },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText("1 Feb")).toBeVisible();
    await expect(within(canvasElement).getByText("30 Jun")).toBeVisible();
  },
};

/** An axis across a year names the year at both ends. */
export const AcrossAYear: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText("22 Oct 2026")).toBeVisible();
    await expect(within(canvasElement).getByText("1 Jun 2027")).toBeVisible();
  },
};

const night = [
  { start: 0, end: 7 * 60, tone: "ok" as const },
  { start: 21 * 60, end: 24 * 60, tone: "ok" as const },
];
const allDay = [{ start: 0, end: 24 * 60, tone: "ok" as const }];

/**
 * A week of quiet hours: the axis is the minutes of a day, a row per day, a
 * night two spans. No row has a caption, so the figure is one picture named
 * by its summary, and the day stays beside its track on a phone.
 */
export const QuietHours: Story = {
  args: {
    label: "Quiet hours",
    summary: "Quiet every night from 21:00 to 07:00 and all weekend",
    marker: undefined,
    formatDate: undefined,
    from: 0,
    to: 24 * 60,
    ticks: ["00", "06", "12", "18", "24"].map((label, i) => ({ at: i * 6 * 60, label })),
    rows: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => ({
      id: day,
      label: day,
      spans: i < 5 ? night : allDay,
    })),
  },
  parameters: { panel: "Quiet hours" },
  play: async ({ canvasElement, args }) => {
    const figure = within(canvasElement).getByRole("img", { name: args.summary });
    await expect(figure).toBeVisible();
    const row = canvasElement.querySelector(".di-period")!;
    const label = row.querySelector(".di-period-label")!.getBoundingClientRect();
    const track = row.querySelector(".di-period-track")!.getBoundingClientRect();
    await expect(Math.abs(label.top + label.height / 2 - (track.top + track.height / 2))).toBeLessThan(2);
  },
};

/**
 * Long German labels and captions: a label that does not fit ends in an
 * ellipsis and keeps its row; on a phone the caption goes under the track.
 */
export const German: Story = {
  args: {
    label: "Lizenzen im Zeitverlauf",
    formatDate: (iso, { year }) =>
      new Date(iso).toLocaleDateString("de-AT", {
        day: "numeric",
        month: "short",
        year: year ? "numeric" : undefined,
        timeZone: "UTC",
      }),
    marker: { at: "2026-10-22", label: "Heute" },
    rows: [
      {
        id: "a",
        label: "Unternehmenslizenz Professional",
        spans: [{ start: "2026-09-12", end: "2027-05-10", graceEnd: "2027-05-24", tone: "ok" }],
        caption: "gültig bis 10. Mai 2027, danach 14 Tage Kulanzfrist",
      },
      {
        id: "b",
        label: "Zusatzmodul Bereitschaftsdienst",
        spans: [{ start: "2026-10-02", end: "2026-11-02", tone: "warn" }],
        caption: "verlängert sich am 2. Nov. 2026",
      },
    ],
  },
  parameters: { panel: "Lizenzen und Abonnement" },
  play: async ({ canvasElement }) => markerInside(canvasElement, "Lizenzen im Zeitverlauf", "Heute"),
};
