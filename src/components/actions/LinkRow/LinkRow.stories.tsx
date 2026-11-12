import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { TextLink } from "../../text/TextLink";
import { LinkRow } from "./LinkRow";
import { onPanel } from "../../../../.storybook/onPanel";

const meta = {
  title: "Actions/LinkRow",
  component: LinkRow,
  tags: ["layer:block", "autodocs"],
  args: { label: "Legal", size: "md", children: null },
  argTypes: { children: { control: false } },
  decorators: [onPanel("Plans")],
  render: (args) => (
    <LinkRow {...args}>
      <TextLink plain href="#">
        Terms of service
      </TextLink>
      <TextLink plain href="#">
        Privacy policy
      </TextLink>
      <TextLink plain href="#">
        Refund policy
      </TextLink>
    </LinkRow>
  ),
} satisfies Meta<typeof LinkRow>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Named, the row is a navigation landmark a reader finds on every page. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const nav = within(canvasElement).getByRole("navigation", { name: "Legal" });
    await expect(within(nav).getAllByRole("link")).toHaveLength(3);
    await expect(within(nav).getAllByRole("listitem")).toHaveLength(3);
  },
};

/** In the hint size, for a footer; without a label it is a list only. */
export const Small: Story = {
  args: { label: undefined, size: "sm" },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryByRole("navigation")).toBeNull();
    const list = within(canvasElement).getByRole("list");
    await expect(getComputedStyle(list).fontSize).toBe("12px");
  },
};

/** On a phone the links wrap between them, never inside one. */
export const Phone: Story = {
  parameters: { viewport: { value: "phone" } },
  play: async ({ canvasElement }) => {
    const list = within(canvasElement).getByRole("list");
    await expect(list.scrollWidth).toBeLessThanOrEqual(list.clientWidth + 1);
  },
};
