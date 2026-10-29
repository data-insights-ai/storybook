import { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { TabPanel, Tabs } from "./Tabs";

const meta = {
  title: "Blocks/Tabs",
  component: Tabs,
  tags: ["layer:block", "autodocs"],
  args: {
    label: "Entry views",
    value: "record",
    items: [
      { value: "record", label: "Record" },
      { value: "sources", label: "Sources", badge: "12" },
      { value: "seals", label: "Seals", badge: "04" },
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

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("tab", { name: "Record" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  },
};

/** Choosing a view. The strip reports it; the caller decides what shows. */
export const Selecting: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("tab", { name: /Sources/ }));
    await expect(args.onChange).toHaveBeenCalledWith("sources");
    await expect(canvas.getByRole("tab", { name: /Sources/ })).toHaveAttribute(
      "aria-selected",
      "true",
    );
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
    return <div>
      <Tabs {...args} idPrefix="first" label="First record" value={first} onChange={setFirst} />
      <TabPanel idPrefix="first" value={first}>First record view</TabPanel>
      <Tabs {...args} idPrefix="second" label="Second record" value={second} onChange={setSecond} />
      <TabPanel idPrefix="second" value={second}>Second record view</TabPanel>
    </div>;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const strips = canvas.getAllByRole("tablist");
    const second = within(strips[1]);
    second.getByRole("tab", { name: "Record" }).focus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(second.getByRole("tab", { name: /Sources/ })).toHaveFocus();
    await expect(within(strips[0]).getByRole("tab", { name: "Record" })).toHaveAttribute("aria-selected", "true");
    const ids = Array.from(canvasElement.querySelectorAll("[id]"), node => node.id);
    await expect(new Set(ids).size).toBe(ids.length);
    for (const panel of canvas.getAllByRole("tabpanel")) {
      const tab = canvasElement.ownerDocument.getElementById(panel.getAttribute("aria-labelledby")!);
      await expect(tab).toHaveAttribute("aria-controls", panel.id);
    }
  },
};

export const UnusualValues: Story = {
  args: { idPrefix: 'scope " : /', items: [{ value: "record", label: "Record" }, { value: 'a" ] # : /\ud800', label: "Other view" }] },
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
