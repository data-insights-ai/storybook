import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { PageHeader, PageHeaderTitle } from "../../layout/page/PageHeader";
import { Page } from "../../layout/page/Page";
import { Panel } from "../../layout/page/Panel";
import { Stack } from "../../layout/arrange/Stack";
import { Eyebrow } from "./Eyebrow";

const meta = {
  title: "Text/Eyebrow",
  component: Eyebrow,
  tags: ["layer:primitive", "autodocs"],
  args: { children: "Coverage", variant: "plain" },
  argTypes: {
    children: { control: "text" },
    variant: { control: "radio", options: ["sealed", "plain"] },
    tone: { control: "radio", options: ["default", "quiet", "danger"] },
  },
} satisfies Meta<typeof Eyebrow>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Over a section of a page: `PageHeader level={2}` renders the plain
 * eyebrow from its `eyebrow` string, a step above the h2.
 */
export const OverASection: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Page width="full">
      <PageHeader level={2} eyebrow="Coverage" lede="Sources that delivered at least one event in the last 24 hours.">
        <PageHeaderTitle>Sources reporting</PageHeaderTitle>
      </PageHeader>
    </Page>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const heading = canvas.getByRole("heading", { level: 2, name: "Sources reporting" });
    const eyebrow = canvas.getByText("Coverage");
    await expect(eyebrow.getBoundingClientRect().bottom).toBeLessThan(heading.getBoundingClientRect().top);
    await expect(eyebrow.getBoundingClientRect().left).toBe(heading.getBoundingClientRect().left);
  },
};

/** In a `Panel`, the `label` is the eyebrow in the quiet ink, so it never competes with the title under it. */
export const InAPanel: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Panel label="Last 7 days" title="Signals by source" heading={2}>
      <p style={{ margin: 0 }}>Microsoft Defender sent 1,064 signals, 39 of them from hosts in the finance network.</p>
    </Panel>
  ),
};

/**
 * `sealed` adds the seal and a rule to the edge: the one section on record in
 * a view, such as the sign-in card. A page that set it over every section
 * would claim a seal per heading, so every other section is `plain`.
 */
export const Sealed: Story = {
  args: { children: "Entry on record", variant: "sealed" },
  render: (args) => (
    <Page width="full">
      <Stack gap={32}>
        <div>
          <Eyebrow {...args} />
          <PageHeader level={2}>
            <PageHeaderTitle>Licence DI-2026-0148</PageHeaderTitle>
          </PageHeader>
        </div>
        <PageHeader level={2} eyebrow="Seats">
          <PageHeaderTitle>8 of 10 seats in use</PageHeaderTitle>
        </PageHeader>
      </Stack>
    </Page>
  ),
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelectorAll(".di-eyebrow-sealed")).toHaveLength(1);
    await expect(canvasElement.querySelector(".di-eyebrow-rule")).toBeVisible();
  },
};

/** `danger` names a failure over its title, as an empty state after an error does. */
export const Danger: Story = {
  args: { children: "Delivery failed", tone: "danger" },
  render: (args) => (
    <Page width="full">
      <div>
        <Eyebrow {...args} />
        <PageHeader level={2} lede="The SIEM endpoint refused 12 events since 09:40. They are kept and sent again.">
          <PageHeaderTitle>Splunk HEC export paused</PageHeaderTitle>
        </PageHeader>
      </div>
    </Page>
  ),
};

/** A long German caption wraps between words in a phone column and keeps its distance to the title. */
export const German: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Page width="full">
      <div lang="de">
        <PageHeader
          level={2}
          eyebrow="Abdeckung der Datenquellen und Weiterleitungen"
          lede="Quellen, die in den letzten 24 Stunden mindestens ein Ereignis geliefert haben."
        >
          <PageHeaderTitle>Meldende Datenquellen</PageHeaderTitle>
        </PageHeader>
      </div>
    </Page>
  ),
  play: async ({ canvasElement }) => {
    const label = canvasElement.querySelector(".di-eyebrow-label")!;
    const root = canvasElement.getBoundingClientRect();
    await expect(label.getBoundingClientRect().right).toBeLessThanOrEqual(root.right + 1);
  },
};
