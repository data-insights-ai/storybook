import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { TrendChart } from "./TrendChart";
import { Figure } from "../../../data/figures/Figure";
import { Grid } from "../../../layout/arrangement/Grid";
import { Panel, PanelActions, PanelFigure, PanelVisual } from "../../../layout/page/Panel";
import { TextLink } from "../../../navigation/TextLink";
import { PeriodTimeline } from "../../../timeline/PeriodTimeline";

const days = Array.from({ length: 30 }, (_, i) => new Date(Date.UTC(2026, 9, 1 + i)).toISOString().slice(0, 10));
const short = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
const kurz = (iso: string) =>
  new Date(iso).toLocaleDateString("de-DE", { day: "numeric", month: "short", timeZone: "UTC" });
const withYear = (iso: string, { year }: { year: boolean }) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: year ? "numeric" : undefined,
    timeZone: "UTC",
  });

const balance = days.map((at, i) => ({
  at,
  balance: i < 20 ? 300 - i * 6 : null,
  forecast: i >= 19 ? 186 - (i - 19) * 6 : null,
}));
const usage = days.map((at, i) => ({ at, soc: 20 + ((i * 7) % 13), reports: 4 + ((i * 3) % 5) }));
const seats = days.map((at, i) => ({ at, used: Math.min(5, 2 + Math.floor(i / 8)), capacity: 5 }));

/* Every tick and marker label lies inside the chart's own box: none is cut at either edge. */
/** A marker label sits above the plot inside the chart: it covers no bar, line or area, and nothing cuts it off. */
async function markersClear(canvasElement: HTMLElement) {
  for (const label of canvasElement.querySelectorAll(".di-trend-marker")) {
    const svg = label.closest("svg")!;
    const box = label.getBoundingClientRect();
    const frame = svg.getBoundingClientRect();
    await expect([box.left >= frame.left - 0.5, box.right <= frame.right + 0.5, box.top >= frame.top]).toEqual([
      true,
      true,
      true,
    ]);
    const plot = svg.querySelector(".recharts-cartesian-grid")!.getBoundingClientRect();
    await expect(box.bottom).toBeLessThanOrEqual(plot.top);
    const marks = svg.querySelectorAll(".recharts-bar-rectangle path, .recharts-line-curve, .recharts-area-area");
    const covered = [...marks].filter((mark) => {
      const r = mark.getBoundingClientRect();
      return r.width > 0 && box.left < r.right && box.right > r.left && box.top < r.bottom && box.bottom > r.top;
    });
    await expect(covered).toHaveLength(0);
  }
}

async function ticksInside(canvasElement: HTMLElement) {
  for (const chart of canvasElement.querySelectorAll(".di-chart")) {
    const box = chart.getBoundingClientRect();
    for (const text of chart.querySelectorAll(".recharts-cartesian-axis-tick-value, .recharts-label")) {
      const r = text.getBoundingClientRect();
      await expect(r.left, `${text.textContent} starts inside`).toBeGreaterThanOrEqual(box.left - 0.5);
      await expect(r.right, `${text.textContent} ends inside`).toBeLessThanOrEqual(box.right + 0.5);
    }
  }
}

const meta = {
  title: "Charts/Time/TrendChart",
  component: TrendChart,
  tags: ["layer:block", "autodocs"],
  args: {
    label: "Seats in use by day",
    data: seats,
    series: [{ key: "used", label: "In use", kind: "area" }],
    formatX: short,
    height: "sm",
  },
  argTypes: {
    data: { control: false },
    series: { control: false },
    markers: { control: false },
    formatX: { control: false },
    formatValue: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component: [
          "**Purpose:** a value over time — a balance, a count per day, seats in use — with the days that matter marked on the axis.",
          "**When to use:** one to three series on one time axis, in a `Panel` beside the `Figure` it explains. **When not to:** a single number with no axis is a `Figure` (with a `Sparkline` beside it); counts above and below a line per period are a `Seismograph`; periods such as licenses are a `PeriodTimeline`; many events on one clock are an `EventTimeline`.",
          "**Anatomy:** the plot (a hairline grid, the x axis in the mono track, the y axis), the series, dashed `markers` with their label in a band above the plot (centred on the rule, moved inward at the edges, never over the data), and a legend under the plot when there is more than one series.",
          "**Variants:** a series' `kind` is `line` for a level, `area` for an amount, `bar` for a count per period; `dashed` is a projection of the same series; `tone` is `series`, `compare` (what it is measured against), `highlight`, `muted`, or `warn`/`danger` only for a state. `height` is `sm` on a dashboard, `md`, `lg`.",
          "**States:** a `null` value is a gap, not zero. The plot fades in once (120 ms); no series draws itself in, and a marker appears with the data.",
          "**Content:** the product formats the values and the days (`formatX`, `formatValue`); the panel states the key figure in words.",
          "**Accessibility:** a group named `label`; the tooltip follows the pointer; the figure beside it carries the number for a screen reader.",
        ].join("\n\n"),
      },
    },
  },
  decorators: [
    (Story, { parameters }) =>
      parameters.wide ? (
        <Story />
      ) : (
        <div style={{ maxWidth: 640 }}>
          <Story />
        </div>
      ),
  ],
} satisfies Meta<typeof TrendChart>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A dashboard: one `Panel` per figure in a `Grid`, its title a heading one below the section's, the compact `Figure`
 * naming what is measured, the chart it rests on, and the link to the
 * page that changes it. `wide` gives the chart that needs it the whole row.
 */
export const Dashboard: Story = {
  parameters: { wide: true, controls: { disable: true } },
  render: () => (
    <>
      {/* The page and its section supply the headings above the dashboard's panels. */}
      <h2 className="di-sr">Organization</h2>
      <h3 className="di-sr">At a glance</h3>
      <Grid min="480px" gap={24}>
        <Panel title="Credit" heading={4}>
          <PanelActions>
            <TextLink href="#credits">Credits</TextLink>
          </PanelActions>
          <PanelFigure>
            <Figure size="compact" label="Balance" value="186" unit="credits">
              lasts about 31 days at 6 a day
            </Figure>
          </PanelFigure>
          <PanelVisual>
            <TrendChart
              label="Credit balance by day, with forecast"
              data={balance}
              series={[
                { key: "balance", label: "Balance", kind: "area" },
                { key: "forecast", label: "Forecast", kind: "line", dashed: true },
              ]}
              formatX={short}
              height="sm"
            />
          </PanelVisual>
        </Panel>
        <Panel title="Seats" heading={4}>
          <PanelActions>
            <TextLink href="#seats">Manage seats</TextLink>
          </PanelActions>
          <PanelFigure>
            <Figure size="compact" label="In use" value="5" unit="of 5" tone="warn">
              1 person waiting
            </Figure>
          </PanelFigure>
          <PanelVisual>
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
          </PanelVisual>
        </Panel>
        <Panel title="Usage per product" heading={4} wide>
          <PanelActions>
            <TextLink href="#usage">Usage</TextLink>
          </PanelActions>
          <PanelFigure>
            <Figure size="compact" label="Ingested" value="812" unit="GB">
              last 30 days
            </Figure>
          </PanelFigure>
          <PanelVisual>
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
          </PanelVisual>
        </Panel>
        <Panel title="Licenses and subscription" heading={4} wide>
          <PanelActions>
            <TextLink href="#licenses">Licenses</TextLink>
          </PanelActions>
          <PeriodTimeline
            label="Licenses and subscription over time"
            marker={{ at: "2026-10-22", label: "Today" }}
            formatDate={withYear}
            rows={[
              {
                id: "pro",
                label: "Professional",
                spans: [{ start: "2026-09-12", end: "2027-05-10", graceEnd: "2027-05-24", tone: "ok" }],
                caption: "valid until 10 May 2027",
              },
              {
                id: "team",
                label: "Team Add-on",
                spans: [{ start: "2026-10-02", end: "2026-11-02", graceEnd: "2026-11-16", tone: "warn" }],
                caption: "renews 2 Nov 2026",
              },
            ]}
          />
        </Panel>
      </Grid>
    </>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { level: 4, name: "Credit" })).toBeVisible();
    await expect(canvas.getByRole("group", { name: "Credit balance by day, with forecast" })).toBeVisible();
    await expect(canvas.getByRole("group", { name: "Licenses and subscription over time" })).toBeVisible();
    const panels = [...canvasElement.querySelectorAll(".di-panel")].map((el) => el.getBoundingClientRect());
    const grid = canvasElement.querySelector(".di-grid")!.getBoundingClientRect();
    await expect(Math.round(panels[2]!.width)).toBe(Math.round(grid.width));
    await ticksInside(canvasElement);
    await markersClear(canvasElement);
  },
};

/**
 * Markers in each tone. The dashed rule takes the chart colour; its label
 * is text and takes the status ink, so it reads in either theme. The rule
 * appears with the data, never on its own.
 */
export const Markers: Story = {
  args: {
    label: "Seats in use by day, with renewal, expiry and cut-off",
    markers: [
      { at: days[6]!, label: "Renewal", tone: "neutral" },
      { at: days[16]!, label: "Expires", tone: "warn" },
      { at: days[26]!, label: "Cut-off", tone: "danger" },
    ],
  },
  render: (args) => (
    <Panel title="Seats" heading={2}>
      <TrendChart {...args} />
    </Panel>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const label of ["Renewal", "Expires", "Cut-off"]) await expect(canvas.getByText(label)).toBeInTheDocument();
    await ticksInside(canvasElement);
    await markersClear(canvasElement);
  },
};

/**
 * A forecast continues what was measured: the same series colour, dashed,
 * `null` until today, as the measured one is `null` after it. The legend
 * keeps the dash.
 */
export const Forecast: Story = {
  args: {
    label: "Credit balance by day, with forecast",
    data: balance,
    series: [
      { key: "balance", label: "Balance", kind: "area" },
      { key: "forecast", label: "Forecast", kind: "line", dashed: true },
    ],
    height: "md",
  },
  render: (args) => (
    <Panel title="Credit" heading={2}>
      <TrendChart {...args} />
    </Panel>
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText("Forecast")).toBeVisible();
    await ticksInside(canvasElement);
    await markersClear(canvasElement);
  },
};

/** On a phone the axis keeps fewer days, and the last one stays whole at the plot's edge. */
export const Phone: Story = {
  globals: { viewport: { value: "phone", isRotated: false } },
  args: { markers: [{ at: days[24]!, label: "Expires", tone: "warn" }] },
  render: (args) => (
    <Panel title="Seats" heading={2}>
      <TrendChart {...args} />
    </Panel>
  ),
  play: async ({ canvasElement }) => {
    await ticksInside(canvasElement);
    await markersClear(canvasElement);
  },
};

/** German days and series names are longer; the axis thins its ticks and the last stays whole. */
export const German: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Panel title="Verbrauch pro Produkt" heading={2}>
      <PanelActions>
        <TextLink href="#nutzung">Nutzung</TextLink>
      </PanelActions>
      <PanelFigure>
        <Figure size="compact" label="Eingelesen" value="812" unit="GB">
          in den letzten 30 Tagen
        </Figure>
      </PanelFigure>
      <PanelVisual>
        <TrendChart
          label="Verbrauch pro Produkt und Tag"
          data={usage}
          series={[
            { key: "soc", label: "KI-gestütztes Sicherheitszentrum", kind: "bar", stack: "u" },
            { key: "reports", label: "Berichte und Auswertungen", kind: "bar", stack: "u", tone: "compare" },
          ]}
          formatX={kurz}
          formatValue={(v) => `${v} GB`}
          markers={[{ at: days[27]!, label: "Läuft am 28. Okt. ab", tone: "warn" }]}
        />
      </PanelVisual>
    </Panel>
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText("Berichte und Auswertungen")).toBeVisible();
    await ticksInside(canvasElement);
    await markersClear(canvasElement);
  },
};
