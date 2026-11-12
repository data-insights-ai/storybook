import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Stack } from "../../../layout/arrange/Stack";
import { DiffMark } from "./DiffMark";
import { onPanel } from "../../../../../.storybook/onPanel";

const meta = {
  title: "Text/Blocks/DiffMark",
  component: DiffMark,
  tags: ["layer:primitive", "autodocs"],
  args: { change: "removed", label: "Removed", sign: false, layout: "inline", children: "4.2.0" },
  decorators: [onPanel("What changed")],
  render: () => (
    <p>
      Fixed in{" "}
      <DiffMark change="removed" label="Before">
        4.2.0
      </DiffMark>
      <span aria-hidden> → </span>
      <DiffMark change="added" label="After">
        4.2.1
      </DiffMark>
    </p>
  ),
} satisfies Meta<typeof DiffMark>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A value old and new, the change said aloud before each side. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const removed = canvasElement.querySelector("del")!;
    await expect(removed).toHaveTextContent("[Before: 4.2.0]");
    await expect(getComputedStyle(removed).textDecorationLine).toBe("line-through");
    await expect(canvasElement.querySelector("ins")).toHaveTextContent("[After: 4.2.1]");
  },
};

/** The items a list lost and gained, each on its own line behind its sign. */
export const ListItems: Story = {
  render: () => (
    <Stack gap={8}>
      <DiffMark change="removed" label="Removed item" sign>
        CWE-79
      </DiffMark>
      <DiffMark change="added" label="Added item" sign>
        CWE-94
      </DiffMark>
    </Stack>
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText("−")).toHaveAttribute("aria-hidden");
    await expect(within(canvasElement).getByText("+")).toHaveAttribute("aria-hidden");
  },
};

/** A paragraph replaced whole: each side on its wash, readable without a strike. */
export const Block: Story = {
  render: () => (
    <Stack gap={8}>
      <DiffMark change="removed" label="Current text" layout="block">
        <p>Attackers can read files on the gateway.</p>
      </DiffMark>
      <DiffMark change="added" label="Suggested text" layout="block">
        <p>Attackers run code on the gateway without signing in.</p>
      </DiffMark>
    </Stack>
  ),
  play: async ({ canvasElement }) => {
    const removed = canvasElement.querySelector("del")!;
    await expect(getComputedStyle(removed).display).toBe("block");
    await expect(getComputedStyle(removed).textDecorationLine).toBe("none");
    await expect(getComputedStyle(removed.querySelector("p")!).marginBlockEnd).toBe("0px");
  },
};
