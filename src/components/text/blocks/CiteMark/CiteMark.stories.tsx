import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { CiteMark } from "./CiteMark";
import { onPanel } from "../../../../../.storybook/onPanel";

const meta = {
  title: "Text/Blocks/CiteMark",
  component: CiteMark,
  tags: ["layer:primitive", "autodocs"],
  args: { n: 1, href: "#source-1", label: "Source 1: CISA" },
  decorators: [onPanel("A cited claim")],
  render: (args) => (
    <p>
      Attackers run code on the gateways without signing in.
      <CiteMark {...args} />
    </p>
  ),
} satisfies Meta<typeof CiteMark>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A raised number after the claim, named for a screen reader by its source. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const mark = within(canvasElement).getByRole("link", { name: "Source 1: CISA" });
    await expect(mark).toHaveTextContent("1");
    await expect(getComputedStyle(mark).verticalAlign).toBe("super");
  },
};
