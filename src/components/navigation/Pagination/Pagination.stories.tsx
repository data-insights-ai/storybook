import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { DataTable, TableBody, TableCell, TableColumn, TableFooter, TableHead, TableRow } from "../../tables/DataTable";
import { Panel, PanelActions, PanelFooter } from "../../layout/page/Panel";
import { Pagination } from "./Pagination";

const meta = {
  title: "Navigation/Pagination",
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

/* The text edges of a table: where its first column's text starts and its last column's text ends. */
function textEdges(table: HTMLTableElement) {
  const cells = table.tBodies[0].rows[0].cells;
  const first = cells[0];
  const last = cells[cells.length - 1];
  return {
    start: first.getBoundingClientRect().left + parseFloat(getComputedStyle(first).paddingLeft),
    end: last.getBoundingClientRect().right - parseFloat(getComputedStyle(last).paddingRight),
  };
}

/**
 * Under a table, at the end of its panel: what the page shows is counted at
 * the footer's start, on the table's text edge, and the pages sit at its
 * end, the Next chevron on the last column's text edge. The register is 40
 * pages long, so the middle folds into ellipses.
 */
export const UnderATable: Story = {
  args: { page: 40, pages: 40 },
  render: function Render(args) {
    const [page, setPage] = useState(args.page);
    const first = (page - 1) * 3 + 1;
    return (
      <Panel title="Register" padded={false}>
        <DataTable caption="Register entries" indexed={false}>
          <TableHead>
            <TableColumn>Entry</TableColumn>
            <TableColumn>Source</TableColumn>
          </TableHead>
          <TableBody>
            {[0, 1, 2].map((n) => (
              <TableRow key={n}>
                <TableCell mono>{`REG-${String(first + n).padStart(4, "0")}`}</TableCell>
                <TableCell>feed.example.io</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </DataTable>
        <PanelFooter>
          {first}–{first + 2} of {args.pages * 3} entries
        </PanelFooter>
        <PanelActions>
          <Pagination {...args} page={page} onPageChange={setPage} />
        </PanelActions>
      </Panel>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const nav = canvas.getByRole("navigation", { name: "Register pages" });
    await expect(nav.querySelectorAll(".di-page-num, .di-page-gap")).toHaveLength(7);
    await expect(canvas.getByRole("button", { name: "Page 40" })).toHaveAttribute("aria-current", "page");
    const edges = textEdges(canvas.getByRole<HTMLTableElement>("table", { name: "Register entries" }));
    const count = document.createRange();
    count.selectNodeContents(canvas.getByText(/of 120 entries/));
    const chevrons = nav.querySelectorAll("svg");
    await expect(Math.abs(count.getBoundingClientRect().left - edges.start)).toBeLessThanOrEqual(1);
    await expect(Math.abs(chevrons[chevrons.length - 1].getBoundingClientRect().right - edges.end)).toBeLessThanOrEqual(
      1,
    );
  },
};

/**
 * In a `DataTable`'s own footer the rule is the same: the count at the
 * start, the pages at the end, both on the table's text edges.
 */
export const InATableFooter: Story = {
  args: { page: 2, pages: 5 },
  render: function Render(args) {
    const [page, setPage] = useState(args.page);
    return (
      <DataTable caption="Sources" indexed={false}>
        <TableHead>
          <TableColumn>Host</TableColumn>
          <TableColumn align="end">Entries</TableColumn>
        </TableHead>
        <TableBody>
          {["feed.example.io", "beta.example.dev"].map((host, i) => (
            <TableRow key={host}>
              <TableCell>{host}</TableCell>
              <TableCell align="end" mono>
                {(i + 1) * 1284}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <span>6–10 of 24 sources</span>
          <Pagination {...args} page={page} onPageChange={setPage} />
        </TableFooter>
      </DataTable>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const edges = textEdges(canvas.getByRole<HTMLTableElement>("table", { name: "Sources" }));
    const count = document.createRange();
    count.selectNodeContents(canvas.getByText("6–10 of 24 sources"));
    const chevrons = canvas.getByRole("navigation", { name: "Register pages" }).querySelectorAll("svg");
    await expect(Math.abs(count.getBoundingClientRect().left - edges.start)).toBeLessThanOrEqual(1);
    await expect(Math.abs(chevrons[chevrons.length - 1].getBoundingClientRect().right - edges.end)).toBeLessThanOrEqual(
      1,
    );
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
