import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { PageHeader } from "./Heading";
import { StatusPill } from "./StatusPill";

const meta = {
  title: "Blocks/PageHeader",
  component: PageHeader,
  tags: ["autodocs"],
  args: {
    eyebrow: "Watchlist",
    title: "Watched identities",
    lede: "Manage the people, companies, domains, and email addresses under automatic watch.",
    tier: "console",
  },
  argTypes: {
    eyebrow: { control: "text" },
    title: { control: "text" },
    lede: { control: "text" },
    tier: { control: "radio", options: ["console", "brand"] },
    children: { control: false },
  },
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TitleOnly: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { name: "Watched identities" })).toBeVisible();
  },
};

export const WithStatus: Story = {
  render: (args) => (
    <PageHeader {...args}>
      <StatusPill tone="ok" dot={true}>
        Monitoring active
      </StatusPill>
    </PageHeader>
  ),
};

/**
 * The display tier the brand pages use: 34px up to 56, measured to 16ch,
 * over an 18px lede. It carries no bottom margin, because the stack
 * around it owns a brand page's rhythm.
 */
export const Brand: Story = {
  args: {
    eyebrow: "Brand essence",
    title: "Provable AI for regulated decisions.",
    lede: "Every answer is grounded in a temporal knowledge graph, every claim is tied to its source, and every source has a timestamp.",
    tier: "brand",
  },
};

/** The two tiers together, which is the only way the gap between them reads. */
export const Tiers: Story = {
  name: "Both tiers",
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
      <PageHeader
        tier="brand"
        eyebrow="Brand essence"
        title="Provable AI for regulated decisions."
        lede="Every claim is tied to its source, and every source has a timestamp."
      />
      <PageHeader
        tier="console"
        eyebrow="Watchlist"
        title="Watched identities"
        lede="Manage the people, companies, domains, and email addresses under automatic watch."
      />
    </div>
  ),
};
