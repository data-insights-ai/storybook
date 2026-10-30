import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { DataTable, TableBody, TableCell, TableColumn, TableHead, TableRow } from "../../../data/table/DataTable";
import { Panel, PanelFooter } from "../../../layout/page/Panel";
import { Pagination } from "./Pagination";

const meta = {
  title: "Navigation/Sequence/Pagination",
  component: Pagination,
  tags: ["layer:primitive", "autodocs"],
  args: {
    page: 1,
    pages: 5,
    numbered: true,
    label: "Register pages",
    previousLabel: "Previous page",
    nextLabel: "Next page",
    pageLabel: "Page",
    onPageChange: fn(),
  },
  argTypes: {
    page: { control: { type: "number", min: 1 } },
    pages: { control: { type: "number", min: 1 } },
    numbered: { control: "boolean" },
    label: { control: "text" },
    previousLabel: { control: "text" },
    nextLabel: { control: "text" },
    pageLabel: { control: "text" },
  },
  render: function Render(args) {
    const [page, setPage] = useState(args.page);
    return (
      <Pagination
        {...args}
        page={page}
        onPageChange={(next) => {
          setPage(next);
          args.onPageChange(next);
        }}
      />
    );
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Under the table it pages, at the end of the panel: the register is 40 pages long, so the middle folds into ellipses. */
export const UnderATable: Story = {
  args: { page: 12, pages: 40 },
  render: function Render(args) {
    const [page, setPage] = useState(args.page);
    return (
      <Panel title="Register" padded={false}>
        <DataTable caption="Register entries">
          <TableHead>
            <TableColumn>Entry</TableColumn>
            <TableColumn>Source</TableColumn>
          </TableHead>
          <TableBody>
            {[1, 2, 3].map((n) => (
              <TableRow key={n}>
                <TableCell mono>{`REG-${String((page - 1) * 3 + n).padStart(4, "0")}`}</TableCell>
                <TableCell>feed.example.io</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </DataTable>
        <PanelFooter>
          <Pagination {...args} page={page} onPageChange={setPage} />
        </PanelFooter>
      </Panel>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const nav = canvas.getByRole("navigation", { name: "Register pages" });
    await expect(nav.querySelectorAll(".di-page-num, .di-page-gap")).toHaveLength(7);
    await expect(canvas.getByRole("button", { name: "Page 12" })).toHaveAttribute("aria-current", "page");
    await userEvent.click(canvas.getByRole("button", { name: "Page 40" }));
    await expect(canvas.getByRole("button", { name: "Page 40" })).toHaveAttribute("aria-current", "page");
    await expect(canvas.getByRole("button", { name: "Page 36" })).toBeVisible();
  },
};

/** On the first page, Previous is unavailable. */
export const FirstPage: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("button", { name: "Previous page" })).toBeDisabled();
  },
};

export const MiddlePage: Story = {
  args: { page: 3 },
};

/** On the last page, Next is unavailable. */
export const LastPage: Story = {
  args: { page: 5 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("button", { name: "Next page" })).toBeDisabled();
  },
};

/**
 * Turning a page. The control is controlled: next reports the page it
 * wants and the caller is what moves the register on.
 */
export const Turning: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Next page" }));
    await expect(args.onPageChange).toHaveBeenCalledWith(2);
    await expect(canvas.getByRole("button", { name: "Previous page" })).toBeEnabled();
  },
};

/** Arrows only, for a footer with no room for the numbers. */
export const ArrowsOnly: Story = {
  args: { numbered: false, page: 2 },
};

/** One page: both arrows are unavailable and the control still reads. */
export const SinglePage: Story = {
  args: { pages: 1 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("button", { name: "Previous page" })).toBeDisabled();
    await expect(canvas.getByRole("button", { name: "Next page" })).toBeDisabled();
  },
};
