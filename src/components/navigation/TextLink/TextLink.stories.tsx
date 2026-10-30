import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { TextLink } from "./TextLink";

const meta = {
  title: "Navigation/TextLink",
  component: TextLink,
  tags: ["layer:primitive", "autodocs"],
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

export const Plain: Story = {
  args: { plain: true, children: "3 unassigned" },
};

export const Disabled: Story = {
  args: { disabled: true, children: "Not available" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("button", { name: "Not available" })).toBeDisabled();
  },
};

/**
 * With an `href` it is an anchor: it navigates rather than acts, so it
 * opens in a new tab and copies like any other link.
 */
export const Link: Story = {
  args: { children: "Open the record" },
  parameters: { controls: { disable: true } },
  render: ({ children }) => <TextLink href="#/register/0148">{children}</TextLink>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const link = canvas.getByRole("link", { name: "Open the record" });
    await expect(link).toHaveAttribute("href", "#/register/0148");
  },
};

/** A record id that opens its record: quiet, because a machine wrote it. */
export const QuietLink: Story = {
  args: { children: "REG-0148" },
  parameters: { controls: { disable: true } },
  render: ({ children }) => (
    <TextLink href="#/register/0148" quiet={true}>
      {children}
    </TextLink>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("link", { name: "REG-0148" })).toHaveClass("is-quiet");
  },
};

/** In a sentence, which is where it has to hold its own. */
export const InProse: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <p style={{ maxWidth: 420, fontSize: 13, lineHeight: 1.6 }}>
      The manifest for this entry was sealed at 09:12:04Z. <TextLink>Open the record</TextLink> to see every source it
      cites, or <TextLink quiet={true}>export the seal</TextLink> for offline verification.
    </p>
  ),
};

/** A router's link component renders the anchor; the text link supplies only its look. */
export const WithRouterLink: Story = {
  parameters: { controls: { disable: true } },
  render: () => <TextLink render={<a href="#/records/0148" data-router="link" />}>REG-0148</TextLink>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const link = canvas.getByRole("link", { name: "REG-0148" });
    await expect(link).toHaveClass("di-textlink");
    await expect(link).toHaveAttribute("data-router", "link");
  },
};
