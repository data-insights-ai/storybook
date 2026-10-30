import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { PageHeader, PageHeaderTitle } from "../../layout/page/PageHeader";
import { Figure } from "../../figures/Figure";
import { FigureRow } from "../../figures/FigureRow";
import { AppShellContent } from "./AppShellContent";

const meta = {
  title: "Shell/AppShellContent",
  tags: ["layer:block"],
  component: AppShellContent,
  parameters: { layout: "fullscreen" },
  args: { width: "full", children: null },
  argTypes: {
    width: { control: "inline-radio", options: ["full", "contained"] },
    children: { control: false },
  },
} satisfies Meta<typeof AppShellContent>;

export default meta;
type Story = StoryObj<typeof meta>;

function Overview() {
  return (
    <>
      <PageHeader lede="What the workspace measured this week.">
        <PageHeaderTitle>Overview</PageHeaderTitle>
      </PageHeader>
      <FigureRow label="This week">
        <Figure label="Sources" value="24" />
        <Figure label="Entries sealed" value="4,182" />
        <Figure label="Open cases" value="3" />
      </FigureRow>
    </>
  );
}

/**
 * `full`, the default: the page follows the window, and its blocks sit 24px
 * apart without a margin of their own. A table or a
 * dashboard uses every column it is given.
 */
export const Full: Story = {
  render: (args) => (
    <AppShellContent {...args}>
      <Overview />
    </AppShellContent>
  ),
  play: async ({ canvasElement }) => {
    const main = within(canvasElement).getByRole("main");
    await expect(main).toHaveAttribute("id", "di-content");
    await expect(getComputedStyle(main).rowGap).toBe("24px");
  },
};

/** `contained`: the page stops widening at 1440px, for a product that wants a fixed measure. */
export const Contained: Story = {
  args: { width: "contained" },
  render: (args) => (
    <AppShellContent {...args}>
      <Overview />
    </AppShellContent>
  ),
  play: async ({ canvasElement }) => {
    await expect(getComputedStyle(within(canvasElement).getByRole("main")).maxWidth).toBe("1440px");
  },
};
