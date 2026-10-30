import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextLink } from "../../../navigation/TextLink";
import { Surface, SurfaceAside, SurfaceTakeaway } from "./Surface";

const meta = {
  title: "Layout/Page/Surface",
  component: Surface,
  tags: ["layer:block", "autodocs", "direction:a"],
  parameters: { direction: "a" },
  args: { level: "surface", emphasis: false, label: "Sources", title: "Two sources have gone quiet", children: null },
  argTypes: {
    level: { control: "radio", options: ["surface", "inset", "hero"] },
    children: { control: false },
  },
} satisfies Meta<typeof Surface>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Surface {...args}>
      <SurfaceAside>
        <TextLink href="#sources">All sources</TextLink>
      </SurfaceAside>
      <p>Identity sign-ins stopped 7 hours ago: the reader lost its permission.</p>
      <Surface level="inset">
        <p>An inset is the deepest level: a group inside a surface, without a line.</p>
      </Surface>
      <SurfaceTakeaway>12 other sources collect normally.</SurfaceTakeaway>
    </Surface>
  ),
};

/** The one block that matters in the view. */
export const Emphasis: Story = { ...Default, args: { emphasis: true, label: "Proved", title: "Rule 14 · new path to a critical server" } };

/** The luminous navy zone, in both themes, behind the page's signature visual. */
export const Hero: Story = { ...Default, args: { level: "hero", label: "Detections · 7 days", title: "Three bursts this week" } };
