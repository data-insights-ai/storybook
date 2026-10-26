import type { Meta, StoryObj } from "@storybook/react-vite";
import { Globe, ShieldCheck, Timer } from "lucide-react";
import { expect, within } from "storybook/test";
import { PrivacyBadge } from "./PrivacyBadge";

const meta = {
  title: "Blocks/Inference/Privacy",
  component: PrivacyBadge,
  tags: ["autodocs"],
  args: { scope: "local", children: null },
  argTypes: {
    scope: { control: "radio", options: ["local", "external", "retention"] },
    children: { control: false },
  },
} satisfies Meta<typeof PrivacyBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The icon leads, then the words — the order `Button` takes. */
export const Local: Story = {
  render: (args) => (
    <PrivacyBadge {...args}>
      <ShieldCheck aria-hidden />
      local processing
    </PrivacyBadge>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("local processing")).toBeVisible();
  },
};

/** Where a query goes and how long it is kept. Both, or neither. */
export const Every: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      <PrivacyBadge scope="local">
        <ShieldCheck aria-hidden />
        local processing
      </PrivacyBadge>
      <PrivacyBadge scope="external">
        <Globe aria-hidden />
        model · eu-central
      </PrivacyBadge>
      <PrivacyBadge scope="retention">
        <Timer aria-hidden />
        retained 30 days
      </PrivacyBadge>
    </div>
  ),
};
