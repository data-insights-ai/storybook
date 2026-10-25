import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Button } from "./Button";
import { Fact, FactList } from "./FactList";
import { PageHeader, PageHeaderAside, PageHeaderTitle } from "./Heading";
import { DetailSection } from "./DetailSection";
import { Page, PageAside } from "./Page";

const meta = {
  title: "Patterns/Layout/Page",
  component: Page,
  tags: ["autodocs"],
  args: { width: "detail", children: null },
  argTypes: {
    width: { control: "radio", options: ["list", "detail", "form"] },
    children: { control: false },
  },
} satisfies Meta<typeof Page>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A header, then sections in the section rhythm; the width follows what the page holds. */
export const Detail: Story = {
  render: (args) => (
    <Page {...args}>
      <PageHeader lede="Who it is, what it holds, and what can be changed.">
        <PageHeaderTitle>Northwind Survey</PageHeaderTitle>
        <PageHeaderAside>
          <Button variant="secondary">Open sign-in settings</Button>
        </PageHeaderAside>
      </PageHeader>
      <DetailSection title="General">
        <FactList layout="columns">
          <Fact label="Kind">Customer</Fact>
          <Fact label="Created">3 Mar 2026</Fact>
        </FactList>
      </DetailSection>
      <DetailSection title="Contacts">
        <FactList layout="columns">
          <Fact label="Billing">nora.feld@data-insights.ai</Fact>
        </FactList>
      </DetailSection>
    </Page>
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("heading", { level: 1 })).toHaveTextContent("Northwind Survey");
  },
};

/**
 * A record with what accompanies it. From 1920px the aside stands beside the
 * sections (choose the 1920, 2560 or ultrawide viewport); narrower, it
 * follows them.
 */
export const WithAside: Story = {
  parameters: { layout: "fullscreen" },
  render: (args) => (
    <Page {...args}>
      <PageHeader lede="What happened, and who works on it.">
        <PageHeaderTitle>Suspicious sign-in on a finance laptop</PageHeaderTitle>
      </PageHeader>
      <DetailSection title="Story">
        <FactList layout="columns">
          <Fact label="Opened">25 Oct 2026, 06:08</Fact>
          <Fact label="Signals">1,043</Fact>
        </FactList>
      </DetailSection>
      <DetailSection title="Findings">
        <FactList layout="columns">
          <Fact label="Credential access">high</Fact>
        </FactList>
      </DetailSection>
      <PageAside label="Triage">
        <DetailSection title="Triage">
          <FactList layout="columns">
            <Fact label="Assignee">Nora Feld</Fact>
            <Fact label="Status">In progress</Fact>
          </FactList>
        </DetailSection>
      </PageAside>
    </Page>
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("complementary", { name: "Triage" })).toBeVisible();
  },
};
