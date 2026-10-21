import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Button } from "./Button";
import { Fact, FactList } from "./FactList";
import { PageHeader, PageHeaderAside, PageHeaderTitle } from "./Heading";
import { DetailSection } from "./DetailSection";
import { Page } from "./Page";

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
