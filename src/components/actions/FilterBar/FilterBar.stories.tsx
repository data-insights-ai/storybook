import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { Page } from "../../layout/page/Page";
import { Select } from "../../forms/select/Select";
import { Button } from "../Button";
import { SearchField } from "../../forms/text/SearchField";
import { TextField } from "../../forms/text/TextField";
import { FilterBar, FilterBarEnd, FilterBarItem, FilterBarSheet } from "./FilterBar";
import { CaseFilterBar } from "./FilterBar.sample";

const meta = {
  title: "Actions/FilterBar",
  component: FilterBar,
  tags: ["layer:block", "autodocs"],
  args: {
    label: "Filter cases",
    filtersLabel: "Filters",
    countLabel: (n: number) => `${n} set`,
    closeLabel: "Close",
    doneLabel: "Done",
    clearLabel: "Clear all",
    count: 0,
    role: "search",
    sheet: "complete",
    children: null,
  },
  argTypes: { children: { control: false }, countLabel: { control: false } },
} satisfies Meta<typeof FilterBar>;

export default meta;
type Story = StoryObj<typeof meta>;

const inBar = (bar: HTMLElement) =>
  Array.from(bar.querySelectorAll<HTMLElement>(":scope > [data-filter-item]")).map((cell) => cell.dataset.filterItem);

const order = ["search", "severity", "owner", "view"];

const settle = () => new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done)));

/** Wide enough for everything: the items in the order written, the trigger for the sheet's own field, the end. */
export const AboveAList: Story = {
  globals: { viewport: { value: "desk" } },
  render: () => (
    <Page>
      <CaseFilterBar />
    </Page>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const bar = canvas.getByRole("search", { name: "Filter cases" });
    await waitFor(() => expect(inBar(bar)).toEqual(order));
    await userEvent.click(canvas.getByRole("button", { name: "Filters" }));
    const sheet = within(await within(document.body).findByRole("dialog", { name: "Filters" }));
    // Complete: every item is in the sheet as well, with its label shown, then the sheet's own field.
    await expect(sheet.getByLabelText("Severity")).toBeVisible();
    await expect(sheet.getByLabelText("Owner")).toBeVisible();
    await expect(sheet.getByRole("group", { name: "Show" })).toBeVisible();
    // Live: the field applies as it is typed, Done only closes, clear clears.
    await userEvent.type(sheet.getByLabelText("Tag"), "phishing");
    await userEvent.selectOptions(sheet.getByLabelText("Severity"), "high");
    await expect(within(bar).getByLabelText("Severity")).toHaveValue("high");
    await userEvent.click(sheet.getByRole("button", { name: "Done" }));
    await waitFor(() => expect(canvas.getByRole("button", { name: "Filters, 1 set" })).toHaveFocus());
    await userEvent.click(canvas.getByRole("button", { name: "Filters, 1 set" }));
    const again = within(await within(document.body).findByRole("dialog", { name: "Filters" }));
    await expect(again.getByLabelText("Tag")).toHaveValue("phishing");
    await userEvent.click(again.getByRole("button", { name: "Clear all" }));
    await expect(again.getByLabelText("Tag")).toHaveValue("");
    await expect(within(bar).getByLabelText("Severity")).toHaveValue("");
    await userEvent.keyboard("{Escape}");
  },
};

/**
 * The bar narrows: items fold from the last written, one row throughout, the
 * rest keep their order, and a filter set inline stays set and is counted on
 * the trigger once it folds.
 */
export const Folding: Story = {
  globals: { viewport: { value: "desk" } },
  render: () => (
    <Page>
      <div data-testid="frame">
        <CaseFilterBar initial={{ q: "", severity: "", owner: "", view: "open", tag: "" }} />
      </div>
    </Page>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const frame = canvas.getByTestId("frame");
    const bar = canvas.getByRole("search", { name: "Filter cases" });
    await waitFor(() => expect(inBar(bar)).toEqual(order));
    const row = bar.getBoundingClientRect().height;
    const seen: string[][] = [];
    for (const width of [900, 760, 640, 560, 500, 420]) {
      frame.style.width = `${width}px`;
      await settle();
      await expect(bar.scrollWidth).toBeLessThanOrEqual(bar.clientWidth + 1);
      const shown = inBar(bar) as string[];
      seen.push(shown);
      await expect(bar.getBoundingClientRect().height).toBe(row);
      await expect(shown).toEqual(order.filter((name) => shown.includes(name)));
    }
    for (let i = 1; i < seen.length; i++) await expect(seen[i - 1].slice(0, seen[i].length)).toEqual(seen[i]);
    await expect(seen.at(-1)).toEqual(["search"]);
    // The quick view was set inline; folded, it is counted and still chosen in the sheet.
    const trigger = canvas.getByRole("button", { name: "Filters, 1 set" });
    await userEvent.click(trigger);
    const sheet = within(await within(document.body).findByRole("dialog", { name: "Filters" }));
    await expect(sheet.getByRole("radio", { name: "Open" })).toBeChecked();
    await userEvent.keyboard("{Escape}");
    frame.style.width = "";
    await waitFor(() => expect(inBar(bar)).toEqual(order));
  },
};

/** When the focused control folds, focus moves to the trigger rather than to the page. */
export const FocusWhenFolding: Story = {
  globals: { viewport: { value: "desk" } },
  render: () => (
    <Page>
      <div data-testid="frame">
        <CaseFilterBar />
      </div>
    </Page>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const frame = canvas.getByTestId("frame");
    const bar = canvas.getByRole("search", { name: "Filter cases" });
    await waitFor(() => expect(inBar(bar)).toEqual(order));
    canvas.getByRole("radio", { name: "All" }).focus();
    frame.style.width = "600px";
    await waitFor(() => expect(inBar(bar)).not.toContain("view"));
    await waitFor(() => expect(canvas.getByRole("button", { name: "Filters" })).toHaveFocus());
  },
};

/** On a phone only the search, the trigger and the end stay; the sheet holds every filter. */
export const OnAPhone: Story = {
  globals: { viewport: { value: "phone" } },
  render: () => (
    <Page>
      <CaseFilterBar />
    </Page>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const bar = canvas.getByRole("search", { name: "Filter cases" });
    if (window.innerWidth > 600) return;
    await waitFor(() => expect(inBar(bar)).toEqual(["search"]));
    await userEvent.click(canvas.getByRole("button", { name: "Filters" }));
    const sheet = within(await within(document.body).findByRole("dialog", { name: "Filters" }));
    await expect(sheet.getByLabelText("Severity")).toBeVisible();
    await expect(sheet.getByLabelText("Tag")).toBeVisible();
  },
};

/** `overflow` keeps the sheet to what has folded and to its own fields; with neither, no trigger shows. */
export const OverflowOnly: Story = {
  globals: { viewport: { value: "desk" } },
  args: { sheet: "overflow" },
  render: (args) => (
    <Page>
      <FilterBar {...args}>
        <FilterBarItem name="period">
          {(place) => (
            <Select id={place === "sheet" ? "period-sheet" : "period"} label="Period" hideLabel={place === "bar"}>
              <option>Last 7 days</option>
            </Select>
          )}
        </FilterBarItem>
        <FilterBarEnd>
          <Button variant="secondary">Export</Button>
        </FilterBarEnd>
      </FilterBar>
    </Page>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    if (window.innerWidth <= 600) return;
    await expect(canvas.queryByRole("button", { name: "Filters" })).toBeNull();
    await expect(canvas.getByLabelText("Period")).toBeVisible();
  },
};

/** Fields only the sheet holds (`FilterBarSheet`) keep the trigger in the bar; their count is `count`. */
export const SheetFields: Story = {
  globals: { viewport: { value: "desk" } },
  args: { sheet: "overflow", count: 1 },
  render: (args) => (
    <Page>
      <FilterBar {...args}>
        <FilterBarItem name="search" keep grow>
          {(place) => <SearchField id={place === "sheet" ? "tag-search-sheet" : "tag-search"} label="Search" />}
        </FilterBarItem>
        <FilterBarSheet>
          <TextField id="tag-field" label="Tag" defaultValue="phishing" />
        </FilterBarSheet>
      </FilterBar>
    </Page>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Filters, 1 set" }));
    const sheet = within(await within(document.body).findByRole("dialog", { name: "Filters" }));
    await expect(sheet.getByLabelText("Tag")).toHaveValue("phishing");
    await expect(sheet.queryByLabelText("Search")).toBeNull();
  },
};

/** With no fields of its own the trigger goes once everything is back, and focus moves to the control that returned. */
export const FocusWhenReturning: Story = {
  globals: { viewport: { value: "desk" } },
  args: { sheet: "overflow" },
  render: (args) => (
    <Page>
      <div data-testid="frame">
        <FilterBar {...args}>
          <FilterBarItem name="search" keep grow>
            {(place) => <SearchField id={place === "sheet" ? "back-search-sheet" : "back-search"} label="Search" />}
          </FilterBarItem>
          <FilterBarItem name="period">
            {(place) => (
              <Select
                id={place === "sheet" ? "back-period-sheet" : "back-period"}
                label="Period"
                hideLabel={place === "bar"}
              >
                <option>Last 7 days</option>
              </Select>
            )}
          </FilterBarItem>
        </FilterBar>
      </div>
    </Page>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    if (window.innerWidth <= 600) return;
    const frame = canvas.getByTestId("frame");
    frame.style.width = "400px";
    const trigger = await canvas.findByRole("button", { name: "Filters" });
    trigger.focus();
    frame.style.width = "";
    await waitFor(() => expect(canvas.getByLabelText("Period")).toHaveFocus());
    await expect(canvas.queryByRole("button", { name: "Filters" })).toBeNull();
    // The trigger goes while the sheet is open: closing it returns focus to the bar's first control.
    frame.style.width = "400px";
    await userEvent.click(await canvas.findByRole("button", { name: "Filters" }));
    const sheet = within(await within(document.body).findByRole("dialog", { name: "Filters" }));
    frame.style.width = "";
    await waitFor(() => expect(canvas.queryByRole("button", { name: "Filters" })).toBeNull());
    await userEvent.click(sheet.getByRole("button", { name: "Close" }));
    await waitFor(() => expect(canvas.getByLabelText("Search")).toHaveFocus());
  },
};
