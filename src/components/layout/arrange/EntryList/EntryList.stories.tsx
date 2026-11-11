import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { StatusPill } from "../../../status/StatusPill";
import { Tag } from "../../../status/Tag";
import { TextLink } from "../../../text/TextLink";
import { Entry, EntryDetail, EntryEnd, EntryList } from "./EntryList";
import { onPanel } from "../../../../../.storybook/onPanel";

const meta = {
  title: "Layout/Arrange/EntryList",
  component: EntryList,
  tags: ["layer:block", "autodocs"],
  args: { label: "Affected products", children: null },
  argTypes: { children: { control: false } },
  decorators: [onPanel("Affected products")],
  render: (args) => (
    <EntryList {...args}>
      <Entry>
        Edge gateway
        <EntryEnd mono>4.0 → 4.2.0</EntryEnd>
      </Entry>
      <Entry>
        Edge gateway appliance
        <EntryEnd mono>before 2026-10</EntryEnd>
      </Entry>
      <Entry>
        Management console
        <EntryEnd>Not affected</EntryEnd>
      </Entry>
    </EntryList>
  ),
} satisfies Meta<typeof EntryList>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Each entry on its ruled line, what qualifies it at the end. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const list = within(canvasElement).getByRole("list", { name: "Affected products" });
    const items = within(list).getAllByRole("listitem");
    await expect(items).toHaveLength(3);
    const lead = items[0].querySelector(".di-entry-lead")!.getBoundingClientRect();
    const end = items[0].querySelector(".di-entry-end")!.getBoundingClientRect();
    await expect(Math.abs(lead.top - end.top)).toBeLessThan(8);
  },
};

/** A link leads, a detail with its marks runs under it. */
export const WithDetail: Story = {
  args: { label: "Pages it cites" },
  render: (args) => (
    <EntryList {...args}>
      <Entry>
        <TextLink href="#">Security advisory for the edge gateway</TextLink>
        <EntryEnd>vendor.example.com</EntryEnd>
        <EntryDetail>
          <Tag>Patch</Tag>
          <Tag>Vendor advisory</Tag>
        </EntryDetail>
      </Entry>
      <Entry>
        <TextLink href="#">Known exploited vulnerabilities</TextLink>
        <EntryEnd>cisa.gov</EntryEnd>
        <EntryDetail>
          <StatusPill tone="danger">Exploited</StatusPill>
        </EntryDetail>
      </Entry>
    </EntryList>
  ),
  play: async ({ canvasElement }) => {
    const item = within(canvasElement).getAllByRole("listitem")[0];
    const lead = item.querySelector(".di-entry-lead")!.getBoundingClientRect();
    const detail = item.querySelector(".di-entry-detail")!.getBoundingClientRect();
    await expect(detail.top).toBeGreaterThanOrEqual(lead.bottom - 1);
  },
};

/** On a phone an end that does not fit drops under its lead. */
export const Phone: Story = {
  parameters: { viewport: { value: "phone" } },
  render: (args) => (
    <EntryList {...args}>
      <Entry>
        Edge gateway appliance for branch offices
        <EntryEnd mono>3f2a9c1e0b7d → 9b0c4d2e7f11</EntryEnd>
      </Entry>
    </EntryList>
  ),
  play: async ({ canvasElement }) => {
    const item = within(canvasElement).getByRole("listitem");
    await expect(item.scrollWidth).toBeLessThanOrEqual(item.clientWidth + 1);
  },
};
