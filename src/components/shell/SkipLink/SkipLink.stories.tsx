import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { SkipLink } from "./SkipLink";

const meta = {
  title: "Shell/SkipLink",
  component: SkipLink,
  tags: ["layer:primitive", "autodocs"],
  args: { label: "Skip to content", target: "skip-target" },
  argTypes: { label: { control: "text" }, target: { control: "text" } },
} satisfies Meta<typeof SkipLink>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Hidden until the keyboard reaches it; Enter moves focus past the navigation to the page. */
export const Default: Story = {
  render: (args) => (
    <>
      <SkipLink {...args} />
      <div id={args.target} tabIndex={-1}>
        <p>The page begins here.</p>
      </div>
    </>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const link = canvas.getByRole("link", { name: "Skip to content" });
    await userEvent.tab();
    await waitFor(() => expect(link).toHaveFocus());
    await expect(link).toBeVisible();
    await userEvent.keyboard("{Enter}");
    await waitFor(() => expect(canvasElement.ownerDocument.getElementById("skip-target")).toHaveFocus());
  },
};
