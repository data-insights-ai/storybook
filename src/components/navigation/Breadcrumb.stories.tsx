import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Breadcrumb } from "./Breadcrumb";

const meta = {
  title: "Primitives/Breadcrumb",
  component: Breadcrumb,
  tags: ["autodocs"],
  args: {
    label: "Breadcrumb",
    items: [
      { label: "WS-01", href: "#ws" },
      { label: "sources", href: "#sources" },
      { label: "feed.example.io" },
    ],
  },
  argTypes: {
    label: { control: "text" },
    items: { control: false },
  },
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("feed.example.io")).toHaveAttribute("aria-current", "page");
  },
};

/** One level: the breadcrumb is still the answer to "where am I". */
export const Root: Story = {
  args: { items: [{ label: "WS-01" }] },
};

/** It truncates with one ellipsis segment, not with every ancestor. */
export const Truncated: Story = {
  args: {
    items: [
      { label: "WS-01", href: "#ws" },
      { label: "…", href: "#up" },
      { label: "sources", href: "#sources" },
      { label: "feed.example.io" },
    ],
  },
};

/** Without links, where the trail states a position but does not navigate. */
export const Static: Story = {
  args: {
    items: [{ label: "WS-01" }, { label: "sources" }, { label: "feed.example.io" }],
  },
};
