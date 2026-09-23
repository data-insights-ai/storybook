import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { TextLink } from "./TextLink";

const meta = {
  title: "Primitives/TextLink",
  component: TextLink,
  tags: ["autodocs"],
  args: {
    children: "Open the record",
    quiet: false,
    disabled: false,
    type: "button",
    onClick: fn(),
  },
  argTypes: {
    children: { control: "text" },
    quiet: { control: "boolean" },
    disabled: { control: "boolean" },
    type: { control: "radio", options: ["button", "submit", "reset"] },
  },
} satisfies Meta<typeof TextLink>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Underlined in gold: the one place the seal colour touches running text. */
export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Open the record" }));
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};

/** Quiet, for a link beside a field label rather than inside a sentence. */
export const Quiet: Story = {
  args: { quiet: true, children: "Forgot password?" },
};

export const Disabled: Story = {
  args: { disabled: true, children: "Not available" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("button", { name: "Not available" })).toBeDisabled();
  },
};

/** In a sentence, which is where it has to hold its own. */
export const InProse: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <p style={{ maxWidth: 420, fontSize: 13, lineHeight: 1.6 }}>
      The manifest for this entry was sealed at 09:12:04Z. <TextLink>Open the record</TextLink> to see
      every source it cites, or <TextLink quiet={true}>export the seal</TextLink> for offline
      verification.
    </p>
  ),
};
