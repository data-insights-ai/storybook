import type { ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { CompareChart, RangeChart, SeriesChart } from "../foundations/guide/BrandCharts";

const meta = {
  title: "Components/Chart",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj;

function Frame({ children }: { children: ReactNode }) {
  return <div style={{ width: "min(100%, 560px)" }}>{children}</div>;
}

export const Series: Story = {
  parameters: {
    docs: { description: { story: "Navy series. One cited value in gold. The estimate is the dashed tail." } },
  },
  render: () => (
    <Frame>
      <SeriesChart />
    </Frame>
  ),
};

export const Compare: Story = {
  parameters: {
    docs: { description: { story: "Grey bars for the comparison. Gold is the bar that is the story." } },
  },
  render: () => (
    <Frame>
      <CompareChart />
    </Frame>
  ),
};

export const Range: Story = {
  parameters: {
    docs: { description: { story: "The band is the range. The solid line is the median." } },
  },
  render: () => (
    <Frame>
      <RangeChart />
    </Frame>
  ),
};

export const Legend: Story = {
  parameters: {
    docs: { description: { story: "Legend labels and swatches come from ChartConfig. A dashed series keeps the dash." } },
  },
  render: () => (
    <Frame>
      <SeriesChart legend />
    </Frame>
  ),
};
