import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { TextLink } from "../../TextLink";
import { SourceEntry, SourceList } from "./SourceList";
import { onPanel } from "../../../../../.storybook/onPanel";

const meta = {
  title: "Text/Blocks/SourceList",
  component: SourceList,
  tags: ["layer:block", "autodocs"],
  args: { children: null },
  argTypes: { children: { control: false } },
  decorators: [onPanel("Sources")],
  render: () => (
    <SourceList>
      <SourceEntry n={1} id="source-1">
        <span>CISA</span>
        <TextLink href="https://www.cisa.gov/news-events/alerts/example-widget">
          https://www.cisa.gov/news-events/alerts/example-widget
        </TextLink>
      </SourceEntry>
      <SourceEntry n={2} id="source-2">
        <TextLink plain href="#">
          CVE-2026-1234
        </TextLink>
        <span>CVE record</span>
      </SourceEntry>
    </SourceList>
  ),
} satisfies Meta<typeof SourceList>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Each source by its number, in the order first cited. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const items = within(canvasElement).getAllByRole("listitem");
    await expect(items).toHaveLength(2);
    await expect(items[0]).toHaveAttribute("id", "source-1");
  },
};

/** On a phone a long address wraps inside its entry. */
export const Phone: Story = {
  parameters: { viewport: { value: "phone" } },
};
