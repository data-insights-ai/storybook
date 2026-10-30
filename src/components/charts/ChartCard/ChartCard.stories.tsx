import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { ChartCard, ChartCardAction, ChartCardGrid } from "./ChartCard";
import { PeriodTimeline } from "../../timeline/PeriodTimeline";
import { TextLink } from "../../navigation/TextLink";
import { TrendChart } from "../time/TrendChart";

const days = Array.from({ length: 30 }, (_, i) => {
  const d = new Date(Date.UTC(2026, 9, 1 + i));
  return d.toISOString().slice(0, 10);
});
const short = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });

const balance = [
  ...days.map((at, i) => ({ at, balance: i < 20 ? 300 - i * 6 : null, forecast: i === 19 ? 186 : null })),
].map((d, i) => (i >= 19 ? { ...d, forecast: 186 - (i - 19) * 6 } : d));
const usage = days.map((at, i) => ({ at, soc: 20 + ((i * 7) % 13), reports: 4 + ((i * 3) % 5) }));
const seats = days.map((at, i) => ({ at, used: Math.min(5, 2 + Math.floor(i / 8)), capacity: 5 }));

const meta = {
  title: "Charts/ChartCard",
  component: ChartCard,
  tags: ["layer:block", "autodocs", "status:deprecated"],
  args: { title: "Credit", children: null },
} satisfies Meta<typeof ChartCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A dashboard: each card states its figure in words, draws what it rests
 * on, and links to the page that changes it. The forecast continues the
 * measured balance, dashed; an expiry is a marker on the time axis.
 */
export const Dashboard: Story = {
  render: () => (
    <ChartCardGrid>
      <h2 className="di-sr">Organization at a glance</h2>
      <ChartCard title="Credit" figure="186 credits" note="Lasts about 31 days at 6 credits a day">
        <ChartCardAction>
          <TextLink href="#credits">Credits</TextLink>
        </ChartCardAction>
        <TrendChart
          label="Credit balance by day, with forecast"
          data={balance}
          series={[
            { key: "balance", label: "Balance", kind: "area" },
            { key: "forecast", label: "Forecast", kind: "line", dashed: true },
          ]}
          formatX={short}
          formatValue={(v) => `${v}`}
          height="sm"
        />
      </ChartCard>
      <ChartCard title="Seats" figure="5 of 5" note="1 person waiting" tone="warn">
        <ChartCardAction>
          <TextLink href="#seats">Manage seats</TextLink>
        </ChartCardAction>
        <TrendChart
          label="Seats in use by day"
          data={seats}
          series={[
            { key: "used", label: "In use", kind: "area" },
            { key: "capacity", label: "Seats", kind: "line", tone: "muted", dashed: true },
          ]}
          formatX={short}
          markers={[{ at: days[24]!, label: "Expires", tone: "warn" }]}
          height="sm"
        />
      </ChartCard>
      <ChartCard title="Usage per product" figure="812 GB" note="Ingested in the last 30 days" wide>
        <ChartCardAction>
          <TextLink href="#usage">Usage</TextLink>
        </ChartCardAction>
        <TrendChart
          label="Usage per product by day"
          data={usage}
          series={[
            { key: "soc", label: "AI SOC", kind: "bar", stack: "u" },
            { key: "reports", label: "Reports", kind: "bar", stack: "u", tone: "compare" },
          ]}
          formatX={short}
          formatValue={(v) => `${v} GB`}
        />
      </ChartCard>
      <ChartCard title="Licenses and subscription" wide>
        <ChartCardAction>
          <TextLink href="#licenses">Licenses</TextLink>
        </ChartCardAction>
        <PeriodTimeline
          label="Licenses and subscription over time"
          today="2026-10-22"
          todayLabel="Today"
          formatDate={short}
          periods={[
            {
              id: "a",
              label: "Professional",
              start: "2026-09-12",
              end: "2027-05-10",
              graceEnd: "2027-05-24",
              tone: "ok",
              caption: "valid until 10 May 2027",
            },
            {
              id: "b",
              label: "Team Add-on",
              start: "2026-10-02",
              end: "2026-11-02",
              graceEnd: "2026-11-16",
              tone: "warn",
              caption: "renews 2 Nov 2026",
            },
          ]}
        />
      </ChartCard>
    </ChartCardGrid>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { name: "Credit" })).toBeVisible();
    await expect(canvas.getByRole("group", { name: "Credit balance by day, with forecast" })).toBeVisible();
    await expect(canvas.getByRole("group", { name: "Licenses and subscription over time" })).toBeVisible();
    await expect(canvas.getByText("renews 2 Nov 2026")).toBeVisible();
  },
};

/**
 * Markers in each tone. The dashed rule takes the chart colour; its label is
 * text and takes the status ink, so it reads in either theme.
 */
export const Markers: Story = {
  render: () => (
    <ChartCardGrid>
      <h2 className="di-sr">Contract</h2>
      <ChartCard title="Seats" figure="5 of 5" note="The contract ends on 28 Oct">
        <TrendChart
          label="Seats in use by day, with renewal, expiry and cut-off"
          data={seats}
          series={[{ key: "used", label: "In use", kind: "area" }]}
          formatX={short}
          markers={[
            { at: days[6]!, label: "Renewal", tone: "neutral" },
            { at: days[16]!, label: "Expires", tone: "warn" },
            { at: days[26]!, label: "Cut-off", tone: "danger" },
          ]}
          height="sm"
        />
      </ChartCard>
    </ChartCardGrid>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const label of ["Renewal", "Expires", "Cut-off"]) await expect(canvas.getByText(label)).toBeInTheDocument();
  },
};
