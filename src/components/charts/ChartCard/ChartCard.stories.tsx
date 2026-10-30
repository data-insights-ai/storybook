import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { ChartCard, ChartCardAction, ChartCardGrid } from "./ChartCard";
import { TextLink } from "../../navigation/TextLink";
import { TrendChart } from "../time/TrendChart";

const days = Array.from({ length: 30 }, (_, i) => new Date(Date.UTC(2026, 9, 1 + i)).toISOString().slice(0, 10));
const short = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
const seats = days.map((at, i) => ({ at, used: Math.min(5, 2 + Math.floor(i / 8)) }));

const meta = {
  title: "Charts/ChartCard",
  component: ChartCard,
  tags: ["layer:block", "autodocs", "status:deprecated"],
  args: { title: "Seats", children: null },
  parameters: {
    docs: {
      description: {
        component:
          '**Deprecated, removed in 0.12.0.** A dashboard figure is a `Panel` (`title`, `heading`, `wide`) with a `Figure size="compact"` in `PanelFigure`, the chart in `PanelVisual` and the link in `PanelActions`; the cards sit in a `Grid`. See Charts/Time/TrendChart, Dashboard. `ChartCard` now renders exactly that, so old call sites look the same as the new ones.',
      },
    },
  },
} satisfies Meta<typeof ChartCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The old props, drawn as a Panel with a compact Figure. */
export const Deprecated: Story = {
  render: () => (
    <ChartCardGrid>
      <h2 className="di-sr">Contract</h2>
      <ChartCard title="Seats" figure="5 of 5" note="1 person waiting" tone="warn">
        <ChartCardAction>
          <TextLink href="#seats">Manage seats</TextLink>
        </ChartCardAction>
        <TrendChart
          label="Seats in use by day"
          data={seats}
          series={[{ key: "used", label: "In use", kind: "area" }]}
          formatX={short}
          height="sm"
        />
      </ChartCard>
    </ChartCardGrid>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const panel = canvas.getByRole("region", { name: "Seats" });
    await expect(panel).toHaveClass("di-panel");
    await expect(within(panel).getByText("5 of 5")).toBeVisible();
    await expect(within(panel).getByRole("link", { name: "Manage seats" })).toBeVisible();
  },
};
