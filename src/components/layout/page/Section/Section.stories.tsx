import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Stack } from "../../arrange/Stack";
import { Section } from "./Section";
import { onPanel } from "../../../../../.storybook/onPanel";

const meta = {
  title: "Layout/Page/Section",
  component: Section,
  tags: ["layer:block", "autodocs"],
  args: { title: "Affected products", heading: 3, children: null },
  argTypes: { children: { control: false } },
  decorators: [onPanel("Record")],
  render: (args) => (
    <Section {...args}>
      <p>Edge gateway 4.0 up to 4.2.0, fixed in 4.2.1.</p>
      <p>Edge gateway appliance, every firmware before 2026-10.</p>
    </Section>
  ),
} satisfies Meta<typeof Section>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A heading over what it names, inside the panel that holds it. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const region = within(canvasElement).getByRole("region", { name: "Affected products" });
    await expect(within(region).getByRole("heading", { level: 3 })).toHaveTextContent("Affected products");
  },
};

/** Several parts of one surface stand apart by the stack's gap. */
export const Parts: Story = {
  render: () => (
    <Stack gap={24}>
      <Section title="What happened">
        <p>Attackers run code on the gateways without signing in.</p>
      </Section>
      <Section title="What to do">
        <p>Update to 4.2.1, then rotate the gateway's keys.</p>
      </Section>
    </Stack>
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getAllByRole("heading", { level: 3 })).toHaveLength(2);
  },
};

/** With an id the heading can take focus, so a link or the end of a flow lands on it. */
export const Focusable: Story = {
  args: { id: "affected" },
  play: async ({ canvasElement }) => {
    const heading = within(canvasElement).getByRole("heading", { name: "Affected products" });
    heading.focus();
    await expect(heading).toHaveFocus();
    await expect(heading).toHaveAttribute("id", "affected");
  },
};
