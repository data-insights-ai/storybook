import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Page } from "../../layout/page/Page";
import { BrandLogo } from "./BrandLogo";

const meta = {
  title: "Shell/BrandLogo",
  component: BrandLogo,
  tags: ["layer:primitive", "autodocs"],
  args: { shape: "logo", size: "md", label: "datAInsights" },
  argTypes: {
    shape: { control: "inline-radio", options: ["logo", "mark"] },
    size: { control: "inline-radio", options: ["md", "hero"] },
    label: { control: "text" },
  },
  // The logo heads a public page; it stands on the page, not on a panel.
  render: (args) => (
    <Page width="list">
      <BrandLogo {...args} />
    </Page>
  ),
} satisfies Meta<typeof BrandLogo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Lockup: Story = {
  play: async ({ canvasElement }) => {
    const shown = within(canvasElement)
      .getAllByRole("img", { name: "datAInsights" })
      .filter((img) => getComputedStyle(img).display !== "none");
    await expect(shown).toHaveLength(1);
  },
};

export const HeroMark: Story = {
  args: { shape: "mark", size: "hero" },
};
