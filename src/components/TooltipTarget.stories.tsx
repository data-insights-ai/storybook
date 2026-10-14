import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor } from "storybook/test";
import { TooltipTarget } from "./TooltipTarget";

const meta = {
  title: "Primitives/TooltipTarget",
  component: TooltipTarget,
  tags: ["autodocs"],
  args: { text: "RFC 3161", label: "Trusted timestamp protocol" },
  argTypes: { text: { control: "text" }, label: { control: "text" } },
} satisfies Meta<typeof TooltipTarget>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A term that names itself on hover and on keyboard focus. */
export const Default: Story = {};

/** Focus opens the label; Escape closes it again without moving focus. */
export const Focused: Story = {
  play: async ({ canvas }) => {
    const term = canvas.getByText("RFC 3161");
    await expect(term).toHaveAccessibleDescription("Trusted timestamp protocol");
    await userEvent.tab();
    await expect(term).toHaveFocus();
    const tip = term.querySelector(".di-tooltip-target-popup");
    await waitFor(() => expect(tip).toBeVisible());
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(tip).not.toBeVisible());
    await expect(term).toHaveFocus();
  },
};

/** Inside a mono run, the term keeps the type around it. */
export const InMonoText: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <p style={{ fontFamily: "var(--di-font-code)" }}>
      sealed under <TooltipTarget text="RFC 3161" label="Trusted timestamp protocol" />,{" "}
      <TooltipTarget text="SHA-256" label="Secure hash, 256 bits" />
    </p>
  ),
};
