import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { SeverityMark } from "../../../marks/SeverityMark";
import { HeroFigure } from "./HeroFigure";

const meta = {
  title: "Data/Figures/HeroFigure",
  component: HeroFigure,
  tags: ["layer:block", "autodocs"],
  args: { label: "Open cases", value: "3", unit: "", tone: "neutral", children: null },
  argTypes: {
    label: { control: "text" },
    value: { control: "text" },
    unit: { control: "text" },
    tone: { control: "radio", options: ["neutral", "warn", "danger"] },
    children: { control: false },
  },
} satisfies Meta<typeof HeroFigure>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The one number, and what it is read against. */
export const Default: Story = {
  render: (args) => (
    <HeroFigure {...args}>
      <SeverityMark level="critical" label="1 critical" />
      <SeverityMark level="high" label="1 high" />
      <SeverityMark level="medium" label="1 medium" />
    </HeroFigure>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("3")).toBeVisible();
  },
};

/** A denominator after the figure, one step quieter. */
export const WithUnit: Story = {
  args: { label: "Seats in use", value: "4", unit: "of 5" },
};
