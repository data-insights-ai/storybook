import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { ArchitectureScreen } from "./Architecture";

const meta = {
  title: "Patterns/Architecture",
  tags: ["layer:screen", "!autodocs"],
  component: ArchitectureScreen,
  parameters: { layout: "fullscreen" },
  args: { state: "running" },
} satisfies Meta<typeof ArchitectureScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The pipeline as stage cards, then each service with its facts. Nothing is current while all run. */
export const Pipeline: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { level: 1, name: "Architecture" })).toBeVisible();
    await expect(canvas.getByRole("list", { name: "Pipeline stages" }).querySelectorAll("li")).toHaveLength(5);
    await expect(canvasElement.querySelector("[aria-current='step']")).toBeNull();
  },
};

/** One stage falls behind: it takes the warn tone (not the current step's navy), and the first block says what it costs. */
export const Backlog: Story = {
  args: { state: "backlog" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Processing is 41 minutes behind.")).toBeVisible();
    await expect(canvasElement.querySelector("[aria-current='step']")).toBeNull();
    const lagging = canvasElement.querySelector<HTMLElement>(".di-step-card.is-warn")!;
    await expect(lagging).toHaveTextContent("Processing");
    await expect(within(lagging).getByText("12,480 waiting")).toBeVisible();
    const calm = canvasElement.querySelector<HTMLElement>(".di-step-card:not(.is-warn)")!;
    await expect(getComputedStyle(lagging).backgroundColor).toBe(getComputedStyle(calm).backgroundColor);
  },
};
