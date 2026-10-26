import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { VersionTag } from "./VersionTag";

const meta = {
  title: "Primitives/VersionTag",
  component: VersionTag,
  tags: ["autodocs"],
  args: { children: "v4.18.2" },
  argTypes: { children: { control: "text" } },
} satisfies Meta<typeof VersionTag>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A version or a short hash: it names a thing, it does not report a state. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("v4.18.2")).toBeVisible();
  },
};

export const Build: Story = {
  args: { children: "build 7f3a99e" },
};

/** Beside each other, which is where they are actually read. */
export const Pair: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: "flex", gap: 8 }}>
      <VersionTag>v4.18.2</VersionTag>
      <VersionTag>build 7f3a99e</VersionTag>
    </div>
  ),
};
