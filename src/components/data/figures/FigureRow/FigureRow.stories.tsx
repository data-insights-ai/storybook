import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Figure, FigureNote } from "../Figure";
import { FigureRow } from "./FigureRow";

const meta = {
  title: "Data/Figures/FigureRow",
  component: FigureRow,
  tags: ["layer:block", "autodocs"],
  args: { label: "Case figures", variant: "strip", size: "regular", children: null },
  argTypes: {
    label: { control: "text" },
    variant: { control: "radio", options: ["footer", "strip"] },
    size: { control: "radio", options: ["regular", "compact"] },
    children: { control: false },
  },
  render: (args) => (
    <FigureRow {...args}>
      <Figure label="Signals" value="1,064">
        12 rules
      </Figure>
      <Figure label="Hosts" value="39" tone="danger">
        <FigureNote tone="danger">36 in finance</FigureNote>
      </Figure>
      <Figure label="Accounts" value="4">
        svc-backup most active
      </Figure>
      <Figure label="Score" value="98" unit="of 100" />
    </FigureRow>
  ),
} satisfies Meta<typeof FigureRow>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figures without a hero sit on a strip a step below the ground; one description list for the row. */
export const Strip: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("1,064")).toBeVisible();
    await expect(canvasElement.querySelectorAll("dl")).toHaveLength(1);
    const first = canvasElement.querySelector(".di-figure") as HTMLElement;
    const list = canvasElement.querySelector(".di-figure-list") as HTMLElement;
    await expect(first.getBoundingClientRect().left).toBeLessThan(list.getBoundingClientRect().left);
  },
};

/** Under a hero the row is its footer: no band, the hero's rule above it. */
export const Footer: Story = {
  args: { variant: "footer" },
};

/** A quiet health line at the foot of a page: values in the body size, amber only on the failing one. */
export const Compact: Story = {
  args: { label: "Delivery", size: "compact" },
  render: (args) => (
    <FigureRow {...args}>
      <Figure label="Notifications" value="2 of 2 active" />
      <Figure label="SIEM exports" value="1 of 2 delivering" tone="warn" />
      <Figure label="Access" value="8 people and service accounts" />
    </FigureRow>
  ),
  play: async ({ canvasElement }) => {
    const value = within(canvasElement).getByText("2 of 2 active");
    await expect(parseFloat(getComputedStyle(value).fontSize)).toBe(14);
  },
};
