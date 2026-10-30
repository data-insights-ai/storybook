import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { PageHeader, PageHeaderTitle } from "../../layout/page/PageHeader";
import { Highlight } from "./Highlight";

const meta = {
  title: "Text/Highlight",
  component: Highlight,
  tags: ["layer:primitive", "autodocs"],
  args: { variant: "passage", children: "without a new source" },
  argTypes: {
    variant: { control: "radio", options: ["passage", "figure"] },
    children: { control: "text" },
  },
} satisfies Meta<typeof Highlight>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A passage: the poppy tint under the words a page is about, here in a
 * brand page's title. The tint follows each line when the title wraps and
 * stops short of the line above.
 */
export const Passage: Story = {
  render: (args) => (
    <PageHeader tier="brand">
      <PageHeaderTitle>
        Coverage rose <Highlight {...args} />
      </PageHeaderTitle>
    </PageHeader>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const mark = canvas.getByText("without a new source");
    await expect(mark.tagName).toBe("MARK");
    await expect(canvasElement.querySelectorAll("mark")).toHaveLength(1);
  },
};

/** A key figure in a sentence, in poppy ink with no tint, so the figure carries alone. */
export const Figure: Story = {
  args: { variant: "figure", children: "94%" },
  render: (args) => (
    <p style={{ margin: 0, maxWidth: "var(--di-measure-prose)", fontSize: "var(--di-font-size-600)" }}>
      Coverage rose to <Highlight {...args} /> this week, the highest since the workspace was set up.
    </p>
  ),
};

/** German runs longer: the tint still sits under each line of the wrapped passage. */
export const German: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div lang="de">
      <PageHeader tier="brand">
        <PageHeaderTitle>
          Die Abdeckung stieg <Highlight>ohne eine einzige neue Datenquelle</Highlight>
        </PageHeaderTitle>
      </PageHeader>
    </div>
  ),
};
