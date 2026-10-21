import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Breadcrumb } from "./Breadcrumb";
import { Button } from "./Button";
import { Fact, FactList } from "./FactList";
import {
  PageHeader,
  PageHeaderAside,
  PageHeaderCrumbs,
  PageHeaderFacts,
  PageHeaderStatus,
  PageHeaderTitle,
} from "./Heading";
import { Highlight } from "./Highlight";
import { StatusPill } from "./StatusPill";

const meta = {
  title: "Blocks/PageHeader",
  component: PageHeader,
  tags: ["autodocs"],
  args: {
    eyebrow: "Watchlist",
    lede: "Manage the people, companies, domains, and email addresses under automatic watch.",
    tier: "console",
    children: null,
  },
  argTypes: {
    eyebrow: { control: "text" },
    lede: { control: "text" },
    tier: { control: "radio", options: ["console", "brand"] },
    children: { control: false },
  },
  render: (args) => (
    <PageHeader {...args}>
      <PageHeaderTitle>Watched identities</PageHeaderTitle>
    </PageHeader>
  ),
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TitleOnly: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { level: 1, name: "Watched identities" })).toBeVisible();
  },
};

/**
 * The aside holds what sits beside the title. The slots are placed by grid
 * area, so this story writes the aside first and it still lands on the right.
 */
export const WithStatus: Story = {
  render: (args) => (
    <PageHeader {...args}>
      <PageHeaderAside>
        <StatusPill tone="ok" dot={true}>
          Monitoring active
        </StatusPill>
      </PageHeaderAside>
      <PageHeaderTitle>Watched identities</PageHeaderTitle>
    </PageHeader>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const title = canvas.getByRole("heading", { name: "Watched identities" });
    const status = canvas.getByText("Monitoring active");
    await expect(status.getBoundingClientRect().left).toBeGreaterThan(title.getBoundingClientRect().left);
  },
};

/**
 * On a phone the aside keeps its width and wraps beneath the lede, rather
 * than squeezing the title to one word a line.
 */
export const Narrow: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => (
    <div style={{ maxWidth: 360 }}>
      <PageHeader {...args}>
        <PageHeaderTitle>Watched identities</PageHeaderTitle>
        <PageHeaderAside>
          <StatusPill tone="ok" dot={true}>
            Monitoring active
          </StatusPill>
        </PageHeaderAside>
      </PageHeader>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const title = canvas.getByRole("heading", { name: "Watched identities" });
    const status = canvas.getByText("Monitoring active");
    await expect(status.getBoundingClientRect().top).toBeGreaterThan(title.getBoundingClientRect().bottom);
  },
};

/**
 * The display tier the brand pages use: 34px up to 56, measured to 16ch,
 * over an 18px lede. It carries no bottom margin, because the stack
 * around it owns a brand page's rhythm.
 */
export const Brand: Story = {
  args: {
    eyebrow: "Brand essence",
    lede: "Every answer is grounded in a temporal knowledge graph, every claim is tied to its source, and every source has a timestamp.",
    tier: "brand",
  },
  render: (args) => (
    <PageHeader {...args}>
      <PageHeaderTitle>Provable AI for regulated decisions.</PageHeaderTitle>
    </PageHeader>
  ),
};

/**
 * A title with the page's one marked place in it. The title is a slot so a
 * `Highlight` can sit inside it; the heading's accessible name is still the
 * whole sentence.
 */
export const WithHighlight: Story = {
  args: {
    eyebrow: "Coverage",
    lede: "Two quarters of growth, every entry traced to a source already on record.",
    tier: "brand",
  },
  render: (args) => (
    <PageHeader {...args}>
      <PageHeaderTitle>
        Coverage rose to <Highlight variant="figure">94 %</Highlight> —{" "}
        <Highlight>without a new source</Highlight>.
      </PageHeaderTitle>
    </PageHeader>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const title = canvas.getByRole("heading", { level: 1, name: "Coverage rose to 94 % — without a new source." });
    await expect(within(title).getByText("without a new source").tagName).toBe("MARK");
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
        lede="Every claim is tied to its source, and every source has a timestamp."
      >
        <PageHeaderTitle>Provable AI for regulated decisions.</PageHeaderTitle>
      </PageHeader>
      <PageHeader
        tier="console"
        eyebrow="Watchlist"
        lede="Manage the people, companies, domains, and email addresses under automatic watch."
      >
        <PageHeaderTitle>Watched identities</PageHeaderTitle>
      </PageHeader>
    </div>
  ),
};

/**
 * A detail page: breadcrumbs back to the list instead of an eyebrow, the
 * record’s state under its name, its key facts, and its primary actions.
 */
export const Detail: Story = {
  args: { eyebrow: "", lede: "" },
  render: (args) => (
    <PageHeader {...args}>
      <PageHeaderCrumbs>
        <Breadcrumb label="Breadcrumb" items={[{ label: "Sign-in", href: "#" }, { label: "Head office" }]} />
      </PageHeaderCrumbs>
      <PageHeaderTitle>Head office</PageHeaderTitle>
      <PageHeaderStatus>
        <StatusPill tone="ok">Active</StatusPill>
        <StatusPill tone="neutral" dot={false}>
          SAML 2.0
        </StatusPill>
      </PageHeaderStatus>
      <PageHeaderFacts>
        <FactList layout="inline">
          <Fact label="Domains">2 verified</Fact>
          <Fact label="Members">38</Fact>
          <Fact label="Created">3 Mar 2026</Fact>
        </FactList>
      </PageHeaderFacts>
      <PageHeaderAside>
        <Button variant="secondary">Test sign-in</Button>
      </PageHeaderAside>
    </PageHeader>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { level: 1, name: "Head office" })).toBeVisible();
    await expect(canvas.getByRole("navigation", { name: "Breadcrumb" })).toBeVisible();
  },
};
