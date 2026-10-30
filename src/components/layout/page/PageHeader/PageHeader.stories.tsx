import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Breadcrumb } from "../../../navigation/Breadcrumb";
import { Button } from "../../../actions/Button";
import { Fact, FactList } from "../../../records/FactList";
import {
  PageHeader,
  PageHeaderAside,
  PageHeaderCrumbs,
  PageHeaderFacts,
  PageHeaderMeta,
  PageHeaderStatus,
  PageHeaderTitle,
} from "./PageHeader";
import { Highlight } from "../../../text/Highlight";
import { StatusPill } from "../../../status/StatusPill";

const meta = {
  title: "Layout/Page/PageHeader",
  component: PageHeader,
  tags: ["layer:block", "autodocs"],
  args: {
    eyebrow: "Watchlist",
    lede: "Manage the people, companies, domains, and email addresses under automatic watch.",
    tier: "console",
    children: null,
  },
  argTypes: {
    level: { control: "radio", options: [1, 2] },
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

/** The space from an eyebrow to the title under it: the one eyebrow gap, in every head. */
async function expectEyebrowGap(eyebrow: Element) {
  const probe = document.createElement("div");
  probe.style.width = "var(--di-gap-8)";
  eyebrow.parentElement!.append(probe);
  const gap = probe.getBoundingClientRect().width;
  probe.remove();
  const next = eyebrow.nextElementSibling!.getBoundingClientRect().top - eyebrow.getBoundingClientRect().bottom;
  await expect(Math.abs(next - gap)).toBeLessThan(1);
}

/**
 * An overview's header only orients: the name, its state beside it, and as
 * of when at the right. The slots are placed by grid area, so this story
 * writes the meta first and it still lands on the right.
 */
export const Orientation: Story = {
  globals: { viewport: { value: "desk", isRotated: false } },
  args: { eyebrow: undefined, lede: undefined },
  render: (args) => (
    <PageHeader {...args}>
      <PageHeaderMeta>As of 12 Oct, 10:00 · 14 sources · updates live</PageHeaderMeta>
      <PageHeaderTitle>Production</PageHeaderTitle>
      <PageHeaderStatus>
        <StatusPill tone="danger" dot={true}>
          Needs attention
        </StatusPill>
      </PageHeaderStatus>
    </PageHeader>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const title = canvas.getByRole("heading", { level: 1, name: "Production" }).getBoundingClientRect();
    const status = canvas.getByText("Needs attention").getBoundingClientRect();
    const meta = canvas.getByText("updates live").getBoundingClientRect();
    await expect(status.left).toBeGreaterThan(title.right);
    await expect(Math.abs(status.top + status.height / 2 - (title.top + title.height / 2))).toBeLessThan(6);
    await expect(meta.left).toBeGreaterThan(status.right);
  },
};

/** A list page keeps its one primary action at the right; the meta moves under the name. */
export const WithAction: Story = {
  globals: { viewport: { value: "desk", isRotated: false } },
  args: { eyebrow: undefined, lede: undefined },
  render: (args) => (
    <PageHeader {...args}>
      <PageHeaderTitle>Watched identities</PageHeaderTitle>
      <PageHeaderMeta>214 identities · 3 added today</PageHeaderMeta>
      <PageHeaderAside>
        <Button shortcut="n">Add identity</Button>
      </PageHeaderAside>
    </PageHeader>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const title = canvas.getByRole("heading", { name: "Watched identities" }).getBoundingClientRect();
    const meta = canvas.getByText("214 identities").getBoundingClientRect();
    const action = canvas.getByRole("button", { name: /Add identity/ }).getBoundingClientRect();
    await expect(meta.top).toBeGreaterThan(title.bottom - 1);
    await expect(action.left).toBeGreaterThan(title.right);
  },
};

/**
 * On a phone the header is one column: the name, its state, the meta under
 * it, the action at full width, rather than a title squeezed to one word a
 * line.
 */
export const Narrow: Story = {
  parameters: { controls: { disable: true } },
  args: { eyebrow: undefined, lede: undefined },
  render: (args) => (
    <div style={{ maxWidth: 358 }}>
      <PageHeader {...args}>
        <PageHeaderTitle>Watched identities</PageHeaderTitle>
        <PageHeaderStatus>
          <StatusPill tone="ok" dot={true}>
            Monitoring active
          </StatusPill>
        </PageHeaderStatus>
        <PageHeaderMeta>As of 12 Oct, 10:00 · 214 identities</PageHeaderMeta>
        <PageHeaderAside>
          <Button>Add identity</Button>
        </PageHeaderAside>
      </PageHeader>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const title = canvas.getByRole("heading", { name: "Watched identities" }).getBoundingClientRect();
    const status = canvas.getByText("Monitoring active").getBoundingClientRect();
    const meta = canvas.getByText("214 identities").getBoundingClientRect();
    const action = canvas.getByRole("button", { name: "Add identity" }).getBoundingClientRect();
    await expect(status.top).toBeGreaterThan(title.bottom - 1);
    await expect(meta.top).toBeGreaterThan(status.bottom - 1);
    await expect(action.width).toBeGreaterThan(300);
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
        Coverage rose to <Highlight variant="figure">94 %</Highlight> — <Highlight>without a new source</Highlight>.
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

/**
 * `level={2}` heads a section of a screen: an h2 at 20px over a 13px lede,
 * with what the section reports at the right — a state and a count go in
 * as they are, not as a string.
 */
export const Section: Story = {
  args: { level: 2, eyebrow: undefined, lede: "Where alerts go when a source stops or a rule fires." },
  render: (args) => (
    <PageHeader {...args}>
      <PageHeaderTitle>Notification channels</PageHeaderTitle>
      <PageHeaderStatus>
        <StatusPill tone="ok">synced</StatusPill>
      </PageHeaderStatus>
      <PageHeaderMeta>4 channels · 1 paused</PageHeaderMeta>
    </PageHeader>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { level: 2, name: "Notification channels" })).toBeVisible();
    await expect(canvas.queryByRole("banner")).toBeNull();
  },
};

/**
 * A brand page's section head: the display band measured to 22ch, the
 * plain eyebrow that repeats down the page, and at most one marked passage
 * per page.
 */
export const SectionOnABrandPage: Story = {
  args: {
    level: 2,
    tier: "brand",
    eyebrow: "Colour",
    lede: "No accent colour acts. Body text is navy; the one filled control on a sheet is navy.",
  },
  render: (args) => (
    <PageHeader {...args}>
      <PageHeaderTitle>
        Navy is the ink <Highlight>and the action</Highlight>.
      </PageHeaderTitle>
    </PageHeader>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const heading = canvas.getByRole("heading", { level: 2, name: "Navy is the ink and the action." });
    await expect(within(heading).getByText("and the action").tagName).toBe("MARK");
  },
};

/** The smallest header: the page name alone, with the eyebrow and lede the meta sets. */
export const TitleOnly: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { level: 1, name: "Watched identities" })).toBeVisible();
    const eyebrow = canvasElement.querySelector(".di-eyebrow");
    if (eyebrow) await expectEyebrowGap(eyebrow);
  },
};
