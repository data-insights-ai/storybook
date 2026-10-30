import { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { PageHeader, PageHeaderTitle } from "../../layout/page/PageHeader";
import { Panel } from "../../layout/page/Panel";
import { TabPanel, Tabs } from "./Tabs";

const meta = {
  title: "Navigation/Tabs",
  component: Tabs,
  tags: ["layer:block", "autodocs"],
  args: {
    label: "Entry views",
    value: "record",
    items: [
      { value: "record", label: "Record" },
      { value: "sources", label: "Sources", badge: "12" },
      { value: "seals", label: "Seals", badge: "4" },
      { value: "log", label: "Log" },
      { value: "export", label: "Export", disabled: true },
    ],
    onChange: fn(),
  },
  argTypes: {
    label: { control: "text" },
    value: { control: "text" },
    items: { control: false },
  },
  render: function Render(args) {
    // The strip is controlled, so the story holds the state the caller
    // would. `value` stays an arg, so the Controls field keeps working.
    const [value, setValue] = useState(args.value);
    useEffect(() => setValue(args.value), [args.value]);
    return (
      <div>
        <Tabs
          {...args}
          value={value}
          onChange={(next) => {
            setValue(next);
            args.onChange(next);
          }}
        />
        <TabPanel value={value} idPrefix={args.idPrefix}>
          <p className="di-quiet">The {value} view of entry 03.</p>
        </TabPanel>
      </div>
    );
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A record's views under its header: the strip switches the panel below it and nothing else on the page. */
export const OnARecord: Story = {
  parameters: { controls: { disable: true } },
  render: function Render() {
    const [value, setValue] = useState("record");
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--di-space-24)" }}>
        <PageHeader eyebrow="Entry 03">
          <PageHeaderTitle>feed.example.io</PageHeaderTitle>
        </PageHeader>
        <div>
          <Tabs
            label="Entry views"
            value={value}
            onChange={setValue}
            items={[
              { value: "record", label: "Record" },
              { value: "sources", label: "Sources", badge: "12" },
              { value: "log", label: "Log" },
            ]}
          />
          <TabPanel value={value}>
            <Panel heading={2} title={value === "record" ? "Record" : value === "sources" ? "Sources" : "Log"}>
              <p>
                {value === "record"
                  ? "Received 09:12:04Z from feed.example.io, sealed at 09:12:06Z."
                  : value === "sources"
                    ? "Twelve sources cite this entry; the newest arrived an hour ago."
                    : "Three changes since it was received, the last by Nora Feld."}
              </p>
            </Panel>
          </TabPanel>
        </div>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("tab", { name: /Sources/ }));
    await expect(canvas.getByRole("heading", { name: "Sources" })).toBeVisible();
  },
};

/**
 * Long labels on a phone: the strip scrolls on its own, never the page, and
 * the selected tab is scrolled into view; the edge that hides tabs fades.
 */
export const LongLabelsOnAPhone: Story = {
  globals: { viewport: { value: "phone", isRotated: false } },
  args: {
    label: "Ansichten des Eintrags",
    value: "retention",
    items: [
      { value: "record", label: "Eintrag" },
      { value: "notifications", label: "Benachrichtigungen", badge: "12" },
      { value: "sources", label: "Quellenverzeichnis" },
      { value: "retention", label: "Aufbewahrungsrichtlinien" },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const strip = canvas.getByRole("tablist").getBoundingClientRect();
    const selected = canvas.getByRole("tab", { name: "Aufbewahrungsrichtlinien" }).getBoundingClientRect();
    await expect(selected.left).toBeGreaterThanOrEqual(strip.left - 1);
    await expect(selected.right).toBeLessThanOrEqual(strip.right + 1);
    await expect(canvasElement.ownerDocument.documentElement.scrollWidth).toBeLessThanOrEqual(window.innerWidth);
    const list = canvas.getByRole("tablist");
    await expect(list.scrollWidth).toBeGreaterThan(list.clientWidth);
    await waitFor(() => expect(list).toHaveClass("is-more-start"));
    await expect(getComputedStyle(list).maskImage).toContain("gradient");
    list.scrollLeft = 0;
    await waitFor(() => expect(list).toHaveClass("is-more-end"));
    await expect(list).not.toHaveClass("is-more-start");
  },
};

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("tab", { name: "Record" })).toHaveAttribute("aria-selected", "true");
  },
};

/** Choosing a view. The strip reports it; the caller decides what shows. */
export const Selecting: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("tab", { name: /Sources/ }));
    await expect(args.onChange).toHaveBeenCalledWith("sources");
    await expect(canvas.getByRole("tab", { name: /Sources/ })).toHaveAttribute("aria-selected", "true");
  },
};

/** The strip holds one tab stop; the arrows move within it. */
export const KeyboardMovement: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const first = canvas.getByRole("tab", { name: "Record" });
    first.focus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(canvas.getByRole("tab", { name: /Sources/ })).toHaveFocus();
  },
};

export const WithoutBadges: Story = {
  args: {
    items: [
      { value: "record", label: "Record" },
      { value: "sources", label: "Sources" },
      { value: "log", label: "Log" },
    ],
  },
};

/** A view that is not available on this record, and says so. */
export const WithDisabled: Story = {
  args: { value: "log" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("tab", { name: "Export" })).toBeDisabled();
  },
};

/** Two tabs: the shortest strip worth drawing. */
export const Pair: Story = {
  args: {
    items: [
      { value: "record", label: "Record" },
      { value: "log", label: "Log" },
    ],
  },
};

/** Separate records can reuse values without duplicating document IDs. */
export const MultipleStrips: Story = {
  render: function Render(args) {
    const [first, setFirst] = useState("record");
    const [second, setSecond] = useState("record");
    return (
      <div>
        <Tabs {...args} idPrefix="first" label="First record" value={first} onChange={setFirst} />
        <TabPanel idPrefix="first" value={first}>
          First record view
        </TabPanel>
        <Tabs {...args} idPrefix="second" label="Second record" value={second} onChange={setSecond} />
        <TabPanel idPrefix="second" value={second}>
          Second record view
        </TabPanel>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const strips = canvas.getAllByRole("tablist");
    const second = within(strips[1]);
    second.getByRole("tab", { name: "Record" }).focus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(second.getByRole("tab", { name: /Sources/ })).toHaveFocus();
    await expect(within(strips[0]).getByRole("tab", { name: "Record" })).toHaveAttribute("aria-selected", "true");
    const ids = Array.from(canvasElement.querySelectorAll("[id]"), (node) => node.id);
    await expect(new Set(ids).size).toBe(ids.length);
    for (const panel of canvas.getAllByRole("tabpanel")) {
      const tab = canvasElement.ownerDocument.getElementById(panel.getAttribute("aria-labelledby")!);
      await expect(tab).toHaveAttribute("aria-controls", panel.id);
    }
  },
};

export const UnusualValues: Story = {
  args: {
    idPrefix: 'scope " : /',
    items: [
      { value: "record", label: "Record" },
      { value: 'a" ] # : /\ud800', label: "Other view" },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    canvas.getByRole("tab", { name: "Record" }).focus();
    await userEvent.keyboard("{ArrowRight}");
    const target = canvas.getByRole("tab", { name: "Other view" });
    await expect(target).toHaveFocus();
    await expect(target).toHaveAttribute("aria-controls", canvas.getByRole("tabpanel").id);
    await userEvent.keyboard("{ArrowLeft}");
    await expect(canvas.getByRole("tab", { name: "Record" })).toHaveFocus();
  },
};

/** A stale controlled selection must not make all available tabs unreachable. */
export const MissingSelection: Story = {
  args: { value: "removed" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const first = canvas.getByRole("tab", { name: "Record" });
    await expect(first).toHaveAttribute("tabindex", "0");
    first.focus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(canvas.getByRole("tab", { name: /Sources/ })).toHaveFocus();
    await expect(canvas.getByRole("tab", { name: /Sources/ })).toHaveAttribute("aria-selected", "true");
  },
};

export const AllDisabled: Story = {
  args: { items: [{ value: "record", label: "Record", disabled: true }] },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("tab", { name: "Record" })).toBeDisabled();
    for (const key of ["ArrowRight", "ArrowLeft", "Home", "End"]) {
      canvas.getByRole("tablist").dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true }));
    }
    await expect(args.onChange).not.toHaveBeenCalled();
  },
};

export const Empty: Story = {
  args: { items: [] },
  render: (args) => <Tabs {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryAllByRole("tab")).toHaveLength(0);
    canvas.getByRole("tablist").dispatchEvent(new KeyboardEvent("keydown", { key: "End", bubbles: true }));
  },
};
