import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor, within } from "storybook/test";
import { SkeletonPage } from "./SkeletonPage";

const meta = {
  title: "Primitives/Waiting/SkeletonPage",
  component: SkeletonPage,
  tags: ["layer:primitive", "autodocs"],
  args: { variant: "list", label: "Loading the page", rows: 6, heading: true, delay: 150 },
  argTypes: {
    variant: { control: "inline-radio", options: ["list", "detail", "form"] },
    label: { control: "text" },
    rows: { control: { type: "number" } },
    heading: { control: "boolean" },
    delay: { control: { type: "number" } },
  },
} satisfies Meta<typeof SkeletonPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A register on its way: header, toolbar, the grid with its rules drawn. */
export const List: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(canvas.getAllByRole("status")[0]).toHaveAttribute("data-shown", "true"));
  },
};

/** One record: its facts, then a section of prose. */
export const Detail: Story = {
  args: { variant: "detail" },
};

/** A form: labelled fields and the action that commits them. */
export const Form: Story = {
  args: { variant: "form" },
};

/** A tab of a page: the layout above already shows the header. */
export const InsideLayout: Story = {
  args: { variant: "form", heading: false },
};
