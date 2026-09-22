import { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { Pagination } from "./Pagination";

const meta = {
  title: "Components/Pagination",
  component: Pagination,
  tags: ["autodocs"],
  args: {
    page: 1,
    pages: 3,
    onPageChange: fn(),
    label: "Pages",
    previousLabel: "Previous page",
    nextLabel: "Next page",
  },
  render: function Pager(args) {
    const [page, setPage] = useState(args.page);
    useEffect(() => {
      setPage(args.page);
    }, [args.page]);
    return (
      <Pagination
        {...args}
        page={page}
        onPageChange={(next) => {
          args.onPageChange(next);
          setPage(next);
        }}
      />
    );
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const First: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Next page" }));
    await expect(canvas.getByRole("navigation", { name: "Pages" })).toHaveTextContent("2");
  },
};
