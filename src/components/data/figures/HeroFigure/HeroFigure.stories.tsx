import type { Meta, StoryObj } from "@storybook/react-vite";
import { HeroFigure } from "./HeroFigure";

const meta = {
  title: "Data/Figures/HeroFigure",
  component: HeroFigure,
  tags: ["layer:block", "autodocs", "direction:a"],
  parameters: { direction: "a" },
  args: { label: "Open cases", value: "3", unit: "open", tone: "plain", children: "1 critical · 1 high · 1 medium" },
  argTypes: { tone: { control: "radio", options: ["plain", "one", "danger"] }, children: { control: "text" } },
} satisfies Meta<typeof HeroFigure>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Gold: the one figure that matters in the view. */
export const TheOne: Story = { args: { label: "Credit left", value: "182.5", unit: "credits", tone: "one", children: "About 92 days at the current pace" } };
