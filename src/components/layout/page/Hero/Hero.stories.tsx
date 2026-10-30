import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { TrendChart } from "../../../charts/time/TrendChart";
import { Figure, FigureRow } from "../../../data/figures/FigureRow";
import { HeroFigure } from "../../../data/figures/HeroFigure";
import { SeverityMark } from "../../../marks/status/SeverityMark";
import { TextLink } from "../../../navigation/TextLink";
import { Hero, HeroAside, HeroFooter, HeroLead, HeroVisual } from "./Hero";

const counts = [10, 4, 2, 1, 4, 16, 0, 1, 4, 10, 3, 0, 12, 20, 8, 2, 7, 9, 1, 0, 8, 7, 4, 2, 9, 15, 4, 1];
const days = ["6 Oct", "7 Oct", "8 Oct", "9 Oct", "10 Oct", "11 Oct", "12 Oct"];
const activity = counts.map((detections, i) => ({
  at: `${days[Math.floor(i / 4)]} ${String((i % 4) * 6).padStart(2, "0")}h`,
  detections,
}));

const meta = {
  title: "Layout/Page/Hero",
  component: Hero,
  tags: ["layer:block", "autodocs", "status:deprecated"],
  args: {
    label: "Detections · last 7 days",
    title: "Three bursts this week, the largest on 9 October",
    heading: 2,
    children: null,
  },
  argTypes: {
    label: { control: "text" },
    title: { control: "text" },
    heading: { control: "radio", options: [2, 3] },
    children: { control: false },
  },
} satisfies Meta<typeof Hero>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Deprecated: removed in 0.12.0; write `Panel surface="hero"` (`Layout/Page/Panel` → Hero).
 * The page's signature visual on navy: the one figure beside it, the chart,
 * and the supporting figures as its footer.
 */
export const Default: Story = {
  render: (args) => (
    <Hero {...args}>
      <HeroAside>
        <TextLink href="#cases">All cases</TextLink>
      </HeroAside>
      <HeroLead>
        <HeroFigure label="Open cases" value="3">
          <SeverityMark level="critical" label="1 critical" />
          <SeverityMark level="high" label="1 high" />
          <SeverityMark level="medium" label="1 medium" />
        </HeroFigure>
      </HeroLead>
      <HeroVisual>
        <TrendChart
          label="Detections per 6 hours, last 7 days"
          height="lg"
          data={activity}
          series={[{ key: "detections", label: "Detections", kind: "bar" }]}
        />
      </HeroVisual>
      <HeroFooter>
        <FigureRow label="Supporting figures" variant="footer">
          <Figure label="New in 24 h" value="1">
            1 escalated
          </Figure>
          <Figure label="Unassigned" value="2" tone="warn">
            of 3 open
          </Figure>
          <Figure label="Time to acknowledge" value="2.9 h">
            median · 7 days
          </Figure>
          <Figure label="Time to resolve" value="1 d">
            median · 7 days
          </Figure>
        </FigureRow>
      </HeroFooter>
    </Hero>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const hero = canvas.getByRole("region", { name: "Three bursts this week, the largest on 9 October" });
    await expect(hero).toHaveAttribute("data-theme", "dark");
    await expect(canvas.getByText("Time to resolve")).toBeVisible();
  },
};

/** Without a lead figure the visual takes the hero's whole width. */
export const VisualOnly: Story = {
  render: (args) => (
    <Hero {...args}>
      <HeroVisual>
        <TrendChart
          label="Detections per 6 hours, last 7 days"
          height="md"
          data={activity}
          series={[{ key: "detections", label: "Detections", kind: "bar" }]}
        />
      </HeroVisual>
    </Hero>
  ),
};
