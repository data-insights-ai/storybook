import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Panel } from "../../../layout/page/Panel";
import { Figure, FigureNote } from "../Figure";
import { Sparkline } from "./Sparkline";

const rising = [38, 46, 41, 52, 49, 61, 74, 96];

const meta = {
  title: "Data/Figures/Sparkline",
  component: Sparkline,
  tags: ["layer:primitive", "autodocs"],
  args: {
    values: rising,
    highlight: 7,
    tone: "danger",
    width: "fixed",
    height: "sm",
    label: "Unsealed entries over the last eight hours, rising sharply in the last two.",
  },
  argTypes: {
    values: { control: false },
    captions: { control: false },
    highlight: { control: { type: "number", min: 0 } },
    tone: { control: "radio", options: ["series", "danger"] },
    width: { control: "radio", options: ["fixed", "fill"] },
    height: { control: "radio", options: ["sm", "md"] },
    label: { control: "text" },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 320 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Sparkline>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Under its figure, in a panel: the last reading marked, in danger because it is past the threshold. */
export const Rising: Story = {
  render: (args) => (
    <Panel>
      <Figure label="Unsealed" value="1,284" tone="danger" size="compact">
        <FigureNote tone="danger">up 940 since 08:00Z</FigureNote>
        <Sparkline {...args} />
      </Figure>
    </Panel>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("img", { name: /rising sharply/ })).toBeVisible();
    await expect(
      canvasElement.querySelectorAll(".di-sparkline-bar.is-series, .di-sparkline-bar.is-danger"),
    ).toHaveLength(1);
  },
};

/** A week across the column, today marked in the series ink, the period named under the bars. */
export const Week: Story = {
  args: {
    values: [34, 41, 38, 52, 47, 63, 58],
    highlight: 6,
    tone: "series",
    width: "fill",
    height: "md",
    captions: ["09-17", "09-20", "09-23"],
    label: "Sign-ins per day, 17 to 23 September, highest on the 22nd.",
  },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText("09-23")).toBeVisible();
  },
};

/** Nothing happening, which the words have to say as plainly as the bars. Nothing is marked. */
export const Flat: Story = {
  args: {
    values: [48, 47, 49, 48, 50, 48, 49, 48],
    highlight: undefined,
    label: "Unsealed entries, flat over the last eight hours.",
  },
};
